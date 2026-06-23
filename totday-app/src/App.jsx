import { useState, useEffect, useCallback } from "react";

// ─── THEME ───────────────────────────────────────────────────────────────────
const C = {
  bg:"#F9F5F0", white:"#FFFFFF", sand:"#EDE4D8", taupe:"#B8997A",
  brown:"#7A5C3E", dark:"#2E1F12", teal:"#3D8C82", tealLight:"#6FB8AF",
  tealBg:"#EAF4F3", rose:"#C4705A", roseBg:"#FAF0EE", gold:"#C9A84C",
  gray:"#9A8C82", lightGray:"#F2EDE8",
};
const font = "'Playfair Display', serif";
const fb = "'Lato', sans-serif";

const S = {
  app:   { fontFamily:fb, background:C.bg, minHeight:"100vh", color:C.dark },
  nav:   { background:C.white, borderBottom:`1px solid ${C.sand}`, padding:"0 28px", display:"flex", alignItems:"center", justifyContent:"space-between", height:58, position:"sticky", top:0, zIndex:200, boxShadow:"0 2px 12px rgba(46,31,18,0.07)" },
  logo:  { fontFamily:font, fontSize:19, color:C.brown, letterSpacing:"0.1em", display:"flex", alignItems:"center", gap:8 },
  page:  { maxWidth:1080, margin:"0 auto", padding:"32px 20px" },
  card:  { background:C.white, borderRadius:14, padding:24, border:`1px solid ${C.sand}`, boxShadow:"0 2px 12px rgba(46,31,18,0.05)" },
  h1:    { fontFamily:font, fontSize:30, color:C.brown, fontWeight:700, marginBottom:6 },
  h2:    { fontFamily:font, fontSize:20, color:C.brown, fontWeight:600, marginBottom:14 },
  h3:    { fontFamily:font, fontSize:15, color:C.brown, fontWeight:600, marginBottom:10 },
  sub:   { fontSize:13, color:C.gray, marginBottom:24, lineHeight:1.6 },
  label: { fontSize:11, letterSpacing:"0.1em", color:C.brown, textTransform:"uppercase", fontWeight:700, display:"block", marginBottom:5 },
  input: { width:"100%", padding:"10px 13px", borderRadius:9, border:`1.5px solid ${C.sand}`, background:C.bg, fontSize:14, fontFamily:fb, color:C.dark, outline:"none", boxSizing:"border-box" },
  select:{ width:"100%", padding:"10px 13px", borderRadius:9, border:`1.5px solid ${C.sand}`, background:C.bg, fontSize:14, fontFamily:fb, color:C.dark, outline:"none", boxSizing:"border-box" },
  btn:   { padding:"10px 22px", borderRadius:28, border:"none", background:C.teal, color:C.white, cursor:"pointer", fontSize:13, fontFamily:fb, fontWeight:700, letterSpacing:"0.05em" },
  btnO:  { padding:"9px 20px", borderRadius:28, border:`1.5px solid ${C.taupe}`, background:"transparent", color:C.brown, cursor:"pointer", fontSize:13, fontFamily:fb, fontWeight:600 },
  btnR:  { padding:"10px 22px", borderRadius:28, border:"none", background:C.rose, color:C.white, cursor:"pointer", fontSize:13, fontFamily:fb, fontWeight:700 },
  btnSm: { padding:"5px 12px", borderRadius:20, border:`1px solid ${C.sand}`, background:C.white, color:C.gray, cursor:"pointer", fontSize:11, fontFamily:fb, fontWeight:600 },
  chip:  (on) => ({ padding:"8px 16px", borderRadius:28, cursor:"pointer", fontSize:13, fontFamily:fb, border:`1.5px solid ${on?C.teal:C.sand}`, background:on?C.tealBg:C.white, color:on?C.teal:C.gray, fontWeight:on?700:400, transition:"all 0.13s", display:"inline-flex", alignItems:"center", gap:6 }),
  chipR: (on) => ({ padding:"8px 16px", borderRadius:28, cursor:"pointer", fontSize:13, fontFamily:fb, border:`1.5px solid ${on?C.rose:C.sand}`, background:on?C.roseBg:C.white, color:on?C.rose:C.gray, fontWeight:on?700:400 }),
  badge: (c) => ({ display:"inline-block", padding:"2px 9px", borderRadius:18, fontSize:11, fontWeight:700, background:c==="g"?C.tealBg:c==="r"?C.roseBg:C.lightGray, color:c==="g"?C.teal:c==="r"?C.rose:C.gray }),
  bar:   { height:6, borderRadius:3, background:C.sand, overflow:"hidden" },
  fill:  (p,over) => ({ height:"100%", width:`${Math.min(Math.max(p,0),100)}%`, borderRadius:3, background:over?C.rose:`linear-gradient(90deg,${C.teal},${C.tealLight})`, transition:"width 0.4s" }),
  tab:   (on) => ({ padding:"7px 16px", borderRadius:28, border:"none", cursor:"pointer", background:on?C.teal:"transparent", color:on?C.white:C.gray, fontSize:13, fontFamily:fb, fontWeight:on?700:400 }),
};

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const fmt = (n) => Number(n||0).toLocaleString("ru");
const TRANSLIT = {а:"a",б:"b",в:"v",г:"g",д:"d",е:"e",ё:"yo",ж:"zh",з:"z",и:"i",й:"y",к:"k",л:"l",м:"m",н:"n",о:"o",п:"p",р:"r",с:"s",т:"t",у:"u",ф:"f",х:"h",ц:"ts",ч:"ch",ш:"sh",щ:"sch",ъ:"",ы:"y",ь:"",э:"e",ю:"yu",я:"ya"};
const translit = (s) => (s||"").toLowerCase().split("").map(c=>TRANSLIT[c]??c).join("").replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const makeSlug = (u) => `${translit(u?.name2)||"zhenikh"}-${translit(u?.name1)||"nevesta"}`;

