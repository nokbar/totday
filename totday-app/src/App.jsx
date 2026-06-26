import { useState, useEffect, useCallback, Fragment } from "react";

// ─── DESIGN SYSTEM · TotDay Luxury ───────────────────────────────────────────
const C = {
  bg:"#F4F0E9", white:"#FFFFFF",
  sand:"#F2E6DC", lightGray:"#F4EDE3",
  champ:"#EBD9C8", champ2:"#F4EDE3",
  dark:"#221D18", brown:"#221D18",
  ink2:"#5C554B", gray:"#857E74", taupe:"#948D83",
  line:"#ECE5DA",
  blush:"#D2A296", blushDark:"#BD877C", blushBg:"#F4E6E2",
  gold:"#D9B679", goldSoft:"#E8D4A0", goldBg:"#F4EDD9",
  teal:"#5E8A7D", tealLight:"#86AE95", tealBg:"#E0EDEA",
  rose:"#BD877C", roseBg:"#F4E6E2",
};
const font  = "'Hanken Grotesk', system-ui, -apple-system, sans-serif";
const fb    = "'Hanken Grotesk', system-ui, -apple-system, sans-serif";
const GLASS = "#FFFFFF";
const SHADOW= "0 1px 2px rgba(33,28,23,0.04),0 14px 30px -20px rgba(33,28,23,0.14)";
const SHADOW_HOVER="0 1px 2px rgba(33,28,23,0.04),0 20px 40px -18px rgba(33,28,23,0.20)";
const BLUR  = "none";

const S = {
  app:   { fontFamily:fb, background:C.bg, minHeight:"100vh", color:C.dark },
  page:  { maxWidth:1040, margin:"0 auto", padding:"44px 36px" },
  card:  { background:C.white, borderRadius:20, padding:28, border:`1px solid ${C.line}`, boxShadow:SHADOW },
  h1:    { fontFamily:font, fontSize:34, color:C.dark, fontWeight:600, letterSpacing:"-0.02em", marginBottom:6 },
  h2:    { fontFamily:font, fontSize:22, color:C.dark, fontWeight:600, letterSpacing:"-0.01em", marginBottom:14 },
  h3:    { fontFamily:font, fontSize:17, color:C.dark, fontWeight:500, marginBottom:10 },
  sub:   { fontSize:14, color:C.gray, marginBottom:24, lineHeight:1.6 },
  label: { fontSize:11, letterSpacing:"0.1em", color:C.gray, textTransform:"uppercase", fontWeight:600, display:"block", marginBottom:6 },
  input: { width:"100%", padding:"12px 16px", borderRadius:12, border:`1.5px solid ${C.line}`, background:"rgba(255,255,255,0.85)", fontSize:14, fontFamily:fb, color:C.dark, outline:"none", boxSizing:"border-box", transition:"border-color .2s,box-shadow .2s" },
  select:{ width:"100%", padding:"12px 16px", borderRadius:12, border:`1.5px solid ${C.line}`, background:"rgba(255,255,255,0.85)", fontSize:14, fontFamily:fb, color:C.dark, outline:"none", boxSizing:"border-box" },
  btn:   { padding:"12px 26px", borderRadius:100, border:"none", background:C.dark, color:C.white, cursor:"pointer", fontSize:13.5, fontFamily:fb, fontWeight:600, letterSpacing:"0.01em", transition:"all .2s" },
  btnO:  { padding:"11px 24px", borderRadius:100, border:`1.5px solid ${C.line}`, background:"rgba(255,255,255,0.7)", color:C.dark, cursor:"pointer", fontSize:13.5, fontFamily:fb, fontWeight:600, transition:"all .2s" },
  btnR:  { padding:"12px 26px", borderRadius:100, border:"none", background:C.blushDark, color:C.white, cursor:"pointer", fontSize:13.5, fontFamily:fb, fontWeight:600 },
  btnSm: { padding:"6px 14px", borderRadius:100, border:`1px solid ${C.line}`, background:"rgba(255,255,255,0.7)", color:C.gray, cursor:"pointer", fontSize:11.5, fontFamily:fb, fontWeight:600, transition:"all .2s" },
  chip:  (on)=>({ padding:"9px 18px", borderRadius:100, cursor:"pointer", fontSize:13, fontFamily:fb, border:`1.5px solid ${on?C.dark:C.line}`, background:on?C.dark:"rgba(255,255,255,0.7)", color:on?C.white:C.gray, fontWeight:on?600:400, transition:"all .18s", display:"inline-flex", alignItems:"center", gap:6 }),
  chipR: (on)=>({ padding:"9px 18px", borderRadius:100, cursor:"pointer", fontSize:13, fontFamily:fb, border:`1.5px solid ${on?C.rose:C.line}`, background:on?C.roseBg:"rgba(255,255,255,0.7)", color:on?C.rose:C.gray, fontWeight:on?600:400, transition:"all .18s" }),
  badge: (c) =>({ display:"inline-block", padding:"3px 10px", borderRadius:7, fontSize:11, fontWeight:600, background:c==="g"?C.tealBg:c==="r"?C.roseBg:c==="gold"?C.goldBg:C.lightGray, color:c==="g"?C.teal:c==="r"?C.rose:c==="gold"?C.gold:C.gray }),
  bar:   { height:5, borderRadius:3, background:C.line, overflow:"hidden" },
  fill:  (p,over)=>({ height:"100%", width:`${Math.min(Math.max(p,0),100)}%`, borderRadius:3, background:over?C.rose:`linear-gradient(90deg,${C.blush},${C.blushDark})`, transition:"width 1s cubic-bezier(.2,.7,.2,1)" }),
  tab:   (on)=>({ padding:"9px 16px", borderRadius:10, border:"none", cursor:"pointer", background:on?"rgba(255,255,255,0.9)":"transparent", color:on?C.dark:C.gray, fontSize:13.5, fontFamily:fb, fontWeight:on?600:500, transition:"all .18s", boxShadow:on?SHADOW:"none" }),
  logo:  { fontFamily:font, fontSize:26, color:C.dark, fontWeight:600 },
  nav:   { background:"#FBF9F5", borderBottom:`1px solid ${C.line}`, padding:"0 28px", display:"flex", alignItems:"center", justifyContent:"space-between", height:64, position:"sticky", top:0, zIndex:200 },
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const fmt = (n) => Number(n||0).toLocaleString("ru");
const TRANSLIT = {а:"a",б:"b",в:"v",г:"g",д:"d",е:"e",ё:"yo",ж:"zh",з:"z",и:"i",й:"y",к:"k",л:"l",м:"m",н:"n",о:"o",п:"p",р:"r",с:"s",т:"t",у:"u",ф:"f",х:"h",ц:"ts",ч:"ch",ш:"sh",щ:"sch",ъ:"",ы:"y",ь:"",э:"e",ю:"yu",я:"ya"};
const translit = (s) => (s||"").toLowerCase().split("").map(c=>TRANSLIT[c]??c).join("").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const makeSlug = (u) => `${translit(u?.name2)||"zhenikh"}-${translit(u?.name1)||"nevesta"}`;
const LS = {
  get:(k,def=null)=>{ try{const v=localStorage.getItem(k);return v?JSON.parse(v):def;}catch{return def;}},
  set:(k,v)=>{ try{localStorage.setItem(k,JSON.stringify(v));}catch{}},
  del:(k)=>{ try{localStorage.removeItem(k);}catch{}},
};

// ─── STATIC DATA ─────────────────────────────────────────────────────────────
const CITIES = ["Москва","Санкт-Петербург","Сочи","Казань","Екатеринбург","Другой город"];
const FORMATS = [
  {id:"restaurant", label:"Ресторан / банкет",    sub:"классический банкет в зале",        icon:"🍽", mult:1.0},
  {id:"loft",       label:"Лофт / городская",     sub:"современное городское пространство", icon:"🌆", mult:1.1},
  {id:"outdoor",    label:"На природе / шатёр",   sub:"загород, сад, выездная",             icon:"🌿", mult:1.15},
  {id:"destination",label:"Destination",          sub:"свадьба-путешествие",                icon:"✈️", mult:1.4},
  {id:"intimate",   label:"Камерная / только свои",sub:"самый близкий круг",               icon:"🤍", mult:0.85},
];
const BUDGET_OPTIONS = [
  {label:"до 500 000 ₽",             val:400000},
  {label:"500 000 – 1 000 000 ₽",   val:750000},
  {label:"1 000 000 – 2 000 000 ₽", val:1500000},
  {label:"2 000 000 – 5 000 000 ₽", val:3000000},
  {label:"5 000 000+ ₽",            val:6000000},
  {label:"Пока не знаю",             val:0},
];

const CITY_MULT  = {"Москва":1.0,"Санкт-Петербург":0.85,"Сочи":0.9,"Казань":0.7,"Екатеринбург":0.72,"Другой город":0.65};
const FORMAT_MULT= {restaurant:1.0,loft:1.1,outdoor:1.15,destination:1.4,intimate:0.85};
const CATERING_PER_GUEST = {basic:4000,comfort:5500,premium:9000};
const SERVICE_FEE = 0.12;
const VENDOR_PRICES = {
  venue:    {basic:70000, comfort:120000,premium:250000},
  photo:    {basic:35000, comfort:50000, premium:90000},
  video:    {basic:35000, comfort:50000, premium:90000},
  host:     {basic:40000, comfort:70000, premium:150000},
  decor:    {basic:80000, comfort:180000,premium:400000},
  dj:       {basic:35000, comfort:60000, premium:150000},
  makeup:   {basic:12000, comfort:20000, premium:35000},
  cake:     {basic:12000, comfort:20000, premium:40000},
  dress:    {basic:40000, comfort:90000, premium:200000},
  suit:     {basic:20000, comfort:40000, premium:80000},
  rings:    {basic:30000, comfort:70000, premium:200000},
  ceremony: {basic:25000, comfort:45000, premium:80000},
  transport:{basic:12000, comfort:25000, premium:50000},
  hotel:    {basic:15000, comfort:40000, premium:100000},
  invites:  {basic:8000,  comfort:20000, premium:50000},
  honeymoon:{basic:150000,comfort:300000,premium:700000},
};
function calcEstimate(guests,city,format,tier){
  const g=Number(guests)||50,cm=CITY_MULT[city]??0.8,fm=FORMAT_MULT[format]??1.0;
  const items={};
  items.catering=Math.round(g*CATERING_PER_GUEST[tier]*(1+SERVICE_FEE)*cm);
  for(const[k,p]of Object.entries(VENDOR_PRICES)){
    const fmMult=k==="venue"?fm:1;
    items[k]=Math.round(p[tier]*cm*fmMult);
  }
  const sub=Object.values(items).reduce((s,v)=>s+v,0);
  items.other=Math.round(sub*0.07);
  return{items,total:sub+items.other};
}

const DEFAULT_CATS = [
  {id:"venue",    name:"Площадка",           icon:"🏛",pct:0.19,market:"70 000 – 250 000 ₽",  rec:"Бронируйте за 9–12 мес.",items:["Аренда зала","Аренда мебели","Инвентарь","Уборка"]},
  {id:"catering", name:"Кейтеринг и напитки",icon:"🍽",pct:0.21,market:"4 000 – 9 000 ₽/гость",rec:"+12% сервисный сбор",   items:["Банкетное меню","Алкоголь","Фуршет","Детское меню","Персонал"]},
  {id:"photo",    name:"Фотограф",           icon:"📷",pct:0.08,market:"35 000 – 90 000 ₽",   rec:"Не экономьте — снимки навсегда",items:["Фотосъёмка дня","Love story","Обработка и альбом","2-й фотограф"]},
  {id:"video",    name:"Видеограф",          icon:"🎬",pct:0.05,market:"35 000 – 90 000 ₽",   rec:"Пакет с фото — дешевле", items:["Видеосъёмка","Монтаж","Аэросъёмка","SDE-ролик"]},
  {id:"decor",    name:"Декор и флористика", icon:"💐",pct:0.10,market:"80 000 – 400 000 ₽",  rec:"от 2 000 ₽/гость минимум",items:["Арка / зона церемонии","Столовые композиции","Букет невесты","Аренда декора"]},
  {id:"host",     name:"Ведущий",            icon:"🎤",pct:0.05,market:"40 000 – 150 000 ₽",  rec:"Звёздные — от 350 000 ₽",items:["Услуги ведущего","Сценарий","Конкурсы"]},
  {id:"dj",       name:"DJ / Музыканты",     icon:"🎵",pct:0.03,market:"25 000 – 100 000 ₽",  rec:"Живая музыка на церемонию",items:["DJ-сет","Звуковое оборудование","Живая музыка","Музыка на церемонию"]},
  {id:"cake",     name:"Торт и десерты",     icon:"🎂",pct:0.02,market:"150 – 400 ₽/порция",  rec:"~200 ₽/порция — хороший торт",items:["Свадебный торт","Кенди-бар","Капкейки"]},
  {id:"dress",    name:"Образ невесты",      icon:"👗",pct:0.05,market:"30 000 – 300 000 ₽",  rec:"Учтите примерки и подгонку",items:["Платье","Аксессуары и фата","Туфли","Подгонка"]},
  {id:"suit",     name:"Образ жениха",       icon:"🤵",pct:0.02,market:"15 000 – 100 000 ₽",  rec:"Аренда смокинга дешевле",  items:["Костюм / смокинг","Рубашка, галстук","Туфли"]},
  {id:"makeup",   name:"Визажист и стилист", icon:"💄",pct:0.02,market:"12 000 – 35 000 ₽",   rec:"Репетиция образа обязательна",items:["Макияж невесты","Причёска","Репетиция","Макияж подружек"]},
  {id:"rings",    name:"Кольца",             icon:"💍",pct:0.05,market:"30 000 – 500 000 ₽",  rec:"Бюджет = 1–2 зарплаты",   items:["Обручальные кольца","Гравировка","Упаковка"]},
  {id:"ceremony", name:"Церемония",          icon:"💒",pct:0.02,market:"20 000 – 80 000 ₽",   rec:"Выездная регистрация +30% эмоций",items:["Выездная регистрация","Распорядитель","Оформление"]},
  {id:"transport",name:"Транспорт",          icon:"🚗",pct:0.02,market:"10 000 – 50 000 ₽",   rec:"Трансфер снижает no-show", items:["Авто молодожёнов","Трансфер гостей","Украшение авто"]},
  {id:"hotel",    name:"Проживание",         icon:"🏨",pct:0.02,market:"3 000 – 15 000 ₽/номер",rec:"Блок номеров — скидка 15–25%",items:["Номер молодожёнов","Блок номеров","Bridal suite"]},
  {id:"invites",  name:"Полиграфия и подарки",icon:"✉️",pct:0.01,market:"200 – 800 ₽/шт",   rec:"Цифровые — тренд",         items:["Приглашения","Рассадочные карточки","Бонбоньерки"]},
  {id:"honeymoon",name:"Медовый месяц",      icon:"✈️",pct:0.05,market:"от 100 000 ₽",       rec:"Бронируйте сразу — дешевле",items:["Авиабилеты","Отель","Экскурсии"]},
  {id:"other",    name:"Прочее / резерв",    icon:"✨",pct:0.03,market:"по факту",            rec:"Оставьте 5–10% бюджета",   items:["Непредвиденные расходы","Чаевые персоналу"]},
];

const VENDORS = [
  {id:1, cat:"venue",    name:"Loft Riverside",   city:"Москва",priceFrom:150000,rating:4.9,reviews:87, tags:["Панорамный вид","до 200 гостей"],desc:"Стильный лофт на берегу Москвы-реки",busy:["2025-08-16"]},
  {id:2, cat:"venue",    name:"Golden Hall",      city:"Москва",priceFrom:280000,rating:4.8,reviews:54, tags:["Роскошь","до 300 гостей"],       desc:"Парадный зал в центре города",       busy:["2025-07-19"]},
  {id:3, cat:"venue",    name:"Усадьба Захарово", city:"Москва",priceFrom:200000,rating:4.7,reviews:41, tags:["Природа","Терраса"],             desc:"Загородная усадьба с садом",          busy:[]},
  {id:4, cat:"photo",    name:"Иван Громов",      city:"Москва",priceFrom:80000, rating:5.0,reviews:143,tags:["Репортаж","Арт"],               desc:"Живые эмоциональные снимки",          busy:["2025-08-02"]},
  {id:5, cat:"photo",    name:"Мария Белова",     city:"Москва",priceFrom:60000, rating:4.9,reviews:98, tags:["Светлый стиль","Плёнка"],        desc:"Нежная плёночная эстетика",           busy:[]},
  {id:6, cat:"host",     name:"Алексей Волков",   city:"Москва",priceFrom:50000, rating:4.8,reviews:211,tags:["Юмор","Живая музыка"],           desc:"10 лет опыта, авторские программы",   busy:["2025-07-26"]},
  {id:7, cat:"host",     name:"Елена Крылова",    city:"Москва",priceFrom:40000, rating:4.9,reviews:167,tags:["Элегантность","Игры"],           desc:"Тёплая атмосфера, свой сценарий",     busy:[]},
  {id:8, cat:"decor",    name:"Студия Flora",     city:"Москва",priceFrom:120000,rating:4.9,reviews:67, tags:["Флористика","Аренда"],           desc:"Полный декор от арки до стола",       busy:[]},
  {id:9, cat:"video",    name:"Кинолюди",         city:"Москва",priceFrom:70000, rating:4.8,reviews:91, tags:["Кино","Аэросъёмка"],             desc:"Свадебное кино, которое смотришь снова",busy:[]},
  {id:10,cat:"dj",       name:"DJ Fontaine",      city:"Москва",priceFrom:35000, rating:4.9,reviews:128,tags:["Танцпол","Живой звук"],          desc:"Разогреет любую аудиторию",           busy:[]},
  {id:11,cat:"cake",     name:"Confiserie Blanc", city:"Москва",priceFrom:25000, rating:5.0,reviews:189,tags:["Авторские","Без глютена"],        desc:"Торты под стиль вашей свадьбы",       busy:[]},
  {id:12,cat:"makeup",   name:"Анастасия Ли",     city:"Москва",priceFrom:15000, rating:4.9,reviews:203,tags:["Макияж","Причёска"],             desc:"Нежный образ или вечерний гламур",    busy:[]},
  {id:13,cat:"transport",name:"Royal Cars",       city:"Москва",priceFrom:12000, rating:4.8,reviews:55, tags:["Rolls-Royce","Mercedes"],        desc:"Премиальные авто для молодожёнов",    busy:[]},
];

const INVITE_TEMPLATES = [
  {id:"classic",name:"Классика",   bg:"#FDF6F0",accent:"#8B6D4E",textColor:"#2E1F12"},
  {id:"minimal",name:"Минимализм",bg:"#F5F5F5",accent:"#333333",textColor:"#111111"},
  {id:"garden", name:"Сад",        bg:"#F0F7EE",accent:"#4A7C59",textColor:"#1A3A24"},
  {id:"luxury", name:"Роскошь",    bg:"#1A1209",accent:"#C9A84C",textColor:"#F5E6C8"},
  {id:"boho",   name:"Бохо",       bg:"#FAF0E6",accent:"#C4705A",textColor:"#3D2010"},
];

const WEDDING_PHOTOS = [
  {id:1,emoji:"🌿",label:"Бохо в зелени"},{id:2,emoji:"🏛",label:"Классика в зале"},
  {id:3,emoji:"🌅",label:"Закат на террасе"},{id:4,emoji:"🌆",label:"Городской лофт"},
  {id:5,emoji:"🌊",label:"Свадьба у воды"},{id:6,emoji:"🕯",label:"Свечи и уют"},
  {id:7,emoji:"🎊",label:"Яркое торжество"},{id:8,emoji:"🌸",label:"Цветочный сад"},
  {id:9,emoji:"🍷",label:"Гастро-вечер"},{id:10,emoji:"🤍",label:"Минимализм"},
  {id:11,emoji:"🎸",label:"Живая музыка"},{id:12,emoji:"🏡",label:"На природе"},
];

// ─── CALCULATIONS ─────────────────────────────────────────────────────────────
function calcScenarios(survey){
  const guests=Number(survey.guests)||50;
  const meta={
    basic:  {label:"Базовый",icon:"🌿",color:C.teal,   bullets:["Банкетный зал или шатёр","Стандартное меню","1 фотограф","Базовый декор","DJ и звук"]},
    comfort:{label:"Комфорт",icon:"✨",color:C.gold,   bullets:["Площадка с атмосферой","Авторское меню + алкоголь","Фото + видео","Полный декор","Ведущий + DJ"]},
    premium:{label:"Премиум", icon:"🏆",color:C.rose,  bullets:["Топовая площадка","Premium-меню и open bar","2 фотографа + видео + аэро","Дизайнерский декор","Шоу-программа"]},
  };
  return["basic","comfort","premium"].map(tier=>{
    const{total}=calcEstimate(guests,survey.city,survey.format,tier);
    return{tier,...meta[tier],total,perGuest:Math.round(total/guests)};
  });
}

function makeCatsFromBudget(totalBudget,survey,tier){
  const t=tier||survey?.chosenScenario||"comfort";
  const{items,total:estTotal}=calcEstimate(survey?.guests||50,survey?.city||"Москва",survey?.format||"restaurant",t);
  const scale=estTotal>0?totalBudget/estTotal:1;
  let running=0;
  return DEFAULT_CATS.map((c,i)=>{
    let plan;
    if(i===DEFAULT_CATS.length-1){plan=Math.max(0,totalBudget-running);}
    else{plan=Math.round((items[c.id]||0)*scale);running+=plan;}
    return{...c,plan,avans:0,actual:0,expanded:false,itemActuals:Object.fromEntries(c.items.map(item=>[item,0]))};
  });
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────
function AuthPage({onLogin,prefill,onBack,agency}){
  const[mode,setMode]=useState((prefill||agency)?"register":"login");
  const[f,setF]=useState({email:"",pass:"",name1:"",name2:""});
  const upd=k=>e=>setF(p=>({...p,[k]:e.target.value}));
  return(
    <div style={{minHeight:"100vh",background:`linear-gradient(135deg,${C.champ2},${C.bg} 55%,${C.champ})`,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet"/>
      <div style={{...S.card,maxWidth:420,width:"100%"}}>
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:2,marginBottom:4}}><span style={{fontSize:23,fontWeight:700,letterSpacing:"-0.04em",color:C.dark,fontFamily:fb}}>totday</span><span style={{width:7,height:7,borderRadius:"50%",background:C.blushDark,display:"inline-block",marginLeft:2}}/>{agency&&<span style={{fontFamily:fb,fontSize:10,fontWeight:700,color:C.blushDark,background:C.blushBg,padding:"2px 8px",borderRadius:6,marginLeft:8}}>AGENCY</span>}</div>
          <p style={{color:C.gray,fontSize:14,marginTop:8}}>{agency?"Кабинет для свадебного агентства":prefill?"Почти готово — создайте аккаунт":"Ваша свадьба, понятная и красивая"}</p>
        </div>
        {prefill&&!agency&&(<div style={{background:C.blushBg,borderRadius:12,padding:"10px 14px",marginBottom:18,fontSize:13,color:C.ink2,textAlign:"center"}}>✓ {prefill.city} · {prefill.guests} гостей · смета готова</div>)}
        <div style={{display:"flex",gap:6,marginBottom:20,background:C.sand,borderRadius:12,padding:4}}>
          {[["login","Войти"],["register","Регистрация"]].map(([m,l])=>(
            <button key={m} onClick={()=>setMode(m)} style={{...S.tab(mode===m),flex:1}}>{l}</button>
          ))}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:13}}>
          {mode==="register"&&!agency&&(
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div><label style={S.label}>Невеста</label><input style={S.input} placeholder="Соня" value={f.name1} onChange={upd("name1")}/></div>
              <div><label style={S.label}>Жених</label><input style={S.input} placeholder="Никита" value={f.name2} onChange={upd("name2")}/></div>
            </div>
          )}
          {mode==="register"&&agency&&(<div><label style={S.label}>Название агентства</label><input style={S.input} placeholder="Wedding Studio" value={f.name1} onChange={upd("name1")}/></div>)}
          <div><label style={S.label}>Email</label><input style={S.input} type="email" value={f.email} onChange={upd("email")}/></div>
          <div><label style={S.label}>Пароль</label><input style={S.input} type="password" value={f.pass} onChange={upd("pass")}/></div>
          <button style={{...S.btn,width:"100%",padding:13}} onClick={()=>onLogin({email:f.email,name1:f.name1||(agency?"Агентство":"Невеста"),name2:f.name2||"Жених"})}>
            {mode==="login"?"Войти →":"Создать аккаунт →"}
          </button>
          <button style={{background:"none",border:"none",color:C.gray,fontSize:12,cursor:"pointer",textDecoration:"underline"}} onClick={()=>onLogin({email:"demo@totday.app",name1:agency?"Студия":"Соня",name2:"Никита"})}>Войти как демо</button>
          {onBack&&<button style={{background:"none",border:"none",color:C.gray,fontSize:12,cursor:"pointer"}} onClick={onBack}>← На главную</button>}
        </div>
      </div>
    </div>
  );
}

