'use strict';
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];
const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icons = {
  grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  list:'<path d="M9 5h12M9 12h12M9 19h12M3 5h.1M3 12h.1M3 19h.1"/>',
  slider:'<rect x="3" y="4" width="13" height="16" rx="2"/><path d="M20 4v16"/>',
  share:'<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="m9 10 6-4M9 14l6 4"/>',
  dots:'<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
  vertical:'<circle cx="12" cy="5" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="12" cy="19" r="1"/>',
  menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
  arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>',
  back:'<path d="M19 12H5m6-6-6 6 6 6"/>',
  up:'<path d="M12 20V4m-6 6 6-6 6 6"/>',
  down:'<path d="M12 4v16m-6-6 6 6 6-6"/>',
  chevron:'<path d="m9 5 7 7-7 7"/>',
  expand:'<path d="m5 9 7 7 7-7"/>',
  check:'<path d="m5 12 4 4L19 6"/>',
  close:'<path d="m6 6 12 12M6 18 18 6"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  grip:'<circle cx="9" cy="5" r=".7"/><circle cx="15" cy="5" r=".7"/><circle cx="9" cy="12" r=".7"/><circle cx="15" cy="12" r=".7"/><circle cx="9" cy="19" r=".7"/><circle cx="15" cy="19" r=".7"/>',
  trash:'<path d="M3 6h18M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7M14 10v7"/>',
  eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
  layers:'<path d="m12 3 10 5-10 5L2 8l10-5ZM2 12l10 5 10-5M2 17l10 5 10-5"/>',
  palette:'<path d="M12 3a9 9 0 1 0 0 18h1a2 2 0 0 0 1-4c-1-1 0-3 2-3h2c5 0 4-11-6-11Z"/><path d="M7 9h.1M11 6h.1M16 7h.1M6 14h.1"/>',
  user:'<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  pin:'<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/>',
  phone:'<path d="m6 3 4 5-3 3a15 15 0 0 0 6 6l3-3 5 4c-1 6-7 4-12-1S1 4 6 3Z"/>',
  chat:'<path d="M21 11a9 9 0 0 1-9 9H4l-2 2V11a9 9 0 1 1 19 0Z"/><path d="M7 10h10M7 14h6"/>',
  bag:'<path d="M5 7h14l2 14H3L5 7ZM8 7V5a4 4 0 0 1 8 0v2"/>',
  car:'<path d="m5 7 2-4h10l2 4 2 4v8H3v-8l2-4ZM3 11h18M6 15h1M17 15h1M6 19v2M18 19v2"/>',
  image:'<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1.5"/><path d="m3 17 6-6 4 4 3-3 5 5"/>',
  external:'<path d="M14 3h7v7m0-7-10 10M10 3H4v17h17v-6"/>',
  copy:'<rect x="7" y="7" width="14" height="14" rx="2"/><path d="M17 7V3H3v14h4"/>',
  lock:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  undo:'<path d="M3 10h12a6 6 0 0 1 0 12M3 10l6-6M3 10l6 6"/>',
  text:'<path d="M4 5h16M12 5v15M8 20h8"/>',
  facebook:'<path d="M14 21v-8h3l1-4h-4V7c0-1 1-2 2-2h2V2h-3c-3 0-5 2-5 5v2H7v4h3v8"/>',
  spark:'<path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z"/>'
};
const icon = name => `<svg viewBox="0 0 24 24" aria-hidden="true">${icons[name] || icons.grid}</svg>`;
const link = {grab:'https://bit.ly/grabbaankong',line:'https://lin.ee/pb9F581',map:'https://bit.ly/mapbaankong',facebook:'https://www.facebook.com/bankong.phitsanulok',phone:'tel:0909526596'};
const image = name => `assets/${name}.jpg`;
const PLATFORMS={
 facebook:{name:'Facebook',color:'#1877F2',hosts:['facebook.com','fb.com','fb.watch'],package:'com.facebook.katana'},
 instagram:{name:'Instagram',color:'#C13584',hosts:['instagram.com'],package:'com.instagram.android'},
 tiktok:{name:'TikTok',color:'#161823',hosts:['tiktok.com'],package:null},
 googlemaps:{name:'Google Maps',color:'#4285F4',hosts:['google.com','google.co.th','maps.app.goo.gl','goo.gl','g.page','bit.ly'],package:null},
 youtube:{name:'YouTube',color:'#FF0000',hosts:['youtube.com','youtu.be'],package:'com.google.android.youtube'},
 line:{name:'LINE',color:'#06C755',hosts:['line.me','lin.ee'],package:null},
 grab:{name:'Grab',color:'#00804A',hosts:['grab.com','grab.onelink.me','bit.ly'],package:null},
 lineman:{name:'LINE MAN',color:'#00B14F',hosts:['lineman.line.me','wongnai.com','wongn.ai','lineman.onelink.me'],package:null}
};
const defaults = {
  version:1, schema:4, fontFamily:'system',fontSize:13, theme:'social', background:'#FFFFFF', avatarShape:'round', avatarImage:'',avatarX:50,avatarY:50,avatarZoom:1,
  profile:{name:'บ้านก๋ง',handle:'baankong',location:'ตลาดใต้ • พิษณุโลก',hours:'07.00–15.00 น.',bio:'มื้อเช้าอุ่น ๆ ในบรรยากาศบ้านก๋ง\nเปิดทุกวัน • หัวมุมตลาดใต้ ตรงข้ามศาลเจ้า'},
  header:{id:'site-header',type:'topbar',title:'Header',layout:'bar',enabled:true,text:'baankong',mode:'text',logo:'',font:'system',background:'#FFFFFF',menuStyle:'bars'},
  footer:{enabled:false,mode:'social',background:'#FFFFFF',social:{id:'footer-social',type:'social',title:'ปุ่ม Social ใน Footer',layout:'row',enabled:true,buttons:[{text:'สั่งผ่าน Grab',url:link.grab,platform:'grab',background:PLATFORMS.grab.color,colorMode:'brand'},{text:'แชต LINE',url:link.line,platform:'line',background:PLATFORMS.line.color,colorMode:'brand'}]},items:[{text:'เมนู',url:'#section-products',icon:'grid'},{text:'นำทาง',url:link.map,icon:'pin'},{text:'แชตร้าน',url:link.line,icon:'chat'}]},
  sections:[
    {id:'profile',type:'bio',title:'โปรไฟล์ร้าน',layout:'profile',enabled:true},
    {id:'social',type:'social',title:'Social Platforms',layout:'row',enabled:true,buttons:[
      {text:'สั่งผ่าน Grab',url:link.grab,platform:'grab',background:PLATFORMS.grab.color,colorMode:'brand'},
      {text:'แชต LINE',url:link.line,platform:'line',background:PLATFORMS.line.color,colorMode:'brand'},
      {text:'Facebook',url:link.facebook,platform:'facebook',background:PLATFORMS.facebook.color,colorMode:'brand'},
      {text:'Google Maps',url:link.map,platform:'googlemaps',background:PLATFORMS.googlemaps.color,colorMode:'brand'}]},
    {id:'buttons',type:'buttons',title:'ปุ่ม DIY',layout:'stack',enabled:true,buttons:[
      {text:'โทรหาร้าน',url:link.phone,icon:'phone',background:'#F3F3F3'},
      {text:'ที่จอดรถ',url:link.line,icon:'car',background:'#F3F3F3'}]},
    {id:'shortcuts',type:'shortcuts',title:'ทางลัดของร้าน',layout:'circles',enabled:true},
    {id:'products',type:'products',title:'เมนูบ้านก๋ง',layout:'grid',columns:3,showNames:false,collapsible:true,enabled:true},
    {id:'gallery',type:'gallery',title:'บรรยากาศบ้านก๋ง',layout:'grid',images:[image('shop'),image('eggs')],enabled:false},
    {id:'location',type:'location',title:'แวะมาหาก๋ง',layout:'map',enabled:true},
    {id:'promotion',type:'promo',title:'วันนี้ที่บ้านก๋ง',layout:'card',body:'เริ่มต้นวันดี ๆ ด้วยอาหารเช้าอุ่น ๆ\nแวะมาหาก๋งได้ทุกวัน 07.00–15.00 น.',button:'สอบถามทาง LINE',url:link.line,enabled:false}
  ],
  products:[
    {id:'noodles',name:'ก๋วยจั๊บญวน',price:89,category:'อาหารเช้า',description:'เส้นนุ่ม น้ำซุปร้อน ๆ พร้อมหมูยอ หมูสับ และไข่ อุ่นท้องในทุกเช้า',images:[image('noodles-detail'),image('noodles')]},
    {id:'eggs',name:'ไข่กระทะ',price:69,category:'อาหารเช้า',description:'ไข่กระทะร้อน ๆ พร้อมหมูสับ กุนเชียง และหมูยอ อร่อยคู่กาแฟยามเช้า',images:[image('eggs')]},
    {id:'rice',name:'ข้าวต้มหมู',price:79,category:'อาหารเช้า',description:'ข้าวต้มน้ำซุปร้อน หมูสับเนื้อนุ่ม โรยต้นหอมและพริกไทย',images:[image('rice')]},
    {id:'dough',name:'ปาท่องโก๋',price:59,category:'ของทานเล่น',description:'ปาท่องโก๋สีทอง กรอบนอกนุ่มใน เสิร์ฟพร้อมสังขยาใบเตย',images:[image('dough')]},
    {id:'tea',name:'ชาไทยเย็น',price:55,category:'เครื่องดื่ม',description:'ชาไทยหอมเข้ม เติมความสดชื่นระหว่างวัน',images:[image('tea')]},
    {id:'coffee',name:'กาแฟโบราณ',price:55,category:'เครื่องดื่ม',description:'กาแฟรสเข้ม หอมกลิ่นกาแฟโบราณ เข้ากับมื้อเช้า',images:[image('coffee')]}
  ]
};
const clone = value => JSON.parse(JSON.stringify(value));
const STORAGE='pidlokhub-prototype-v1';
let storageError=false;
let stored;
try { stored=JSON.parse(localStorage.getItem(STORAGE)); } catch { storageError=true; }
let draft=stored?.draft?.version===1?stored.draft:clone(defaults);
let published=stored?.published?.version===1?stored.published:clone(defaults);
function upgradeState(state){
 state.fontFamily=state.fontFamily||'system';state.fontSize=Number(state.fontSize)||13;
 if((state.schema||1)<2&&!state.sections.some(s=>s.type==='topbar'))state.sections.unshift(clone(defaults.header));
 if((state.schema||1)<3){
   const migrated=[];
   state.sections.forEach(section=>{
     if(section.type!=='social'){migrated.push(section);return;}
     const original=Array.isArray(section.buttons)?section.buttons:[...clone(defaults.sections.find(s=>s.type==='social').buttons),...clone(defaults.sections.find(s=>s.type==='buttons').buttons.slice(0,2))];
     const social=[],custom=[];
     original.forEach(button=>{
       const platform=inferPlatform(button);
       if(!platform){custom.push(button);return;}
       const b={...button,platform};
       const legacyDefault=['#F3F3F3','#252527'].includes((b.background||'').toUpperCase());
       b.colorMode=!b.background||legacyDefault?'brand':'custom';
       if(b.colorMode==='brand')b.background=PLATFORMS[platform].color;
       social.push(b);
     });
     migrated.push({...section,title:section.title==='ช่องทางติดต่อ'?'Social Platforms':section.title,buttons:social});
     if(custom.length)migrated.push({id:section.id+'-diy',type:'buttons',title:'ปุ่ม DIY',layout:section.layout,enabled:section.enabled,buttons:custom});
   });
   state.sections=migrated;
 }
 const previousHeaders=state.sections.filter(s=>s.type==='topbar');
 if(previousHeaders.length>1)state.legacyHeaders=[...(state.legacyHeaders||[]),...clone(previousHeaders.slice(1))];
 if(!state.header){const oldHeader=previousHeaders[0];state.header=oldHeader?{...oldHeader,id:'site-header',title:'Header'}:clone(defaults.header);}
 state.sections=state.sections.filter(s=>s.type!=='topbar');
 if(!state.footer)state.footer=clone(defaults.footer);
 state.footer.items=(state.footer.items||[]).slice(0,5);
 state.schema=4;return state;
}
draft=upgradeState(draft);published=upgradeState(published);
let activeView=new URLSearchParams(location.search).get('view')==='cms'?'cms':'store';
let cmsTab='sections',publishedView=false,currentSection=null,category='ทั้งหมด',expandedMenus=new Set(),history=[],toastTimer;
const workspace=$('#workspace');
const labels={topbar:'แถบด้านบน',bio:'โปรไฟล์ร้าน',social:'Social Platforms',buttons:'ปุ่ม DIY',shortcuts:'ทางลัด',products:'เมนูสินค้า',gallery:'แกลเลอรี',location:'แผนที่',promo:'ประกาศ / โปรโมชั่น',diy:'DIY Section'};
const typeIcon={topbar:'menu',bio:'user',social:'chat',buttons:'external',shortcuts:'layers',products:'grid',gallery:'image',location:'pin',promo:'spark',diy:'layers'};
const layoutLabels={bar:'โลโก้ / ชื่อ และเมนู',profile:'โปรไฟล์',centered:'จัดกึ่งกลาง',cover:'ภาพปก',row:'2 คอลัมน์',stack:'1 คอลัมน์',circles:'วงกลมทางลัด',grid:'กริด',list:'รายการ',slider:'สไลด์',map:'แผนที่พร้อมข้อมูล',compact:'ข้อมูลแบบย่อ',card:'การ์ด',plain:'เรียบง่าย',blocks:'บล็อกอิสระ'};
function toast(message){$('#toast').textContent=message;$('#toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),2800);}
function remember(){history.push(clone(draft));if(history.length>25)history.shift();}
function persist(){
  try{localStorage.setItem(STORAGE,JSON.stringify({draft,published}));storageError=false;}catch{storageError=true;toast('พื้นที่บันทึกเต็ม หรือเบราว์เซอร์ไม่อนุญาตให้บันทึก ลองใช้รูปขนาดเล็กลง');}
}
function changed({full=false}={}){persist();refreshPreview();if(full)render();}
function applyTheme(state){
  const c=state.background, rgb=c.match(/[a-f\d]{2}/gi)?.map(x=>parseInt(x,16))||[255,255,255];
  const luminance=rgb.map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4;}).reduce((sum,v,i)=>sum+v*[.2126,.7152,.0722][i],0);
  const dark=luminance<.24;
  const accent=state.theme==='warm'?'#8F472E':'#252527';
  return `--shop-bg:${c};--shop-ink:${dark?'#FFFFFF':'#262323'};--shop-muted:${dark?'#DDDAE1':'#77716E'};--shop-accent:${dark?'#FFFFFF':accent};--shop-button-ink:${dark?'#202026':'#FFFFFF'};--shop-soft:${dark?'#ffffff16':'#00000007'};--shop-line:${dark?'#ffffff26':'#00000010'};--font-scale:${(Number(state.fontSize)||13)/13};--shop-font:${fontStack(state.fontFamily)}`;
}
function avatar(state, shape=state.avatarShape){return `<span class="avatar ${esc(shape)}">${state.avatarImage?`<img src="${esc(state.avatarImage)}" alt="รูปโปรไฟล์ร้าน" style="object-position:${state.avatarX}% ${state.avatarY}%;transform:scale(${state.avatarZoom||1})">`:'ก๋ง'}</span>`;}
function shopButton(text,href,ic,primary=false){return `<a class="shop-button ${primary?'primary':''}" href="${esc(href)}" ${href.startsWith('tel:')?'':'target="_blank" rel="noopener noreferrer"'}>${icon(ic)}${esc(text)}</a>`;}
function safeURL(value){try{const u=new URL(value);return ['https:','http:','tel:','mailto:'].includes(u.protocol)?u.href:'#';}catch{return '#';}}
function safeImage(value){return /^data:image\/(jpeg|png|webp|gif);base64,/.test(value)||/^assets\/[a-z0-9-]+\.jpg$/.test(value)?value:'';}
function sectionMarkup(section,state,{preview=false}={}){
  const p=state.profile; let body='';
  switch(section.type){
    case 'bio': body=`${section.layout==='cover'?`<img class="cover-photo" src="${image('shop')}" alt="ภาพจำลองบรรยากาศร้าน">`:''}<div class="shop-profile">${avatar(state)}<div><h1>${esc(p.name)}</h1><p class="location">${esc(p.location)}</p><p class="hours">${icon('clock')}ทุกวัน ${esc(p.hours)}</p></div></div><p class="bio-copy">${esc(p.bio)}</p>`;break;
    case 'topbar':return `<section class="shop-topbar" data-section="${esc(section.id)}" data-kind="topbar" style="--topbar-bg:${validColor(section.background)};--topbar-ink:${inkOn(section.background)};--topbar-font:${fontStack(section.font)}"><span class="topbar-identity">${section.mode==='logo'&&section.logo?`<img src="${esc(safeImage(section.logo))}" alt="โลโก้ ${esc(p.name)}">`:`<strong>${esc(section.text||p.handle)}</strong>`}</span><span class="topbar-actions"><button class="icon-btn" data-share-store aria-label="แชร์ร้าน">${icon('share')}</button><button class="icon-btn menu-${esc(section.menuStyle||'bars')}" data-shop-menu aria-label="เมนูร้าน">${icon(section.menuStyle==='vertical'?'vertical':section.menuStyle==='bars'?'menu':'dots')}</button></span></section>`;
    case 'social':body=`<h2>${esc(section.title)}</h2><div class="shop-actions contact-${esc(section.layout)}">${(section.buttons||[]).map(b=>platformButton(b)).join('')}</div>`;break;
    case 'buttons':body=`<h2>${esc(section.title)}</h2><div class="shop-actions contact-${esc(section.layout)}">${(section.buttons||[]).map(b=>`<a class="shop-button" href="${esc(safeURL(b.url))}" target="_blank" rel="noopener noreferrer" style="background:${validColor(b.background,'#F3F3F3')};color:${inkOn(b.background)}">${icon(b.icon)}<span>${esc(b.text)}</span></a>`).join('')}</div>`;break;
    case 'shortcuts': body=`<div class="shortcuts">${[['noodles','เมนูแนะนำ','products'],['tea','เครื่องดื่ม','drinks'],['shop','บรรยากาศ','gallery'],['shop','ข้อมูลร้าน','location']].map(([img,title,target])=>`<button class="shortcut" data-shortcut="${target}"><span class="shortcut-image"><img src="${image(img)}" alt=""></span>${title}</button>`).join('')}</div>`;break;
    case 'products':{
      const selected=preview?'ทั้งหมด':category;
      const filtered=state.products.filter(x=>selected==='ทั้งหมด'||x.category===selected);
      const showAll=preview||!section.collapsible||expandedMenus.has(section.id);
      const visible=showAll?filtered:filtered.slice(0,3);
      body=`<div class="product-heading"><h2>${esc(section.title)}</h2><span>${filtered.length} เมนู</span></div><div class="categories">${['ทั้งหมด',...new Set(state.products.map(x=>x.category))].map(x=>`<button class="category ${x===selected?'active':''}" data-category="${esc(x)}">${esc(x)}</button>`).join('')}</div><div class="product-grid ${esc(section.layout)}" style="--cols:${section.columns||3}">${visible.map((x,i)=>`<button class="product-tile" data-product="${esc(x.id)}" aria-label="ดู ${esc(x.name)}"><img src="${esc(safeImage(x.images[x.id==='noodles'?1:0]||x.images[0]))}" alt="${esc(x.name)}" loading="lazy">${x.images.length>1?`<span class="image-badge">${icon('copy')}</span>`:''}${section.showNames||section.layout==='list'?`<span class="tile-name">${esc(x.name)}<span class="tile-price">฿${Number(x.price).toLocaleString('th-TH')}</span></span>`:''}</button>`).join('')}</div>${section.collapsible&&filtered.length>3?`<button class="shop-button menu-expand" data-expand-menu="${section.id}">${showAll?'ย่อรายการ':'ดูเมนูทั้งหมด'} ${icon(showAll?'up':'expand')}</button>`:''}`;break;}
    case 'location':body=`<h2>${esc(section.title)}</h2><p class="location-copy">หัวมุมตลาดใต้ พิษณุโลก<br>มาจากริมน้ำผ่านไฟแดงคุณโจ ร้านอยู่ตรงข้ามศาลเจ้า</p>${section.layout!=='compact'?`<div class="shop-map" role="img" aria-label="ภาพแผนที่จำลอง ตำแหน่งจริงดูได้จากปุ่มนำทาง"><span class="map-pin"><span>${esc(p.name)}</span>${icon('pin')}</span><small>แผนที่ประกอบ • กดนำทางเพื่อดูพิกัดจริง</small></div>`:''}${shopButton('เปิดแผนที่และนำทาง',link.map,'pin')}<p class="parking-note">${icon('car')}<span>จอดหน้าร้าน ริมน้ำ หรือลานจอดของร้าน<br>สอบถามทีมงานได้ครับ</span></p>`;break;
    case 'gallery':body=`<h2>${esc(section.title)}</h2><div class="shop-gallery ${section.layout==='slider'?'gallery-slider':''}">${section.images.map(src=>`<img src="${esc(safeImage(src))}" alt="ภาพตัวอย่างบรรยากาศร้าน" loading="lazy">`).join('')}</div>`;break;
    case 'promo':body=`<div class="${section.layout==='card'?'promo-block':''}"><h3>${esc(section.title)}</h3><p class="bio-copy">${esc(section.body)}</p>${section.button?shopButton(section.button,safeURL(section.url),'arrow',true):''}</div>`;break;
    case 'diy':body=`<h2>${esc(section.title)}</h2>${(section.blocks||[]).map(b=>`<div class="diy-block">${b.type==='text'?`<p>${esc(b.text)}</p>`:b.type==='image'?`<img src="${esc(safeImage(b.src))}" alt="${esc(b.alt||'รูปภาพของร้าน')}">`:shopButton(b.text,safeURL(b.url),'external')}</div>`).join('')}`;break;
  }
  return `<section id="section-${esc(section.id)}" class="shop-section ${section.type}-layout-${esc(section.layout)}" data-section="${esc(section.id)}" data-kind="${esc(section.type)}">${body}</section>`;
}
function shopMarkup(state,{preview=false,onlySection=null}={}){
 return `<div class="shop theme-${esc(state.theme)} ${!onlySection&&state.footer.enabled?'has-sticky-footer':''}" style="${applyTheme(state)}">${!onlySection&&state.header.enabled?sectionMarkup(state.header,state,{preview}):''}${state.sections.filter(s=>onlySection?s.id===onlySection:s.enabled).map(s=>sectionMarkup(s,state,{preview})).join('')}${!onlySection?`<footer class="shop-footer">Made with <b>pidlokhub</b><small>ภาพอาหารและราคาเป็นตัวอย่างประกอบการทดลอง</small></footer>${footerMarkup(state)}`:''}</div>`;
}
function setView(view){activeView=view;publishedView=false;const url=new URL(location.href);url.searchParams.set('view',view);url.hash='';window.history.replaceState(null,'',url);render();window.scrollTo({top:0,behavior:'instant'});}
function render(){
  $$('.view-switch button').forEach(b=>{b.classList.toggle('active',b.dataset.view===activeView);b.setAttribute('aria-current',b.dataset.view===activeView?'page':'false');});
  workspace.innerHTML=activeView==='cms'?cmsMarkup():storeMarkup();bindWorkspace();
}
function storeMarkup(){return `<div class="store-stage"><aside class="stage-intro"><p class="eyebrow">PIDLOK HUB / PREVIEW</p><h1>บ้านก๋ง<br>ในแบบของคุณ<span style="color:#b0a4d9">.</span></h1><p>หน้าร้านเล็ก ๆ ที่รวมทุกอย่างไว้<br>ให้คนรู้จักร้าน ดูเมนู และแวะมาหากัน</p><button class="btn black" data-go-cms>${icon('layers')}ลองแต่งหน้าร้าน${icon('arrow')}</button></aside><div class="store-frame"><div class="store-browser">${icon('lock')} pidlokhub.com/${esc(draft.profile.handle)}</div><div class="draft-ribbon">${publishedView?'กำลังดูฉบับเผยแพร่ในเครื่อง':'กำลังดูฉบับร่าง · เปลี่ยนใน CMS แล้วเห็นผลทันที'}<button data-toggle-published>${publishedView?'ดูฉบับร่าง':'ดูฉบับเผยแพร่'}</button></div><div id="main-shop">${shopMarkup(publishedView?published:draft)}</div></div><aside class="stage-side"><p class="eyebrow">MADE FOR MOBILE</p><div class="feature-note"><b>01 — ภาพเล่าเรื่อง</b>แตะรูปอาหารเพื่อดูรายละเอียด<br>และเลื่อนดูรูปเพิ่มเติม</div><div class="feature-note"><b>02 — แต่งได้ในแบบร้าน</b>สลับ Section เปลี่ยน Layout<br>ธีม สีพื้น และรูปทรง Avatar</div><div class="feature-note"><b>03 — ทดลองได้เต็มที่</b>บันทึกเฉพาะเบราว์เซอร์เครื่องนี้<br>ไม่ต้องสมัครสมาชิก</div></aside></div>`;}
function cmsMarkup(){return `<div class="cms-shell"><aside class="sidebar"><div class="side-caption">YOUR WORKSPACE</div>${[['header','menu','Header'],['sections','layers','จัดการ Section'],['footer','layers','Footer'],['theme','palette','ธีมแสดงผล'],['profile','user','โปรไฟล์ร้าน']].map(([id,ic,text])=>`<button class="side-link ${cmsTab===id?'active':''}" data-cms-tab="${id}">${icon(ic)}${text}</button>`).join('')}<hr><button class="side-link" data-go-store>${icon('eye')}ดูหน้าร้าน</button><div class="sidebar-bottom">พื้นที่ทดลองของคุณ<br>ทุกการเปลี่ยนแปลง<br>บันทึกอยู่ในเครื่องนี้</div></aside><section class="editor-main"><div class="page-heading"><div><p class="eyebrow">YOUR LITTLE CORNER</p><h1>จัดการหน้าร้าน</h1><p>ร้านของคุณ เล่าในแบบที่เป็นคุณ</p></div><button class="btn mobile-preview" data-go-store>${icon('eye')}ดูตัวอย่าง</button></div><div class="store-id">${avatar(draft)}<div><h3>${esc(draft.profile.name)}</h3><p>pidlokhub.com/${esc(draft.profile.handle)}</p></div><span class="draft-badge">ฉบับร่าง</span></div><div class="tabs" role="tablist" aria-label="ตั้งค่าหน้าร้าน">${[['header','Header'],['sections','Section'],['footer','Footer'],['theme','ธีมแสดงผล'],['profile','โปรไฟล์']].map(([id,text])=>`<button role="tab" aria-selected="${cmsTab===id}" class="${cmsTab===id?'active':''}" data-cms-tab="${id}">${text}</button>`).join('')}</div>${storageError?'<div class="storage-notice">เบราว์เซอร์บันทึกข้อมูลไม่ได้ การเปลี่ยนแปลงยังใช้ได้จนกว่าจะปิดหน้านี้</div>':''}<div id="cms-panel">${cmsPanelMarkup()}</div><div class="savebar"><span class="save-state">${icon('check')}บันทึกฉบับร่าง${storageError?'ชั่วคราว':'ในเครื่อง'}</span><div style="display:flex;gap:6px"><button class="icon-btn" data-undo aria-label="ย้อนกลับการแก้ไขล่าสุด" ${!history.length?'disabled':''}>${icon('undo')}</button><button class="btn primary" data-publish>เผยแพร่${icon('arrow')}</button></div></div><div class="reset-area"><span>ต้นแบบในเครื่อง · ไม่มีการเข้าสู่ระบบ</span><button class="text-action" data-reset>เริ่มใหม่</button></div></section><aside class="preview-column"><div class="preview-sticky"><div class="preview-label"><span>${icon('eye')} ตัวอย่างบนมือถือ</span><span><i class="live-dot"></i> อัปเดตทันที</span></div><div class="phone-frame"><div class="phone-top"><span>9:41</span><i></i><span>▰</span></div><div class="phone-scroll" id="cms-preview">${shopMarkup(draft,{preview:true})}</div></div><p class="preview-note">ลองเปลี่ยน แล้วดูหน้าร้านในแบบของคุณ<br><button class="btn" data-go-store>เปิดดูหน้าร้านเต็ม${icon('external')}</button></p></div></aside></div>`;}
const expandedSections=new Set(['profile']);
let sectionPickerOpen=false;
function modulePanel(){
  return `<div class="section-heading"><div><h2>Section ของคุณ <span style="color:#aaa5b5;font-size:11px;font-weight:400">/ ${draft.sections.length}</span></h2><p>กดการ์ดเพื่อเปิดรายละเอียด · ลากเพื่อจัดลำดับ</p></div>${icon('layers')}</div><div class="module-list">${draft.sections.length?draft.sections.map((s,i)=>{
    const expanded=expandedSections.has(s.id);
    const layout=layoutLabels[s.layout]||s.layout;
    const layoutIcon=['grid','list','slider'].includes(s.layout)?s.layout:s.type==='gallery'||s.layout==='cover'?'image':typeIcon[s.type];
    return `<article class="module-card module-${s.type} ${!s.enabled?'off':''} ${expanded?'expanded':''}" data-module-id="${s.id}">
      <div class="module-heading">
        <button class="drag-handle" data-drag="${s.id}" aria-label="ลากเรียง ${esc(s.title)}">${icon('grip')}</button>
        <button class="module-expand" data-expand-section="${s.id}" aria-expanded="${expanded}" aria-controls="module-detail-${s.id}">
          <span class="module-icon">${icon(typeIcon[s.type])}</span>
          <span class="module-info"><span class="module-title">${esc(s.title)}</span><span class="module-meta"><span class="module-status ${s.enabled?'is-on':''}"><i></i>${s.enabled?'แสดงอยู่':'ซ่อนอยู่'}</span><span>${labels[s.type]}</span></span></span>
          <span class="module-chevron">${icon('expand')}</span>
        </button>
        <button class="switch" role="switch" aria-label="แสดง ${esc(s.title)}" aria-checked="${s.enabled}" data-toggle-section="${s.id}"></button>
      </div>
      <div class="module-detail" id="module-detail-${s.id}" ${expanded?'':'hidden'}>
        <div class="inline-editor" data-inline-section="${s.id}">${inlineEditor(s)}</div>
        <div class="module-bottom"><div class="module-reorder"><span>ลำดับ ${String(i+1).padStart(2,'0')}</span><button class="move-btn" data-move="${s.id}" data-direction="-1" aria-label="ย้าย ${esc(s.title)} ขึ้น" ${i===0?'disabled':''}>${icon('up')}</button><button class="move-btn" data-move="${s.id}" data-direction="1" aria-label="ย้าย ${esc(s.title)} ลง" ${i===draft.sections.length-1?'disabled':''}>${icon('down')}</button></div><button class="delete-module" data-remove-section="${s.id}" aria-label="ลบ ${esc(s.title)}">${icon('trash')}<span>ลบ</span></button></div>
      </div>
    </article>`;
  }).join(''):'<div class="empty-modules">เริ่มสร้างหน้าร้านด้วย Section แรกของคุณ</div>'}</div><button class="add-section" data-add-section>${icon(sectionPickerOpen?'close':'plus')}${sectionPickerOpen?'ปิดรายการโมดูล':'เพิ่ม Section'}</button>${sectionPickerOpen?sectionPickerMarkup():''}<p class="helper" style="text-align:center">เลือกโมดูลสำเร็จรูป หรือสร้างเองด้วย DIY Section</p><div class="onboarding-note">${icon('spark')} เปิดการ์ดเพื่อเลือก Layout และปรับเนื้อหา<br>สวิตช์ด้านขวาใช้เปิด–ปิดการแสดง Section บนหน้าร้าน</div>`;
}
const shapeOptions=()=>`<div class="shape-options">${[['round','กลม'],['square','เหลี่ยม'],['rounded','มุมโค้ง']].map(([value,text])=>`<button class="choice ${draft.avatarShape===value?'selected':''}" data-shape="${value}" aria-pressed="${draft.avatarShape===value}">${avatar(draft,value)}${text}${draft.avatarShape===value?`<span class="selected-mark">${icon('check')}</span>`:''}</button>`).join('')}</div>`;
function themePanel(){return `${typographyPanel()}<div class="setting-panel"><h2>เลือกบรรยากาศของร้าน</h2><p>เปลี่ยนธีมได้ เนื้อหาและรูปภาพยังอยู่ครบ</p><div class="theme-options">${[['social','Social'],['minimal','Minimal'],['warm','Warm']].map(([value,text])=>`<button class="theme-option ${draft.theme===value?'selected':''}" data-theme="${value}" aria-pressed="${draft.theme===value}"><div class="theme-mini ${value}"><div class="mini-head"><i></i><b></b></div><div class="mini-grid"><i></i><i></i><i></i></div></div><span>${text}</span>${draft.theme===value?`<i class="selected-mark">${icon('check')}</i>`:''}</button>`).join('')}</div></div><div class="setting-panel"><h2>สีพื้นหลัง</h2><p>เลือกโทนที่ชอบ หรือกำหนดสีของร้านเอง</p><div class="swatches">${['#FFFFFF','#F3F4F6','#FFF6E7','#FFF1F2','#EAF2E9','#25232B'].map(c=>`<button class="swatch ${draft.background.toUpperCase()===c?'selected':''}" style="--color:${c};--check:${c==='#25232B'?'white':'#6254db'}" data-color="${c}" aria-label="สีพื้น ${c}" aria-pressed="${draft.background.toUpperCase()===c}">${draft.background.toUpperCase()===c?icon('check'):''}</button>`).join('')}</div><div class="color-custom"><label for="background-color">กำหนดเอง</label><input type="color" id="background-color" value="${draft.background}" aria-label="เลือกสีพื้นหลัง"><input id="background-hex" type="text" value="${draft.background}" maxlength="7" aria-label="รหัสสีพื้นหลัง" spellcheck="false"></div><p class="helper">สีข้อความจะปรับให้อ่านง่ายตามพื้นหลัง</p></div><div class="setting-panel"><h2>รูปทรง Avatar</h2><p>เลือกรูปทรงที่เข้ากับร้าน ใช้รูปเดิมได้ทันที</p>${shapeOptions()}</div>`;}
function profilePanel(){return `<div class="setting-panel"><h2>รูปโปรไฟล์ร้าน</h2><p>ภาพแรกที่ทำให้คนจำร้านได้</p><div class="upload-row">${avatar(draft)}<div><label class="btn file-label">${icon('image')}เปลี่ยนรูป<input type="file" accept="image/png,image/jpeg,image/webp" id="avatar-upload"></label>${draft.avatarImage?'<button class="text-action" data-avatar-reset style="display:block">ใช้รูปตัวอย่าง</button>':''}</div></div>${shapeOptions()}${draft.avatarImage?`<div style="margin-top:20px" class="form-stack"><label>ตำแหน่งแนวนอน<input type="range" min="0" max="100" value="${draft.avatarX}" data-avatar-position="avatarX"></label><label>ตำแหน่งแนวตั้ง<input type="range" min="0" max="100" value="${draft.avatarY}" data-avatar-position="avatarY"></label><label>ซูมรูป<input type="range" min="1" max="2.5" step=".05" value="${draft.avatarZoom||1}" data-avatar-position="avatarZoom"></label></div>`:''}</div><div class="setting-panel"><h2>เล่าเรื่องร้านของคุณ</h2><p>ข้อมูลสั้น ๆ ที่ช่วยให้ลูกค้ารู้จักร้าน</p><div class="form-stack"><label>ชื่อร้าน<input data-profile-field="name" value="${esc(draft.profile.name)}" maxlength="80"></label><label>ชื่อหน้าร้าน<input data-profile-field="handle" value="${esc(draft.profile.handle)}" pattern="[a-z0-9-]+" maxlength="40" placeholder="baankong"><span class="diy-field-note">ใช้ a–z ตัวเลข และขีดกลาง</span></label><label>พื้นที่ / จังหวัด<input data-profile-field="location" value="${esc(draft.profile.location)}" maxlength="100"></label><label>เวลาเปิด–ปิด<input data-profile-field="hours" value="${esc(draft.profile.hours)}" maxlength="60"></label><label>แนะนำร้าน<textarea data-profile-field="bio" rows="4" maxlength="800">${esc(draft.profile.bio)}</textarea></label></div></div>`;}
function refreshPreview(){
  const identity=$('.store-id');if(identity){const picture=$('.avatar',identity);if(picture)picture.outerHTML=avatar(draft);const title=$('h3',identity);if(title)title.textContent=draft.profile.name;const path=$('p',identity);if(path)path.textContent=`pidlokhub.com/${draft.profile.handle}`;}
  const preview=$('#cms-preview');if(preview){const scroll=preview.scrollTop;preview.innerHTML=shopMarkup(draft,{preview:true});preview.scrollTop=scroll;bindShop(preview);const top=$('.phone-top');if(top)top.style=applyTheme(draft);}
  const mini=$('#section-preview');if(mini&&currentSection){mini.innerHTML=shopMarkup(draft,{preview:true,onlySection:currentSection});bindShop(mini);}
  const undo=$('[data-undo]');if(undo)undo.disabled=!history.length;
}
function updateCMSPanel(){const panel=$('#cms-panel');panel.innerHTML=cmsPanelMarkup();bindCMSControls(panel);refreshPreview();}
function bindWorkspace(){
  $$('[data-go-cms]').forEach(b=>b.onclick=()=>setView('cms'));
  $$('[data-go-store]').forEach(b=>b.onclick=()=>setView('store'));
  $$('[data-cms-tab]').forEach(b=>b.onclick=()=>{cmsTab=b.dataset.cmsTab;render();});
  const toggle=$('[data-toggle-published]');if(toggle)toggle.onclick=()=>{publishedView=!publishedView;render();};
  bindShop(workspace);bindCMSControls(workspace);
  const publish=$('[data-publish]');if(publish)publish.onclick=()=>{published=clone(draft);persist();toast('เผยแพร่ฉบับทดลองในเครื่องแล้ว');};
  const undo=$('[data-undo]');if(undo)undo.onclick=()=>{if(!history.length)return;draft=history.pop();changed({full:true});toast('ย้อนกลับการแก้ไขล่าสุดแล้ว');};
  const reset=$('[data-reset]');if(reset)reset.onclick=()=>openConfirm('เริ่มต้นใหม่?','ข้อมูลและการปรับแต่งในต้นแบบนี้จะกลับเป็นตัวอย่างบ้านก๋ง',()=>{remember();draft=clone(defaults);published=clone(defaults);category='ทั้งหมด';expandedMenus.clear();changed({full:true});toast('กลับเป็นตัวอย่างเริ่มต้นแล้ว');});
}
function bindShop(root){
  $$('[data-footer-anchor]',root).forEach(button=>button.onclick=event=>{const target=$(`[id="${button.dataset.footerAnchor}"]`,button.closest('.shop'));if(target){event.preventDefault();target.scrollIntoView({behavior:'smooth',block:'start'});}else{event.preventDefault();toast('Section ปลายทางนี้ยังไม่ได้เปิด');}});

  $$('[data-product]',root).forEach(b=>b.onclick=()=>openProduct(b.dataset.product));
  $$('[data-category]',root).forEach(b=>b.onclick=()=>{category=b.dataset.category;const shop=b.closest('.shop');const state=publishedView?published:draft;shop.querySelectorAll('[data-kind="products"]').forEach(el=>{const section=state.sections.find(s=>s.id===el.dataset.section);el.outerHTML=sectionMarkup(section,state);});bindShop(shop);});
  $$('[data-expand-menu]',root).forEach(b=>b.onclick=()=>{const id=b.dataset.expandMenu;expandedMenus.has(id)?expandedMenus.delete(id):expandedMenus.add(id);const section=(publishedView?published:draft).sections.find(s=>s.id===id),parent=b.closest('.shop');b.closest('section').outerHTML=sectionMarkup(section,publishedView?published:draft);bindShop(parent);});
  $$('[data-share-store]',root).forEach(b=>b.onclick=()=>share('บ้านก๋ง',`${location.origin==='null'?'https://pidlokhub.com':location.origin+location.pathname}?view=store`));
  $$('[data-shop-menu]',root).forEach(b=>b.onclick=()=>{const shop=b.closest('.shop'),target=$('[data-kind="location"]',shop)||$('section',shop);target?.scrollIntoView({behavior:'smooth',block:'start'});});
  $$('[data-shortcut]',root).forEach(b=>b.onclick=()=>{const shop=b.closest('.shop');let target=b.dataset.shortcut;if(target==='drinks'){category='เครื่องดื่ม';const productSection=$('[data-kind="products"]',shop);if(productSection){const s=(publishedView?published:draft).sections.find(x=>x.id===productSection.dataset.section);productSection.outerHTML=sectionMarkup(s,publishedView?published:draft);bindShop(shop);}target='products';}const el=$(`[data-kind="${target}"]`,shop);if(el)el.scrollIntoView({behavior:'smooth',block:'start'});else toast('Section นี้ยังไม่ได้เปิด ลองเปิดได้ใน CMS');});
}
async function share(title,url){try{if(navigator.share){await navigator.share({title,url});return;}if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(url);toast('คัดลอกลิงก์แล้ว');return;}const t=document.createElement('textarea');t.value=url;document.body.append(t);t.select();const ok=document.execCommand('copy');t.remove();if(ok)toast('คัดลอกลิงก์แล้ว');else toast(url);}catch(e){if(e.name!=='AbortError')toast('แชร์ไม่ได้ในเบราว์เซอร์นี้');}}
function bindCMSControls(root){
  $$('[data-expand-section]',root).forEach(button=>button.onclick=()=>{
    const id=button.dataset.expandSection,card=button.closest('[data-module-id]'),detail=$('.module-detail',card);
    const expanded=!expandedSections.has(id);
    if(expanded)expandedSections.add(id);else expandedSections.delete(id);
    button.setAttribute('aria-expanded',String(expanded));detail.hidden=!expanded;card.classList.toggle('expanded',expanded);
  });
  $$('[data-edit-section]',root).forEach(b=>b.onclick=()=>openSection(b.dataset.editSection));
  $$('[data-toggle-section]',root).forEach(b=>b.onclick=()=>{remember();const s=draft.sections.find(s=>s.id===b.dataset.toggleSection);s.enabled=!s.enabled;persist();updateCMSPanel();});
  $$('[data-move]',root).forEach(b=>b.onclick=()=>{const index=draft.sections.findIndex(s=>s.id===b.dataset.move);moveSection(index,index+Number(b.dataset.direction));});
  $$('[data-remove-section]',root).forEach(b=>b.onclick=()=>{const section=draft.sections.find(s=>s.id===b.dataset.removeSection);openConfirm(`ลบ “${section.title}”?`,'ลบเฉพาะ Section นี้ สินค้าและข้อมูลโปรไฟล์ยังอยู่ และกดย้อนกลับได้',()=>{remember();draft.sections=draft.sections.filter(s=>s.id!==section.id);changed();updateCMSPanel();toast('ลบ Section แล้ว · กดย้อนกลับได้');});});
  const add=$('[data-add-section]',root);if(add)add.onclick=openAddSection;
  $$('[data-theme]',root).forEach(b=>b.onclick=()=>{remember();draft.theme=b.dataset.theme;draft.background={social:'#FFFFFF',minimal:'#F3F4F6',warm:'#FFF6E7'}[draft.theme];changed();updateCMSPanel();toast(`ใช้ธีม ${draft.theme[0].toUpperCase()+draft.theme.slice(1)} แล้ว`);});
  $$('[data-color]',root).forEach(b=>b.onclick=()=>{remember();draft.background=b.dataset.color;changed();updateCMSPanel();});
  const picker=$('#background-color',root);if(picker){picker.onpointerdown=remember;picker.oninput=()=>{draft.background=picker.value;const hex=$('#background-hex');hex.value=picker.value;changed();};picker.onchange=updateCMSPanel;}
  const hex=$('#background-hex',root);if(hex)hex.onchange=()=>{if(!/^#[\da-f]{6}$/i.test(hex.value)){hex.value=draft.background;toast('ใส่รหัสสีรูปแบบ #FFFFFF');return;}remember();draft.background=hex.value.toUpperCase();changed();updateCMSPanel();};
  $$('[data-shape]',root).forEach(b=>b.onclick=()=>{remember();draft.avatarShape=b.dataset.shape;changed();updateCMSPanel();});
  $$('[data-profile-field]',root).forEach(input=>{input.onfocus=remember;input.oninput=()=>{const field=input.dataset.profileField;if(field==='handle'){draft.profile.handle=input.value.toLowerCase().replace(/[^a-z0-9-]/g,'');input.value=draft.profile.handle;}else draft.profile[field]=input.value;changed();const title=$('.store-id h3');if(title)title.textContent=draft.profile.name;const path=$('.store-id p');if(path)path.textContent=`pidlokhub.com/${draft.profile.handle}`;};input.onblur=()=>{if(input.dataset.profileField==='handle'&&!input.value){draft.profile.handle='baankong';input.value='baankong';changed();}};});
  const upload=$('#avatar-upload',root);if(upload)upload.onchange=async()=>{const data=await readUpload(upload.files[0]);if(!data)return;remember();draft.avatarImage=data;draft.avatarX=50;draft.avatarY=50;draft.avatarZoom=1;changed();updateCMSPanel();};
  const reset=$('[data-avatar-reset]',root);if(reset)reset.onclick=()=>{remember();draft.avatarImage='';changed();updateCMSPanel();};
  $$('[data-avatar-position]',root).forEach(input=>{input.onpointerdown=remember;input.oninput=()=>{draft[input.dataset.avatarPosition]=Number(input.value);changed();$$('.upload-row .avatar img,.shape-options .avatar img').forEach(img=>{img.style.objectPosition=`${draft.avatarX}% ${draft.avatarY}%`;img.style.transform=`scale(${draft.avatarZoom})`;});};});
  $$('[data-drag]',root).forEach(handle=>handle.onpointerdown=startDrag);
  bindInlineEditors(root);
  bindSectionPicker(root);
  bindTypography(root);
  bindChromeControls(root);
}
function moveSection(from,to){if(to<0||to>=draft.sections.length||from===to)return;remember();const [s]=draft.sections.splice(from,1);draft.sections.splice(to,0,s);changed();updateCMSPanel();toast(`ย้าย ${s.title} แล้ว`);}
function startDrag(e){
  if(e.button!==0)return;e.preventDefault();const handle=e.currentTarget,id=handle.dataset.drag,card=handle.closest('.module-card');let from=draft.sections.findIndex(s=>s.id===id),moved=false,lastTarget=from;
  handle.setPointerCapture(e.pointerId);card.classList.add('dragging');
  function onMove(event){const hit=document.elementFromPoint(event.clientX,event.clientY)?.closest('[data-module-id]');if(!hit||hit===card)return;const target=draft.sections.findIndex(s=>s.id===hit.dataset.moduleId);if(target<0||lastTarget===target)return;lastTarget=target;const list=card.parentNode;const rect=hit.getBoundingClientRect();if(event.clientY>rect.top+rect.height/2)list.insertBefore(card,hit.nextSibling);else list.insertBefore(card,hit);moved=true;if(event.clientY>innerHeight-90)window.scrollBy(0,35);if(event.clientY<135)window.scrollBy(0,-35);}
  function onUp(){card.classList.remove('dragging');handle.removeEventListener('pointermove',onMove);handle.removeEventListener('pointerup',onUp);handle.removeEventListener('pointercancel',onUp);if(moved){const ids=$$('[data-module-id]',card.parentNode).map(x=>x.dataset.moduleId);if(ids.some((v,i)=>v!==draft.sections[i].id)){remember();draft.sections=ids.map(x=>draft.sections.find(s=>s.id===x));persist();toast('จัดลำดับ Section แล้ว');}updateCMSPanel();}}
  handle.addEventListener('pointermove',onMove);handle.addEventListener('pointerup',onUp);handle.addEventListener('pointercancel',onUp);
}
async function readUpload(file){if(!file)return null;if(!['image/jpeg','image/png','image/webp'].includes(file.type)){toast('เลือกรูป JPG, PNG หรือ WebP');return null;}if(file.size>8*1024*1024){toast('เลือกรูปขนาดไม่เกิน 8 MB');return null;}try{return await new Promise((resolve,reject)=>{const fr=new FileReader();fr.onerror=reject;fr.onload=()=>{const img=new Image();img.onerror=reject;img.onload=()=>{const ratio=Math.min(1,1000/Math.max(img.width,img.height));const canvas=document.createElement('canvas');canvas.width=Math.round(img.width*ratio);canvas.height=Math.round(img.height*ratio);canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);resolve(canvas.toDataURL('image/jpeg',.82));};img.src=fr.result;};fr.readAsDataURL(file);});}catch{toast('อ่านรูปไม่ได้ ลองเลือกรูปใหม่');return null;}}
function showEditor(title,body,subtitle='',footer=true){const dialog=$('#editor');$('#editor-content').innerHTML=`<div class="dialog-head"><div><h2 id="editor-title">${esc(title)}</h2>${subtitle?`<p>${esc(subtitle)}</p>`:''}</div><button class="icon-btn" data-close-editor aria-label="ปิด">${icon('close')}</button></div><div class="dialog-body">${body}</div>${footer?'<div class="dialog-foot"><button class="btn primary" data-close-editor>เสร็จแล้ว</button></div>':''}`;$$('[data-close-editor]',dialog).forEach(b=>b.onclick=()=>dialog.close());if(!dialog.open)dialog.showModal();}
function openConfirm(title,message,action){showEditor(title,`<p style="font-size:13px;line-height:1.9;color:#8c8497">${esc(message)}</p><div style="display:flex;gap:10px;margin-top:24px"><button class="btn" data-cancel style="flex:1">ยกเลิก</button><button class="btn primary" data-confirm style="flex:1">ยืนยัน</button></div>`,'',false);$('[data-cancel]').onclick=()=>$('#editor').close();$('[data-confirm]').onclick=()=>{$('#editor').close();action();};}
function openAddSection(){sectionPickerOpen=!sectionPickerOpen;updateCMSPanel();}
function layoutChoices(section){
if(section.type==='social'||section.type==='buttons')return `<h3 style="font-size:13px;margin-top:20px">จำนวนคอลัมน์ของ Section</h3><div class="layout-options button-column-options">${[['stack','list','1 คอลัมน์'],['row','grid','2 คอลัมน์']].map(([value,ic,text])=>`<button class="layout-choice ${section.layout===value?'selected':''}" data-layout="${value}" aria-pressed="${section.layout===value}">${icon(ic)}${text}${section.layout===value?`<i class="selected-mark">${icon('check')}</i>`:''}</button>`).join('')}</div><p class="helper column-setting-note">ใช้รูปแบบเดียวกันกับทุกปุ่มใน Section นี้</p>`;
const options={bio:[['profile','user','โปรไฟล์'],['centered','user','กึ่งกลาง'],['cover','image','ภาพปก']],social:[['row','grid','แถวปุ่ม'],['stack','list','เต็มแถว']],buttons:[['row','grid','แถวปุ่ม'],['stack','list','เต็มแถว']],products:[['grid','grid','กริด'],['list','list','รายการ'],['slider','slider','สไลด์']],gallery:[['grid','grid','กริด'],['slider','slider','สไลด์']],location:[['map','pin','แผนที่'],['compact','list','แบบย่อ']],promo:[['card','layers','การ์ด'],['plain','text','เรียบง่าย']]}[section.type];if(!options)return '';return `<h3 style="font-size:13px;margin-top:20px">เลือกรูปแบบ</h3><div class="layout-options" style="grid-template-columns:repeat(${options.length},1fr)">${options.map(([value,ic,text])=>`<button class="layout-choice ${section.layout===value?'selected':''}" data-layout="${value}" aria-pressed="${section.layout===value}">${icon(ic)}${text}${section.layout===value?`<i class="selected-mark">${icon('check')}</i>`:''}</button>`).join('')}</div>`;}
function openSection(id){expandedSections.add(id);currentSection=null;updateCMSPanel();}
function blockEditor(b,i,count){return `<div class="block-card"><div class="block-toolbar"><b>${i+1}. ${b.type==='text'?'ข้อความ':b.type==='image'?'รูปภาพ':'ปุ่มลิงก์'}</b><button class="icon-btn" data-block-move="${i}" data-direction="-1" aria-label="ย้ายบล็อกขึ้น" ${i===0?'disabled':''}>${icon('up')}</button><button class="icon-btn" data-block-move="${i}" data-direction="1" aria-label="ย้ายบล็อกลง" ${i===count-1?'disabled':''}>${icon('down')}</button><button class="icon-btn" data-block-delete="${i}" aria-label="ลบบล็อก">${icon('trash')}</button></div>${b.type==='text'?`<textarea rows="3" data-block-index="${i}" data-block-field="text" aria-label="ข้อความในบล็อก">${esc(b.text)}</textarea>`:b.type==='button'?`<label>ชื่อปุ่ม<input data-block-index="${i}" data-block-field="text" value="${esc(b.text)}"></label><label style="margin-top:10px">ลิงก์<input type="url" data-block-index="${i}" data-block-field="url" value="${esc(b.url)}"></label>`:`<img src="${esc(safeImage(b.src))}" alt="ภาพตัวอย่าง" style="width:100%;height:100px;object-fit:cover;border-radius:7px;margin-bottom:10px"><label class="btn file-label">${icon('image')}เปลี่ยนรูป<input type="file" accept="image/png,image/jpeg,image/webp" data-block-upload="${i}"></label><label style="margin-top:10px">คำอธิบายภาพ<input data-block-index="${i}" data-block-field="alt" value="${esc(b.alt||'')}"></label>`}</div>`;}
function openProduct(id,fromHash=false){
  const state=publishedView?published:draft,p=state.products.find(x=>x.id===id);if(!p)return;const dialog=$('#product-dialog');dialog.setAttribute('style',applyTheme(state));
  $('#product-content').innerHTML=`<div class="product-modal-toolbar"><button class="icon-btn" data-close-product aria-label="กลับ">${icon('back')}</button><strong>เมนูบ้านก๋ง</strong><button class="icon-btn" data-share-product aria-label="แชร์สินค้า">${icon('share')}</button></div><div class="post-author">${avatar(state)}<div><b>${esc(state.profile.name)}</b><small>${esc(state.profile.location)}</small></div></div><div class="product-photos">${p.images.map(src=>`<img src="${esc(safeImage(src))}" alt="${esc(p.name)}">`).join('')}</div><div class="photo-dots">${p.images.map((_,i)=>`<i class="${i===0?'active':''}"></i>`).join('')}</div><div class="product-modal-body"><h2 id="product-title">${esc(p.name)}<span>฿${Number(p.price).toLocaleString('th-TH')}</span></h2><p class="price-note">ราคาตัวอย่าง</p><p style="margin-top:12px">${esc(p.description)}</p><span class="shop-pill">${esc(p.category)}</span><button class="btn wide" data-share-product>${icon('share')}แชร์เมนูนี้</button><p class="price-note" style="margin-top:20px;text-align:center">ภาพอาหารและราคาใช้ประกอบการทดลอง</p></div><div class="product-modal-footer">${shopButton('แชต LINE',link.line,'chat')}${shopButton('สั่งผ่าน Grab',link.grab,'bag',true)}</div>`;
  $$('[data-close-product]',dialog).forEach(b=>b.onclick=()=>dialog.close());$$('[data-share-product]',dialog).forEach(b=>b.onclick=()=>{const u=new URL(location.href);u.searchParams.set('view','store');u.hash=`product=${p.id}`;share(p.name,u.href);});
  const photos=$('.product-photos',dialog);photos.onscroll=()=>{const index=Math.round(photos.scrollLeft/photos.clientWidth);$$('.photo-dots i',dialog).forEach((el,i)=>el.classList.toggle('active',i===index));};
  if(!dialog.open)dialog.showModal();if(!fromHash){const u=new URL(location.href);u.hash=`product=${id}`;window.history.replaceState(null,'',u);}
}
$('#editor').addEventListener('close',()=>{currentSection=null;if(activeView==='cms')updateCMSPanel();});
$('#product-dialog').addEventListener('close',()=>{const u=new URL(location.href);u.hash='';window.history.replaceState(null,'',u);});
[$('#editor'),$('#product-dialog')].forEach(dialog=>dialog.addEventListener('click',e=>{if(e.target!==dialog)return;const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}));
$$('[data-view]').forEach(b=>b.onclick=()=>setView(b.dataset.view));
window.addEventListener('storage',event=>{if(event.key===STORAGE&&event.newValue){try{const value=JSON.parse(event.newValue);if(value.draft?.version===1){draft=upgradeState(value.draft);published=upgradeState(value.published||clone(defaults));render();}}catch{}}});
const FONT_OPTIONS=[['system','System · ฟอนต์ระบบ'],['sans','Sans · Tahoma'],['rounded','Rounded · Sukhumvit'],['serif','Serif · Georgia / Ayuthaya']];
function fontStack(key){return {system:"-apple-system,BlinkMacSystemFont,'Thonburi',sans-serif",sans:"Tahoma,'Thonburi',sans-serif",rounded:"'Sukhumvit Set','Thonburi',sans-serif",serif:"Georgia,'Ayuthaya',serif"}[key]||"-apple-system,BlinkMacSystemFont,'Thonburi',sans-serif";}
function validColor(value,fallback='#FFFFFF'){return /^#[0-9a-f]{6}$/i.test(value||'')?value:fallback;}
function inkOn(color){const c=validColor(color,'#F3F3F3');const channels=c.match(/[a-f\d]{2}/gi).map(x=>parseInt(x,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return channels.reduce((n,v,i)=>n+v*[.2126,.7152,.0722][i],0)<.24?'#FFFFFF':'#24242A';}
function fontOptions(value){return FONT_OPTIONS.map(([id,label])=>`<option value="${id}" ${id===value?'selected':''}>${label}</option>`).join('');}
function typographyPanel(){return `<div class="setting-panel"><h2>ตัวอักษรของหน้าร้าน</h2><p>ตั้งค่าฟอนต์ทั้งร้าน ส่วน Top bar เลือกฟอนต์แยกได้</p><div class="form-stack"><label>รูปแบบฟอนต์<select data-font-family>${fontOptions(draft.fontFamily)}</select></label><label class="font-size-label">ขนาดตัวอักษร <output id="font-size-value">${draft.fontSize} px</output><input type="range" min="11" max="18" step="1" value="${draft.fontSize}" data-font-size></label></div><div class="font-sample" style="font-family:${fontStack(draft.fontFamily)};font-size:${draft.fontSize}px">บ้านก๋ง · มื้อเช้าอุ่น ๆ ในแบบของเรา<br><span>Breakfast, made with love.</span></div></div>`;}
function bindTypography(root){
  const family=$('[data-font-family]',root);if(family)family.onchange=()=>{remember();draft.fontFamily=family.value;changed();const sample=$('.font-sample',root);if(sample)sample.style.fontFamily=fontStack(draft.fontFamily);};
  const size=$('[data-font-size]',root);if(size){size.onpointerdown=remember;size.onkeydown=e=>{if(e.key.startsWith('Arrow'))remember();};size.oninput=()=>{draft.fontSize=Math.max(11,Math.min(18,Number(size.value)));changed();$('#font-size-value',root).textContent=`${draft.fontSize} px`;$ ('.font-sample',root).style.fontSize=`${draft.fontSize}px`;};}
}
function inlineEditor(s){
 let out=`<label class="inline-title-label">ชื่อ Section<input data-ie-field="title" value="${esc(s.title)}" maxlength="80"></label>${layoutChoices(s)}`;
 if(s.type==='topbar')out+=`<div class="inline-subcard"><h3>ชื่อหรือโลโก้</h3><div class="inline-choice-row">${[['text','text','ใช้ชื่อ'],['logo','image','ใช้โลโก้']].map(([v,ic,t])=>`<button class="btn ${s.mode===v?'soft':''}" data-ie-choice="mode" data-value="${v}" aria-pressed="${s.mode===v}">${icon(ic)}${t}</button>`).join('')}</div>${s.mode==='logo'?`<div class="topbar-logo-upload">${s.logo?`<img src="${esc(safeImage(s.logo))}" alt="โลโก้ของร้าน">`:'<span class="helper">ยังไม่มีโลโก้ ระบบจะแสดงชื่อแทน</span>'}<label class="btn file-label">${icon('image')}อัปโหลดโลโก้<input data-ie-logo type="file" accept="image/png,image/jpeg,image/webp"></label>${s.logo?'<button class="text-action" data-ie-remove-logo>ลบโลโก้</button>':''}</div>`:''}<div class="form-stack"><label>ข้อความชื่อ / ชื่อสำรอง<input data-ie-field="text" value="${esc(s.text||'')}" maxlength="80" placeholder="baankong"></label><label>ฟอนต์เฉพาะชื่อ Top bar<select data-ie-field="font">${fontOptions(s.font)}</select></label><label>สีพื้น Top bar<input type="color" data-ie-field="background" value="${validColor(s.background)}"></label></div></div><div class="inline-subcard"><h3>รูปแบบปุ่มเมนู</h3><div class="menu-style-options">${[['circle','dots','จุดนอนในวงกลม'],['bars','menu','ขีด'],['vertical','vertical','จุดแนวตั้ง']].map(([v,ic,t])=>`<button class="menu-style-option ${s.menuStyle===v?'selected':''}" data-ie-choice="menuStyle" data-value="${v}" aria-pressed="${s.menuStyle===v}"><span class="menu-demo ${v==='circle'?'menu-circle':''}">${icon(ic)}</span><span>${t}</span></button>`).join('')}</div></div>`;
 if(s.type==='bio')out+=`<div class="inline-subcard"><h3>ข้อมูลร้าน</h3><div class="form-stack">${[['name','ชื่อร้าน'],['location','พื้นที่ / จังหวัด'],['hours','เวลาเปิด–ปิด']].map(([field,label])=>`<label>${label}<input data-profile-field="${field}" value="${esc(draft.profile[field])}"></label>`).join('')}<label>แนะนำร้าน<textarea data-profile-field="bio" rows="3">${esc(draft.profile.bio)}</textarea></label></div></div>`;
 if(s.type==='social'||s.type==='buttons')out+=`<div class="inline-section-heading"><h3>${s.type==='social'?'แพลตฟอร์ม':'ปุ่ม DIY'} <span>${s.buttons.length} ปุ่ม</span></h3><p class="helper">${s.type==='social'?'เลือกแพลตฟอร์มเพื่อใช้โลโก้และสีอัตโนมัติ บนมือถือพยายามเปิดแอป ถ้าไม่รองรับจะเปิดเว็บ':'ตั้งชื่อ ลิงก์ ไอคอน และสีได้เอง เช่น ที่จอดรถ จองโต๊ะ หรือรายละเอียดเพิ่มเติม'}</p></div>${s.buttons.map((b,i)=>s.type==='social'?platformEditor(b,i,s.buttons.length):contactEditor(b,i,s.buttons.length)).join('')}<button class="btn wide" data-contact-add>${icon('plus')}${s.type==='social'?'เพิ่มแพลตฟอร์ม':'เพิ่มปุ่ม DIY'}</button>`;
 if(s.type==='products')out+=`${s.layout==='grid'?`<div class="control-row"><span>จำนวนคอลัมน์</span><div class="segmented">${[2,3,4].map(n=>`<button data-ie-columns="${n}" class="${s.columns===n?'selected':''}">${n}</button>`).join('')}</div></div>`:''}${[['showNames','แสดงชื่อและราคา'],['collapsible','พับ–เปิดรายการเมนู']].map(([key,label])=>`<div class="control-row"><span>${label}</span><button class="switch" role="switch" aria-label="${label}" aria-checked="${s[key]}" data-ie-toggle="${key}"></button></div>`).join('')}<details class="inline-subdetails"><summary>${icon('grid')}จัดการเมนู ${draft.products.length} รายการ ${icon('expand')}</summary><div>${draft.products.map(p=>`<div class="product-admin-row"><img src="${esc(safeImage(p.images[0]))}" alt=""><div><label>ชื่อเมนู<input data-ie-product="${p.id}" data-field="name" value="${esc(p.name)}"></label></div><label>ราคา<input class="price-input" type="number" min="0" data-ie-product="${p.id}" data-field="price" value="${p.price}"></label></div>`).join('')}</div></details>`;
 if(s.type==='gallery')out+=`<div class="gallery-editor-images">${s.images.map((src,i)=>`<div><img src="${esc(safeImage(src))}" alt="รูปที่ ${i+1}"><button data-ie-gallery-delete="${i}" aria-label="ลบรูป ${i+1}">${icon('close')}</button></div>`).join('')}</div><label class="btn file-label">${icon('plus')}เพิ่มรูป<input type="file" data-ie-gallery accept="image/png,image/jpeg,image/webp"></label>`;
 if(s.type==='promo')out+=`<div class="form-stack"><label>ข้อความ<textarea data-ie-field="body" rows="3">${esc(s.body)}</textarea></label><label>ข้อความปุ่ม<input data-ie-field="button" value="${esc(s.button)}"></label><label>ลิงก์<input data-ie-field="url" value="${esc(s.url)}"></label></div>`;
 if(s.type==='diy')out+=`${s.blocks.map((b,i)=>blockEditor(b,i,s.blocks.length)).join('')}<div class="block-add">${[['text','text','ข้อความ'],['image','image','รูปภาพ'],['button','external','ปุ่มลิงก์']].map(([type,ic,text])=>`<button class="btn" data-add-block="${type}">${icon(ic)}${text}</button>`).join('')}</div>`;
 if(s.type==='shortcuts')out+='<p class="helper">ทางลัดเชื่อมไปยังเมนู เครื่องดื่ม บรรยากาศ และข้อมูลร้านที่เปิดใช้งาน</p>';
 if(s.type==='location')out+='<p class="helper">แสดงข้อมูลพิกัดบ้านก๋งและปุ่มนำทาง เลือก Layout แผนที่หรือแบบย่อด้านบนได้</p>';
 return out;
}
const CONTACT_ICONS=[['car','ที่จอดรถ'],['chat','แชต'],['bag','สั่งซื้อ'],['phone','โทร'],['pin','แผนที่'],['facebook','Facebook'],['image','รูปภาพ'],['external','ลิงก์'],['clock','เวลา'],['user','บุคคล'],['spark','ดาว'],['share','แชร์']];
function contactEditor(b,i,count){return `<div class="contact-editor-card" data-contact-card="${i}"><div class="contact-editor-head"><span class="contact-editor-icon" style="background:${validColor(b.background)};color:${inkOn(b.background)}">${icon(b.icon)}</span><strong>ปุ่ม ${i+1}</strong><div><button class="icon-btn" data-contact-move="${i}" data-direction="-1" aria-label="ย้ายปุ่ม ${i+1} ขึ้น" ${i===0?'disabled':''}>${icon('up')}</button><button class="icon-btn" data-contact-move="${i}" data-direction="1" aria-label="ย้ายปุ่ม ${i+1} ลง" ${i===count-1?'disabled':''}>${icon('down')}</button><button class="icon-btn" data-contact-remove="${i}" aria-label="ลบปุ่ม ${i+1}">${icon('trash')}</button></div></div><div class="form-stack"><label>ข้อความปุ่ม<input data-contact-index="${i}" data-contact-field="text" value="${esc(b.text)}" maxlength="80"></label><label>ลิงก์<input data-contact-index="${i}" data-contact-field="url" value="${esc(b.url)}" placeholder="https:// หรือ tel:"></label><div class="contact-style-row"><label>ไอคอน<select data-contact-index="${i}" data-contact-field="icon">${CONTACT_ICONS.map(([value,text])=>`<option value="${value}" ${b.icon===value?'selected':''}>${text}</option>`).join('')}</select></label><label>สีพื้น<input type="color" data-contact-index="${i}" data-contact-field="background" value="${validColor(b.background)}"></label></div></div></div>`;}
function sectionPickerMarkup(){return `<div class="inline-module-picker"><h3>เลือกโมดูล</h3><div class="add-options">${[['bio','โปรไฟล์ร้าน','ข้อความแนะนำร้าน'],['social','Social Platforms','โลโก้ สีแพลตฟอร์ม และเปิดแอป'],['buttons','ปุ่ม DIY','ชื่อ ลิงก์ สี และไอคอนที่เลือกเอง'],['products','สินค้า / เมนู','กริด รายการ หรือสไลด์'],['gallery','แกลเลอรี','รูปบรรยากาศร้าน'],['location','แผนที่','พิกัดและปุ่มนำทาง'],['promo','ประกาศ','ข้อความและปุ่ม'],['diy','DIY Section','จัดข้อความ รูป และลิงก์เอง']].map(([type,title,desc])=>`<button class="add-option" data-new-section="${type}"><span>${icon(typeIcon[type])}</span><span><b>${title}</b><p>${desc}</p></span>${icon('plus')}</button>`).join('')}</div></div>`;}
function bindSectionPicker(root){$$('[data-new-section]',root).forEach(button=>button.onclick=()=>{remember();const type=button.dataset.newSection;let s=clone(defaults.sections.find(x=>x.type===type)||{type:'diy',title:'เรื่องราวของเรา',layout:'blocks',blocks:[{type:'text',text:'เรื่องราวในแบบของเรา'}]});s.id=`${type}-${Date.now()}`;s.enabled=true;draft.sections.push(s);expandedSections.add(s.id);sectionPickerOpen=false;changed();updateCMSPanel();});}
function bindInlineEditors(root){
 $$('[data-inline-section]',root).forEach(scope=>{
  const s=editableModule(scope.dataset.inlineSection);if(!s)return;
  const repaint=()=>{changed();updateCMSPanel();};
  $$('[data-ie-field]',scope).forEach(input=>{input.onfocus=remember;const save=()=>{const field=input.dataset.ieField;if(field==='background'&&!/^#[0-9a-f]{6}$/i.test(input.value))return;s[field]=input.value;changed();if(field==='title'){const card=scope.closest('.module-card');const title=card?$('.module-title',card):null;if(title)title.textContent=s.title;}};if(input.tagName==='SELECT')input.onchange=save;else input.oninput=save;});
  $$('[data-layout]',scope).forEach(button=>button.onclick=()=>{remember();s.layout=button.dataset.layout;repaint();});
  $$('[data-ie-choice]',scope).forEach(button=>button.onclick=()=>{remember();s[button.dataset.ieChoice]=button.dataset.value;repaint();});
  $$('[data-ie-columns]',scope).forEach(button=>button.onclick=()=>{remember();s.columns=Number(button.dataset.ieColumns);repaint();});
  $$('[data-ie-toggle]',scope).forEach(button=>button.onclick=()=>{remember();s[button.dataset.ieToggle]=!s[button.dataset.ieToggle];repaint();});
  $$('[data-ie-product]',scope).forEach(input=>{input.onfocus=remember;input.oninput=()=>{const p=draft.products.find(p=>p.id===input.dataset.ieProduct);p[input.dataset.field]=input.dataset.field==='price'?Math.max(0,Number(input.value)||0):input.value;changed();};});
  $$('[data-contact-field]',scope).forEach(input=>{input.onfocus=remember;const save=()=>{const b=s.buttons[Number(input.dataset.contactIndex)];b[input.dataset.contactField]=input.value;if(s.type==='social'&&input.dataset.contactField==='background')b.colorMode='custom';changed();const warning=$(`[data-platform-warning="${input.dataset.contactIndex}"]`,scope);if(warning)warning.hidden=matchesPlatform(b.url,b.platform);const badge=$('.contact-editor-icon',input.closest('.contact-editor-card'));if(badge){badge.style.background=validColor(b.background);badge.style.color=inkOn(b.background);badge.style.setProperty('--logo-cutout',validColor(b.background));badge.innerHTML=s.type==='social'?platformLogo(b.platform):icon(b.icon);if(s.type==='social'&&input.dataset.contactField==='background')b.colorMode='custom';}};if(input.tagName==='SELECT')input.onchange=save;else input.oninput=save;});
  bindPlatformControls(scope,s,repaint);
  const add=$('[data-contact-add]',scope);if(add)add.onclick=()=>{remember();s.buttons.push(s.type==='social'?{text:'Instagram',url:'https://www.instagram.com/',platform:'instagram',background:PLATFORMS.instagram.color,colorMode:'brand'}:{text:'ปุ่มใหม่',url:'https://',icon:'external',background:'#F3F3F3'});repaint();};
  $$('[data-contact-remove]',scope).forEach(button=>button.onclick=()=>{remember();s.buttons.splice(Number(button.dataset.contactRemove),1);repaint();});
  $$('[data-contact-move]',scope).forEach(button=>button.onclick=()=>{const i=Number(button.dataset.contactMove),target=i+Number(button.dataset.direction);if(target<0||target>=s.buttons.length)return;remember();const [b]=s.buttons.splice(i,1);s.buttons.splice(target,0,b);repaint();});
  const logo=$('[data-ie-logo]',scope);if(logo)logo.onchange=async()=>{const src=await readUpload(logo.files[0]);if(src){remember();s.logo=src;repaint();}};
  const removeLogo=$('[data-ie-remove-logo]',scope);if(removeLogo)removeLogo.onclick=()=>{remember();s.logo='';repaint();};
  const gallery=$('[data-ie-gallery]',scope);if(gallery)gallery.onchange=async()=>{const src=await readUpload(gallery.files[0]);if(src){remember();s.images.push(src);repaint();}};
  $$('[data-ie-gallery-delete]',scope).forEach(button=>button.onclick=()=>{remember();s.images.splice(Number(button.dataset.ieGalleryDelete),1);repaint();});
  $$('[data-add-block]',scope).forEach(button=>button.onclick=()=>{remember();s.blocks.push(button.dataset.addBlock==='text'?{type:'text',text:'เรื่องราวใหม่ของร้าน'}:button.dataset.addBlock==='image'?{type:'image',src:image('shop'),alt:'บรรยากาศร้าน'}:{type:'button',text:'ติดต่อเรา',url:link.line});repaint();});
  $$('[data-block-delete]',scope).forEach(button=>button.onclick=()=>{remember();s.blocks.splice(Number(button.dataset.blockDelete),1);repaint();});
  $$('[data-block-move]',scope).forEach(button=>button.onclick=()=>{remember();const i=Number(button.dataset.blockMove),[block]=s.blocks.splice(i,1);s.blocks.splice(i+Number(button.dataset.direction),0,block);repaint();});
  $$('[data-block-field]',scope).forEach(input=>{input.onfocus=remember;input.oninput=()=>{s.blocks[Number(input.dataset.blockIndex)][input.dataset.blockField]=input.value;changed();};});
  $$('[data-block-upload]',scope).forEach(input=>input.onchange=async()=>{const src=await readUpload(input.files[0]);if(src){remember();s.blocks[Number(input.dataset.blockUpload)].src=src;repaint();}});
 });
}

function inferPlatform(button){
 if(PLATFORMS[button.platform])return button.platform;
 try{
  const u=new URL(button.url),host=u.hostname.toLowerCase();
  if(PLATFORMS.lineman.hosts.some(domain=>host===domain||host.endsWith('.'+domain)))return 'lineman';
  if(host==='bit.ly'){if(/grab/i.test(button.text||'')||/grabbaankong/i.test(u.pathname))return 'grab';if(/แผนที่|นำทาง|google maps/i.test(button.text||'')||/mapbaankong/i.test(u.pathname))return 'googlemaps';return null;}
  for(const [key,p] of Object.entries(PLATFORMS)){
   if(!p.hosts.some(domain=>host===domain||host.endsWith('.'+domain)))continue;
   if(key==='googlemaps'&&!isGoogleMapsURL(u))continue;
   return key;
  }
 }catch{}
 return null;
}
function isGoogleMapsURL(u){return ['maps.app.goo.gl','goo.gl','g.page','bit.ly'].includes(u.hostname)||u.hostname.startsWith('maps.google.')||/^\/maps(?:\/|$)/.test(u.pathname);}
function platformLogo(key){
 const svgs={
 facebook:'<path d="M14 22v-9h3l.5-4H14V7c0-1.2.5-2 2-2h2V1.5C17 1.2 15.7 1 14.5 1 11 1 9 3.2 9 6.8V9H6v4h3v9Z" fill="currentColor"/>',
 instagram:'<rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>',
 line:'<path d="M22 10.5C22 5.8 17.5 2 12 2S2 5.8 2 10.5c0 4.2 3.6 7.7 8.4 8.4l-.3 2.1c0 .6.5.8 1 .5 5-2.7 10.9-6.5 10.9-11Z" fill="currentColor"/><text x="12" y="12.8" text-anchor="middle" font-family="Arial,sans-serif" font-size="6" font-weight="900" fill="var(--logo-cutout)">LINE</text>',
 youtube:'<rect x="1" y="4" width="22" height="16" rx="5" fill="currentColor"/><path d="m10 8 6 4-6 4Z" fill="var(--logo-cutout)"/>',
 tiktok:'<path d="M14 2h4c.3 2.5 1.5 4 4 4.5v4c-1.5-.1-3-.6-4-1.5v7a7 7 0 1 1-7-7v4a3 3 0 1 0 3 3Z" fill="currentColor"/>',
 googlemaps:'<path d="M19 9c0 5-7 13-7 13S5 14 5 9a7 7 0 1 1 14 0Z" fill="currentColor"/><circle cx="12" cy="9" r="2.7" fill="var(--logo-cutout)"/>',
 lineman:'<rect x="1" y="3" width="22" height="18" rx="4" fill="currentColor"/><text x="12" y="10" text-anchor="middle" font-family="Arial,sans-serif" font-size="6" font-weight="900" fill="var(--logo-cutout)">LINE</text><text x="12" y="17" text-anchor="middle" font-family="Arial,sans-serif" font-size="6" font-weight="900" fill="var(--logo-cutout)">MAN</text>',
 grab:'<text x="12" y="16" text-anchor="middle" font-family="Arial,sans-serif" font-size="10" font-weight="bold" fill="currentColor">Grab</text>'
 };
 return `<svg class="platform-logo" viewBox="0 0 24 24" aria-hidden="true">${svgs[key]||svgs.facebook}</svg>`;
}
function matchesPlatform(url,platform){try{const u=new URL(url);return u.protocol==='https:'&&(platform!=='googlemaps'||isGoogleMapsURL(u))&&PLATFORMS[platform]?.hosts.some(host=>u.hostname===host||u.hostname.endsWith('.'+host));}catch{return false;}}
function platformDestination(button,ua=typeof navigator!=='undefined'?navigator.userAgent||'':''){
 const web=safeURL(button.url),platform=PLATFORMS[button.platform];
 if(!platform||!matchesPlatform(web,button.platform))return {href:web,web,mode:'web'};
 // HTTPS links are delegated to the OS (Universal/App Links) and naturally remain web links if the app cannot open.
 // Chrome's native fallback is used instead of timers, so returning from an app never causes a surprise redirect.
 const androidChrome=/Android/i.test(ua)&&/Chrome\//i.test(ua)&&!(/FBAN|FBAV|Instagram|; wv\)/i.test(ua));
 if(androidChrome&&platform.package){const u=new URL(web);return {href:`intent://${u.host}${u.pathname}${u.search}#Intent;scheme=https;package=${platform.package};S.browser_fallback_url=${encodeURIComponent(web)};end`,web,mode:'intent'};}
 return {href:web,web,mode:/Android|iPhone|iPad|iPod/i.test(ua)?'universal':'web'};
}
function platformButton(button){const route=platformDestination(button),color=validColor(button.background,PLATFORMS[button.platform]?.color||'#333333');return `<a class="shop-button platform-button" href="${esc(route.href)}" ${route.mode==='web'?'target="_blank" rel="noopener noreferrer"':''} data-open-mode="${route.mode}" style="background:${color};color:${inkOn(color)};--logo-cutout:${color}" aria-label="${esc(button.text)}">${platformLogo(button.platform)}<span>${esc(button.text)}</span></a>`;}
function platformEditor(button,index,count){
 const p=PLATFORMS[button.platform]||PLATFORMS.facebook,color=validColor(button.background,p.color);
 return `<div class="contact-editor-card" data-contact-card="${index}"><div class="contact-editor-head"><span class="contact-editor-icon" style="background:${color};color:${inkOn(color)};--logo-cutout:${color}">${platformLogo(button.platform)}</span><strong>${esc(p.name)}</strong><div><button class="icon-btn" data-contact-move="${index}" data-direction="-1" aria-label="ย้ายแพลตฟอร์มขึ้น" ${index===0?'disabled':''}>${icon('up')}</button><button class="icon-btn" data-contact-move="${index}" data-direction="1" aria-label="ย้ายแพลตฟอร์มลง" ${index===count-1?'disabled':''}>${icon('down')}</button><button class="icon-btn" data-contact-remove="${index}" aria-label="ลบแพลตฟอร์ม">${icon('trash')}</button></div></div><div class="form-stack"><label>แพลตฟอร์ม<select data-platform-select="${index}">${Object.entries(PLATFORMS).map(([key,value])=>`<option value="${key}" ${key===button.platform?'selected':''}>${value.name}</option>`).join('')}</select></label><label>ข้อความบนปุ่ม<input data-contact-index="${index}" data-contact-field="text" value="${esc(button.text)}" maxlength="80"></label><label>ลิงก์ ${esc(p.name)}<input data-contact-index="${index}" data-contact-field="url" value="${esc(button.url)}" placeholder="https://"></label><div class="platform-color-row"><label>สีพื้นปุ่ม<input type="color" data-contact-index="${index}" data-contact-field="background" value="${color}"></label><button class="btn" data-platform-color-reset="${index}">ใช้สี ${esc(p.name)}</button></div><p class="platform-link-warning" data-platform-warning="${index}" ${matchesPlatform(button.url,button.platform)?'hidden':''}>ลิงก์ยังไม่ตรงแพลตฟอร์ม ระบบจะใช้ลิงก์เว็บปกติ</p><span class="platform-opening-note">${icon('phone')}อัตโนมัติ · เปิดแอปเมื่อรองรับ / เว็บสำรอง</span></div></div>`;
}
function bindPlatformControls(scope,section,repaint){
 if(section.type!=='social')return;
 $$('[data-platform-select]',scope).forEach(input=>input.onchange=()=>{const b=section.buttons[Number(input.dataset.platformSelect)],old=PLATFORMS[b.platform];remember();b.platform=input.value;b.background=PLATFORMS[b.platform].color;b.colorMode='brand';if(!b.text||b.text===old?.name)b.text=PLATFORMS[b.platform].name;repaint();});
 $$('[data-platform-color-reset]',scope).forEach(button=>button.onclick=()=>{remember();const b=section.buttons[Number(button.dataset.platformColorReset)];b.background=PLATFORMS[b.platform].color;b.colorMode='brand';repaint();});
}

function editableModule(id){return id===draft.header.id?draft.header:id===draft.footer.social.id?draft.footer.social:draft.sections.find(s=>s.id===id);}
function cmsPanelMarkup(){return cmsTab==='header'?headerPanel():cmsTab==='footer'?footerPanel():cmsTab==='sections'?modulePanel():cmsTab==='theme'?themePanel():profilePanel();}
function headerPanel(){return `<div class="setting-panel chrome-settings"><div class="chrome-setting-title"><div><h2>Header</h2><p>แถบเมนูติดด้านบน เมื่อเลื่อนหน้าร้าน</p></div><button class="switch" role="switch" aria-label="แสดง Header" aria-checked="${draft.header.enabled}" data-chrome-toggle="header"></button></div><div class="inline-editor" data-inline-section="${draft.header.id}">${inlineEditor(draft.header).replace('ชื่อ Section','ชื่อเมนู')}</div></div>`;}
function footerPanel(){
 const f=draft.footer;
 return `<div class="setting-panel chrome-settings"><div class="chrome-setting-title"><div><h2>Footer</h2><p>แถบเมนูติดด้านล่าง เปิด–ปิดได้</p></div><button class="switch" role="switch" aria-label="แสดง Footer" aria-checked="${f.enabled}" data-chrome-toggle="footer"></button></div><div class="footer-mode-options">${[['social','chat','ปุ่ม Social','เลือกแพลตฟอร์ม · 1–2 คอลัมน์'],['icons','grid','เมนูไอคอน DIY','ไอคอนบน คำล่าง · สูงสุด 5 ช่อง']].map(([value,ic,title,note])=>`<button class="footer-mode-option ${f.mode===value?'selected':''}" data-footer-mode="${value}" aria-pressed="${f.mode===value}">${icon(ic)}<strong>${title}</strong><small>${note}</small></button>`).join('')}</div><label class="footer-background-control">สีพื้นแถบ Footer<input type="color" data-footer-background value="${validColor(f.background)}"></label>${!f.enabled?'<p class="onboarding-note">Footer ยังปิดอยู่ ตั้งค่ารอไว้ได้ แล้วเปิดสวิตช์ด้านบนเพื่อดูตัวอย่าง</p>':''}</div>${f.mode==='social'?`<div class="setting-panel"><div class="inline-editor" data-inline-section="${f.social.id}">${inlineEditor(f.social)}</div></div>`:`<div class="setting-panel"><div class="inline-section-heading"><h3>เมนูไอคอน <span>${f.items.length} / 5 ช่อง</span></h3><p class="helper">แต่ละช่องเรียงไอคอนด้านบน และข้อความด้านล่าง</p></div>${f.items.map((item,index)=>footerItemEditor(item,index,f.items.length)).join('')}<button class="btn wide" data-footer-add ${f.items.length>=5?'disabled':''}>${icon('plus')}${f.items.length>=5?'ครบ 5 ช่องแล้ว':'เพิ่มเมนูไอคอน'}</button><p class="helper">ลิงก์ภายในหน้าร้านใช้ #section-products สำหรับเมนู หรือ #section-location สำหรับข้อมูลร้านได้</p></div>`}`;
}
function footerItemEditor(item,index,count){return `<div class="contact-editor-card"><div class="contact-editor-head"><span class="contact-editor-icon">${icon(item.icon)}</span><strong>ช่อง ${index+1}</strong><div><button class="icon-btn" data-footer-item-move="${index}" data-direction="-1" aria-label="ย้ายเมนู Footer ไปซ้าย" ${index===0?'disabled':''}>${icon('up')}</button><button class="icon-btn" data-footer-item-move="${index}" data-direction="1" aria-label="ย้ายเมนู Footer ไปขวา" ${index===count-1?'disabled':''}>${icon('down')}</button><button class="icon-btn" data-footer-item-remove="${index}" aria-label="ลบเมนู Footer">${icon('trash')}</button></div></div><div class="form-stack"><label>ไอคอน<select data-footer-item="${index}" data-field="icon">${[['grid','เมนู'],...CONTACT_ICONS].map(([value,label])=>`<option value="${value}" ${item.icon===value?'selected':''}>${label}</option>`).join('')}</select></label><label>ข้อความใต้ไอคอน<input data-footer-item="${index}" data-field="text" value="${esc(item.text)}" maxlength="40"></label><label>ลิงก์<input data-footer-item="${index}" data-field="url" value="${esc(item.url)}" placeholder="https:// หรือ #section-products"></label></div></div>`;}
function footerMarkup(state){
 const f=state.footer;if(!f?.enabled)return '';
 const content=f.mode==='social'?`<div class="shop-actions contact-${esc(f.social.layout)}">${f.social.buttons.map(b=>platformButton(b)).join('')}</div>`:`<nav class="footer-icon-nav" aria-label="เมนูด้านล่าง" style="--footer-columns:${Math.max(1,Math.min(5,f.items.length))}">${f.items.slice(0,5).map(item=>{const internal=/^#section-[a-z0-9-]+$/i.test(item.url);return `<a class="footer-icon-link" href="${esc(internal?item.url:safeURL(item.url))}" ${internal?`data-footer-anchor="${esc(item.url.slice(1))}"`:'target="_blank" rel="noopener noreferrer"'}>${icon(item.icon)}<span>${esc(item.text)}</span></a>`;}).join('')}</nav>`;
 return `<footer class="shop-floating-footer" aria-label="Footer หน้าร้าน" style="--footer-bg:${validColor(f.background)};--footer-ink:${inkOn(f.background)}">${content}</footer>`;
}
function addFooterItem(){if(draft.footer.items.length>=5)return false;remember();draft.footer.items.push({text:'เมนูใหม่',url:'https://',icon:'external'});return true;}
function bindChromeControls(root){
 $$('[data-chrome-toggle]',root).forEach(button=>button.onclick=()=>{remember();const config=button.dataset.chromeToggle==='header'?draft.header:draft.footer;config.enabled=!config.enabled;changed();updateCMSPanel();});
 $$('[data-footer-mode]',root).forEach(button=>button.onclick=()=>{remember();draft.footer.mode=button.dataset.footerMode;changed();updateCMSPanel();});
 const bg=$('[data-footer-background]',root);if(bg){bg.onfocus=remember;bg.oninput=()=>{draft.footer.background=bg.value;changed();};}
 const add=$('[data-footer-add]',root);if(add)add.onclick=()=>{if(addFooterItem()){changed();updateCMSPanel();}};
 $$('[data-footer-item]',root).forEach(input=>{input.onfocus=remember;const change=()=>{const item=draft.footer.items[Number(input.dataset.footerItem)];item[input.dataset.field]=input.value;changed();if(input.dataset.field==='icon'){const badge=$('.contact-editor-icon',input.closest('.contact-editor-card'));if(badge)badge.innerHTML=icon(item.icon);}};if(input.tagName==='SELECT')input.onchange=change;else input.oninput=change;});
 $$('[data-footer-item-remove]',root).forEach(button=>button.onclick=()=>{remember();draft.footer.items.splice(Number(button.dataset.footerItemRemove),1);changed();updateCMSPanel();});
 $$('[data-footer-item-move]',root).forEach(button=>button.onclick=()=>{const from=Number(button.dataset.footerItemMove),to=from+Number(button.dataset.direction);if(to<0||to>=draft.footer.items.length)return;remember();const [item]=draft.footer.items.splice(from,1);draft.footer.items.splice(to,0,item);changed();updateCMSPanel();});
}

render();
const sharedProduct=location.hash.match(/^#product=([a-z0-9-]+)$/)?.[1];if(sharedProduct)openProduct(sharedProduct,true);
