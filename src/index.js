import STATIC from './_static.js';
import { currentUser } from './auth.js';

const RESERVED = new Set(['admin', 'api', 'media', 'assets', 'cdn-cgi', 'www', 'app', 'login', 'logout', 'static', 'styles', 'favicon']);
const SLUG = /^[a-z0-9](?:[a-z0-9-]{1,28}[a-z0-9])$/;
const MAX_DRAFT_BYTES = 1024 * 1024;
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const MAX_BRANDS_PER_OWNER = 20;
const IMAGE_TYPES = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };

class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

const json = (data, status = 200, headers = {}) =>
  Response.json(data, { status, headers: { 'cache-control': 'no-store', ...headers } });

// ---------- static files ----------
const decoded = new Map();
function staticBody(path) {
  const file = STATIC[path];
  if (!file) return null;
  if (!decoded.has(path)) decoded.set(path, Uint8Array.from(atob(file.body), c => c.charCodeAt(0)));
  return { body: decoded.get(path), type: file.type };
}
function staticText(path) { return new TextDecoder().decode(staticBody(path).body); }
function staticResponse(path) {
  if (path.endsWith('.html') || path.endsWith('.py')) return null;
  const file = staticBody(path);
  if (!file) return null;
  return new Response(file.body, { headers: { 'content-type': file.type, 'cache-control': 'public, max-age=300' } });
}

// ---------- HTML pages ----------
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const scriptJSON = value => JSON.stringify(value).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');

function html(body, status = 200, extraHeaders = {}) {
  return new Response(body, {
    status,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      'cache-control': 'no-store',
      'x-content-type-options': 'nosniff',
      'referrer-policy': 'strict-origin-when-cross-origin',
      ...extraHeaders,
    },
  });
}

function appPage(boot, { title, description = '', image = '', origin, path, noindex = false }) {
  let page = staticText('/index.html');
  const meta = [
    '<base href="/">',
    `<meta name="description" content="${escapeHTML(description)}">`,
    `<meta property="og:title" content="${escapeHTML(title)}">`,
    `<meta property="og:description" content="${escapeHTML(description)}">`,
    `<meta property="og:url" content="${escapeHTML(origin + path)}">`,
    image ? `<meta property="og:image" content="${escapeHTML(new URL(image, origin + '/').href)}">` : '',
    noindex ? '<meta name="robots" content="noindex">' : '',
  ].join('\n  ');
  page = page.replace('<meta charset="utf-8">', `<meta charset="utf-8">\n  ${meta}`);
  if (boot.mode === 'public') page = page.replace('<body>', '<body class="public-mode">');
  page = page.replace(/<title>[^<]*<\/title>/, `<title>${escapeHTML(title)}</title>`);
  page = page.replace('<script src="app.js"></script>', `<script>window.PIDLOK_BOOT=${scriptJSON(boot)};</script>\n  <script src="/app.js"></script>`);
  return page;
}

function simplePage(title, inner, status = 200) {
  return html(`<!doctype html><html lang="th"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="icon" href="/assets/favicon.svg" type="image/svg+xml"><title>${escapeHTML(title)}</title><link rel="stylesheet" href="/styles.css"><style>
  .simple{max-width:560px;margin:0 auto;padding:72px 16px;text-align:center}
  .simple h1{font-size:30px;letter-spacing:-.8px;margin:22px 0 10px}
  .simple p{color:var(--muted);font-size:14px;line-height:1.8}
  .simple .actions{display:flex;gap:10px;justify-content:center;margin-top:26px;flex-wrap:wrap}
  .simple .brand{justify-content:center}
  </style></head><body><main class="simple"><a class="brand" href="/" aria-label="Pidlok Hub"><span class="brand-mark">p<span>h</span></span><span>pidlok<span class="brand-light">hub</span></span></a>${inner}</main></body></html>`, status);
}

const homePage = () => simplePage('Pidlok Hub — หน้าร้านออนไลน์ในลิงก์เดียว', `
  <h1>หน้าร้านออนไลน์<br>ในลิงก์เดียว</h1>
  <p>รวมข้อมูลร้าน ช่องทางติดต่อ แผนที่ และสินค้า<br>ไว้ที่ pidlokhub.com/ชื่อร้าน ออกแบบมาเพื่อมือถือ</p>
  <div class="actions"><a class="btn primary" href="/admin">เข้าสู่ระบบเพื่อจัดการร้าน</a></div>
  <p style="margin-top:28px;font-size:12px">ช่วงทดลองใช้งาน · เฉพาะผู้ได้รับเชิญ</p>`);

