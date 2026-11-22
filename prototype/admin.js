'use strict';
const $ = (s, root = document) => root.querySelector(s);
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const RESERVED = ['admin','api','media','assets','cdn-cgi','www','app','login','logout','static','styles','favicon'];
let toastTimer;

function toast(message){const t=$('#toast');t.textContent=message;t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),2800);}

async function api(path, options = {}){
  let res;
  try{res=await fetch(path,{credentials:'same-origin',...options});}
  catch{throw new Error('เชื่อมต่อไม่ได้ หรือหมดเวลาเข้าสู่ระบบ ลองโหลดหน้าใหม่');}
  if(res.redirected)throw new Error('หมดเวลาเข้าสู่ระบบ กรุณาโหลดหน้าใหม่');
  let data=null;try{data=await res.json();}catch{}
  if(!res.ok)throw new Error(data?.error||`เกิดข้อผิดพลาด (${res.status})`);
  return data;
}

function dateText(value){
  if(!value)return '';
  const d=new Date(value.replace(' ','T')+'Z');
  return d.toLocaleString('th-TH',{dateStyle:'medium',timeStyle:'short'});
}

function initial(name){try{return [...new Intl.Segmenter('th',{granularity:'grapheme'}).segment(name.trim())][0]?.segment||'?';}catch{return (name||'?')[0];}}

function render(brands){
  const list=$('#brands');
  if(!brands.length){list.innerHTML='<div class="empty">ยังไม่มีแบรนด์<br>กด “เพิ่มแบรนด์” เพื่อสร้างหน้าร้านแรกของคุณ</div>';return;}
  list.innerHTML=brands.map(b=>`<article class="brand-card">
    <span class="mono">${b.avatar?`<img src="${esc(b.avatar)}" alt="">`:esc(b.initials||initial(b.name))}</span>
    <div><h2>${esc(b.name)}</h2><div class="meta"><span>pidlokhub.com/${esc(b.slug)}</span>${b.published_at?`<span class="pill live">● เผยแพร่แล้ว</span>`:'<span class="pill">ยังไม่เผยแพร่</span>'}<span>แก้ไข ${esc(dateText(b.updated_at))}</span></div></div>
    <div class="brand-actions">
      <a class="btn primary" href="/admin/${encodeURIComponent(b.slug)}">จัดการ</a>
      ${b.published_at?`<a class="btn" href="/${encodeURIComponent(b.slug)}" target="_blank" rel="noopener">ดูหน้าร้าน</a>`:''}
      <button class="btn" data-delete="${esc(b.slug)}" data-name="${esc(b.name)}" aria-label="ลบ ${esc(b.name)}">ลบ</button>
    </div>
  </article>`).join('');
  list.querySelectorAll('[data-delete]').forEach(button=>button.onclick=()=>confirmDelete(button.dataset.delete,button.dataset.name));
}

async function load(){
  try{
    const data=await api('/api/admin/brands');
    $('#who').textContent=data.email?`เข้าสู่ระบบด้วย ${data.email}`:'';
    render(data.brands);
  }catch(error){$('#brands').innerHTML=`<div class="empty">${esc(error.message)}</div>`;}
}

function dialog(title, body){
  const d=$('#editor');
  $('#editor-content').innerHTML=`<div class="dialog-head"><div><h2 id="dialog-title">${esc(title)}</h2></div><button class="icon-btn" data-close aria-label="ปิด"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M6 18 18 6"/></svg></button></div><div class="dialog-body">${body}</div>`;
  d.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>d.close());
  if(!d.open)d.showModal();
  return d;
}

function slugify(text){return text.toLowerCase().normalize('NFKD').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,30);}

function slugProblem(slug){
  if(!slug)return 'ใส่ชื่อลิงก์';
  if(!/^[a-z0-9](?:[a-z0-9-]{1,28}[a-z0-9])$/.test(slug))return 'ใช้ a–z ตัวเลข และขีดกลาง 3–30 ตัว ไม่ขึ้นต้นหรือลงท้ายด้วยขีด';
  if(RESERVED.includes(slug))return 'ชื่อนี้สงวนไว้ ลองชื่ออื่น';
  return '';
}

