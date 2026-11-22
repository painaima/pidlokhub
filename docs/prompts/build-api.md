# Prompt: สร้าง API และย้ายต้นแบบขึ้น Cloudflare

คัดลอกข้อความในกรอบด้านล่างไปใช้เป็นคำสั่งเริ่มงานใน session ใหม่ได้ทันที

---

```text
เป้าหมาย: ทำให้ต้นแบบ Pidlok Hub ใน prototype/ ใช้ทดลองจริงบน Cloudflare
มีล็อกอินแบบง่าย ยังไม่ต้องมีระบบสิทธิ์ แพ็กเกจ หรือการชำระเงิน
deploy ตรงขึ้น production ไม่มี staging

## สภาพปัจจุบัน
- prototype/app.js เก็บข้อมูลร้านทั้งหมดเป็น JSON ก้อนเดียว {draft, published}
  ใน localStorage และแปลงรูปที่อัปโหลดเป็น base64 (FileReader / toDataURL)
- prototype/build.py รวมทุกอย่างเป็น บ้านก๋ง-prototype.html สำหรับเปิดออฟไลน์
  ต้องให้ไฟล์นี้ยังใช้งานได้ในโหมดเดโม (ไม่มี API ก็ใช้ localStorage แบบเดิม)
- รายละเอียดสินค้าและดีไซน์อยู่ใน HANDOFF.md

## Stack (ตั้งค่าและ deploy ไว้แล้ว ดู wrangler.toml)
- Cloudflare **Worker** ชื่อ pidlokhub (ไม่ใช้ Pages: proxy ของ cloud session
  เขียนทับ JWT ของ Pages/Workers static-assets upload จึงฝังไฟล์หน้าเว็บไว้ใน Worker)
  - scripts/build-static.mjs ฝังทุกไฟล์ใน public/ ลง src/_static.js (รันอัตโนมัติก่อน deploy)
  - src/index.js เป็น entry: route /api/* และเสิร์ฟไฟล์ static
  - ห้ามใช้ [assets] ใน wrangler.toml
- D1 pidlok-db (binding DB), R2 pidlok-media (binding MEDIA) — มีอยู่แล้ว ว่างเปล่า
- โดเมน pidlokhub.com และ www.pidlokhub.com ผูกกับ Worker แล้ว
- Cloudflare Access app "pidlokhub admin" ครอบ /admin และ /api/admin แล้ว
  ACCESS_TEAM_DOMAIN และ ACCESS_AUD อยู่ใน [vars] ของ wrangler.toml แล้ว
- deploy: CLOUDFLARE_API_TOKEN=proxy-injected CLOUDFLARE_ACCOUNT_ID=dfe492b19d7b5684b6ec24c0b3d473a4 npm run deploy
  (proxy ใส่ token จริงให้) — deploy ตรง production ทุกครั้ง
- ไม่ใช้ framework ฝั่งหน้าเว็บ คง HTML/CSS/JS แบบเดิม; Worker เขียนเป็น JS ล้วน

## โครงไฟล์
- มีแล้ว: package.json, wrangler.toml, scripts/build-static.mjs, src/index.js
  (มี /api/health ตรวจ D1), public/ (สำเนาของ prototype/)
- ต้องเพิ่ม: migrations/0001_init.sql, แยก route/handler ใน src/ (เช่น src/api/*.js),
  src/auth.js ตรวจ Access JWT

## ฐานข้อมูล (D1)
CREATE TABLE shops (
  slug TEXT PRIMARY KEY,            -- a-z0-9- ใช้ใน URL /:slug
  owner_email TEXT NOT NULL UNIQUE, -- หนึ่งอีเมลหนึ่งร้านในช่วงทดลอง
  draft TEXT NOT NULL,              -- JSON ฉบับร่าง
  published TEXT,                   -- JSON ฉบับเผยแพร่ (NULL = ยังไม่เผยแพร่)
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  published_at TEXT
);
seed ร้านตัวอย่าง slug = "baankong" จากข้อมูลตัวอย่างใน app.js

## API
สาธารณะ
- GET  /api/shop/:slug         → JSON published (404 ถ้าไม่มีหรือยังไม่เผยแพร่)
- GET  /media/:key             → ส่งไฟล์จาก R2 พร้อม Cache-Control ยาว

ต้องล็อกอิน (ผ่าน Access แล้ว; ระบุตัวตนจากอีเมลใน JWT)
- GET  /api/admin/me           → { email, shop: {slug, draft, published_at} | null }
- POST /api/admin/shop         → สร้างร้านใหม่ {slug} ใช้ข้อมูลตั้งต้นจากร้านตัวอย่าง
                                  409 ถ้า slug ซ้ำหรืออีเมลนี้มีร้านแล้ว
- PUT  /api/admin/shop         → บันทึก draft (body = JSON draft ทั้งก้อน, จำกัด ~1MB)
- POST /api/admin/publish      → คัดลอก draft ไป published
- POST /api/admin/upload       → รับรูป (multipart, ≤5MB, jpeg/png/webp)
                                  เก็บ R2 key = <slug>/<uuid>.<ext> คืน { url: "/media/..." }

กติกา
- ตรวจ header Cf-Access-Jwt-Assertion ทุกครั้ง: verify ลายเซ็นกับ
  https://<team>.cloudflareaccess.com/cdn-cgi/access/certs และตรวจ aud
  (ตั้งค่า ACCESS_TEAM_DOMAIN และ ACCESS_AUD เป็น vars ใน wrangler.toml)
  อย่าเชื่อแค่ header อีเมลอย่างเดียว
- ร้านที่แก้ได้คือร้านที่ owner_email ตรงกับอีเมลใน JWT เท่านั้น
- ตอบ JSON ที่มี error message ภาษาไทยอ่านเข้าใจได้
- slug ที่สงวนไว้: admin, api, media, assets

## หน้าเว็บ
- /:slug  → หน้าร้านสาธารณะ โหลดจาก /api/shop/:slug แสดงเฉพาะโหมดหน้าร้าน (ซ่อนปุ่มจัดการ)
- /admin  → CMS เดิม โหลด/บันทึกผ่าน /api/admin/*
  - ยังไม่มีร้าน → ฟอร์มตั้งชื่อร้านและ slug
  - autosave ร่าง (debounce ~1.5 วินาที) พร้อมสถานะ "บันทึกแล้ว / กำลังบันทึก / บันทึกไม่สำเร็จ"
  - ปุ่มเผยแพร่เรียก /api/admin/publish แล้วแสดงลิงก์ pidlokhub.com/<slug>
  - อัปโหลด Avatar/รูปสินค้า → /api/admin/upload แล้วเก็บ URL แทน base64
  - ลิงก์ออกจากระบบ: /cdn-cgi/access/logout
- / → หน้าแนะนำสั้นๆ พร้อมลิงก์ไป /baankong และ /admin
- routing ทำใน src/index.js: /admin → CMS, /:slug → หน้าร้าน

## เสร็จเมื่อ
- npm run dev ใช้งานได้ในเครื่อง (จำลอง Access ด้วย env DEV_USER_EMAIL เฉพาะ dev)
- npm run db:migrate รันบน D1 จริงแล้ว และ npm run deploy แล้ว
- เปิด /baankong บนมือถือได้ แก้ใน /admin แล้วเผยแพร่ เห็นผลบนหน้าร้าน
- python3 prototype/build.py ยังสร้างไฟล์เดโมออฟไลน์ได้
- อัปเดต README.md: วิธี dev, deploy, เพิ่มอีเมลผู้ทดลองใน Access
- commit และ push บน branch ที่กำหนด
```

---

## สถานะการตั้งค่า (22 พ.ย. 2026)

| รายการ | สถานะ |
|---|---|
| Cloud environment `pidlokhub` + Cloudflare API token (หมดอายุ 22 ธ.ค. 2026) | พร้อม |
| Worker `pidlokhub` + D1 `pidlok-db` + R2 `pidlok-media` | deploy แล้ว, `/api/health` ตอบ `{"ok":true,"db":true}` |
| pidlokhub.com, www.pidlokhub.com | ผูกกับ Worker แล้ว |
| Access app ครอบ `/admin`, `/api/admin` | สร้างแล้ว แต่ยังไม่มี policy (ยังไม่มีใครเข้าได้) |
| One-time PIN login ใน Zero Trust | ต้องเปิดใน Dashboard (token ไม่มีสิทธิ์ Identity Providers) |
| รายชื่ออีเมลผู้ทดลอง → Access policy | รอรายชื่อ |