const notFoundPage = () => simplePage('ไม่พบหน้าร้าน — Pidlok Hub', `
  <h1>ไม่พบหน้าร้านนี้</h1>
  <p>ลิงก์อาจพิมพ์ผิด หรือร้านยังไม่ได้เผยแพร่</p>
  <div class="actions"><a class="btn" href="/">กลับหน้าแรก</a></div>`, 404);

const signInPage = () => simplePage('ต้องเข้าสู่ระบบ — Pidlok Hub', `
  <h1>ต้องเข้าสู่ระบบ</h1>
  <p>บัญชีนี้ยังไม่ได้รับสิทธิ์ หรือหมดเวลาเข้าสู่ระบบ</p>
  <div class="actions"><a class="btn primary" href="/admin">ลองอีกครั้ง</a><a class="btn" href="/cdn-cgi/access/logout">ออกจากระบบ</a></div>`, 401);

// ---------- data helpers ----------
const parseJSON = text => { try { return text ? JSON.parse(text) : null; } catch { return null; } };

function avatarOf(state) {
  const src = state?.avatarImage;
  return typeof src === 'string' && /^\/media\//.test(src) ? src : '';
}

function brandSummary(row) {
  const draft = parseJSON(row.draft);
  return { slug: row.slug, name: row.name, updated_at: row.updated_at, published_at: row.published_at, avatar: avatarOf(draft), initials: String(draft?.profile?.initials || '').slice(0, 4) };
}

async function readDraft(request) {
  const text = await request.text();
  if (new TextEncoder().encode(text).length > MAX_DRAFT_BYTES) throw new HttpError(413, 'ข้อมูลร้านใหญ่เกินไป ลองลดจำนวนรูปหรือข้อความ');
  const draft = parseJSON(text);
  if (!draft || typeof draft !== 'object' || draft.version !== 1 || !Array.isArray(draft.sections) || !Array.isArray(draft.products) || typeof draft.profile !== 'object') {
    throw new HttpError(400, 'รูปแบบข้อมูลร้านไม่ถูกต้อง');
  }
  return { draft, text: JSON.stringify(draft) };
}

const nameFrom = (draft, fallback) => String(draft?.profile?.name || fallback || '').trim().slice(0, 80) || fallback;

async function ownedBrand(env, slug, email) {
  const row = await env.DB.prepare('SELECT * FROM brands WHERE slug = ?').bind(slug).first();
  if (!row || row.owner_email !== email) throw new HttpError(404, 'ไม่พบแบรนด์นี้ในบัญชีของคุณ');
  return row;
}

async function requireUser(request, env) {
  const email = await currentUser(request, env);
  if (!email) throw new HttpError(401, 'ต้องเข้าสู่ระบบก่อน');
  return email;
}

