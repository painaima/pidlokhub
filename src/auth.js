// Verifies the Cloudflare Access JWT and returns the signed-in email, or null.
// Access already blocks unauthenticated requests at the edge; this check makes sure
// requests that bypass it (or forge headers) are rejected by the Worker too.

let certCache = { keys: null, fetchedAt: 0 };

const b64urlToBytes = value => {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '=');
  return Uint8Array.from(atob(base64), c => c.charCodeAt(0));
};
const b64urlToJSON = value => JSON.parse(new TextDecoder().decode(b64urlToBytes(value)));

async function accessKeys(teamDomain, force = false) {
  if (!force && certCache.keys && Date.now() - certCache.fetchedAt < 60 * 60 * 1000) return certCache.keys;
  const res = await fetch(`https://${teamDomain}/cdn-cgi/access/certs`);
  if (!res.ok) throw new Error('Cannot load Access certificates');
  const { keys } = await res.json();
  certCache = { keys, fetchedAt: Date.now() };
  return keys;
}

function readToken(request) {
  const header = request.headers.get('cf-access-jwt-assertion');
  if (header) return header;
  const cookie = request.headers.get('cookie') || '';
  const match = cookie.match(/(?:^|;\s*)CF_Authorization=([^;]+)/);
  return match ? match[1] : null;
}

export async function currentUser(request, env) {
  const url = new URL(request.url);
  // Local development only: wrangler dev on localhost with DEV_USER_EMAIL in .dev.vars.
  if (env.DEV_USER_EMAIL && ['localhost', '127.0.0.1'].includes(url.hostname)) {
    return env.DEV_USER_EMAIL.toLowerCase();
  }
  if (!env.ACCESS_TEAM_DOMAIN || !env.ACCESS_AUD) return null;
  const token = readToken(request);
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    const header = b64urlToJSON(parts[0]);
    const payload = b64urlToJSON(parts[1]);
    if (header.alg !== 'RS256') return null;
    let jwk = (await accessKeys(env.ACCESS_TEAM_DOMAIN)).find(k => k.kid === header.kid);
    if (!jwk) jwk = (await accessKeys(env.ACCESS_TEAM_DOMAIN, true)).find(k => k.kid === header.kid);
    if (!jwk) return null;
    const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
    const valid = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, b64urlToBytes(parts[2]), new TextEncoder().encode(`${parts[0]}.${parts[1]}`));
    if (!valid) return null;
    const now = Math.floor(Date.now() / 1000);
    const audiences = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
    if (!audiences.includes(env.ACCESS_AUD)) return null;
    if (payload.iss !== `https://${env.ACCESS_TEAM_DOMAIN}`) return null;
    if (typeof payload.exp !== 'number' || payload.exp < now) return null;
    if (payload.nbf && payload.nbf > now + 60) return null;
    return typeof payload.email === 'string' ? payload.email.toLowerCase() : null;
  } catch {
    return null;
  }
}