// ─── LANDING ──────────────────────────────────────────────────────────────────
function LandingPage({onStart,onLogin,onAgency}){
  const features=[
    {icon:"🏛",t:"Площадки",d:"Тысячи мест для вашей свадьбы"},
    {icon:"🤝",t:"Подрядчики",d:"Проверенные профессионалы"},
    {icon:"💰",t:"Бюджет",d:"Удобный планер расходов"},
    {icon:"👥",t:"Гости",d:"Список, приглашения и ответы"},
    {icon:"✉️",t:"Сайт гостей",d:"Красивый сайт за 6 минут"},
  ];
  const cats=[
    {icon:"🌿",label:"Подберите идеальную площадку",bg:`linear-gradient(135deg,${C.champ},${C.sand})`},
    {icon:"🤝",label:"Найдите своих подрядчиков",bg:`linear-gradient(135deg,${C.blush},${C.champ})`},
    {icon:"💰",label:"Планируйте бюджет без стресса",bg:`linear-gradient(135deg,${C.tealBg},${C.champ})`},
    {icon:"✉️",label:"Создайте сайт для гостей",bg:`linear-gradient(135deg,${C.sand},${C.blush})`},
  ];
  return(
    <div style={{background:C.bg,minHeight:"100vh",color:C.dark,fontFamily:fb}}>
      <link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet"/>
      <style>{`*{-webkit-font-smoothing:antialiased}button{transition:all .2s}button:active{transform:scale(.97)}@keyframes lf{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}}.lf{animation:lf .7s cubic-bezier(.2,.7,.2,1) both}.lf2{animation:lf .7s .1s cubic-bezier(.2,.7,.2,1) both}.lf3{animation:lf .7s .2s cubic-bezier(.2,.7,.2,1) both}.lcard{transition:transform .25s,box-shadow .25s}.lcard:hover{transform:translateY(-4px);box-shadow:${SHADOW_HOVER}}`}</style>
      {/* NAV */}
      <nav style={{...S.nav,maxWidth:"none",position:"sticky",top:0,zIndex:200}}>
        <div style={{maxWidth:1200,margin:"0 auto",width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:2}}><span style={{fontSize:23,fontWeight:700,letterSpacing:"-0.04em",color:C.dark,fontFamily:fb}}>totday</span><span style={{width:7,height:7,borderRadius:"50%",background:C.blushDark,display:"inline-block",marginLeft:2}}/></div>
          <div style={{display:"flex",gap:24,alignItems:"center"}}>
            {["О проекте","Возможности","Площадки","Подрядчики"].map(l=>(
              <button key={l} style={{background:"none",border:"none",color:C.gray,fontSize:14,fontWeight:500,cursor:"pointer",fontFamily:fb}}>{l}</button>
            ))}
          </div>
          <div style={{display:"flex",gap:10}}>
            <button style={{background:"none",border:"none",color:C.gray,fontSize:13.5,fontWeight:600,cursor:"pointer",fontFamily:fb}} onClick={onAgency}>Для агентств</button>
            <button style={{...S.btn,padding:"10px 22px",fontSize:13}} onClick={onLogin}>Войти</button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{position:"relative",overflow:"hidden",background:`linear-gradient(160deg,${C.white} 0%,${C.blush} 40%,${C.champ} 70%,${C.tealBg} 100%)`,minHeight:620}}>
        <div style={{maxWidth:1200,margin:"0 auto",padding:"80px 48px",display:"grid",gridTemplateColumns:"1fr 420px",gap:60,alignItems:"center"}}>
          <div>
            <div className="lf" style={{fontSize:12,letterSpacing:"0.18em",textTransform:"uppercase",color:C.blushDark,fontWeight:600,marginBottom:16}}>Ваша история. Ваш день.</div>
            <h1 className="lf2" style={{fontFamily:font,fontSize:"clamp(38px,5.5vw,66px)",lineHeight:1.05,letterSpacing:"-0.025em",fontWeight:600,margin:"0 0 22px",color:C.dark}}>
              Планируйте свадьбу<br/><span style={{fontStyle:"italic",color:C.blushDark}}>мечты</span> вместе с TotDay
            </h1>
            <p className="lf2" style={{fontSize:17,color:C.ink2,lineHeight:1.65,marginBottom:36,maxWidth:480}}>Всё, что нужно для идеальной свадьбы — в одном месте. Красиво, удобно и с любовью.</p>
            <div className="lf3" style={{display:"flex",gap:12,flexWrap:"wrap"}}>
              <button style={{...S.btn,padding:"15px 36px",fontSize:15}} onClick={onStart}>Начать планирование</button>
              <button style={{...S.btnO,padding:"15px 30px",fontSize:15}} onClick={onLogin}>Посмотреть возможности</button>
            </div>
          </div>
          {/* Right: photo + countdown */}
          <div style={{position:"relative"}}>
            <div style={{borderRadius:24,overflow:"hidden",background:`linear-gradient(160deg,${C.champ},${C.blush})`,height:400,display:"flex",alignItems:"center",justifyContent:"center",fontSize:80,boxShadow:SHADOW}}>
              💑
            </div>
            <div style={{position:"absolute",bottom:-20,right:-20,background:GLASS,backdropFilter:BLUR,WebkitBackdropFilter:BLUR,borderRadius:20,padding:"20px 28px",boxShadow:SHADOW,border:"1px solid rgba(255,255,255,0.9)",textAlign:"center"}}>
              <div style={{fontSize:11,color:C.gray,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:4}}>До вашей свадьбы</div>
              <div style={{fontFamily:font,fontSize:52,fontWeight:700,color:C.dark,lineHeight:1}}>423</div>
              <div style={{fontSize:13,color:C.gray,marginTop:4}}>14 августа 2027</div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES ROW */}
      <section style={{maxWidth:1200,margin:"0 auto",padding:"56px 48px"}}>
        <div style={{display:"flex",gap:32,justifyContent:"center",flexWrap:"wrap"}}>
          {features.map(f=>(
            <div key={f.t} style={{textAlign:"center",minWidth:100}}>
              <div style={{width:56,height:56,borderRadius:16,background:GLASS,backdropFilter:BLUR,WebkitBackdropFilter:BLUR,border:`1px solid ${C.line}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,margin:"0 auto 10px",boxShadow:SHADOW}}>{f.icon}</div>
              <div style={{fontSize:13,fontWeight:600,color:C.dark,marginBottom:3}}>{f.t}</div>
              <div style={{fontSize:11,color:C.gray,maxWidth:90}}>{f.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES GRID */}
      <section style={{maxWidth:1200,margin:"0 auto",padding:"0 48px 72px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:24}}>
          <h2 style={{fontFamily:font,fontSize:28,fontWeight:600,letterSpacing:"-0.02em"}}>Всё для вашей идеальной свадьбы</h2>
          <button style={{background:"none",border:"none",color:C.gray,fontSize:13,cursor:"pointer"}}>Смотреть возможности →</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16}}>
          {cats.map((c,i)=>(
            <div key={i} className="lcard" onClick={onStart} style={{borderRadius:20,overflow:"hidden",cursor:"pointer",boxShadow:SHADOW}}>
              <div style={{height:160,background:c.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:52}}>{c.icon}</div>
              <div style={{padding:"14px 18px",background:C.white}}>
                <div style={{fontSize:14,fontWeight:600,color:C.dark}}>{c.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* STATS + SOCIAL PROOF */}
      <section style={{background:`linear-gradient(135deg,${C.champ2},${C.white} 40%,${C.blush})`,padding:"72px 48px"}}>
        <div style={{maxWidth:1200,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1fr",gap:60,alignItems:"center"}}>
          <div>
            <h2 style={{fontFamily:font,fontSize:"clamp(26px,4vw,40px)",fontWeight:600,letterSpacing:"-0.02em",marginBottom:16}}>TotDay делает подготовку к свадьбе вдохновляющей</h2>
            <p style={{fontSize:16,color:C.ink2,lineHeight:1.65,marginBottom:36}}>Присоединяйтесь к тысячам пар, которые уже планируют свой идеальный день.</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:24}}>
              {[["10 000+","пар с нами"],["5 000+","площадок"],["2 000+","проверенных подрядчиков"],["98%","довольных пользователей"]].map(([n,l])=>(
                <div key={l}>
                  <div style={{fontFamily:font,fontSize:32,fontWeight:700,color:C.dark,marginBottom:2}}>{n}</div>
                  <div style={{fontSize:13,color:C.gray}}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            <div style={{...S.card,padding:"20px 24px"}}>
              <div style={{display:"flex",gap:3,marginBottom:8}}>{"★★★★★".split("").map((s,i)=><span key={i} style={{color:C.gold,fontSize:16}}>{s}</span>)}</div>
              <p style={{fontSize:14,color:C.ink2,lineHeight:1.6,marginBottom:10}}>"TotDay помог нам организовать свадьбу мечты! Очень удобно и красиво."</p>
              <div style={{fontSize:12,color:C.gray}}>Иван и Мария · Поженились 21.06.2024</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{maxWidth:1200,margin:"0 auto",padding:"72px 48px",textAlign:"center"}}>
        <h2 style={{fontFamily:font,fontSize:"clamp(26px,4vw,42px)",fontWeight:600,letterSpacing:"-0.02em",marginBottom:16}}>Начнём планировать?</h2>
        <p style={{color:C.ink2,fontSize:16,marginBottom:32,maxWidth:420,margin:"0 auto 32px"}}>Пара вопросов — и вы увидите смету своей свадьбы. Бесплатно.</p>
        <button style={{...S.btn,padding:"15px 40px",fontSize:15}} onClick={onStart}>Начать →</button>
      </section>

      <footer style={{borderTop:`1px solid ${C.line}`,padding:"28px 48px",display:"flex",alignItems:"center",justifyContent:"space-between",color:C.gray,fontSize:13}}>
        <div style={{display:"flex",alignItems:"center",gap:2}}><span style={{fontSize:23,fontWeight:700,letterSpacing:"-0.04em",color:C.dark,fontFamily:fb}}>totday</span><span style={{width:7,height:7,borderRadius:"50%",background:C.blushDark,display:"inline-block",marginLeft:2}}/></div>
        <span>© 2026 TotDay · Ваша свадьба, понятная и красивая</span>
      </footer>
    </div>
  );
}

// ─── MINI SURVEY ──────────────────────────────────────────────────────────────
function MiniSurvey({onDone,onBack}){
  const[step,setStep]=useState(0);
  const[d,setD]=useState({city:"Москва",guests:"",date:"",budget:""});
  const set=(k,v)=>setD(p=>({...p,[k]:v}));
  const cities=["Москва","Санкт-Петербург","Сочи","Казань","Екатеринбург","Другой город"];
  const guestRanges=[["До 30","22"],["30–60","45"],["60–100","80"],["100–150","125"],["150+","180"]];
  const budgets=[["до 700 тыс","600000"],["700 тыс – 1.5 млн","1100000"],["1.5 – 3 млн","2200000"],["3 млн+","3500000"]];
  const steps=[
    {q:"В каком городе свадьба?",ok:!!d.city,body:<div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center"}}>{cities.map(c=><span key={c} style={S.chip(d.city===c)} onClick={()=>set("city",c)}>{c}</span>)}</div>},
    {q:"Сколько примерно гостей?",ok:!!d.guests,body:<div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center"}}>{guestRanges.map(([l,v])=><span key={l} style={S.chip(d.guests===v)} onClick={()=>set("guests",v)}>{l}</span>)}</div>},
    {q:"Когда планируете?",ok:true,body:<div style={{maxWidth:240,margin:"0 auto"}}><input type="date" style={S.input} value={d.date} onChange={e=>set("date",e.target.value)}/><p style={{fontSize:12,color:C.gray,marginTop:8,textAlign:"center"}}>Можно пропустить</p></div>},
    {q:"Ориентир по бюджету?",ok:!!d.budget,body:<div style={{display:"flex",flexWrap:"wrap",gap:8,justifyContent:"center"}}>{budgets.map(([l,v])=><span key={l} style={S.chip(d.budget===v)} onClick={()=>set("budget",v)}>{l}</span>)}</div>},
  ];
  const cur=steps[step];
  return(
    <div style={{minHeight:"100vh",background:`linear-gradient(135deg,${C.champ2},${C.bg} 55%,${C.champ})`,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{maxWidth:520,width:"100%"}}>
        <div style={{textAlign:"center",marginBottom:8}}><div style={{display:"flex",alignItems:"center",gap:2}}><span style={{fontSize:23,fontWeight:700,letterSpacing:"-0.04em",color:C.dark,fontFamily:fb}}>totday</span><span style={{width:7,height:7,borderRadius:"50%",background:C.blushDark,display:"inline-block",marginLeft:2}}/></div></div>
        <div style={{textAlign:"center",fontSize:12,color:C.blushDark,letterSpacing:"0.14em",textTransform:"uppercase",marginBottom:18}}>Шаг {step+1} из {steps.length}</div>
        <div style={{height:4,background:C.sand,borderRadius:2,marginBottom:28,overflow:"hidden"}}><div style={{height:"100%",width:`${(step+1)/steps.length*100}%`,background:`linear-gradient(90deg,${C.blush},${C.blushDark})`,borderRadius:2,transition:"width .4s"}}/></div>
        <div style={{...S.card,padding:"36px 28px"}}>
          <h2 style={{fontFamily:font,fontSize:26,fontWeight:600,letterSpacing:"-0.02em",textAlign:"center",marginBottom:28}}>{cur.q}</h2>
          {cur.body}
        </div>
        <div style={{display:"flex",justifyContent:"space-between",marginTop:20}}>
          <button style={S.btnO} onClick={()=>step>0?setStep(step-1):onBack()}>← Назад</button>
          <button style={{...S.btn,opacity:cur.ok?1:0.5}} onClick={()=>cur.ok&&(step<steps.length-1?setStep(step+1):onDone(d))}>{step<steps.length-1?"Далее →":"К регистрации →"}</button>
        </div>
      </div>
    </div>
  );
}
// ─── SURVEY 1 ─────────────────────────────────────────────────────────────────
function Survey1Page({onComplete,initial}){
  const[step,setStep]=useState(0);
  const[d,setD]=useState(()=>({season:"",date:"",altDates:"",zags:"",city:"Москва",guests:"",outOfTown:"",format:"",budgetLabel:"",budget:0,...(initial||{})}));
  const set=(k,v)=>setD(p=>({...p,[k]:v}));
  const STEPS=[
    {title:"Когда планируете свадьбу?",sub:"Дата влияет на доступность подрядчиков",ok:d.season||d.date,body:(
      <div style={{display:"flex",flexDirection:"column",gap:18}}>
        <div><label style={S.label}>Сезон</label><div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:6}}>{[["🌸","Весна"],["☀️","Лето"],["🍂","Осень"],["❄️","Зима"],["🤷","Пока не знаю"]].map(([ic,s])=><span key={s} style={S.chip(d.season===s)} onClick={()=>set("season",s)}>{ic} {s}</span>)}</div></div>
        <div><label style={S.label}>Точная дата</label><input type="date" style={{...S.input,maxWidth:220}} value={d.date} onChange={e=>set("date",e.target.value)}/></div>
        <div><label style={S.label}>Альтернативные даты</label><input style={{...S.input,maxWidth:320}} placeholder="июнь–июль, любая суббота" value={d.altDates} onChange={e=>set("altDates",e.target.value)}/></div>
        <div><label style={S.label}>Заявление в ЗАГС подано?</label><div style={{display:"flex",gap:8,marginTop:6}}>{["Да","Нет","Пока нет"].map(o=><span key={o} style={S.chip(d.zags===o)} onClick={()=>set("zags",o)}>{o}</span>)}</div></div>
      </div>
    )},
    {title:"Где будет свадьба?",sub:"Город влияет на ценовой расчёт",ok:d.city,body:<div style={{display:"flex",gap:10,flexWrap:"wrap"}}>{CITIES.map(c=><span key={c} style={S.chip(d.city===c)} onClick={()=>set("city",c)}>{c}</span>)}</div>},
    {title:"Сколько гостей?",sub:"Примерно — уточните позже",ok:d.guests,body:(
      <div style={{display:"flex",flexDirection:"column",gap:16}}>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{[["До 15","7"],["15–30","22"],["30–60","45"],["60–100","80"],["100–150","125"],["150–200","175"],["200+","250"]].map(([l,v])=><span key={l} style={S.chip(d.guests===v)} onClick={()=>set("guests",v)}>{l}</span>)}</div>
        <div><label style={S.label}>Точное число</label><input type="number" style={{...S.input,maxWidth:160}} placeholder="80" value={d.guests} onChange={e=>set("guests",e.target.value)}/></div>
        <div><label style={S.label}>Гости из других городов?</label><div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:6}}>{["Нет","Да, нужен трансфер","Да, нужно размещение","Да, и то и другое"].map(o=><span key={o} style={S.chip(d.outOfTown===o)} onClick={()=>set("outOfTown",o)}>{o}</span>)}</div></div>
      </div>
    )},
    {title:"Формат свадьбы",sub:"Влияет на подбор площадок",ok:d.format,body:(
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {FORMATS.map(f=>(
          <div key={f.id} onClick={()=>set("format",f.id)} style={{...S.card,padding:"14px 18px",cursor:"pointer",display:"flex",alignItems:"center",gap:14,border:`2px solid ${d.format===f.id?C.blushDark:C.line}`,background:d.format===f.id?C.blushBg:GLASS}}>
            <span style={{fontSize:22}}>{f.icon}</span>
            <div style={{flex:1}}><div style={{fontWeight:600,fontSize:14}}>{f.label}</div><div style={{fontSize:12,color:C.gray}}>{f.sub}</div></div>
            {d.format===f.id&&<span style={{color:C.blushDark}}>✓</span>}
          </div>
        ))}
      </div>
    )},
    {title:"Бюджет на свадьбу",sub:"Используем для расчёта",ok:d.budgetLabel,body:(
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {BUDGET_OPTIONS.map(b=>(
          <div key={b.label} onClick={()=>{set("budgetLabel",b.label);set("budget",b.val);}} style={{...S.card,padding:"13px 18px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",border:`2px solid ${d.budgetLabel===b.label?C.blushDark:C.line}`,background:d.budgetLabel===b.label?C.blushBg:GLASS}}>
            <span style={{fontWeight:d.budgetLabel===b.label?700:400,fontSize:14}}>{b.label}</span>
            {d.budgetLabel===b.label&&<span style={{color:C.blushDark}}>✓</span>}
          </div>
        ))}
      </div>
    )},
  ];
  const cur=STEPS[step];
  const pct=(step+1)/STEPS.length*100;
  return(
    <div style={{...S.page,maxWidth:600}}>
      <div style={{marginBottom:24,textAlign:"center"}}>
        <span style={{...S.badge(""),fontSize:12,padding:"4px 14px",marginBottom:12,display:"inline-block"}}>Быстрый расчёт · шаг {step+1} из {STEPS.length}</span>
        <div style={S.bar}><div style={S.fill(pct)}/></div>
      </div>
      <div style={{...S.card,marginBottom:20}}><h2 style={S.h1}>{cur.title}</h2><p style={S.sub}>{cur.sub}</p>{cur.body}</div>
      <div style={{display:"flex",justifyContent:"space-between"}}>
        {step>0?<button style={S.btnO} onClick={()=>setStep(s=>s-1)}>← Назад</button>:<div/>}
        {step<STEPS.length-1
          ?<button style={{...S.btn,opacity:cur.ok?1:0.5}} onClick={()=>cur.ok&&setStep(s=>s+1)}>Далее →</button>
          :<button style={{...S.btnR,opacity:cur.ok?1:0.5}} onClick={()=>cur.ok&&onComplete(d)}>Рассчитать стоимость ✦</button>
        }
      </div>
    </div>
  );
}

// ─── SCENARIOS ────────────────────────────────────────────────────────────────
function ScenariosPage({survey,onChoose}){
  const scenarios=calcScenarios(survey);
  const[chosen,setChosen]=useState(null);
  const guests=Number(survey.guests)||50;
  return(
    <div style={{...S.page,maxWidth:860}}>
      <div style={{textAlign:"center",marginBottom:36}}>
        <h2 style={{...S.h1,fontSize:28}}>Сколько может стоить ваша свадьба</h2>
        <p style={{color:C.gray,fontSize:14,lineHeight:1.7}}>{survey.city} · {guests} гостей · {FORMATS.find(f=>f.id===survey.format)?.label}</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:20,marginBottom:32}}>
        {scenarios.map(sc=>(
          <div key={sc.tier} onClick={()=>setChosen(sc.tier)} style={{...S.card,cursor:"pointer",border:`2px solid ${chosen===sc.tier?sc.color:C.line}`,background:chosen===sc.tier?`${sc.color}15`:GLASS,transition:"all 0.15s",position:"relative"}}>
            {chosen===sc.tier&&<div style={{position:"absolute",top:14,right:14,width:24,height:24,borderRadius:"50%",background:sc.color,color:C.white,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700}}>✓</div>}
            <div style={{fontSize:32,marginBottom:8}}>{sc.icon}</div>
            <div style={{fontFamily:font,fontSize:18,fontWeight:600,color:sc.color,marginBottom:4}}>{sc.label}</div>
            <div style={{fontFamily:font,fontSize:26,fontWeight:700,color:C.dark,marginBottom:2}}>{fmt(sc.total)} ₽</div>
            <div style={{fontSize:12,color:C.gray,marginBottom:16}}>≈ {fmt(sc.perGuest)} ₽ / гость</div>
            <div style={{height:1,background:C.line,marginBottom:14}}/>
            <ul style={{margin:0,padding:0,listStyle:"none",display:"flex",flexDirection:"column",gap:7}}>
              {sc.bullets.map((b,i)=><li key={i} style={{display:"flex",gap:8,fontSize:12,color:C.dark,alignItems:"flex-start"}}><span style={{color:sc.color,flexShrink:0}}>✓</span>{b}</li>)}
            </ul>
          </div>
        ))}
      </div>
      {chosen&&<div style={{textAlign:"center"}}><button style={{...S.btn,padding:"14px 40px",fontSize:15}} onClick={()=>onChoose(scenarios.find(s=>s.tier===chosen))}>Создать смету →</button></div>}
      <div style={{textAlign:"center",marginTop:14}}><button style={{background:"none",border:"none",color:C.gray,fontSize:12,cursor:"pointer",textDecoration:"underline"}} onClick={()=>onChoose(scenarios[1])}>Пропустить — выбрать потом</button></div>
    </div>
  );
}

// ─── SURVEY 2 HELPERS (top-level to avoid remount on parent re-render) ────────
function Chips({d,toggle,field,max,opts,red}){
  return(
    <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:8}}>
      {opts.map(([v,l])=>{const on=d[field].includes(v);const dis=!on&&max&&d[field].length>=max;return<span key={v} style={{...(red?S.chipR(on):S.chip(on)),opacity:dis?0.4:1,cursor:dis?"not-allowed":"pointer"}} onClick={()=>!dis&&toggle(field,v,max)}>{l}</span>;})}
    </div>
  );
}
function Cards({d,set,field,opts}){
  return(
    <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:8}}>
      {opts.map(([v,l,sub])=>(
        <div key={v} onClick={()=>set(field,v)} style={{...S.card,padding:"13px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:12,border:`2px solid ${d[field]===v?C.blushDark:C.line}`,background:d[field]===v?C.blushBg:GLASS}}>
          <div style={{flex:1}}><div style={{fontWeight:600,fontSize:14}}>{l}</div>{sub&&<div style={{fontSize:11,color:C.gray,marginTop:2}}>{sub}</div>}</div>
          {d[field]===v&&<span style={{color:C.blushDark}}>✓</span>}
        </div>
      ))}
    </div>
  );
}
// ─── SURVEY 2 ─────────────────────────────────────────────────────────────────
function Survey2Page({onComplete,initial}){
  const[step,setStep]=useState(0);
  const[d,setD]=useState(()=>({personality:[],feelings:[],memory:"",priorities:[],dontWant:[],guestType:"",guestComfort:3,likedPhotos:[],decorLevel:"",decorZones:[],program:[],nature:[],mustHave:"",...(initial||{})}));
  const set=(k,v)=>setD(p=>({...p,[k]:v}));
  const toggle=(k,v,max)=>{const arr=d[k];if(arr.includes(v)){set(k,arr.filter(x=>x!==v));return;}if(max&&arr.length>=max)return;set(k,[...arr,v]);};
  const STEPS=[
    {title:"Какие вы как пара?",sub:"До 3 вариантов",body:<Chips d={d} toggle={toggle} field="personality" max={3} opts={[["party","🎉 Шумные вечеринки"],["cozy","🏡 Уютные вечера"],["travel","✈️ Путешествия"],["gastro","🍽 Гастрономия"],["aesthetic","✨ Красивая эстетика"],["music","🎵 Музыка и танцы"],["unique","🌀 Необычные впечатления"],["nature","🌿 Природа"],["urban","🌆 Городская атмосфера"]]}/>},
    {title:"Что хотите чувствовать?",sub:"До 3 вариантов",body:<Chips d={d} toggle={toggle} field="feelings" max={3} opts={[["fun","Веселье"],["romance","Романтику"],["cozy","Уют"],["wow","Вау-эффект"],["calm","Спокойствие"],["elegance","Элегантность"],["freedom","Свободу"],["warmth","Душевность"],["celebration","Праздник"]]}/>},
    {title:"Что запомнят гости?",sub:"Один вариант",body:<Cards d={d} set={set} field="memory" opts={[["ceremony","💒 Церемония"],["atmosphere","✨ Атмосфера"],["dance","💃 Танцы"],["food","🍽 Еда"],["beauty","💐 Красота"],["emotions","❤️ Эмоции"],["talk","🥂 Общение"]]}/>},
    {title:"Что важнее всего?",sub:"До 5 — сюда концентрируем бюджет",body:<Chips d={d} toggle={toggle} field="priorities" max={5} opts={[["food","🍽 Еда"],["photo","📷 Фото"],["video","🎬 Видео"],["music","🎵 Музыка"],["dance","💃 Танцы"],["decor","💐 Декор"],["ceremony","💒 Церемония"],["guests","👥 Комфорт гостей"],["budget","💰 Экономия"]]}/>},
    {title:"Что точно НЕ хотите?",sub:"Передадим подрядчикам",body:<Chips d={d} toggle={toggle} field="dontWant" red opts={[["contests","Пошлые конкурсы"],["toasts","Длинные тосты"],["ransom","Выкуп"],["oldhost","Тамада старого формата"],["official","Много официоза"],["boring","Банкет как у всех"],["karaoke","Караоке"],["kids","Детские активности"],["envelopes","Сбор денег в конвертах"]]}/>},
    {title:"Кто ваши гости?",sub:"Влияет на программу",body:<Cards d={d} set={set} field="guestType" opts={[["friends","👫 В основном друзья"],["friendsfamily","👨‍👩‍👧 Друзья и родители"],["family","👴 Большая семья"],["mixed","🏢 Семья и коллеги"],["diverse","🌍 Смешанная компания"]]}/>},
    {title:"Важность комфорта гостей",sub:"Трансфер, отель, детская зона...",body:(
      <div style={{marginTop:16}}>
        <div style={{display:"flex",justifyContent:"space-between",gap:8}}>
          {[1,2,3,4,5].map(n=>(
            <div key={n} onClick={()=>set("guestComfort",n)} style={{flex:1,height:52,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",border:`2px solid ${d.guestComfort===n?C.blushDark:C.line}`,background:d.guestComfort===n?C.blushDark:GLASS,color:d.guestComfort===n?C.white:C.gray,fontWeight:700,fontSize:18,cursor:"pointer"}}>{n}</div>
          ))}
        </div>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:C.gray,marginTop:8}}><span>Не приоритет</span><span>Очень важно</span></div>
      </div>
    )},
    {title:"Свадьбы, которые вам нравятся",sub:"Лайкайте — самый важный вопрос для стиля",body:(
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginTop:8}}>
        {WEDDING_PHOTOS.map(p=>{const on=d.likedPhotos.includes(p.id);return(
          <div key={p.id} onClick={()=>toggle("likedPhotos",p.id)} style={{borderRadius:10,overflow:"hidden",cursor:"pointer",border:`3px solid ${on?C.blushDark:"transparent"}`,transition:"all 0.13s"}}>
            <div style={{background:on?C.blushBg:C.lightGray,height:80,display:"flex",alignItems:"center",justifyContent:"center",fontSize:32}}>{p.emoji}</div>
            <div style={{padding:"7px 10px",background:on?C.blushBg:C.white,fontSize:11,fontWeight:on?700:400,color:on?C.blushDark:C.dark}}>{p.label}</div>
          </div>
        );})}
      </div>
    )},
    {title:"Уровень декора",sub:"Влияет на бюджет",body:<Cards d={d} set={set} field="decorLevel" opts={[["min","🌿 Минимум","Чисто, акцент на пространстве"],["nice","✨ Аккуратно","Продуманные детали, флористика"],["wow","💐 Впечатляюще","Объёмные композиции, свет"],["grand","🏛 Максимум","Полная трансформация пространства"]]}/>},
    {title:"Какие зоны оформить?",sub:"Каждая зона войдёт в смету",body:<Chips d={d} toggle={toggle} field="decorZones" opts={[["ceremony","💒 Зона церемонии"],["welcome","🥂 Welcome-зона"],["sweet","🍰 Сладкий стол"],["headtable","💍 Стол молодожёнов"],["photo","📸 Фотозона"],["gifts","🎁 Зона подарков"],["guest","🍽 Гостевые столы"],["lounge","🛋 Лаунж-зона"]]}/>},
    {title:"Что включить в программу?",sub:"Дополнительные впечатления для гостей",body:<Chips d={d} toggle={toggle} field="program" opts={[["photobooth","📸 Фотобудка"],["fireworks","🎆 Фейерверк"],["live","🎸 Живая музыка"],["kids","🧸 Аниматор"],["fountains","❄️ Холодные фонтаны"],["cover","🎤 Кавер-группа"],["show","🎭 Шоу-программа"]]}/>},
    {title:"Природные элементы?",sub:"Для подбора площадки",body:<Chips d={d} toggle={toggle} field="nature" opts={[["water","🌊 Водоём"],["forest","🌲 Лес"],["park","🌳 Парк"],["terrace","☀️ Терраса"],["none","🏛 Не важно"]]}/>},
    {title:"Что обязательно должно быть?",sub:"Живая группа, закат, сигарная зона...",body:<textarea style={{...S.input,minHeight:110,resize:"vertical",fontSize:14,marginTop:8}} placeholder={"Например:\n— Живая группа\n— Бар с коктейлями\n— Церемония на закате"} value={d.mustHave} onChange={e=>set("mustHave",e.target.value)}/>},
  ];
  const cur=STEPS[step];
  const pct=(step+1)/STEPS.length*100;
  return(
    <div style={{...S.page,maxWidth:620}}>
      <div style={{marginBottom:24,textAlign:"center"}}>
        <span style={{...S.badge(""),fontSize:12,padding:"4px 14px",marginBottom:12,display:"inline-block"}}>Концепция · шаг {step+1} из {STEPS.length}</span>
        <div style={S.bar}><div style={S.fill(pct)}/></div>
      </div>
      <div style={{...S.card,marginBottom:20}}><h2 style={S.h1}>{cur.title}</h2><p style={S.sub}>{cur.sub}</p>{cur.body}</div>
      <div style={{display:"flex",justifyContent:"space-between"}}>
        {step>0?<button style={S.btnO} onClick={()=>setStep(s=>s-1)}>← Назад</button>:<div/>}
        <div style={{display:"flex",gap:10}}>
          <button style={S.btnO} onClick={()=>onComplete(d)}>Пропустить →</button>
          {step<STEPS.length-1?<button style={S.btn} onClick={()=>setStep(s=>s+1)}>Далее →</button>:<button style={S.btnR} onClick={()=>onComplete(d)}>Готово ✦</button>}
        </div>
      </div>
    </div>
  );
}

// ─── BUDGET PAGE ──────────────────────────────────────────────────────────────
function BudgetPage({survey,cats,setCats,onGoToVendors}){
  const[totalBudget,setTotalBudget]=useState(()=>Number(survey?.budget)||1500000);
  const[editingBudget,setEditingBudget]=useState(false);
  const[budgetInput,setBudgetInput]=useState(String(Number(survey?.budget)||1500000));
  const[editPlanId,setEditPlanId]=useState(null);
  const[editAvansId,setEditAvansId]=useState(null);
  const[newTx,setNewTx]=useState({catId:"venue",amount:"",note:""});
  const[txHistory,setTxHistory]=useState(()=>LS.get("td_txHistory",[]));
  const[activeTab,setActiveTab]=useState("plan");
  const[showAddCat,setShowAddCat]=useState(false);
  const[newCat,setNewCat]=useState({name:"",icon:"✨",plan:""});
  useEffect(()=>{LS.set("td_txHistory",txHistory);},[txHistory]);
  const totalPlan=cats.reduce((s,c)=>s+c.plan,0);
  const totalActual=cats.reduce((s,c)=>s+c.actual,0);
  const leftBudget=totalBudget-totalActual;
  const guests=Number(survey?.guests)||80;
  const applyNewBudget=(raw)=>{
    const nb=Math.max(0,Number(raw)||0);
    setTotalBudget(nb);setBudgetInput(String(nb));
    setCats(prev=>{const prevTotal=prev.reduce((s,c)=>s+c.plan,0);const scale=prevTotal>0?nb/prevTotal:0;let running=0;
      return prev.map((c,i)=>{let plan;if(i===prev.length-1)plan=Math.max(0,nb-running);else{plan=prevTotal>0?Math.round(c.plan*scale):Math.round(nb/prev.length);running+=plan;}return{...c,plan};});
    });setEditingBudget(false);
  };
  const updatePlan=(id,val)=>setCats(prev=>prev.map(c=>c.id===id?{...c,plan:Math.max(0,Number(val)||0)}:c));
  const updateAvans=(id,val)=>setCats(prev=>prev.map(c=>c.id===id?{...c,avans:Math.max(0,Number(val)||0)}:c));
  const toggleExpand=(id)=>setCats(prev=>prev.map(c=>c.id===id?{...c,expanded:!c.expanded}:c));
  const updateItemActual=(catId,item,val)=>{setCats(prev=>prev.map(c=>{if(c.id!==catId)return c;const ia={...c.itemActuals,[item]:Math.max(0,Number(val)||0)};return{...c,itemActuals:ia,actual:Object.values(ia).reduce((s,v)=>s+v,0)};}));};
  const addActual=()=>{if(!newTx.amount)return;const tx={id:Date.now(),catId:newTx.catId,amount:Number(newTx.amount),note:newTx.note,date:new Date().toLocaleDateString("ru")};setTxHistory(prev=>[tx,...prev]);setCats(prev=>prev.map(c=>c.id===tx.catId?{...c,actual:c.actual+tx.amount}:c));setNewTx(p=>({...p,amount:"",note:""}));};
  const removeCat=(id)=>setCats(prev=>prev.filter(c=>c.id!==id));
  const addCat=()=>{if(!newCat.name)return;const id="custom_"+Date.now();setCats(prev=>[...prev,{id,name:newCat.name,icon:newCat.icon||"✨",pct:0,market:"—",rec:"—",items:[],plan:Number(newCat.plan)||0,avans:0,actual:0,expanded:false,itemActuals:{}}]);setNewCat({name:"",icon:"✨",plan:""});setShowAddCat(false);};
  const budgetPct=totalBudget>0?totalActual/totalBudget*100:0;
  return(
    <div className="td-page" style={S.page}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12,marginBottom:8}}>
        <div><h2 style={S.h1}>Бюджет свадьбы</h2><p style={S.sub}>{survey?.city} · {guests} гостей · {FORMATS.find(f=>f.id===survey?.format)?.label||""}</p></div>
        <div style={{display:"flex",gap:6}}>
          <button style={S.tab(activeTab==="plan")} onClick={()=>setActiveTab("plan")}>📋 Смета</button>
          <button style={S.tab(activeTab==="tracker")} onClick={()=>setActiveTab("tracker")}>💳 Трекер</button>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(155px,1fr))",gap:14,marginBottom:18}}>
        <div style={{...S.card,textAlign:"center"}}>
          <div style={{fontSize:18,marginBottom:4}}>💰</div>
          <div style={{fontSize:10,color:C.gray,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:4}}>Общий бюджет</div>
          {editingBudget?(
            <input type="number" min="0" autoFocus style={{...S.input,textAlign:"center",fontWeight:700,fontSize:16,color:C.dark,padding:"4px 8px"}} value={budgetInput} onChange={e=>setBudgetInput(e.target.value)} onFocus={e=>e.target.select()} onBlur={()=>applyNewBudget(budgetInput)} onKeyDown={e=>{if(e.key==="Enter")applyNewBudget(budgetInput);if(e.key==="Escape")setEditingBudget(false);}}/>
          ):(
            <div style={{fontFamily:font,fontSize:18,color:C.dark,fontWeight:700,cursor:"pointer",borderBottom:`1px dashed ${C.blushDark}`}} onClick={()=>{setBudgetInput(String(totalBudget));setEditingBudget(true);}}>{fmt(totalBudget)} ₽</div>
          )}
          <div style={{fontSize:9,color:C.gray,marginTop:4}}>нажмите чтобы изменить</div>
        </div>
        {[
          {l:"Запланировано",v:`${fmt(totalPlan)} ₽`,c:totalPlan>totalBudget?C.rose:C.taupe,icon:"📋",warn:totalPlan>totalBudget?`превышает на ${fmt(totalPlan-totalBudget)} ₽`:""},
          {l:"Свободно в плане",v:`${fmt(totalBudget-totalPlan)} ₽`,c:(totalBudget-totalPlan)>=0?C.teal:C.rose,icon:"📊"},
          {l:"Потрачено",v:`${fmt(totalActual)} ₽`,c:C.rose,icon:"💳"},
          {l:"Остаток денег",v:`${fmt(leftBudget)} ₽`,c:leftBudget>=0?C.teal:C.rose,icon:leftBudget>=0?"✅":"⚠️"},
        ].map(s=>(
          <div key={s.l} style={{...S.card,textAlign:"center"}}>
            <div style={{fontSize:18,marginBottom:4}}>{s.icon}</div>
            <div style={{fontSize:10,color:C.gray,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:4}}>{s.l}</div>
            <div style={{fontFamily:font,fontSize:18,color:s.c,fontWeight:700}}>{s.v}</div>
            {s.warn&&<div style={{fontSize:10,color:C.rose,marginTop:2}}>{s.warn}</div>}
          </div>
        ))}
      </div>
      <div style={{...S.card,padding:"14px 20px",marginBottom:18}}>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:C.gray,marginBottom:6}}><span>Израсходовано бюджета</span><span style={{color:C.teal,fontWeight:700}}>{Math.round(budgetPct)}%</span></div>
        <div style={S.bar}><div style={S.fill(budgetPct,totalActual>totalBudget)}/></div>
      </div>
      {activeTab==="plan"&&(
        <div style={S.card}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
            <h3 style={{...S.h2,margin:0}}>По категориям</h3>
            <button style={S.btn} onClick={()=>setShowAddCat(true)}>+ Добавить</button>
          </div>
          {showAddCat&&(
            <div style={{background:C.blushBg,borderRadius:10,padding:16,marginBottom:16,display:"flex",gap:10,flexWrap:"wrap",alignItems:"flex-end"}}>
              <div style={{flex:"2 1 150px"}}><label style={S.label}>Название</label><input style={S.input} value={newCat.name} onChange={e=>setNewCat(p=>({...p,name:e.target.value}))} placeholder="Шоу-программа"/></div>
              <div style={{flex:"0 0 75px"}}><label style={S.label}>Иконка</label><input style={S.input} value={newCat.icon} onChange={e=>setNewCat(p=>({...p,icon:e.target.value}))}/></div>
              <div style={{flex:"1 1 110px"}}><label style={S.label}>План ₽</label><input type="number" style={S.input} value={newCat.plan} onChange={e=>setNewCat(p=>({...p,plan:e.target.value}))} placeholder="50000"/></div>
              <button style={S.btn} onClick={addCat}>Добавить</button>
              <button style={S.btnO} onClick={()=>setShowAddCat(false)}>Отмена</button>
            </div>
          )}
          <div style={{display:"grid",gridTemplateColumns:"28px 1fr 100px 100px 100px 100px 70px",gap:8,padding:"6px 0 10px",borderBottom:`2px solid ${C.line}`,fontSize:10,color:C.gray,letterSpacing:"0.07em",textTransform:"uppercase",fontWeight:600}}>
            <div/><div>Категория</div><div style={{textAlign:"right"}}>План</div><div style={{textAlign:"right"}}>Аванс</div><div style={{textAlign:"right"}}>К доплате</div><div style={{textAlign:"right"}}>Факт</div><div/>
          </div>
          {cats.map((c,i)=>{
            const over=c.actual>c.plan&&c.plan>0;
            const pUsed=c.plan>0?Math.min(100,Math.round(c.actual/c.plan*100)):0;
            return(
              <div key={c.id} style={{borderBottom:i<cats.length-1?`1px solid ${C.lightGray}`:"none"}}>
                <div style={{display:"grid",gridTemplateColumns:"28px 1fr 100px 100px 100px 100px 70px",gap:8,padding:"12px 0",alignItems:"center",cursor:"pointer"}} onClick={()=>toggleExpand(c.id)}>
                  <span style={{fontSize:13,fontFamily:font,color:C.ink2,width:28,height:28,borderRadius:8,background:C.sand,display:"flex",alignItems:"center",justifyContent:"center"}}>{(c.name||"?").slice(0,2)}</span>
                  <div>
                    <div style={{fontSize:13.5,fontWeight:500,display:"flex",alignItems:"center",gap:6}}>{c.name}{over&&<span style={S.badge("r")}>перерасход</span>}</div>
                    <div style={{fontSize:10,color:C.blushDark,marginTop:2}}>{c.rec}</div>
                    <div style={{marginTop:5,paddingRight:8}}><div style={S.bar}><div style={S.fill(pUsed,over)}/></div></div>
                  </div>
                  <div style={{textAlign:"right"}} onClick={e=>e.stopPropagation()}>
                    {editPlanId===c.id?(
                      <input type="number" min="0" autoFocus style={{...S.input,width:"100%",padding:"3px 7px",fontSize:13,textAlign:"right"}} value={c.plan===0?"":c.plan} placeholder="0" onChange={e=>updatePlan(c.id,e.target.value)} onFocus={e=>e.target.select()} onBlur={()=>setEditPlanId(null)} onKeyDown={e=>e.key==="Enter"&&setEditPlanId(null)}/>
                    ):(
                      <span style={{fontSize:13,color:C.dark,fontWeight:500,cursor:"text",borderBottom:`1px dashed ${C.blushDark}`}} onClick={()=>setEditPlanId(c.id)}>{fmt(c.plan)} ₽</span>
                    )}
                  </div>
                  <div style={{textAlign:"right"}} onClick={e=>e.stopPropagation()}>
                    {editAvansId===c.id?(
                      <input type="number" min="0" autoFocus style={{...S.input,width:"100%",padding:"3px 7px",fontSize:13,textAlign:"right"}} value={(c.avans||0)===0?"":c.avans} placeholder="0" onChange={e=>updateAvans(c.id,e.target.value)} onFocus={e=>e.target.select()} onBlur={()=>setEditAvansId(null)} onKeyDown={e=>e.key==="Enter"&&setEditAvansId(null)}/>
                    ):(
                      <span style={{fontSize:13,color:C.gray,cursor:"text",borderBottom:`1px dashed ${C.line}`}} onClick={()=>setEditAvansId(c.id)}>{fmt(c.avans||0)} ₽</span>
                    )}
                  </div>
                  <div style={{textAlign:"right",fontSize:13,fontWeight:600,color:C.ink2}}>{fmt(Math.max(0,c.plan-(c.avans||0)))} ₽</div>
                  <div style={{textAlign:"right",fontSize:13,color:over?C.rose:C.teal,fontWeight:500}}>{fmt(c.actual)} ₽</div>
                  <div style={{display:"flex",gap:4,justifyContent:"flex-end"}} onClick={e=>e.stopPropagation()}>
                    <button style={{...S.btnSm,color:C.teal,padding:"3px 8px"}} onClick={()=>onGoToVendors(c.id)}>→</button>
                    <button style={{...S.btnSm,color:C.rose,padding:"3px 8px"}} onClick={()=>removeCat(c.id)}>✕</button>
                  </div>
                </div>
                {c.expanded&&(
                  <div style={{background:C.lightGray,borderRadius:10,padding:"10px 14px",marginBottom:10,marginLeft:36}}>
                    <div style={{fontSize:10,color:C.gray,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:8}}>Детализация</div>
                    {c.items.length>0?c.items.map(item=>(
                      <div key={item} style={{display:"flex",alignItems:"center",gap:10,padding:"5px 0",borderBottom:`1px solid ${C.sand}`}}>
                        <span style={{flex:1,fontSize:13}}>{item}</span>
                        <input type="number" min="0" style={{...S.input,width:130,padding:"4px 8px",fontSize:12,background:C.white}} placeholder="0" value={c.itemActuals[item]||""} onFocus={e=>e.target.select()} onChange={e=>updateItemActual(c.id,item,e.target.value)}/>
                        <span style={{fontSize:11,color:C.gray,flexShrink:0}}>₽</span>
                      </div>
                    )):<p style={{color:C.gray,fontSize:12,margin:0}}>Нет подстатей</p>}
                    <div style={{display:"flex",justifyContent:"flex-end",marginTop:8,fontSize:12}}><span style={{color:C.gray}}>Итого факт: </span><strong style={{color:C.teal,marginLeft:6}}>{fmt(c.actual)} ₽</strong></div>
                  </div>
                )}
              </div>
            );
          })}
          {(()=>{
            const totAvans=cats.reduce((s,c)=>s+(c.avans||0),0);
            const toPay=Math.max(0,totalPlan-totAvans);
            return(
              <div style={{marginTop:18,borderTop:`2px solid ${C.line}`,paddingTop:16}}>
                <div style={{display:"flex",justifyContent:"space-between",padding:"7px 0",fontSize:13}}><span style={{color:C.gray}}>Итого по смете</span><strong style={{fontFamily:font,fontSize:16}}>{fmt(totalPlan)} ₽</strong></div>
                <div style={{display:"flex",justifyContent:"space-between",padding:"7px 0",fontSize:13,color:C.gray}}><span>Внесено авансов</span><span>−{fmt(totAvans)} ₽</span></div>
                <div style={{display:"flex",justifyContent:"space-between",padding:"7px 0",fontSize:13,borderBottom:`1px solid ${C.line}`}}><span style={{color:C.gray}}>Осталось доплатить</span><strong style={{color:C.blushDark}}>{fmt(toPay)} ₽</strong></div>
                <p style={{fontSize:11,color:C.gray,marginTop:10,lineHeight:1.5}}>Сервисный сбор площадки (10%) и возвратный депозит — справочно, не входят в сумму сметы.</p>
              </div>
            );
          })()}
        </div>
      )}
      {activeTab==="tracker"&&(
        <div style={{display:"flex",flexDirection:"column",gap:18}}>
          <div style={S.card}>
            <h3 style={S.h3}>Добавить расход</h3>
            <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"flex-end"}}>
              <div style={{flex:"1 1 150px"}}><label style={S.label}>Категория</label><select style={S.select} value={newTx.catId} onChange={e=>setNewTx(p=>({...p,catId:e.target.value}))}>{cats.map(c=><option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}</select></div>
              <div style={{flex:"1 1 110px"}}><label style={S.label}>Сумма ₽</label><input type="number" style={S.input} placeholder="50 000" value={newTx.amount} onChange={e=>setNewTx(p=>({...p,amount:e.target.value}))}/></div>
              <div style={{flex:"2 1 180px"}}><label style={S.label}>Комментарий</label><input style={S.input} placeholder="Аванс фотографу" value={newTx.note} onChange={e=>setNewTx(p=>({...p,note:e.target.value}))}/></div>
              <button style={S.btn} onClick={addActual}>+ Добавить</button>
            </div>
          </div>
          <div style={S.card}>
            <h3 style={S.h3}>История</h3>
            {txHistory.length===0?<p style={{color:C.gray,fontSize:13,textAlign:"center",padding:"20px 0"}}>Расходов пока нет</p>:txHistory.map((tx,i)=>{const cat=cats.find(c=>c.id===tx.catId);return(
              <div key={tx.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 0",borderBottom:i<txHistory.length-1?`1px solid ${C.lightGray}`:"none"}}>
                <div style={{display:"flex",gap:8,alignItems:"center"}}><span style={{fontSize:18}}>{cat?.icon||"✨"}</span><div><div style={{fontSize:13,fontWeight:600}}>{tx.note||cat?.name}</div><div style={{fontSize:11,color:C.gray}}>{cat?.name} · {tx.date}</div></div></div>
                <span style={{fontSize:14,fontWeight:700,color:C.rose}}>−{fmt(tx.amount)} ₽</span>
              </div>
            );})}
          </div>
          <div style={S.card}>
            <h3 style={S.h3}>План / Факт</h3>
            {cats.map(c=>(
              <div key={c.id} style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                <span style={{width:20,fontSize:14,flexShrink:0}}>{c.icon}</span>
                <span style={{flex:1,fontSize:12,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.name}</span>
                <span style={{fontSize:11,color:C.gray,width:90,textAlign:"right",flexShrink:0}}>план {fmt(c.plan)}</span>
                <span style={{fontSize:12,fontWeight:700,color:c.actual>c.plan&&c.plan>0?C.rose:C.teal,width:90,textAlign:"right",flexShrink:0}}>факт {fmt(c.actual)}</span>
                <div style={{width:70,flexShrink:0}}><div style={S.bar}><div style={S.fill(c.plan>0?c.actual/c.plan*100:0,c.actual>c.plan&&c.plan>0)}/></div></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
// ─── VENDORS ──────────────────────────────────────────────────────────────────
function VendorsPage({survey,initCat}){
  const[activeCat,setActiveCat]=useState(initCat||"all");
  const[search,setSearch]=useState("");
  const[favs,setFavs]=useState(()=>LS.get("td_favs",[]));
  const[modal,setModal]=useState(null);
  const[contacted,setContacted]=useState(()=>LS.get("td_contacted",[]));
  const date=survey?.date;
  const catMap=Object.fromEntries(DEFAULT_CATS.map(c=>[c.id,c]));
  const avail=DEFAULT_CATS.filter(c=>VENDORS.some(v=>v.cat===c.id));
  useEffect(()=>LS.set("td_favs",favs),[favs]);
  useEffect(()=>LS.set("td_contacted",contacted),[contacted]);
  const filtered=VENDORS.filter(v=>{
    const catOk=activeCat==="all"||v.cat===activeCat;
    const searchOk=!search||v.name.toLowerCase().includes(search.toLowerCase());
    const freeOk=!date||!v.busy.includes(date);
    return catOk&&searchOk&&freeOk;
  });
  return(
    <div className="td-page" style={S.page}>
      <h2 style={S.h1}>Подрядчики</h2>
      <p style={S.sub}>{date?`Свободные на ${new Date(date).toLocaleDateString("ru")} · `:""}{survey?.city||"Москва"}</p>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
        <span style={S.chip(activeCat==="all")} onClick={()=>setActiveCat("all")}>Все</span>
        {avail.map(c=><span key={c.id} style={S.chip(activeCat===c.id)} onClick={()=>setActiveCat(c.id)}>{c.icon} {c.name}</span>)}
      </div>
      <input style={{...S.input,maxWidth:300,marginBottom:20}} placeholder="Поиск..." value={search} onChange={e=>setSearch(e.target.value)}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(290px,1fr))",gap:18}}>
        {filtered.map(v=>{
          const cat=catMap[v.cat];
          return(
            <div key={v.id} style={{...S.card,display:"flex",flexDirection:"column",position:"relative"}}>
              <div style={{position:"absolute",top:12,right:12,cursor:"pointer",fontSize:18}} onClick={()=>setFavs(f=>f.includes(v.id)?f.filter(x=>x!==v.id):[...f,v.id])}>{favs.includes(v.id)?"❤️":"🤍"}</div>
              <div style={{display:"flex",gap:10,marginBottom:10}}>
                <div style={{width:42,height:42,borderRadius:10,background:C.blushBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{cat?.icon}</div>
                <div><div style={{fontWeight:700,fontSize:14}}>{v.name}</div><div style={{fontSize:11,color:C.gray}}>{cat?.name} · {v.city}</div></div>
              </div>
              <p style={{fontSize:12,color:C.gray,lineHeight:1.6,flex:1,margin:"0 0 10px"}}>{v.desc}</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:12}}>{v.tags.map(t=><span key={t} style={S.badge("")}>{t}</span>)}</div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:10,borderTop:`1px solid ${C.line}`}}>
                <div><div style={{fontWeight:700,color:C.teal,fontSize:14}}>от {fmt(v.priceFrom)} ₽</div><div style={{fontSize:10,color:C.gray}}>⭐ {v.rating} · {v.reviews} отзывов</div></div>
                {contacted.includes(v.id)?<span style={S.badge("g")}>✓ Запрос отправлен</span>:<button style={S.btn} onClick={()=>setModal(v)}>Связаться</button>}
              </div>
            </div>
          );
        })}
        {filtered.length===0&&<div style={{...S.card,gridColumn:"1/-1",textAlign:"center",padding:40}}><div style={{fontSize:32,marginBottom:10}}>🔍</div><p style={{color:C.gray}}>Подрядчики не найдены</p></div>}
      </div>
      {modal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(31,27,23,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:500,padding:20}}>
          <div style={{...S.card,maxWidth:460,width:"100%"}}>
            <h3 style={S.h2}>Запрос — {modal.name}</h3>
            <div style={{background:C.lightGray,borderRadius:10,padding:14,fontSize:13,lineHeight:1.9,marginBottom:18}}>
              <b>Дата:</b> {survey?.date?new Date(survey.date).toLocaleDateString("ru"):survey?.season||"не указана"}<br/>
              <b>Город:</b> {survey?.city||"—"}<br/>
              <b>Гостей:</b> {survey?.guests||"—"}<br/>
              <b>Формат:</b> {FORMATS.find(f=>f.id===survey?.format)?.label||"—"}<br/>
              {survey?.concept?.mustHave&&<><b>Обязательно:</b> {survey.concept.mustHave}<br/></>}
            </div>
            <div style={{display:"flex",gap:10}}>
              <button style={S.btn} onClick={()=>{setContacted(p=>[...p,modal.id]);setModal(null);}}>✓ Отправить запрос</button>
              <button style={S.btnO} onClick={()=>setModal(null)}>Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── GUESTS ───────────────────────────────────────────────────────────────────
function GuestsPage({slug,guests,setGuests}){
  const[form,setForm]=useState({name:"",side:"Жениха",rsvp:"Ожидает",diet:"Нет",kids:0,transfer:false,lodging:false,table:"",relation:"",inviteName:"",seatName:"",hostNote:""});
  const[search,setSearch]=useState("");
  const[filter,setFilter]=useState("Все");
  const[expanded,setExpanded]=useState(null);
  const RSVP=["Придёт","Ожидает","Не придёт"];
  const RC={"Придёт":"g","Ожидает":"","Не придёт":"r"};
  const stats={total:guests.length,yes:guests.filter(g=>g.rsvp==="Придёт").length,wait:guests.filter(g=>g.rsvp==="Ожидает").length,transfer:guests.filter(g=>g.transfer).length,lodging:guests.filter(g=>g.lodging).length};
  const filtered=guests.filter(g=>(filter==="Все"||g.rsvp===filter)&&g.name.toLowerCase().includes(search.toLowerCase()));
  const add=()=>{if(!form.name)return;setGuests(p=>[...p,{...form,id:Date.now()}]);setForm({name:"",side:"Жениха",rsvp:"Ожидает",diet:"Нет",kids:0,transfer:false,lodging:false,table:"",relation:"",inviteName:"",seatName:"",hostNote:""});};
  const upd=(id,patch)=>setGuests(p=>p.map(g=>g.id===id?{...g,...patch}:g));
  const del=(id)=>setGuests(p=>p.filter(g=>g.id!==id));
  return(
    <div className="td-page" style={S.page}>
      <h2 style={S.h1}>Список гостей</h2>
      <p style={S.sub}>Ссылка: <strong style={{color:C.blushDark}}>totday.app/{slug}</strong></p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:14,marginBottom:22}}>
        {[{l:"Всего",v:stats.total,c:C.dark},{l:"Подтверждено",v:stats.yes,c:C.teal},{l:"Ожидает",v:stats.wait,c:C.gold},{l:"Трансфер",v:stats.transfer,c:C.ink2},{l:"Проживание",v:stats.lodging,c:C.ink2}].map(s=>(
          <div key={s.l} style={{...S.card,textAlign:"center"}}>
            <div style={{fontSize:10,color:C.gray,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:6}}>{s.l}</div>
            <div style={{fontFamily:font,fontSize:28,color:s.c,fontWeight:600}}>{s.v}</div>
          </div>
        ))}
      </div>
      <div style={{...S.card,marginBottom:20}}>
        <h3 style={S.h3}>Добавить гостя</h3>
        <div style={{display:"flex",flexWrap:"wrap",gap:10,alignItems:"flex-end"}}>
          <div style={{flex:"2 1 160px"}}><label style={S.label}>Имя и фамилия</label><input style={S.input} value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="Имя Фамилия"/></div>
          <div style={{flex:"1 1 120px"}}><label style={S.label}>Кем приходится</label><input style={S.input} value={form.relation} onChange={e=>setForm(p=>({...p,relation:e.target.value}))} placeholder="друг, тётя…"/></div>
          <div style={{flex:"1 1 100px"}}><label style={S.label}>Сторона</label><select style={S.select} value={form.side} onChange={e=>setForm(p=>({...p,side:e.target.value}))}>{["Жениха","Невесты","Общий"].map(s=><option key={s}>{s}</option>)}</select></div>
          <div style={{flex:"1 1 100px"}}><label style={S.label}>RSVP</label><select style={S.select} value={form.rsvp} onChange={e=>setForm(p=>({...p,rsvp:e.target.value}))}>{RSVP.map(s=><option key={s}>{s}</option>)}</select></div>
          <button style={S.btn} onClick={add}>+ Добавить</button>
        </div>
      </div>
      <div style={S.card}>
        <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap",alignItems:"center"}}>
          <div style={{display:"flex",gap:6}}>{["Все",...RSVP].map(f=><button key={f} style={S.tab(filter===f)} onClick={()=>setFilter(f)}>{f}</button>)}</div>
          <input style={{...S.input,width:190}} placeholder="Поиск..." value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <thead><tr style={{borderBottom:`2px solid ${C.line}`}}>{["Имя","Кем приходится","Сторона","RSVP","Стол","Трансфер","Прожив.",""].map(h=><th key={h} style={{padding:"9px 10px",textAlign:"left",fontSize:10,color:C.gray,letterSpacing:"0.08em",textTransform:"uppercase",fontWeight:600}}>{h}</th>)}</tr></thead>
            <tbody>{filtered.map(g=>(
              <Fragment key={g.id}>
                <tr style={{borderBottom:expanded===g.id?"none":`1px solid ${C.line}`}}>
                  <td style={{padding:"11px 10px",fontWeight:500}}>{g.name}</td>
                  <td style={{padding:"11px 10px",color:C.gray}}>{g.relation||"—"}</td>
                  <td style={{padding:"11px 10px",color:C.gray}}>{g.side}</td>
                  <td style={{padding:"11px 10px"}}><span style={S.badge(RC[g.rsvp])}>{g.rsvp}</span></td>
                  <td style={{padding:"11px 10px",color:C.gray}}>{g.table||"—"}</td>
                  <td style={{padding:"11px 10px"}}>{g.transfer?"✓":"—"}</td>
                  <td style={{padding:"11px 10px"}}>{g.lodging?"✓":"—"}</td>
                  <td style={{padding:"11px 10px",textAlign:"right"}}><button style={{...S.btnSm,padding:"4px 10px"}} onClick={()=>setExpanded(expanded===g.id?null:g.id)}>{expanded===g.id?"Скрыть":"Детали"}</button></td>
                </tr>
                {expanded===g.id&&(
                  <tr style={{borderBottom:`1px solid ${C.line}`,background:C.bg}}>
                    <td colSpan={8} style={{padding:"14px 10px"}}>
                      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:12}}>
                        <div><label style={S.label}>Обращение в приглашении</label><input style={S.input} value={g.inviteName||""} onChange={e=>upd(g.id,{inviteName:e.target.value})} placeholder="Дорогая Анна…"/></div>
                        <div><label style={S.label}>Имя на карточке</label><input style={S.input} value={g.seatName||""} onChange={e=>upd(g.id,{seatName:e.target.value})} placeholder="Анна"/></div>
                        <div><label style={S.label}>№ стола</label><input style={S.input} value={g.table||""} onChange={e=>upd(g.id,{table:e.target.value})} placeholder="3"/></div>
                        <div><label style={S.label}>Питание</label><select style={S.select} value={g.diet||"Нет"} onChange={e=>upd(g.id,{diet:e.target.value})}>{["Нет","Вегетарианец","Веган","Без глютена","Халяль"].map(s=><option key={s}>{s}</option>)}</select></div>
                        <div><label style={S.label}>Дети</label><input type="number" min="0" style={S.input} value={g.kids||0} onFocus={e=>e.target.select()} onChange={e=>upd(g.id,{kids:Math.max(0,Number(e.target.value)||0)})}/></div>
                        <div><label style={S.label}>Комментарий ведущему</label><input style={S.input} value={g.hostNote||""} onChange={e=>upd(g.id,{hostNote:e.target.value})} placeholder="тамада, поёт…"/></div>
                        <div style={{display:"flex",gap:16,alignItems:"flex-end",paddingBottom:8}}>
                          <label style={{display:"flex",alignItems:"center",gap:6,fontSize:13,cursor:"pointer"}}><input type="checkbox" checked={!!g.transfer} onChange={e=>upd(g.id,{transfer:e.target.checked})}/>Трансфер</label>
                          <label style={{display:"flex",alignItems:"center",gap:6,fontSize:13,cursor:"pointer"}}><input type="checkbox" checked={!!g.lodging} onChange={e=>upd(g.id,{lodging:e.target.checked})}/>Проживание</label>
                        </div>
                        <div style={{display:"flex",alignItems:"flex-end",paddingBottom:6}}><button style={{...S.btnSm,color:C.rose,borderColor:C.roseBg}} onClick={()=>del(g.id)}>Удалить</button></div>
                      </div>
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── TIMING ───────────────────────────────────────────────────────────────────
function TimingPage({survey,timing,setTiming}){
  const[form,setForm]=useState({block:"day",time:"",title:""});
  const blocks=[{id:"before",label:"За день до"},{id:"day",label:"День свадьбы"}];
  const add=()=>{if(!form.title)return;setTiming(p=>[...p,{...form,id:Date.now()}]);setForm({block:form.block,time:"",title:""});};
  const del=(id)=>setTiming(p=>p.filter(t=>t.id!==id));
  const upd=(id,patch)=>setTiming(p=>p.map(t=>t.id===id?{...t,...patch}:t));
  const dateStr=survey?.date?new Date(survey.date).toLocaleDateString("ru",{day:"numeric",month:"long",year:"numeric"}):"";
  return(
    <div className="td-page" style={S.page}>
      <h2 style={S.h1}>Тайминг дня</h2>
      <p style={S.sub}>Расписание свадьбы{dateStr?` · ${dateStr}`:""}</p>
      <div style={{...S.card,marginBottom:20}}>
        <h3 style={S.h3}>Добавить пункт</h3>
        <div style={{display:"flex",flexWrap:"wrap",gap:10,alignItems:"flex-end"}}>
          <div style={{flex:"1 1 140px"}}><label style={S.label}>Блок</label><select style={S.select} value={form.block} onChange={e=>setForm(p=>({...p,block:e.target.value}))}>{blocks.map(b=><option key={b.id} value={b.id}>{b.label}</option>)}</select></div>
          <div style={{flex:"0 1 110px"}}><label style={S.label}>Время</label><input type="time" style={S.input} value={form.time} onChange={e=>setForm(p=>({...p,time:e.target.value}))}/></div>
          <div style={{flex:"3 1 220px"}}><label style={S.label}>Событие</label><input style={S.input} value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} placeholder="Сбор гостей, церемония…" onKeyDown={e=>e.key==="Enter"&&add()}/></div>
          <button style={S.btn} onClick={add}>+ Добавить</button>
        </div>
      </div>
      {blocks.map(b=>{
        const items=timing.filter(t=>t.block===b.id).sort((a,z)=>(a.time||"").localeCompare(z.time||""));
        return(
          <div key={b.id} style={{...S.card,marginBottom:18}}>
            <div style={{fontSize:11,letterSpacing:"0.14em",textTransform:"uppercase",color:C.blushDark,fontWeight:600,marginBottom:14}}>{b.label}</div>
            {items.length===0?<p style={{color:C.gray,fontSize:13,margin:0}}>Пока пусто</p>:(
              <div>{items.map((t,i)=>(
                <div key={t.id} style={{display:"grid",gridTemplateColumns:"78px 1fr 36px",gap:14,alignItems:"center",padding:"13px 0",borderTop:i>0?`1px solid ${C.line}`:"none"}}>
                  <input style={{...S.input,padding:"6px 10px",fontFamily:font,fontSize:16,textAlign:"center"}} value={t.time||""} onChange={e=>upd(t.id,{time:e.target.value})} placeholder="—:—"/>
                  <input style={{...S.input,padding:"8px 12px",border:"none",background:"transparent",fontSize:14.5}} value={t.title} onChange={e=>upd(t.id,{title:e.target.value})}/>
                  <button style={{...S.btnSm,color:C.rose,padding:"5px 9px"}} onClick={()=>del(t.id)}>✕</button>
                </div>
              ))}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── INVITE PREVIEW (top-level to avoid remount bug) ─────────────────────────
function InvitePreview({t,c,survey}){
  return(
    <div style={{background:t.bg,color:t.textColor,borderRadius:14,padding:"36px 28px",fontFamily:font,border:`1px solid ${t.accent}30`}}>
      <div style={{textAlign:"center",marginBottom:24}}>
        <div style={{fontSize:12,letterSpacing:"0.18em",textTransform:"uppercase",color:t.accent,marginBottom:10}}>Приглашение</div>
        <h1 style={{fontSize:26,margin:"0 0 10px",lineHeight:1.2}}>{c.title}</h1>
        {survey?.date&&<div style={{fontSize:14,color:t.accent}}>{new Date(survey.date).toLocaleDateString("ru",{day:"numeric",month:"long",year:"numeric"})}</div>}
      </div>
      <div style={{textAlign:"center",fontSize:13,lineHeight:1.8,opacity:0.85,marginBottom:20}}>{c.text}</div>
      <div style={{borderTop:`1px solid ${t.accent}40`,borderBottom:`1px solid ${t.accent}40`,padding:"14px 0",margin:"0 0 18px",textAlign:"center"}}>
        <div style={{fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",color:t.accent,marginBottom:5}}>Место</div>
        <div style={{fontSize:14,fontWeight:600}}>{c.venue}</div>
        <div style={{fontSize:11,opacity:0.7,marginTop:3}}>{c.address}</div>
      </div>
      {c.program&&<div style={{marginBottom:18}}>
        <div style={{fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",color:t.accent,marginBottom:8,textAlign:"center"}}>Программа</div>
        {c.program.split("\n").map((l,i)=><div key={i} style={{fontSize:12,padding:"4px 0",borderBottom:`1px solid ${t.accent}20`,opacity:0.85}}>{l}</div>)}
      </div>}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:22}}>
        {[["Дресс-код",c.dresscode],["Пожелания",c.wishes]].map(([l,v])=>(
          <div key={l} style={{textAlign:"center"}}><div style={{fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",color:t.accent,marginBottom:4}}>{l}</div><div style={{fontSize:11,opacity:0.8}}>{v}</div></div>
        ))}
      </div>
      <div style={{textAlign:"center"}}>
        <button style={{padding:"10px 26px",borderRadius:26,border:`2px solid ${t.accent}`,background:t.accent,color:t.id==="luxury"?C.dark:C.white,cursor:"pointer",fontSize:12,fontFamily:font}}>Подтвердить участие</button>
      </div>
    </div>
  );
}

// ─── INVITE PAGE ──────────────────────────────────────────────────────────────
function InvitePage({survey,user,inviteData,setInviteData}){
  const[copied,setCopied]=useState(false);
  const{tmplId="classic",content={}}=inviteData||{};
  const defaultContent={title:`Свадьба ${user?.name2||"Жениха"} & ${user?.name1||"Невесты"}`,venue:"Название площадки",address:"Адрес",text:"Мы рады пригласить вас разделить с нами этот особенный день!",dresscode:"Праздничный дресс-код",wishes:"Цветы и тёплые слова — лучший подарок",program:"17:00 Сбор гостей\n18:00 Выездная церемония\n19:00 Банкет"};
  const c={...defaultContent,...content};
  const t=INVITE_TEMPLATES.find(x=>x.id===tmplId)||INVITE_TEMPLATES[0];
  const slug=makeSlug(user);
  const setTmpl=(id)=>setInviteData(p=>({...(p||{}),tmplId:id}));
  const upd=k=>e=>setInviteData(p=>({...(p||{}),content:{...c,[k]:e.target.value}}));
  return(
    <div className="td-page" style={S.page}>
      <h2 style={S.h1}>Сайт гостей</h2>
      <p style={S.sub}>Персональный сайт — гости подтвердят участие онлайн</p>
      <div style={{...S.card,marginBottom:20}}>
        <h3 style={S.h3}>Шаблон</h3>
        <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
          {INVITE_TEMPLATES.map(t2=>(
            <div key={t2.id} onClick={()=>setTmpl(t2.id)} style={{cursor:"pointer",textAlign:"center"}}>
              <div style={{width:70,height:44,borderRadius:8,background:t2.bg,border:`3px solid ${tmplId===t2.id?t2.accent:C.line}`,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{color:t2.accent,fontFamily:font,fontSize:13}}>Aa</span></div>
              <div style={{fontSize:11,color:tmplId===t2.id?C.blushDark:C.gray,marginTop:3,fontWeight:tmplId===t2.id?700:400}}>{t2.name}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
        <div style={S.card}>
          <h3 style={S.h3}>Редактор</h3>
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {[["title","Заголовок"],["venue","Площадка"],["address","Адрес"],["dresscode","Дресс-код"],["wishes","Пожелания"]].map(([k,l])=>(
              <div key={k}><label style={S.label}>{l}</label><input style={S.input} value={c[k]} onChange={upd(k)}/></div>
            ))}
            <div><label style={S.label}>Приветствие</label><textarea style={{...S.input,minHeight:70,resize:"vertical"}} value={c.text} onChange={upd("text")}/></div>
            <div><label style={S.label}>Программа</label><textarea style={{...S.input,minHeight:70,resize:"vertical"}} value={c.program} onChange={upd("program")}/></div>
          </div>
        </div>
        <div>
          <div style={{...S.card,marginBottom:14}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:13,color:C.teal,fontWeight:700}}>totday.app/{slug}</span>
              <button style={{...S.btn,padding:"6px 14px",fontSize:11}} onClick={()=>{setCopied(true);setTimeout(()=>setCopied(false),2000);}}>{copied?"✓ Скопировано":"Копировать"}</button>
            </div>
          </div>
          <InvitePreview t={t} c={c} survey={survey}/>
        </div>
      </div>
    </div>
  );
}

// ─── COUNTDOWN ────────────────────────────────────────────────────────────────
function CountdownTimer({date,names}){
  const calc=useCallback(()=>{
    if(!date)return null;
    const diff=new Date(date)-new Date();
    if(diff<=0)return{days:0,hours:0,mins:0,secs:0,passed:true};
    return{days:Math.floor(diff/86400000),hours:Math.floor(diff%86400000/3600000),mins:Math.floor(diff%3600000/60000),secs:Math.floor(diff%60000/1000),passed:false};
  },[date]);
  const[t,setT]=useState(calc);
  useEffect(()=>{setT(calc());const id=setInterval(()=>setT(calc()),1000);return()=>clearInterval(id);},[calc]);
  if(!t)return null;
  if(t.passed)return<div style={{fontFamily:font,fontSize:20,color:C.blushDark,fontWeight:500}}>Поздравляем — ваш день настал 🎉</div>;
  const units=[["дней",t.days],["часов",t.hours],["минут",t.mins],["секунд",t.secs]];
  return(
    <div style={{display:"flex",gap:18,alignItems:"center"}}>
      {names&&<div style={{fontFamily:font,fontSize:18,color:C.dark,marginRight:8}}>{names}</div>}
      {units.map(([label,val],i)=>(
        <div key={label} style={{display:"flex",alignItems:"flex-start",gap:18}}>
          <div style={{minWidth:44,textAlign:"center"}}>
            <div style={{fontFamily:font,fontSize:36,fontWeight:700,lineHeight:1,color:C.dark,fontVariantNumeric:"tabular-nums"}}>{String(val).padStart(2,"0")}</div>
            <div style={{fontSize:9,letterSpacing:"0.12em",textTransform:"uppercase",color:C.gray,marginTop:6}}>{label}</div>
          </div>
          {i<units.length-1&&<div style={{fontFamily:font,fontSize:28,color:C.line,lineHeight:1,marginTop:4}}>:</div>}
        </div>
      ))}
    </div>
  );
}

// ─── BUDGET DONUT ─────────────────────────────────────────────────────────────
function BudgetDonut({cats,total}){
  const COLORS=["#F7D7D1","#EADCCB","#DCEFEA","#C9847A","#B89B5E","#3D7A6E","#9A9490","#F5F1EC"];
  const top=cats.filter(c=>c.plan>0).slice(0,8);
  const size=130,r=46,cx=size/2,cy=size/2;
  let startAngle=-Math.PI/2;
  const segments=top.map((c,i)=>{
    const pct=total>0?(c.plan/total):1/top.length;
    const angle=pct*2*Math.PI;
    const x1=cx+r*Math.cos(startAngle),y1=cy+r*Math.sin(startAngle);
    startAngle+=angle;
    const x2=cx+r*Math.cos(startAngle),y2=cy+r*Math.sin(startAngle);
    const large=angle>Math.PI?1:0;
    return{d:`M${cx},${cy} L${x1},${y1} A${r},${r},0,${large},1,${x2},${y2} Z`,color:COLORS[i%COLORS.length]};
  });
  return(
    <svg width={size} height={size} style={{marginBottom:8}}>
      {segments.map((seg,i)=><path key={i} d={seg.d} fill={seg.color}/>)}
      <circle cx={cx} cy={cy} r={32} fill={GLASS}/>
    </svg>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
const SIDE_TABS=[
  {id:"dashboard",label:"Главная",       icon:"🏠"},
  {id:"survey1",  label:"Быстрый расчёт",icon:"📋"},
  {id:"survey2",  label:"Концепция",     icon:"🎨"},
  {id:"budget",   label:"Бюджет",        icon:"💰"},
  {id:"vendors",  label:"Подрядчики",    icon:"🤝"},
  {id:"guests",   label:"Гости",         icon:"👥"},
  {id:"timing",   label:"Тайминг",       icon:"🗓"},
  {id:"invite",   label:"Сайт гостей",   icon:"✉️"},
];

function SideItem({id,label,icon,active,setTab}){
  const on=active===id;
  return(
    <button onClick={()=>setTab(id)} style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:10,padding:"11px 14px",borderRadius:12,border:on?`1px solid ${C.line}`:"1px solid transparent",background:on?C.white:"transparent",color:on?C.dark:C.gray,cursor:"pointer",fontSize:13.5,fontFamily:fb,fontWeight:on?600:500,transition:"all .15s",textAlign:"left",width:"100%",boxShadow:on?SHADOW:"none"}}>
      <span style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:15,width:20,textAlign:"center"}}>{icon}</span><span>{label}</span></span>
      {on&&<span style={{width:6,height:6,borderRadius:"50%",background:C.blushDark,flexShrink:0}}/>}
    </button>
  );
}

function Sidebar({tab,setTab,role,user,survey,openWedding,logout}){
  return(
    <aside style={{width:250,minHeight:"100vh",background:"#FBF9F5",borderRight:`1px solid ${C.line}`,display:"flex",flexDirection:"column",padding:"30px 18px 22px",position:"sticky",top:0,height:"100vh",overflowY:"auto",flexShrink:0,zIndex:100}}>
      <div style={{padding:"0 10px 28px"}}>
        <div style={{display:"flex",alignItems:"center",gap:2}}><span style={{fontSize:23,fontWeight:700,letterSpacing:"-0.04em",color:C.dark,fontFamily:fb}}>totday</span><span style={{width:7,height:7,borderRadius:"50%",background:C.blushDark,display:"inline-block",marginLeft:2}}/></div>
        {role==="agency"&&<div style={{fontSize:10,fontFamily:fb,color:C.blushDark,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",marginTop:2}}>AGENCY</div>}
      </div>
      <nav style={{flex:1,display:"flex",flexDirection:"column",gap:2}}>
        {role==="agency"&&<SideItem id="agency" label="Все свадьбы" icon="🏢" active={tab} setTab={setTab}/>}
        {(role==="agency"?(openWedding?SIDE_TABS:[]):SIDE_TABS).map(t=>(
          <SideItem key={t.id} {...t} active={tab} setTab={setTab}/>
        ))}
      </nav>
      {user&&(
        <div style={{padding:"16px 10px 0",borderTop:`1px solid ${C.line}`,marginTop:16}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
            <div style={{width:36,height:36,borderRadius:"50%",background:`linear-gradient(135deg,${C.blush},${C.champ})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:C.dark,flexShrink:0}}>{user.name1?.[0]||"А"}</div>
            <div style={{flex:1,overflow:"hidden"}}>
              <div style={{fontSize:13,fontWeight:600,color:C.dark,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{user.name1} & {user.name2}</div>
              {survey?.date&&<div style={{fontSize:11,color:C.gray}}>{new Date(survey.date).toLocaleDateString("ru",{day:"numeric",month:"short",year:"numeric"})}</div>}
            </div>
          </div>
          <button style={{...S.btnO,width:"100%",fontSize:12,padding:"8px 14px"}} onClick={logout}>Выйти</button>
        </div>
      )}
    </aside>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({user,survey,cats,guests,onNav}){
  const total=Number(survey?.budget)||1500000;
  const totalActual=cats.reduce((s,c)=>s+c.actual,0);
  const confirmedGuests=guests.filter(g=>g.rsvp==="Придёт").length;
  const tasks=[
    {done:!!survey?.format,           text:"Пройти быстрый расчёт"},
    {done:!!survey?.concept,          text:"Заполнить концепцию"},
    {done:cats.some(c=>c.actual>0),   text:"Добавить первый расход"},
    {done:guests.length>3,            text:"Внести список гостей"},
    {done:false,                      text:"Создать сайт гостей"},
    {done:false,                      text:"Выбрать подрядчиков"},
  ];
  const progress=Math.round(tasks.filter(t=>t.done).length/tasks.length*100);
  const daysUntil=survey?.date?Math.max(0,Math.floor((new Date(survey.date)-new Date())/86400000)):null;
  const dateStr=survey?.date?new Date(survey.date).toLocaleDateString("ru",{day:"numeric",month:"long",year:"numeric"}):"";

  return(
    <div style={S.page}>
      {/* HERO */}
      <p style={{fontSize:14,color:C.gray,marginBottom:16}}>Доброе утро, {user?.name1} и {user?.name2}! 🌅</p>
      <div style={{background:`linear-gradient(145deg,${C.white} 0%,${C.blush} 45%,${C.champ} 80%,${C.tealBg} 100%)`,borderRadius:24,padding:"40px 44px",marginBottom:24,boxShadow:SHADOW,border:`1px solid ${C.line}`,display:"grid",gridTemplateColumns:"1fr 260px",gap:40,alignItems:"center",minHeight:220}}>
        <div>
          <div style={{fontSize:13,color:C.ink2,fontWeight:500,marginBottom:10}}>До вашей свадьбы</div>
          {daysUntil!==null?(
            <div style={{display:"flex",alignItems:"baseline",gap:8,marginBottom:10}}>
              <span style={{fontFamily:font,fontSize:88,fontWeight:700,color:C.dark,lineHeight:1,letterSpacing:"-0.04em"}}>{daysUntil}</span>
              <span style={{fontSize:18,color:C.ink2,fontWeight:600,letterSpacing:"0.06em",textTransform:"uppercase"}}>дней</span>
            </div>
          ):(
            <div style={{fontFamily:font,fontSize:28,color:C.gray,marginBottom:10}}>Укажите дату свадьбы</div>
          )}
          {dateStr&&<div style={{fontSize:14,color:C.ink2,marginBottom:20}}>{dateStr}{survey?.city?` · ${survey.city}`:""}</div>}
          <div style={{marginBottom:24,maxWidth:340}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:C.gray,marginBottom:6}}><span>Общий прогресс подготовки</span><span style={{fontWeight:700,color:C.dark}}>{progress}%</span></div>
            <div style={{...S.bar,height:6}}><div style={{...S.fill(progress),background:`linear-gradient(90deg,${C.blush},${C.blushDark})`}}/></div>
          </div>
          <div style={{display:"flex",gap:10}}>
            <button style={{...S.btn,padding:"11px 22px",fontSize:13}} onClick={()=>onNav("budget")}>Продолжить планирование</button>
            <button style={{...S.btnO,padding:"10px 20px",fontSize:13}} onClick={()=>onNav("survey1")}>Посмотреть план</button>
          </div>
        </div>
        <div style={{borderRadius:20,background:`linear-gradient(160deg,${C.sand},${C.champ})`,height:200,display:"flex",alignItems:"center",justifyContent:"center",fontSize:80,boxShadow:"inset 0 2px 12px rgba(31,27,23,0.06)"}}>💑</div>
      </div>

      {/* STATS */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:24}}>
        <div style={{...S.card,padding:"20px 22px",cursor:"pointer"}} onClick={()=>onNav("budget")}>
          <div style={{fontSize:11,color:C.gray,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:6}}>Бюджет</div>
          <div style={{fontFamily:font,fontSize:22,color:C.dark,fontWeight:600,marginBottom:8}}>{fmt(total)} ₽</div>
          <div style={{display:"flex",flexDirection:"column",gap:3,fontSize:12,color:C.gray}}>
            <span>Пол.: <strong style={{color:C.teal}}>{fmt(totalActual)} ₽</strong></span>
            <span>Ост.: <strong style={{color:totalActual>total?C.rose:C.ink2}}>{fmt(Math.max(0,total-totalActual))} ₽</strong></span>
          </div>
          <div style={{...S.bar,marginTop:10,height:4}}><div style={S.fill(total>0?totalActual/total*100:0)}/></div>
        </div>
        <div style={{...S.card,padding:"20px 22px",cursor:"pointer"}} onClick={()=>onNav("guests")}>
          <div style={{fontSize:11,color:C.gray,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:6}}>Гости</div>
          <div style={{fontFamily:font,fontSize:22,color:C.dark,fontWeight:600,marginBottom:4}}>{guests.length||survey?.guests||0}</div>
          <div style={{fontSize:12,color:C.gray,marginBottom:10}}>пригл. · <strong style={{color:C.teal}}>{confirmedGuests} подтв.</strong></div>
          <div style={{display:"flex"}}>
            {guests.slice(0,5).map((g,i)=>(
              <div key={g.id} style={{width:26,height:26,borderRadius:"50%",background:`hsl(${i*55+10},55%,78%)`,border:`2px solid ${C.white}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,marginLeft:i>0?-7:0}}>{g.name?.[0]||"?"}</div>
            ))}
            {guests.length>5&&<div style={{width:26,height:26,borderRadius:"50%",background:C.line,border:`2px solid ${C.white}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:C.gray,marginLeft:-7}}>+{guests.length-5}</div>}
          </div>
        </div>
        <div style={{...S.card,padding:"20px 22px",cursor:"pointer"}} onClick={()=>onNav("vendors")}>
          <div style={{fontSize:11,color:C.gray,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:6}}>Подрядчики</div>
          <div style={{fontFamily:font,fontSize:22,color:C.dark,fontWeight:600,marginBottom:4}}>4 <span style={{fontSize:14,color:C.gray}}>из {VENDORS.length}</span></div>
          <div style={{fontSize:12,color:C.gray}}>выбрано</div>
        </div>
        <div style={{...S.card,padding:"20px 22px"}}>
          <div style={{fontSize:11,color:C.gray,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:6}}>Чек-лист</div>
          <div style={{fontFamily:font,fontSize:22,color:C.dark,fontWeight:600,marginBottom:4}}>{progress}%</div>
          <div style={{fontSize:12,color:C.gray,marginBottom:10}}>выполнено</div>
          <div style={{...S.bar,height:4}}><div style={S.fill(progress)}/></div>
        </div>
      </div>

      {/* RECOMMENDATIONS */}
      <div style={{marginBottom:24}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <h3 style={{...S.h3,margin:0}}>Рекомендуем для вас</h3>
          <button style={{background:"none",border:"none",color:C.gray,fontSize:13,cursor:"pointer",fontFamily:fb}} onClick={()=>onNav("vendors")}>Смотреть все →</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14}}>
          {DEFAULT_CATS.slice(0,4).map((cat,i)=>{
            const vc=VENDORS.filter(v=>v.cat===cat.id);
            const bgs=[`linear-gradient(135deg,${C.blush},${C.champ})`,`linear-gradient(135deg,${C.champ},${C.tealBg})`,`linear-gradient(135deg,${C.tealBg},${C.sand})`,`linear-gradient(135deg,${C.sand},${C.blush})`];
            return(
              <div key={cat.id} onClick={()=>onNav("vendors")} style={{...S.card,padding:0,overflow:"hidden",cursor:"pointer"}}>
                <div style={{height:96,background:bgs[i],display:"flex",alignItems:"center",justifyContent:"center",fontSize:38,position:"relative"}}>
                  {cat.icon}
                  {vc.length>0&&<div style={{position:"absolute",top:8,right:8,background:C.dark,color:C.white,borderRadius:20,fontSize:9,fontWeight:700,padding:"2px 7px"}}>{vc.length}</div>}
                </div>
                <div style={{padding:"12px 14px"}}>
                  <div style={{fontSize:13,fontWeight:600,color:C.dark,marginBottom:2}}>{cat.name}</div>
                  <div style={{fontSize:11,color:C.gray}}>{vc.length>0?`${vc.length} варианта`:"Выбрать"}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* BOTTOM ROW */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:18,marginBottom:24}}>
        <div style={S.card}>
          <h3 style={{...S.h3,marginBottom:14}}>Ближайшие задачи</h3>
          {tasks.map((t,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 0",borderBottom:i<tasks.length-1?`1px solid ${C.line}`:"none"}}>
              <div style={{width:18,height:18,borderRadius:"50%",border:`2px solid ${t.done?C.teal:C.line}`,background:t.done?C.teal:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                {t.done&&<span style={{color:C.white,fontSize:9,fontWeight:700}}>✓</span>}
              </div>
              <span style={{fontSize:12.5,color:t.done?C.gray:C.dark,textDecoration:t.done?"line-through":"none",flex:1}}>{t.text}</span>
            </div>
          ))}
        </div>
        <div style={{...S.card,display:"flex",flexDirection:"column",alignItems:"center"}}>
          <h3 style={{...S.h3,marginBottom:14,alignSelf:"flex-start"}}>Расходы по категориям</h3>
          <BudgetDonut cats={cats} total={total}/>
          <div style={{fontSize:18,fontFamily:font,color:C.dark,marginBottom:2}}>{fmt(total)} ₽</div>
          <div style={{fontSize:11,color:C.gray,marginBottom:10}}>бюджет</div>
          {cats.slice(0,3).map((c,i)=>{
            const COLORS=["#F7D7D1","#EADCCB","#DCEFEA"];
            return(
              <div key={c.id} style={{display:"flex",justifyContent:"space-between",width:"100%",fontSize:12,color:C.gray,marginTop:4}}>
                <span style={{display:"flex",alignItems:"center",gap:6}}><span style={{width:8,height:8,borderRadius:"50%",background:COLORS[i],display:"inline-block"}}/>  {c.name}</span>
                <span style={{color:C.dark,fontWeight:600}}>{fmt(c.plan)} ₽</span>
              </div>
            );
          })}
        </div>
        <div style={S.card}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <h3 style={{...S.h3,margin:0}}>Площадки</h3>
            <button style={{background:"none",border:"none",color:C.gray,fontSize:11,cursor:"pointer",fontFamily:fb}} onClick={()=>onNav("vendors")}>Все →</button>
          </div>
          {VENDORS.filter(v=>v.cat==="venue").map((v,i)=>(
            <div key={v.id} onClick={()=>onNav("vendors")} style={{display:"flex",gap:12,padding:"10px 0",borderBottom:i<2?`1px solid ${C.line}`:"none",cursor:"pointer",alignItems:"center"}}>
              <div style={{width:44,height:44,borderRadius:10,background:`linear-gradient(135deg,${C.champ},${C.sand})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>🏛</div>
              <div><div style={{fontSize:13,fontWeight:600,color:C.dark,marginBottom:2}}>{v.name}</div><div style={{fontSize:11,color:C.gray}}>от {fmt(v.priceFrom)} ₽</div></div>
            </div>
          ))}
        </div>
      </div>

      {/* INVITE CTA */}
      <div style={{...S.card,display:"flex",justifyContent:"space-between",alignItems:"center",padding:"24px 32px",background:`linear-gradient(135deg,${C.white},${C.blush})`}}>
        <div>
          <div style={{fontFamily:font,fontSize:20,color:C.dark,marginBottom:6}}>Создайте сайт-приглашение для гостей</div>
          <div style={{fontSize:13,color:C.gray}}>Красивый сайт с вашей историей и всей важной информацией</div>
        </div>
        <button style={{...S.btn,flexShrink:0}} onClick={()=>onNav("invite")}>Создать сайт</button>
      </div>
    </div>
  );
}

// ─── AGENCY DASHBOARD ─────────────────────────────────────────────────────────
function AgencyDashboard({weddings,setWeddings,onOpen}){
  const[showAdd,setShowAdd]=useState(false);
  const[nw,setNw]=useState({couple:"",date:"",city:"Москва",guests:"",budget:""});
  const statusColor={"В работе":"gold","Подготовка":"","Завершена":"g"};
  const totalBudget=weddings.reduce((s,w)=>s+(w.budget||0),0);
  const totalPaid=weddings.reduce((s,w)=>s+(w.paid||0),0);
  const active=weddings.filter(w=>w.status!=="Завершена").length;
  const add=()=>{if(!nw.couple)return;setWeddings(p=>[...p,{...nw,id:Date.now(),guests:Number(nw.guests)||0,budget:Number(nw.budget)||0,paid:0,status:"Подготовка"}]);setNw({couple:"",date:"",city:"Москва",guests:"",budget:""});setShowAdd(false);};
  const del=(id)=>setWeddings(p=>p.filter(w=>w.id!==id));
  return(
    <div className="td-page" style={S.page}>
      <h2 style={S.h1}>Кабинет агентства</h2>
      <p style={S.sub}>Все ваши свадьбы в одном месте.</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:16,marginBottom:24}}>
        {[{l:"Активных",v:active,c:C.dark},{l:"Проектов",v:weddings.length,c:C.dark},{l:"Суммарный бюджет",v:`${(totalBudget/1000000).toFixed(1)} млн ₽`,c:C.gold},{l:"Получено",v:`${(totalPaid/1000000).toFixed(1)} млн ₽`,c:C.teal}].map(s=>(
          <div key={s.l} style={{...S.card,textAlign:"center"}}><div style={{fontSize:10,color:C.gray,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:8}}>{s.l}</div><div style={{fontFamily:font,fontSize:26,color:s.c,fontWeight:600}}>{s.v}</div></div>
        ))}
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
        <h3 style={{...S.h2,margin:0}}>Свадьбы</h3>
        <button style={S.btn} onClick={()=>setShowAdd(!showAdd)}>+ Новая свадьба</button>
      </div>
      {showAdd&&(
        <div style={{...S.card,marginBottom:16,display:"flex",flexWrap:"wrap",gap:10,alignItems:"flex-end"}}>
          <div style={{flex:"2 1 180px"}}><label style={S.label}>Пара</label><input style={S.input} value={nw.couple} onChange={e=>setNw(p=>({...p,couple:e.target.value}))} placeholder="Имя & Имя"/></div>
          <div style={{flex:"0 1 140px"}}><label style={S.label}>Дата</label><input type="date" style={S.input} value={nw.date} onChange={e=>setNw(p=>({...p,date:e.target.value}))}/></div>
          <div style={{flex:"1 1 120px"}}><label style={S.label}>Город</label><input style={S.input} value={nw.city} onChange={e=>setNw(p=>({...p,city:e.target.value}))}/></div>
          <div style={{flex:"0 1 90px"}}><label style={S.label}>Гостей</label><input type="number" min="0" style={S.input} value={nw.guests} onChange={e=>setNw(p=>({...p,guests:e.target.value}))}/></div>
          <div style={{flex:"1 1 120px"}}><label style={S.label}>Бюджет ₽</label><input type="number" min="0" style={S.input} value={nw.budget} onChange={e=>setNw(p=>({...p,budget:e.target.value}))}/></div>
          <button style={S.btn} onClick={add}>Добавить</button>
        </div>
      )}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))",gap:18}}>
        {weddings.map(w=>{
          const paidPct=w.budget>0?Math.round(w.paid/w.budget*100):0;
          return(
            <div key={w.id} style={{...S.card,cursor:"pointer",position:"relative"}} onClick={()=>onOpen&&onOpen(w)}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
                <div style={{fontFamily:font,fontSize:20,fontWeight:600}}>{w.couple}</div>
                <span style={S.badge(statusColor[w.status])}>{w.status}</span>
              </div>
              <div style={{fontSize:13,color:C.gray,lineHeight:1.8,marginBottom:14}}>
                {w.date&&<div>{new Date(w.date).toLocaleDateString("ru",{day:"numeric",month:"long",year:"numeric"})}</div>}
                <div>{w.city} · {w.guests} гостей</div>
                <div>Бюджет: {fmt(w.budget)} ₽</div>
              </div>
              <div style={{fontSize:11,color:C.gray,marginBottom:5,display:"flex",justifyContent:"space-between"}}><span>Оплачено</span><span style={{color:C.teal,fontWeight:600}}>{paidPct}%</span></div>
              <div style={S.bar}><div style={S.fill(paidPct)}/></div>
              <button style={{...S.btnSm,position:"absolute",bottom:14,right:14,color:C.rose,padding:"3px 9px"}} onClick={e=>{e.stopPropagation();del(w.id);}}>✕</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App(){
  const[user,      setUser]      =useState(()=>LS.get("td_user",null));
  const[role,      setRole]      =useState(()=>LS.get("td_role","couple"));
  const[agencyWeddings,setAgencyWeddings]=useState(()=>LS.get("td_agency_weddings",[
    {id:1,couple:"Соня & Никита",  date:"2026-08-15",city:"Москва",guests:80, budget:1860000,status:"В работе",  paid:620000},
    {id:2,couple:"Мария & Артём",  date:"2026-09-12",city:"Москва",guests:120,budget:2700000,status:"Подготовка",paid:300000},
    {id:3,couple:"Ольга & Павел",  date:"2026-06-28",city:"Сочи",  guests:45, budget:1100000,status:"Завершена", paid:1100000},
  ]));
  const[openWedding,setOpenWedding]=useState(null);
  const[screen,    setScreen]    =useState("landing");
  const[prefill,   setPrefill]   =useState(null);
  const[tab,       setTab]       =useState("dashboard");
  const[survey,    setSurvey]    =useState(()=>LS.get("td_survey",null));
  const[concept,   setConcept]   =useState(()=>LS.get("td_concept",null));
  const[cats,      setCats]      =useState(()=>LS.get("td_cats",makeCatsFromBudget(1500000,{guests:80,city:"Москва",format:"restaurant"},"comfort")));
  const[guests,    setGuests]    =useState(()=>LS.get("td_guests",[
    {id:1,name:"Анна Петрова",   side:"Невесты",rsvp:"Придёт",   diet:"Нет",kids:0,transfer:false,lodging:false,table:"1",relation:"сестра",inviteName:"Дорогая Анна",seatName:"Анна",hostNote:""},
    {id:2,name:"Михаил Соколов", side:"Жениха", rsvp:"Ожидает",  diet:"Вегетарианец",kids:1,transfer:true,lodging:true,table:"2",relation:"друг",inviteName:"Уважаемый Михаил",seatName:"Михаил",hostNote:"любит петь"},
    {id:3,name:"Елена Смирнова", side:"Невесты",rsvp:"Не придёт",diet:"Нет",kids:0,transfer:false,lodging:false,table:"",relation:"коллега",inviteName:"",seatName:"",hostNote:""},
  ]));
  const[inviteData,setInviteData]=useState(()=>LS.get("td_invite",null));
  const[timing,    setTiming]    =useState(()=>LS.get("td_timing",[
    {id:1,block:"before",time:"16:00",title:"Обзвон всех подрядчиков координатором"},
    {id:2,block:"before",time:"20:00",title:"Подготовить конверты для оплаты команды"},
    {id:3,block:"day",time:"15:40",title:"ЗАГС"},
    {id:4,block:"day",time:"16:40",title:"Трансфер"},
    {id:5,block:"day",time:"17:00",title:"Праздничный банкет"},
    {id:6,block:"day",time:"21:00",title:"Торт"},
    {id:7,block:"day",time:"22:00",title:"Завершение"},
  ]));
  const[vendorCat, setVendorCat] =useState(null);

  useEffect(()=>{if(user)LS.set("td_user",user);},[user]);
  useEffect(()=>{LS.set("td_survey",survey);},[survey]);
  useEffect(()=>{LS.set("td_concept",concept);},[concept]);
  useEffect(()=>{LS.set("td_cats",cats);},[cats]);
  useEffect(()=>{LS.set("td_guests",guests);},[guests]);
  useEffect(()=>{LS.set("td_invite",inviteData);},[inviteData]);
  useEffect(()=>{LS.set("td_timing",timing);},[timing]);
  useEffect(()=>{LS.set("td_role",role);},[role]);
  useEffect(()=>{LS.set("td_agency_weddings",agencyWeddings);},[agencyWeddings]);

  const handleSurvey1Complete=useCallback((d)=>{setSurvey(d);setTab("scenarios");},[]);
  const handleScenarioChosen=useCallback((scenario)=>{
    const totalBudget=scenario.total;
    const next={...survey,budget:totalBudget,chosenScenario:scenario.tier};
    setSurvey(next);
    setCats(makeCatsFromBudget(totalBudget,next,scenario.tier));
    setTab("budget");
  },[survey]);
  const handleConcept=useCallback((d)=>{setConcept(d);setSurvey(prev=>prev?{...prev,concept:d}:null);setTab("budget");},[]);
  const goVendors=useCallback((catId)=>{setVendorCat(catId);setTab("vendors");},[]);
  const handleSetTab=useCallback((newTab)=>{
    if(newTab==="agency"&&openWedding){
      setAgencyWeddings(prev=>prev.map(w=>w.id===openWedding.id?{...w,_cats:cats,_guests:guests,_timing:timing}:w));
      setOpenWedding(null);
    }
    setTab(newTab);
  },[openWedding,cats,guests,timing]);
  const logout=()=>{
    ["td_user","td_survey","td_concept","td_cats","td_guests","td_invite","td_timing","td_txHistory","td_favs","td_contacted","td_role","td_agency_weddings"].forEach(k=>LS.del(k));
    setUser(null);setRole("couple");setOpenWedding(null);setScreen("landing");
  };
  const fullSurvey=survey?{...survey,concept}:null;

  const STYLES=`*{-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}button{transition:all .2s}button:active{transform:scale(.97)}input:focus,select:focus,textarea:focus{border-color:${C.blushDark}!important;box-shadow:0 0 0 3px ${C.blushBg}}@keyframes tdfade{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}.td-page>*{animation:tdfade .5s cubic-bezier(.2,.7,.2,1) both}.td-page>*:nth-child(2){animation-delay:.04s}.td-page>*:nth-child(3){animation-delay:.08s}.td-page>*:nth-child(4){animation-delay:.12s}`;

  if(!user){
    if(screen==="landing")return<LandingPage onStart={()=>{setRole("couple");setScreen("minisurvey");}} onLogin={()=>{setRole("couple");setScreen("auth");}} onAgency={()=>{setRole("agency");setScreen("auth");}}/>;
    if(screen==="minisurvey")return<MiniSurvey onBack={()=>setScreen("landing")} onDone={(d)=>{setPrefill(d);setScreen("auth");}}/>;
    return<AuthPage prefill={prefill} agency={role==="agency"} onBack={()=>setScreen("landing")} onLogin={(u)=>{
      if(prefill){const seed={city:prefill.city,guests:prefill.guests,date:prefill.date||"",budget:Number(prefill.budget)||0,season:"",format:"restaurant"};setSurvey(seed);}
      setUser(u);setTab(role==="agency"?"agency":"dashboard");
    }}/>;
  }

  return(
    <div style={{...S.app,display:"flex",minHeight:"100vh"}}>
      <link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet"/>
      <style>{STYLES}</style>
      <Sidebar tab={tab} setTab={handleSetTab} role={role} user={user} survey={survey} openWedding={openWedding} logout={logout}/>
      <main style={{flex:1,overflow:"auto",minHeight:"100vh",background:C.bg}}>
        {role==="agency"&&tab==="agency"&&<AgencyDashboard weddings={agencyWeddings} setWeddings={setAgencyWeddings} onOpen={(w)=>{setOpenWedding(w);setCats(w._cats||makeCatsFromBudget(w.budget||1500000,{guests:w.guests,city:w.city,format:"restaurant"},"comfort"));setGuests(w._guests||[]);setTiming(w._timing||[]);setTab("budget");}}/>}
        {!(role==="agency"&&tab==="agency")&&(<>
          {tab==="dashboard" &&<Dashboard user={user} survey={fullSurvey} cats={cats} guests={guests} onNav={setTab}/>}
          {tab==="survey1"   &&<Survey1Page onComplete={handleSurvey1Complete} initial={survey}/>}
          {tab==="scenarios" &&survey&&<ScenariosPage survey={survey} onChoose={handleScenarioChosen}/>}
          {tab==="survey2"   &&<Survey2Page onComplete={handleConcept} initial={concept}/>}
          {tab==="budget"    &&<BudgetPage survey={fullSurvey||{city:"Москва",guests:80,budget:1500000,format:"restaurant"}} cats={cats} setCats={setCats} onGoToVendors={goVendors}/>}
          {tab==="vendors"   &&<VendorsPage survey={fullSurvey} initCat={vendorCat}/>}
          {tab==="guests"    &&<GuestsPage slug={makeSlug(user)} guests={guests} setGuests={setGuests}/>}
          {tab==="timing"    &&<TimingPage survey={fullSurvey} timing={timing} setTiming={setTiming}/>}
          {tab==="invite"    &&<InvitePage survey={fullSurvey} user={user} inviteData={inviteData} setInviteData={setInviteData}/>}
        </>)}
      </main>
    </div>
  );
}
