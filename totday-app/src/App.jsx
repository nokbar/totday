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

const VENUES=[
  {id:"v1",type:"loft",   name:"Loft Riverside",     city:"Москва",  address:"Овчинниковская наб., 20",    guests:{min:20,max:200}, priceRent:150000,priceBanquet:4500,corkage:1500,rating:4.9,reviews:87, tags:["Панорамный вид","Своя кухня","Паркинг"],       desc:"Стильный лофт с панорамным видом на Москву-реку. Два зала, собственная кухня, профессиональный свет и звук.", includes:["Мебель","Текстиль","Профзвук","Свет","Паркинг"], busy:["2025-08-16"]},
  {id:"v2",type:"hall",   name:"Golden Hall",         city:"Москва",  address:"Тверская ул., 3",            guests:{min:50,max:300}, priceRent:280000,priceBanquet:6000,corkage:2000,rating:4.8,reviews:54, tags:["Роскошь","Центр","VIP-сервис"],                 desc:"Парадный зал в историческом особняке. Высокие потолки, собственный ресторан.",                            includes:["Мебель","Декор","Звук","Свет","Паркинг"],   busy:[]},
  {id:"v3",type:"estate", name:"Усадьба Захарово",   city:"Москва",  address:"Московская обл., Захарово",  guests:{min:30,max:150}, priceRent:200000,priceBanquet:5000,corkage:1200,rating:4.7,reviews:41, tags:["Природа","Сад","Шатёр"],                        desc:"Загородная усадьба в 40 км от Москвы. Английский сад, пруд, шатёр на 150 человек.",                       includes:["Мебель","Шатёр","Газон","Паркинг"],         busy:[]},
  {id:"v4",type:"hotel",  name:"Radisson Collection", city:"Москва",  address:"Кутузовский просп., 2/1",    guests:{min:100,max:500},priceRent:400000,priceBanquet:8000,corkage:2500,rating:4.9,reviews:112,tags:["5 звёзд","Панорама","Проживание"],              desc:"Пятизвёздочный отель с видом на Москва-Сити. Несколько залов, блок номеров для гостей.",                  includes:["Мебель","Звук","Свет","Блок номеров"],      busy:["2025-09-20"]},
  {id:"v5",type:"loft",   name:"Space Moscow",        city:"Москва",  address:"Ленинградский просп., 80",   guests:{min:50,max:400}, priceRent:350000,priceBanquet:5500,corkage:1800,rating:4.8,reviews:73, tags:["Трансформируемый","LED","Диджитал"],            desc:"Мультиформатное пространство с LED-экранами и профессиональной техникой.",                                includes:["Мебель","Звук","LED","Свет"],               busy:[]},
  {id:"v6",type:"yacht",  name:"Яхт-клуб Буревестник",city:"Москва", address:"Ленинские горы, 1с66",       guests:{min:20,max:80},  priceRent:120000,priceBanquet:5500,corkage:1500,rating:4.8,reviews:38, tags:["На воде","Камерная","Закат"],                   desc:"Яхт-клуб и ресторан на берегу Москвы-реки. Идеально для камерных свадеб и закатных церемоний.",          includes:["Мебель","Звук","Терраса"],                  busy:[]},
];

const VENUE_TYPES=[
  {id:"all",name:"Все"},{id:"loft",name:"Лофт"},{id:"hall",name:"Банкетный зал"},
  {id:"estate",name:"Усадьба"},{id:"hotel",name:"Отель"},{id:"yacht",name:"Яхта"},
];

const AGENCIES=[
  {id:"a1",name:"WeddingLab",         city:"Москва",         priceFrom:150000,rating:4.9,reviews:67,weddings:120,years:8, tags:["Полное ведение","Авторский стиль"], desc:"Организуем свадьбы от 100 до 500 гостей. Работаем по всей России и за рубежом."},
  {id:"a2",name:"Love Story Agency",  city:"Москва",         priceFrom:80000, rating:4.8,reviews:43,weddings:85, years:5, tags:["Координация","Камерные свадьбы"],  desc:"Камерные и интимные свадьбы. Координация и частичное ведение проекта."},
  {id:"a3",name:"Grand Celebration",  city:"Санкт-Петербург",priceFrom:200000,rating:4.9,reviews:89,weddings:200,years:12,tags:["Премиум","Выездные свадьбы"],      desc:"Премиальные свадьбы в Санкт-Петербурге и за рубежом. Более 12 лет на рынке."},
];

const CHECKLIST_TEMPLATE=[
  {month:12,tasks:["Определить дату свадьбы","Составить предварительный список гостей","Определить бюджет","Выбрать и забронировать площадку"]},
  {month:11,tasks:["Выбрать и забронировать ведущего","Решить вопрос с кейтерингом","Первые примерки платья"]},
  {month:10,tasks:["Забронировать фотографа","Забронировать видеографа","Выбрать декоратора и флориста"]},
  {month:9, tasks:["Разослать save the date","Выбрать DJ или живую музыку","Определиться с программой вечера"]},
  {month:8, tasks:["Выбрать торт и десерты","Забронировать транспорт","Выбрать костюм жениха"]},
  {month:7, tasks:["Разослать официальные приглашения","Утвердить меню с кейтерингом","Забронировать проживание для гостей"]},
  {month:6, tasks:["Финальная примерка платья","Составить план рассадки","Выбрать визажиста и стилиста"]},
  {month:5, tasks:["Проверить все брони подрядчиков","Составить тайминг дня","Заказать полиграфию и рассадочные карточки"]},
  {month:4, tasks:["Репетиция образа невесты","Финальный список гостей","Встреча с ведущим — утверждение сценария"]},
  {month:3, tasks:["Финальные расчёты с подрядчиками","Подготовить бонбоньерки","Инструктаж координатора"]},
  {month:2, tasks:["Репетиция церемонии","Оплатить оставшиеся счета","Список контактов на день свадьбы"]},
  {month:1, tasks:["Финальный созвон со всеми подрядчиками","Подготовить чаевые для команды","Собрать свадебный чемодан"]},
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
function AuthPage({onLogin,prefill,onBack,agency,vendor}){
  const[mode,setMode]=useState((prefill||agency||vendor)?"register":"login");
  const[f,setF]=useState({email:"",pass:"",name1:"",name2:""});
  const upd=k=>e=>setF(p=>({...p,[k]:e.target.value}));
  const roleBadge=agency?"AGENCY":vendor?"VENDOR":null;
  const subtitle=agency?"Кабинет для свадебного агентства":vendor?"Кабинет подрядчика":prefill?"Почти готово — создайте аккаунт":"Ваша свадьба, понятная и красивая";
  return(
    <div style={{minHeight:"100vh",background:`linear-gradient(135deg,${C.champ2},${C.bg} 55%,${C.champ})`,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet"/>
      <div style={{...S.card,maxWidth:420,width:"100%"}}>
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:2,marginBottom:4}}><span style={{fontSize:23,fontWeight:700,letterSpacing:"-0.04em",color:C.dark,fontFamily:fb}}>totday</span><span style={{width:7,height:7,borderRadius:"50%",background:C.blushDark,display:"inline-block",marginLeft:2}}/>{roleBadge&&<span style={{fontFamily:fb,fontSize:10,fontWeight:700,color:vendor?C.teal:C.blushDark,background:vendor?C.tealBg:C.blushBg,padding:"2px 8px",borderRadius:6,marginLeft:8}}>{roleBadge}</span>}</div>
          <p style={{color:C.gray,fontSize:14,marginTop:8}}>{subtitle}</p>
        </div>
        {prefill&&!agency&&!vendor&&(<div style={{background:C.blushBg,borderRadius:12,padding:"10px 14px",marginBottom:18,fontSize:13,color:C.ink2,textAlign:"center"}}>✓ {prefill.city} · {prefill.guests} гостей · смета готова</div>)}
        <div style={{display:"flex",gap:6,marginBottom:20,background:C.sand,borderRadius:12,padding:4}}>
          {[["login","Войти"],["register","Регистрация"]].map(([m,l])=>(
            <button key={m} onClick={()=>setMode(m)} style={{...S.tab(mode===m),flex:1}}>{l}</button>
          ))}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:13}}>
          {mode==="register"&&!agency&&!vendor&&(
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div><label style={S.label}>Невеста</label><input style={S.input} placeholder="Соня" value={f.name1} onChange={upd("name1")}/></div>
              <div><label style={S.label}>Жених</label><input style={S.input} placeholder="Никита" value={f.name2} onChange={upd("name2")}/></div>
            </div>
          )}
          {mode==="register"&&agency&&(<div><label style={S.label}>Название агентства</label><input style={S.input} placeholder="Wedding Studio" value={f.name1} onChange={upd("name1")}/></div>)}
          {mode==="register"&&vendor&&(<div><label style={S.label}>Имя или студия</label><input style={S.input} placeholder="Иван Громов / Flora Studio" value={f.name1} onChange={upd("name1")}/></div>)}
          <div><label style={S.label}>Email</label><input style={S.input} type="email" value={f.email} onChange={upd("email")}/></div>
          <div><label style={S.label}>Пароль</label><input style={S.input} type="password" value={f.pass} onChange={upd("pass")}/></div>
          <button style={{...S.btn,width:"100%",padding:13}} onClick={()=>onLogin({email:f.email,name1:f.name1||(agency?"Агентство":vendor?"Подрядчик":"Невеста"),name2:f.name2||"Жених"})}>
            {mode==="login"?"Войти →":"Создать аккаунт →"}
          </button>
          <button style={{background:"none",border:"none",color:C.gray,fontSize:12,cursor:"pointer",textDecoration:"underline"}} onClick={()=>onLogin({email:"demo@totday.app",name1:agency?"Студия":vendor?"Подрядчик":"Соня",name2:"Никита"})}>Войти как демо</button>
          {onBack&&<button style={{background:"none",border:"none",color:C.gray,fontSize:12,cursor:"pointer"}} onClick={onBack}>← На главную</button>}
        </div>
      </div>
    </div>
  );
}