// ---------- API ----------
async function handleAdminAPI(request, env, parts) {
  const email = await requireUser(request, env);
  const method = request.method;
  if (method !== 'GET') {
    // Reject cross-site writes (CSRF): browsers send Origin on POST/PUT/DELETE.
    const origin = request.headers.get('origin');
    if (origin && origin !== new URL(request.url).origin) throw new HttpError(403, 'Forbidden');
    if (request.headers.get('sec-fetch-site') === 'cross-site') throw new HttpError(403, 'Forbidden');
  }

  // /api/admin/brands
  if (parts.length === 0) {
    if (method === 'GET') {
      const { results } = await env.DB.prepare('SELECT slug, name, draft, updated_at, published_at FROM brands WHERE owner_email = ? ORDER BY updated_at DESC').bind(email).all();
      return json({ email, brands: results.map(brandSummary) });
    }
    if (method === 'POST') {
      const body = parseJSON(await request.text()) || {};
      const slug = String(body.slug || '').toLowerCase();
      const name = String(body.name || '').trim().slice(0, 80);
      const template = body.template === 'sample' ? 'sample' : 'blank';
      if (!name) throw new HttpError(400, 'ใส่ชื่อแบรนด์');
      if (!SLUG.test(slug)) throw new HttpError(400, 'ลิงก์ใช้ a–z ตัวเลข และขีดกลาง 3–30 ตัว');
      if (RESERVED.has(slug)) throw new HttpError(400, 'ชื่อลิงก์นี้สงวนไว้ ลองชื่ออื่น');
      const count = await env.DB.prepare('SELECT COUNT(*) AS n FROM brands WHERE owner_email = ?').bind(email).first('n');
      if (count >= MAX_BRANDS_PER_OWNER) throw new HttpError(400, `สร้างได้สูงสุด ${MAX_BRANDS_PER_OWNER} แบรนด์ในช่วงทดลอง`);
      const result = await env.DB.prepare('INSERT INTO brands (slug, owner_email, name, template) VALUES (?, ?, ?, ?) ON CONFLICT(slug) DO NOTHING').bind(slug, email, name, template).run();
      if (!result.meta.changes) throw new HttpError(409, 'ลิงก์นี้มีคนใช้แล้ว ลองชื่ออื่น');
      return json({ slug, name, template }, 201);
    }
    throw new HttpError(405, 'Method not allowed');
  }

  const slug = parts[0];
  if (!SLUG.test(slug)) throw new HttpError(404, 'ไม่พบแบรนด์นี้');
  const action = parts[1] || '';
  if (parts.length > 2) throw new HttpError(404, 'Not found');

  if (!action) {
    if (method === 'GET') {
      const row = await ownedBrand(env, slug, email);
      return json({ slug, name: row.name, template: row.template, draft: parseJSON(row.draft), published: parseJSON(row.published), published_at: row.published_at });
    }
    if (method === 'PUT') {
      await ownedBrand(env, slug, email);
      const { draft, text } = await readDraft(request);
      await env.DB.prepare("UPDATE brands SET draft = ?, name = ?, updated_at = datetime('now') WHERE slug = ? AND owner_email = ?")
        .bind(text, nameFrom(draft, slug), slug, email).run();
      return json({ ok: true });
    }
    if (method === 'DELETE') {
      await ownedBrand(env, slug, email);
      let cursor;
      do {
        const listed = await env.MEDIA.list({ prefix: `${slug}/`, cursor });
        if (listed.objects.length) await env.MEDIA.delete(listed.objects.map(o => o.key));
        cursor = listed.truncated ? listed.cursor : undefined;
      } while (cursor);
      await env.DB.prepare('DELETE FROM brands WHERE slug = ? AND owner_email = ?').bind(slug, email).run();
      return json({ ok: true });
    }
    throw new HttpError(405, 'Method not allowed');
  }

  if (action === 'publish' && method === 'POST') {
    await ownedBrand(env, slug, email);
    const { draft, text } = await readDraft(request);
    await env.DB.prepare("UPDATE brands SET draft = ?, published = ?, name = ?, updated_at = datetime('now'), published_at = datetime('now') WHERE slug = ? AND owner_email = ?")
      .bind(text, text, nameFrom(draft, slug), slug, email).run();
    return json({ ok: true, url: `/${slug}` });
  }

  if (action === 'upload' && method === 'POST') {
    await ownedBrand(env, slug, email);
    const length = Number(request.headers.get('content-length') || 0);
    if (length > MAX_UPLOAD_BYTES + 64 * 1024) throw new HttpError(413, 'รูปใหญ่เกิน 5 MB');
    const form = await request.formData().catch(() => null);
    const file = form?.get('file');
    if (!file || typeof file === 'string') throw new HttpError(400, 'ไม่พบไฟล์รูป');
    const ext = IMAGE_TYPES[file.type];
    if (!ext) throw new HttpError(400, 'รองรับเฉพาะ JPG, PNG และ WebP');
    if (file.size > MAX_UPLOAD_BYTES) throw new HttpError(413, 'รูปใหญ่เกิน 5 MB');
    const key = `${slug}/${crypto.randomUUID()}.${ext}`;
    await env.MEDIA.put(key, file.stream(), { httpMetadata: { contentType: file.type, cacheControl: 'public, max-age=31536000, immutable' } });
    return json({ url: `/media/${key}` }, 201);
  }

  throw new HttpError(404, 'Not found');
}