// ─── localStorage helpers ────────────────────────────────────────────────────
const LS = {
  get: (k, def=null) => { try { const v=localStorage.getItem(k); return v?JSON.parse(v):def; } catch { return def; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  del: (k) => { try { localStorage.removeItem(k); } catch {} },
};

// ─── STATIC DATA ─────────────────────────────────────────────────────────────
const CITIES = ["Москва","Санкт-Петербург","Сочи","Казань","Екатеринбург","Другой город"];
const FORMATS = [
  {id:"restaurant",  label:"Ресторан / банкет",     sub:"классический банкет в зале",       icon:"🍽", mult:1.0},
  {id:"loft",        label:"Лофт / городская",      sub:"современное городское пространство",icon:"🌆", mult:1.1},
  {id:"outdoor",     label:"На природе / шатёр",    sub:"загород, сад, выездная",            icon:"🌿", mult:1.15},
  {id:"destination", label:"Destination",           sub:"свадьба-путешествие",               icon:"✈️", mult:1.4},
  {id:"intimate",    label:"Камерная / только свои",sub:"самый близкий круг",                icon:"🤍", mult:0.85},
];
const BUDGET_OPTIONS = [
  {label:"до 500 000 ₽",             val:400000},
  {label:"500 000 – 1 000 000 ₽",   val:750000},
  {label:"1 000 000 – 2 000 000 ₽", val:1500000},
  {label:"2 000 000 – 5 000 000 ₽", val:3000000},
  {label:"5 000 000+ ₽",            val:6000000},
  {label:"Пока не знаю",             val:0},
];

// Коэффициент города (относительно Москвы)
const CITY_MULT = {"Москва":1.0,"Санкт-Петербург":0.85,"Сочи":0.9,"Казань":0.7,"Екатеринбург":0.72,"Другой город":0.65};

// Базовые расценки (Москва, 1 гость)
const BASE_PER_GUEST = {"basic":2200,"comfort":3800,"premium":7000};

const DEFAULT_CATS = [
  {id:"venue",    name:"Площадка",              icon:"🏛", pct:0.19, market:"100 000 – 500 000 ₽",   rec:"Бронируйте за 9–12 мес.", items:["Аренда зала","Аренда мебели","Инвентарь","Уборка"]},
  {id:"catering", name:"Кейтеринг и напитки",   icon:"🍽", pct:0.21, market:"2 500 – 6 000 ₽/гость",  rec:"~3 500 ₽/гость оптимально",items:["Банкетное меню","Алкоголь","Фуршет","Детское меню","Персонал"]},
  {id:"photo",    name:"Фотограф",              icon:"📷", pct:0.08, market:"50 000 – 200 000 ₽",    rec:"Не экономьте — снимки на всю жизнь",items:["Фотосъёмка дня","Love story","Обработка и альбом","2-й фотограф"]},
  {id:"video",    name:"Видеограф",             icon:"🎬", pct:0.05, market:"40 000 – 150 000 ₽",    rec:"Пакет с фото — дешевле",  items:["Видеосъёмка","Монтаж","Аэросъёмка","SDE-ролик"]},
  {id:"decor",    name:"Декор и флористика",    icon:"💐", pct:0.10, market:"80 000 – 400 000 ₽",    rec:"Сезонные цветы выгоднее", items:["Арка / зона церемонии","Столовые композиции","Букет невесты","Аренда декора"]},
  {id:"host",     name:"Ведущий",               icon:"🎤", pct:0.05, market:"30 000 – 120 000 ₽",    rec:"Встретьтесь лично до найма",items:["Услуги ведущего","Сценарий","Конкурсы"]},
  {id:"dj",       name:"DJ / Музыканты",        icon:"🎵", pct:0.03, market:"25 000 – 100 000 ₽",    rec:"Живая музыка на церемонию",items:["DJ-сет","Звуковое оборудование","Живая музыка","Музыка на церемонию"]},
  {id:"cake",     name:"Торт и десерты",        icon:"🎂", pct:0.02, market:"150 – 400 ₽/порция",    rec:"~200 ₽/порция — хороший торт",items:["Свадебный торт","Кенди-бар","Капкейки"]},
  {id:"dress",    name:"Образ невесты",         icon:"👗", pct:0.05, market:"30 000 – 300 000 ₽",    rec:"Учтите примерки и подгонку",items:["Платье","Аксессуары и фата","Туфли","Подгонка"]},
  {id:"suit",     name:"Образ жениха",          icon:"🤵", pct:0.02, market:"15 000 – 100 000 ₽",    rec:"Аренда смокинга дешевле",  items:["Костюм / смокинг","Рубашка, галстук","Туфли"]},
  {id:"makeup",   name:"Визажист и стилист",    icon:"💄", pct:0.02, market:"15 000 – 60 000 ₽",     rec:"Репетиция образа обязательна",items:["Макияж невесты","Причёска","Репетиция","Макияж подружек"]},
  {id:"rings",    name:"Кольца",                icon:"💍", pct:0.05, market:"30 000 – 500 000 ₽",    rec:"Бюджет = 1–2 зарплаты",   items:["Обручальные кольца","Гравировка","Упаковка"]},
  {id:"ceremony", name:"Церемония",             icon:"💒", pct:0.02, market:"20 000 – 80 000 ₽",     rec:"Выездная регистрация +30% эмоций",items:["Выездная регистрация","Распорядитель","Оформление"]},
  {id:"transport",name:"Транспорт",             icon:"🚗", pct:0.02, market:"10 000 – 50 000 ₽",     rec:"Трансфер для гостей снижает no-show",items:["Авто молодожёнов","Трансфер гостей","Украшение авто"]},
  {id:"hotel",    name:"Проживание",            icon:"🏨", pct:0.02, market:"3 000 – 15 000 ₽/номер",rec:"Блок номеров — скидка 15–25%",items:["Номер молодожёнов","Блок номеров","Bridal suite"]},
  {id:"invites",  name:"Полиграфия и подарки",  icon:"✉️", pct:0.01, market:"200 – 800 ₽/шт",        rec:"Цифровые приглашения — тренд",items:["Приглашения","Рассадочные карточки","Бонбоньерки"]},
  {id:"honeymoon",name:"Медовый месяц",         icon:"✈️", pct:0.05, market:"от 100 000 ₽",          rec:"Бронируйте сразу — дешевле",items:["Авиабилеты","Отель","Экскурсии"]},
  {id:"other",    name:"Прочее / резерв",       icon:"✨", pct:0.03, market:"по факту",               rec:"Оставьте 5–10% бюджета",  items:["Непредвиденные расходы","Чаевые персоналу"]},
];
const PCT_TOTAL = DEFAULT_CATS.reduce((s,c)=>s+c.pct,0);
DEFAULT_CATS.forEach(c=>{ c.pct = c.pct/PCT_TOTAL; });

const VENDORS = [
  {id:1,cat:"venue",   name:"Loft Riverside",  city:"Москва",priceFrom:150000,rating:4.9,reviews:87, tags:["Панорамный вид","до 200 гостей"],desc:"Стильный лофт на берегу Москвы-реки",busy:["2025-08-16"]},
  {id:2,cat:"venue",   name:"Golden Hall",     city:"Москва",priceFrom:280000,rating:4.8,reviews:54, tags:["Роскошь","до 300 гостей"],       desc:"Парадный зал в центре города",       busy:["2025-07-19"]},
  {id:3,cat:"venue",   name:"Усадьба Захарово",city:"Москва",priceFrom:200000,rating:4.7,reviews:41, tags:["Природа","Терраса"],             desc:"Загородная усадьба с садом",          busy:[]},
  {id:4,cat:"photo",   name:"Иван Громов",     city:"Москва",priceFrom:80000, rating:5.0,reviews:143,tags:["Репортаж","Арт"],               desc:"Живые эмоциональные снимки",          busy:["2025-08-02"]},
  {id:5,cat:"photo",   name:"Мария Белова",    city:"Москва",priceFrom:60000, rating:4.9,reviews:98, tags:["Светлый стиль","Плёнка"],        desc:"Нежная плёночная эстетика",           busy:[]},
  {id:6,cat:"host",    name:"Алексей Волков",  city:"Москва",priceFrom:50000, rating:4.8,reviews:211,tags:["Юмор","Живая музыка"],           desc:"10 лет опыта, авторские программы",   busy:["2025-07-26"]},
  {id:7,cat:"host",    name:"Елена Крылова",   city:"Москва",priceFrom:40000, rating:4.9,reviews:167,tags:["Элегантность","Игры"],           desc:"Тёплая атмосфера, свой сценарий",     busy:[]},
  {id:8,cat:"decor",   name:"Студия Flora",    city:"Москва",priceFrom:120000,rating:4.9,reviews:67, tags:["Флористика","Аренда"],           desc:"Полный декор от арки до стола",       busy:[]},
  {id:9,cat:"video",   name:"Кинолюди",        city:"Москва",priceFrom:70000, rating:4.8,reviews:91, tags:["Кино","Аэросъёмка"],             desc:"Свадебное кино, которое смотришь снова",busy:[]},
  {id:10,cat:"dj",     name:"DJ Fontaine",     city:"Москва",priceFrom:35000, rating:4.9,reviews:128,tags:["Танцпол","Живой звук"],          desc:"Разогреет любую аудиторию",           busy:[]},
  {id:11,cat:"cake",   name:"Confiserie Blanc",city:"Москва",priceFrom:25000, rating:5.0,reviews:189,tags:["Авторские","Без глютена"],        desc:"Торты под стиль вашей свадьбы",       busy:[]},
  {id:12,cat:"makeup", name:"Анастасия Ли",    city:"Москва",priceFrom:15000, rating:4.9,reviews:203,tags:["Макияж","Причёска"],             desc:"Нежный образ или вечерний гламур",    busy:[]},
  {id:13,cat:"transport",name:"Royal Cars",    city:"Москва",priceFrom:12000, rating:4.8,reviews:55, tags:["Rolls-Royce","Mercedes"],        desc:"Премиальные авто для молодожёнов",    busy:[]},
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

// ─── SCENARIO CALCULATOR ─────────────────────────────────────────────────────
function calcScenarios(survey) {
  const guests = Number(survey.guests) || 50;
  const cityMult = CITY_MULT[survey.city] || 0.8;
  const fmt_ = survey.format || "medium";
  const formatMult = FORMATS.find(f=>f.id===fmt_)?.mult || 1;
  const userBudget = survey.budget || 0;

  const scenarios = ["basic","comfort","premium"].map(tier => {
    const base = Math.round(guests * BASE_PER_GUEST[tier] * cityMult * formatMult);
    const total = userBudget > 0 ? Math.round((base + userBudget) / 2) : base;
    return {
      tier,
      label: tier==="basic"?"Базовый":tier==="comfort"?"Комфорт":"Премиум",
      icon: tier==="basic"?"🌿":tier==="comfort"?"✨":"🏆",
      color: tier==="basic"?C.teal:tier==="comfort"?C.gold:C.rose,
      total: tier==="basic"?Math.round(total*0.75):tier==="comfort"?total:Math.round(total*1.6),
      perGuest: Math.round((tier==="basic"?total*0.75:tier==="comfort"?total:total*1.6)/guests),
      bullets: tier==="basic"
        ? ["Банкетный зал или шатёр","Стандартный кейтеринг","1 фотограф","Базовый декор","DJ"]
        : tier==="comfort"
        ? ["Площадка с атмосферой","Авторское меню и алкоголь","Фотограф + видеограф","Полный декор и флористика","Ведущий + DJ"]
        : ["Топовая площадка","Premium меню и open bar","2 фотографа + видео + аэро","Дизайнерский декор","Шоу-программа и живая музыка"],
    };
  });
  return scenarios;
}

function makeCatsFromBudget(totalBudget) {
  return DEFAULT_CATS.map(c => ({
    ...c,
    plan: Math.round(totalBudget * c.pct),
    actual: 0,
    expanded: false,
    itemActuals: Object.fromEntries(c.items.map(item=>[item,0])),
  }));
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────
function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [f, setF] = useState({email:"",pass:"",name1:"",name2:""});
  const upd = k => e => setF(p=>({...p,[k]:e.target.value}));
  return (
    <div style={{minHeight:"100vh",background:`linear-gradient(135deg,${C.sand},${C.bg} 55%,${C.tealBg})`,display:"flex",alignItems:"center",justifyContent:"center",padding:24}}>
      <div style={{...S.card,maxWidth:400,width:"100%"}}>
        <div style={{textAlign:"center",marginBottom:24}}>
          <div style={{fontSize:40,marginBottom:8}}>🕊</div>
          <h1 style={{fontFamily:font,fontSize:24,color:C.brown,margin:0}}>TotDay</h1>
          <p style={{color:C.gray,fontSize:13,marginTop:4}}>Планируйте свадьбу мечты</p>
        </div>
        <div style={{display:"flex",gap:6,marginBottom:20,background:C.lightGray,borderRadius:28,padding:4}}>
          {[["login","Войти"],["register","Регистрация"]].map(([m,l])=>(
            <button key={m} onClick={()=>setMode(m)} style={{...S.tab(mode===m),flex:1,borderRadius:24}}>{l}</button>
          ))}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:13}}>
          {mode==="register" && (
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div><label style={S.label}>Невеста</label><input style={S.input} placeholder="Соня" value={f.name1} onChange={upd("name1")} /></div>
              <div><label style={S.label}>Жених</label><input style={S.input} placeholder="Никита" value={f.name2} onChange={upd("name2")} /></div>
            </div>
          )}
          <div><label style={S.label}>Email</label><input style={S.input} type="email" value={f.email} onChange={upd("email")} /></div>
          <div><label style={S.label}>Пароль</label><input style={S.input} type="password" value={f.pass} onChange={upd("pass")} /></div>
          <button style={{...S.btn,width:"100%",padding:13}} onClick={()=>onLogin({email:f.email,name1:f.name1||"Невеста",name2:f.name2||"Жених"})}>
            {mode==="login"?"Войти →":"Создать аккаунт →"}
          </button>
          <button style={{background:"none",border:"none",color:C.gray,fontSize:12,cursor:"pointer",textDecoration:"underline"}} onClick={()=>onLogin({email:"demo@totday.app",name1:"Соня",name2:"Никита"})}>
            Войти как демо
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── SURVEY 1: QUICK ESTIMATE ─────────────────────────────────────────────────
function Survey1Page({ onComplete, initial }) {
  const [step, setStep] = useState(0);
  const [d, setD] = useState(()=>({season:"",date:"",altDates:"",zags:"",city:"Москва",guests:"",outOfTown:"",format:"",budgetLabel:"",budget:0, ...(initial||{})}));
  const set = (k,v) => setD(p=>({...p,[k]:v}));

  const STEPS = [
    { title:"Когда планируете свадьбу?", sub:"Дата влияет на доступность подрядчиков", ok:d.season||d.date,
      body:(
        <div style={{display:"flex",flexDirection:"column",gap:18}}>
          <div>
            <label style={S.label}>Сезон</label>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:6}}>
              {[["🌸","Весна"],["☀️","Лето"],["🍂","Осень"],["❄️","Зима"],["🤷","Пока не знаю"]].map(([ic,s])=>(
                <span key={s} style={S.chip(d.season===s)} onClick={()=>set("season",s)}>{ic} {s}</span>
              ))}
            </div>
          </div>
          <div>
            <label style={S.label}>Точная дата (если известна)</label>
            <input type="date" style={{...S.input,maxWidth:220}} value={d.date} onChange={e=>set("date",e.target.value)} />
            <p style={{fontSize:12,color:d.date?C.teal:"transparent",marginTop:6,minHeight:16}}>✓ Покажем только свободных подрядчиков</p>
          </div>
          <div>
            <label style={S.label}>Альтернативные даты (если гибко)</label>
            <input style={{...S.input,maxWidth:320}} placeholder="например: июнь–июль, любая суббота" value={d.altDates} onChange={e=>set("altDates",e.target.value)} />
          </div>
          <div>
            <label style={S.label}>Заявление в ЗАГС подано?</label>
            <div style={{display:"flex",gap:8,marginTop:6}}>
              {["Да","Нет","Пока нет"].map(o=>(
                <span key={o} style={S.chip(d.zags===o)} onClick={()=>set("zags",o)}>{o}</span>
              ))}
            </div>
          </div>
        </div>
      )
    },
    { title:"Где будет свадьба?", sub:"Город влияет на ценовой расчёт", ok:d.city,
      body:(
        <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
          {CITIES.map(c=><span key={c} style={S.chip(d.city===c)} onClick={()=>set("city",c)}>{c}</span>)}
        </div>
      )
    },
    { title:"Сколько гостей?", sub:"Примерно — уточните позже", ok:d.guests,
      body:(
        <div style={{display:"flex",flexDirection:"column",gap:16}}>
          <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
            {[["До 15","7"],["15–30","22"],["30–60","45"],["60–100","80"],["100–150","125"],["150–200","175"],["200+","250"]].map(([l,v])=>(
              <span key={l} style={S.chip(d.guests===v)} onClick={()=>set("guests",v)}>{l}</span>
            ))}
          </div>
          <div>
            <label style={S.label}>Или введите точное число</label>
            <input type="number" style={{...S.input,maxWidth:160}} placeholder="80" value={d.guests} onChange={e=>set("guests",e.target.value)} />
          </div>
          <div>
            <label style={S.label}>Будут гости из других городов?</label>
            <div style={{display:"flex",gap:8,marginTop:6}}>
              {["Нет","Да, нужен трансфер","Да, нужно размещение","Да, и то и другое"].map(o=>(
                <span key={o} style={S.chip(d.outOfTown===o)} onClick={()=>set("outOfTown",o)}>{o}</span>
              ))}
            </div>
            <p style={{fontSize:11,color:C.gray,marginTop:6}}>Влияет на категории «Транспорт» и «Проживание» в смете</p>
          </div>
        </div>
      )
    },
    { title:"Формат свадьбы", sub:"Влияет на подбор площадок", ok:d.format,
      body:(
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {FORMATS.map(f=>(
            <div key={f.id} onClick={()=>set("format",f.id)} style={{...S.card,padding:"14px 18px",cursor:"pointer",display:"flex",alignItems:"center",gap:14,border:`2px solid ${d.format===f.id?C.teal:C.sand}`,background:d.format===f.id?C.tealBg:C.white}}>
              <span style={{fontSize:22}}>{f.icon}</span>
              <div style={{flex:1}}><div style={{fontWeight:700,fontSize:14}}>{f.label}</div><div style={{fontSize:12,color:C.gray}}>{f.sub}</div></div>
              {d.format===f.id&&<span style={{color:C.teal}}>✓</span>}
            </div>
          ))}
        </div>
      )
    },
    { title:"Бюджет на свадьбу", sub:"Используем для расчёта. «Пока не знаю» — рассчитаем сами", ok:d.budgetLabel,
      body:(
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {BUDGET_OPTIONS.map(b=>(
            <div key={b.label} onClick={()=>{set("budgetLabel",b.label);set("budget",b.val);}} style={{...S.card,padding:"13px 18px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",border:`2px solid ${d.budgetLabel===b.label?C.teal:C.sand}`,background:d.budgetLabel===b.label?C.tealBg:C.white}}>
              <span style={{fontWeight:d.budgetLabel===b.label?700:400,fontSize:14}}>{b.label}</span>
              {d.budgetLabel===b.label&&<span style={{color:C.teal}}>✓</span>}
            </div>
          ))}
        </div>
      )
    },
  ];

  const cur = STEPS[step];
  const pct = (step+1)/STEPS.length*100;
  return (
    <div style={{...S.page,maxWidth:600}}>
      <div style={{marginBottom:24,textAlign:"center"}}>
        <span style={{...S.badge("g"),fontSize:12,padding:"4px 14px",marginBottom:12,display:"inline-block"}}>Быстрый расчёт · шаг {step+1} из {STEPS.length}</span>
        <div style={S.bar}><div style={S.fill(pct)} /></div>
      </div>
      <div style={{...S.card,marginBottom:20}}>
        <h2 style={S.h1}>{cur.title}</h2>
        <p style={S.sub}>{cur.sub}</p>
        {cur.body}
      </div>
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

// ─── SCENARIO SCREEN ─────────────────────────────────────────────────────────
function ScenariosPage({ survey, onChoose }) {
  const scenarios = calcScenarios(survey);
  const [chosen, setChosen] = useState(null);
  const guests = Number(survey.guests)||50;

  return (
    <div style={{...S.page,maxWidth:860}}>
      <div style={{textAlign:"center",marginBottom:36}}>
        <h2 style={{...S.h1,fontSize:28}}>Сколько может стоить ваша свадьба</h2>
        <p style={{color:C.gray,fontSize:14,lineHeight:1.7}}>
          {survey.city} · {guests} гостей · {FORMATS.find(f=>f.id===survey.format)?.label}
          <br/>Расчёт основан на реальных рыночных ценах 2025 года
        </p>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:20,marginBottom:32}}>
        {scenarios.map(sc=>(
          <div key={sc.tier} onClick={()=>setChosen(sc.tier)}
            style={{...S.card,cursor:"pointer",border:`2px solid ${chosen===sc.tier?sc.color:C.sand}`,background:chosen===sc.tier?`${sc.color}10`:C.white,transition:"all 0.15s",position:"relative"}}>
            {chosen===sc.tier&&<div style={{position:"absolute",top:14,right:14,width:24,height:24,borderRadius:"50%",background:sc.color,color:"white",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:700}}>✓</div>}
            <div style={{fontSize:32,marginBottom:8}}>{sc.icon}</div>
            <div style={{fontFamily:font,fontSize:18,fontWeight:700,color:sc.color,marginBottom:4}}>{sc.label}</div>
            <div style={{fontFamily:font,fontSize:26,fontWeight:700,color:C.dark,marginBottom:2}}>{fmt(sc.total)} ₽</div>
            <div style={{fontSize:12,color:C.gray,marginBottom:16}}>≈ {fmt(sc.perGuest)} ₽ / гость</div>
            <div style={{height:1,background:C.sand,marginBottom:14}}/>
            <ul style={{margin:0,padding:0,listStyle:"none",display:"flex",flexDirection:"column",gap:7}}>
              {sc.bullets.map((b,i)=>(
                <li key={i} style={{display:"flex",gap:8,fontSize:12,color:C.dark,alignItems:"flex-start"}}>
                  <span style={{color:sc.color,flexShrink:0,marginTop:1}}>✓</span>{b}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {chosen&&(
        <div style={{textAlign:"center"}}>
          <button style={{...S.btn,padding:"14px 40px",fontSize:15}} onClick={()=>onChoose(scenarios.find(s=>s.tier===chosen))}>
            Создать смету на основе «{scenarios.find(s=>s.tier===chosen)?.label}» →
          </button>
        </div>
      )}
      <div style={{textAlign:"center",marginTop:14}}>
        <button style={{background:"none",border:"none",color:C.gray,fontSize:12,cursor:"pointer",textDecoration:"underline"}} onClick={()=>onChoose(scenarios[1])}>
          Пропустить — выбрать потом
        </button>
      </div>
    </div>
  );
}

// ─── SURVEY 2: CONCEPT ───────────────────────────────────────────────────────
function Survey2Page({ onComplete, initial }) {
  const [step, setStep] = useState(0);
  const [d, setD] = useState(()=>({personality:[],feelings:[],memory:"",priorities:[],dontWant:[],guestType:"",guestComfort:3,likedPhotos:[],decorLevel:"",decorZones:[],program:[],nature:[],mustHave:"", ...(initial||{})}));
  const set = (k,v) => setD(p=>({...p,[k]:v}));
  const toggle = (k,v,max) => {
    const arr = d[k];
    if (arr.includes(v)) { set(k,arr.filter(x=>x!==v)); return; }
    if (max&&arr.length>=max) return;
    set(k,[...arr,v]);
  };

  const Chips = ({field,max,opts,red}) => (
    <div style={{display:"flex",flexWrap:"wrap",gap:8,marginTop:8}}>
      {opts.map(([v,l])=>{
        const on=d[field].includes(v);
        const dis=!on&&max&&d[field].length>=max;
        return <span key={v} style={{...(red?S.chipR(on):S.chip(on)),opacity:dis?0.4:1,cursor:dis?"not-allowed":"pointer"}} onClick={()=>!dis&&toggle(field,v,max)}>{l}</span>;
      })}
    </div>
  );

  const Cards = ({field,opts}) => (
    <div style={{display:"flex",flexDirection:"column",gap:8,marginTop:8}}>
      {opts.map(([v,l,sub])=>(
        <div key={v} onClick={()=>set(field,v)} style={{...S.card,padding:"13px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:12,border:`2px solid ${d[field]===v?C.teal:C.sand}`,background:d[field]===v?C.tealBg:C.white}}>
          <div style={{flex:1}}><div style={{fontWeight:700,fontSize:14}}>{l}</div>{sub&&<div style={{fontSize:11,color:C.gray,marginTop:2}}>{sub}</div>}</div>
          {d[field]===v&&<span style={{color:C.teal}}>✓</span>}
        </div>
      ))}
    </div>
  );

  const STEPS = [
    {title:"Какие вы как пара?",sub:"До 3 вариантов",body:<Chips field="personality" max={3} opts={[["party","🎉 Шумные вечеринки"],["cozy","🏡 Уютные вечера"],["travel","✈️ Путешествия"],["gastro","🍽 Гастрономия"],["aesthetic","✨ Красивая эстетика"],["music","🎵 Музыка и танцы"],["unique","🌀 Необычные впечатления"],["nature","🌿 Природа"],["urban","🌆 Городская атмосфера"]]}/>},
    {title:"Что хотите чувствовать?",sub:"До 3 вариантов",body:<Chips field="feelings" max={3} opts={[["fun","Веселье"],["romance","Романтику"],["cozy","Уют"],["wow","Вау-эффект"],["calm","Спокойствие"],["elegance","Элегантность"],["freedom","Свободу"],["warmth","Душевность"],["celebration","Праздник"]]}/>},
    {title:"Что запомнят гости?",sub:"Один вариант",body:<Cards field="memory" opts={[["ceremony","💒 Церемония"],["atmosphere","✨ Атмосфера"],["dance","💃 Танцы"],["food","🍽 Еда"],["beauty","💐 Красота"],["emotions","❤️ Эмоции"],["talk","🥂 Общение"]]}/>},
    {title:"Что важнее всего?",sub:"До 5 — здесь концентрируем бюджет",body:<Chips field="priorities" max={5} opts={[["food","🍽 Еда"],["photo","📷 Фото"],["video","🎬 Видео"],["music","🎵 Музыка"],["dance","💃 Танцы"],["decor","💐 Декор"],["ceremony","💒 Церемония"],["guests","👥 Комфорт гостей"],["budget","💰 Экономия"]]}/>},
    {title:"Что точно НЕ хотите?",sub:"Передадим подрядчикам в ТЗ",body:<Chips field="dontWant" red opts={[["contests","Пошлые конкурсы"],["toasts","Длинные тосты"],["ransom","Выкуп"],["oldhost","Тамада старого формата"],["official","Много официоза"],["boring","Банкет как у всех"],["karaoke","Караоке"],["kids","Детские активности"],["envelopes","Сбор денег в конвертах"]]}/>},
    {title:"Кто ваши гости?",sub:"Влияет на программу",body:<Cards field="guestType" opts={[["friends","👫 В основном друзья"],["friendsfamily","👨‍👩‍👧 Друзья и родители"],["family","👴 Большая семья"],["mixed","🏢 Семья и коллеги"],["diverse","🌍 Смешанная компания"]]}/>},
    {title:"Важность комфорта гостей",sub:"Трансфер, отель, детская зона...",body:(
      <div style={{marginTop:16}}>
        <div style={{display:"flex",justifyContent:"space-between",gap:8}}>
          {[1,2,3,4,5].map(n=>(
            <div key={n} onClick={()=>set("guestComfort",n)} style={{flex:1,height:52,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",border:`2px solid ${d.guestComfort===n?C.teal:C.sand}`,background:d.guestComfort===n?C.teal:C.white,color:d.guestComfort===n?C.white:C.gray,fontWeight:700,fontSize:18,cursor:"pointer"}}>
              {n}
            </div>
          ))}
        </div>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:C.gray,marginTop:8}}><span>Не приоритет</span><span>Очень важно</span></div>
      </div>
    )},
    {title:"Свадьбы, которые вам нравятся",sub:"Лайкайте — самый важный вопрос для стиля",body:(
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginTop:8}}>
        {WEDDING_PHOTOS.map(p=>{
          const on=d.likedPhotos.includes(p.id);
          return (
            <div key={p.id} onClick={()=>toggle("likedPhotos",p.id)} style={{borderRadius:10,overflow:"hidden",cursor:"pointer",border:`3px solid ${on?C.teal:"transparent"}`,transition:"all 0.13s"}}>
              <div style={{background:on?C.tealBg:C.lightGray,height:80,display:"flex",alignItems:"center",justifyContent:"center",fontSize:32}}>{p.emoji}</div>
              <div style={{padding:"7px 10px",background:on?C.tealBg:C.white,fontSize:11,fontWeight:on?700:400,color:on?C.teal:C.dark}}>{p.label}</div>
            </div>
          );
        })}
      </div>
    )},
    {title:"Уровень декора",sub:"Влияет на бюджет и выбор подрядчиков",body:<Cards field="decorLevel" opts={[["min","🌿 Минимум","Чисто, акцент на пространстве"],["nice","✨ Аккуратно","Продуманные детали, флористика"],["wow","💐 Впечатляюще","Объёмные композиции, свет"],["grand","🏛 Максимум","Полная трансформация пространства"]]}/>},
    {title:"Какие зоны оформить декором?",sub:"Выберите всё нужное — каждая зона войдёт в смету декора",body:<Chips field="decorZones" opts={[["ceremony","💒 Зона церемонии"],["welcome","🥂 Welcome-зона"],["sweet","🍰 Сладкий стол"],["headtable","💍 Стол молодожёнов"],["photo","📸 Фотозона"],["gifts","🎁 Зона подарков"],["guest","🍽 Гостевые столы"],["lounge","🛋 Лаунж-зона"]]}/>},
    {title:"Что включить в программу?",sub:"Дополнительные впечатления для гостей",body:<Chips field="program" opts={[["photobooth","📸 Фотобудка"],["fireworks","🎆 Фейерверк"],["live","🎸 Живая музыка"],["kids","🧸 Аниматор для детей"],["fountains","❄️ Холодные фонтаны"],["cover","🎤 Кавер-группа"],["show","🎭 Шоу-программа"]]}/>},
    {title:"Важны природные элементы?",sub:"Для подбора площадки",body:<Chips field="nature" opts={[["water","🌊 Водоём"],["forest","🌲 Лес"],["park","🌳 Парк"],["terrace","☀️ Терраса"],["none","🏛 Не важно"]]}/>},
    {title:"Что обязательно должно быть?",sub:"Живая группа, церемония на закате, сигарная зона...",body:(
      <textarea style={{...S.input,minHeight:110,resize:"vertical",fontSize:14,marginTop:8}} placeholder={"Например:\n— Живая группа\n— Бар с коктейлями\n— Церемония на закате"} value={d.mustHave} onChange={e=>set("mustHave",e.target.value)}/>
    )},
  ];

  const cur = STEPS[step];
  const pct = (step+1)/STEPS.length*100;
  return (
    <div style={{...S.page,maxWidth:620}}>
      <div style={{marginBottom:24,textAlign:"center"}}>
        <span style={{...S.badge(""),fontSize:12,padding:"4px 14px",marginBottom:12,display:"inline-block"}}>Концепция · шаг {step+1} из {STEPS.length}</span>
        <div style={S.bar}><div style={S.fill(pct)}/></div>
      </div>
      <div style={{...S.card,marginBottom:20}}>
        <h2 style={S.h1}>{cur.title}</h2>
        <p style={S.sub}>{cur.sub}</p>
        {cur.body}
      </div>
      <div style={{display:"flex",justifyContent:"space-between"}}>
        {step>0?<button style={S.btnO} onClick={()=>setStep(s=>s-1)}>← Назад</button>:<div/>}
        <div style={{display:"flex",gap:10}}>
          <button style={S.btnO} onClick={()=>onComplete(d)}>Пропустить →</button>
          {step<STEPS.length-1
            ?<button style={S.btn} onClick={()=>setStep(s=>s+1)}>Далее →</button>
            :<button style={S.btnR} onClick={()=>onComplete(d)}>Готово — смотреть бюджет ✦</button>
          }
        </div>
      </div>
    </div>
  );
}

// ─── BUDGET PAGE ─────────────────────────────────────────────────────────────
function BudgetPage({ survey, cats, setCats, onGoToVendors }) {
  const [totalBudget, setTotalBudget] = useState(() => Number(survey?.budget)||1500000);
  const [editingBudget, setEditingBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState(String(Number(survey?.budget)||1500000));
  const [editPlanId, setEditPlanId] = useState(null);
  const [newTx, setNewTx] = useState({catId:"venue",amount:"",note:""});
  const [txHistory, setTxHistory] = useState(() => LS.get("td_txHistory",[]) );
  const [activeTab, setActiveTab] = useState("plan");
  const [showAddCat, setShowAddCat] = useState(false);
  const [newCat, setNewCat] = useState({name:"",icon:"✨",plan:""});

  // Persist tx history
  useEffect(()=>{ LS.set("td_txHistory",txHistory); },[txHistory]);

  // Reactive totals
  const totalPlan   = cats.reduce((s,c)=>s+c.plan,0);
  const totalActual = cats.reduce((s,c)=>s+c.actual,0);
  const leftBudget  = totalBudget - totalActual;
  const guests = Number(survey?.guests)||80;

  const applyNewBudget = (raw) => {
    const nb = Math.max(0,Number(raw)||0);
    setTotalBudget(nb);
    setBudgetInput(String(nb));
    setCats(prev => {
      const prevTotal = prev.reduce((s,c)=>s+c.plan,0);
      if (prevTotal===0) return prev.map(c=>({...c,plan:Math.round(nb*c.pct)}));
      return prev.map(c=>({...c,plan:Math.round(c.plan/prevTotal*nb)}));
    });
    setEditingBudget(false);
  };

  const updatePlan = (id,val) => setCats(prev=>prev.map(c=>c.id===id?{...c,plan:Math.max(0,Number(val)||0)}:c));

  const toggleExpand = (id) => setCats(prev=>prev.map(c=>c.id===id?{...c,expanded:!c.expanded}:c));

  const updateItemActual = (catId,item,val) => {
    setCats(prev=>prev.map(c=>{
      if (c.id!==catId) return c;
      const ia = {...c.itemActuals,[item]:Math.max(0,Number(val)||0)};
      return {...c,itemActuals:ia,actual:Object.values(ia).reduce((s,v)=>s+v,0)};
    }));
  };

  const addActual = () => {
    if (!newTx.amount) return;
    const tx = {id:Date.now(),catId:newTx.catId,amount:Number(newTx.amount),note:newTx.note,date:new Date().toLocaleDateString("ru")};
    setTxHistory(prev=>[tx,...prev]);
    setCats(prev=>prev.map(c=>c.id===tx.catId?{...c,actual:c.actual+tx.amount}:c));
    setNewTx(p=>({...p,amount:"",note:""}));
  };

  const removeCat = (id) => setCats(prev=>prev.filter(c=>c.id!==id));

  const addCat = () => {
    if (!newCat.name) return;
    const id = "custom_"+Date.now();
    setCats(prev=>[...prev,{id,name:newCat.name,icon:newCat.icon||"✨",pct:0,market:"—",rec:"—",items:[],plan:Number(newCat.plan)||0,actual:0,expanded:false,itemActuals:{}}]);
    setNewCat({name:"",icon:"✨",plan:""});
    setShowAddCat(false);
  };

  const budgetPct = totalBudget>0?totalActual/totalBudget*100:0;

  return (
    <div style={S.page}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12,marginBottom:8}}>
        <div>
          <h2 style={S.h1}>Бюджет свадьбы</h2>
          <p style={S.sub}>{survey?.city} · {guests} гостей · {FORMATS.find(f=>f.id===survey?.format)?.label||""}</p>
        </div>
        <div style={{display:"flex",gap:6}}>
          <button style={S.tab(activeTab==="plan")} onClick={()=>setActiveTab("plan")}>📋 Смета</button>
          <button style={S.tab(activeTab==="tracker")} onClick={()=>setActiveTab("tracker")}>💳 Трекер</button>
        </div>
      </div>

      {/* Summary */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(155px,1fr))",gap:14,marginBottom:18}}>
        {/* Editable budget */}
        <div style={{...S.card,textAlign:"center"}}>
          <div style={{fontSize:18,marginBottom:4}}>💰</div>
          <div style={{fontSize:10,color:C.gray,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:4}}>Общий бюджет</div>
          {editingBudget?(
            <input type="number" min="0" autoFocus style={{...S.input,textAlign:"center",fontWeight:700,fontSize:16,color:C.brown,padding:"4px 8px"}}
              value={budgetInput} onChange={e=>setBudgetInput(e.target.value)}
              onFocus={e=>e.target.select()}
              onBlur={()=>applyNewBudget(budgetInput)}
              onKeyDown={e=>{ if(e.key==="Enter") applyNewBudget(budgetInput); if(e.key==="Escape") setEditingBudget(false); }} />
          ):(
            <div style={{fontFamily:font,fontSize:18,color:C.brown,fontWeight:700,cursor:"pointer",borderBottom:`1px dashed ${C.taupe}`}} onClick={()=>{ setBudgetInput(String(totalBudget)); setEditingBudget(true); }}>
              {fmt(totalBudget)} ₽
            </div>
          )}
          <div style={{fontSize:9,color:C.gray,marginTop:4}}>нажмите чтобы изменить</div>
        </div>
        {[
          {l:"Запланировано",   v:`${fmt(totalPlan)} ₽`,            c:totalPlan>totalBudget?C.rose:C.taupe, icon:"📋", warn:totalPlan>totalBudget?`превышает на ${fmt(totalPlan-totalBudget)} ₽`:""},
          {l:"Свободно в плане", v:`${fmt(totalBudget-totalPlan)} ₽`, c:(totalBudget-totalPlan)>=0?C.teal:C.rose, icon:"📊"},
          {l:"Потрачено",       v:`${fmt(totalActual)} ₽`,          c:C.rose,   icon:"💳"},
          {l:"Остаток денег",   v:`${fmt(leftBudget)} ₽`,           c:leftBudget>=0?C.teal:C.rose, icon:leftBudget>=0?"✅":"⚠️"},
        ].map(s=>(
          <div key={s.l} style={{...S.card,textAlign:"center"}}>
            <div style={{fontSize:18,marginBottom:4}}>{s.icon}</div>
            <div style={{fontSize:10,color:C.gray,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:4}}>{s.l}</div>
            <div style={{fontFamily:font,fontSize:18,color:s.c,fontWeight:700}}>{s.v}</div>
            {s.warn&&<div style={{fontSize:10,color:C.rose,marginTop:2}}>{s.warn}</div>}
          </div>
        ))}
      </div>

      {/* Progress */}
      <div style={{...S.card,padding:"14px 20px",marginBottom:18}}>
        <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:C.gray,marginBottom:6}}>
          <span>Израсходовано бюджета</span>
          <span style={{color:C.teal,fontWeight:700}}>{Math.round(budgetPct)}%</span>
        </div>
        <div style={S.bar}><div style={S.fill(budgetPct, totalActual>totalBudget)}/></div>
      </div>

      {/* ── PLAN TAB ── */}
      {activeTab==="plan"&&(
        <div style={S.card}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
            <h3 style={{...S.h2,margin:0}}>По категориям</h3>
            <button style={S.btn} onClick={()=>setShowAddCat(true)}>+ Добавить категорию</button>
          </div>

          {showAddCat&&(
            <div style={{background:C.tealBg,borderRadius:10,padding:16,marginBottom:16,display:"flex",gap:10,flexWrap:"wrap",alignItems:"flex-end"}}>
              <div style={{flex:"2 1 150px"}}><label style={S.label}>Название</label><input style={S.input} value={newCat.name} onChange={e=>setNewCat(p=>({...p,name:e.target.value}))} placeholder="Шоу-программа"/></div>
              <div style={{flex:"0 0 75px"}}><label style={S.label}>Иконка</label><input style={S.input} value={newCat.icon} onChange={e=>setNewCat(p=>({...p,icon:e.target.value}))}/></div>
              <div style={{flex:"1 1 110px"}}><label style={S.label}>План ₽</label><input type="number" style={S.input} value={newCat.plan} onChange={e=>setNewCat(p=>({...p,plan:e.target.value}))} placeholder="50000"/></div>
              <button style={S.btn} onClick={addCat}>Добавить</button>
              <button style={S.btnO} onClick={()=>setShowAddCat(false)}>Отмена</button>
            </div>
          )}

          {/* Header row */}
          <div style={{display:"grid",gridTemplateColumns:"28px 1fr 110px 110px 110px 90px 90px",gap:8,padding:"6px 0 10px",borderBottom:`2px solid ${C.sand}`,fontSize:10,color:C.gray,letterSpacing:"0.07em",textTransform:"uppercase",fontWeight:700}}>
            <div/>
            <div>Категория</div>
            <div style={{textAlign:"right"}}>Рынок</div>
            <div style={{textAlign:"right"}}>План</div>
            <div style={{textAlign:"right"}}>Факт</div>
            <div style={{textAlign:"right"}}>Разница</div>
            <div/>
          </div>

          {cats.map((c,i)=>{
            const over = c.actual>c.plan&&c.plan>0;
            const diff = c.plan - c.actual;
            const pUsed = c.plan>0?Math.min(100,Math.round(c.actual/c.plan*100)):0;
            return (
              <div key={c.id} style={{borderBottom:i<cats.length-1?`1px solid ${C.lightGray}`:"none"}}>
                {/* Main row */}
                <div style={{display:"grid",gridTemplateColumns:"28px 1fr 110px 110px 110px 90px 90px",gap:8,padding:"12px 0",alignItems:"center",cursor:"pointer"}} onClick={()=>toggleExpand(c.id)}>
                  <span style={{fontSize:17}}>{c.icon}</span>
                  <div>
                    <div style={{fontSize:13,fontWeight:600,display:"flex",alignItems:"center",gap:6}}>
                      {c.name}
                      {over&&<span style={S.badge("r")}>перерасход</span>}
                    </div>
                    <div style={{fontSize:10,color:C.teal,marginTop:2}}>{c.rec}</div>
                    <div style={{marginTop:5,paddingRight:8}}><div style={S.bar}><div style={S.fill(pUsed,over)}/></div></div>
                  </div>
                  {/* Рынок */}
                  <div style={{textAlign:"right",fontSize:11,color:C.gray}}>{c.market}</div>
                  {/* План — редактируемый */}
                  <div style={{textAlign:"right"}} onClick={e=>e.stopPropagation()}>
                    {editPlanId===c.id?(
                      <input type="number" min="0" autoFocus style={{...S.input,width:"100%",padding:"3px 7px",fontSize:13,textAlign:"right"}}
                        value={c.plan===0?"":c.plan} placeholder="0" onChange={e=>updatePlan(c.id,e.target.value)}
                        onFocus={e=>e.target.select()}
                        onBlur={()=>setEditPlanId(null)} onKeyDown={e=>e.key==="Enter"&&setEditPlanId(null)}/>
                    ):(
                      <span style={{fontSize:13,color:C.brown,fontWeight:700,cursor:"text",borderBottom:`1px dashed ${C.taupe}`}} onClick={()=>setEditPlanId(c.id)}>
                        {fmt(c.plan)} ₽
                      </span>
                    )}
                  </div>
                  {/* Факт */}
                  <div style={{textAlign:"right",fontSize:13,color:over?C.rose:C.teal,fontWeight:600}}>{fmt(c.actual)} ₽</div>
                  {/* Разница */}
                  <div style={{textAlign:"right",fontSize:13,fontWeight:700,color:diff>=0?C.teal:C.rose}}>{diff>=0?"+":""}{fmt(diff)} ₽</div>
                  {/* Actions */}
                  <div style={{display:"flex",gap:4,justifyContent:"flex-end"}} onClick={e=>e.stopPropagation()}>
                    <button style={{...S.btnSm,color:C.teal,borderColor:C.teal,padding:"3px 8px"}} onClick={()=>onGoToVendors(c.id)}>→</button>
                    <button style={{...S.btnSm,color:C.rose,borderColor:C.rose,padding:"3px 8px"}} onClick={()=>removeCat(c.id)}>✕</button>
                  </div>
                </div>

                {/* Expanded sub-items */}
                {c.expanded&&(
                  <div style={{background:C.lightGray,borderRadius:10,padding:"10px 14px",marginBottom:10,marginLeft:36}}>
                    <div style={{fontSize:10,color:C.gray,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:8}}>Детализация — введите фактические суммы</div>
                    {c.items.length>0?c.items.map(item=>(
                      <div key={item} style={{display:"flex",alignItems:"center",gap:10,padding:"5px 0",borderBottom:`1px solid ${C.sand}`}}>
                        <span style={{flex:1,fontSize:13}}>{item}</span>
                        <input type="number" min="0" style={{...S.input,width:130,padding:"4px 8px",fontSize:12,background:C.white}} placeholder="0"
                          value={c.itemActuals[item]||""} onFocus={e=>e.target.select()} onChange={e=>updateItemActual(c.id,item,e.target.value)}/>
                        <span style={{fontSize:11,color:C.gray,flexShrink:0}}>₽</span>
                      </div>
                    )):<p style={{color:C.gray,fontSize:12,margin:0}}>Нет подстатей</p>}
                    <div style={{display:"flex",justifyContent:"flex-end",marginTop:8,fontSize:12}}>
                      <span style={{color:C.gray}}>Итого факт: </span>
                      <strong style={{color:C.teal,marginLeft:6}}>{fmt(c.actual)} ₽</strong>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── TRACKER TAB ── */}
      {activeTab==="tracker"&&(
        <div style={{display:"flex",flexDirection:"column",gap:18}}>
          <div style={S.card}>
            <h3 style={S.h3}>Добавить расход</h3>
            <div style={{display:"flex",gap:10,flexWrap:"wrap",alignItems:"flex-end"}}>
              <div style={{flex:"1 1 150px"}}><label style={S.label}>Категория</label>
                <select style={S.select} value={newTx.catId} onChange={e=>setNewTx(p=>({...p,catId:e.target.value}))}>
                  {cats.map(c=><option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                </select>
              </div>
              <div style={{flex:"1 1 110px"}}><label style={S.label}>Сумма ₽</label>
                <input type="number" style={S.input} placeholder="50 000" value={newTx.amount} onChange={e=>setNewTx(p=>({...p,amount:e.target.value}))}/>
              </div>
              <div style={{flex:"2 1 180px"}}><label style={S.label}>Комментарий</label>
                <input style={S.input} placeholder="Аванс фотографу" value={newTx.note} onChange={e=>setNewTx(p=>({...p,note:e.target.value}))}/>
              </div>
              <button style={S.btn} onClick={addActual}>+ Добавить</button>
            </div>
          </div>

          <div style={S.card}>
            <h3 style={S.h3}>История</h3>
            {txHistory.length===0
              ?<p style={{color:C.gray,fontSize:13,textAlign:"center",padding:"20px 0"}}>Расходов пока нет</p>
              :txHistory.map((tx,i)=>{
                const cat=cats.find(c=>c.id===tx.catId);
                return (
                  <div key={tx.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 0",borderBottom:i<txHistory.length-1?`1px solid ${C.lightGray}`:"none"}}>
                    <div style={{display:"flex",gap:8,alignItems:"center"}}>
                      <span style={{fontSize:18}}>{cat?.icon||"✨"}</span>
                      <div><div style={{fontSize:13,fontWeight:600}}>{tx.note||cat?.name}</div><div style={{fontSize:11,color:C.gray}}>{cat?.name} · {tx.date}</div></div>
                    </div>
                    <span style={{fontSize:14,fontWeight:700,color:C.rose}}>−{fmt(tx.amount)} ₽</span>
                  </div>
                );
              })
            }
          </div>

          <div style={S.card}>
            <h3 style={S.h3}>План / Факт по категориям</h3>
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

// ─── VENDORS ─────────────────────────────────────────────────────────────────
function VendorsPage({ survey, initCat }) {
  const [activeCat, setActiveCat] = useState(initCat||"all");
  const [search, setSearch] = useState("");
  const [favs, setFavs] = useState(()=>LS.get("td_favs",[]));
  const [modal, setModal] = useState(null);
  const [contacted, setContacted] = useState(()=>LS.get("td_contacted",[]));
  const date = survey?.date;
  const catMap = Object.fromEntries(DEFAULT_CATS.map(c=>[c.id,c]));
  const avail = DEFAULT_CATS.filter(c=>VENDORS.some(v=>v.cat===c.id));

  useEffect(()=>LS.set("td_favs",favs),[favs]);
  useEffect(()=>LS.set("td_contacted",contacted),[contacted]);

  const filtered = VENDORS.filter(v=>{
    const catOk=activeCat==="all"||v.cat===activeCat;
    const searchOk=!search||v.name.toLowerCase().includes(search.toLowerCase());
    const freeOk=!date||!v.busy.includes(date);
    return catOk&&searchOk&&freeOk;
  });

  return (
    <div style={S.page}>
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
          return (
            <div key={v.id} style={{...S.card,display:"flex",flexDirection:"column",position:"relative"}}>
              <div style={{position:"absolute",top:12,right:12,cursor:"pointer",fontSize:18}} onClick={()=>setFavs(f=>f.includes(v.id)?f.filter(x=>x!==v.id):[...f,v.id])}>{favs.includes(v.id)?"❤️":"🤍"}</div>
              <div style={{display:"flex",gap:10,marginBottom:10}}>
                <div style={{width:42,height:42,borderRadius:10,background:C.tealBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{cat?.icon}</div>
                <div><div style={{fontWeight:700,fontSize:14}}>{v.name}</div><div style={{fontSize:11,color:C.gray}}>{cat?.name} · {v.city}</div></div>
              </div>
              <p style={{fontSize:12,color:C.gray,lineHeight:1.6,flex:1,margin:"0 0 10px"}}>{v.desc}</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:12}}>{v.tags.map(t=><span key={t} style={S.badge("")}>{t}</span>)}</div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:10,borderTop:`1px solid ${C.lightGray}`}}>
                <div><div style={{fontWeight:700,color:C.teal,fontSize:14}}>от {fmt(v.priceFrom)} ₽</div><div style={{fontSize:10,color:C.gray}}>⭐ {v.rating} · {v.reviews} отзывов</div></div>
                {contacted.includes(v.id)?<span style={S.badge("g")}>✓ Запрос отправлен</span>:<button style={S.btn} onClick={()=>setModal(v)}>Связаться</button>}
              </div>
            </div>
          );
        })}
        {filtered.length===0&&<div style={{...S.card,gridColumn:"1/-1",textAlign:"center",padding:40}}><div style={{fontSize:32,marginBottom:10}}>🔍</div><p style={{color:C.gray}}>Подрядчики не найдены</p></div>}
      </div>
      {modal&&(
        <div style={{position:"fixed",inset:0,background:"rgba(46,31,18,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:500,padding:20}}>
          <div style={{...S.card,maxWidth:460,width:"100%"}}>
            <h3 style={S.h2}>Запрос — {modal.name}</h3>
            <p style={{fontSize:13,color:C.gray,marginBottom:12}}>Подрядчик получит следующее ТЗ:</p>
            <div style={{background:C.lightGray,borderRadius:10,padding:14,fontSize:13,lineHeight:1.9,marginBottom:18}}>
              <b>Дата:</b> {survey?.date?new Date(survey.date).toLocaleDateString("ru"):survey?.season||"не указана"}<br/>
              {survey?.altDates&&<><b>Альт. даты:</b> {survey.altDates}<br/></>}
              <b>Город:</b> {survey?.city||"—"}<br/>
              <b>Гостей:</b> {survey?.guests||"—"}<br/>
              {survey?.outOfTown&&survey.outOfTown!=="Нет"&&<><b>Иногородние:</b> {survey.outOfTown}<br/></>}
              <b>Формат:</b> {FORMATS.find(f=>f.id===survey?.format)?.label||"—"}<br/>
              {survey?.concept?.feelings?.length>0&&<><b>Атмосфера:</b> {survey.concept.feelings.join(", ")}<br/></>}
              {survey?.concept?.program?.length>0&&<><b>Программа:</b> {survey.concept.program.join(", ")}<br/></>}
              {survey?.concept?.dontWant?.length>0&&<><b>Не хотят:</b> {survey.concept.dontWant.join(", ")}<br/></>}
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
function GuestsPage({ slug, guests, setGuests }) {
  const [form, setForm] = useState({name:"",side:"Жениха",rsvp:"Ожидает",diet:"Нет",kids:0,transfer:false});
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("Все");
  const RSVP = ["Придёт","Ожидает","Не придёт"];
  const RC = {"Придёт":"g","Ожидает":"","Не придёт":"r"};
  const stats = {total:guests.length,yes:guests.filter(g=>g.rsvp==="Придёт").length,wait:guests.filter(g=>g.rsvp==="Ожидает").length};
  const filtered = guests.filter(g=>(filter==="Все"||g.rsvp===filter)&&g.name.toLowerCase().includes(search.toLowerCase()));
  const add = () => {
    if (!form.name) return;
    setGuests(p=>[...p,{...form,id:Date.now()}]);
    setForm({name:"",side:"Жениха",rsvp:"Ожидает",diet:"Нет",kids:0,transfer:false});
  };
  return (
    <div style={S.page}>
      <h2 style={S.h1}>Список гостей</h2>
      <p style={S.sub}>Ссылка на сайт: <strong style={{color:C.teal}}>totday.app/{slug}</strong></p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:14,marginBottom:22}}>
        {[{l:"Всего",v:stats.total,c:C.brown},{l:"Подтверждено",v:stats.yes,c:C.teal},{l:"Ожидает",v:stats.wait,c:C.taupe}].map(s=>(
          <div key={s.l} style={{...S.card,textAlign:"center"}}>
            <div style={{fontSize:10,color:C.gray,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:4}}>{s.l}</div>
            <div style={{fontFamily:font,fontSize:26,color:s.c,fontWeight:700}}>{s.v}</div>
          </div>
        ))}
      </div>
      <div style={{...S.card,marginBottom:20}}>
        <h3 style={S.h3}>Добавить гостя</h3>
        <div style={{display:"flex",flexWrap:"wrap",gap:10,alignItems:"flex-end"}}>
          <div style={{flex:"2 1 160px"}}><label style={S.label}>Имя</label><input style={S.input} value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="Имя Фамилия"/></div>
          <div style={{flex:"1 1 110px"}}><label style={S.label}>Сторона</label><select style={S.select} value={form.side} onChange={e=>setForm(p=>({...p,side:e.target.value}))}>{["Жениха","Невесты","Общий"].map(s=><option key={s}>{s}</option>)}</select></div>
          <div style={{flex:"1 1 110px"}}><label style={S.label}>RSVP</label><select style={S.select} value={form.rsvp} onChange={e=>setForm(p=>({...p,rsvp:e.target.value}))}>{RSVP.map(s=><option key={s}>{s}</option>)}</select></div>
          <div style={{flex:"1 1 110px"}}><label style={S.label}>Питание</label><select style={S.select} value={form.diet} onChange={e=>setForm(p=>({...p,diet:e.target.value}))}>{["Нет","Вегетарианец","Веган","Без глютена","Халяль"].map(s=><option key={s}>{s}</option>)}</select></div>
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
            <thead><tr style={{borderBottom:`2px solid ${C.sand}`}}>
              {["Имя","Сторона","RSVP","Питание","Дети","Трансфер"].map(h=><th key={h} style={{padding:"7px 10px",textAlign:"left",fontSize:10,color:C.gray,letterSpacing:"0.08em",textTransform:"uppercase",fontWeight:700}}>{h}</th>)}
            </tr></thead>
            <tbody>{filtered.map(g=>(
              <tr key={g.id} style={{borderBottom:`1px solid ${C.lightGray}`}}>
                <td style={{padding:"10px",fontWeight:600}}>{g.name}</td>
                <td style={{padding:"10px",color:C.gray}}>{g.side}</td>
                <td style={{padding:"10px"}}><span style={S.badge(RC[g.rsvp])}>{g.rsvp}</span></td>
                <td style={{padding:"10px",color:C.gray}}>{g.diet}</td>
                <td style={{padding:"10px",color:C.gray}}>{g.kids||"—"}</td>
                <td style={{padding:"10px"}}>{g.transfer?"✓":"—"}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── INVITE ───────────────────────────────────────────────────────────────────
function InvitePage({ survey, user, inviteData, setInviteData }) {
  const [copied, setCopied] = useState(false);
  const {tmplId="classic", content={}} = inviteData||{};
  const defaultContent = {title:`Свадьба ${user?.name2||"Жениха"} & ${user?.name1||"Невесты"}`,venue:"Название площадки",address:"Адрес",text:"Мы рады пригласить вас разделить с нами этот особенный день!",dresscode:"Праздничный дресс-код",wishes:"Цветы и тёплые слова — лучший подарок",program:"17:00 Сбор гостей\n18:00 Выездная церемония\n19:00 Банкет"};
  const c = {...defaultContent,...content};
  const t = INVITE_TEMPLATES.find(x=>x.id===tmplId)||INVITE_TEMPLATES[0];
  const slug = makeSlug(user);
  const setTmpl = (id) => setInviteData(p=>({...(p||{}),tmplId:id}));
  const upd = k => e => setInviteData(p=>({...(p||{}),content:{...c,[k]:e.target.value}}));

  const Preview = () => (
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

  return (
    <div style={S.page}>
      <h2 style={S.h1}>Сайт гостей</h2>
      <p style={S.sub}>Создайте персональный сайт — гости подтвердят участие онлайн</p>
      <div style={{...S.card,marginBottom:20}}>
        <h3 style={S.h3}>Шаблон</h3>
        <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
          {INVITE_TEMPLATES.map(t2=>(
            <div key={t2.id} onClick={()=>setTmpl(t2.id)} style={{cursor:"pointer",textAlign:"center"}}>
              <div style={{width:70,height:44,borderRadius:8,background:t2.bg,border:`3px solid ${tmplId===t2.id?t2.accent:C.sand}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <span style={{color:t2.accent,fontFamily:font,fontSize:13}}>Aa</span>
              </div>
              <div style={{fontSize:11,color:tmplId===t2.id?C.teal:C.gray,marginTop:3,fontWeight:tmplId===t2.id?700:400}}>{t2.name}</div>
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
              <button style={{...S.btn,padding:"6px 14px",fontSize:11}} onClick={()=>{setCopied(true);setTimeout(()=>setCopied(false),2000);}}>
                {copied?"✓ Скопировано":"Копировать"}
              </button>
            </div>
          </div>
          <Preview/>
        </div>
      </div>
    </div>
  );
}

// ─── COUNTDOWN TIMER ─────────────────────────────────────────────────────────
function CountdownTimer({ date }) {
  const calc = useCallback(() => {
    if (!date) return null;
    const diff = new Date(date) - new Date();
    if (diff <= 0) return { days:0, hours:0, mins:0, secs:0, passed:true };
    return {
      days: Math.floor(diff/86400000),
      hours: Math.floor(diff%86400000/3600000),
      mins: Math.floor(diff%3600000/60000),
      secs: Math.floor(diff%60000/1000),
      passed:false,
    };
  },[date]);

  const [t, setT] = useState(calc);
  useEffect(()=>{
    setT(calc());
    const id = setInterval(()=>setT(calc()), 1000);
    return ()=>clearInterval(id);
  },[calc]);

  if (!t) return (
    <div style={{...S.card, textAlign:"center", background:`linear-gradient(135deg,${C.tealBg},${C.white})`}}>
      <div style={{fontSize:13, color:C.gray}}>Укажите дату свадьбы в «Быстром расчёте», чтобы запустить обратный отсчёт</div>
    </div>
  );
  if (t.passed) return (
    <div style={{...S.card, textAlign:"center", background:`linear-gradient(135deg,${C.tealBg},${C.white})`}}>
      <div style={{fontFamily:font, fontSize:22, color:C.teal, fontWeight:700}}>🎉 Поздравляем — ваш день настал!</div>
    </div>
  );

  const units = [["дней",t.days],["часов",t.hours],["минут",t.mins],["секунд",t.secs]];
  return (
    <div style={{...S.card, background:`linear-gradient(135deg,${C.brown},${C.taupe})`, color:C.white, textAlign:"center", border:"none"}}>
      <div style={{fontSize:11, letterSpacing:"0.15em", textTransform:"uppercase", opacity:0.85, marginBottom:12}}>До вашей свадьбы осталось</div>
      <div style={{display:"flex", justifyContent:"center", gap:0}}>
        {units.map(([label,val],i)=>(
          <div key={label} style={{display:"flex", alignItems:"center"}}>
            <div style={{minWidth:64}}>
              <div style={{fontFamily:font, fontSize:38, fontWeight:700, lineHeight:1}}>{String(val).padStart(2,"0")}</div>
              <div style={{fontSize:10, letterSpacing:"0.1em", textTransform:"uppercase", opacity:0.8, marginTop:4}}>{label}</div>
            </div>
            {i<units.length-1 && <div style={{fontSize:30, fontWeight:300, opacity:0.5, margin:"0 4px", alignSelf:"flex-start"}}>:</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ user, survey, cats, guests, onNav }) {
  const total = Number(survey?.budget)||1500000;
  const totalActual = cats.reduce((s,c)=>s+c.actual,0);
  const tasks = [
    {done:!!survey,            text:"Пройти быстрый расчёт"},
    {done:!!survey?.concept,   text:"Заполнить концепцию"},
    {done:cats.some(c=>c.actual>0), text:"Добавить первый расход"},
    {done:guests.length>3,     text:"Внести список гостей"},
    {done:false,               text:"Создать сайт гостей"},
    {done:false,               text:"Выбрать подрядчиков"},
  ];
  return (
    <div style={S.page}>
      <h2 style={S.h1}>Добро пожаловать, {user?.name1} & {user?.name2} 🕊</h2>
      <p style={S.sub}>Всё для вашей свадьбы в одном месте · totday.app</p>

      {/* Live countdown */}
      <div style={{marginBottom:22}}><CountdownTimer date={survey?.date}/></div>

      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(155px,1fr))",gap:14,marginBottom:22}}>
        {[
          {l:"Бюджет",v:`${fmt(total)} ₽`,icon:"💰",c:C.teal},
          {l:"Потрачено",v:`${fmt(totalActual)} ₽`,icon:"💳",c:C.rose},
          {l:"Остаток",v:`${fmt(total-totalActual)} ₽`,icon:"✅",c:C.teal},
          {l:"Гостей",v:guests.length||survey?.guests||"—",icon:"👥",c:C.taupe},
        ].map(s=>(
          <div key={s.l} style={{...S.card,textAlign:"center"}}>
            <div style={{fontSize:22,marginBottom:5}}>{s.icon}</div>
            <div style={{fontSize:10,color:C.gray,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:3}}>{s.l}</div>
            <div style={{fontFamily:font,fontSize:17,color:s.c,fontWeight:700}}>{s.v}</div>
          </div>
        ))}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,marginBottom:20}}>
        <div style={S.card}>
          <h3 style={S.h3}>Бюджет</h3>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:C.gray,marginBottom:5}}><span>Потрачено {fmt(totalActual)} ₽</span><span>{total>0?Math.round(totalActual/total*100):0}%</span></div>
          <div style={S.bar}><div style={S.fill(total>0?totalActual/total*100:0)}/></div>
          <div style={{fontSize:12,color:C.gray,marginTop:8}}>Остаток: <strong style={{color:C.teal}}>{fmt(total-totalActual)} ₽</strong></div>
          <button style={{...S.btnO,marginTop:12,fontSize:12}} onClick={()=>onNav("budget")}>Открыть бюджет →</button>
        </div>
        <div style={S.card}>
          <h3 style={S.h3}>Чеклист</h3>
          {tasks.map((t,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:8,marginBottom:7}}>
              <div style={{width:16,height:16,borderRadius:4,border:`2px solid ${t.done?C.teal:C.sand}`,background:t.done?C.teal:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                {t.done&&<span style={{color:"white",fontSize:9}}>✓</span>}
              </div>
              <span style={{fontSize:12,color:t.done?C.gray:C.dark,textDecoration:t.done?"line-through":"none"}}>{t.text}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(185px,1fr))",gap:14}}>
        {[
          {tab:"survey1",icon:"📝",title:"Быстрый расчёт",    desc:"Базовые данные и бюджет"},
          {tab:"survey2",icon:"🎨",title:"Концепция",         desc:"Стиль и атмосфера"},
          {tab:"budget", icon:"💰",title:"Бюджет",            desc:"Смета, категории, трекер"},
          {tab:"vendors",icon:"🤝",title:"Подрядчики",        desc:"Площадки, фото, ведущие"},
          {tab:"guests", icon:"👥",title:"Гости",             desc:"RSVP и рассадка"},
          {tab:"invite", icon:"✉️",title:"Сайт гостей",      desc:"Создать и отправить"},
        ].map(n=>(
          <div key={n.tab} style={{...S.card,cursor:"pointer"}} onClick={()=>onNav(n.tab)}>
            <div style={{fontSize:26,marginBottom:6}}>{n.icon}</div>
            <div style={{fontWeight:700,fontSize:14,marginBottom:3}}>{n.title}</div>
            <div style={{fontSize:11,color:C.gray}}>{n.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── APP SHELL ────────────────────────────────────────────────────────────────
const TABS = [
  {id:"dashboard",label:"Главная"},
  {id:"survey1",  label:"Быстрый расчёт"},
  {id:"survey2",  label:"Концепция"},
  {id:"budget",   label:"Бюджет"},
  {id:"vendors",  label:"Подрядчики"},
  {id:"guests",   label:"Гости"},
  {id:"invite",   label:"Сайт гостей"},
];

export default function App() {
  const [user,       setUser]       = useState(()=>LS.get("td_user",null));
  const [tab,        setTab]        = useState("dashboard");
  const [survey,     setSurvey]     = useState(()=>LS.get("td_survey",null));
  const [concept,    setConcept]    = useState(()=>LS.get("td_concept",null));
  const [cats,       setCats]       = useState(()=>LS.get("td_cats",makeCatsFromBudget(1500000)));
  const [guests,     setGuests]     = useState(()=>LS.get("td_guests",[
    {id:1,name:"Анна Петрова",   side:"Невесты",rsvp:"Придёт",   diet:"Нет",         kids:0,transfer:false},
    {id:2,name:"Михаил Соколов", side:"Жениха", rsvp:"Ожидает",  diet:"Вегетарианец",kids:1,transfer:true},
    {id:3,name:"Елена Смирнова", side:"Невесты",rsvp:"Не придёт",diet:"Нет",         kids:0,transfer:false},
  ]));
  const [inviteData, setInviteData] = useState(()=>LS.get("td_invite",null));
  const [vendorCat,  setVendorCat]  = useState(null);
  const [showScenarios, setShowScenarios] = useState(false);

  // Persist to localStorage on every change
  useEffect(()=>{ if(user) LS.set("td_user",user); },[user]);
  useEffect(()=>{ LS.set("td_survey",survey); },[survey]);
  useEffect(()=>{ LS.set("td_concept",concept); },[concept]);
  useEffect(()=>{ LS.set("td_cats",cats); },[cats]);
  useEffect(()=>{ LS.set("td_guests",guests); },[guests]);
  useEffect(()=>{ LS.set("td_invite",inviteData); },[inviteData]);

  const handleSurvey1Complete = useCallback((d) => {
    setSurvey(d);
    setShowScenarios(true);
    setTab("scenarios");
  },[]);

  const handleScenarioChosen = useCallback((scenario) => {
    const totalBudget = scenario.total;
    setSurvey(prev => ({...prev, budget: totalBudget, chosenScenario: scenario.tier}));
    setCats(makeCatsFromBudget(totalBudget));
    setShowScenarios(false);
    setTab("budget");
  },[]);

  const handleConcept = useCallback((d) => {
    setConcept(d);
    setSurvey(prev => prev?{...prev,concept:d}:null);
    setTab("budget");
  },[]);

  const goVendors = useCallback((catId) => { setVendorCat(catId); setTab("vendors"); },[]);

  const logout = () => {
    ["td_user","td_survey","td_concept","td_cats","td_guests","td_invite","td_txHistory","td_favs","td_contacted"].forEach(k=>LS.del(k));
    setUser(null);
  };

  const fullSurvey = survey?{...survey,concept}:null;

  if (!user) return <AuthPage onLogin={u=>setUser(u)}/>;

  return (
    <div style={S.app}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Lato:wght@400;700&display=swap" rel="stylesheet"/>
      <nav style={S.nav}>
        <div style={S.logo}>🕊 TotDay</div>
        <div style={{display:"flex",gap:2,flexWrap:"wrap"}}>
          {TABS.filter(t=>t.id!=="scenarios").map(t=>(
            <button key={t.id} style={S.tab(tab===t.id)} onClick={()=>setTab(t.id)}>{t.label}</button>
          ))}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          {survey?.date&&<span style={{fontSize:11,color:C.teal,fontWeight:700}}>📅 {new Date(survey.date).toLocaleDateString("ru",{day:"numeric",month:"short"})}</span>}
          <div style={{width:30,height:30,borderRadius:"50%",background:C.tealBg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,cursor:"pointer",fontWeight:700,color:C.teal}} onClick={logout} title="Выйти">
            {user.name1?.[0]||"?"}
          </div>
        </div>
      </nav>

      {tab==="dashboard" && <Dashboard user={user} survey={fullSurvey} cats={cats} guests={guests} onNav={setTab}/>}
      {tab==="survey1"   && <Survey1Page onComplete={handleSurvey1Complete} initial={survey}/>}
      {tab==="scenarios" && survey && <ScenariosPage survey={survey} onChoose={handleScenarioChosen}/>}
      {tab==="survey2"   && <Survey2Page onComplete={handleConcept} initial={concept}/>}
      {tab==="budget"    && <BudgetPage survey={fullSurvey||{city:"Москва",guests:80,budget:1500000,format:"medium"}} cats={cats} setCats={setCats} onGoToVendors={goVendors}/>}
      {tab==="vendors"   && <VendorsPage survey={fullSurvey} initCat={vendorCat}/>}
      {tab==="guests"    && <GuestsPage slug={makeSlug(user)} guests={guests} setGuests={setGuests}/>}
      {tab==="invite"    && <InvitePage survey={fullSurvey} user={user} inviteData={inviteData} setInviteData={setInviteData}/>}
    </div>
  );
}