function openCreate(){
  const d=dialog('เพิ่มแบรนด์',`<form class="create-form" id="create-form" novalidate>
    <label>ชื่อแบรนด์<input name="name" maxlength="80" required placeholder="เช่น บ้านก๋ง" autocomplete="off"></label>
    <label>ลิงก์หน้าร้าน<div class="slug-field"><span>pidlokhub.com/</span><input name="slug" maxlength="30" required placeholder="baankong" autocapitalize="off" autocomplete="off" spellcheck="false"></div><span class="hint">ใช้ a–z ตัวเลข และขีดกลาง เปลี่ยนภายหลังไม่ได้ในช่วงทดลอง</span></label>
    <div class="template-choice">
      <label><input type="radio" name="template" value="blank" checked><span><b>เริ่มจากหน้าว่าง</b><span class="hint">Section พื้นฐาน ใส่ข้อมูลร้านเอง</span></span></label>
      <label><input type="radio" name="template" value="sample"><span><b>ใช้ตัวอย่างบ้านก๋ง</b><span class="hint">มีเมนูและรูปตัวอย่าง แล้วแก้เป็นของร้านคุณ</span></span></label>
    </div>
    <p class="error" id="create-error" hidden></p>
    <button class="btn primary wide" type="submit">สร้างแบรนด์</button>
  </form>`);
  const form=$('#create-form',d),name=form.elements.name,slug=form.elements.slug,error=$('#create-error',d);
  let slugTouched=false;
  name.oninput=()=>{if(!slugTouched)slug.value=slugify(name.value);};
  slug.oninput=()=>{slugTouched=true;slug.value=slug.value.toLowerCase().replace(/[^a-z0-9-]/g,'');};
  name.focus();
  form.onsubmit=async event=>{
    event.preventDefault();
    const problem=!name.value.trim()?'ใส่ชื่อแบรนด์':slugProblem(slug.value);
    if(problem){error.textContent=problem;error.hidden=false;return;}
    const submit=form.querySelector('[type=submit]');submit.disabled=true;error.hidden=true;
    try{
      const result=await api('/api/admin/brands',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({name:name.value.trim(),slug:slug.value,template:form.elements.template.value})});
      location.href=`/admin/${encodeURIComponent(result.slug)}`;
    }catch(e){error.textContent=e.message;error.hidden=false;submit.disabled=false;}
  };
}

function confirmDelete(slug,name){
  const d=dialog(`ลบ “${name}”?`,`<p style="font-size:13px;line-height:1.9;color:#8c8497">หน้าร้าน pidlokhub.com/${esc(slug)} ข้อมูล และรูปทั้งหมดของแบรนด์นี้จะถูกลบถาวร กู้คืนไม่ได้<br>พิมพ์ <b>${esc(slug)}</b> เพื่อยืนยัน</p><input id="confirm-slug" style="width:100%;min-height:44px;padding:10px;border:1px solid var(--line);border-radius:10px;margin-top:10px" autocapitalize="off" autocomplete="off"><div style="display:flex;gap:10px;margin-top:18px"><button class="btn" data-close style="flex:1">ยกเลิก</button><button class="btn primary" id="confirm-delete" style="flex:1" disabled>ลบแบรนด์</button></div>`);
  const input=$('#confirm-slug',d),button=$('#confirm-delete',d);
  input.oninput=()=>{button.disabled=input.value.trim()!==slug;};
  input.focus();
  button.onclick=async()=>{button.disabled=true;try{await api(`/api/admin/brands/${encodeURIComponent(slug)}`,{method:'DELETE'});d.close();toast('ลบแบรนด์แล้ว');load();}catch(e){toast(e.message);button.disabled=false;}};
}

$('#new-brand').onclick=openCreate;
$('#editor').addEventListener('click',e=>{const d=e.currentTarget;if(e.target!==d)return;const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();});
load();