async function handleAPI(request, env, path) {
  if (path === '/api/health') {
    const ok = await env.DB.prepare('SELECT 1 AS ok').first('ok');
    return json({ ok: true, db: ok === 1 });
  }
  const publicMatch = path.match(/^\/api\/brand\/([a-z0-9-]+)$/);
  if (publicMatch && request.method === 'GET') {
    const row = await env.DB.prepare('SELECT name, published, published_at FROM brands WHERE slug = ? AND published IS NOT NULL').bind(publicMatch[1]).first();
    if (!row) throw new HttpError(404, 'ไม่พบหน้าร้านนี้');
    return json({ slug: publicMatch[1], name: row.name, published: parseJSON(row.published), published_at: row.published_at }, 200, { 'cache-control': 'public, max-age=30' });
  }
  if (path === '/api/admin' || path.startsWith('/api/admin/')) {
    const parts = path.slice('/api/admin/'.length).split('/').filter(Boolean);
    if (parts[0] !== 'brands') throw new HttpError(404, 'Not found');
    return handleAdminAPI(request, env, parts.slice(1));
  }
  throw new HttpError(404, 'Not found');
}

// ---------- pages ----------
async function handleMedia(env, key) {
  if (!/^[a-z0-9-]+\/[a-z0-9-]+\.(jpg|png|webp)$/.test(key)) return notFoundPage();
  const object = await env.MEDIA.get(key);
  if (!object) return new Response('Not found', { status: 404 });
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('etag', object.httpEtag);
  headers.set('cache-control', 'public, max-age=31536000, immutable');
  headers.set('x-content-type-options', 'nosniff');
  return new Response(object.body, { headers });
}

async function adminBrandPage(request, env, slug, origin) {
  const email = await currentUser(request, env);
  if (!email) return signInPage();
  const row = await env.DB.prepare('SELECT * FROM brands WHERE slug = ?').bind(slug).first();
  if (!row || row.owner_email !== email) return notFoundPage();
  const boot = { mode: 'admin', slug, email, name: row.name, template: row.template, draft: parseJSON(row.draft), published: parseJSON(row.published) };
  return html(appPage(boot, { title: `จัดการ ${row.name} — Pidlok Hub`, origin, path: `/admin/${slug}`, noindex: true }));
}

async function publicBrandPage(env, slug, origin) {
  const row = await env.DB.prepare('SELECT name, published FROM brands WHERE slug = ? AND published IS NOT NULL').bind(slug).first();
  if (!row) return notFoundPage();
  const published = parseJSON(row.published);
  const profile = published?.profile || {};
  const description = [profile.location, profile.hours, (profile.bio || '').split('\n')[0]].filter(Boolean).join(' · ');
  const image = avatarOf(published) || published?.products?.find(p => p.images?.length)?.images[0] || '';
  const boot = { mode: 'public', slug, published };
  return html(appPage(boot, { title: `${profile.name || row.name} — Pidlok Hub`, description, image, origin, path: `/${slug}` }), 200, { 'cache-control': 'public, max-age=0, must-revalidate' });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    try {
      if (url.hostname === 'www.pidlokhub.com') {
        return Response.redirect(`https://pidlokhub.com${path}${url.search}`, 301);
      }
      if (path.startsWith('/api/')) return await handleAPI(request, env, path);
      if (request.method !== 'GET' && request.method !== 'HEAD') return new Response('Method not allowed', { status: 405 });
      if (path.startsWith('/media/')) return await handleMedia(env, path.slice('/media/'.length));

      const file = staticResponse(path);
      if (file) return file;

      if (path === '/') return homePage();
      if (path === '/admin' || path === '/admin/') {
        const email = await currentUser(request, env);
        if (!email) return signInPage();
        return html(staticText('/admin.html'));
      }
      const adminMatch = path.match(/^\/admin\/([a-z0-9-]+)\/?$/);
      if (adminMatch) return await adminBrandPage(request, env, adminMatch[1], url.origin);

      const slugMatch = path.match(/^\/([A-Za-z0-9-]+)\/?$/);
      if (slugMatch) {
        const slug = slugMatch[1].toLowerCase();
        if (slug !== slugMatch[1] || path.endsWith('/')) return Response.redirect(`${url.origin}/${slug}${url.search}`, 301);
        if (SLUG.test(slug) && !RESERVED.has(slug)) return await publicBrandPage(env, slug, url.origin);
      }
      return notFoundPage();
    } catch (error) {
      if (error instanceof HttpError) return json({ error: error.message }, error.status);
      console.error(error);
      return path.startsWith('/api/') ? json({ error: 'ระบบขัดข้อง ลองใหม่อีกครั้ง' }, 500) : simplePage('ระบบขัดข้อง — Pidlok Hub', '<h1>ระบบขัดข้อง</h1><p>ลองโหลดหน้าใหม่อีกครั้ง</p>', 500);
    }
  },
};