// ─── LANDING ──────────────────────────────────────────────────────────────────
function LandingPage({onStart,onLogin,onAgency,onVendor}){
  const featureCards=[
    {label:"Площадки",sub:"Тысячи мест под формат",href:"vendors",bg:"linear-gradient(150deg,#F5EDE1,#EFE2D0)",svg:<svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#9A7656" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21V10l9-6 9 6v11"/><path d="M3 21h18"/><path d="M9 21v-6a3 3 0 0 1 6 0v6"/></svg>},
    {label:"Подрядчики",sub:"Проверенные профи",href:"vendors",bg:"linear-gradient(150deg,#F6E9E4,#EFDBD3)",svg:<svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#B07866" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="5.4"/><path d="M9 12.6L7.5 21l4.5-2.6L16.5 21 15 12.6"/></svg>},
    {label:"Бюджет",sub:"Смета и трекер расходов",href:"budget",bg:"linear-gradient(150deg,#F3EDE3,#ECE3D4)",svg:<svg width="54" height="54" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#E2C9B2" strokeWidth="2.6"/><path d="M12 3a9 9 0 0 1 8.3 12.4" stroke="#B0573A" strokeWidth="2.6" strokeLinecap="round"/></svg>},
    {label:"Гости",sub:"Список и подтверждения",href:"guests",bg:"linear-gradient(150deg,#ECF1EC,#E0EBE2)",svg:<svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#5E8A7D" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="9" r="3.3"/><path d="M3.2 19.5a5.8 5.8 0 0 1 11.6 0"/><circle cx="17" cy="8" r="2.6" stroke="#9CC0AE"/><path d="M16.4 13.3a5 5 0 0 1 4.4 5" stroke="#9CC0AE"/></svg>},
    {label:"Сайт гостей",sub:"Приглашение за 6 минут",href:"invite",bg:"linear-gradient(150deg,#F5EDE1,#EFE2D0)",svg:<svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="#9A7656" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.5 7.5l8.5 6 8.5-6"/></svg>},
  ];
  return(
    <div style={{background:C.bg,minHeight:"100vh",color:C.dark,fontFamily:fb,WebkitFontSmoothing:"antialiased"}}>
      <link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"/>
      <style>{`*{-webkit-font-smoothing:antialiased}a{text-decoration:none;color:inherit}.lcard{transition:all .2s}.lcard:hover{transform:translateY(-4px);box-shadow:0 22px 44px -22px rgba(33,28,23,.26)}`}</style>

      {/* NAV */}
      <nav style={{position:"sticky",top:0,zIndex:50,background:"rgba(251,249,245,.86)",backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",borderBottom:`1px solid ${C.line}`}}>
        <div style={{maxWidth:1200,margin:"0 auto",padding:"0 40px",height:66,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"baseline",gap:1}}><span style={{fontSize:22,fontWeight:700,letterSpacing:"-.04em"}}>totday</span><span style={{width:7,height:7,borderRadius:"50%",background:C.blushDark,display:"inline-block",marginLeft:2}}/></div>
          <div style={{display:"flex",gap:28,alignItems:"center"}}>
            {["Возможности","Площадки","Подрядчики","О проекте"].map(l=><span key={l} style={{fontSize:13.5,fontWeight:500,color:C.gray,cursor:"pointer"}}>{l}</span>)}
            <span style={{width:1,height:18,background:"#E2DACB",display:"inline-block"}}/>
            <span style={{fontSize:13.5,fontWeight:600,color:"#A66B60",cursor:"pointer"}} onClick={onAgency}>Для агентств</span>
            <span style={{fontSize:13.5,fontWeight:600,color:"#5E8A7D",cursor:"pointer"}} onClick={onVendor}>Для подрядчиков</span>
          </div>
          <button style={{...S.btn,padding:"10px 22px",fontSize:13}} onClick={onLogin}>Войти</button>
        </div>
      </nav>

      {/* HERO */}
      <section style={{position:"relative",overflow:"hidden",minHeight:"calc(100vh - 66px)",display:"flex",alignItems:"center",backgroundImage:"linear-gradient(90deg,rgba(247,233,226,.96) 0%,rgba(247,233,226,.7) 34%,rgba(247,233,226,.15) 56%,rgba(247,233,226,0) 72%),url(/hero-wedding.png)",backgroundSize:"cover",backgroundPosition:"center right"}}>
        <div style={{maxWidth:1240,margin:"0 auto",padding:"48px 40px",width:"100%"}}>
          <div style={{maxWidth:560}}>
            <div style={{fontSize:11,letterSpacing:".2em",textTransform:"uppercase",color:"#A66B60",fontWeight:600,marginBottom:22}}>Планируйте легко · Празднуйте красиво</div>
            <h1 style={{fontSize:"clamp(40px,5.5vw,66px)",lineHeight:1.02,letterSpacing:"-.035em",fontWeight:700,margin:"0 0 24px"}}>Создайте<br/>тот самый день</h1>
            <p style={{fontSize:18,lineHeight:1.6,color:C.ink2,maxWidth:470,margin:"0 0 36px"}}>Современный способ организовать свадьбу. Бюджет, подрядчики, площадки и план подготовки — в одном месте.</p>
            <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
              <button style={{...S.btn,padding:"16px 36px",fontSize:15}} onClick={onStart}>Начать планирование</button>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{background:"#FFFFFF",borderTop:`1px solid ${C.line}`,borderBottom:`1px solid ${C.line}`}}>
        <div style={{maxWidth:1200,margin:"0 auto",padding:"52px 40px"}}>
          <h2 style={{fontSize:28,fontWeight:700,letterSpacing:"-.025em",textAlign:"center",margin:"0 0 40px"}}>Как работает TotDay</h2>
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:24}}>
            {[["1","Создайте свадьбу","Ответьте на несколько вопросов — получите смету и план подготовки","#FDF0ED"],["2","Получите бюджет","Система автоматически распределит бюджет по категориям","#F0F7EE"],["3","Найдите подрядчиков","Каталог проверенных специалистов с ценами и отзывами","#EDF3FD"],["4","Следите за подготовкой","Чек-лист, тайминг и список гостей — всё в одном месте","#FDF5E8"]].map(([n,title,desc,bg])=>(
              <div key={n} style={{background:bg,borderRadius:18,padding:"26px 22px",textAlign:"center",border:`1px solid ${C.line}`}}>
                <div style={{width:42,height:42,borderRadius:"50%",background:C.dark,color:C.white,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,fontWeight:700,margin:"0 auto 14px"}}>{n}</div>
                <div style={{fontSize:15,fontWeight:700,marginBottom:8}}>{title}</div>
                <div style={{fontSize:13,color:C.gray,lineHeight:1.6}}>{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{maxWidth:1200,margin:"0 auto",padding:"52px 40px 72px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:24}}>
          <h2 style={{fontSize:30,fontWeight:700,letterSpacing:"-.025em",margin:0}}>Всё для вашего дня</h2>
          <span style={{fontSize:13,color:"#A66B60",fontWeight:600,cursor:"pointer"}}>Смотреть возможности →</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:16}}>
          {featureCards.map(fc=>(
            <div key={fc.label} className="lcard" onClick={onLogin} style={{border:`1px solid #EBE4D8`,borderRadius:20,overflow:"hidden",background:C.white,boxShadow:"0 1px 2px rgba(33,28,23,.03),0 14px 30px -20px rgba(33,28,23,.12)",cursor:"pointer"}}>
              <div style={{height:150,background:fc.bg,display:"flex",alignItems:"center",justifyContent:"center"}}>{fc.svg}</div>
              <div style={{padding:"15px 17px"}}><div style={{fontSize:14,fontWeight:600}}>{fc.label}</div><div style={{fontSize:11.5,color:"#948D83",marginTop:3}}>{fc.sub}</div></div>
            </div>
          ))}
        </div>
      </section>

      {/* MISSION + STATS */}
      <section style={{background:"linear-gradient(135deg,#F2ECE2 0%,#FFFFFF 42%,#F5E9E2 100%)",borderTop:`1px solid ${C.line}`,borderBottom:`1px solid ${C.line}`}}>
        <div style={{maxWidth:1200,margin:"0 auto",padding:"72px 40px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:60,alignItems:"center"}}>
          <div>
            <h2 style={{fontSize:38,fontWeight:700,letterSpacing:"-.025em",margin:"0 0 16px",lineHeight:1.1}}>TotDay — место, где рождаются свадьбы</h2>
            <p style={{fontSize:16,color:C.ink2,lineHeight:1.6,margin:"0 0 36px"}}>Тысячи пар уже планируют свой день с TotDay — спокойно, красиво и с любовью к деталям.</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:26}}>
              {[["10 000+","пар с нами"],["5 000+","площадок"],["2 000+","подрядчиков"],["98%","довольных пользователей"]].map(([n,l])=>(
                <div key={l}><div style={{fontSize:34,fontWeight:700,letterSpacing:"-.02em"}}>{n}</div><div style={{fontSize:13,color:"#948D83",marginTop:2}}>{l}</div></div>
              ))}
            </div>
          </div>
          <div style={{background:C.white,border:`1px solid #EBE4D8`,borderRadius:20,padding:"28px 30px",boxShadow:"0 1px 2px rgba(33,28,23,.03),0 18px 40px -24px rgba(33,28,23,.2)"}}>
            <div style={{display:"flex",gap:3,marginBottom:14}}>{[...Array(5)].map((_,i)=><span key={i} style={{color:C.blushDark}}>★</span>)}</div>
            <p style={{fontSize:17,lineHeight:1.6,color:C.dark,margin:"0 0 18px",fontWeight:500}}>«TotDay снял с нас весь стресс подготовки. Бюджет, гости, подрядчики — наконец всё в одном месте и по-настоящему красиво.»</p>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:40,height:40,borderRadius:"50%",background:"linear-gradient(140deg,#EBD9C8,#DFC6B8)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:"#6E5A4E"}}>И</div>
              <div><div style={{fontSize:13.5,fontWeight:600}}>Иван и Мария</div><div style={{fontSize:12,color:"#948D83"}}>Поженились 21 июня 2025</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{maxWidth:1200,margin:"0 auto",padding:"84px 40px",textAlign:"center"}}>
        <h2 style={{fontSize:40,fontWeight:700,letterSpacing:"-.025em",margin:"0 0 16px"}}>Планируйте легко. Празднуйте красиво.</h2>
        <p style={{fontSize:16,color:C.ink2,maxWidth:440,margin:"0 auto 34px"}}>Пара вопросов — и вы увидите смету своей свадьбы. Бесплатно.</p>
        <button style={{...S.btn,padding:"16px 42px",fontSize:15}} onClick={onStart}>Начать →</button>
      </section>

      {/* FOOTER */}
      <footer style={{borderTop:`1px solid ${C.line}`}}>
        <div style={{maxWidth:1200,margin:"0 auto",padding:"28px 40px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"baseline",gap:1}}><span style={{fontSize:18,fontWeight:700,letterSpacing:"-.03em"}}>totday</span><span style={{width:5,height:5,borderRadius:"50%",background:C.blushDark,display:"inline-block",marginLeft:2}}/></div>
          <span style={{fontSize:12.5,color:"#948D83"}}>© 2026 TotDay · Ваша свадьба, понятная и красивая</span>
        </div>
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
    <div style={{maxWidth:1200,margin:"0 auto",padding:"30px 40px 60px",display:"flex",flexDirection:"column",gap:20,fontFamily:fb}}>
      <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",gap:16,flexWrap:"wrap"}}>
        <div>
          <div style={{fontSize:24,fontWeight:700,letterSpacing:"-.025em"}}>Бюджет свадьбы</div>
          <div style={{fontSize:13.5,color:"#948D83",marginTop:4}}>{survey?.city||"Город"} · {guests} гостей · {FORMATS.find(f=>f.id===survey?.format)?.label||""}</div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{display:"flex",gap:3,background:"#EFE9DE",borderRadius:12,padding:4}}>
            {[["plan","Смета"],["tracker","Трекер"]].map(([id,label])=>(
              <span key={id} onClick={()=>setActiveTab(id)} style={{padding:"8px 16px",borderRadius:9,background:activeTab===id?"#FFFFFF":"transparent",fontSize:13,fontWeight:activeTab===id?600:500,color:activeTab===id?"#221D18":"#857E74",cursor:"pointer",boxShadow:activeTab===id?"0 1px 2px rgba(33,28,23,.05)":"none",transition:"all .15s"}}>{label}</span>
            ))}
          </div>
          <button style={{padding:"10px 18px",borderRadius:999,border:"1px solid #DDD5C8",background:"#FBF9F5",color:"#221D18",cursor:"pointer",fontFamily:fb,fontSize:13,fontWeight:600}} onClick={()=>{const rows=[["Категория","План ₽","Оплачено ₽","Остаток ₽"],...cats.map(c=>[c.name,c.plan,c.actual,Math.max(0,c.plan-c.actual)]),["ИТОГО",totalPlan,totalActual,Math.max(0,totalPlan-totalActual)]];const csv=rows.map(r=>r.join(";")).join("\n");const a=document.createElement("a");a.href="data:text/csv;charset=utf-8,﻿"+encodeURIComponent(csv);a.download="budget.csv";a.click();}}>Экспорт</button>
        </div>
      </div>
      <section style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16}}>
        <div style={{background:"#FFFFFF",border:"1px solid #EBE4D8",borderRadius:18,padding:22,boxShadow:"0 1px 2px rgba(33,28,23,.03),0 14px 30px -20px rgba(33,28,23,.14)"}}>
          <div style={{fontSize:10.5,letterSpacing:".14em",textTransform:"uppercase",color:"#A39C92",fontWeight:600,marginBottom:12}}>Общий бюджет</div>
          {editingBudget
            ?<input autoFocus type="number" style={{fontSize:22,fontWeight:700,letterSpacing:"-.03em",width:"100%",border:"none",outline:"none",background:"transparent",fontFamily:fb,marginBottom:6,padding:0}} value={budgetInput} onChange={e=>setBudgetInput(e.target.value)} onBlur={()=>applyNewBudget(budgetInput)} onKeyDown={e=>{if(e.key==="Enter")applyNewBudget(budgetInput);if(e.key==="Escape")setEditingBudget(false);}}/>
            :<div onClick={()=>{setBudgetInput(String(totalBudget));setEditingBudget(true);}} style={{fontSize:23,fontWeight:700,letterSpacing:"-.03em",fontVariantNumeric:"tabular-nums",whiteSpace:"nowrap",marginBottom:6,cursor:"pointer",borderBottom:"1px dashed #D2A296"}}>{fmt(totalBudget)} ₽</div>
          }
          <div style={{fontSize:12,color:"#948D83"}}>≈ {fmt(Math.round(totalBudget/Math.max(1,guests)))} ₽ на гостя</div>
        </div>
        <div style={{background:"#FFFFFF",border:"1px solid #EBE4D8",borderRadius:18,padding:22,boxShadow:"0 1px 2px rgba(33,28,23,.03),0 14px 30px -20px rgba(33,28,23,.14)"}}>
          <div style={{fontSize:10.5,letterSpacing:".14em",textTransform:"uppercase",color:"#A39C92",fontWeight:600,marginBottom:12}}>Запланировано</div>
          <div style={{fontSize:23,fontWeight:700,letterSpacing:"-.03em",fontVariantNumeric:"tabular-nums",whiteSpace:"nowrap",marginBottom:6,color:totalPlan>totalBudget?"#A66B60":"#221D18"}}>{fmt(totalPlan)} ₽</div>
          <div style={{fontSize:12,color:"#948D83"}}>распределено по {cats.length} категориям</div>
        </div>
        <div style={{background:"#FFFFFF",border:"1px solid #EBE4D8",borderRadius:18,padding:22,boxShadow:"0 1px 2px rgba(33,28,23,.03),0 14px 30px -20px rgba(33,28,23,.14)"}}>
          <div style={{fontSize:10.5,letterSpacing:".14em",textTransform:"uppercase",color:"#A39C92",fontWeight:600,marginBottom:12}}>Потрачено</div>
          <div style={{fontSize:23,fontWeight:700,letterSpacing:"-.03em",fontVariantNumeric:"tabular-nums",whiteSpace:"nowrap",marginBottom:6,color:"#5E8A7D"}}>{fmt(totalActual)} ₽</div>
          <div style={{fontSize:12,color:"#948D83"}}>{totalBudget>0?Math.round(totalActual/totalBudget*100):0}% бюджета</div>
        </div>
        <div style={{background:"#FFFFFF",border:"1px solid #EBE4D8",borderRadius:18,padding:22,boxShadow:"0 1px 2px rgba(33,28,23,.03),0 14px 30px -20px rgba(33,28,23,.14)"}}>
          <div style={{fontSize:10.5,letterSpacing:".14em",textTransform:"uppercase",color:"#A39C92",fontWeight:600,marginBottom:12}}>Остаток</div>
          <div style={{fontSize:23,fontWeight:700,letterSpacing:"-.03em",fontVariantNumeric:"tabular-nums",whiteSpace:"nowrap",marginBottom:6,color:leftBudget>=0?"#221D18":"#A66B60"}}>{fmt(Math.abs(leftBudget))} ₽</div>
          <div style={{fontSize:12,color:"#948D83"}}>{leftBudget>=0?"свободно к оплате":"перерасход бюджета"}</div>
        </div>
      </section>

      <section style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
        <div style={{background:"#FFFFFF",border:"1px solid #EBE4D8",borderRadius:20,padding:24,boxShadow:"0 1px 2px rgba(33,28,23,.03),0 14px 30px -20px rgba(33,28,23,.12)"}}>
          <div style={{fontSize:11,letterSpacing:".14em",textTransform:"uppercase",color:"#A39C92",fontWeight:600,marginBottom:4}}>Структура</div>
          <div style={{fontSize:18,fontWeight:600,letterSpacing:"-.01em",marginBottom:18}}>Распределение бюджета</div>
          {(()=>{
            const CIRC=2*Math.PI*70;
            const DC=["#BD877C","#D2A296","#5E8A7D","#E3C2A8","#CBB892","#E5DBCB"];
            const sorted=[...cats].sort((a,b)=>b.plan-a.plan);
            const top5=sorted.slice(0,5);
            const restPlan=sorted.slice(5).reduce((s,c)=>s+c.plan,0);
            const allSegs=[...top5.map((c,i)=>({name:c.name,plan:c.plan,color:DC[i]})),...(restPlan>0?[{name:`Остальные ${cats.length-5} категорий`,plan:restPlan,color:DC[5]}]:[])];
            let cum=0;
            const segs=allSegs.map(s=>{const pct=totalPlan>0?s.plan/totalPlan:0;const arc=pct*CIRC;const rot=cum*360-90;cum+=pct;return{...s,pct,arc,rot};});
            const mln=totalBudget>=1000000?(totalBudget/1000000).toFixed(2).replace(".",",")+' млн':(totalBudget/1000).toFixed(0)+' тыс';
            return(
              <div style={{display:"flex",alignItems:"center",gap:26}}>
                <div style={{position:"relative",width:180,height:180,flexShrink:0}}>
                  <svg width="180" height="180" viewBox="0 0 180 180">
                    <circle cx="90" cy="90" r="70" fill="none" stroke="#F1EBE1" strokeWidth="22"/>
                    {segs.map((s,i)=><circle key={i} cx="90" cy="90" r="70" fill="none" stroke={s.color} strokeWidth="22" strokeDasharray={`${s.arc} ${CIRC}`} transform={`rotate(${s.rot} 90 90)`}/>)}
                  </svg>
                  <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
                    <div style={{fontSize:18,fontWeight:700,letterSpacing:"-.02em",fontVariantNumeric:"tabular-nums"}}>{mln}</div>
                    <div style={{fontSize:10,letterSpacing:".1em",textTransform:"uppercase",color:"#A39C92",marginTop:2}}>бюджет ₽</div>
                  </div>
                </div>
                <div style={{flex:1,display:"flex",flexDirection:"column",gap:11}}>
                  {segs.map((s,i)=>(
                    <div key={i} style={{display:"flex",alignItems:"center",gap:10}}>
                      <span style={{width:9,height:9,borderRadius:3,background:s.color,flexShrink:0}}/>
                      <span style={{flex:1,fontSize:12.5,color:"#5C554B"}}>{s.name}</span>
                      <span style={{fontSize:12.5,fontWeight:600,fontVariantNumeric:"tabular-nums"}}>{Math.round(s.pct*100)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
        <div style={{background:"#FFFFFF",border:"1px solid #EBE4D8",borderRadius:20,padding:24,boxShadow:"0 1px 2px rgba(33,28,23,.03),0 14px 30px -20px rgba(33,28,23,.12)"}}>
          <div style={{fontSize:11,letterSpacing:".14em",textTransform:"uppercase",color:"#A39C92",fontWeight:600,marginBottom:4}}>Платежи</div>
          <div style={{fontSize:18,fontWeight:600,letterSpacing:"-.01em",marginBottom:4}}>График по месяцам</div>
          <div style={{fontSize:12,color:"#948D83",marginBottom:22}}>Плановые выплаты до даты свадьбы</div>
          <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",gap:8,height:140,paddingBottom:2}}>
            {[33,39,29,36,58,72,91,117,130].map((h,i)=>(
              <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:8}}>
                <div style={{width:"100%",maxWidth:26,height:h,background:["#E3C2A8","#E3C2A8","#E3C2A8","#E0B79B","#D9A892","#CF9A85","#C68F7D","#BD877C","#221D18"][i],borderRadius:"6px 6px 3px 3px"}}/>
                <span style={{fontSize:10,color:i===8?"#5C554B":"#A39C92",fontWeight:i===8?600:400}}>{["Авг","Окт","Дек","Фев","Апр","Май","Июн","Июл","Авг"][i]}</span>
              </div>
            ))}
          </div>
          <div style={{display:"flex",justifyContent:"space-between",marginTop:14,paddingTop:14,borderTop:"1px solid #F1EBE1",fontSize:12}}>
            <span style={{color:"#948D83"}}>Пик выплат — месяц свадьбы</span>
            <span style={{fontWeight:600}}>{fmt(Math.round(totalPlan*0.22))} ₽</span>
          </div>
        </div>
      </section>

      <section style={{background:"#FFFFFF",border:"1px solid #EBE4D8",borderRadius:20,padding:24,boxShadow:"0 1px 2px rgba(33,28,23,.03),0 14px 30px -20px rgba(33,28,23,.12)"}}>
        <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:16}}>
          <div>
            <div style={{fontSize:11,letterSpacing:".14em",textTransform:"uppercase",color:"#A39C92",fontWeight:600,marginBottom:4}}>Освоение бюджета</div>
            <div style={{fontSize:18,fontWeight:600,letterSpacing:"-.01em"}}>Оплачено и законтрактовано</div>
          </div>
          <div style={{fontSize:30,fontWeight:700,letterSpacing:"-.03em",fontVariantNumeric:"tabular-nums"}}>{Math.round(budgetPct)}%</div>
        </div>
        {(()=>{
          const totAvans=cats.reduce((s,c)=>s+(c.avans||0),0);
          const paidW=totalBudget>0?Math.min(100,totalActual/totalBudget*100):0;
          const avansW=totalBudget>0?Math.min(100-paidW,Math.max(0,totAvans-totalActual)/totalBudget*100):0;
          return(
            <>
              <div style={{display:"flex",height:14,borderRadius:8,overflow:"hidden",background:"#EFE8DD"}}>
                <div style={{width:`${paidW}%`,background:"#BD877C"}}/>
                <div style={{width:`${avansW}%`,background:"#E3C2A8"}}/>
              </div>
              <div style={{display:"flex",gap:26,marginTop:16,flexWrap:"wrap"}}>
                <div style={{display:"flex",alignItems:"center",gap:9}}><span style={{width:10,height:10,borderRadius:3,background:"#BD877C",flexShrink:0}}/><span style={{fontSize:12.5,color:"#5C554B"}}>Оплачено</span><span style={{fontSize:12.5,fontWeight:600}}>{fmt(totalActual)} ₽</span></div>
                <div style={{display:"flex",alignItems:"center",gap:9}}><span style={{width:10,height:10,borderRadius:3,background:"#E3C2A8",flexShrink:0}}/><span style={{fontSize:12.5,color:"#5C554B"}}>Авансы</span><span style={{fontSize:12.5,fontWeight:600}}>{fmt(totAvans)} ₽</span></div>
                <div style={{display:"flex",alignItems:"center",gap:9}}><span style={{width:10,height:10,borderRadius:3,background:"#EFE8DD",border:"1px solid #E2DACB",flexShrink:0}}/><span style={{fontSize:12.5,color:"#5C554B"}}>Свободно</span><span style={{fontSize:12.5,fontWeight:600}}>{fmt(Math.max(0,totalBudget-totalActual-totAvans))} ₽</span></div>
              </div>
            </>
          );
        })()}
      </section>

      {activeTab==="plan"&&(
        <section style={{background:"#FFFFFF",border:"1px solid #EBE4D8",borderRadius:20,padding:24,boxShadow:"0 1px 2px rgba(33,28,23,.03),0 14px 30px -20px rgba(33,28,23,.12)"}}>
          <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:16}}>
            <div>
              <div style={{fontSize:11,letterSpacing:".14em",textTransform:"uppercase",color:"#A39C92",fontWeight:600,marginBottom:4}}>Детализация</div>
              <div style={{fontSize:18,fontWeight:600,letterSpacing:"-.01em"}}>Категории сметы</div>
            </div>
            <button style={{background:"none",border:"none",color:"#A66B60",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:fb}} onClick={()=>setShowAddCat(v=>!v)}>{showAddCat?"Скрыть ✕":"+ Добавить"}</button>
          </div>
          {showAddCat&&(
            <div style={{background:"#FBF9F5",border:"1px solid #EBE4D8",borderRadius:12,padding:"16px 18px",marginBottom:18,display:"flex",gap:12,flexWrap:"wrap",alignItems:"flex-end"}}>
              <div style={{flex:"2 1 150px"}}><div style={{fontSize:10.5,letterSpacing:".1em",textTransform:"uppercase",color:"#A39C92",fontWeight:600,marginBottom:6}}>Название</div><input style={{border:"1px solid #E2DACB",borderRadius:11,padding:"11px 14px",fontSize:13,fontFamily:fb,width:"100%",background:"#FBF9F5"}} value={newCat.name} onChange={e=>setNewCat(p=>({...p,name:e.target.value}))} placeholder="Шоу-программа"/></div>
              <div style={{flex:"1 1 110px"}}><div style={{fontSize:10.5,letterSpacing:".1em",textTransform:"uppercase",color:"#A39C92",fontWeight:600,marginBottom:6}}>План ₽</div><input type="number" style={{border:"1px solid #E2DACB",borderRadius:11,padding:"11px 14px",fontSize:13,fontFamily:fb,width:"100%",background:"#FBF9F5"}} value={newCat.plan} onChange={e=>setNewCat(p=>({...p,plan:e.target.value}))} placeholder="50000"/></div>
              <button style={{padding:"11px 22px",borderRadius:999,background:"#221D18",color:"#FBF9F5",fontSize:13,fontWeight:600,border:"none",cursor:"pointer",fontFamily:fb}} onClick={addCat}>Добавить</button>
              <button style={{padding:"11px 18px",borderRadius:999,background:"transparent",color:"#857E74",fontSize:13,fontWeight:500,border:"1px solid #E2DACB",cursor:"pointer",fontFamily:fb}} onClick={()=>setShowAddCat(false)}>Отмена</button>
            </div>
          )}
          <div style={{display:"grid",gridTemplateColumns:"34px 1fr 120px 150px 110px 64px",gap:14,padding:"0 0 11px",borderBottom:"1px solid #ECE5DA",fontSize:10,letterSpacing:".1em",textTransform:"uppercase",color:"#A39C92",fontWeight:600,alignItems:"center"}}>
            <div/><div>Категория</div><div style={{textAlign:"right"}}>План</div><div>Прогресс</div><div style={{textAlign:"right"}}>Факт</div><div style={{textAlign:"right"}}>%</div>
          </div>
          {cats.map((c,i)=>{
            const pct=c.plan>0?Math.min(100,Math.round(c.actual/c.plan*100)):0;
            const over=c.actual>c.plan&&c.plan>0;
            const done=pct>=100;
            return(
              <div key={c.id}>
                <div style={{display:"grid",gridTemplateColumns:"34px 1fr 120px 150px 110px 64px",gap:14,padding:"13px 0",borderBottom:i<cats.length-1?"1px solid #F1EBE1":"none",alignItems:"center"}}>
                  <span onClick={()=>toggleExpand(c.id)} style={{width:34,height:34,borderRadius:10,background:"#F1EBE1",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#7A7266",cursor:"pointer",flexShrink:0}}>{(c.name||"?").slice(0,2)}</span>
                  <div style={{cursor:"pointer"}} onClick={()=>toggleExpand(c.id)}>
                    <div style={{fontSize:13.5,fontWeight:500}}>{c.name}{over&&<span style={{marginLeft:6,fontSize:10.5,color:"#A66B60",background:"#F5E4E0",padding:"2px 7px",borderRadius:6}}>перерасход</span>}</div>
                    {c.rec&&<div style={{fontSize:10.5,color:"#A66B60",marginTop:2}}>{c.rec}</div>}
                  </div>
                  <div style={{textAlign:"right"}} onClick={e=>e.stopPropagation()}>
                    {editPlanId===c.id
                      ?<input type="number" autoFocus style={{border:"1px solid #E2DACB",borderRadius:8,padding:"4px 8px",fontSize:13,textAlign:"right",width:"100%",fontFamily:fb,outline:"none"}} value={c.plan===0?"":c.plan} onChange={e=>updatePlan(c.id,e.target.value)} onBlur={()=>setEditPlanId(null)} onKeyDown={e=>e.key==="Enter"&&setEditPlanId(null)}/>
                      :<span style={{fontSize:13,fontVariantNumeric:"tabular-nums",cursor:"text",borderBottom:"1px dashed #D2A296"}} onClick={()=>setEditPlanId(c.id)}>{fmt(c.plan)} ₽</span>
                    }
                  </div>
                  <div><div style={{height:5,borderRadius:5,background:"#EFE8DD",overflow:"hidden"}}><div style={{height:"100%",width:`${Math.min(100,pct)}%`,background:over?"#A66B60":done?"#5E8A7D":"#BD877C",borderRadius:5}}/></div></div>
                  <div style={{textAlign:"right",fontSize:13,fontWeight:600,fontVariantNumeric:"tabular-nums",color:over?"#A66B60":"#221D18"}}>{fmt(c.actual)} ₽</div>
                  <div style={{textAlign:"right",fontSize:12.5,fontVariantNumeric:"tabular-nums",color:done?"#5E8A7D":"#948D83",fontWeight:done?600:400}}>{pct}</div>
                </div>
                {c.expanded&&(
                  <div style={{background:"#FBF9F5",borderRadius:10,padding:"12px 16px",marginBottom:8,marginLeft:48}}>
                    <div style={{display:"flex",gap:16,flexWrap:"wrap",marginBottom:8,alignItems:"flex-end"}}>
                      <div style={{flex:"1 1 120px"}}>
                        <div style={{fontSize:10,letterSpacing:".08em",textTransform:"uppercase",color:"#A39C92",fontWeight:600,marginBottom:4}}>Аванс ₽</div>
                        {editAvansId===c.id
                          ?<input type="number" autoFocus style={{border:"1px solid #E2DACB",borderRadius:8,padding:"6px 10px",fontSize:13,fontFamily:fb,width:"100%",outline:"none"}} value={(c.avans||0)===0?"":c.avans} onChange={e=>updateAvans(c.id,e.target.value)} onBlur={()=>setEditAvansId(null)} onKeyDown={e=>e.key==="Enter"&&setEditAvansId(null)}/>
                          :<span style={{fontSize:13,cursor:"text",borderBottom:"1px dashed #D2A296",display:"inline-block"}} onClick={()=>setEditAvansId(c.id)}>{fmt(c.avans||0)} ₽</span>
                        }
                      </div>
                      <div style={{flex:"1 1 120px"}}><div style={{fontSize:10,letterSpacing:".08em",textTransform:"uppercase",color:"#A39C92",fontWeight:600,marginBottom:4}}>К доплате</div><span style={{fontSize:13,fontWeight:600}}>{fmt(Math.max(0,c.plan-(c.avans||0)))} ₽</span></div>
                      <button style={{padding:"7px 14px",borderRadius:999,background:"transparent",color:"#5E8A7D",fontSize:12,fontWeight:600,border:"1px solid #5E8A7D",cursor:"pointer",fontFamily:fb}} onClick={()=>onGoToVendors(c.id)}>→ Подрядчик</button>
                      <button style={{padding:"7px 14px",borderRadius:999,background:"transparent",color:"#A66B60",fontSize:12,fontWeight:600,border:"1px solid #E2DACB",cursor:"pointer",fontFamily:fb}} onClick={()=>removeCat(c.id)}>Удалить</button>
                    </div>
                    {c.items.length>0&&c.items.map(item=>(
                      <div key={item} style={{display:"flex",alignItems:"center",gap:10,padding:"5px 0",borderBottom:"1px solid #ECE5DA"}}>
                        <span style={{flex:1,fontSize:13}}>{item}</span>
                        <input type="number" min="0" style={{width:120,padding:"4px 8px",border:"1px solid #E2DACB",borderRadius:8,fontSize:12,fontFamily:fb,outline:"none"}} placeholder="0" value={c.itemActuals[item]||""} onFocus={e=>e.target.select()} onChange={e=>updateItemActual(c.id,item,e.target.value)}/>
                        <span style={{fontSize:11,color:"#948D83"}}>₽</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <div style={{display:"flex",justifyContent:"flex-end",gap:34,marginTop:18,paddingTop:16,borderTop:"1px solid #ECE5DA"}}>
            <div style={{textAlign:"right"}}><div style={{fontSize:11,color:"#A39C92",marginBottom:3}}>Итого план</div><div style={{fontSize:16,fontWeight:700,fontVariantNumeric:"tabular-nums"}}>{fmt(totalPlan)} ₽</div></div>
            <div style={{textAlign:"right"}}><div style={{fontSize:11,color:"#A39C92",marginBottom:3}}>Оплачено</div><div style={{fontSize:16,fontWeight:700,color:"#5E8A7D",fontVariantNumeric:"tabular-nums"}}>{fmt(totalActual)} ₽</div></div>
            <div style={{textAlign:"right"}}><div style={{fontSize:11,color:"#A39C92",marginBottom:3}}>Осталось</div><div style={{fontSize:16,fontWeight:700,color:"#A66B60",fontVariantNumeric:"tabular-nums"}}>{fmt(Math.max(0,totalPlan-totalActual))} ₽</div></div>
          </div>
        </section>
      )}

      {activeTab==="tracker"&&(
        <div style={{display:"flex",flexDirection:"column",gap:20}}>
          <div style={{background:"#FFFFFF",border:"1px solid #EBE4D8",borderRadius:20,padding:24,boxShadow:"0 1px 2px rgba(33,28,23,.03),0 14px 30px -20px rgba(33,28,23,.12)"}}>
            <div style={{fontSize:14,fontWeight:600,marginBottom:14}}>Добавить расход</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:12,alignItems:"flex-end"}}>
              <div style={{flex:"1 1 150px"}}><div style={{fontSize:10.5,letterSpacing:".1em",textTransform:"uppercase",color:"#A39C92",fontWeight:600,marginBottom:6}}>Категория</div><select style={{border:"1px solid #E2DACB",borderRadius:11,padding:"11px 14px",fontSize:13,fontFamily:fb,background:"#FBF9F5",width:"100%"}} value={newTx.catId} onChange={e=>setNewTx(p=>({...p,catId:e.target.value}))}>{cats.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
              <div style={{flex:"1 1 110px"}}><div style={{fontSize:10.5,letterSpacing:".1em",textTransform:"uppercase",color:"#A39C92",fontWeight:600,marginBottom:6}}>Сумма ₽</div><input type="number" style={{border:"1px solid #E2DACB",borderRadius:11,padding:"11px 14px",fontSize:13,fontFamily:fb,background:"#FBF9F5",width:"100%",outline:"none"}} placeholder="50 000" value={newTx.amount} onChange={e=>setNewTx(p=>({...p,amount:e.target.value}))}/></div>
              <div style={{flex:"2 1 180px"}}><div style={{fontSize:10.5,letterSpacing:".1em",textTransform:"uppercase",color:"#A39C92",fontWeight:600,marginBottom:6}}>Комментарий</div><input style={{border:"1px solid #E2DACB",borderRadius:11,padding:"11px 14px",fontSize:13,fontFamily:fb,background:"#FBF9F5",width:"100%",outline:"none"}} placeholder="Аванс фотографу" value={newTx.note} onChange={e=>setNewTx(p=>({...p,note:e.target.value}))}/></div>
              <button style={{padding:"11px 22px",borderRadius:999,background:"#221D18",color:"#FBF9F5",fontSize:13,fontWeight:600,border:"none",cursor:"pointer",fontFamily:fb}} onClick={addActual}>+ Добавить</button>
            </div>
          </div>
          <div style={{background:"#FFFFFF",border:"1px solid #EBE4D8",borderRadius:20,padding:24,boxShadow:"0 1px 2px rgba(33,28,23,.03),0 14px 30px -20px rgba(33,28,23,.12)"}}>
            <div style={{fontSize:14,fontWeight:600,marginBottom:14}}>История расходов</div>
            {txHistory.length===0?<p style={{color:"#948D83",fontSize:13,textAlign:"center",padding:"20px 0"}}>Расходов пока нет</p>:txHistory.map((tx,i)=>{const cat=cats.find(c=>c.id===tx.catId);return(
              <div key={tx.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 0",borderBottom:i<txHistory.length-1?"1px solid #F1EBE1":"none"}}>
                <div style={{display:"flex",gap:10,alignItems:"center"}}><span style={{width:34,height:34,borderRadius:10,background:"#F1EBE1",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#7A7266",flexShrink:0}}>{(cat?.name||"?").slice(0,2)}</span><div><div style={{fontSize:13,fontWeight:600}}>{tx.note||cat?.name}</div><div style={{fontSize:11,color:"#948D83"}}>{cat?.name} · {tx.date}</div></div></div>
                <span style={{fontSize:14,fontWeight:700,color:"#A66B60"}}>−{fmt(tx.amount)} ₽</span>
              </div>
            );})}
          </div>
          <div style={{background:"#FFFFFF",border:"1px solid #EBE4D8",borderRadius:20,padding:24,boxShadow:"0 1px 2px rgba(33,28,23,.03),0 14px 30px -20px rgba(33,28,23,.12)"}}>
            <div style={{fontSize:14,fontWeight:600,marginBottom:14}}>План / Факт</div>
            {cats.map(c=>(
              <div key={c.id} style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <span style={{width:28,height:28,borderRadius:8,background:"#F1EBE1",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,color:"#7A7266",flexShrink:0}}>{(c.name||"?").slice(0,2)}</span>
                <span style={{flex:1,fontSize:12.5,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.name}</span>
                <span style={{fontSize:11,color:"#948D83",flexShrink:0}}>план {fmt(c.plan)} ₽</span>
                <span style={{fontSize:12.5,fontWeight:700,color:c.actual>c.plan&&c.plan>0?"#A66B60":"#5E8A7D",flexShrink:0}}>факт {fmt(c.actual)} ₽</span>
                <div style={{width:70,flexShrink:0}}><div style={{height:4,borderRadius:4,background:"#EFE8DD",overflow:"hidden"}}><div style={{height:"100%",width:`${Math.min(100,c.plan>0?c.actual/c.plan*100:0)}%`,background:c.actual>c.plan&&c.plan>0?"#A66B60":"#BD877C"}}/></div></div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
// ─── VENDORS ──────────────────────────────────────────────────────────────────
function VendorsPage({survey,initCat,onSelectVendor}){
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
  const GR=[["repeating-linear-gradient(135deg,#E9DDCB 0 8px,#E2D3BC 8px 16px)"],["repeating-linear-gradient(135deg,#EBDDD7 0 8px,#E4D0C8 8px 16px)"],["repeating-linear-gradient(135deg,#E7DEC9 0 8px,#E0D4BA 8px 16px)"],["repeating-linear-gradient(135deg,#DEE5DD 0 8px,#D5DFD2 8px 16px)"]];
  return(
    <div style={{maxWidth:1200,margin:"0 auto",padding:"30px 40px 60px",display:"flex",flexDirection:"column",gap:20,fontFamily:fb}}>
      <div>
        <div style={{fontSize:24,fontWeight:700,letterSpacing:"-.025em"}}>Подрядчики</div>
        <div style={{fontSize:13.5,color:"#948D83",marginTop:4}}>{date?`Свободные на ${new Date(date).toLocaleDateString("ru")} · `:""}{survey?.city||"Москва"}</div>
      </div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        <span onClick={()=>setActiveCat("all")} style={{padding:"9px 16px",borderRadius:999,background:activeCat==="all"?"#221D18":"#FBF9F5",color:activeCat==="all"?"#FBF9F5":"#6E665C",border:activeCat==="all"?"none":"1px solid #E2DACB",fontSize:12.5,fontWeight:activeCat==="all"?600:500,cursor:"pointer"}}>Все</span>
        {avail.map(c=><span key={c.id} onClick={()=>setActiveCat(c.id)} style={{padding:"9px 16px",borderRadius:999,background:activeCat===c.id?"#221D18":"#FBF9F5",color:activeCat===c.id?"#FBF9F5":"#6E665C",border:activeCat===c.id?"none":"1px solid #E2DACB",fontSize:12.5,fontWeight:activeCat===c.id?600:500,cursor:"pointer"}}>{c.name}</span>)}
      </div>
      <div style={{display:"flex",alignItems:"center",gap:10,background:"#FFFFFF",border:"1px solid #E2DACB",borderRadius:12,padding:"11px 16px",maxWidth:340}}>
        <span style={{fontSize:14,color:"#B0A99E"}}>⌕</span>
        <input style={{border:"none",outline:"none",fontSize:13,fontFamily:fb,background:"transparent",color:"#221D18",width:"100%"}} placeholder="Поиск по имени…" value={search} onChange={e=>setSearch(e.target.value)}/>
      </div>
      <section style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:18}}>
        {filtered.map((v,vi)=>{
          const cat=catMap[v.cat];
          const isFav=favs.includes(v.id);
          const isDone=contacted.includes(v.id);
          return(
            <div key={v.id} style={{background:"#FFFFFF",border:"1px solid #EBE4D8",borderRadius:18,padding:20,boxShadow:"0 1px 2px rgba(33,28,23,.03),0 14px 30px -20px rgba(33,28,23,.14)",display:"flex",flexDirection:"column",position:"relative"}}>
              <span onClick={()=>setFavs(f=>f.includes(v.id)?f.filter(x=>x!==v.id):[...f,v.id])} style={{position:"absolute",top:18,right:18,fontSize:16,color:isFav?"#BD877C":"#D8CFC0",cursor:"pointer"}}>{isFav?"♥":"♡"}</span>
              <div style={{display:"flex",gap:12,marginBottom:13}}>
                <div style={{width:46,height:46,borderRadius:12,background:GR[vi%4][0],flexShrink:0}}/>
                <div><div style={{fontSize:14.5,fontWeight:700}}>{v.name}</div><div style={{fontSize:11.5,color:"#A39C92"}}>{cat?.name} · {v.city}</div></div>
              </div>
              <p style={{fontSize:12.5,color:"#6E665C",lineHeight:1.6,flex:1,margin:"0 0 12px"}}>{v.desc}</p>
              <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:14}}>
                {v.tags.map(t=><span key={t} style={{fontSize:10.5,color:"#7A7266",background:"#F1EBE1",padding:"3px 9px",borderRadius:7}}>{t}</span>)}
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:13,borderTop:"1px solid #F1EBE1"}}>
                <div><div style={{fontSize:14,fontWeight:700,color:"#5E8A7D"}}>от {fmt(v.priceFrom)} ₽</div><div style={{fontSize:10.5,color:"#A39C92"}}>★ {v.rating} · {v.reviews} отзывов</div></div>
                <div style={{display:"flex",gap:6}}>
                  {onSelectVendor&&<button onClick={e=>{e.stopPropagation();onSelectVendor(v);}} style={{padding:"8px 13px",borderRadius:999,background:"transparent",color:"#857E74",fontSize:12,fontWeight:600,border:"1px solid #E2DACB",cursor:"pointer",fontFamily:fb}}>Подробнее</button>}
                  {isDone
                    ?<span style={{padding:"8px 12px",borderRadius:999,background:"#EAF0EC",color:"#5E8A7D",fontSize:11.5,fontWeight:600}}>✓ Отправлен</span>
                    :<button onClick={()=>setModal(v)} style={{padding:"8px 16px",borderRadius:999,background:"#221D18",color:"#FBF9F5",fontSize:12,fontWeight:600,border:"none",cursor:"pointer",fontFamily:fb}}>Связаться</button>
                  }
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length===0&&<div style={{gridColumn:"1/-1",textAlign:"center",padding:60,color:"#948D83",fontSize:14}}>Подрядчики не найдены</div>}
      </section>
      {modal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(31,27,23,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:500,padding:20}}>
          <div style={{background:"#FFFFFF",borderRadius:20,padding:28,maxWidth:460,width:"100%",boxShadow:"0 24px 60px -10px rgba(33,28,23,.3)"}}>
            <div style={{fontSize:18,fontWeight:700,letterSpacing:"-.02em",marginBottom:16}}>Запрос — {modal.name}</div>
            <div style={{background:"#FBF9F5",borderRadius:12,padding:"14px 16px",fontSize:13,lineHeight:1.9,marginBottom:20,border:"1px solid #EBE4D8"}}>
              <b>Дата:</b> {survey?.date?new Date(survey.date).toLocaleDateString("ru"):survey?.season||"не указана"}<br/>
              <b>Город:</b> {survey?.city||"—"}<br/>
              <b>Гостей:</b> {survey?.guests||"—"}<br/>
              <b>Формат:</b> {FORMATS.find(f=>f.id===survey?.format)?.label||"—"}<br/>
              {survey?.concept?.mustHave&&<><b>Пожелания:</b> {survey.concept.mustHave}<br/></>}
            </div>
            <div style={{display:"flex",gap:10}}>
              <button style={{padding:"11px 22px",borderRadius:999,background:"#221D18",color:"#FBF9F5",fontSize:13,fontWeight:600,border:"none",cursor:"pointer",fontFamily:fb}} onClick={()=>{setContacted(p=>[...p,modal.id]);setModal(null);}}>✓ Отправить запрос</button>
              <button style={{padding:"11px 18px",borderRadius:999,background:"transparent",color:"#857E74",fontSize:13,fontWeight:500,border:"1px solid #E2DACB",cursor:"pointer",fontFamily:fb}} onClick={()=>setModal(null)}>Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── VENDOR CARD PAGE ─────────────────────────────────────────────────────────
function VendorCardPage({vendor,onBack,survey}){
  const[contactedLocal,setContactedLocal]=useState(()=>LS.get("td_contacted",[]));
  const isDone=contactedLocal.includes(vendor.id);
  const catMap=Object.fromEntries(DEFAULT_CATS.map(c=>[c.id,c]));
  const cat=catMap[vendor.cat];
  const GR=["repeating-linear-gradient(135deg,#E9DDCB 0 12px,#E2D3BC 12px 24px)","repeating-linear-gradient(135deg,#EBDDD7 0 12px,#E4D0C8 12px 24px)","repeating-linear-gradient(135deg,#DEE5DD 0 12px,#D5DFD2 12px 24px)"];
  const gi=vendor.id%3;
  return(
    <div style={{maxWidth:860,margin:"0 auto",padding:"30px 40px 60px",display:"flex",flexDirection:"column",gap:20,fontFamily:fb}}>
      <button onClick={onBack} style={{background:"none",border:"none",color:"#857E74",fontSize:13,cursor:"pointer",fontFamily:fb,padding:0,textAlign:"left"}}>← Назад к подрядчикам</button>
      <div style={{borderRadius:20,overflow:"hidden",height:220,background:GR[gi]}}/>
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:20}}>
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <div style={{background:"#FFFFFF",border:"1px solid #EBE4D8",borderRadius:20,padding:24,boxShadow:SHADOW}}>
            <div style={{display:"flex",gap:14,alignItems:"flex-start",marginBottom:16}}>
              <div style={{width:64,height:64,borderRadius:16,background:GR[gi],flexShrink:0}}/>
              <div>
                <div style={{fontSize:22,fontWeight:700,letterSpacing:"-.01em"}}>{vendor.name}</div>
                <div style={{fontSize:13,color:"#948D83",marginTop:2}}>{cat?.name} · {vendor.city}</div>
                <div style={{fontSize:13,color:"#5E8A7D",fontWeight:600,marginTop:4}}>★ {vendor.rating} · {vendor.reviews} отзывов</div>
              </div>
            </div>
            <p style={{fontSize:14,lineHeight:1.7,color:"#5C554B",margin:"0 0 14px"}}>{vendor.desc}</p>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {vendor.tags.map(t=><span key={t} style={{fontSize:11,color:"#7A7266",background:"#F1EBE1",padding:"4px 10px",borderRadius:8}}>{t}</span>)}
            </div>
          </div>
          {cat?.items?.length>0&&(
            <div style={{background:"#FFFFFF",border:"1px solid #EBE4D8",borderRadius:20,padding:24,boxShadow:SHADOW}}>
              <div style={{fontSize:14,fontWeight:600,marginBottom:14}}>Что входит в услугу</div>
              {cat.items.map((item,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 0",borderBottom:i<cat.items.length-1?"1px solid #F1EBE1":"none"}}>
                  <span style={{color:"#BD877C",fontWeight:700,flexShrink:0}}>✓</span>
                  <span style={{fontSize:13}}>{item}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div style={{background:"#FFFFFF",border:"1px solid #EBE4D8",borderRadius:20,padding:22,boxShadow:SHADOW}}>
            <div style={{fontSize:11,letterSpacing:".14em",textTransform:"uppercase",color:"#A39C92",fontWeight:600,marginBottom:12}}>Стоимость</div>
            <div style={{fontSize:26,fontWeight:700,color:"#5E8A7D",marginBottom:4}}>от {fmt(vendor.priceFrom)} ₽</div>
            <div style={{fontSize:12,color:"#948D83",marginBottom:18}}>Точная цена — при запросе</div>
            {isDone
              ?<div style={{padding:"12px",borderRadius:12,background:"#EAF0EC",color:"#5E8A7D",fontSize:13,fontWeight:600,textAlign:"center"}}>✓ Запрос отправлен</div>
              :<button onClick={()=>{const next=[...contactedLocal,vendor.id];setContactedLocal(next);LS.set("td_contacted",next);}} style={{width:"100%",padding:"12px",borderRadius:999,background:"#221D18",color:"#FBF9F5",fontSize:13,fontWeight:600,border:"none",cursor:"pointer",fontFamily:fb}}>Связаться</button>
            }
          </div>
          {survey?.date&&(
            <div style={{background:"#FFFFFF",border:"1px solid #EBE4D8",borderRadius:14,padding:16,boxShadow:SHADOW}}>
              <div style={{fontSize:11,letterSpacing:".14em",textTransform:"uppercase",color:"#A39C92",fontWeight:600,marginBottom:8}}>Ваша дата</div>
              <div style={{fontSize:13,fontWeight:600,color:vendor.busy.includes(survey.date)?"#A66B60":"#5E8A7D"}}>
                {vendor.busy.includes(survey.date)?"❌ Занято":"✓ Свободен"} — {new Date(survey.date).toLocaleDateString("ru")}
              </div>
            </div>
          )}
          <div style={{background:"#FFFFFF",border:"1px solid #EBE4D8",borderRadius:14,padding:16,boxShadow:SHADOW}}>
            <div style={{fontSize:11,letterSpacing:".14em",textTransform:"uppercase",color:"#A39C92",fontWeight:600,marginBottom:8}}>Рыночная цена</div>
            <div style={{fontSize:13,color:"#6E665C",lineHeight:1.6}}>{cat?.market}</div>
            <div style={{fontSize:12,color:"#BD877C",marginTop:4}}>{cat?.rec}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── VENUE CATALOG ────────────────────────────────────────────────────────────
function VenueCatalog({survey,favoriteVenues,setFavoriteVenues,onSelect}){
  const[activeType,setActiveType]=useState("all");
  const[search,setSearch]=useState("");
  const date=survey?.date;
  const GR=["repeating-linear-gradient(135deg,#E9DDCB 0 8px,#E2D3BC 8px 16px)","repeating-linear-gradient(135deg,#EBDDD7 0 8px,#E4D0C8 8px 16px)","repeating-linear-gradient(135deg,#E7DEC9 0 8px,#E0D4BA 8px 16px)","repeating-linear-gradient(135deg,#DEE5DD 0 8px,#D5DFD2 8px 16px)"];
  const filtered=VENUES.filter(v=>{
    const typeOk=activeType==="all"||v.type===activeType;
    const searchOk=!search||v.name.toLowerCase().includes(search.toLowerCase())||v.city.toLowerCase().includes(search.toLowerCase());
    const freeOk=!date||!v.busy.includes(date);
    return typeOk&&searchOk&&freeOk;
  });
  return(
    <div style={{maxWidth:1200,margin:"0 auto",padding:"30px 40px 60px",display:"flex",flexDirection:"column",gap:20,fontFamily:fb}}>
      <div>
        <div style={{fontSize:24,fontWeight:700,letterSpacing:"-.025em"}}>Площадки</div>
        <div style={{fontSize:13.5,color:"#948D83",marginTop:4}}>{date?`Свободные на ${new Date(date).toLocaleDateString("ru")} · `:""}{survey?.city||"Москва"}</div>
      </div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        {VENUE_TYPES.map(t=><span key={t.id} onClick={()=>setActiveType(t.id)} style={{padding:"9px 16px",borderRadius:999,background:activeType===t.id?"#221D18":"#FBF9F5",color:activeType===t.id?"#FBF9F5":"#6E665C",border:activeType===t.id?"none":"1px solid #E2DACB",fontSize:12.5,fontWeight:activeType===t.id?600:500,cursor:"pointer"}}>{t.name}</span>)}
      </div>
      <div style={{display:"flex",alignItems:"center",gap:10,background:"#FFFFFF",border:"1px solid #E2DACB",borderRadius:12,padding:"11px 16px",maxWidth:340}}>
        <span style={{fontSize:14,color:"#B0A99E"}}>⌕</span>
        <input style={{border:"none",outline:"none",fontSize:13,fontFamily:fb,background:"transparent",color:"#221D18",width:"100%"}} placeholder="Поиск площадки…" value={search} onChange={e=>setSearch(e.target.value)}/>
      </div>
      <section style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:18}}>
        {filtered.map((v,vi)=>{
          const isFav=favoriteVenues.includes(v.id);
          const typeName=VENUE_TYPES.find(t=>t.id===v.type)?.name||v.type;
          return(
            <div key={v.id} style={{background:"#FFFFFF",border:"1px solid #EBE4D8",borderRadius:18,overflow:"hidden",boxShadow:SHADOW,cursor:"pointer"}} onClick={()=>onSelect(v)}>
              <div style={{position:"relative"}}>
                <div style={{height:160,background:GR[vi%4]}}/>
                <span onClick={e=>{e.stopPropagation();setFavoriteVenues(f=>f.includes(v.id)?f.filter(x=>x!==v.id):[...f,v.id]);}} style={{position:"absolute",top:12,right:14,fontSize:16,color:isFav?"#BD877C":"#D8CFC0",cursor:"pointer",background:"rgba(251,249,245,.9)",borderRadius:"50%",width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center"}}>{isFav?"♥":"♡"}</span>
              </div>
              <div style={{padding:18}}>
                <div style={{fontSize:15,fontWeight:700,marginBottom:4}}>{v.name}</div>
                <div style={{fontSize:12,color:"#948D83",marginBottom:8}}>{v.city} · {typeName} · до {v.guests.max} гостей</div>
                <p style={{fontSize:12.5,color:"#6E665C",lineHeight:1.5,margin:"0 0 12px"}}>{v.desc}</p>
                <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:12}}>
                  {v.tags.map(t=><span key={t} style={{fontSize:10.5,color:"#7A7266",background:"#F1EBE1",padding:"3px 9px",borderRadius:7}}>{t}</span>)}
                </div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:12,borderTop:"1px solid #F1EBE1"}}>
                  <div><div style={{fontSize:14,fontWeight:700,color:"#5E8A7D"}}>от {fmt(v.priceRent)} ₽</div><div style={{fontSize:10.5,color:"#A39C92"}}>{fmt(v.priceBanquet)} ₽/гость банкет</div></div>
                  <div style={{padding:"6px 12px",borderRadius:8,background:"#F1EBE1",color:"#7A7266",fontSize:12,fontWeight:600}}>★ {v.rating}</div>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length===0&&<div style={{gridColumn:"1/-1",textAlign:"center",padding:60,color:"#948D83",fontSize:14}}>Площадки не найдены</div>}
      </section>
    </div>
  );
}

// ─── VENUE CARD PAGE ──────────────────────────────────────────────────────────
function VenueCardPage({venue,favoriteVenues,setFavoriteVenues,onBack,survey}){
  const[reqSent,setReqSent]=useState(false);
  const isFav=favoriteVenues.includes(venue.id);
  const GR=["repeating-linear-gradient(135deg,#E9DDCB 0 12px,#E2D3BC 12px 24px)","repeating-linear-gradient(135deg,#EBDDD7 0 12px,#E4D0C8 12px 24px)","repeating-linear-gradient(135deg,#DEE5DD 0 12px,#D5DFD2 12px 24px)"];
  const typeName=VENUE_TYPES.find(t=>t.id===venue.type)?.name||venue.type;
  return(
    <div style={{maxWidth:900,margin:"0 auto",padding:"30px 40px 60px",display:"flex",flexDirection:"column",gap:20,fontFamily:fb}}>
      <button onClick={onBack} style={{background:"none",border:"none",color:"#857E74",fontSize:13,cursor:"pointer",fontFamily:fb,padding:0,textAlign:"left"}}>← Назад к площадкам</button>
      <div style={{borderRadius:20,overflow:"hidden",height:260,background:GR[0],position:"relative"}}>
        <span onClick={()=>setFavoriteVenues(f=>f.includes(venue.id)?f.filter(x=>x!==venue.id):[...f,venue.id])} style={{position:"absolute",top:16,right:18,fontSize:20,color:isFav?"#BD877C":"#E0D5C7",cursor:"pointer",background:"rgba(251,249,245,.9)",borderRadius:"50%",width:38,height:38,display:"flex",alignItems:"center",justifyContent:"center"}}>{isFav?"♥":"♡"}</span>
        <span style={{position:"absolute",bottom:14,left:18,padding:"5px 12px",borderRadius:8,background:"rgba(251,249,245,.88)",fontSize:11,fontWeight:700,color:"#221D18"}}>{typeName}</span>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:20}}>
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <div style={{background:"#FFFFFF",border:"1px solid #EBE4D8",borderRadius:20,padding:24,boxShadow:SHADOW}}>
            <div style={{fontSize:26,fontWeight:700,letterSpacing:"-.02em",marginBottom:6}}>{venue.name}</div>
            <div style={{fontSize:13,color:"#948D83",marginBottom:16}}>{venue.city} · {venue.address}</div>
            <p style={{fontSize:14,lineHeight:1.7,color:"#5C554B",margin:"0 0 14px"}}>{venue.desc}</p>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {venue.tags.map(t=><span key={t} style={{fontSize:11,color:"#7A7266",background:"#F1EBE1",padding:"4px 10px",borderRadius:8}}>{t}</span>)}
            </div>
          </div>
          <div style={{background:"#FFFFFF",border:"1px solid #EBE4D8",borderRadius:20,padding:24,boxShadow:SHADOW}}>
            <div style={{fontSize:14,fontWeight:600,marginBottom:14}}>Включено в аренду</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              {venue.includes.map(inc=><div key={inc} style={{display:"flex",alignItems:"center",gap:6,padding:"7px 14px",borderRadius:10,background:"#F4F9F7",border:"1px solid #C8E0D8",fontSize:13}}><span style={{color:"#5E8A7D",fontWeight:700}}>✓</span> {inc}</div>)}
            </div>
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div style={{background:"#FFFFFF",border:"1px solid #EBE4D8",borderRadius:20,padding:22,boxShadow:SHADOW}}>
            <div style={{fontSize:11,letterSpacing:".14em",textTransform:"uppercase",color:"#A39C92",fontWeight:600,marginBottom:14}}>Стоимость</div>
            {[["Аренда зала",fmt(venue.priceRent)+" ₽"],["Банкет / гость",fmt(venue.priceBanquet)+" ₽"],["Пробковый сбор",fmt(venue.corkage)+" ₽"],["Гостей",`${venue.guests.min}–${venue.guests.max}`],["Рейтинг","★ "+venue.rating+" ("+venue.reviews+")"]].map(([l,v])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",fontSize:13,padding:"7px 0",borderBottom:"1px solid #F1EBE1"}}><span style={{color:"#857E74"}}>{l}</span><span style={{fontWeight:700}}>{v}</span></div>
            ))}
            <div style={{marginTop:16}}>
              {reqSent
                ?<div style={{padding:"12px",borderRadius:12,background:"#EAF0EC",color:"#5E8A7D",fontSize:13,fontWeight:600,textAlign:"center"}}>✓ Запрос отправлен!</div>
                :<button onClick={()=>setReqSent(true)} style={{width:"100%",padding:"12px",borderRadius:999,background:"#221D18",color:"#FBF9F5",fontSize:13,fontWeight:600,border:"none",cursor:"pointer",fontFamily:fb}}>Связаться</button>
              }
              <button onClick={()=>setFavoriteVenues(f=>f.includes(venue.id)?f.filter(x=>x!==venue.id):[...f,venue.id])} style={{marginTop:10,width:"100%",padding:"11px",borderRadius:999,border:"1px solid #E2DACB",background:"transparent",color:isFav?"#BD877C":"#857E74",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:fb}}>{isFav?"♥ В избранном":"♡ В избранное"}</button>
            </div>
          </div>
          {survey?.date&&(
            <div style={{background:"#FFFFFF",border:"1px solid #EBE4D8",borderRadius:14,padding:16,boxShadow:SHADOW}}>
              <div style={{fontSize:11,letterSpacing:".14em",textTransform:"uppercase",color:"#A39C92",fontWeight:600,marginBottom:8}}>Ваша дата</div>
              <div style={{fontSize:13,fontWeight:600,color:venue.busy.includes(survey.date)?"#A66B60":"#5E8A7D"}}>{venue.busy.includes(survey.date)?"❌ Занято":"✓ Свободно"} — {new Date(survey.date).toLocaleDateString("ru")}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── AGENCIES CATALOG ─────────────────────────────────────────────────────────
function AgencyCatalog({favoriteAgencies,setFavoriteAgencies}){
  const[modal,setModal]=useState(null);
  const[sent,setSent]=useState(()=>LS.get("td_agency_sent",[]));
  const GR=["repeating-linear-gradient(135deg,#E9DDCB 0 8px,#E2D3BC 8px 16px)","repeating-linear-gradient(135deg,#EBDDD7 0 8px,#E4D0C8 8px 16px)","repeating-linear-gradient(135deg,#DEE5DD 0 8px,#D5DFD2 8px 16px)"];
  useEffect(()=>LS.set("td_agency_sent",sent),[sent]);
  return(
    <div style={{maxWidth:1200,margin:"0 auto",padding:"30px 40px 60px",display:"flex",flexDirection:"column",gap:20,fontFamily:fb}}>
      <div>
        <div style={{fontSize:24,fontWeight:700,letterSpacing:"-.025em"}}>Свадебные агентства</div>
        <div style={{fontSize:13.5,color:"#948D83",marginTop:4}}>Профессиональная организация вашей свадьбы</div>
      </div>
      <section style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:18}}>
        {AGENCIES.map((a,ai)=>{
          const isFav=favoriteAgencies.includes(a.id);
          const isDone=sent.includes(a.id);
          return(
            <div key={a.id} style={{background:"#FFFFFF",border:"1px solid #EBE4D8",borderRadius:18,overflow:"hidden",boxShadow:SHADOW}}>
              <div style={{height:120,background:GR[ai%3],position:"relative"}}>
                <span onClick={()=>setFavoriteAgencies(f=>f.includes(a.id)?f.filter(x=>x!==a.id):[...f,a.id])} style={{position:"absolute",top:12,right:14,fontSize:16,color:isFav?"#BD877C":"#D8CFC0",cursor:"pointer",background:"rgba(251,249,245,.88)",borderRadius:"50%",width:32,height:32,display:"flex",alignItems:"center",justifyContent:"center"}}>{isFav?"♥":"♡"}</span>
              </div>
              <div style={{padding:20}}>
                <div style={{fontSize:16,fontWeight:700,marginBottom:4}}>{a.name}</div>
                <div style={{fontSize:12,color:"#948D83",marginBottom:10}}>{a.city} · {a.years} лет · {a.weddings} свадеб</div>
                <p style={{fontSize:12.5,color:"#6E665C",lineHeight:1.6,margin:"0 0 12px"}}>{a.desc}</p>
                <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:14}}>
                  {a.tags.map(t=><span key={t} style={{fontSize:10.5,color:"#7A7266",background:"#F1EBE1",padding:"3px 9px",borderRadius:7}}>{t}</span>)}
                </div>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:12,borderTop:"1px solid #F1EBE1"}}>
                  <div><div style={{fontSize:14,fontWeight:700,color:"#5E8A7D"}}>от {fmt(a.priceFrom)} ₽</div><div style={{fontSize:10.5,color:"#A39C92"}}>★ {a.rating} · {a.reviews} отзывов</div></div>
                  {isDone?<span style={{padding:"8px 12px",borderRadius:999,background:"#EAF0EC",color:"#5E8A7D",fontSize:11.5,fontWeight:600}}>✓ Запрос отправлен</span>
                  :<button onClick={()=>setModal(a)} style={{padding:"8px 16px",borderRadius:999,background:"#221D18",color:"#FBF9F5",fontSize:12,fontWeight:600,border:"none",cursor:"pointer",fontFamily:fb}}>Связаться</button>}
                </div>
              </div>
            </div>
          );
        })}
      </section>
      {modal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(31,27,23,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:500,padding:20}}>
          <div style={{background:"#FFFFFF",borderRadius:20,padding:28,maxWidth:460,width:"100%",boxShadow:"0 24px 60px -10px rgba(33,28,23,.3)"}}>
            <div style={{fontSize:18,fontWeight:700,marginBottom:14}}>Запрос — {modal.name}</div>
            <p style={{fontSize:13,color:"#6E665C",lineHeight:1.6,marginBottom:20}}>Агентство получит ваши контакты и свяжется для обсуждения проекта.</p>
            <div style={{display:"flex",gap:10}}>
              <button style={{padding:"11px 22px",borderRadius:999,background:"#221D18",color:"#FBF9F5",fontSize:13,fontWeight:600,border:"none",cursor:"pointer",fontFamily:fb}} onClick={()=>{setSent(p=>[...p,modal.id]);setModal(null);}}>✓ Отправить запрос</button>
              <button style={{padding:"11px 18px",borderRadius:999,background:"transparent",color:"#857E74",fontSize:13,fontWeight:500,border:"1px solid #E2DACB",cursor:"pointer",fontFamily:fb}} onClick={()=>setModal(null)}>Отмена</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── CHECKLIST PAGE ───────────────────────────────────────────────────────────
function ChecklistPage({survey,checklist,setChecklist}){
  const weddingDate=survey?.date?new Date(survey.date):null;
  const now=new Date();
  const getMonthLabel=(month)=>{
    if(!weddingDate)return`${month} мес. до свадьбы`;
    const d=new Date(weddingDate);d.setMonth(d.getMonth()-month);
    return d.toLocaleDateString("ru",{month:"long",year:"numeric"});
  };
  const toggle=(mIdx,tIdx)=>setChecklist(prev=>{
    const base=(prev||CHECKLIST_TEMPLATE.map(m=>({...m,statuses:m.tasks.map(()=>"todo")})));
    return base.map((m,i)=>{
      if(i!==mIdx)return m;
      const st=[...(m.statuses||m.tasks.map(()=>"todo"))];
      st[tIdx]=st[tIdx]==="done"?"todo":"done";
      return{...m,statuses:st};
    });
  });
  const data=(checklist||CHECKLIST_TEMPLATE.map(m=>({...m,statuses:m.tasks.map(()=>"todo")}))).map((m,i)=>({
    ...m,statuses:m.statuses||m.tasks.map(()=>"todo"),
    label:getMonthLabel(m.month),
    monthsLeft:weddingDate?Math.round((new Date(weddingDate).setMonth(new Date(weddingDate).getMonth()-m.month)-now)/(1000*60*60*24*30)):null,
  }));
  const totalTasks=data.reduce((s,m)=>s+m.tasks.length,0);
  const doneTasks=data.reduce((s,m)=>s+m.statuses.filter(x=>x==="done").length,0);
  const progress=Math.round(doneTasks/totalTasks*100);
  return(
    <div style={{maxWidth:800,margin:"0 auto",padding:"30px 40px 60px",display:"flex",flexDirection:"column",gap:20,fontFamily:fb}}>
      <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between"}}>
        <div>
          <div style={{fontSize:24,fontWeight:700,letterSpacing:"-.025em"}}>Чек-лист подготовки</div>
          <div style={{fontSize:13.5,color:"#948D83",marginTop:4}}>Все задачи по месяцам до свадьбы</div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:32,fontWeight:700,letterSpacing:"-.03em"}}>{progress}%</div>
          <div style={{fontSize:11,color:"#948D83"}}>{doneTasks} из {totalTasks}</div>
        </div>
      </div>
      <section style={{background:"#FFFFFF",border:"1px solid #EBE4D8",borderRadius:18,padding:"18px 22px",boxShadow:SHADOW}}>
        <div style={{height:8,borderRadius:8,background:"#EFE8DD",overflow:"hidden"}}><div style={{height:"100%",width:`${progress}%`,background:"linear-gradient(90deg,#D2A296,#BD877C)",borderRadius:8,transition:"width .5s"}}/></div>
      </section>
      {data.map((month,mIdx)=>{
        const done=month.statuses.filter(s=>s==="done").length;
        const allDone=done===month.tasks.length;
        const isPast=month.monthsLeft!==null&&month.monthsLeft<0;
        return(
          <section key={mIdx} style={{background:"#FFFFFF",border:`1px solid ${allDone?"#C8E0D8":"#EBE4D8"}`,borderRadius:20,padding:"20px 24px",boxShadow:SHADOW,opacity:isPast&&!allDone?0.65:1}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
              <div>
                <div style={{fontSize:11,letterSpacing:".16em",textTransform:"uppercase",color:allDone?"#5E8A7D":"#A66B60",fontWeight:600,marginBottom:3}}>{month.month} {month.month===1?"месяц":month.month<=4?"месяца":"месяцев"} до свадьбы</div>
                <div style={{fontSize:15,fontWeight:600}}>{month.label}</div>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{fontSize:12.5,color:"#948D83"}}>{done}/{month.tasks.length}</span>
                {allDone&&<span style={{padding:"4px 10px",borderRadius:8,background:"#EAF0EC",color:"#5E8A7D",fontSize:11,fontWeight:600}}>✓ Готово</span>}
              </div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {month.tasks.map((task,tIdx)=>{
                const isDone=month.statuses[tIdx]==="done";
                return(
                  <div key={tIdx} onClick={()=>toggle(mIdx,tIdx)} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 14px",borderRadius:10,background:isDone?"#F4F9F7":"#FBF9F5",cursor:"pointer",border:`1px solid ${isDone?"#C8E0D8":"transparent"}`}}>
                    <span style={{width:20,height:20,borderRadius:"50%",flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",background:isDone?"#5E8A7D":"transparent",border:isDone?"none":"2px solid #D8CFC0",color:"#FBF9F5",fontSize:11,fontWeight:700}}>{isDone?"✓":""}</span>
                    <span style={{fontSize:13.5,color:isDone?"#A39C92":"#221D18",textDecoration:isDone?"line-through":"none"}}>{task}</span>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}

// ─── FAVORITES PAGE ───────────────────────────────────────────────────────────
function FavoritesPage({favoriteVenues,favoriteAgencies,onNav,setFavoriteVenues,setFavoriteAgencies}){
  const[activeTab,setActiveTab]=useState("vendors");
  const[favs,setFavsState]=useState(()=>LS.get("td_favs",[]));
  const removeFav=(id)=>{const next=favs.filter(x=>x!==id);setFavsState(next);LS.set("td_favs",next);};
  const favVendors=VENDORS.filter(v=>favs.includes(v.id));
  const favVenuesList=VENUES.filter(v=>favoriteVenues.includes(v.id));
  const favAgenciesList=AGENCIES.filter(a=>favoriteAgencies.includes(a.id));
  const catMap=Object.fromEntries(DEFAULT_CATS.map(c=>[c.id,c]));
  const GR=["repeating-linear-gradient(135deg,#E9DDCB 0 8px,#E2D3BC 8px 16px)","repeating-linear-gradient(135deg,#EBDDD7 0 8px,#E4D0C8 8px 16px)","repeating-linear-gradient(135deg,#DEE5DD 0 8px,#D5DFD2 8px 16px)"];
  const tabs=[["vendors","Подрядчики",favVendors.length],["venues","Площадки",favVenuesList.length],["agencies","Агентства",favAgenciesList.length]];
  const EmptyState=({btnLabel,onBtnClick})=>(
    <div style={{textAlign:"center",padding:"60px 0",color:"#948D83",fontSize:14}}>
      Нажмите ♡ на карточке, чтобы добавить в избранное
      <br/><button onClick={onBtnClick} style={{marginTop:16,padding:"10px 22px",borderRadius:999,background:"#221D18",color:"#FBF9F5",fontSize:13,fontWeight:600,border:"none",cursor:"pointer",fontFamily:fb}}>{btnLabel}</button>
    </div>
  );
  return(
    <div style={{maxWidth:1200,margin:"0 auto",padding:"30px 40px 60px",display:"flex",flexDirection:"column",gap:20,fontFamily:fb}}>
      <div><div style={{fontSize:24,fontWeight:700,letterSpacing:"-.025em"}}>Избранное</div><div style={{fontSize:13.5,color:"#948D83",marginTop:4}}>Сохранённые подрядчики, площадки и агентства</div></div>
      <div style={{display:"flex",gap:4,background:"#EFE9DE",borderRadius:12,padding:4,width:"fit-content"}}>
        {tabs.map(([id,label,cnt])=>(
          <span key={id} onClick={()=>setActiveTab(id)} style={{padding:"8px 18px",borderRadius:9,background:activeTab===id?"#FFFFFF":"transparent",fontSize:13,fontWeight:activeTab===id?600:500,color:activeTab===id?"#221D18":"#857E74",cursor:"pointer",boxShadow:activeTab===id?"0 1px 2px rgba(33,28,23,.05)":"none"}}>
            {label}{cnt>0&&<span style={{fontSize:11,marginLeft:5,color:activeTab===id?"#BD877C":"#B0A99E"}}>({cnt})</span>}
          </span>
        ))}
      </div>
      {activeTab==="vendors"&&(favVendors.length===0?<EmptyState btnLabel="К подрядчикам" onBtnClick={()=>onNav("vendors")}/>:<section style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:18}}>
        {favVendors.map((v,vi)=>{const cat=catMap[v.cat];return(
          <div key={v.id} style={{background:"#FFFFFF",border:"1px solid #EBE4D8",borderRadius:18,padding:20,boxShadow:SHADOW,position:"relative"}}>
            <span onClick={()=>removeFav(v.id)} style={{position:"absolute",top:18,right:18,fontSize:16,color:"#BD877C",cursor:"pointer"}}>♥</span>
            <div style={{display:"flex",gap:12,marginBottom:12}}><div style={{width:46,height:46,borderRadius:12,background:GR[vi%3],flexShrink:0}}/><div><div style={{fontSize:14.5,fontWeight:700}}>{v.name}</div><div style={{fontSize:11.5,color:"#A39C92"}}>{cat?.name} · {v.city}</div></div></div>
            <div style={{fontSize:14,fontWeight:700,color:"#5E8A7D"}}>от {fmt(v.priceFrom)} ₽</div>
          </div>
        );})}
      </section>)}
      {activeTab==="venues"&&(favVenuesList.length===0?<EmptyState btnLabel="К площадкам" onBtnClick={()=>onNav("venues")}/>:<section style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:18}}>
        {favVenuesList.map((v,vi)=>(
          <div key={v.id} style={{background:"#FFFFFF",border:"1px solid #EBE4D8",borderRadius:18,overflow:"hidden",boxShadow:SHADOW,position:"relative"}}>
            <span onClick={()=>setFavoriteVenues(f=>f.filter(x=>x!==v.id))} style={{position:"absolute",top:12,right:14,fontSize:16,color:"#BD877C",cursor:"pointer",zIndex:1}}>♥</span>
            <div style={{height:100,background:GR[vi%3]}}/>
            <div style={{padding:"14px 16px"}}><div style={{fontSize:15,fontWeight:700,marginBottom:4}}>{v.name}</div><div style={{fontSize:12,color:"#948D83",marginBottom:8}}>{v.city} · до {v.guests.max} гостей</div><div style={{fontSize:14,fontWeight:700,color:"#5E8A7D"}}>от {fmt(v.priceRent)} ₽</div></div>
          </div>
        ))}
      </section>)}
      {activeTab==="agencies"&&(favAgenciesList.length===0?<EmptyState btnLabel="К агентствам" onBtnClick={()=>onNav("agencies")}/>:<section style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:18}}>
        {favAgenciesList.map(a=>(
          <div key={a.id} style={{background:"#FFFFFF",border:"1px solid #EBE4D8",borderRadius:18,padding:20,boxShadow:SHADOW,position:"relative"}}>
            <span onClick={()=>setFavoriteAgencies(f=>f.filter(x=>x!==a.id))} style={{position:"absolute",top:18,right:18,fontSize:16,color:"#BD877C",cursor:"pointer"}}>♥</span>
            <div style={{fontSize:15,fontWeight:700,marginBottom:4}}>{a.name}</div>
            <div style={{fontSize:12,color:"#948D83",marginBottom:8}}>{a.city} · {a.years} лет</div>
            <div style={{fontSize:14,fontWeight:700,color:"#5E8A7D"}}>от {fmt(a.priceFrom)} ₽</div>
          </div>
        ))}
      </section>)}
    </div>
  );
}

// ─── VENDOR CABINET ───────────────────────────────────────────────────────────
function VendorCabinet({user}){
  const[profile,setProfile]=useState(()=>LS.get("td_vendor_profile",{name:"",category:"photo",city:"Москва",desc:"",priceFrom:"",experience:"",tags:""}));
  const[saved,setSaved]=useState(false);
  const DEMO_REQUESTS=[
    {id:1,couple:"Соня и Никита",date:"15 авг 2026",city:"Москва",guests:80,msg:"Ищем фотографа на весь день свадьбы"},
    {id:2,couple:"Мария и Артём",date:"12 сент 2026",city:"Москва",guests:120,msg:"Нужен фотограф + видеограф, пакет"},
  ];
  const catName=DEFAULT_CATS.find(c=>c.id===profile.category)?.name||"Подрядчик";
  useEffect(()=>{LS.set("td_vendor_profile",profile);},[profile]);
  const upd=k=>e=>setProfile(p=>({...p,[k]:e.target.value}));
  const inp={border:"1px solid #E2DACB",borderRadius:11,padding:"11px 14px",fontSize:13,fontFamily:fb,background:"#FBF9F5",width:"100%",outline:"none"};
  return(
    <div style={{maxWidth:1000,margin:"0 auto",padding:"30px 40px 60px",display:"flex",flexDirection:"column",gap:20,fontFamily:fb}}>
      <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between"}}>
        <div><div style={{fontSize:24,fontWeight:700,letterSpacing:"-.025em"}}>Кабинет подрядчика</div><div style={{fontSize:13.5,color:"#948D83",marginTop:4}}>{catName} · {profile.city||"Москва"}</div></div>
        <span style={{padding:"6px 14px",borderRadius:8,background:"#EAF0EC",color:"#5E8A7D",fontSize:11,fontWeight:700}}>АКТИВЕН</span>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
        <div style={{background:"#FFFFFF",border:"1px solid #EBE4D8",borderRadius:20,padding:24,boxShadow:SHADOW}}>
          <div style={{fontSize:14,fontWeight:600,marginBottom:16}}>Мой профиль</div>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            {[["Имя / Студия","name","Иван Громов"],["Город","city","Москва"],["Цена от ₽","priceFrom","60000"],["Опыт (лет)","experience","5"]].map(([l,k,ph])=>(
              <div key={k}><div style={{fontSize:10.5,letterSpacing:".1em",textTransform:"uppercase",color:"#A39C92",fontWeight:600,marginBottom:5}}>{l}</div><input style={inp} value={profile[k]||""} onChange={upd(k)} placeholder={ph}/></div>
            ))}
            <div><div style={{fontSize:10.5,letterSpacing:".1em",textTransform:"uppercase",color:"#A39C92",fontWeight:600,marginBottom:5}}>Категория</div>
              <select style={{...inp,cursor:"pointer"}} value={profile.category} onChange={upd("category")}>
                {DEFAULT_CATS.filter(c=>!["venue","catering","rings","honeymoon"].includes(c.id)).map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div><div style={{fontSize:10.5,letterSpacing:".1em",textTransform:"uppercase",color:"#A39C92",fontWeight:600,marginBottom:5}}>О себе</div><textarea style={{...inp,minHeight:80,resize:"vertical",lineHeight:1.5}} value={profile.desc||""} onChange={upd("desc")} placeholder="Краткое описание услуг и стиля…"/></div>
            <div><div style={{fontSize:10.5,letterSpacing:".1em",textTransform:"uppercase",color:"#A39C92",fontWeight:600,marginBottom:5}}>Теги (через запятую)</div><input style={inp} value={profile.tags||""} onChange={upd("tags")} placeholder="Репортаж, Арт, Плёнка"/></div>
            <button onClick={()=>{LS.set("td_vendor_profile",profile);setSaved(true);setTimeout(()=>setSaved(false),2000);}} style={{padding:"11px",borderRadius:999,background:"#221D18",color:"#FBF9F5",fontSize:13,fontWeight:600,border:"none",cursor:"pointer",fontFamily:fb}}>{saved?"✓ Сохранено":"Сохранить профиль"}</button>
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <div style={{background:"#FFFFFF",border:"1px solid #EBE4D8",borderRadius:20,padding:24,boxShadow:SHADOW}}>
            <div style={{fontSize:14,fontWeight:600,marginBottom:4}}>Входящие запросы</div>
            <div style={{fontSize:12,color:"#948D83",marginBottom:16}}>Пары, которые хотят с вами работать</div>
            {DEMO_REQUESTS.map((r,i)=>(
              <div key={r.id} style={{padding:"14px 0",borderBottom:i<DEMO_REQUESTS.length-1?"1px solid #F1EBE1":"none"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                  <div style={{fontSize:13.5,fontWeight:700}}>{r.couple}</div>
                  <span style={{padding:"3px 8px",borderRadius:7,background:"#F6EFDE",color:"#B8902F",fontSize:11,fontWeight:600}}>Новый</span>
                </div>
                <div style={{fontSize:12,color:"#857E74",marginBottom:4}}>{r.date} · {r.city} · {r.guests} гостей</div>
                <div style={{fontSize:12.5,color:"#6E665C",lineHeight:1.5}}>{r.msg}</div>
              </div>
            ))}
          </div>
          <div style={{background:"#FFFFFF",border:"1px solid #EBE4D8",borderRadius:16,padding:20,boxShadow:SHADOW}}>
            <div style={{fontSize:13,fontWeight:600,marginBottom:12}}>Предпросмотр карточки</div>
            <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:10}}>
              <div style={{width:46,height:46,borderRadius:12,background:"repeating-linear-gradient(135deg,#E9DDCB 0 8px,#E2D3BC 8px 16px)",flexShrink:0}}/>
              <div><div style={{fontSize:14,fontWeight:700}}>{profile.name||"Ваше имя"}</div><div style={{fontSize:11.5,color:"#A39C92"}}>{catName} · {profile.city||"Москва"}</div></div>
            </div>
            {profile.priceFrom&&<div style={{fontSize:14,fontWeight:700,color:"#5E8A7D"}}>от {fmt(profile.priceFrom)} ₽</div>}
            {profile.tags&&<div style={{display:"flex",gap:5,flexWrap:"wrap",marginTop:10}}>{profile.tags.split(",").map(t=>t.trim()).filter(Boolean).map(t=><span key={t} style={{fontSize:10.5,color:"#7A7266",background:"#F1EBE1",padding:"3px 9px",borderRadius:7}}>{t}</span>)}</div>}
          </div>
        </div>
      </div>
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
  const RSVP_STYLE={"Придёт":{color:"#5E8A7D",bg:"#EAF0EC"},"Ожидает":{color:"#C49A52",bg:"#F6EFDE"},"Не придёт":{color:"#A66B60",bg:"#F5E4E0"}};
  const inp={border:"1px solid #E2DACB",borderRadius:11,padding:"11px 14px",fontSize:13,fontFamily:fb,background:"#FBF9F5",width:"100%",outline:"none"};
  return(
    <div style={{maxWidth:1200,margin:"0 auto",padding:"30px 40px 60px",display:"flex",flexDirection:"column",gap:20,fontFamily:fb}}>
      <div>
        <div style={{fontSize:24,fontWeight:700,letterSpacing:"-.025em"}}>Список гостей</div>
        <div style={{fontSize:13.5,color:"#948D83",marginTop:4}}>Ссылка для подтверждений · <span style={{color:"#A66B60",fontWeight:600}}>totday.app/{slug}</span></div>
      </div>
      <section style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:16}}>
        {[["Всего",stats.total,"#221D18"],["Подтвердили",stats.yes,"#5E8A7D"],["Ожидаем",stats.wait,"#C49A52"],["Трансфер",stats.transfer,"#221D18"],["Проживание",stats.lodging,"#221D18"]].map(([l,v,c])=>(
          <div key={l} style={{background:"#FFFFFF",border:"1px solid #EBE4D8",borderRadius:18,padding:20,boxShadow:"0 1px 2px rgba(33,28,23,.03),0 14px 30px -20px rgba(33,28,23,.14)",textAlign:"center"}}>
            <div style={{fontSize:10.5,letterSpacing:".12em",textTransform:"uppercase",color:"#A39C92",fontWeight:600,marginBottom:8}}>{l}</div>
            <div style={{fontSize:30,fontWeight:700,letterSpacing:"-.02em",color:c}}>{v}</div>
          </div>
        ))}
      </section>
      <section style={{background:"#FFFFFF",border:"1px solid #EBE4D8",borderRadius:20,padding:"22px 24px",boxShadow:"0 1px 2px rgba(33,28,23,.03),0 14px 30px -20px rgba(33,28,23,.12)"}}>
        <div style={{fontSize:14,fontWeight:600,marginBottom:14}}>Добавить гостя</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:12,alignItems:"flex-end"}}>
          <div style={{flex:"2 1 180px"}}><div style={{fontSize:10.5,letterSpacing:".1em",textTransform:"uppercase",color:"#A39C92",fontWeight:600,marginBottom:6}}>Имя и фамилия</div><input style={inp} value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="Имя Фамилия" onKeyDown={e=>e.key==="Enter"&&add()}/></div>
          <div style={{flex:"1 1 130px"}}><div style={{fontSize:10.5,letterSpacing:".1em",textTransform:"uppercase",color:"#A39C92",fontWeight:600,marginBottom:6}}>Кем приходится</div><input style={inp} value={form.relation} onChange={e=>setForm(p=>({...p,relation:e.target.value}))} placeholder="друг, тётя…"/></div>
          <div style={{flex:"1 1 110px"}}><div style={{fontSize:10.5,letterSpacing:".1em",textTransform:"uppercase",color:"#A39C92",fontWeight:600,marginBottom:6}}>Сторона</div><select style={{...inp,cursor:"pointer"}} value={form.side} onChange={e=>setForm(p=>({...p,side:e.target.value}))}>{["Невесты","Жениха","Общий"].map(s=><option key={s}>{s}</option>)}</select></div>
          <button onClick={add} style={{padding:"11px 22px",borderRadius:999,background:"#221D18",color:"#FBF9F5",fontSize:13,fontWeight:600,border:"none",cursor:"pointer",fontFamily:fb}}>+ Добавить</button>
        </div>
      </section>
      <section style={{background:"#FFFFFF",border:"1px solid #EBE4D8",borderRadius:20,padding:"22px 24px",boxShadow:"0 1px 2px rgba(33,28,23,.03),0 14px 30px -20px rgba(33,28,23,.12)"}}>
        <div style={{display:"flex",gap:6,marginBottom:16,background:"#EFE9DE",borderRadius:12,padding:4,width:"fit-content"}}>
          {["Все",...RSVP].map(f=><span key={f} onClick={()=>setFilter(f)} style={{padding:"7px 16px",borderRadius:9,background:filter===f?"#FFFFFF":"transparent",fontSize:12.5,fontWeight:filter===f?600:500,color:filter===f?"#221D18":"#857E74",cursor:"pointer",boxShadow:filter===f?"0 1px 2px rgba(33,28,23,.05)":"none"}}>{f}</span>)}
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1.4fr 1fr .8fr 1fr .6fr .8fr .8fr",gap:12,padding:"0 6px 12px",borderBottom:"1px solid #ECE5DA",fontSize:10,letterSpacing:".08em",textTransform:"uppercase",color:"#A39C92",fontWeight:600}}>
          {["Имя","Кем приходится","Сторона","RSVP","Стол","Трансфер","Прожив."].map(h=><div key={h}>{h}</div>)}
        </div>
        {filtered.map((g,i)=>(
          <Fragment key={g.id}>
            <div onClick={()=>setExpanded(expanded===g.id?null:g.id)} style={{display:"grid",gridTemplateColumns:"1.4fr 1fr .8fr 1fr .6fr .8fr .8fr",gap:12,padding:"13px 6px",borderBottom:i<filtered.length-1?"1px solid #F1EBE1":"none",alignItems:"center",fontSize:13,cursor:"pointer"}}>
              <div style={{fontWeight:500}}>{g.name}</div>
              <div style={{color:"#857E74"}}>{g.relation||"—"}</div>
              <div style={{color:"#857E74"}}>{g.side}</div>
              <div onClick={e=>e.stopPropagation()}>
                <select value={g.rsvp} onChange={e=>upd(g.id,{rsvp:e.target.value})} style={{border:"none",background:"transparent",fontFamily:fb,cursor:"pointer",padding:0,fontSize:11.5,fontWeight:600,color:(RSVP_STYLE[g.rsvp]||{}).color}}>
                  {RSVP.map(r=><option key={r}>{r}</option>)}
                </select>
              </div>
              <div style={{color:"#857E74"}}>{g.table||"—"}</div>
              <div style={{color:g.transfer?"#5E8A7D":"#857E74"}}>{g.transfer?"✓":"—"}</div>
              <div style={{color:g.lodging?"#5E8A7D":"#857E74"}}>{g.lodging?"✓":"—"}</div>
            </div>
            {expanded===g.id&&(
              <div style={{background:"#FBF9F5",borderRadius:12,padding:"14px 16px",marginBottom:8,border:"1px solid #EBE4D8"}}>
                <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:12,marginBottom:12}}>
                  <div><div style={{fontSize:10,letterSpacing:".08em",textTransform:"uppercase",color:"#A39C92",fontWeight:600,marginBottom:4}}>Обращение в приглашении</div><input style={inp} value={g.inviteName||""} onChange={e=>upd(g.id,{inviteName:e.target.value})} placeholder="Дорогая Анна…"/></div>
                  <div><div style={{fontSize:10,letterSpacing:".08em",textTransform:"uppercase",color:"#A39C92",fontWeight:600,marginBottom:4}}>Имя на карточке</div><input style={inp} value={g.seatName||""} onChange={e=>upd(g.id,{seatName:e.target.value})} placeholder="Анна"/></div>
                  <div><div style={{fontSize:10,letterSpacing:".08em",textTransform:"uppercase",color:"#A39C92",fontWeight:600,marginBottom:4}}>№ стола</div><input style={inp} value={g.table||""} onChange={e=>upd(g.id,{table:e.target.value})} placeholder="3"/></div>
                  <div><div style={{fontSize:10,letterSpacing:".08em",textTransform:"uppercase",color:"#A39C92",fontWeight:600,marginBottom:4}}>Питание</div><select style={{...inp,cursor:"pointer"}} value={g.diet||"Нет"} onChange={e=>upd(g.id,{diet:e.target.value})}>{["Нет","Вегетарианец","Веган","Без глютена","Халяль"].map(s=><option key={s}>{s}</option>)}</select></div>
                  <div><div style={{fontSize:10,letterSpacing:".08em",textTransform:"uppercase",color:"#A39C92",fontWeight:600,marginBottom:4}}>Комментарий ведущему</div><input style={inp} value={g.hostNote||""} onChange={e=>upd(g.id,{hostNote:e.target.value})} placeholder="тамада, поёт…"/></div>
                </div>
                <div style={{display:"flex",gap:20,alignItems:"center",flexWrap:"wrap"}}>
                  <label style={{display:"flex",alignItems:"center",gap:6,fontSize:13,cursor:"pointer"}}><input type="checkbox" checked={!!g.transfer} onChange={e=>upd(g.id,{transfer:e.target.checked})}/>Трансфер</label>
                  <label style={{display:"flex",alignItems:"center",gap:6,fontSize:13,cursor:"pointer"}}><input type="checkbox" checked={!!g.lodging} onChange={e=>upd(g.id,{lodging:e.target.checked})}/>Проживание</label>
                  <button style={{marginLeft:"auto",padding:"7px 14px",borderRadius:999,background:"transparent",color:"#A66B60",fontSize:12,fontWeight:600,border:"1px solid #E2DACB",cursor:"pointer",fontFamily:fb}} onClick={()=>del(g.id)}>Удалить</button>
                </div>
              </div>
            )}
          </Fragment>
        ))}
        {filtered.length===0&&<div style={{textAlign:"center",padding:40,color:"#948D83",fontSize:14}}>Гостей не найдено</div>}
      </section>
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
  const tinp={border:"1px solid #E2DACB",borderRadius:11,padding:"11px 14px",fontSize:13,fontFamily:fb,background:"#FBF9F5",outline:"none"};
  return(
    <div style={{maxWidth:900,margin:"0 auto",padding:"30px 40px 60px",display:"flex",flexDirection:"column",gap:20,fontFamily:fb}}>
      <div>
        <div style={{fontSize:24,fontWeight:700,letterSpacing:"-.025em"}}>Тайминг дня</div>
        <div style={{fontSize:13.5,color:"#948D83",marginTop:4}}>Расписание свадьбы{dateStr?` · ${dateStr}`:""}</div>
      </div>
      <section style={{background:"#FFFFFF",border:"1px solid #EBE4D8",borderRadius:20,padding:"22px 24px",boxShadow:"0 1px 2px rgba(33,28,23,.03),0 14px 30px -20px rgba(33,28,23,.12)"}}>
        <div style={{fontSize:14,fontWeight:600,marginBottom:14}}>Добавить пункт</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:12,alignItems:"flex-end"}}>
          <div style={{flex:"1 1 150px"}}><div style={{fontSize:10.5,letterSpacing:".1em",textTransform:"uppercase",color:"#A39C92",fontWeight:600,marginBottom:6}}>Блок</div><select style={{...tinp,width:"100%",cursor:"pointer"}} value={form.block} onChange={e=>setForm(p=>({...p,block:e.target.value}))}>{blocks.map(b=><option key={b.id} value={b.id}>{b.label}</option>)}</select></div>
          <div style={{flex:"0 1 110px"}}><div style={{fontSize:10.5,letterSpacing:".1em",textTransform:"uppercase",color:"#A39C92",fontWeight:600,marginBottom:6}}>Время</div><input type="time" style={{...tinp,width:"100%"}} value={form.time} onChange={e=>setForm(p=>({...p,time:e.target.value}))}/></div>
          <div style={{flex:"3 1 220px"}}><div style={{fontSize:10.5,letterSpacing:".1em",textTransform:"uppercase",color:"#A39C92",fontWeight:600,marginBottom:6}}>Событие</div><input style={{...tinp,width:"100%"}} value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} placeholder="Сбор гостей, церемония…" onKeyDown={e=>e.key==="Enter"&&add()}/></div>
          <button onClick={add} style={{padding:"11px 22px",borderRadius:999,background:"#221D18",color:"#FBF9F5",fontSize:13,fontWeight:600,border:"none",cursor:"pointer",fontFamily:fb}}>+ Добавить</button>
        </div>
      </section>
      {blocks.map(b=>{
        const items=timing.filter(t=>t.block===b.id).sort((a,z)=>(a.time||"").localeCompare(z.time||""));
        const dotBg=b.id==="before"?"#D8CFC0":"#BD877C";
        return(
          <section key={b.id} style={{background:"#FFFFFF",border:"1px solid #EBE4D8",borderRadius:20,padding:"26px 28px",boxShadow:"0 1px 2px rgba(33,28,23,.03),0 14px 30px -20px rgba(33,28,23,.12)"}}>
            <div style={{fontSize:11,letterSpacing:".16em",textTransform:"uppercase",color:"#A66B60",fontWeight:600,marginBottom:20}}>{b.label}</div>
            {items.length===0?<p style={{color:"#948D83",fontSize:13,margin:0}}>Пока пусто</p>:(
              <div style={{position:"relative",paddingLeft:30}}>
                <div style={{position:"absolute",left:5,top:8,bottom:8,width:1.5,background:"#EAE0D2"}}/>
                {items.map((t,i)=>{
                  const isLast=i===items.length-1&&b.id==="day";
                  return(
                    <div key={t.id} style={{position:"relative",display:"grid",gridTemplateColumns:"78px 1fr 32px",gap:18,alignItems:"baseline",padding:"11px 0",borderTop:i>0?"1px solid #F4EEE5":"none"}}>
                      <span style={{position:"absolute",left:-29,top:16,width:9,height:9,borderRadius:"50%",background:isLast?"#221D18":dotBg,border:"2px solid #FBF9F5"}}/>
                      <input style={{fontSize:17,fontWeight:700,letterSpacing:"-.01em",fontVariantNumeric:"tabular-nums",border:"none",background:"transparent",fontFamily:fb,outline:"none",color:b.id==="before"?"#6E665C":"#221D18",padding:0,width:"100%"}} value={t.time||""} onChange={e=>upd(t.id,{time:e.target.value})} placeholder="—:—"/>
                      <input style={{fontSize:14,fontWeight:500,border:"none",background:"transparent",fontFamily:fb,outline:"none",width:"100%",padding:0}} value={t.title} onChange={e=>upd(t.id,{title:e.target.value})}/>
                      <button onClick={()=>del(t.id)} style={{background:"none",border:"none",color:"#D8CFC0",fontSize:16,cursor:"pointer",padding:0,lineHeight:1}}>✕</button>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}

// ─── INVITE PREVIEW (top-level to avoid remount bug) ─────────────────────────
function InvitePreview({t,c,survey}){
  const dateStr=survey?.date?new Date(survey.date).toLocaleDateString("ru",{day:"numeric",month:"long",year:"numeric"}):"";
  return(
    <div style={{background:t.bg,borderRadius:16,padding:"38px 30px",color:t.textColor,boxShadow:"0 1px 2px rgba(33,28,23,.03),0 14px 30px -20px rgba(33,28,23,.14)",border:`1px solid ${t.accent}30`}}>
      <div style={{textAlign:"center",marginBottom:26}}>
        <div style={{fontSize:11,letterSpacing:".2em",textTransform:"uppercase",color:t.accent,marginBottom:12}}>Приглашение</div>
        <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:32,lineHeight:1.15,marginBottom:10}}>{c.title}</div>
        {dateStr&&<div style={{fontSize:13,color:t.accent,fontFamily:"'Cormorant Garamond',serif",fontStyle:"italic"}}>{dateStr}</div>}
      </div>
      <div style={{textAlign:"center",fontSize:13,lineHeight:1.8,color:t.textColor,opacity:.85,marginBottom:24}}>{c.text}</div>
      <div style={{borderTop:`1px solid ${t.accent}45`,borderBottom:`1px solid ${t.accent}45`,padding:"16px 0",marginBottom:22,textAlign:"center"}}>
        <div style={{fontSize:10,letterSpacing:".12em",textTransform:"uppercase",color:t.accent,marginBottom:5}}>Место</div>
        <div style={{fontSize:15,fontWeight:600,fontFamily:"'Cormorant Garamond',serif"}}>{c.venue}</div>
        <div style={{fontSize:11.5,opacity:.7,marginTop:3}}>{c.address}</div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:26}}>
        <div style={{textAlign:"center"}}><div style={{fontSize:9.5,letterSpacing:".1em",textTransform:"uppercase",color:t.accent,marginBottom:4}}>Дресс-код</div><div style={{fontSize:11.5,opacity:.8}}>{c.dresscode}</div></div>
        <div style={{textAlign:"center"}}><div style={{fontSize:9.5,letterSpacing:".1em",textTransform:"uppercase",color:t.accent,marginBottom:4}}>Начало</div><div style={{fontSize:11.5,opacity:.8}}>17:00</div></div>
      </div>
      <div style={{textAlign:"center"}}>
        <span style={{display:"inline-block",padding:"11px 28px",borderRadius:999,background:t.accent,color:t.bg,fontSize:12,fontFamily:"'Cormorant Garamond',serif",letterSpacing:".04em",cursor:"pointer"}}>Подтвердить участие</span>
      </div>
    </div>
  );
}

// ─── INVITE PAGE ──────────────────────────────────────────────────────────────
function InvitePage({survey,user,inviteData,setInviteData}){
  const[copied,setCopied]=useState(false);
  const{tmplId="classic",content={}}=inviteData||{};
  const defaultContent={title:`Свадьба ${user?.name2||"Жениха"} & ${user?.name1||"Невесты"}`,venue:"Loft Riverside",address:"Москва, Овчинниковская наб., 20",text:"Мы рады пригласить вас разделить с нами этот особенный день!",dresscode:"Праздничный, оттенки пыльной розы",wishes:"",program:""};
  const c={...defaultContent,...content};
  const t=INVITE_TEMPLATES.find(x=>x.id===tmplId)||INVITE_TEMPLATES[0];
  const slug=makeSlug(user);
  const setTmpl=(id)=>setInviteData(p=>({...(p||{}),tmplId:id}));
  const upd=k=>e=>setInviteData(p=>({...(p||{}),content:{...c,[k]:e.target.value}}));
  const finp={border:"1px solid #E2DACB",borderRadius:11,padding:"11px 14px",fontSize:13,fontFamily:fb,background:"#FBF9F5",width:"100%",outline:"none"};
  return(
    <div style={{maxWidth:1160,margin:"0 auto",padding:"30px 40px 60px",display:"flex",flexDirection:"column",gap:20,fontFamily:fb}}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet"/>
      <div>
        <div style={{fontSize:24,fontWeight:700,letterSpacing:"-.025em"}}>Сайт гостей</div>
        <div style={{fontSize:13.5,color:"#948D83",marginTop:4}}>Персональная страница — гости подтвердят участие онлайн</div>
      </div>
      <section style={{background:"#FFFFFF",border:"1px solid #EBE4D8",borderRadius:20,padding:"22px 24px",boxShadow:"0 1px 2px rgba(33,28,23,.03),0 14px 30px -20px rgba(33,28,23,.12)"}}>
        <div style={{fontSize:14,fontWeight:600,marginBottom:16}}>Шаблон</div>
        <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
          {INVITE_TEMPLATES.map(t2=>(
            <div key={t2.id} onClick={()=>setTmpl(t2.id)} style={{textAlign:"center",cursor:"pointer"}}>
              <div style={{width:78,height:50,borderRadius:10,background:t2.bg,border:`2.5px solid ${tmplId===t2.id?t2.accent:"#E2DACB"}`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:t2.accent}}>Aa</div>
              <div style={{fontSize:11,fontWeight:tmplId===t2.id?700:500,color:tmplId===t2.id?"#A66B60":"#948D83",marginTop:5}}>{t2.name}</div>
            </div>
          ))}
        </div>
      </section>
      <section style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}>
        <div style={{background:"#FFFFFF",border:"1px solid #EBE4D8",borderRadius:20,padding:24,boxShadow:"0 1px 2px rgba(33,28,23,.03),0 14px 30px -20px rgba(33,28,23,.12)"}}>
          <div style={{fontSize:14,fontWeight:600,marginBottom:16}}>Редактор</div>
          <div style={{display:"flex",flexDirection:"column",gap:14}}>
            {[["title","Заголовок"],["venue","Площадка"],["address","Адрес"],["dresscode","Дресс-код"]].map(([k,l])=>(
              <div key={k}><div style={{fontSize:10.5,letterSpacing:".1em",textTransform:"uppercase",color:"#A39C92",fontWeight:600,marginBottom:6}}>{l}</div><input style={finp} value={c[k]} onChange={upd(k)}/></div>
            ))}
            <div><div style={{fontSize:10.5,letterSpacing:".1em",textTransform:"uppercase",color:"#A39C92",fontWeight:600,marginBottom:6}}>Приветствие</div><textarea style={{...finp,minHeight:60,resize:"vertical",lineHeight:1.5}} value={c.text} onChange={upd("text")}/></div>
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div style={{background:"#FFFFFF",border:"1px solid #EBE4D8",borderRadius:14,padding:"14px 18px",boxShadow:"0 1px 2px rgba(33,28,23,.03)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:13,color:"#5E8A7D",fontWeight:700}}>totday.app/{slug}</span>
            <button onClick={()=>{navigator.clipboard.writeText(`totday.app/${slug}`).catch(()=>{});setCopied(true);setTimeout(()=>setCopied(false),2000);}} style={{padding:"7px 15px",borderRadius:999,background:"#221D18",color:"#FBF9F5",fontSize:11.5,fontWeight:600,border:"none",cursor:"pointer",fontFamily:fb}}>{copied?"✓ Скопировано":"Копировать"}</button>
          </div>
          <InvitePreview t={t} c={c} survey={survey}/>
        </div>
      </section>
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
  {id:"dashboard",label:"Главная"},
  {id:"budget",   label:"Бюджет"},
  {id:"checklist",label:"Чек-лист"},
  {id:"guests",   label:"Гости"},
  {id:"vendors",  label:"Подрядчики"},
  {id:"venues",   label:"Площадки"},
  {id:"agencies", label:"Агентства"},
  {id:"favorites",label:"Избранное"},
  {id:"timing",   label:"Тайминг"},
  {id:"survey2",  label:"Концепция"},
  {id:"invite",   label:"Сайт гостей"},
];

function SideItem({id,label,active,setTab}){
  const on=active===id;
  return(
    <button onClick={()=>setTab(id)} style={{display:"flex",alignItems:"center",justifyContent:on?"space-between":"flex-start",gap:10,padding:"11px 14px",borderRadius:12,border:on?`1px solid #EAE3D7`:"1px solid transparent",background:on?C.white:"transparent",color:on?C.dark:"#857E74",cursor:"pointer",fontSize:13.5,fontFamily:fb,fontWeight:on?600:500,transition:"all .15s",textAlign:"left",width:"100%",boxShadow:on?"0 1px 2px rgba(33,28,23,.04)":"none"}}>
      <span>{label}</span>
      {on&&<span style={{width:6,height:6,borderRadius:"50%",background:C.blushDark,flexShrink:0}}/>}
    </button>
  );
}

function Sidebar({tab,setTab,role,user,survey,openWedding,logout}){
  const agencyTabs=[
    {id:"agency",   label:"Все свадьбы"},
    {id:"vendors",  label:"База подрядчиков"},
    {id:"agencies", label:"Агентства"},
  ];
  const agencyWeddingTabs=[
    {id:"agency",   label:"← Все свадьбы"},
    {id:"budget",   label:"Бюджет"},
    {id:"guests",   label:"Гости"},
    {id:"timing",   label:"Тайминг"},
    {id:"invite",   label:"Сайт гостей"},
  ];
  const vendorTabs=[
    {id:"vendorDashboard",label:"Мой кабинет"},
  ];
  const tabs=role==="vendor"?vendorTabs:role==="agency"?(openWedding?agencyWeddingTabs:agencyTabs):SIDE_TABS;
  const dateStr=survey?.date?new Date(survey.date).toLocaleDateString("ru",{day:"numeric",month:"short",year:"numeric"}):"";
  return(
    <aside style={{width:250,minHeight:"100vh",background:"#FBF9F5",borderRight:`1px solid ${C.line}`,display:"flex",flexDirection:"column",padding:"30px 18px 22px",position:"sticky",top:0,height:"100vh",overflowY:"auto",flexShrink:0,zIndex:100}}>
      <div style={{padding:"0 12px 30px"}}>
        <div style={{display:"flex",alignItems:"baseline",gap:1}}><span style={{fontSize:23,fontWeight:700,letterSpacing:"-.04em",color:C.dark,fontFamily:fb}}>totday</span><span style={{width:7,height:7,borderRadius:"50%",background:C.blushDark,display:"inline-block",marginLeft:2}}/></div>
        {role==="agency"&&<div style={{fontSize:10,fontFamily:fb,color:"#A66B60",fontWeight:700,letterSpacing:".16em",textTransform:"uppercase",marginTop:3}}>для агентств</div>}
      </div>
      <div style={{fontSize:10,letterSpacing:".18em",textTransform:"uppercase",color:"#B0A99E",fontWeight:600,padding:"0 14px 12px"}}>
        {role==="vendor"?"Подрядчик":role==="agency"&&!openWedding?"Агентство":role==="agency"&&openWedding?`${openWedding.couple}·`:"Планирование"}
      </div>
      <nav style={{display:"flex",flexDirection:"column",gap:3}}>
        {tabs.map(t=>(
          <SideItem key={t.id} id={t.id} label={t.label} active={tab} setTab={setTab}/>
        ))}
      </nav>
      {user&&(
        <div style={{marginTop:"auto",paddingTop:18,borderTop:`1px solid ${C.line}`}}>
          <div style={{display:"flex",alignItems:"center",gap:11,padding:"0 6px 12px"}}>
            <div style={{width:38,height:38,borderRadius:"50%",background:"linear-gradient(140deg,#EBD9C8,#DFC6B8)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:700,color:"#6E5A4E",flexShrink:0}}>{user.name1?.[0]||"С"}</div>
            <div style={{overflow:"hidden"}}>
              <div style={{fontSize:13,fontWeight:600,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{user.name1} & {user.name2}</div>
              {dateStr&&<div style={{fontSize:11,color:"#A39C92"}}>{dateStr}</div>}
            </div>
          </div>
          <button style={{display:"block",textAlign:"center",width:"100%",padding:"9px 14px",borderRadius:11,border:"1px solid #E4DCCF",color:"#857E74",background:"transparent",cursor:"pointer",fontSize:12,fontWeight:600,fontFamily:fb,transition:"all .15s"}} onClick={logout}>Выйти</button>
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
  const waitingGuests=guests.filter(g=>g.rsvp==="Ожидает").length;
  const noGuests=guests.filter(g=>g.rsvp==="Не придёт").length;
  const tasks=[
    {done:!!survey?.format,         text:"Пройти быстрый расчёт"},
    {done:!!survey?.concept,        text:"Заполнить концепцию"},
    {done:cats.some(c=>c.actual>0), text:"Добавить первый расход"},
    {done:guests.length>3,          text:"Внести список гостей"},
    {done:false,                    text:"Выбрать фотографа"},
    {done:false,                    text:"Создать сайт гостей"},
  ];
  const progress=Math.round(tasks.filter(t=>t.done).length/tasks.length*100);
  const daysUntil=survey?.date?Math.max(0,Math.floor((new Date(survey.date)-new Date())/86400000)):null;
  const dateStr=survey?.date?new Date(survey.date).toLocaleDateString("ru",{day:"numeric",month:"long",year:"numeric"}):"";
  const topCats=cats.filter(c=>c.plan>0).slice(0,5);
  const CARD={background:C.white,border:"1px solid #EBE4D8",borderRadius:18,padding:22,boxShadow:"0 1px 2px rgba(33,28,23,.03),0 14px 30px -20px rgba(33,28,23,.14)"};
  const CARD20={...CARD,borderRadius:20,padding:24};
  const LBL={fontSize:10.5,letterSpacing:".14em",textTransform:"uppercase",color:"#A39C92",fontWeight:600};
  const PAT=["repeating-linear-gradient(135deg,#E9DDCB 0 11px,#E2D3BC 11px 22px)","repeating-linear-gradient(135deg,#EBDDD7 0 11px,#E4D0C8 11px 22px)","repeating-linear-gradient(135deg,#DEE5DD 0 11px,#D5DFD2 11px 22px)"];
  return(
    <div style={{maxWidth:1200,margin:"0 auto",padding:"30px 40px 60px",display:"flex",flexDirection:"column",gap:22}}>
      {/* HEADER */}
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div>
          <div style={{fontSize:21,fontWeight:600,letterSpacing:"-.02em"}}>Доброе утро, {user?.name1} и {user?.name2}</div>
          <div style={{fontSize:13.5,color:"#948D83",marginTop:3}}>{daysUntil!==null?`До свадьбы осталось ${daysUntil} дней — вы идёте по плану.`:"Укажите дату свадьбы для отсчёта."}</div>
        </div>
        {(dateStr||survey?.city)&&<span style={{padding:"9px 16px",borderRadius:999,border:"1px solid #E6DFD2",background:"#FBF9F5",fontSize:12.5,fontWeight:500,color:"#6E665C"}}>{[dateStr,survey?.city].filter(Boolean).join(" · ")}</span>}
      </div>

      {/* HERO */}
      <section style={{border:"1px solid #EBE4D8",borderRadius:22,padding:"38px 40px",background:"linear-gradient(135deg,#FFFFFF 0%,#F8F0E9 52%,#F2E6DC 100%)",boxShadow:"0 1px 2px rgba(33,28,23,.03),0 18px 40px -22px rgba(33,28,23,.16)",display:"grid",gridTemplateColumns:"1fr 290px",gap:44,alignItems:"center"}}>
        <div>
          <div style={{fontSize:11,letterSpacing:".2em",textTransform:"uppercase",color:"#A66B60",fontWeight:600,marginBottom:14}}>До вашего дня</div>
          <div style={{display:"flex",alignItems:"baseline",gap:14,marginBottom:8}}>
            <span style={{fontSize:92,fontWeight:700,lineHeight:.82,letterSpacing:"-.05em",color:C.dark,fontVariantNumeric:"tabular-nums"}}>{daysUntil??"-"}</span>
            <span style={{fontSize:17,fontWeight:600,letterSpacing:".04em",textTransform:"uppercase",color:"#5C554B"}}>дней</span>
          </div>
          {dateStr&&<div style={{fontSize:14,color:"#6E665C",marginBottom:26}}>{dateStr}{survey?.city?` · ${survey.city}`:""}</div>}
          <div style={{maxWidth:380,marginBottom:26}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:"#857E74",marginBottom:8}}><span>Готовность к свадьбе</span><span style={{fontWeight:700,color:C.dark}}>{progress}%</span></div>
            <div style={{height:6,borderRadius:6,background:"#EAE0D2",overflow:"hidden"}}><div style={{height:"100%",width:`${progress}%`,borderRadius:6,background:`linear-gradient(90deg,${C.blush},${C.blushDark})`}}/></div>
          </div>
          <div style={{display:"flex",gap:11}}>
            <button style={{...S.btn,padding:"13px 26px",fontSize:13.5}} onClick={()=>onNav("budget")}>Продолжить планирование</button>
            <button style={{...S.btnO,padding:"12px 24px",fontSize:13.5}} onClick={()=>onNav("survey1")}>Весь план</button>
          </div>
        </div>
        <div style={{background:"linear-gradient(140deg,#EBD9C8,#DFC6B8)",borderRadius:18,height:218,display:"flex",alignItems:"center",justifyContent:"center",fontSize:72}}>💑</div>
      </section>

      {/* STATS */}
      <section style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16}}>
        <div style={{...CARD,cursor:"pointer"}} onClick={()=>onNav("budget")}>
          <div style={{...LBL,marginBottom:12}}>Бюджет</div>
          <div style={{fontSize:25,fontWeight:700,letterSpacing:"-.02em",fontVariantNumeric:"tabular-nums",marginBottom:14}}>{fmt(total)} ₽</div>
          <div style={{display:"flex",flexDirection:"column",gap:4,fontSize:12,marginBottom:13}}>
            <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:"#948D83"}}>Потрачено</span><span style={{fontWeight:600,color:C.teal}}>{fmt(totalActual)} ₽</span></div>
            <div style={{display:"flex",justifyContent:"space-between"}}><span style={{color:"#948D83"}}>Остаток</span><span style={{fontWeight:600,color:C.dark}}>{fmt(Math.max(0,total-totalActual))} ₽</span></div>
          </div>
          <div style={{height:4,borderRadius:4,background:"#EFE8DD",overflow:"hidden"}}><div style={{height:"100%",width:`${total>0?Math.min(100,totalActual/total*100):0}%`,background:C.blushDark,borderRadius:4}}/></div>
        </div>
        <div style={{...CARD,cursor:"pointer"}} onClick={()=>onNav("guests")}>
          <div style={{...LBL,marginBottom:12}}>Гости</div>
          <div style={{fontSize:25,fontWeight:700,letterSpacing:"-.02em",fontVariantNumeric:"tabular-nums",marginBottom:6}}>{guests.length||survey?.guests||0}</div>
          <div style={{fontSize:12,color:"#948D83",marginBottom:16}}>{confirmedGuests} подтвердили · {waitingGuests} ждём</div>
          <div style={{display:"flex",gap:10,marginBottom:9,fontSize:10.5,color:"#857E74"}}>
            <span style={{display:"flex",alignItems:"center",gap:5}}><span style={{width:8,height:8,borderRadius:"50%",background:C.teal,display:"inline-block"}}/>Придут {confirmedGuests}</span>
            <span style={{display:"flex",alignItems:"center",gap:5}}><span style={{width:8,height:8,borderRadius:"50%",background:C.gold,display:"inline-block"}}/>Ждём {waitingGuests}</span>
          </div>
          {guests.length>0&&<div style={{display:"flex",height:7,borderRadius:7,overflow:"hidden",gap:2}}>
            <div style={{width:`${confirmedGuests/guests.length*100}%`,background:C.teal,borderRadius:"7px 0 0 7px"}}/>
            <div style={{width:`${waitingGuests/guests.length*100}%`,background:C.gold}}/>
            <div style={{flex:1,background:"#D7CFC2",borderRadius:"0 7px 7px 0"}}/>
          </div>}
        </div>
        <div style={{...CARD,cursor:"pointer"}} onClick={()=>onNav("vendors")}>
          <div style={{...LBL,marginBottom:12}}>Подрядчики</div>
          <div style={{display:"flex",alignItems:"baseline",gap:6,marginBottom:6}}><span style={{fontSize:25,fontWeight:700,letterSpacing:"-.02em",fontVariantNumeric:"tabular-nums"}}>4</span><span style={{fontSize:15,color:"#A39C92",fontWeight:500}}>/ {VENDORS.length}</span></div>
          <div style={{fontSize:12,color:"#948D83",marginBottom:16}}>подтверждено из доступных</div>
          <div style={{display:"flex",gap:5}}>{Array.from({length:Math.min(VENDORS.length,13)}).map((_,i)=><span key={i} style={{flex:1,height:4,borderRadius:4,background:i<4?C.blushDark:"#EFE8DD"}}/>)}</div>
        </div>
        <div style={CARD}>
          <div style={{...LBL,marginBottom:12}}>Готовность</div>
          <div style={{fontSize:25,fontWeight:700,letterSpacing:"-.02em",fontVariantNumeric:"tabular-nums",marginBottom:6}}>{progress}%</div>
          <div style={{fontSize:12,color:"#948D83",marginBottom:16}}>{tasks.filter(t=>!t.done).length} задач осталось</div>
          <div style={{height:4,borderRadius:4,background:"#EFE8DD",overflow:"hidden"}}><div style={{height:"100%",width:`${progress}%`,background:C.blushDark,borderRadius:4}}/></div>
        </div>
      </section>

      {/* VENDORS + CHECKLIST */}
      <section style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:20}}>
        <div style={CARD20}>
          <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:18}}>
            <div><div style={{...LBL,marginBottom:5}}>Подобрано для вас</div><div style={{fontSize:18,fontWeight:600,letterSpacing:"-.01em"}}>Подрядчики в вашем стиле</div></div>
            <button style={{background:"none",border:"none",color:"#A66B60",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:fb}} onClick={()=>onNav("vendors")}>Смотреть все →</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
            {[{label:"Площадки",cnt:VENDORS.filter(v=>v.cat==="venue").length,from:"150 000",sub:"варианта",pat:PAT[0]},{label:"Фотографы",cnt:VENDORS.filter(v=>v.cat==="photo").length,from:"60 000",sub:"автора",pat:PAT[1]},{label:"Декор",cnt:VENDORS.filter(v=>v.cat==="decor").length,from:"80 000",sub:"студии",pat:PAT[2]}].map(c=>(
              <div key={c.label} onClick={()=>onNav("vendors")} style={{border:"1px solid #EEE7DB",borderRadius:16,overflow:"hidden",cursor:"pointer"}}>
                <div style={{height:112,background:c.pat,position:"relative",display:"flex",alignItems:"flex-end",padding:10}}>
                  <span style={{fontSize:10,letterSpacing:".16em",textTransform:"uppercase",color:C.dark,background:"rgba(251,249,245,.85)",padding:"4px 9px",borderRadius:999,fontWeight:600}}>{c.cnt} {c.sub}</span>
                </div>
                <div style={{padding:"13px 14px"}}><div style={{fontSize:13.5,fontWeight:600,marginBottom:2}}>{c.label}</div><div style={{fontSize:11.5,color:"#A39C92"}}>от {c.from} ₽</div></div>
              </div>
            ))}
          </div>
        </div>
        <div style={CARD20}>
          <div style={{...LBL,marginBottom:5}}>Чек-лист</div>
          <div style={{fontSize:18,fontWeight:600,letterSpacing:"-.01em",marginBottom:16}}>Ближайшие задачи</div>
          {tasks.map((t,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:11,padding:"9px 0",borderBottom:i<tasks.length-1?"1px solid #F1EBE1":"none"}}>
              {t.done
                ?<span style={{width:19,height:19,borderRadius:"50%",background:C.teal,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,color:C.white,fontSize:10,fontWeight:700}}>✓</span>
                :<span style={{width:19,height:19,borderRadius:"50%",border:"2px solid #E2DACB",flexShrink:0,display:"inline-block"}}/>
              }
              <span style={{fontSize:13,color:t.done?"#A39C92":C.dark,textDecoration:t.done?"line-through":"none"}}>{t.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* BUDGET + VENUES */}
      <section style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:20}}>
        <div style={CARD20}>
          <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",marginBottom:18}}>
            <div><div style={{...LBL,marginBottom:5}}>Смета</div><div style={{fontSize:18,fontWeight:600,letterSpacing:"-.01em"}}>Бюджет по категориям</div></div>
            <button style={{background:"none",border:"none",color:"#A66B60",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:fb}} onClick={()=>onNav("budget")}>Открыть бюджет →</button>
          </div>
          {topCats.map((c,i)=>(
            <div key={c.id} style={{display:"flex",alignItems:"center",gap:14,padding:"11px 0",borderBottom:i<topCats.length-1?"1px solid #F1EBE1":"none"}}>
              <span style={{width:34,height:34,borderRadius:10,background:"#F1EBE1",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,color:"#7A7266",flexShrink:0,letterSpacing:".02em"}}>{c.name.slice(0,2)}</span>
              <div style={{flex:1,minWidth:0}}><div style={{fontSize:13.5,fontWeight:500}}>{c.name}</div><div style={{fontSize:11,color:"#A39C92"}}>план {fmt(c.plan)} ₽</div></div>
              <div style={{width:150,flexShrink:0}}><div style={{height:5,borderRadius:5,background:"#EFE8DD",overflow:"hidden"}}><div style={{height:"100%",width:`${c.plan>0?Math.min(100,c.actual/c.plan*100):0}%`,background:c.actual>=c.plan&&c.plan>0?C.teal:C.blushDark,borderRadius:5}}/></div></div>
              <div style={{width:90,textAlign:"right",flexShrink:0,fontSize:13,fontWeight:600,fontVariantNumeric:"tabular-nums"}}>{fmt(c.actual)} ₽</div>
            </div>
          ))}
        </div>
        <div style={CARD20}>
          <div style={{...LBL,marginBottom:5}}>Площадки</div>
          <div style={{fontSize:18,fontWeight:600,letterSpacing:"-.01em",marginBottom:16}}>Свободны на дату</div>
          {VENDORS.filter(v=>v.cat==="venue").map((v,i)=>(
            <div key={v.id} onClick={()=>onNav("vendors")} style={{display:"flex",gap:12,alignItems:"center",padding:"11px 0",borderBottom:i<2?"1px solid #F1EBE1":"none",cursor:"pointer"}}>
              <div style={{width:46,height:46,borderRadius:12,background:PAT[i]||PAT[0],flexShrink:0}}/>
              <div style={{flex:1}}><div style={{fontSize:13.5,fontWeight:600}}>{v.name}</div><div style={{fontSize:11.5,color:"#A39C92"}}>от {fmt(v.priceFrom)} ₽ · ★ {v.rating}</div></div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{border:"1px solid #EBE4D8",borderRadius:20,padding:"28px 34px",background:"linear-gradient(120deg,#FBF9F5 0%,#F5E9E2 100%)",display:"flex",alignItems:"center",justifyContent:"space-between",gap:24}}>
        <div>
          <div style={{fontSize:20,fontWeight:600,letterSpacing:"-.01em",marginBottom:6}}>Создайте сайт-приглашение для гостей</div>
          <div style={{fontSize:13.5,color:"#857E74"}}>Ваша история, программа дня и онлайн-подтверждение — на одной красивой странице.</div>
        </div>
        <button style={{...S.btn,flexShrink:0,padding:"13px 28px",fontSize:13.5}} onClick={()=>onNav("invite")}>Создать сайт</button>
      </section>
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
  const STATUS_STYLE={"В работе":{bg:"#F6EFDE",color:"#B8902F"},"Подготовка":{bg:"#F1EBE1",color:"#857E74"},"Завершена":{bg:"#EAF0EC",color:"#5E8A7D"}};
  const ainp={border:"1px solid #E2DACB",borderRadius:11,padding:"11px 14px",fontSize:13,fontFamily:fb,background:"#FBF9F5",outline:"none"};
  return(
    <div style={{maxWidth:1200,margin:"0 auto",padding:"30px 40px 60px",display:"flex",flexDirection:"column",gap:20,fontFamily:fb}}>
      <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",gap:16,flexWrap:"wrap"}}>
        <div>
          <div style={{fontSize:24,fontWeight:700,letterSpacing:"-.025em"}}>Кабинет агентства</div>
          <div style={{fontSize:13.5,color:"#948D83",marginTop:4}}>Все ваши свадьбы и финансы — в одном месте</div>
        </div>
        <button onClick={()=>setShowAdd(v=>!v)} style={{padding:"11px 22px",borderRadius:999,border:"none",background:"#221D18",color:"#FBF9F5",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:fb}}>+ Новая свадьба</button>
      </div>
      <section style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:16}}>
        {[["Активных",active,"#221D18"],["Проектов",weddings.length,"#221D18"],["Суммарный бюджет",(totalBudget/1000000).toFixed(1)+" млн ₽","#A66B60"],["Получено",(totalPaid/1000000).toFixed(1)+" млн ₽","#5E8A7D"]].map(([l,v,col])=>(
          <div key={l} style={{background:"#FFFFFF",border:"1px solid #EBE4D8",borderRadius:18,padding:20,boxShadow:"0 1px 2px rgba(33,28,23,.03),0 14px 30px -20px rgba(33,28,23,.14)",textAlign:"center"}}>
            <div style={{fontSize:10.5,letterSpacing:".12em",textTransform:"uppercase",color:"#A39C92",fontWeight:600,marginBottom:8}}>{l}</div>
            <div style={{fontSize:30,fontWeight:700,letterSpacing:"-.02em",color:col}}>{v}</div>
          </div>
        ))}
      </section>
      {showAdd&&(
        <div style={{background:"#FFFFFF",border:"1px solid #EBE4D8",borderRadius:20,padding:"22px 24px",boxShadow:"0 1px 2px rgba(33,28,23,.03),0 14px 30px -20px rgba(33,28,23,.12)",display:"flex",flexWrap:"wrap",gap:12,alignItems:"flex-end"}}>
          <div style={{flex:"2 1 180px"}}><div style={{fontSize:10.5,letterSpacing:".1em",textTransform:"uppercase",color:"#A39C92",fontWeight:600,marginBottom:6}}>Пара</div><input style={{...ainp,width:"100%"}} value={nw.couple} onChange={e=>setNw(p=>({...p,couple:e.target.value}))} placeholder="Имя & Имя"/></div>
          <div style={{flex:"0 1 140px"}}><div style={{fontSize:10.5,letterSpacing:".1em",textTransform:"uppercase",color:"#A39C92",fontWeight:600,marginBottom:6}}>Дата</div><input type="date" style={{...ainp,width:"100%"}} value={nw.date} onChange={e=>setNw(p=>({...p,date:e.target.value}))}/></div>
          <div style={{flex:"1 1 120px"}}><div style={{fontSize:10.5,letterSpacing:".1em",textTransform:"uppercase",color:"#A39C92",fontWeight:600,marginBottom:6}}>Город</div><input style={{...ainp,width:"100%"}} value={nw.city} onChange={e=>setNw(p=>({...p,city:e.target.value}))}/></div>
          <div style={{flex:"0 1 90px"}}><div style={{fontSize:10.5,letterSpacing:".1em",textTransform:"uppercase",color:"#A39C92",fontWeight:600,marginBottom:6}}>Гостей</div><input type="number" min="0" style={{...ainp,width:"100%"}} value={nw.guests} onChange={e=>setNw(p=>({...p,guests:e.target.value}))}/></div>
          <div style={{flex:"1 1 120px"}}><div style={{fontSize:10.5,letterSpacing:".1em",textTransform:"uppercase",color:"#A39C92",fontWeight:600,marginBottom:6}}>Бюджет ₽</div><input type="number" min="0" style={{...ainp,width:"100%"}} value={nw.budget} onChange={e=>setNw(p=>({...p,budget:e.target.value}))}/></div>
          <button style={{padding:"11px 22px",borderRadius:999,background:"#221D18",color:"#FBF9F5",fontSize:13,fontWeight:600,border:"none",cursor:"pointer",fontFamily:fb}} onClick={add}>Добавить</button>
        </div>
      )}
      <section style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:18}}>
        {weddings.map(w=>{
          const paidPct=w.budget>0?Math.round(w.paid/w.budget*100):0;
          const ss=STATUS_STYLE[w.status]||STATUS_STYLE["Подготовка"];
          return(
            <div key={w.id} style={{background:"#FFFFFF",border:"1px solid #EBE4D8",borderRadius:20,padding:22,boxShadow:"0 1px 2px rgba(33,28,23,.03),0 14px 30px -20px rgba(33,28,23,.12)",cursor:"pointer",position:"relative"}} onClick={()=>onOpen&&onOpen(w)}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
                <div style={{fontSize:19,fontWeight:700,letterSpacing:"-.01em"}}>{w.couple}</div>
                <span style={{padding:"4px 11px",borderRadius:8,background:ss.bg,color:ss.color,fontSize:11,fontWeight:600}}>{w.status}</span>
              </div>
              <div style={{fontSize:13,color:"#857E74",lineHeight:1.8,marginBottom:16}}>
                {w.date&&<div>{new Date(w.date).toLocaleDateString("ru",{day:"numeric",month:"long",year:"numeric"})}</div>}
                <div>{w.city} · {w.guests} гостей</div>
                <div>Бюджет: {fmt(w.budget)} ₽</div>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#948D83",marginBottom:6}}><span>Оплачено</span><span style={{color:"#5E8A7D",fontWeight:600}}>{paidPct}%</span></div>
              <div style={{height:6,borderRadius:6,background:"#EFE8DD",overflow:"hidden"}}><div style={{height:"100%",width:`${paidPct}%`,background:w.status==="Завершена"?"#5E8A7D":"#BD877C",borderRadius:6}}/></div>
              <button onClick={e=>{e.stopPropagation();del(w.id);}} style={{position:"absolute",bottom:14,right:14,background:"none",border:"none",color:"#D8CFC0",fontSize:16,cursor:"pointer",padding:4}}>✕</button>
            </div>
          );
        })}
      </section>
      <section style={{background:"#FFFFFF",border:"1px solid #EBE4D8",borderRadius:20,padding:24,boxShadow:"0 1px 2px rgba(33,28,23,.03),0 14px 30px -20px rgba(33,28,23,.12)"}}>
        <div style={{fontSize:11,letterSpacing:".14em",textTransform:"uppercase",color:"#A39C92",fontWeight:600,marginBottom:5}}>Финансы агентства</div>
        <div style={{fontSize:18,fontWeight:600,letterSpacing:"-.01em",marginBottom:4}}>Поступления по месяцам</div>
        <div style={{fontSize:12,color:"#948D83",marginBottom:24}}>Оплаты от пар по всем проектам</div>
        <div style={{display:"flex",alignItems:"flex-end",justifyContent:"space-between",gap:12,height:140,borderBottom:"1px solid #ECE5DA"}}>
          {[54,78,62,96,120,88].map((h,i)=>(
            <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",height:"100%",justifyContent:"flex-end"}}>
              <div style={{width:"100%",maxWidth:32,height:h,background:["#E3C2A8","#E3C2A8","#E3C2A8","#D2A296","#BD877C","#D2A296"][i],borderRadius:"6px 6px 0 0"}}/>
            </div>
          ))}
        </div>
        <div style={{display:"flex",justifyContent:"space-between",gap:12,marginTop:9}}>
          {["Янв","Фев","Мар","Апр","Май","Июн"].map(m=><span key={m} style={{flex:1,textAlign:"center",fontSize:11,color:"#948D83"}}>{m}</span>)}
        </div>
      </section>
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
  const[selectedVendor,setSelectedVendor]=useState(null);
  const[selectedVenue,setSelectedVenue]=useState(null);
  const[checklist,setChecklist]=useState(()=>LS.get("td_checklist",null));
  const[favoriteVenues,setFavoriteVenues]=useState(()=>LS.get("td_fav_venues",[]));
  const[favoriteAgencies,setFavoriteAgencies]=useState(()=>LS.get("td_fav_agencies",[]));
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
  useEffect(()=>{LS.set("td_checklist",checklist);},[checklist]);
  useEffect(()=>{LS.set("td_fav_venues",favoriteVenues);},[favoriteVenues]);
  useEffect(()=>{LS.set("td_fav_agencies",favoriteAgencies);},[favoriteAgencies]);
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
    if(newTab!=="vendors")setSelectedVendor(null);
    if(newTab!=="venues")setSelectedVenue(null);
    setTab(newTab);
  },[openWedding,cats,guests,timing]);
  const logout=()=>{
    ["td_user","td_survey","td_concept","td_cats","td_guests","td_invite","td_timing","td_txHistory","td_favs","td_contacted","td_role","td_agency_weddings","td_checklist","td_fav_venues","td_fav_agencies","td_vendor_profile"].forEach(k=>LS.del(k));
    setUser(null);setRole("couple");setOpenWedding(null);setSelectedVendor(null);setSelectedVenue(null);setScreen("landing");
  };
  const fullSurvey=survey?{...survey,concept}:null;

  const STYLES=`*{-webkit-font-smoothing:antialiased;text-rendering:optimizeLegibility}button{transition:all .2s}button:active{transform:scale(.97)}input:focus,select:focus,textarea:focus{border-color:${C.blushDark}!important;box-shadow:0 0 0 3px ${C.blushBg}}@keyframes tdfade{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}.td-page>*{animation:tdfade .5s cubic-bezier(.2,.7,.2,1) both}.td-page>*:nth-child(2){animation-delay:.04s}.td-page>*:nth-child(3){animation-delay:.08s}.td-page>*:nth-child(4){animation-delay:.12s}`;

  if(!user){
    if(screen==="landing")return<LandingPage onStart={()=>{setRole("couple");setScreen("minisurvey");}} onLogin={()=>{setRole("couple");setScreen("auth");}} onAgency={()=>{setRole("agency");setScreen("auth");}} onVendor={()=>{setRole("vendor");setScreen("auth");}}/>;
    if(screen==="minisurvey")return<MiniSurvey onBack={()=>setScreen("landing")} onDone={(d)=>{setPrefill(d);setScreen("auth");}}/>;
    return<AuthPage prefill={prefill} agency={role==="agency"} vendor={role==="vendor"} onBack={()=>setScreen("landing")} onLogin={(u)=>{
      if(prefill){const seed={city:prefill.city,guests:prefill.guests,date:prefill.date||"",budget:Number(prefill.budget)||0,season:"",format:"restaurant"};setSurvey(seed);}
      setUser(u);setTab(role==="agency"?"agency":role==="vendor"?"vendorDashboard":"dashboard");
    }}/>;
  }

  return(
    <div style={{...S.app,display:"flex",minHeight:"100vh"}}>
      <link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet"/>
      <style>{STYLES}</style>
      <Sidebar tab={tab} setTab={handleSetTab} role={role} user={user} survey={survey} openWedding={openWedding} logout={logout}/>
      <main style={{flex:1,overflow:"auto",minHeight:"100vh",background:C.bg}}>
        {role==="vendor"&&tab==="vendorDashboard"&&<VendorCabinet user={user}/>}
        {role==="agency"&&tab==="agency"&&<AgencyDashboard weddings={agencyWeddings} setWeddings={setAgencyWeddings} onOpen={(w)=>{setOpenWedding(w);setCats(w._cats||makeCatsFromBudget(w.budget||1500000,{guests:w.guests,city:w.city,format:"restaurant"},"comfort"));setGuests(w._guests||[]);setTiming(w._timing||[]);setTab("budget");}}/>}
        {!(role==="vendor")&&!(role==="agency"&&tab==="agency")&&(<>
          {tab==="dashboard" &&<Dashboard user={user} survey={fullSurvey} cats={cats} guests={guests} onNav={setTab}/>}
          {tab==="survey1"   &&<Survey1Page onComplete={handleSurvey1Complete} initial={survey}/>}
          {tab==="scenarios" &&survey&&<ScenariosPage survey={survey} onChoose={handleScenarioChosen}/>}
          {tab==="survey2"   &&<Survey2Page onComplete={handleConcept} initial={concept}/>}
          {tab==="budget"    &&<BudgetPage survey={fullSurvey||{city:"Москва",guests:80,budget:1500000,format:"restaurant"}} cats={cats} setCats={setCats} onGoToVendors={goVendors}/>}
          {tab==="vendors"   &&!selectedVendor&&<VendorsPage survey={fullSurvey} initCat={vendorCat} onSelectVendor={(v)=>{setSelectedVendor(v);}}/>}
          {tab==="vendors"   &&selectedVendor&&<VendorCardPage vendor={selectedVendor} onBack={()=>setSelectedVendor(null)} survey={fullSurvey}/>}
          {tab==="venues"    &&!selectedVenue&&<VenueCatalog survey={fullSurvey} favoriteVenues={favoriteVenues} setFavoriteVenues={setFavoriteVenues} onSelect={(v)=>{setSelectedVenue(v);}}/>}
          {tab==="venues"    &&selectedVenue&&<VenueCardPage venue={selectedVenue} favoriteVenues={favoriteVenues} setFavoriteVenues={setFavoriteVenues} onBack={()=>setSelectedVenue(null)} survey={fullSurvey}/>}
          {tab==="agencies"  &&<AgencyCatalog favoriteAgencies={favoriteAgencies} setFavoriteAgencies={setFavoriteAgencies}/>}
          {tab==="checklist" &&<ChecklistPage survey={fullSurvey} checklist={checklist} setChecklist={setChecklist}/>}
          {tab==="favorites" &&<FavoritesPage favoriteVenues={favoriteVenues} favoriteAgencies={favoriteAgencies} onNav={setTab} setFavoriteVenues={setFavoriteVenues} setFavoriteAgencies={setFavoriteAgencies}/>}
          {tab==="guests"    &&<GuestsPage slug={makeSlug(user)} guests={guests} setGuests={setGuests}/>}
          {tab==="timing"    &&<TimingPage survey={fullSurvey} timing={timing} setTiming={setTiming}/>}
          {tab==="invite"    &&<InvitePage survey={fullSurvey} user={user} inviteData={inviteData} setInviteData={setInviteData}/>}
        </>)}
      </main>
    </div>
  );
}
