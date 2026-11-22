import STATIC from './_static.js';

const decoded = new Map();
function staticResponse(path) {
  const file = STATIC[path];
  if (!file) return null;
  if (!decoded.has(path)) decoded.set(path, Uint8Array.from(atob(file.body), c => c.charCodeAt(0)));
  const cache = path.endsWith('.html') ? 'no-cache' : 'public, max-age=3600';
  return new Response(decoded.get(path), { headers: { 'content-type': file.type, 'cache-control': cache } });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/api/health') {
      const db = await env.DB.prepare('SELECT 1 AS ok').first();
      return Response.json({ ok: true, db: db?.ok === 1 });
    }
    const path = url.pathname.endsWith('/') ? url.pathname + 'index.html' : url.pathname;
    return staticResponse(path) || staticResponse('/index.html');
  },
};
