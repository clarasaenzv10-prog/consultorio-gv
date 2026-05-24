// v2026-05-23-DESC-V2
import React, { useState, useEffect, useRef, createContext, useContext } from "react";
import { listenCol, saveDoc, delDoc, seedIfEmpty } from "./firebase.js";

// ─── Colores (hardcoded, no concatenation in JSX) ──────────────
const br = "#4BA3C3";   // brand teal
const dk = "#2E86AB";   // brand dark
const lt = "#EBF6FA";   // brand light
const bd = "#C9E4EF";   // border
const bg = "#F0F8FB";   // background
const wh = "#FFFFFF";   // white
const tx = "#1C3A4A";   // text
const mu = "#6B97AA";   // muted
const ok = "#2D8A5E";   // success
const ob = "#EAF7F1";   // success bg
const er = "#C0392B";   // error
const eb = "#FDECEA";   // error bg

const PCOLS = ["#4BA3C3","#2E86AB","#0891B2","#7C3AED","#059669","#0284C7",
               "#EA580C","#9333EA","#2D8A5E","#1D6FA3","#B45309","#6D28D9","#065F46","#1E40AF"];

// ─── Datos ────────────────────────────────────────────────────
const DIAS = ["","Lunes","Martes","Miercoles","Jueves","Viernes","Sabado","Domingo"];
const DIASC = ["Dom","Lun","Mar","Mie","Jue","Vie","Sab"];
const MESES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
const ANALS = ["Cognitivo Conductual (TCC)","Psicoanalitico / Psicodinamico","Sistemico / Familiar","Humanista / Gestalt","EMDR","Mindfulness / ACT","Integrativo","Otro"];
const CONS = [
  {id:"C1",sede:"VL",sn:"Vicente Lopez / Junin"},
  {id:"C2",sede:"VL",sn:"Vicente Lopez / Junin"},
  {id:"C3",sede:"VL",sn:"Vicente Lopez / Junin"},
  {id:"C4",sede:"UY",sn:"Uruguay / Cordoba"},
  {id:"C5",sede:"UY",sn:"Uruguay / Cordoba"},
];
const PD = {man:3800,tar:4300,noc:4600,m1:18600,m2:14000,m3:12500,dia:38000,sM:14000,sT:11000};

const HBASE = [
  {psico:"Magda",consultorio:"C5",diaSemana:1,inicio:"10:00",fin:"16:00",sede:"UY"},
  {psico:"Agus Mohr",consultorio:"C1",diaSemana:1,inicio:"14:00",fin:"19:00",sede:"VL"},
  {psico:"Marce",consultorio:"C2",diaSemana:1,inicio:"15:00",fin:"18:00",sede:"VL"},
  {psico:"Belen",consultorio:"C4",diaSemana:1,inicio:"15:00",fin:"20:00",sede:"UY"},
  {psico:"Bernadette",consultorio:"C5",diaSemana:1,inicio:"16:00",fin:"20:00",sede:"UY"},
  {psico:"Magda",consultorio:"C5",diaSemana:2,inicio:"08:00",fin:"16:00",sede:"UY"},
  {psico:"Bernadette",consultorio:"C2",diaSemana:2,inicio:"08:00",fin:"14:00",sede:"VL"},
  {psico:"Carolina",consultorio:"C3",diaSemana:2,inicio:"08:30",fin:"11:30",sede:"VL"},
  {psico:"Delfi Mohr",consultorio:"C1",diaSemana:2,inicio:"10:00",fin:"12:00",sede:"VL"},
  {psico:"Delfi Mohr",consultorio:"C1",diaSemana:2,inicio:"15:00",fin:"19:00",sede:"VL"},
  {psico:"Belen",consultorio:"C4",diaSemana:2,inicio:"15:00",fin:"20:00",sede:"UY"},
  {psico:"Euge",consultorio:"C2",diaSemana:2,inicio:"17:00",fin:"20:00",sede:"VL"},
  {psico:"Sofi",consultorio:"C1",diaSemana:2,inicio:"19:00",fin:"20:30",sede:"VL"},
  {psico:"Magda",consultorio:"C5",diaSemana:3,inicio:"08:00",fin:"17:00",sede:"UY"},
  {psico:"Carolina",consultorio:"C3",diaSemana:3,inicio:"08:30",fin:"11:30",sede:"VL"},
  {psico:"Dolores Torreira",consultorio:"C2",diaSemana:3,inicio:"10:00",fin:"20:00",sede:"VL"},
  {psico:"Agus Mohr",consultorio:"C1",diaSemana:3,inicio:"14:00",fin:"19:00",sede:"VL"},
  {psico:"Belen",consultorio:"C4",diaSemana:3,inicio:"15:00",fin:"20:00",sede:"UY"},
  {psico:"Sofi",consultorio:"C3",diaSemana:3,inicio:"17:30",fin:"20:30",sede:"VL"},
  {psico:"Bernadette",consultorio:"C5",diaSemana:3,inicio:"18:00",fin:"20:00",sede:"UY"},
  {psico:"Magda",consultorio:"C5",diaSemana:4,inicio:"08:00",fin:"16:00",sede:"UY"},
  {psico:"Jose Cesareo",consultorio:"C2",diaSemana:4,inicio:"08:00",fin:"21:00",sede:"VL"},
  {psico:"Carolina",consultorio:"C3",diaSemana:4,inicio:"08:30",fin:"11:30",sede:"VL"},
  {psico:"Bernadette",consultorio:"C4",diaSemana:4,inicio:"09:00",fin:"11:00",sede:"UY"},
  {psico:"Bernadette",consultorio:"C4",diaSemana:4,inicio:"13:00",fin:"14:00",sede:"UY"},
  {psico:"Agus Mohr",consultorio:"C1",diaSemana:4,inicio:"14:00",fin:"18:00",sede:"VL"},
  {psico:"Belen",consultorio:"C4",diaSemana:4,inicio:"15:00",fin:"19:00",sede:"UY"},
  {psico:"Sofi",consultorio:"C3",diaSemana:4,inicio:"16:30",fin:"17:30",sede:"VL"},
  {psico:"Delfi Mohr",consultorio:"C3",diaSemana:4,inicio:"17:30",fin:"20:00",sede:"VL"},
  {psico:"Sofi",consultorio:"C1",diaSemana:4,inicio:"18:00",fin:"20:00",sede:"VL"},
  {psico:"Agus Mohr",consultorio:"C1",diaSemana:5,inicio:"09:00",fin:"12:00",sede:"VL"},
  {psico:"Magda",consultorio:"C5",diaSemana:5,inicio:"10:00",fin:"17:00",sede:"UY"},
  {psico:"Delfi Mohr",consultorio:"C1",diaSemana:5,inicio:"13:00",fin:"14:00",sede:"VL"},
  {psico:"Delfi Mohr",consultorio:"C2",diaSemana:5,inicio:"14:00",fin:"19:00",sede:"VL"},
  {psico:"Bernadette",consultorio:"C5",diaSemana:5,inicio:"17:00",fin:"19:00",sede:"UY"},
];

const PBASE = [
  {id:"p1",nombre:"Magda",wa:"",analisis:[],poblacion:[],disponible:true,fijas:true,descuento:0,nota:"",email:"",pass:"psico123"},
  {id:"p2",nombre:"Belen",wa:"",analisis:[],poblacion:[],disponible:true,fijas:true,descuento:0,nota:"",email:"",pass:"psico123"},
  {id:"p3",nombre:"Bernadette",wa:"",analisis:[],poblacion:[],disponible:true,fijas:true,descuento:0,nota:"",email:"",pass:"psico123"},
  {id:"p4",nombre:"Carolina",wa:"",analisis:[],poblacion:[],disponible:true,fijas:true,descuento:0,nota:"",email:"",pass:"psico123"},
  {id:"p5",nombre:"Agus Mohr",wa:"",analisis:[],poblacion:[],disponible:true,fijas:true,descuento:0,nota:"",email:"",pass:"psico123"},
  {id:"p6",nombre:"Delfi Mohr",wa:"",analisis:[],poblacion:[],disponible:true,fijas:true,descuento:0,nota:"",email:"",pass:"psico123"},
  {id:"p7",nombre:"Sofi",wa:"",analisis:[],poblacion:[],disponible:true,fijas:true,descuento:0,nota:"",email:"",pass:"psico123"},
  {id:"p8",nombre:"Marce",wa:"",analisis:[],poblacion:[],disponible:true,fijas:true,descuento:0,nota:"",email:"",pass:"psico123"},
  {id:"p9",nombre:"Angeles",wa:"",analisis:[],poblacion:[],disponible:true,fijas:false,descuento:0,nota:"",email:"",pass:"psico123"},
  {id:"p10",nombre:"Euge",wa:"",analisis:[],poblacion:[],disponible:true,fijas:true,descuento:0,nota:"",email:"",pass:"psico123"},
  {id:"p11",nombre:"Dolores Torreira",wa:"",analisis:[],poblacion:[],disponible:true,fijas:true,descuento:0,nota:"",email:"",pass:"psico123"},
  {id:"p12",nombre:"Jose Cesareo",wa:"",analisis:[],poblacion:[],disponible:true,fijas:true,descuento:0,nota:"",email:"",pass:"psico123"},
  {id:"p14",nombre:"Milagros",wa:"",analisis:[],poblacion:[],disponible:true,fijas:false,descuento:0,nota:"",email:"",pass:"psico123"},
];

// ─── Helpers ──────────────────────────────────────────────────
// Local date string (avoids UTC timezone shift)
function localDateStr(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth()+1).padStart(2,"0");
  const d = String(date.getDate()).padStart(2,"0");
  return y+"-"+m+"-"+d;
}
// Parse date string as LOCAL date (not UTC)
function parseLocalDate(str) {
  const parts = str.split("-");
  return new Date(Number(parts[0]), Number(parts[1])-1, Number(parts[2]));
}

function toMin(t) { const [h,m] = t.split(":").map(Number); return h*60+m; }
function calcHrs(a,b) { return (toMin(b)-toMin(a))/60; }
function ars(n) { return new Intl.NumberFormat("es-AR",{style:"currency",currency:"ARS",minimumFractionDigits:0}).format(n); }

function calcPrecio(ini,fin,P) {
  const p = P || PD;
  const s = toMin(ini), e = toMin(fin);
  const M1s=480,M1e=840,M2s=840,M2e=1080,M3s=1080,M3e=1260;
  // Module is "used" only when the schedule FULLY covers it
  const useM1 = s<=M1s && e>=M1e;
  const useM2 = s<=M2s && e>=M2e;
  const useM3 = s<=M3s && e>=M3e;
  // Exact full matches
  if(useM1&&useM2&&useM3) return {sub:p.dia, ley:"Dia completo (08-21hs)", tipo:"mod"};
  if(useM1&&useM2) return {sub:p.m1+p.m2, ley:"Mod. Manana + Tarde (08-18hs)", tipo:"mod"};
  if(useM2&&useM3) return {sub:p.m2+p.m3, ley:"Mod. Tarde + Noche (14-21hs)", tipo:"mod"};
  if(useM1&&e===M1e) return {sub:p.m1, ley:"Mod. Manana (08-14hs)", tipo:"mod"};
  if(useM2&&s===M2s&&e===M2e) return {sub:p.m2, ley:"Mod. Tarde (14-18hs)", tipo:"mod"};
  if(useM3&&s===M3s) return {sub:p.m3, ley:"Mod. Noche (18-21hs)", tipo:"mod"};
  // Mixed: module price where fully covered, hourly for partial
  let tot=0; const pts=[];
  // Pre-morning
  if(s<M1s){const hs=(Math.min(e,M1s)-s)/60;if(hs>0){tot+=hs*p.man;pts.push(hs.toFixed(1)+"hs manana x "+ars(p.man)+"/hs");}}
  // Morning
  if(useM1){tot+=p.m1;pts.push("Mod. Manana 08-14hs ("+ars(p.m1)+")");}
  else{const i1=Math.max(s,M1s),f1=Math.min(e,M1e);if(f1>i1){const hs=(f1-i1)/60;tot+=hs*p.man;pts.push(hs.toFixed(1)+"hs manana x "+ars(p.man)+"/hs");}}
  // Afternoon
  if(useM2){tot+=p.m2;pts.push("Mod. Tarde 14-18hs ("+ars(p.m2)+")");}
  else{const i2=Math.max(s,M2s),f2=Math.min(e,M2e);if(f2>i2){const hs=(f2-i2)/60;tot+=hs*p.tar;pts.push(hs.toFixed(1)+"hs tarde x "+ars(p.tar)+"/hs");}}
  // Night
  if(useM3){tot+=p.m3;pts.push("Mod. Noche 18-21hs ("+ars(p.m3)+")");}
  else{const i3=Math.max(s,M3s),f3=Math.min(e,M3e);if(f3>i3){const hs=(f3-i3)/60;tot+=hs*p.noc;pts.push(hs.toFixed(1)+"hs noche x "+ars(p.noc)+"/hs");}}
  return {sub:tot, ley:null, tipo:"hora", des:pts.join(" + ")};
}

function wkDates(date) {
  // Use explicit year/month/day to avoid any timezone ambiguity
  const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const day = d.getDay();
  const diff = d.getDate() - day + (day===0 ? -6 : 1);
  const monDate = new Date(d.getFullYear(), d.getMonth(), diff);
  return Array.from({length:7}, function(_,i) {
    return new Date(monDate.getFullYear(), monDate.getMonth(), monDate.getDate()+i);
  });
}
function mesFechas(mes,anio,dia) {
  const js=dia===7?0:dia, res=[], d=new Date(anio,mes,1);
  while(d.getMonth()===mes){if(d.getDay()===js)res.push(new Date(d).toISOString().split("T")[0]);d.setDate(d.getDate()+1);}
  return res;
}

// ─── Context ──────────────────────────────────────────────────
const MobCtx = createContext(false);
function useMob() { return useContext(MobCtx); }

function AppRoot({children}) {
  const [isMob, setIsMob] = useState(false);
  const ref = useRef(null);
  useEffect(function() {
    if(!ref.current) return;
    const obs = new ResizeObserver(function(entries) {
      const w = entries[0] && entries[0].contentRect ? entries[0].contentRect.width : 0;
      setIsMob(w < 680);
    });
    obs.observe(ref.current);
    return function() { obs.disconnect(); };
  }, []);
  return (
    <MobCtx.Provider value={isMob}>
      <div ref={ref} style={{width:"100%",height:"100vh"}}>
        {children}
      </div>
    </MobCtx.Provider>
  );
}

// ─── Style helpers (all lowercase, no uppercase vars in JSX) ──
// Link opener that works inside iframes
function openLink(url) {
  var a = document.createElement("a");
  a.href = url;
  a.target = "_blank";
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  setTimeout(function(){ document.body.removeChild(a); }, 100);
}

function btn(bg2,col) { return {background:bg2,color:col,border:"none",borderRadius:10,padding:"9px 16px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}; }
function btnO(bg2,col,brd) { return {background:bg2,color:col,border:brd,borderRadius:10,padding:"9px 16px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}; }
function bge(bg2,col) { return {fontSize:11,padding:"3px 10px",borderRadius:20,fontWeight:600,display:"inline-block",background:bg2,color:col}; }

const sInp = {background:wh,border:"1.5px solid #C9E4EF",borderRadius:8,padding:"9px 12px",color:tx,fontSize:14,outline:"none",width:"100%",boxSizing:"border-box",fontFamily:"inherit"};
const sLbl = {color:mu,fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:.5,display:"block",marginBottom:4};
const sCard = {display:"flex",alignItems:"center",gap:14,background:wh,borderRadius:12,padding:"14px 16px",marginBottom:10,border:"1.5px solid #C9E4EF"};
const sPanel = {background:wh,borderRadius:14,padding:20,border:"1.5px solid #C9E4EF",boxShadow:"0 2px 10px rgba(75,163,195,.06)"};
const sOverlay = {position:"fixed",inset:0,background:"rgba(28,58,74,.45)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100};
const sModal = {background:wh,borderRadius:18,width:"min(500px,95vw)",border:"1.5px solid #C9E4EF",boxShadow:"0 24px 60px rgba(75,163,195,.18)",maxHeight:"90vh",overflowY:"auto"};
const sModH = {display:"flex",justifyContent:"space-between",alignItems:"center",padding:"18px 22px",borderBottom:"1px solid #EBF6FA"};
const sXBtn = {background:bg,border:"none",color:mu,fontSize:18,cursor:"pointer",borderRadius:8,width:30,height:30,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit"};

function Logo({size,col}) {
  const s=size||36, c=col||"#fff";
  return (
    <svg viewBox="0 0 100 100" width={s} height={s} fill="none">
      {/* Outer arc - opens to right, dashed */}
      <path d="M 71 82 A 38 38 0 1 1 71 18" stroke={c} strokeWidth="5.5" strokeLinecap="round" strokeDasharray="12 5.5" fill="none"/>
      {/* Second arc */}
      <path d="M 65 75 A 29 29 0 1 1 65 25" stroke={c} strokeWidth="5" strokeLinecap="round" strokeDasharray="10 5" fill="none"/>
      {/* Third arc */}
      <path d="M 60 69 A 21 21 0 1 1 60 31" stroke={c} strokeWidth="4.5" strokeLinecap="round" strokeDasharray="8.5 4.5" fill="none"/>
      {/* Inner G curve */}
      <path d="M 56 64 A 15 15 0 1 1 56 36" stroke={c} strokeWidth="4" strokeLinecap="round" strokeDasharray="7 4" fill="none"/>
      {/* G crossbar extending right */}
      <path d="M 50 50 L 62 50" stroke={c} strokeWidth="4" strokeLinecap="round"/>
      {/* Center dot */}
      <circle cx="50" cy="50" r="3" fill={c}/>
      {/* Accent dot upper right */}
      <circle cx="71" cy="22" r="2.5" fill={c}/>
    </svg>
  );
}

// ─── App ──────────────────────────────────────────────────────
export default function App() {
  const [view,setView] = useState("login");
  const [role,setRole] = useState(null);
  const [user,setUser] = useState(null);
  const [tab,setTab] = useState("calendario");
  const [perfilSel,setPerfilSel] = useState(null);
  const [wk,setWk] = useState(new Date());
  const [fSede,setFSede] = useState("todas");
  const [fCons,setFCons] = useState("todos");
  const [fPsico,setFPsico] = useState("todas");
  const [mod,setMod] = useState(null);
  const [notif,setNotif] = useState(null);
  const [psicos,setPsicosLocal] = useState(PBASE);
  const [reservas,setReservasLocal] = useState([]);
  const [bloques,setBloquesLocal] = useState([]);
  const [horarios,setHorariosLocal] = useState(HBASE.map(function(h,i){return Object.assign({},h,{id:"h"+i});}));
  const [anuncios,setAnunciosLocal] = useState([]);
  const [solHor,setSolHorLocal] = useState([]);
  const [tabP,setTabPLocal] = useState([{id:"tp1",label:"Tabla mar-26",vigencia:"2026-03-01",p:Object.assign({},PD)}]);
  const [config,setConfigLocal] = useState({
    invPass:"invitada123",
    transferencia:{alias:"",cbu:"",banco:"",titular:""},
    flyer:"",
    fotos:{C1:[],C2:[],C3:[],C4:[],C5:[]}
  });
  const [dbReady,setDbReady] = useState(false);

  useEffect(function() {
    const HORARIOS_WITH_IDS = HBASE.map(function(h,i){return Object.assign({},h,{id:"h"+i});});
    const TAB_INI = [{id:"tp1",label:"Tabla mar-26",vigencia:"2026-03-01",p:Object.assign({},PD)}];
    Promise.all([
      seedIfEmpty("psicos", PBASE),
      seedIfEmpty("horarios", HORARIOS_WITH_IDS),
      seedIfEmpty("tabP", TAB_INI),
    ]).then(function(){ setDbReady(true); });
    const unsubs = [
      listenCol("psicos", function(d){ setPsicosLocal(d); }),
      listenCol("horarios", function(d){ setHorariosLocal(d); }),
      listenCol("reservas", function(d){ setReservasLocal(d); }),
      listenCol("bloques", function(d){ setBloquesLocal(d); }),
      listenCol("anuncios", function(d){ setAnunciosLocal(d.sort(function(a,b){return b.fecha.localeCompare(a.fecha);})); }),
      listenCol("solHor", function(d){ setSolHorLocal(d); }),
      listenCol("tabP", function(d){ setTabPLocal(d.sort(function(a,b){return a.vigencia.localeCompare(b.vigencia);})); }),
      listenCol("config", function(d){
        if(d&&d.length>0) {
          const def={invPass:"invitada123",transferencia:{alias:"",cbu:"",banco:"",titular:""},flyer:"",fotos:{C1:[],C2:[],C3:[],C4:[],C5:[]},descripciones:{C1:"",C2:"",C3:"",C4:"",C5:""}};
          setConfigLocal(Object.assign({},def,d[0],{transferencia:Object.assign({},def.transferencia,(d[0].transferencia||{})),fotos:Object.assign({},def.fotos,(d[0].fotos||{})),descripciones:Object.assign({},def.descripciones,(d[0].descripciones||{}))}));
        }
      }),
    ];
    return function(){ unsubs.forEach(function(u){u();}); };
  }, []);

  function setPsicos(u2) { const n=typeof u2==="function"?u2(psicos):u2; n.forEach(function(p){saveDoc("psicos",p.id,p);}); psicos.forEach(function(p){if(!n.find(function(x){return x.id===p.id;}))delDoc("psicos",p.id);}); }
  function setHorarios(u2) { const n=typeof u2==="function"?u2(horarios):u2; n.forEach(function(h){saveDoc("horarios",h.id,h);}); horarios.forEach(function(h){if(!n.find(function(x){return x.id===h.id;}))delDoc("horarios",h.id);}); }
  function setReservas(u2) { const n=typeof u2==="function"?u2(reservas):u2; n.forEach(function(r){saveDoc("reservas",r.id,r);}); reservas.forEach(function(r){if(!n.find(function(x){return x.id===r.id;}))delDoc("reservas",r.id);}); }
  function setBloques(u2) { const n=typeof u2==="function"?u2(bloques):u2; n.forEach(function(b){saveDoc("bloques",b.id,b);}); bloques.forEach(function(b){if(!n.find(function(x){return x.id===b.id;}))delDoc("bloques",b.id);}); }
  function setAnuncios(u2) { const n=typeof u2==="function"?u2(anuncios):u2; n.forEach(function(a){saveDoc("anuncios",a.id,a);}); anuncios.forEach(function(a){if(!n.find(function(x){return x.id===a.id;}))delDoc("anuncios",a.id);}); }
  function setSolHor(u2) { const n=typeof u2==="function"?u2(solHor):u2; n.forEach(function(s){saveDoc("solHor",s.id,s);}); solHor.forEach(function(s){if(!n.find(function(x){return x.id===s.id;}))delDoc("solHor",s.id);}); }
  function setTabP(u2) { const n=typeof u2==="function"?u2(tabP):u2; n.forEach(function(t){saveDoc("tabP",t.id,t);}); tabP.forEach(function(t){if(!n.find(function(x){return x.id===t.id;}))delDoc("tabP",t.id);}); }
  function setConfig(u2) { const n=typeof u2==="function"?u2(config):u2; saveDoc("config","main",n); }

  const cmap = {};
  psicos.forEach(function(p,i){ cmap[p.nombre.toLowerCase()] = PCOLS[i%PCOLS.length]; });
  function gc(n) { return cmap[n&&n.toLowerCase()] || br; }

  function notify(msg,t) {
    setNotif({msg:msg,t:t||"ok"});
    setTimeout(function(){setNotif(null);}, 3000);
  }
  function login(r,n) { setRole(r); setUser(n); setView("app"); setTab("calendario"); }

  function getP(f) {
    const s = typeof f==="string" ? f : f.toISOString().split("T")[0];
    const act = tabP.filter(function(t){return t.vigencia<=s;}).sort(function(a,b){return b.vigencia.localeCompare(a.vigencia);})[0];
    return act ? act.p : PD;
  }
  function getPM(mes,anio) { return getP(anio+"-"+String(mes+1).padStart(2,"0")+"-01"); }

  function calcFact(psico,mes,anio) {
    const pr = getPM(mes,anio);
    const fp = horarios.filter(function(h){return h.psico.toLowerCase()===psico.nombre.toLowerCase();});
    let tf=0; const df=[];
    fp.forEach(function(h) {
      const sem = mesFechas(mes,anio,Number(h.diaSemana)).length;
      const p = calcPrecio(h.inicio,h.fin,pr);
      tf += p.sub*sem;
      df.push({diaSemana:Number(h.diaSemana),cons:h.consultorio,ini:h.inicio,fin:h.fin,horas:calcHrs(h.inicio,h.fin),sem:sem,subSem:p.sub,sub:p.sub*sem,ley:p.ley,tipo:p.tipo,des:p.des});
    });
    df.sort(function(a,b){return a.diaSemana-b.diaSemana||a.ini.localeCompare(b.ini);});
    const ep = reservas.filter(function(r){return r.estado==="aprobada"&&r.psico===psico.nombre&&r.tipo==="extra"&&new Date(r.fecha).getMonth()===mes&&new Date(r.fecha).getFullYear()===anio;});
    let te=0; const de=[];
    ep.forEach(function(r){const p=calcPrecio(r.inicio,r.fin,getP(r.fecha));te+=p.sub;de.push({fecha:r.fecha,cons:r.consultorio,ini:r.inicio,fin:r.fin,horas:calcHrs(r.inicio,r.fin),sub:p.sub,ley:p.ley,tipo:p.tipo,des:p.des});});
    const bruto=tf+te, desc=psico.descuento||0, montoDesc=Math.round(bruto*desc/100);
    return {total:bruto-montoDesc,tf:tf,te:te,df:df,de:de,bruto:bruto,desc:desc,montoDesc:montoDesc};
  }

  function genMsg(psico,mes,anio) {
    const r = calcFact(psico,mes,anio);
    let m = "Hola "+psico.nombre+" !\n\nResumen "+MESES[mes]+" "+anio+":\n\n";
    if(r.df.length) { m+="HORARIOS FIJOS\n"; r.df.forEach(function(d){m+="- "+DIAS[d.diaSemana]+" "+d.cons+" "+d.ini+"-"+d.fin+"\n  "+(d.ley||d.des||calcHrs(d.ini,d.fin).toFixed(1)+"hs")+" x "+d.sem+" sem = "+ars(d.sub)+"\n";}); m+="Subtotal fijos: "+ars(r.tf)+"\n\n"; }
    if(r.de.length) { m+="ADICIONALES\n"; r.de.forEach(function(d){m+="- "+parseLocalDate(d.fecha).toLocaleDateString("es-AR")+" "+d.cons+" "+d.ini+"-"+d.fin+"\n  "+(d.ley||d.des||d.horas+"hs")+" = "+ars(d.sub)+"\n";}); m+="Subtotal: "+ars(r.te)+"\n\n"; }
    if(!r.df.length&&!r.de.length) m+="Sin horas este mes.\n\n";
    m += "----------------\n";
    if(r.desc>0) { m+="Subtotal: "+ars(r.bruto)+"\nDescuento "+r.desc+"%: -"+ars(r.montoDesc)+"\n"; }
    m += "TOTAL A PAGAR: "+ars(r.total)+"\n\nVencimiento: del 1 al 5 del mes siguiente.\nGracias!";
    return m;
  }

  function getEvts(date) {
    const ds = date.getDay()===0?7:date.getDay(), str = localDateStr(date);
    const fj = horarios.filter(function(h){return Number(h.diaSemana)===ds&&(fSede==="todas"||h.sede===fSede)&&(fCons==="todos"||h.consultorio===fCons)&&(fPsico==="todas"||h.psico.toLowerCase()===fPsico.toLowerCase());}).map(function(h){return Object.assign({},h,{tipo:"fijo"});});
    const ex = reservas.filter(function(r){return r.fecha===str&&r.estado==="aprobada"&&(fCons==="todos"||r.consultorio===fCons)&&(fPsico==="todas"||r.psico.toLowerCase()===fPsico.toLowerCase());}).map(function(r){return Object.assign({},r,{tipo:"extra"});});
    const bl = bloques.filter(function(b){return b.fecha===str;}).map(function(b){return Object.assign({},b,{tipo:"bloqueado"});});
    return fj.concat(ex).concat(bl);
  }

  function notifCnt() {
    return anuncios.filter(function(a){const ok2=a.para==="todas"?a.excluir!==user:a.para===user;return ok2&&!(a.leidos||[]).includes(user);}).length;
  }

  const pendR = reservas.filter(function(r){return r.estado==="pendiente";});
  const pendH = solHor.filter(function(s){return s.estado==="pendiente";});
  const nc = notifCnt();
  const wkD = wkDates(wk);

  if(!dbReady) return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#EBF6FA,#F0F8FB)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"DM Sans,sans-serif"}}>
      <div style={{textAlign:"center"}}>
        <div style={{width:60,height:60,borderRadius:"50%",background:"linear-gradient(135deg,#4BA3C3,#2E86AB)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px"}}>
          <Logo size={38}/>
        </div>
        <div style={{color:"#1C3A4A",fontWeight:700,fontSize:16}}>Cargando...</div>
        <div style={{color:"#6B97AA",fontSize:13,marginTop:4}}>Conectando con la base de datos</div>
      </div>
    </div>
  );
  if(view==="login") return <AppRoot><LoginView onLogin={login} psicos={psicos} config={config}/></AppRoot>;

  const nav = role==="invitada" ? [
    {id:"calendario",icon:"📅",label:"Calendario",badge:0},
    {id:"consultorios",icon:"🏢",label:"Consultorios",badge:0},
    {id:"solicitar",icon:"✉",label:"Solicitar",badge:0},
  ] : role==="admin" ? [
    {id:"calendario",icon:"📅",label:"Calendario",badge:0},
    {id:"perfiles",icon:"👩",label:"Psicologas",badge:0},
    {id:"anuncios",icon:"📢",label:"Anuncios",badge:nc},
    {id:"solicitudes",icon:"🔔",label:"Solicitudes",badge:pendR.length},
    {id:"cambios",icon:"🗓",label:"Cambios",badge:pendH.length},
    {id:"facturacion",icon:"💰",label:"Facturacion",badge:0},
    {id:"precios",icon:"💵",label:"Precios",badge:0},
    {id:"gestion",icon:"⚙",label:"Gestion",badge:0},
    {id:"estadisticas",icon:"📊",label:"Estadisticas",badge:0},
    {id:"consultorios",icon:"🏢",label:"Consultorios",badge:0},
    {id:"configuracion",icon:"🔧",label:"Configuracion",badge:0},
  ] : [
    {id:"calendario",icon:"📅",label:"Calendario",badge:0},
    {id:"perfiles",icon:"👩",label:"Psicologas",badge:0},
    {id:"anuncios",icon:"📢",label:"Anuncios",badge:nc},
    {id:"consultorios",icon:"🏢",label:"Consultorios",badge:0},
    {id:"misreservas",icon:"📋",label:"Mis Reservas",badge:0},
    {id:"mishorarios",icon:"🗓",label:"Mis Horarios",badge:0},
  ];

  const nav5 = nav.slice(0,5);
  const navX = nav.slice(5);
  const isX = ["facturacion","precios","gestion","mishorarios"].indexOf(tab) >= 0;

  return (
    <AppRoot>
      <div style={{display:"flex",flexDirection:"column",height:"100vh",background:bg,fontFamily:"'DM Sans','Segoe UI',sans-serif",overflow:"hidden"}}>
        {notif && (
          <div style={{position:"fixed",top:16,left:"50%",transform:"translateX(-50%)",color:wh,fontWeight:700,padding:"10px 20px",borderRadius:12,zIndex:999,background:notif.t==="ok"?br:er,fontSize:14,whiteSpace:"nowrap"}}>
            {notif.msg}
          </div>
        )}

        <header style={{background:wh,borderBottom:"1.5px solid #C9E4EF",padding:"0 16px",height:56,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:34,height:34,borderRadius:"50%",background:"linear-gradient(135deg,#4BA3C3,#2E86AB)",display:"flex",alignItems:"center",justifyContent:"center"}}>
              <Logo size={20}/>
            </div>
            <div>
              <div style={{color:tx,fontWeight:800,fontSize:14,lineHeight:1.2}}>Gloria Videla</div>
              <div style={{color:mu,fontSize:9,letterSpacing:1,textTransform:"uppercase"}}>Psicologia Clinica</div>
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            {navX.length > 0 && (
              <button onClick={function(){setTab(tab==="more"?"calendario":"more");}} style={{background:isX?lt:"transparent",border:"none",borderRadius:8,padding:"6px 10px",cursor:"pointer",color:isX?br:mu,fontFamily:"inherit",fontSize:16}}>
                &#9776;
              </button>
            )}
            <button onClick={function(){setTab(tab==="userMenu"?"calendario":"userMenu");}} style={{width:32,height:32,borderRadius:"50%",background:"linear-gradient(135deg,#4BA3C3,#2E86AB)",color:wh,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:14,border:"none",cursor:"pointer",fontFamily:"inherit"}}>
              {user && user[0] && user[0].toUpperCase()}
            </button>
          </div>
        </header>

        {tab==="userMenu" && (
          <div style={{position:"fixed",top:56,right:0,background:wh,zIndex:80,boxShadow:"0 8px 24px rgba(75,163,195,.15)",borderRadius:"0 0 0 12px",minWidth:200,border:"1px solid #C9E4EF"}}>
            <div style={{padding:"14px 20px",borderBottom:"1px solid #C9E4EF"}}>
              <div style={{color:tx,fontWeight:700,fontSize:14}}>{user}</div>
              <div style={{color:mu,fontSize:12}}>{role==="admin"?"Administradora":"Psicologa"}</div>
            </div>
            {role==="psico" && <EditarPerfilBtn user={user} psicos={psicos} setPsicos={setPsicos} notify={notify}/>}
            {role==="psico" && <CambiarPassBtn user={user} setPsicos={setPsicos} notify={notify}/>}
            <button onClick={function(){setView("login");setRole(null);setUser(null);}} style={{display:"flex",alignItems:"center",gap:12,width:"100%",padding:"14px 20px",border:"none",background:"transparent",cursor:"pointer",fontFamily:"inherit",color:er,fontSize:15,fontWeight:600}}>
              <span style={{fontSize:20}}>&#x23FB;</span>
              <span>Cerrar sesion</span>
            </button>
          </div>
        )}

        {tab==="more" && (
          <div style={{position:"fixed",top:56,left:0,right:0,background:wh,zIndex:80,boxShadow:"0 8px 24px rgba(75,163,195,.15)"}}>
            {navX.map(function(item) {
              return (
                <button key={item.id} onClick={function(){setTab(item.id);}} style={{display:"flex",alignItems:"center",gap:14,width:"100%",padding:"14px 20px",border:"none",borderBottom:"1px solid #C9E4EF",background:tab===item.id?lt:"transparent",cursor:"pointer",fontFamily:"inherit",color:tab===item.id?br:tx,fontSize:15}}>
                  <div style={{position:"relative",display:"inline-flex"}}>
                    <span style={{fontSize:22}}>{item.icon}</span>
                    {item.badge>0 && (
                      <div style={{position:"absolute",top:-4,right:-6,background:"#E53E3E",color:wh,borderRadius:"50%",minWidth:18,height:18,display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:700,padding:"0 4px"}}>
                        {item.badge}
                      </div>
                    )}
                  </div>
                  <span>{item.label}</span>
                </button>
              );
            })}
            <button onClick={function(){setView("login");setRole(null);setUser(null);}} style={{display:"flex",alignItems:"center",gap:14,width:"100%",padding:"14px 20px",border:"none",background:"transparent",cursor:"pointer",fontFamily:"inherit",color:mu,fontSize:15}}>
              <span style={{fontSize:22}}>&#x23FB;</span>
              <span>Cerrar sesion</span>
            </button>
          </div>
        )}

        {role==="admin" && new Date().getDate()>=25 && (
          <div style={{background:"linear-gradient(135deg,#FFF8EC,#FEF3C7)",borderBottom:"1px solid #F6D860",padding:"10px 16px",display:"flex",alignItems:"center",gap:10,flexShrink:0}}>
            <span style={{fontSize:18}}>⏰</span>
            <div style={{flex:1}}>
              <div style={{color:"#92400E",fontWeight:700,fontSize:13}}>Recordatorio de fin de mes</div>
              <div style={{color:"#B45309",fontSize:12}}>Quedan pocos dias para cerrar {MESES[new Date().getMonth()]}. Acordate de enviar la facturacion.</div>
            </div>
            <button style={{background:"#F59E0B",color:wh,border:"none",borderRadius:8,padding:"6px 12px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}} onClick={function(){setTab("facturacion");}}>Ver</button>
          </div>
        )}
        <main style={{flex:1,overflowY:"auto",padding:16,paddingBottom:72,background:bg}}>
          {tab==="calendario" && <CalView wkD={wkD} wk={wk} setWk={setWk} getEvts={getEvts} gc={gc} fPsico={fPsico} setFPsico={setFPsico} psicos={psicos} onSlot={function(s){if(role!=="invitada")setMod({type:"slot",slot:s});}} role={role} fSede={fSede} setFSede={setFSede} fCons={fCons} setFCons={setFCons}/>}
          {tab==="perfiles" && <PerfilesView psicos={psicos} setPsicos={setPsicos} gc={gc} role={role} notify={notify} perfilSel={perfilSel} setPerfilSel={setPerfilSel}/>}
          {tab==="anuncios" && <AnunciosView anuncios={anuncios} setAnuncios={setAnuncios} user={user} role={role} psicos={psicos} notify={notify}/>}
          {tab==="solicitudes" && role==="admin" && <SolicitudesView reservas={reservas} setReservas={setReservas} gc={gc} notify={notify}/>}
          {tab==="cambios" && role==="admin" && <CambiosView solicitudes={solHor} setSolicitudes={setSolHor} horarios={horarios} setHorarios={setHorarios} reservas={reservas} setReservas={setReservas} setAnuncios={setAnuncios} notify={notify} config={config} psicos={psicos} setPsicos={setPsicos}/>}
          {tab==="facturacion" && role==="admin" && <FactView psicos={psicos} calcFact={calcFact} genMsg={genMsg} notify={notify}/>}
          {tab==="precios" && role==="admin" && <PreciosView tabP={tabP} setTabP={setTabP} psicos={psicos} notify={notify}/>}
          {tab==="gestion" && role==="admin" && <GestionView psicos={psicos} setPsicos={setPsicos} horarios={horarios} setHorarios={setHorarios} bloques={bloques} setBloques={setBloques} notify={notify}/>}
          {tab==="estadisticas" && role==="admin" && <EstadisticasView psicos={psicos} horarios={horarios} reservas={reservas} calcFact={calcFact}/>}
          {tab==="configuracion" && role==="admin" && <ConfigView config={config} setConfig={setConfig} notify={notify}/>}
          {tab==="consultorios" && <ConsultoriosView config={config} horarios={horarios}/>}
          {tab==="solicitar" && role==="invitada" && <SolicitudInvitadaView horarios={horarios} reservas={reservas} config={config} notify={notify} setSolHor={setSolHor}/>}
          {tab==="misreservas" && role==="psico" && <MisReservasView reservas={reservas.filter(function(r){return r.psico===user||r.solicitante===user;})} onNew={function(){setMod({type:"nueva"});}}/>}
          {tab==="mishorarios" && role==="psico" && <MisHorariosView user={user} horarios={horarios} reservas={reservas} solicitudes={solHor} setSolicitudes={setSolHor} notify={notify}/>}
        </main>

        <nav style={{position:"fixed",bottom:0,left:0,right:0,background:wh,borderTop:"1.5px solid #C9E4EF",display:"flex",zIndex:70,height:60}}>
          {nav5.map(function(item) {
            const act = tab===item.id;
            return (
              <button key={item.id} onClick={function(){setTab(item.id);}} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"6px 2px",border:"none",background:"transparent",cursor:"pointer",fontFamily:"inherit",color:act?br:mu,borderTop:act?"2.5px solid #4BA3C3":"2.5px solid transparent"}}>
                <div style={{position:"relative",display:"inline-flex",alignItems:"center",justifyContent:"center",marginBottom:1}}>
                  <span style={{fontSize:20}}>{item.icon}</span>
                  {item.badge>0 && (
                    <div style={{position:"absolute",top:-4,right:-6,background:"#E53E3E",color:wh,borderRadius:"50%",minWidth:16,height:16,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,padding:"0 3px",lineHeight:1}}>
                      {item.badge}
                    </div>
                  )}
                </div>
                <span style={{fontSize:9,fontWeight:act?700:400}}>{item.label.split(" ")[0]}</span>
              </button>
            );
          })}
          {navX.length > 0 && (
            <button onClick={function(){setTab(tab==="more"?"calendario":"more");}} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"6px 2px",border:"none",background:isX?lt:"transparent",cursor:"pointer",fontFamily:"inherit",color:isX?br:mu,borderTop:isX?"2.5px solid #4BA3C3":"2.5px solid transparent"}}>
              <span style={{fontSize:20,marginBottom:1}}>&#9776;</span>
              <span style={{fontSize:9}}>Mas</span>
            </button>
          )}
        </nav>

        {mod && mod.type==="slot" && (
          <SlotModal key={mod.slot.date+(mod.slot.preCons||"")+(mod.slot.evento?mod.slot.evento.id:"")} slot={mod.slot} role={role} user={user} psicos={psicos} horarios={horarios} reservas={reservas}
            onReservar={function(d){const r=Object.assign({id:Date.now()},d,{estado:role==="admin"?"aprobada":"pendiente",solicitante:user,tipo:"extra"});saveDoc("reservas",r.id,r);notify(role==="admin"?"Hora extra creada":"Solicitud enviada");setMod(null);}}
            onBloquear={function(d){const b=Object.assign({id:Date.now()},d);saveDoc("bloques",b.id,b);notify("Bloqueado");setMod(null);}}
            onAgregarFijo={function(d){const h=Object.assign({id:"h"+Date.now()},d);saveDoc("horarios",h.id,h);notify("Horario fijo agregado");setMod(null);}}
            onSelectAlternativo={function(d){setMod({type:"slot",slot:{date:d.date,hour:d.hour,preIni:d.ini,preFin:d.fin,preCons:d.cons,confirmedFree:true}});}}
            onEliminar={function(ev){
              if(ev.tipo==="bloqueado") { delDoc("bloques",ev.id); notify("Eliminado"); }
              else if(ev.tipo==="extra") { delDoc("reservas",ev.id); notify("Hora extra cancelada"); }
              else if(ev.tipo==="fijo") {
                if(role==="admin") { delDoc("horarios",ev.id); notify("Horario eliminado"); }
                else {
                  const s={id:Date.now(),psico:user,tipo:"fijo",accion:"eliminar",datos:{},horarioId:ev.id,reservaId:null,estado:"pendiente",fechaSol:new Date().toISOString()};
                  saveDoc("solHor",s.id,s);
                  notify("Solicitud enviada - pendiente de aprobacion");
                }
              }
              setMod(null);
            }}
            onClose={function(){setMod(null);}}/>
        )}
        {mod && mod.type==="nueva" && (
          <NuevaModal user={user} horarios={horarios} reservas={reservas} onReservar={function(d){const r=Object.assign({id:Date.now()},d,{estado:"pendiente",solicitante:user,tipo:"extra"});saveDoc("reservas",r.id,r);notify("Solicitud enviada");setMod(null);}} onClose={function(){setMod(null);}}/>
        )}
      </div>
    </AppRoot>
  );
}

// ─── Login ────────────────────────────────────────────────────
function LoginView({onLogin,psicos,config}) {
  const [u,setU] = useState("");
  const [p,setP] = useState("");
  const [err,setErr] = useState("");
  function go() {
    if(u==="admin" && p==="admin123") { onLogin("admin","Admin"); return; }
    if(u.toLowerCase()==="invitada" && p===((config&&config.invPass)||"invitada123")) { onLogin("invitada","Invitada"); return; }
    const f = psicos.find(function(x){return x.nombre.toLowerCase()===u.toLowerCase();});
    if(f && p===(f.pass||"psico123")) { onLogin("psico",f.nombre); return; }
    setErr("Usuario o contrasena incorrectos");
  }
  return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#EBF6FA,#F0F8FB,#D8EEF7)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans','Segoe UI',sans-serif"}}>
      <div style={{background:wh,borderRadius:24,padding:40,width:"min(400px,95vw)",border:"1.5px solid #C9E4EF",display:"flex",flexDirection:"column",boxShadow:"0 20px 60px rgba(75,163,195,.15)"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{width:90,height:90,borderRadius:"50%",background:"linear-gradient(135deg,#4BA3C3,#2E86AB)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",boxShadow:"0 8px 28px rgba(75,163,195,.32)"}}>
            <Logo size={58}/>
          </div>
          <h1 style={{color:tx,fontWeight:800,fontSize:26,margin:"0 0 4px"}}>Gloria Videla</h1>
          <p style={{color:mu,fontSize:11,letterSpacing:2,textTransform:"uppercase",margin:0}}>Psicologia Clinica</p>
        </div>
        <label style={sLbl}>Usuario</label>
        <input style={Object.assign({},sInp,{marginBottom:12})} value={u} onChange={function(e){setU(e.target.value);}} placeholder="Nombre o admin"/>
        <label style={sLbl}>Contrasena</label>
        <input style={Object.assign({},sInp,{marginBottom:8})} type="password" value={p} onChange={function(e){setP(e.target.value);}} onKeyDown={function(e){if(e.key==="Enter")go();}} placeholder="••••••••"/>
        {err && <div style={{color:er,fontSize:13,marginBottom:8,textAlign:"center"}}>{err}</div>}
        <button style={Object.assign({},btn(br,wh),{width:"100%",marginTop:8,padding:"12px 16px",fontSize:15})} onClick={go}>Ingresar</button>
        <button style={{background:"transparent",border:"none",color:br,fontSize:12,cursor:"pointer",marginTop:16,textDecoration:"underline",fontFamily:"inherit"}} onClick={function(){
          const nombre = u.trim();
          if(!nombre){alert("Ingresa tu nombre primero");return;}
          const msg = "Hola Gloria! Soy "+nombre+" y olvide mi contrasena. Podrias ayudarme?";
          openLink("https://wa.me/5491161572283?text="+encodeURIComponent(msg),"_blank");
        }}>Olvide mi contrasena</button>
      </div>
    </div>
  );
}

// ─── Calendario ───────────────────────────────────────────────
function CalView({wkD,wk,setWk,getEvts,gc,fPsico,setFPsico,psicos,onSlot,role,fSede,setFSede,fCons,setFCons}) {
  const hrs = Array.from({length:15},function(_,i){return i+7;});
  const vis = wkD.slice(0,6);
  function prev() { const d=new Date(wk); d.setDate(d.getDate()-6); setWk(d); }
  function next() { const d=new Date(wk); d.setDate(d.getDate()+6); setWk(d); }
  return (
    <div style={{display:"flex",flexDirection:"column",height:"100%",gap:12}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <h2 style={{color:tx,fontSize:20,fontWeight:800,margin:0}}>Calendario</h2>
        <div style={{display:"flex",gap:6}}>
          <button style={btnO(wh,tx,"1.5px solid #C9E4EF")} onClick={prev}>Ant.</button>
          <button style={btnO(wh,tx,"1.5px solid #C9E4EF")} onClick={function(){setWk(new Date());}}>Hoy</button>
          <button style={btnO(wh,tx,"1.5px solid #C9E4EF")} onClick={next}>Sig.</button>
        </div>
      </div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
        <div style={{display:"flex",gap:6,background:wh,borderRadius:10,padding:"4px",border:"1px solid #C9E4EF"}}>
          <button
            style={{padding:"6px 12px",border:"none",borderRadius:7,cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:700,background:fSede==="todas"?br:wh,color:fSede==="todas"?wh:mu}}
            onClick={function(){setFSede("todas");setFCons("todos");}}>
            Todas
          </button>
          <button
            style={{padding:"6px 12px",border:"none",borderRadius:7,cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:700,background:fSede==="VL"?br:wh,color:fSede==="VL"?wh:mu}}
            onClick={function(){setFSede("VL");setFCons("todos");}}>
            Vic. Lopez
          </button>
          <button
            style={{padding:"6px 12px",border:"none",borderRadius:7,cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:700,background:fSede==="UY"?br:wh,color:fSede==="UY"?wh:mu}}
            onClick={function(){setFSede("UY");setFCons("todos");}}>
            Uruguay
          </button>
        </div>
        {fSede !== "todas" && (
          <div style={{display:"flex",gap:4,background:wh,borderRadius:10,padding:"4px",border:"1px solid #C9E4EF"}}>
            <button
              style={{padding:"6px 10px",border:"none",borderRadius:7,cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:700,background:fCons==="todos"?lt:wh,color:fCons==="todos"?dk:mu}}
              onClick={function(){setFCons("todos");}}>
              Todos
            </button>
            {CONS.filter(function(c){return c.sede===fSede;}).map(function(c){
              return (
                <button key={c.id}
                  style={{padding:"6px 10px",border:"none",borderRadius:7,cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:700,background:fCons===c.id?lt:wh,color:fCons===c.id?dk:mu}}
                  onClick={function(){setFCons(c.id);}}>
                  {c.id}
                </button>
              );
            })}
          </div>
        )}
        {role==="admin" && (
          <select style={Object.assign({},sInp,{width:"auto",fontSize:12})} value={fPsico} onChange={function(e){setFPsico(e.target.value);}}>
            <option value="todas">Todas</option>
            {psicos.map(function(p){return <option key={p.id} value={p.nombre}>{p.nombre}</option>;})}
          </select>
        )}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"36px repeat(6,1fr)",border:"1px solid #C9E4EF",borderRadius:14,overflow:"auto",background:wh,flex:1}}>
        <div style={{background:"#F7FBFD"}}/>
        {vis.map(function(d,i) {
          const hoy = d.toDateString()===new Date().toDateString();
          return (
            <div key={i} style={{padding:"8px 4px",textAlign:"center",fontWeight:700,fontSize:13,borderLeft:"1px solid #EBF6FA",background:hoy?br:"#F7FBFD",color:hoy?wh:tx}}>
              <div style={{fontSize:10}}>{DIASC[d.getDay()]}</div>
              <div style={{fontSize:18,fontWeight:700}}>{d.getDate()}</div>
            </div>
          );
        })}
        {hrs.map(function(h) {
          return (
            <div key={h} style={{display:"contents"}}>
              <div style={{color:mu,fontSize:10,padding:"0 4px",textAlign:"right",height:56,display:"flex",alignItems:"flex-start",paddingTop:4,background:"#F7FBFD",borderTop:"1px solid #EBF6FA"}}>{h}:00</div>
              {vis.map(function(date,di) {
                const evs = getEvts(date).filter(function(e){return e.inicio&&parseInt(e.inicio.split(":")[0])===h;});
                return (
                  <div key={di} style={{height:56,borderLeft:"1px solid #EBF6FA",borderTop:"1px solid #EBF6FA",position:"relative",cursor:"pointer"}} onClick={function(){onSlot({date:localDateStr(date),hour:h});}}>
                    {evs.map(function(e,ei) {
                      const sm=toMin(e.inicio)-h*60, dm=toMin(e.fin)-toMin(e.inicio);
                      const bloq = e.tipo==="bloqueado";
                      const col = bloq?"#B0C4CE":(role==="admin"?(e.tipo==="extra"?ok:gc(e.psico)):mu);
                      const top = (sm/60)*56;
                      const ht = Math.max((dm/60)*56-2,14);
                      return (
                        <div key={ei}
                          style={{position:"absolute",left:2,right:2,borderRadius:4,padding:"2px 4px",color:wh,fontSize:9,overflow:"hidden",zIndex:2,top:top+"px",height:ht+"px",background:col,cursor:"pointer"}}
                          onClick={function(ev){ev.stopPropagation();onSlot({date:date.toISOString().split("T")[0],hour:h,evento:e});}}>
                          <div style={{fontWeight:700}}>{bloq?"Bloqueado":(role==="admin"?e.psico:"Ocupado")}</div>
                          <div style={{opacity:.8}}>{e.consultorio} {e.inicio}-{e.fin}</div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Slot Modal ───────────────────────────────────────────────
function SlotModal({slot,role,user,psicos,horarios,reservas,onReservar,onBloquear,onAgregarFijo,onEliminar,onSelectAlternativo,onClose}) {
  const ev = slot.evento;
  const [tipo,setTipo] = useState(slot.preCons?"reservar":(role==="admin"?"bloquear":"reservar"));
  const [ini,setIni] = useState(slot.preIni||String(slot.hour).padStart(2,"0")+":00");
  const [fin,setFin] = useState(slot.preFin||String(Math.min(slot.hour+1,21)).padStart(2,"0")+":00");
  const [cons,setCons] = useState(slot.preCons||"C1");
  const [psico,setPsico] = useState(psicos&&psicos[0]?psicos[0].nombre:user);
  const [diaSemana,setDiaSemana] = useState(parseLocalDate(slot.date).getDay()===0?7:(parseLocalDate(slot.date).getDay()||1));
  const pr = calcPrecio(ini,fin);

  // diaCheck: day of week (1=Mon...6=Sat) used for BOTH fijo and reservar checks
  function checkConflicto(tipoCheck,consCheck,iniCheck,finCheck,diaCheck) {
    if(!iniCheck||!finCheck) return null;
    const sMin=toMin(iniCheck), eMin=toMin(finCheck);
    if(eMin<=sMin) return "El horario de fin debe ser mayor al inicio.";
    const jd=Number(diaCheck);
    // Check fixed schedules for that weekday
    const fijos=(horarios||[]).filter(function(x){
      if(x.consultorio!==consCheck) return false;
      if(Number(x.diaSemana)!==jd) return false;
      return sMin<toMin(x.fin)&&eMin>toMin(x.inicio);
    });
    if(fijos.length) return "Ese horario esta ocupado en "+consCheck;
    if(tipoCheck==="reservar") {
      // Also check extras on the same specific date
      const extras=(reservas||[]).filter(function(x){
        return x.fecha===slot.date && x.consultorio===consCheck && x.estado==="aprobada" && sMin<toMin(x.fin) && eMin>toMin(x.inicio);
      });
      if(extras.length) return "Ese horario esta ocupado en "+consCheck;
    }
    return null;
  }
  // Always run full conflict check - no minimum hours restriction
  const fromAlternative = slot.confirmedFree === true;
  const conflicto = (tipo==="fijo"||tipo==="reservar") ? checkConflicto(tipo,cons,ini,fin,diaSemana) : null;

  if(ev) {
    const consNombre = (CONS.find(function(c){return c.id===ev.consultorio;})||{sn:""}).sn;
    const esBloq=ev.tipo==="bloqueado", esFijo=ev.tipo==="fijo", esExtra=ev.tipo==="extra";
    return (
      <div style={sOverlay} onClick={onClose}>
        <div style={sModal} onClick={function(e){e.stopPropagation();}}>
          <div style={sModH}>
            <h3 style={{margin:0,color:tx}}>{esBloq?"Bloque":esFijo?"Horario Fijo":"Hora Extra"}</h3>
            <button style={sXBtn} onClick={onClose}>X</button>
          </div>
          <div style={{padding:20,display:"flex",flexDirection:"column",gap:12}}>
            <div style={{background:bg,borderRadius:10,padding:14,border:"1px solid #C9E4EF"}}>
              {role==="admin"&&!esBloq&&<div style={{color:tx,fontWeight:700,fontSize:16,marginBottom:6}}>{ev.psico}</div>}
              {role==="psico"&&!esBloq&&<div style={{color:tx,fontWeight:700,fontSize:16,marginBottom:6}}>{ev.psico===user?"Tu horario":"Ocupado"}</div>}
              <div style={{color:mu,fontSize:13}}>{ev.consultorio}{consNombre?" - "+consNombre:""}</div>
              <div style={{color:tx,fontSize:14,fontWeight:600}}>{ev.inicio} - {ev.fin} ({calcHrs(ev.inicio,ev.fin).toFixed(1)}hs)</div>
              {esFijo&&<div style={{color:br,fontSize:13}}>{DIAS[Number(ev.diaSemana)]} - Se repite cada semana</div>}
              {esExtra&&<div style={{color:mu,fontSize:13}}>{ev.fecha?parseLocalDate(ev.fecha).toLocaleDateString("es-AR"):""} - Hora extra</div>}
              {ev.motivo&&<div style={{color:mu,fontSize:12}}>Motivo: {ev.motivo}</div>}
              {role==="admin"&&!esBloq&&<div style={{color:ok,fontWeight:700,fontSize:15,marginTop:6}}>{ars(calcPrecio(ev.inicio,ev.fin).sub)}{esFijo?"/sem":""}</div>}
            </div>
            {role==="psico"&&!esBloq&&ev.psico!==user&&(
              <div>
                <div style={{color:mu,fontSize:12,fontWeight:700,marginBottom:8}}>Disponibilidad para el {parseLocalDate(slot.date).toLocaleDateString("es-AR")} a las {slot.hour}:00hs:</div>
                {(function(){
                  const ds=parseLocalDate(slot.date).getDay();
                  const jd=ds===0?7:ds;
                  // Check availability at the CLICKED hour (slot.hour to slot.hour+1)
                  const clickMin=slot.hour*60;
                  const clickMinEnd=(slot.hour+1)*60;
                  
                  // For each consultorio, find what free time they have around the clicked hour
                  const resultados=CONS.filter(function(c){
                    if(c.id===ev.consultorio) return false;
                    // Check if clicked hour is free (not occupied by any horario)
                    return !(horarios||[]).some(function(x){
                      return x.consultorio===c.id&&Number(x.diaSemana)===jd&&clickMin<toMin(x.fin)&&clickMinEnd>toMin(x.inicio);
                    });
                  }).map(function(c){
                    // Find the full free window around clicked hour
                    const hsCons=(horarios||[]).filter(function(x){return x.consultorio===c.id&&Number(x.diaSemana)===jd;}).sort(function(a,b){return toMin(a.inicio)-toMin(b.inicio);});
                    // Find free windows: gaps between occupied slots (between 08:00 and 21:00)
                    let freeStart=480, windows=[];
                    hsCons.forEach(function(x){
                      if(toMin(x.inicio)>freeStart) windows.push({ini:freeStart,fin:toMin(x.inicio)});
                      freeStart=Math.max(freeStart,toMin(x.fin));
                    });
                    if(freeStart<1260) windows.push({ini:freeStart,fin:1260});
                    // Find window that contains clicked hour
                    const win=windows.find(function(w){return w.ini<=clickMin&&w.fin>=clickMinEnd;});
                    const iniStr=win?String(Math.floor(win.ini/60)).padStart(2,"0")+":"+String(win.ini%60).padStart(2,"0"):"08:00";
                    const finStr=win?String(Math.floor(win.fin/60)).padStart(2,"0")+":"+String(win.fin%60).padStart(2,"0"):"21:00";
                    return {c:c, iniStr:iniStr, finStr:finStr};
                  });
                  
                  if(!resultados.length) return <div style={{color:mu,fontSize:13,padding:"8px 0"}}>No hay consultorios disponibles a esa hora.</div>;
                  return resultados.map(function(r){
                    const sedeNombre=r.c.sede==="VL"?"Vicente Lopez":"Uruguay";
                    return (
                      <button key={r.c.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",width:"100%",background:ob,border:"1px solid #A7E3C0",borderRadius:10,padding:"10px 14px",marginBottom:6,cursor:"pointer",fontFamily:"inherit",textAlign:"left"}}
                        onClick={function(){onSelectAlternativo({date:slot.date,hour:slot.hour,cons:r.c.id,ini:r.iniStr,fin:r.finStr});}}>
                        <div>
                          <div style={{color:ok,fontWeight:700,fontSize:14}}>{r.c.id} — {sedeNombre}</div>
                          <div style={{color:mu,fontSize:12}}>Libre {r.iniStr} - {r.finStr}</div>
                        </div>
                        <div style={{color:ok,fontSize:13,fontWeight:700}}>Reservar →</div>
                      </button>
                    );
                  });
                })()}
              </div>
            )}
            {(role==="admin"||(role==="psico"&&ev.psico===user&&!esBloq))&&(
              <button style={Object.assign({},btnO(eb,er,"1.5px solid #F5B8B3"),{fontWeight:700})} onClick={function(){
                if(esFijo){
                  if(window.confirm("Se enviara una solicitud para liberar este horario. Quedara pendiente de aprobacion de la admin."))onEliminar(ev);
                } else {
                  if(window.confirm("Cancelar esta hora extra?"))onEliminar(ev);
                }
              }}>
                {esFijo?"Solicitar liberar horario":"Cancelar hora extra"}
              </button>
            )}
            <button style={btnO(wh,tx,"1.5px solid #C9E4EF")} onClick={onClose}>Cerrar</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={sOverlay} onClick={onClose}>
      <div style={sModal} onClick={function(e){e.stopPropagation();}}>
        <div style={sModH}>
          <h3 style={{margin:0,color:tx}}>{parseLocalDate(slot.date).toLocaleDateString("es-AR")}</h3>
          <button style={sXBtn} onClick={onClose}>X</button>
        </div>
        {role==="admin"&&(
          <div style={{display:"flex",borderBottom:"1.5px solid #C9E4EF"}}>
            <button style={{flex:1,padding:"9px 4px",border:"none",background:"transparent",color:tipo==="bloquear"?br:mu,cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:tipo==="bloquear"?700:400,borderBottom:tipo==="bloquear"?"2px solid #4BA3C3":"none"}} onClick={function(){setTipo("bloquear");}}>Bloquear</button>
            <button style={{flex:1,padding:"9px 4px",border:"none",background:"transparent",color:tipo==="reservar"?br:mu,cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:tipo==="reservar"?700:400,borderBottom:tipo==="reservar"?"2px solid #4BA3C3":"none"}} onClick={function(){setTipo("reservar");}}>Hora extra</button>
            <button style={{flex:1,padding:"9px 4px",border:"none",background:"transparent",color:tipo==="fijo"?br:mu,cursor:"pointer",fontFamily:"inherit",fontSize:12,fontWeight:tipo==="fijo"?700:400,borderBottom:tipo==="fijo"?"2px solid #4BA3C3":"none"}} onClick={function(){setTipo("fijo");}}>Horario fijo</button>
          </div>
        )}
        <div style={{padding:20,display:"flex",flexDirection:"column",gap:12}}>
          {tipo==="fijo"&&(
            <div>
              <label style={sLbl}>Dia de la semana (se repite cada semana)</label>
              <select style={sInp} value={diaSemana} onChange={function(e){setDiaSemana(Number(e.target.value));}}>
                {[1,2,3,4,5,6].map(function(d){return <option key={d} value={d}>{DIAS[d]}</option>;})}
              </select>
            </div>
          )}
          <div style={{display:"flex",gap:10}}>
            <div style={{flex:1}}><label style={sLbl}>Desde</label><input style={sInp} type="time" value={ini} onChange={function(e){setIni(e.target.value);}}/></div>
            <div style={{flex:1}}><label style={sLbl}>Hasta</label><input style={sInp} type="time" value={fin} onChange={function(e){setFin(e.target.value);}}/></div>
          </div>
          <div>
            <label style={sLbl}>Consultorio</label>
            <select style={sInp} value={cons} onChange={function(e){setCons(e.target.value);}}>
              {CONS.map(function(c){return <option key={c.id} value={c.id}>{c.id} - {c.sn}</option>;})}
            </select>
          </div>
          {(tipo==="reservar"||tipo==="fijo")&&(
            <div>
              <label style={sLbl}>Psicologa</label>
              {role==="admin"
                ?<select style={sInp} value={psico} onChange={function(e){setPsico(e.target.value);}}>{psicos.map(function(p){return <option key={p.id}>{p.nombre}</option>;})}</select>
                :<input style={sInp} value={user} disabled/>
              }
            </div>
          )}
          {conflicto&&(
            <div style={{background:eb,border:"1px solid #F5B8B3",borderRadius:8,padding:"10px 12px",color:er,fontSize:13,fontWeight:600}}>
              {conflicto}
            </div>
          )}
          {!conflicto&&(tipo==="fijo"||tipo==="reservar")&&ini&&fin&&toMin(fin)>toMin(ini)&&(
            <div style={{background:ob,border:"1px solid #A7E3C0",borderRadius:8,padding:"8px 12px",color:ok,fontSize:13}}>
              "Horario disponible" - <b>{ars(pr.sub)}</b>{tipo==="fijo"?"/sem":""}
            </div>
          )}
          <button style={Object.assign({},btn(br,wh),{opacity:conflicto?0.4:1})} disabled={!!conflicto} onClick={function(){
            if(tipo==="bloquear") onBloquear({fecha:slot.date,inicio:ini,fin:fin,consultorio:cons});
            else if(tipo==="fijo"){const c=CONS.find(function(x){return x.id===cons;});onAgregarFijo({diaSemana:Number(diaSemana),inicio:ini,fin:fin,consultorio:cons,sede:c?c.sede:"VL",psico:psico});}
            else onReservar({fecha:slot.date,inicio:ini,fin:fin,consultorio:cons,psico:role==="psico"?user:psico});
          }}>
            {tipo==="bloquear"?"Bloquear":tipo==="fijo"?"Agregar horario fijo":(role==="admin"?"Agregar hora extra":"Enviar solicitud")}
          </button>
        </div>
      </div>
    </div>
  );
}

function NuevaModal({user,onReservar,onClose,horarios,reservas}) {
  const [fecha,setFecha] = useState("");
  const [ini,setIni] = useState("09:00");
  const [fin,setFin] = useState("12:00");
  const [cons,setCons] = useState("C1");

  function getDiaSemana() {
    // JS: 0=Dom,1=Lun...6=Sab -> our system: 1=Lun...6=Sab,7=Dom
    if(!fecha) return 0;
    const d = parseLocalDate(fecha);
    const jsDay = d.getDay();
    return jsDay===0 ? 7 : jsDay;
  }

  function checkConflicto() {
    if(!fecha||!ini||!fin||toMin(fin)<=toMin(ini)) return null;
    const sMin=toMin(ini), eMin=toMin(fin);
    const jd=getDiaSemana();
    const fijos=(horarios||[]).filter(function(x){
      if(x.consultorio!==cons) return false;
      if(Number(x.diaSemana)!==jd) return false;
      return sMin<toMin(x.fin)&&eMin>toMin(x.inicio);
    });
    const extras=(reservas||[]).filter(function(x){
      if(x.fecha!==fecha||x.consultorio!==cons) return false;
      if(x.estado!=="aprobada"&&x.estado!=="pendiente") return false;
      return sMin<toMin(x.fin)&&eMin>toMin(x.inicio);
    });
    return fijos.concat(extras).length>0?"Ese horario esta ocupado en "+cons:null;
  }

  function getLibres() {
    if(!fecha||!ini||!fin||toMin(fin)<=toMin(ini)) return [];
    const sMin=toMin(ini), eMin=toMin(fin);
    const jd=getDiaSemana();
    return CONS.filter(function(c){
      if(c.id===cons) return false;
      const ocupFijo=(horarios||[]).some(function(x){
        return x.consultorio===c.id&&Number(x.diaSemana)===jd&&sMin<toMin(x.fin)&&eMin>toMin(x.inicio);
      });
      const ocupExtra=(reservas||[]).some(function(x){
        return x.fecha===fecha&&x.consultorio===c.id&&(x.estado==="aprobada"||x.estado==="pendiente")&&sMin<toMin(x.fin)&&eMin>toMin(x.inicio);
      });
      return !ocupFijo&&!ocupExtra;
    });
  }

  const conflicto = checkConflicto();
  const libres = conflicto ? getLibres() : [];
  const horas = Math.max((toMin(fin)-toMin(ini))/60,0);

  return (
    <div style={sOverlay} onClick={onClose}>
      <div style={sModal} onClick={function(e){e.stopPropagation();}}>
        <div style={sModH}>
          <h3 style={{margin:0,color:tx}}>Nueva solicitud</h3>
          <button style={sXBtn} onClick={onClose}>X</button>
        </div>
        <div style={{padding:20,display:"flex",flexDirection:"column",gap:12}}>
          <div><label style={sLbl}>Fecha</label><input style={sInp} type="date" value={fecha} onChange={function(e){setFecha(e.target.value);}}/></div>
          <div style={{display:"flex",gap:10}}>
            <div style={{flex:1}}><label style={sLbl}>Desde</label><input style={sInp} type="time" value={ini} onChange={function(e){setIni(e.target.value);}}/></div>
            <div style={{flex:1}}><label style={sLbl}>Hasta</label><input style={sInp} type="time" value={fin} onChange={function(e){setFin(e.target.value);}}/></div>
          </div>
          <div><label style={sLbl}>Consultorio</label>
            <select style={sInp} value={cons} onChange={function(e){setCons(e.target.value);}}>
              {CONS.map(function(c){return <option key={c.id} value={c.id}>{c.id} - {c.sn}</option>;})}
            </select>
          </div>
          {conflicto && (
            <div style={{background:eb,border:"1px solid #F5B8B3",borderRadius:8,padding:"10px 12px",color:er,fontSize:13}}>
              <b>{conflicto}</b>
              {libres.length>0 && (
                <div style={{marginTop:8}}>
                  <div style={{fontSize:12,marginBottom:6,color:tx}}>Consultorios disponibles:</div>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    {libres.map(function(c){return(
                      <button key={c.id} style={{background:ob,color:ok,border:"1px solid #A7E3C0",borderRadius:8,padding:"5px 12px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}} onClick={function(){setCons(c.id);}}>
                        {c.id} - {c.sede==="VL"?"Vic. Lopez":"Uruguay"}
                      </button>
                    );})}
                  </div>
                </div>
              )}
            </div>
          )}
          {!conflicto && horas>0 && (
            <div style={{background:bg,borderRadius:8,padding:10,color:mu,fontSize:12,border:"1px solid #C9E4EF"}}>
              {horas.toFixed(1)}hs - Requiere aprobacion - <b style={{color:ok}}>{ars(calcPrecio(ini,fin).sub)}</b>

            </div>
          )}
          <button
            style={Object.assign({},btn(br,wh),{opacity:(conflicto||!fecha)?0.4:1})}
            disabled={!!(conflicto||!fecha)}
            onClick={function(){onReservar({fecha:fecha,inicio:ini,fin:fin,consultorio:cons,psico:user});}}>
            Enviar solicitud
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Perfiles ─────────────────────────────────────────────────
function PerfilesView({psicos,setPsicos,gc,role,notify,perfilSel,setPerfilSel}) {
  const [eid,setEid] = useState(null);
  const [form,setForm] = useState({});
  function save() { saveDoc("psicos",eid,Object.assign({},form)); setEid(null); notify("Perfil actualizado"); }
  return (
    <>
    <div>
      <h2 style={{color:tx,fontSize:20,fontWeight:800,marginBottom:16}}>Psicologas</h2>
      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:12}}>
        {psicos.map(function(p) {
          return (
            <div key={p.id} style={{background:wh,borderRadius:14,padding:16,display:"flex",flexDirection:"column",alignItems:"center",gap:8,border:"1.5px solid #C9E4EF",textAlign:"center",cursor:role==="psico"?"pointer":"default"}} onClick={function(){if(role==="psico"&&eid!==p.id)setPerfilSel(p);}}>
              <div style={{width:48,height:48,borderRadius:"50%",background:gc(p.nombre),color:wh,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:20}}>
                {p.nombre[0].toUpperCase()}
              </div>
              {eid===p.id ? (
                <div style={{display:"flex",flexDirection:"column",gap:8,width:"100%"}}>
                  <input style={sInp} value={form.nombre||""} onChange={function(e){setForm(function(f){return Object.assign({},f,{nombre:e.target.value});});}} placeholder="Nombre"/>
                  <input style={sInp} value={form.wa||""} onChange={function(e){setForm(function(f){return Object.assign({},f,{wa:e.target.value});});}} placeholder="WhatsApp (549...)"/>
                  <input style={sInp} value={form.email||""} onChange={function(e){setForm(function(f){return Object.assign({},f,{email:e.target.value});});}} placeholder="Email"/>
                  <div>
                    <label style={sLbl}>Descuento %</label>
                    <input style={sInp} type="number" min="0" max="100" value={form.descuento||0} onChange={function(e){setForm(function(f){return Object.assign({},f,{descuento:Number(e.target.value)});});}}/>
                  </div>
                  <div>
                    <label style={sLbl}>Nota privada (solo vos la ves)</label>
                    <textarea style={Object.assign({},sInp,{minHeight:60,resize:"vertical",fontSize:13})} value={form.nota||""} onChange={function(e){setForm(function(f){return Object.assign({},f,{nota:e.target.value});});}} placeholder="Anotaciones internas sobre esta psicologa..."/>
                  </div>
                  <label style={{display:"flex",alignItems:"center",gap:6,color:tx,fontSize:13}}>
                    <input type="checkbox" checked={form.disponible||false} onChange={function(e){setForm(function(f){return Object.assign({},f,{disponible:e.target.checked});});}}/>
                    Disponible para derivaciones
                  </label>
                  <div style={{display:"flex",gap:8}}>
                    <button style={btn(br,wh)} onClick={save}>Guardar</button>
                    <button style={btnO(wh,tx,"1.5px solid #C9E4EF")} onClick={function(){setEid(null);}}>Cancelar</button>
                  </div>
                </div>
              ) : (
                <div style={{width:"100%"}}>
                  <div style={{color:tx,fontWeight:700,fontSize:14}}>{p.nombre}</div>
                  {role==="admin" && p.wa && <div style={{color:mu,fontSize:12}}>WA: {p.wa}</div>}
                  {role==="admin" && p.email && <div style={{color:mu,fontSize:12}}>Mail: {p.email}</div>}
                  {(p.analisis||[]).length>0 && (
                    <div style={{display:"flex",flexWrap:"wrap",gap:4,justifyContent:"center",marginTop:6}}>
                      {(p.analisis||[]).map(function(a){return <span key={a} style={{background:lt,color:dk,fontSize:10,padding:"2px 8px",borderRadius:20,fontWeight:600}}>{a}</span>;})}
                    </div>
                  )}
                  {(p.poblacion||[]).length>0 && (
                    <div style={{color:mu,fontSize:11,marginTop:4}}>{(p.poblacion||[]).join(" · ")}</div>
                  )}
                  <div style={{display:"flex",flexWrap:"wrap",gap:4,justifyContent:"center",marginTop:6}}>
                    <span style={bge(p.disponible?ob:eb,p.disponible?ok:er)}>{p.disponible?"Disponible para derivar":"No disponible"}</span>
                  </div>
                  {role==="admin" && (
                    <div style={{display:"flex",flexWrap:"wrap",gap:4,justifyContent:"center",marginTop:4}}>
                      {p.fijas && <span style={bge(lt,dk)}>Fijos</span>}
                      {(p.descuento||0)>0 && <span style={bge(eb,er)}>{p.descuento}% desc.</span>}
                    </div>
                  )}
                  {role==="admin" && p.nota && (
                    <div style={{background:bg,borderRadius:8,padding:"8px 10px",fontSize:12,color:mu,textAlign:"left",width:"100%",marginTop:4,border:"1px solid #C9E4EF"}}>
                      {p.nota}
                    </div>
                  )}
                  {role==="admin" && (
                    <button style={Object.assign({},btnO(wh,tx,"1.5px solid #C9E4EF"),{fontSize:12,marginTop:8})} onClick={function(){setEid(p.id);setForm(Object.assign({},p));}}>Editar</button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
      {perfilSel && (
        <div style={{position:"fixed",inset:0,background:"rgba(28,58,74,.45)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:100}} onClick={function(){setPerfilSel(null);}}>
          <div style={{background:wh,borderRadius:18,width:"min(420px,95vw)",border:"1.5px solid #C9E4EF",boxShadow:"0 24px 60px rgba(75,163,195,.18)",maxHeight:"90vh",overflowY:"auto"}} onClick={function(e){e.stopPropagation();}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"18px 22px",borderBottom:"1px solid #EBF6FA"}}>
              <h3 style={{margin:0,color:tx}}>Perfil</h3>
              <button style={{background:bg,border:"none",color:mu,fontSize:18,cursor:"pointer",borderRadius:8,width:30,height:30,fontFamily:"inherit"}} onClick={function(){setPerfilSel(null);}}>X</button>
            </div>
            <div style={{padding:24,display:"flex",flexDirection:"column",gap:14,alignItems:"center"}}>
              <div style={{width:72,height:72,borderRadius:"50%",background:gc(perfilSel.nombre),color:wh,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:30}}>
                {perfilSel.nombre[0].toUpperCase()}
              </div>
              <div style={{textAlign:"center"}}>
                <div style={{color:tx,fontWeight:800,fontSize:20}}>{perfilSel.nombre}</div>
                <span style={{background:perfilSel.disponible?ob:eb,color:perfilSel.disponible?ok:er,fontSize:12,padding:"3px 12px",borderRadius:20,fontWeight:600,marginTop:6,display:"inline-block"}}>{perfilSel.disponible?"Disponible para derivaciones":"No disponible"}</span>
              </div>
              {(perfilSel.analisis||[]).length>0 && (
                <div style={{width:"100%"}}>
                  <div style={{color:mu,fontSize:11,fontWeight:700,textTransform:"uppercase",marginBottom:8}}>Tipo de analisis</div>
                  <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                    {perfilSel.analisis.map(function(a){return <span key={a} style={{background:lt,color:dk,fontSize:12,padding:"4px 12px",borderRadius:20,fontWeight:600}}>{a}</span>;})}
                  </div>
                </div>
              )}
              {(perfilSel.poblacion||[]).length>0 && (
                <div style={{width:"100%"}}>
                  <div style={{color:mu,fontSize:11,fontWeight:700,textTransform:"uppercase",marginBottom:8}}>Poblacion</div>
                  <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                    {perfilSel.poblacion.map(function(p){return <span key={p} style={{background:bg,color:tx,fontSize:12,padding:"4px 12px",borderRadius:20,border:"1px solid #C9E4EF"}}>{p}</span>;})}
                  </div>
                </div>
              )}
              {(perfilSel.wa||perfilSel.email) && (
                <div style={{width:"100%",display:"flex",flexDirection:"column",gap:8}}>
                  <div style={{color:mu,fontSize:11,fontWeight:700,textTransform:"uppercase"}}>Contacto</div>
                  {perfilSel.wa && (
                    <button style={{background:"#25D366",color:wh,border:"none",borderRadius:12,padding:"12px 16px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit",display:"flex",alignItems:"center",justifyContent:"center",gap:8}} onClick={function(){
                      const wa = perfilSel.wa||"";
                      const tel = wa.startsWith("+") ? wa : (wa ? "+"+wa : "");
                      const msg = perfilSel.nombre+" - Consultorio Gloria Videla"+(tel?"\nTel: "+tel:"")+(perfilSel.email?"\nEmail: "+perfilSel.email:"");
                      const a = document.createElement("a");
                      a.href = "https://wa.me/?text="+encodeURIComponent(msg);
                      a.target = "_blank";
                      document.body.appendChild(a); a.click(); document.body.removeChild(a);
                    }}>
                      Compartir por WhatsApp
                    </button>
                  )}
                  {perfilSel.email && (
                    <button style={{background:"#3b82f6",color:wh,border:"none",borderRadius:12,padding:"12px 16px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}} onClick={function(){
                      const a=document.createElement("a");a.href="mailto:"+perfilSel.email;document.body.appendChild(a);a.click();document.body.removeChild(a);
                    }}>
                      Enviar email
                    </button>
                  )}
                  {!perfilSel.wa && !perfilSel.email && <div style={{color:mu,fontSize:13}}>Sin datos de contacto cargados.</div>}
                </div>
              )}
              {!perfilSel.wa && !perfilSel.email && (
                <div style={{color:mu,fontSize:13,textAlign:"center"}}>Sin datos de contacto cargados aun.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Anuncios ─────────────────────────────────────────────────
function AnunciosView({anuncios,setAnuncios,user,role,psicos,notify}) {
  const [txt,setTxt] = useState("");
  function pub() {
    if(!txt.trim()) return;
    const a={id:Date.now(),texto:txt.trim(),fecha:new Date().toISOString(),autor:user,para:"todas",excluir:null,leidos:[user]};
    saveDoc("anuncios",a.id,a);
    setTxt(""); notify("Anuncio publicado");
  }
  function sWA(p,t) {
    if(!p.wa){notify("Sin WA: "+p.nombre,"err");return;}
    openLink("https://wa.me/"+p.wa+"?text="+encodeURIComponent("Anuncio Consultorio GV:\n\n"+t),"_blank");
  }
  const mios = anuncios.filter(function(a){return role==="admin"||(a.para==="todas"?a.excluir!==user:a.para===user);});
  return (
    <div>
      <h2 style={{color:tx,fontSize:20,fontWeight:800,marginBottom:16}}>Anuncios</h2>
      {role==="admin" && (
        <div style={Object.assign({},sPanel,{marginBottom:20})}>
          <div style={{color:mu,fontSize:11,fontWeight:700,textTransform:"uppercase",marginBottom:12}}>Nuevo anuncio</div>
          <textarea style={Object.assign({},sInp,{minHeight:80,resize:"vertical"})} value={txt} onChange={function(e){setTxt(e.target.value);}} placeholder="Ej: Se corto la luz en Uruguay, vuelve en 2 horas..."/>
          <div style={{display:"flex",gap:10,marginTop:12,flexWrap:"wrap"}}>
            <button style={btn(br,wh)} onClick={pub}>Publicar en app</button>
            <button style={{background:"#25D366",color:wh,border:"none",borderRadius:10,padding:"9px 16px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}} onClick={function(){if(txt.trim())psicos.filter(function(p){return p.wa;}).forEach(function(p,i){setTimeout(function(){sWA(p,txt);},i*700);});}}>WA a todas</button>
          </div>
        </div>
      )}
      {!mios.length && <div style={{color:mu,textAlign:"center",padding:40}}>Sin anuncios todavia.</div>}
      {mios.map(function(a) {
        const leido = (a.leidos||[]).includes(user);
        return (
          <div key={a.id} style={{background:leido?wh:"#F0FDF4",border:leido?"1.5px solid #C9E4EF":"1.5px solid #A7E3C0",borderRadius:12,padding:"14px 16px",marginBottom:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
              <div style={{color:mu,fontSize:11}}>
                {a.autor} - {parseLocalDate(a.fecha.split("T")[0]).toLocaleString("es-AR",{day:"2-digit",month:"2-digit",hour:"2-digit",minute:"2-digit"})}
                {!leido && <span style={Object.assign({},bge(ob,ok),{marginLeft:8})}>Nuevo</span>}
              </div>
              <div style={{display:"flex",gap:6}}>
                {!leido && <button style={Object.assign({},btnO(wh,tx,"1.5px solid #C9E4EF"),{fontSize:11,padding:"3px 8px"})} onClick={function(){saveDoc("anuncios",a.id,Object.assign({},a,{leidos:(a.leidos||[]).concat([user])}));}}>Leido</button>}
                {role==="admin" && <button style={{background:"#25D366",color:wh,border:"none",borderRadius:7,padding:"3px 8px",fontSize:11,cursor:"pointer"}} onClick={function(){psicos.filter(function(p){return p.wa;}).forEach(function(p,i){setTimeout(function(){sWA(p,a.texto);},i*700);});}}>WA</button>}
                {role==="admin" && <button style={Object.assign({},btnO(eb,er,"1.5px solid #F5B8B3"),{fontSize:11,padding:"3px 8px"})} onClick={function(){delDoc("anuncios",a.id);}}>X</button>}
              </div>
            </div>
            <div style={{color:tx,fontSize:14,lineHeight:1.6}}>{a.texto}</div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Solicitudes ──────────────────────────────────────────────
function SolicitudesView({reservas,setReservas,gc,notify}) {
  const pend = reservas.filter(function(r){return r.estado==="pendiente";});
  const hist = reservas.filter(function(r){return r.estado!=="pendiente";});
  return (
    <div>
      <h2 style={{color:tx,fontSize:20,fontWeight:800,marginBottom:16}}>Solicitudes de reserva</h2>
      {!pend.length && <div style={{color:mu,textAlign:"center",padding:40}}>Sin solicitudes pendientes</div>}
      {pend.map(function(r) {
        return (
          <div key={r.id} style={sCard}>
            <div style={{width:36,height:36,borderRadius:"50%",background:gc(r.psico),color:wh,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,flexShrink:0}}>
              {r.psico && r.psico[0]}
            </div>
            <div style={{flex:1}}>
              <div style={{color:tx,fontWeight:700}}>{r.psico}</div>
              <div style={{color:mu,fontSize:13}}>{parseLocalDate(r.fecha||slot_date_fallback).toLocaleDateString("es-AR")} - {r.consultorio} - {r.inicio}-{r.fin}</div>
              <div style={{color:mu,fontSize:12}}>{calcHrs(r.inicio,r.fin)}hs - {ars(calcPrecio(r.inicio,r.fin).sub)}</div>
            </div>
            <div style={{display:"flex",gap:8}}>
              <button style={Object.assign({},btn(br,wh),{fontSize:12,padding:"6px 12px"})} onClick={function(){saveDoc("reservas",r.id,Object.assign({},r,{estado:"aprobada"}));notify("Aprobada");}}>OK</button>
              <button style={Object.assign({},btnO(eb,er,"1.5px solid #F5B8B3"),{fontSize:12,padding:"6px 12px"})} onClick={function(){saveDoc("reservas",r.id,Object.assign({},r,{estado:"rechazada"}));notify("Rechazada");}}>X</button>
            </div>
          </div>
        );
      })}
      {hist.length>0 && (
        <div>
          <h3 style={{color:mu,margin:"20px 0 10px"}}>Historial</h3>
          {hist.map(function(r) {
            return (
              <div key={r.id} style={Object.assign({},sCard,{opacity:.65})}>
                <div style={{flex:1}}>
                  <div style={{color:tx,fontWeight:700}}>{r.psico} - {r.consultorio}</div>
                  <div style={{color:mu,fontSize:13}}>{parseLocalDate(r.fecha||slot_date_fallback).toLocaleDateString("es-AR")} - {r.inicio}-{r.fin}</div>
                </div>
                <span style={bge(r.estado==="aprobada"?ob:eb,r.estado==="aprobada"?ok:er)}>{r.estado==="aprobada"?"Aprobada":"Rechazada"}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Cambios Horario ──────────────────────────────────────────
function procesarPagoConfirmado(s, cfg) {
  confirmarPago(s);
  var tel = s.tel || "";
  if(!tel) return;
  var slots2 = s.slots || [];
  var parts = [];
  parts.push("Bienvenida " + s.nombre + " al Consultorio Gloria Videla!");
  if(slots2.length > 0) {
    var hs = slots2.map(function(sl){ return DIAS[sl.dia] + " " + sl.cons + " " + sl.ini + "-" + sl.fin; });
    parts.push("Horarios: " + hs.join(", "));
  }
  parts.push("Usuario: " + s.nombre + " / Contrasena: psico123");
  if(cfg && cfg.flyer) parts.push("Reglas: " + cfg.flyer);
  var encoded = parts.map(function(p){ return encodeURIComponent(p); }).join("%0A%0A");
  var a = document.createElement("a");
  a.href = "https://wa.me/" + tel + "?text=" + encoded;
  a.target = "_blank";
  document.body.appendChild(a);
  a.click();
  setTimeout(function(){ document.body.removeChild(a); }, 500);
}

function confirmarPago(s) {
  var config2 = {};
  try { config2 = window.__gvConfig || {}; } catch(e) {}
  var newId = "px" + Date.now();
  var newP = {id:newId, nombre:s.nombre, wa:s.tel||"", email:s.email||"", analisis:[], poblacion:[], disponible:true, fijas:false, descuento:0, nota:"Desde solicitud invitada", pass:"psico123"};
  saveDoc("psicos", newId, newP);
  (s.slots||[]).forEach(function(sl) {
    var c = CONS.find(function(x){ return x.id===sl.cons; });
    var hId = "h" + Date.now() + Math.floor(Math.random()*99999);
    saveDoc("horarios", hId, {id:hId, psico:s.nombre, consultorio:sl.cons, diaSemana:Number(sl.dia), inicio:sl.ini, fin:sl.fin, sede:c?c.sede:"VL"});
  });
  saveDoc("solHor", s.id, Object.assign({}, s, {estado:"completada", fechaRes:new Date().toISOString()}));
}

function CambiosView({solicitudes,setSolicitudes,horarios,setHorarios,reservas,setReservas,setAnuncios,notify,config,psicos,setPsicos}) {
  const [notas,setNotas] = useState({});
  const pend = solicitudes.filter(function(s){return s.estado==="pendiente"&&s.tipo!=="invitada";});
  const pendInv = solicitudes.filter(function(s){return s.estado==="pendiente"&&s.tipo==="invitada";});
  const hist = solicitudes.filter(function(s){return s.estado!=="pendiente";});

  function aprobar(s) {
    if(s.accion==="eliminar"&&s.tipo==="fijo"){const h=horarios.find(function(x){return x.id===s.horarioId;});delDoc("horarios",s.horarioId);if(h){const an={id:Date.now(),texto:"Se libero: "+DIAS[h.diaSemana]+" "+h.inicio+"-"+h.fin+" en "+h.consultorio+". Puede estar disponible!",fecha:new Date().toISOString(),autor:"Sistema",para:"todas",excluir:s.psico,leidos:[]};saveDoc("anuncios",an.id,an);}}
    else if(s.accion==="modificar"&&s.tipo==="fijo"){const c=CONS.find(function(x){return x.id===s.datos.consultorio;});const h=horarios.find(function(x){return x.id===s.horarioId;});if(h)saveDoc("horarios",s.horarioId,Object.assign({},h,s.datos,{sede:c?c.sede:h.sede,diaSemana:Number(s.datos.diaSemana)}));}
    else if(s.accion==="agregar"&&s.tipo==="fijo"){const c=CONS.find(function(x){return x.id===s.datos.consultorio;});const h=Object.assign({},s.datos,{id:"h"+Date.now(),psico:s.psico,sede:c?c.sede:"VL",diaSemana:Number(s.datos.diaSemana)});saveDoc("horarios",h.id,h);}
    else if(s.accion==="eliminar"&&s.tipo==="extra")delDoc("reservas",s.reservaId);
    else if(s.accion==="agregar"&&s.tipo==="extra"){const r=Object.assign({},s.datos,{id:Date.now(),psico:s.psico,estado:"aprobada",solicitante:s.psico,tipo:"extra"});saveDoc("reservas",r.id,r);}
    saveDoc("solHor",s.id,Object.assign({},s,{estado:"aprobada",fechaRes:new Date().toISOString()}));
    notify("Aprobado");
  }
  function rechazar(id) {
    const s=solicitudes.find(function(x){return x.id===id;});
    if(s)saveDoc("solHor",id,Object.assign({},s,{estado:"rechazada",nota:notas[id]||"",fechaRes:new Date().toISOString()}));
    notify("Rechazado");
  }

  function lbl(s) { return (s.accion==="agregar"?"Agregar":s.accion==="modificar"?"Modificar":"Eliminar")+" horario "+s.tipo; }
  function det(s) {
    if(s.datos && s.datos.diaSemana) return DIAS[s.datos.diaSemana]+" "+s.datos.inicio+"-"+s.datos.fin+" "+s.datos.consultorio;
    if(s.horarioId) { const h=horarios.find(function(x){return x.id===s.horarioId;}); if(h) return DIAS[h.diaSemana]+" "+h.inicio+"-"+h.fin+" "+h.consultorio; }
    return "";
  }

  return (
    <div>
      <h2 style={{color:tx,fontSize:20,fontWeight:800,marginBottom:16}}>Solicitudes de Horario</h2>
      {/* Invitadas que ya pagaron - confirmar y crear perfil */}
      {solicitudes.filter(function(s){return s.tipo==="invitada"&&s.estado==="aprobada-pago";}).length>0 && (
        <div style={{marginBottom:20}}>
          <div style={{color:ok,fontWeight:700,fontSize:13,marginBottom:10}}>Esperando confirmacion de pago</div>
          {solicitudes.filter(function(s){return s.tipo==="invitada"&&s.estado==="aprobada-pago";}).map(function(s){return(
            <div key={s.id} style={Object.assign({},sPanel,{marginBottom:10,border:"1.5px solid #A7E3C0"})}>
              <div style={{color:tx,fontWeight:700,fontSize:15,marginBottom:4}}>{s.nombre}</div>
              <div style={{color:mu,fontSize:13,marginBottom:10}}>
                {(s.slots||[]).map(function(sl,i){return <div key={i}>{DIAS[sl.dia]} {sl.cons} {sl.ini}-{sl.fin}</div>;})}
                <div style={{color:ok,fontWeight:600}}>{ars(s.costoSemanal||0)}/semana</div>
              </div>
              <button style={Object.assign({},btn(ok,wh),{width:"100%",fontSize:13})} onClick={function(){ procesarPagoConfirmado(s,config); }}>
                Confirmar pago y crear perfil
              </button>
            </div>
          );})}
        </div>
      )}

      {pendInv.length>0 && (
        <div style={{marginBottom:20}}>
          <div style={{color:er,fontWeight:700,fontSize:13,marginBottom:10}}>Solicitudes de nuevas psicologas ({pendInv.length})</div>
          {pendInv.map(function(s){return(
            <div key={s.id} style={Object.assign({},sPanel,{marginBottom:10,border:"1.5px solid #F5B8B3"})}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                <div>
                  <div style={{color:tx,fontWeight:700,fontSize:15}}>{s.nombre}</div>
                  <div style={{color:mu,fontSize:12}}>WA: {s.tel}{s.email?" | "+s.email:""}</div>
                </div>
                <div style={{color:mu,fontSize:11}}>{parseLocalDate(s.fechaSol.split("T")[0]).toLocaleDateString("es-AR")}</div>
              </div>
              <div style={{background:bg,borderRadius:8,padding:"10px 12px",marginBottom:10,border:"1px solid #C9E4EF"}}>
                {(s.slots||[{consultorio:s.consultorio,dia:"-",ini:s.inicio,fin:s.fin}]).map(function(sl,si){return(
                  <div key={si} style={{color:tx,fontSize:13,padding:"3px 0"}}>
                    {DIAS[sl.dia]||sl.dia} - {sl.cons||sl.consultorio} - {sl.ini||sl.inicio}-{sl.fin} ({Math.max((toMin(sl.fin||sl.fin)-toMin(sl.ini||sl.inicio))/60,0).toFixed(1)}hs)
                  </div>
                );})}
                <div style={{color:ok,fontWeight:700,marginTop:4}}>{ars(s.costoSemanal||s.costo||0)}/sem - {(s.totalHoras||s.horas||0).toFixed(1)}hs totales</div>
              </div>
              <div style={{display:"flex",gap:8}}>
                <button style={Object.assign({},btn(br,wh),{flex:1,fontSize:13})} onClick={function(){
                  const tr=config&&config.transferencia?config.transferencia:{};
                  const resumen=(s.slots||[]).map(function(sl){return DIAS[sl.dia]+" "+sl.cons+" "+sl.ini+"-"+sl.fin;}).join("\n");
                  const msg="Hola "+s.nombre+"! Tu solicitud de horarios fijos fue aprobada.\n\nHorarios:\n"+resumen+"\n\nTotal semanal: "+((s.totalHoras||0).toFixed(1))+"hs - "+ars(s.costoSemanal||0)+"/semana\n\nPara confirmar, realizá la transferencia a:\nTitular: "+(tr.titular||"")+"\nCBU: "+(tr.cbu||"")+"\nAlias: "+(tr.alias||"")+"\nBanco: "+(tr.banco||"")+"\n\nEsperamos tu comprobante por WhatsApp.";
                  const a=document.createElement("a"); a.href="https://wa.me/"+s.tel+"?text="+encodeURIComponent(msg); a.target="_blank"; document.body.appendChild(a); a.click(); document.body.removeChild(a);
                  saveDoc("solHor",s.id,Object.assign({},s,{estado:"aprobada-pago",fechaRes:new Date().toISOString()}));
                  notify("Solicitud aprobada - datos enviados por WA");
                }}>Aprobar y enviar datos</button>
                <button style={Object.assign({},btnO(eb,er,"1.5px solid #F5B8B3"),{flex:1,fontSize:13})} onClick={function(){saveDoc("solHor",s.id,Object.assign({},s,{estado:"rechazada",fechaRes:new Date().toISOString()}));notify("Rechazada");}}>Rechazar</button>
              </div>
            </div>
          );})}
        </div>
      )}
      {!pend.length && !pendInv.length && <div style={{color:mu,textAlign:"center",padding:40}}>Sin cambios pendientes</div>}
      {pend.map(function(s) {
        return (
          <div key={s.id} style={Object.assign({},sPanel,{marginBottom:12})}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
              <div>
                <span style={{color:tx,fontWeight:700,fontSize:15}}>{s.psico}</span>
                <br/>
                <span style={bge(lt,dk)}>{lbl(s)}</span>
              </div>
              <div style={{color:mu,fontSize:12}}>{new Date(s.fechaSol).toLocaleDateString("es-AR")}</div>
            </div>
            <div style={{background:bg,borderRadius:8,padding:10,color:tx,fontSize:13,marginBottom:12,border:"1px solid #C9E4EF"}}>{det(s)}</div>
            <div style={{display:"flex",gap:10,alignItems:"center"}}>
              <button style={Object.assign({},btn(br,wh),{padding:"7px 14px",fontSize:13})} onClick={function(){aprobar(s);}}>Aprobar</button>
              <input style={Object.assign({},sInp,{flex:1,fontSize:12})} placeholder="Motivo de rechazo" value={notas[s.id]||""} onChange={function(e){setNotas(function(n){return Object.assign({},n,{[s.id]:e.target.value});});}}/>
              <button style={Object.assign({},btnO(eb,er,"1.5px solid #F5B8B3"),{padding:"7px 14px",fontSize:13})} onClick={function(){rechazar(s.id);}}>Rechazar</button>
            </div>
          </div>
        );
      })}
      {hist.length>0 && (
        <div>
          <h3 style={{color:mu,margin:"20px 0 10px"}}>Historial</h3>
          {hist.map(function(s) {
            return (
              <div key={s.id} style={Object.assign({},sCard,{opacity:.65})}>
                <div style={{flex:1}}>
                  <span style={{color:tx,fontWeight:600}}>{s.psico}</span>
                  <span style={{color:mu,fontSize:12}}> - {lbl(s)} - {det(s)}</span>
                </div>
                <span style={bge(s.estado==="aprobada"?ob:eb,s.estado==="aprobada"?ok:er)}>{s.estado==="aprobada"?"OK":"X"}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Facturacion ──────────────────────────────────────────────
function FactView({psicos,calcFact,genMsg,notify}) {
  // Historial: last 6 months data for selected psico
  const now = new Date();
  const [mes,setMes] = useState(now.getMonth());
  const [anio,setAnio] = useState(now.getFullYear());
  const [sel,setSel] = useState(null);
  const [vista,setVista] = useState("mes"); // "mes" | "historial"
  const ps = sel ? psicos.find(function(p){return p.nombre===sel;}) : null;

  // Generate last 6 months
  function ultimos6() {
    const meses = [];
    for(var i=5; i>=0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth()-i, 1);
      meses.push({mes:d.getMonth(), anio:d.getFullYear()});
    }
    return meses;
  }
  const res = ps ? calcFact(ps,mes,anio) : {total:0,tf:0,te:0,df:[],de:[],bruto:0,desc:0,montoDesc:0};
  const msg = ps ? genMsg(ps,mes,anio) : "";

  function sWA() { if(!ps||!ps.wa){notify("Sin WhatsApp","err");return;} openLink("https://wa.me/"+ps.wa+"?text="+encodeURIComponent(msg),"_blank"); }
  function sMail() {
    const dest = ps && ps.email ? ps.email : "";
    openLink("mailto:"+dest+"?subject=Facturacion "+MESES[mes]+" "+anio+" - "+(ps?ps.nombre:"")+"&body="+encodeURIComponent(msg));
  }
  function sAllWA() {
    const cWA = psicos.filter(function(p){return p.wa;});
    const sinWA = psicos.filter(function(p){return !p.wa;});
    if(sinWA.length) notify(sinWA.map(function(p){return p.nombre;}).join(", ")+" sin WA","err");
    cWA.forEach(function(p,i){setTimeout(function(){const m=genMsg(p,mes,anio);openLink("https://wa.me/"+p.wa+"?text="+encodeURIComponent(m),"_blank");},i*800);});
    if(cWA.length) notify("Enviando a "+cWA.length+" psicologas");
  }

  return (
    <div>
      <h2 style={{color:tx,fontSize:20,fontWeight:800,marginBottom:12}}>Facturacion</h2>
      <h2 style={{color:tx,fontSize:20,fontWeight:800,marginBottom:12}}>Facturacion</h2>
      <div style={{display:"flex",borderBottom:"1.5px solid #C9E4EF",marginBottom:16}}>
        <button style={{flex:1,padding:"10px",border:"none",background:"transparent",color:vista==="mes"?br:mu,cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:vista==="mes"?700:500,borderBottom:vista==="mes"?"2px solid #4BA3C3":"2px solid transparent"}} onClick={function(){setVista("mes");}}>Mes actual</button>
        <button style={{flex:1,padding:"10px",border:"none",background:"transparent",color:vista==="historial"?br:mu,cursor:"pointer",fontFamily:"inherit",fontSize:13,fontWeight:vista==="historial"?700:500,borderBottom:vista==="historial"?"2px solid #4BA3C3":"2px solid transparent"}} onClick={function(){setVista("historial");}}>Historial</button>
      </div>

      {vista==="historial" && ps && (
        <div>
          <div style={{color:tx,fontSize:16,fontWeight:700,marginBottom:16}}>{ps.nombre} - Ultimos 6 meses</div>
          {ultimos6().map(function(m) {
            const r = calcFact(ps,m.mes,m.anio);
            return (
              <div key={m.mes+"-"+m.anio} style={{background:wh,borderRadius:12,padding:"14px 16px",marginBottom:10,border:"1.5px solid #C9E4EF"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{color:tx,fontWeight:700,fontSize:14}}>{MESES[m.mes]} {m.anio}</div>
                    <div style={{color:mu,fontSize:12}}>
                      {r.df.length>0?"Fijos: "+ars(r.tf)+" ":""}
                      {r.de.length>0?"Extras: "+ars(r.te):""}
                      {r.desc>0?" - Desc "+r.desc+"%":""}
                    </div>
                  </div>
                  <div style={{color:r.total>0?ok:mu,fontWeight:700,fontSize:18}}>{ars(r.total)}</div>
                </div>
                {r.total>0 && (
                  <div style={{marginTop:8}}>
                    <button style={{background:"#25D366",color:wh,border:"none",borderRadius:8,padding:"5px 12px",fontSize:12,fontWeight:700,cursor:"pointer"}} onClick={function(){if(ps.wa)openLink("https://wa.me/"+ps.wa+"?text="+encodeURIComponent(genMsg(ps,m.mes,m.anio)),"_blank");else notify("Sin WhatsApp","err");}}>WA</button>
                  </div>
                )}
              </div>
            );
          })}
          {!ps && <div style={{color:mu,textAlign:"center",padding:40}}>Selecciona una psicologa de la lista</div>}
        </div>
      )}
      {vista==="historial" && !ps && (
        <div style={{color:mu,textAlign:"center",padding:40}}>Selecciona una psicologa de la lista para ver su historial</div>
      )}

      {vista==="mes" && (
        <div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
          <select style={Object.assign({},sInp,{width:"auto"})} value={mes} onChange={function(e){setMes(Number(e.target.value));}}>{MESES.map(function(m,i){return <option key={i} value={i}>{m}</option>;})}</select>
          <select style={Object.assign({},sInp,{width:"auto"})} value={anio} onChange={function(e){setAnio(Number(e.target.value));}}>{[2025,2026,2027].map(function(y){return <option key={y}>{y}</option>;})}</select>
          <button style={{background:"#25D366",color:wh,border:"none",borderRadius:10,padding:"9px 14px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}} onClick={sAllWA}>WA a todas</button>
        </div>
      <div style={{display:"flex",flexDirection:"column",gap:16}}>
        <div style={sPanel}>
          <div style={{color:mu,fontSize:11,fontWeight:700,textTransform:"uppercase",marginBottom:12}}>Psicologas</div>
          {psicos.map(function(p) {
            const r = calcFact(p,mes,anio);
            const act = sel===p.nombre;
            return (
              <div key={p.id} style={{padding:"10px 12px",borderRadius:8,cursor:"pointer",marginBottom:4,display:"flex",justifyContent:"space-between",alignItems:"center",background:act?lt:"transparent"}} onClick={function(){setSel(p.nombre);}}>
                <div>
                  <div style={{color:tx,fontWeight:600,fontSize:13}}>{p.nombre}</div>
                  <div style={{color:mu,fontSize:11}}>
                    {p.fijas?"Fijos: "+ars(r.tf):"Solo extras"}
                    {r.desc>0 && " - "+r.desc+"% desc."}
                  </div>
                </div>
                <div style={{color:r.total>0?ok:mu,fontWeight:700,fontSize:13}}>{ars(r.total)}</div>
              </div>
            );
          })}
        </div>
        {ps && (
          <div style={sPanel}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
              <div>
                <div style={{color:tx,fontSize:18,fontWeight:700}}>{ps.nombre}</div>
                <div style={{color:mu,fontSize:13}}>{MESES[mes]} {anio}</div>
              </div>
              <div style={{textAlign:"right"}}>
                {ps.fijas && <div style={{color:mu,fontSize:12}}>Fijos: <b style={{color:dk}}>{ars(res.tf)}</b></div>}
                {res.te>0 && <div style={{color:mu,fontSize:12}}>Extras: <b style={{color:dk}}>{ars(res.te)}</b></div>}
                {res.desc>0 && <div style={{color:er,fontSize:12}}>Desc {res.desc}%: <b>-{ars(res.montoDesc)}</b></div>}
                <div style={{color:ok,fontSize:20,fontWeight:700}}>{ars(res.total)}</div>
              </div>
            </div>
            {ps.fijas && res.df.length>0 && (
              <div style={{marginBottom:16}}>
                <div style={{color:dk,fontSize:12,fontWeight:700,textTransform:"uppercase",marginBottom:8}}>Horarios Fijos</div>
                {res.df.map(function(d,i) {
                  return (
                    <div key={i} style={{background:bg,borderRadius:8,padding:"10px 12px",marginBottom:6,border:"1px solid #C9E4EF"}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                        <div>
                          <div style={{color:tx,fontSize:13,fontWeight:600}}>{DIAS[d.diaSemana]} - {d.cons}</div>
                          <div style={{color:mu,fontSize:12}}>{d.ini}-{d.fin} ({typeof d.horas==="number"?d.horas.toFixed(1):d.horas}hs)</div>
                          {d.ley && <div style={{color:dk,fontSize:12,fontWeight:600}}>{d.ley}</div>}
                          {d.des && <div style={{color:mu,fontSize:11}}>{d.des}</div>}
                          <div style={{color:mu,fontSize:11}}>x {d.sem} {DIAS[d.diaSemana]}s en {MESES[mes]} = {ars(d.sub)}</div>
                        </div>
                        <div style={{color:ok,fontWeight:700,fontSize:15,flexShrink:0}}>{ars(d.sub)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {res.de.length>0 && (
              <div style={{marginBottom:16}}>
                <div style={{color:mu,fontSize:12,fontWeight:700,textTransform:"uppercase",marginBottom:8}}>Adicionales</div>
                {res.de.map(function(d,i) {
                  return (
                    <div key={i} style={{background:bg,borderRadius:8,padding:"10px 12px",marginBottom:6,border:"1px solid #C9E4EF"}}>
                      <div style={{display:"flex",justifyContent:"space-between"}}>
                        <div style={{color:tx,fontSize:13,fontWeight:600}}>{parseLocalDate(d.fecha).toLocaleDateString("es-AR")} - {d.cons} - {d.ini}-{d.fin}</div>
                        <div style={{color:ok,fontWeight:700}}>{ars(d.sub)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <div style={{background:bg,borderRadius:10,padding:14,marginBottom:14,border:"1px solid #C9E4EF"}}>
              <div style={{color:mu,fontSize:11,fontWeight:700,marginBottom:8}}>MENSAJE:</div>
              <pre style={{color:tx,fontSize:11,whiteSpace:"pre-wrap",fontFamily:"monospace",margin:0}}>{msg}</pre>
            </div>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              <button style={{background:"#25D366",color:wh,border:"none",borderRadius:10,padding:"9px 16px",fontSize:13,fontWeight:700,cursor:"pointer",flex:1}} onClick={sWA}>WA</button>
              <button style={{background:"#3b82f6",color:wh,border:"none",borderRadius:10,padding:"9px 16px",fontSize:13,fontWeight:700,cursor:"pointer",flex:1}} onClick={sMail}>Mail</button>
            </div>
            <div style={{display:"flex",gap:10,marginTop:8}}>
              <button style={Object.assign({},btnO(wh,tx,"1.5px solid #C9E4EF"),{flex:1,fontSize:12})} onClick={function(){
                if(navigator.clipboard){navigator.clipboard.writeText(msg).then(function(){notify("Copiado al portapapeles");});}
                else{const ta=document.createElement("textarea");ta.value=msg;document.body.appendChild(ta);ta.select();document.execCommand("copy");document.body.removeChild(ta);notify("Copiado");}
              }}>Copiar texto</button>
              <button style={Object.assign({},btnO(wh,tx,"1.5px solid #C9E4EF"),{flex:1,fontSize:12})} onClick={function(){
                const blob=new Blob([msg],{type:"text/plain"});
                const url=URL.createObjectURL(blob);
                const a=document.createElement("a");
                a.href=url;
                a.download="Facturacion_"+(ps?ps.nombre:"")+"_"+MESES[mes]+"_"+anio+".txt";
                a.click();
                URL.revokeObjectURL(url);
              }}>Descargar .txt</button>
            </div>
          </div>
        )}
      </div>
        </div>
      )}
    </div>
  );
}

// ─── Precios ──────────────────────────────────────────────────
function PreciosView({tabP,setTabP,psicos,notify}) {
  const [selId,setSelId] = useState(null);
  const [showNew,setShowNew] = useState(false);
  const [nf,setNf] = useState({label:"",vigencia:"",p:Object.assign({},PD)});
  const sel = selId ? tabP.find(function(t){return t.id===selId;}) : null;
  const hoy = new Date().toISOString().split("T")[0];
  const CAMPOS = [
    {k:"man",l:"Hora manana (8-14hs)"},{k:"tar",l:"Hora tarde (14-18hs)"},{k:"noc",l:"Hora noche (18-21hs)"},
    {k:"m1",l:"Modulo 1 Manana"},{k:"m2",l:"Modulo 2 Tarde"},{k:"m3",l:"Modulo 3 Noche"},
    {k:"dia",l:"Por Dia (8-21hs)"},{k:"sM",l:"Sabado Manana"},{k:"sT",l:"Sabado Tarde"}
  ];
  function saveNew() {
    if(!nf.label||!nf.vigencia){notify("Completa nombre y vigencia","err");return;}
    setTabP(function(p){return p.concat([Object.assign({id:"tp"+Date.now()},nf)]).sort(function(a,b){return a.vigencia.localeCompare(b.vigencia);});});
    setShowNew(false); setNf({label:"",vigencia:"",p:Object.assign({},PD)}); notify("Tabla creada");
  }
  function updSel(k,v) { setTabP(function(p){return p.map(function(t){return t.id!==selId?t:Object.assign({},t,{p:Object.assign({},t.p,{[k]:Number(v)})});});}); }
  function sWA(ps) {
    if(!ps.wa){notify("Sin WA: "+ps.nombre,"err");return;}
    if(!sel) return;
    const P=sel.p;
    const m = "Hola "+ps.nombre+"!\n\nNuevos precios - "+sel.label+"\nVigencia: "+new Date(sel.vigencia+"T12:00:00").toLocaleDateString("es-AR")+"\n\nHoras sueltas:\n- Manana: "+ars(P.man)+"/hs\n- Tarde: "+ars(P.tar)+"/hs\n- Noche: "+ars(P.noc)+"/hs\n\nModulos:\n- M1 Manana: "+ars(P.m1)+"\n- M2 Tarde: "+ars(P.m2)+"\n- M3 Noche: "+ars(P.m3)+"\n- Por Dia: "+ars(P.dia)+"\nGracias!";
    openLink("https://wa.me/"+ps.wa+"?text="+encodeURIComponent(m),"_blank");
  }
  return (
    <div>
      <h2 style={{color:tx,fontSize:20,fontWeight:800,marginBottom:12}}>Tabla de Precios</h2>
      <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
        <button style={btn(br,wh)} onClick={function(){setShowNew(true);setSelId(null);}}>+ Nueva tabla</button>
        {sel && <button style={{background:"#25D366",color:wh,border:"none",borderRadius:10,padding:"9px 16px",fontSize:13,fontWeight:700,cursor:"pointer"}} onClick={function(){psicos.filter(function(p){return p.wa;}).forEach(function(p,i){setTimeout(function(){sWA(p);},i*800);});}}>WA a todas</button>}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:16}}>
        <div style={sPanel}>
          {tabP.slice().reverse().map(function(t) {
            const act2 = selId===t.id;
            return (
              <div key={t.id} style={{padding:"10px 12px",borderRadius:8,cursor:"pointer",marginBottom:4,display:"flex",justifyContent:"space-between",alignItems:"center",background:act2?lt:"transparent"}} onClick={function(){setSelId(t.id);setShowNew(false);}}>
                <div>
                  <div style={{color:tx,fontSize:13,fontWeight:600}}>{t.label}</div>
                  <div style={{color:mu,fontSize:11}}>Desde {new Date(t.vigencia+"T12:00:00").toLocaleDateString("es-AR")}</div>
                </div>
                <span style={bge(t.vigencia<=hoy?ob:lt,t.vigencia<=hoy?ok:dk)}>{t.vigencia<=hoy?"Activa":"Futura"}</span>
              </div>
            );
          })}
        </div>
        {showNew && (
          <div style={sPanel}>
            <div style={{color:mu,fontSize:11,fontWeight:700,textTransform:"uppercase",marginBottom:12}}>Nueva tabla</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:14}}>
              <div><label style={sLbl}>Nombre</label><input style={sInp} value={nf.label} onChange={function(e){setNf(function(f){return Object.assign({},f,{label:e.target.value});});}} placeholder="Ej: Tabla jun-26"/></div>
              <div><label style={sLbl}>Vigencia desde</label><input style={sInp} type="date" value={nf.vigencia} onChange={function(e){setNf(function(f){return Object.assign({},f,{vigencia:e.target.value});});}}/></div>
            </div>
            {CAMPOS.map(function(c) {
              return (
                <div key={c.k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid #C9E4EF"}}>
                  <div style={{color:tx,fontSize:13}}>{c.l}</div>
                  <input style={Object.assign({},sInp,{width:120,textAlign:"right"})} type="number" value={nf.p[c.k]} onChange={function(e){setNf(function(f){return Object.assign({},f,{p:Object.assign({},f.p,{[c.k]:Number(e.target.value)})});});}}/>
                </div>
              );
            })}
            <div style={{display:"flex",gap:10,marginTop:14}}>
              <button style={btn(br,wh)} onClick={saveNew}>Guardar</button>
              <button style={btnO(wh,tx,"1.5px solid #C9E4EF")} onClick={function(){setShowNew(false);}}>Cancelar</button>
            </div>
          </div>
        )}
        {sel && !showNew && (
          <div style={sPanel}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
              <div>
                <div style={{color:tx,fontSize:18,fontWeight:700}}>{sel.label}</div>
                <div style={{color:mu,fontSize:13}}>Vigente desde {new Date(sel.vigencia+"T12:00:00").toLocaleDateString("es-AR")}</div>
              </div>
              <button style={Object.assign({},btnO(eb,er,"1.5px solid #F5B8B3"),{fontSize:12})} onClick={function(){if(!window.confirm("Eliminar?"))return;setTabP(function(p){return p.filter(function(t){return t.id!==selId;});});setSelId(null);notify("Eliminada");}}>Eliminar</button>
            </div>
            {CAMPOS.map(function(c) {
              return (
                <div key={c.k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 0",borderBottom:"1px solid #C9E4EF"}}>
                  <div style={{color:tx,fontSize:13}}>{c.l}</div>
                  <input style={Object.assign({},sInp,{width:120,textAlign:"right"})} type="number" value={sel.p[c.k]} onChange={function(e){updSel(c.k,e.target.value);}}/>
                </div>
              );
            })}
            <div style={{marginTop:20}}>
              <div style={{color:mu,fontSize:11,fontWeight:700,textTransform:"uppercase",marginBottom:10}}>Enviar a psicologas</div>
              {psicos.map(function(p) {
                return (
                  <div key={p.id} style={Object.assign({},sCard,{padding:"10px 14px",marginBottom:8})}>
                    <div style={{flex:1,color:tx,fontWeight:600}}>{p.nombre}{!p.wa&&" (sin WA)"}</div>
                    <button style={{background:"#25D366",color:wh,border:"none",borderRadius:7,padding:"5px 12px",fontSize:12,cursor:"pointer",fontWeight:600}} onClick={function(){sWA(p);}}>WA</button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Gestion ──────────────────────────────────────────────────
function GestionPsicoRow({p,setPsicos,horarios,setHorarios,notify}) {
  const [editPass,setEditPass] = useState(false);
  const [newPass,setNewPass] = useState("");
  const [editNombre,setEditNombre] = useState(false);
  const [newNombre,setNewNombre] = useState(p.nombre);
  function saveNombre() {
    if(!newNombre.trim()||newNombre.trim()===p.nombre){setEditNombre(false);return;}
    const oldNombre=p.nombre; const nn=newNombre.trim();
    saveDoc("psicos",p.id,Object.assign({},p,{nombre:nn}));
    // Update all horarios with old name
    (horarios||[]).filter(function(h){return h.psico&&h.psico.toLowerCase()===oldNombre.toLowerCase();})
      .forEach(function(h){saveDoc("horarios",h.id,Object.assign({},h,{psico:nn}));});
    setEditNombre(false); notify("Nombre actualizado en perfil y horarios");
  }
  function savePass() {
    if(newPass.length < 4) { notify("Minimo 4 caracteres","err"); return; }
    setPsicos(function(ps){return ps.map(function(x){return x.id===p.id?Object.assign({},x,{pass:newPass}):x;});});
    setNewPass(""); setEditPass(false); notify("Contrasena actualizada");
  }
  return (
    <div style={sCard}>
      <div style={{flex:1}}>
        {editNombre?(
          <div style={{display:"flex",gap:6,marginBottom:6}}>
            <input style={Object.assign({},sInp,{flex:1,padding:"4px 8px",fontSize:13})} value={newNombre} onChange={function(e){setNewNombre(e.target.value);}} autoFocus/>
            <button style={Object.assign({},btn(ok,wh),{padding:"4px 12px",fontSize:13})} onClick={saveNombre}>OK</button>
            <button style={Object.assign({},btnO(wh,mu,"1px solid #C9E4EF"),{padding:"4px 10px",fontSize:13})} onClick={function(){setEditNombre(false);setNewNombre(p.nombre);}}>X</button>
          </div>
        ):(
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <b style={{color:tx}}>{p.nombre}</b>
            <button style={{background:"transparent",border:"none",color:mu,fontSize:11,cursor:"pointer",fontFamily:"inherit",textDecoration:"underline"}} onClick={function(){setEditNombre(true);setNewNombre(p.nombre);}}>editar nombre</button>
          </div>
        )}
        <span style={Object.assign({},bge(p.fijas?lt:bg,p.fijas?dk:mu),{marginLeft:0})}>{p.fijas?"Fijos":"Solo extras"}</span>
        {editPass && (
          <div style={{display:"flex",gap:8,marginTop:8,alignItems:"center"}}>
            <input style={Object.assign({},sInp,{flex:1,fontSize:12})} type="password" value={newPass} onChange={function(e){setNewPass(e.target.value);}} placeholder="Nueva contrasena..." onKeyDown={function(e){if(e.key==="Enter")savePass();}}/>
            <button style={Object.assign({},btn(br,wh),{fontSize:12,padding:"6px 12px"})} onClick={savePass}>Guardar</button>
            <button style={Object.assign({},btnO(wh,tx,"1.5px solid #C9E4EF"),{fontSize:12,padding:"6px 12px"})} onClick={function(){setEditPass(false);setNewPass("");}}>X</button>
          </div>
        )}
      </div>
      <div style={{display:"flex",gap:6,flexShrink:0}}>
        <button style={Object.assign({},btnO(wh,tx,"1.5px solid #C9E4EF"),{fontSize:12,padding:"4px 10px"})} onClick={function(){setEditPass(function(v){return !v;});setNewPass("");}}>Contrasena</button>
        <button style={Object.assign({},btnO(eb,er,"1.5px solid #F5B8B3"),{fontSize:12,padding:"4px 10px"})} onClick={function(){
              if(!window.confirm("Eliminar a "+p.nombre+"?\nTambien se eliminaran sus horarios fijos.")) return;
              delDoc("psicos",p.id);
              horarios.filter(function(h){return h.psico&&h.psico.toLowerCase()===p.nombre.toLowerCase();})
                .forEach(function(h){delDoc("horarios",h.id);});
              notify("Psicologa y horarios eliminados");
            }}>X</button>
      </div>
    </div>
  );
}

function HorarioFormInline({data,setData,onSave,onCancel}) {
  const pr = calcPrecio(data.inicio,data.fin);
  return (
    <div style={{background:bg,borderRadius:10,padding:16,marginBottom:12,border:"2px solid #4BA3C3"}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
        <div>
          <label style={sLbl}>Dia</label>
          <select style={sInp} value={data.diaSemana} onChange={function(e){setData(function(d){return Object.assign({},d,{diaSemana:Number(e.target.value)});});}}>
            {[1,2,3,4,5,6].map(function(d){return <option key={d} value={d}>{DIAS[d]}</option>;})}
          </select>
        </div>
        <div>
          <label style={sLbl}>Consultorio</label>
          <select style={sInp} value={data.consultorio} onChange={function(e){const c=CONS.find(function(x){return x.id===e.target.value;});setData(function(d){return Object.assign({},d,{consultorio:e.target.value,sede:c?c.sede:d.sede});});}}>
            {CONS.map(function(c){return <option key={c.id} value={c.id}>{c.id} - {c.sn}</option>;})}
          </select>
        </div>
        <div>
          <label style={sLbl}>Desde</label>
          <input style={sInp} type="time" value={data.inicio} onChange={function(e){setData(function(d){return Object.assign({},d,{inicio:e.target.value});});}}/>
        </div>
        <div>
          <label style={sLbl}>Hasta</label>
          <input style={sInp} type="time" value={data.fin} onChange={function(e){setData(function(d){return Object.assign({},d,{fin:e.target.value});});}}/>
        </div>
      </div>
      <div style={{background:wh,borderRadius:6,padding:"6px 10px",marginBottom:10,fontSize:12,color:mu,border:"1px solid #C9E4EF"}}>
        {pr.ley||pr.des||pr.horas+"hs"} - {ars(pr.sub)}/sem
      </div>
      <div style={{display:"flex",gap:8}}>
        <button style={Object.assign({},btn(br,wh),{fontSize:13,padding:"7px 14px"})} onClick={onSave}>Guardar</button>
        <button style={Object.assign({},btnO(wh,tx,"1.5px solid #C9E4EF"),{fontSize:13,padding:"7px 14px"})} onClick={onCancel}>Cancelar</button>
      </div>
    </div>
  );
}

function GestionView({psicos,setPsicos,horarios,setHorarios,bloques,setBloques,notify}) {
  const [gt,setGt] = useState("horarios");
  const [selP,setSelP] = useState(null);
  const [eid,setEid] = useState(null);
  const [ef,setEf] = useState({});
  const [showAdd,setShowAdd] = useState(false);
  const [nh,setNh] = useState({diaSemana:1,inicio:"09:00",fin:"14:00",consultorio:"C1",sede:"VL"});
  const [nn,setNn] = useState("");

  const misH = selP ? horarios.filter(function(h){return h.psico.toLowerCase()===selP.toLowerCase();}).sort(function(a,b){return a.diaSemana-b.diaSemana||a.inicio.localeCompare(b.inicio);}) : [];

  function addH() {
    const c=CONS.find(function(x){return x.id===nh.consultorio;});
    const h=Object.assign({},nh,{id:"h"+Date.now(),psico:selP,sede:c?c.sede:"VL",diaSemana:Number(nh.diaSemana)});
    saveDoc("horarios",h.id,h);
    setShowAdd(false); notify("Horario fijo agregado");
  }
  function saveEdit() {
    const c=CONS.find(function(x){return x.id===ef.consultorio;});
    saveDoc("horarios",eid,Object.assign({},ef,{sede:c?c.sede:ef.sede,diaSemana:Number(ef.diaSemana)}));
    setEid(null); notify("Actualizado");
  }
  function addPsico() {
    if(!nn.trim()) return;
    const newId = "px"+Date.now();
    setPsicos(function(p){return p.concat([{id:newId,nombre:nn,wa:"",analisis:[],poblacion:[],disponible:true,fijas:false,descuento:0,nota:"",email:"",pass:"psico123"}]);});
    setNn(""); notify("Agregada");
  }

  const tabBtn = function(active) {
    return {flex:1,padding:"10px",border:"none",background:"transparent",color:active?br:mu,cursor:"pointer",fontSize:13,fontWeight:active?700:500,fontFamily:"inherit",borderBottom:active?"2px solid #4BA3C3":"2px solid transparent"};
  };

  return (
    <div>
      <h2 style={{color:tx,fontSize:20,fontWeight:800,marginBottom:16}}>Gestion</h2>
      <div style={{display:"flex",borderBottom:"1.5px solid #C9E4EF",marginBottom:16}}>
        <button style={tabBtn(gt==="horarios")} onClick={function(){setGt("horarios");}}>Horarios</button>
        <button style={tabBtn(gt==="psicologas")} onClick={function(){setGt("psicologas");}}>Psicologas</button>
        <button style={tabBtn(gt==="bloques")} onClick={function(){setGt("bloques");}}>Bloques</button>
      </div>
      {gt==="horarios" && (
        <div>
          {!selP && (
            <div>
              <div style={{color:mu,fontSize:12,marginBottom:12}}>Selecciona una psicologa</div>
              {psicos.map(function(p) {
                return (
                  <div key={p.id} style={Object.assign({},sCard,{cursor:"pointer"})} onClick={function(){setSelP(p.nombre);setEid(null);setShowAdd(false);}}>
                    <div style={{flex:1}}>
                      <div style={{color:tx,fontWeight:700}}>{p.nombre}</div>
                      <div style={{color:mu,fontSize:12}}>{horarios.filter(function(h){return h.psico.toLowerCase()===p.nombre.toLowerCase();}).length} horarios fijos</div>
                    </div>
                    <span style={{color:mu,fontSize:18}}>›</span>
                  </div>
                );
              })}
            </div>
          )}
          {selP && (
            <div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                <div>
                  <button style={{background:"transparent",border:"none",color:mu,cursor:"pointer",fontSize:13,fontFamily:"inherit"}} onClick={function(){setSelP(null);}}>&lt; Volver</button>
                  <b style={{color:tx,fontSize:16}}> {selP}</b>
                </div>
                <button style={Object.assign({},btn(br,wh),{fontSize:12,padding:"6px 12px"})} onClick={function(){setShowAdd(true);setEid(null);}}>+ Agregar</button>
              </div>
              {showAdd && <HorarioFormInline data={nh} setData={setNh} onSave={addH} onCancel={function(){setShowAdd(false);}}/>}
              {!misH.length && !showAdd && <div style={{color:mu,textAlign:"center",padding:40}}>Sin horarios fijos.</div>}
              {misH.map(function(h) {
                return (
                  <div key={h.id} style={{background:bg,borderRadius:10,padding:"12px 14px",marginBottom:8,border:"1px solid #C9E4EF"}}>
                    {eid===h.id ? (
                      <HorarioFormInline data={ef} setData={setEf} onSave={saveEdit} onCancel={function(){setEid(null);}}/>
                    ) : (
                      <div style={{display:"flex",alignItems:"center",gap:12}}>
                        <div style={{flex:1}}>
                          <div style={{color:tx,fontWeight:600,fontSize:14}}>{DIAS[h.diaSemana]} - {h.inicio}-{h.fin}</div>
                          <div style={{color:mu,fontSize:12}}>{h.consultorio} - {ars(calcPrecio(h.inicio,h.fin).sub)}/sem</div>
                        </div>
                        <div style={{display:"flex",gap:6}}>
                          <button style={Object.assign({},btnO(wh,tx,"1.5px solid #C9E4EF"),{fontSize:12,padding:"5px 10px"})} onClick={function(){setEid(h.id);setEf(Object.assign({},h));}}>Editar</button>
                          <button style={Object.assign({},btnO(eb,er,"1.5px solid #F5B8B3"),{fontSize:12,padding:"5px 10px"})} onClick={function(){delDoc("horarios",h.id);notify("Eliminado");}}>X</button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
      {gt==="psicologas" && (
        <div style={sPanel}>
          <div style={{display:"flex",gap:10,marginBottom:20}}>
            <input style={Object.assign({},sInp,{flex:1})} value={nn} onChange={function(e){setNn(e.target.value);}} placeholder="Nombre de la psicologa" onKeyDown={function(e){if(e.key==="Enter")addPsico();}}/>
            <button style={btn(br,wh)} onClick={addPsico}>Agregar</button>
          </div>
          {psicos.map(function(p) {
            return (
              <GestionPsicoRow key={p.id} p={p} setPsicos={setPsicos} horarios={horarios} setHorarios={setHorarios} notify={notify}/>
            );
          })}
        </div>
      )}
      {gt==="bloques" && (
        <div style={sPanel}>
          {!bloques.length
            ? <div style={{color:mu,textAlign:"center",padding:40}}>Sin bloques. Crea uno desde el calendario.</div>
            : bloques.map(function(b) {
              return (
                <div key={b.id} style={sCard}>
                  <div style={{flex:1}}>
                    <div style={{color:tx}}>{b.consultorio} - {parseLocalDate(b.fecha).toLocaleDateString("es-AR")}</div>
                    <div style={{color:mu,fontSize:13}}>{b.inicio}-{b.fin}{b.motivo?" - "+b.motivo:""}</div>
                  </div>
                  <button style={Object.assign({},btnO(eb,er,"1.5px solid #F5B8B3"),{fontSize:12,padding:"4px 10px"})} onClick={function(){delDoc("bloques",b.id);notify("Eliminado");}}>Eliminar</button>
                </div>
              );
            })
          }
        </div>
      )}
    </div>
  );
}

// ─── Mis Reservas ─────────────────────────────────────────────
function MisReservasView({reservas,onNew}) {
  return (
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
        <h2 style={{color:tx,fontSize:20,fontWeight:800,margin:0}}>Mis Reservas</h2>
        <button style={btn(br,wh)} onClick={onNew}>+ Nueva</button>
      </div>
      {!reservas.length && <div style={{color:mu,textAlign:"center",padding:40}}>Sin reservas aun.</div>}
      {reservas.map(function(r) {
        return (
          <div key={r.id} style={sCard}>
            <div style={{flex:1}}>
              <div style={{color:tx,fontWeight:700}}>{r.consultorio} - {parseLocalDate(r.fecha||slot_date_fallback).toLocaleDateString("es-AR")}</div>
              <div style={{color:mu,fontSize:13}}>{r.inicio}-{r.fin} - {calcHrs(r.inicio,r.fin)}hs</div>
            </div>
            <span style={bge(r.estado==="aprobada"?ob:r.estado==="rechazada"?eb:lt,r.estado==="aprobada"?ok:r.estado==="rechazada"?er:dk)}>
              {r.estado==="aprobada"?"Aprobada":r.estado==="rechazada"?"Rechazada":"Pendiente"}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Mis Horarios ─────────────────────────────────────────────
function MisHorariosView({user,horarios,reservas,solicitudes,setSolicitudes,notify}) {
  const [mH,setMH] = useState(null);
  const [vistos,setVistos] = useState([]);
  const [showHist,setShowHist] = useState(false);
  const mF = horarios.filter(function(h){return h.psico&&user&&h.psico.trim().toLowerCase()===user.trim().toLowerCase();}).sort(function(a,b){return a.diaSemana-b.diaSemana||a.inicio.localeCompare(b.inicio);});
  const mE = reservas.filter(function(r){return r.psico===user&&r.estado==="aprobada"&&r.tipo==="extra"&&r.fecha>=new Date().toISOString().split("T")[0];});
  const mS = solicitudes.filter(function(s){return s.psico===user;}).sort(function(a,b){return b.fechaSol.localeCompare(a.fechaSol);});

  function sol(tipo,accion,datos,hId,rId) {
    const s={id:Date.now(),psico:user,tipo:tipo,accion:accion,datos:datos,horarioId:hId||null,reservaId:rId||null,estado:"pendiente",fechaSol:new Date().toISOString()};
    saveDoc("solHor",s.id,s);
    notify("Solicitud enviada"); setMH(null);
  }

  const pend = mS.filter(function(s){return s.estado==="pendiente";});
  const recientes = mS.filter(function(s){return s.estado!=="pendiente"&&s.fechaRes&&!vistos.includes(s.id);});
  const historial = mS.filter(function(s){return s.estado!=="pendiente"&&(s.fechaRes||vistos.includes(s.id));});

  return (
    <div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
        <h2 style={{color:tx,fontSize:20,fontWeight:800,margin:0}}>Mis Horarios</h2>
        <button style={btn(br,wh)} onClick={function(){setMH({type:"add"});}}>+ Solicitar</button>
      </div>
      {pend.length>0 && (
        <div style={{background:lt,borderRadius:10,padding:14,marginBottom:16,border:"1px solid #C9E4EF"}}>
          <div style={{color:dk,fontWeight:700,fontSize:13,marginBottom:8}}>Solicitudes pendientes de aprobacion</div>
          {pend.map(function(s) {
            return (
              <div key={s.id} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid #C9E4EF"}}>
                <div style={{color:tx,fontSize:13}}>
                  {s.accion==="agregar"?"Agregar":s.accion==="modificar"?"Modificar":"Liberar"} horario
                  {s.datos&&s.datos.diaSemana?" - "+DIAS[s.datos.diaSemana]+" "+s.datos.inicio+"-"+s.datos.fin:""}
                </div>
                <button
                  style={{background:"transparent",border:"none",color:er,fontSize:12,cursor:"pointer",fontFamily:"inherit",padding:"2px 8px",fontWeight:600}}
                  onClick={function(){if(window.confirm("Cancelar esta solicitud?"))delDoc("solHor",s.id);}}>
                  Cancelar
                </button>
              </div>
            );
          })}
        </div>
      )}
      {recientes.map(function(s) {
        return (
          <div key={s.id} style={{background:s.estado==="aprobada"?ob:eb,borderRadius:10,padding:"12px 14px",marginBottom:10,border:s.estado==="aprobada"?"1px solid #A7E3C0":"1px solid #F5B8B3",display:"flex",alignItems:"flex-start",gap:10}}>
            <div style={{flex:1}}>
              <div style={{color:s.estado==="aprobada"?ok:er,fontWeight:700,fontSize:13}}>
                {s.estado==="aprobada"?"Solicitud aprobada":"Solicitud rechazada"}
              </div>
              <div style={{color:mu,fontSize:12,marginTop:2}}>
                {s.accion==="agregar"?"Agregar":s.accion==="modificar"?"Modificar":"Liberar"} horario
                {s.datos&&s.datos.diaSemana?" - "+DIAS[s.datos.diaSemana]+" "+s.datos.inicio+"-"+s.datos.fin:""}
                {s.nota?" - Motivo: "+s.nota:""}
              </div>
            </div>
            <button onClick={function(){setVistos(function(v){return v.concat([s.id]);});}} style={{background:"transparent",border:"none",color:mu,fontSize:16,cursor:"pointer",padding:"0 4px",lineHeight:1,fontFamily:"inherit"}}>X</button>
          </div>
        );
      })}
      {historial.length>0 && (
        <div style={{marginBottom:16}}>
          <button onClick={function(){setShowHist(function(v){return !v;});}} style={{background:"transparent",border:"none",color:mu,fontSize:12,cursor:"pointer",fontFamily:"inherit",textDecoration:"underline",padding:0}}>
            {showHist?"Ocultar historial":"Ver historial ("+historial.length+")"}
          </button>
          {showHist && historial.map(function(s) {
            return (
              <div key={s.id} style={{background:bg,borderRadius:8,padding:"10px 12px",marginTop:8,border:"1px solid #C9E4EF"}}>
                <div style={{color:s.estado==="aprobada"?ok:er,fontWeight:600,fontSize:12}}>
                  {s.estado==="aprobada"?"Aprobada":"Rechazada"} - {s.accion==="agregar"?"Agregar":s.accion==="modificar"?"Modificar":"Liberar"} horario
                  {s.datos&&s.datos.diaSemana?" - "+DIAS[s.datos.diaSemana]+" "+s.datos.inicio+"-"+s.datos.fin:""}
                </div>
                {s.fechaRes&&<div style={{color:mu,fontSize:11}}>{new Date(s.fechaRes).toLocaleDateString("es-AR")}</div>}
              </div>
            );
          })}
        </div>
      )}
      <div style={{marginBottom:20}}>
        <div style={{color:dk,fontSize:12,fontWeight:700,textTransform:"uppercase",marginBottom:10}}>Horarios Fijos</div>
        {!mF.length && <div style={{color:mu,fontSize:13}}>Sin horarios fijos.</div>}
        {mF.map(function(h) {
          return (
            <div key={h.id} style={{background:wh,borderRadius:12,padding:"14px 16px",marginBottom:10,border:"1.5px solid #C9E4EF"}}>
              <div style={{marginBottom:8}}>
                <div style={{color:tx,fontWeight:700,fontSize:14}}>{DIAS[h.diaSemana]}</div>
                <div style={{color:tx,fontSize:13}}>{h.inicio} - {h.fin} ({calcHrs(h.inicio,h.fin).toFixed(1)}hs)</div>
                {(function(){
                  const pr=calcPrecio(h.inicio,h.fin);
                  return <div style={{color:mu,fontSize:12}}>{h.consultorio} - {pr.ley?<span style={{color:dk,fontWeight:600}}>{pr.ley} = {ars(pr.sub)}/sem</span>:<span>{pr.des||ars(pr.sub)}/sem</span>}</div>;
                })()}
              </div>
              <div style={{display:"flex",gap:8}}>
                <button style={Object.assign({},btnO(wh,tx,"1.5px solid #C9E4EF"),{flex:1,fontSize:13,padding:"8px 10px"})} onClick={function(){setMH({type:"edit",h:h});}}>Modificar</button>
                <button style={Object.assign({},btnO(eb,er,"1.5px solid #F5B8B3"),{flex:1,fontSize:13,padding:"8px 10px"})} onClick={function(){setMH({type:"del",h:h});}}>Liberar horario</button>
              </div>
            </div>
          );
        })}
      </div>
      <div>
        <div style={{color:mu,fontSize:12,fontWeight:700,textTransform:"uppercase",marginBottom:10}}>Horas Adicionales</div>
        {!mE.length && <div style={{color:mu,fontSize:13}}>Sin horas adicionales proximas.</div>}
        {mE.map(function(r) {
          return (
            <div key={r.id} style={sCard}>
              <div style={{flex:1}}>
                <div style={{color:tx,fontWeight:600}}>{parseLocalDate(r.fecha||slot_date_fallback).toLocaleDateString("es-AR")} - {r.inicio}-{r.fin}</div>
                <div style={{color:mu,fontSize:12}}>{r.consultorio}</div>
              </div>
              <button style={Object.assign({},btnO(eb,er,"1.5px solid #F5B8B3"),{fontSize:12,padding:"5px 10px"})} onClick={function(){setMH({type:"delExtra",r:r});}}>Cancelar</button>
            </div>
          );
        })}
      </div>
      {mH && (
        <div style={sOverlay} onClick={function(){setMH(null);}}>
          <div style={Object.assign({},sModal,{maxWidth:480})} onClick={function(e){e.stopPropagation();}}>
            {mH.type==="del" && (
              <div>
                <div style={sModH}>
                  <h3 style={{margin:0,color:tx}}>Liberar horario</h3>
                  <button style={sXBtn} onClick={function(){setMH(null);}}>X</button>
                </div>
                <div style={{padding:20,display:"flex",flexDirection:"column",gap:14}}>
                  <div style={{background:eb,border:"1px solid #F5B8B3",borderRadius:10,padding:14}}>
                    <div style={{color:er,fontWeight:700,marginBottom:6}}>Atencion</div>
                    <div style={{color:er,fontSize:13,lineHeight:1.6}}>Una vez liberado este horario queda disponible para otras profesionales. No podemos garantizar su disponibilidad futura.</div>
                  </div>
                  <div style={{background:bg,borderRadius:8,padding:12,color:tx,fontWeight:600,border:"1px solid #C9E4EF"}}>
                    {DIAS[mH.h.diaSemana]} - {mH.h.inicio}-{mH.h.fin} - {mH.h.consultorio}
                  </div>
                  <div style={{display:"flex",gap:10}}>
                    <button style={Object.assign({},btnO(eb,er,"1.5px solid #F5B8B3"),{flex:1})} onClick={function(){sol("fijo","eliminar",{},mH.h.id);}}>Si, liberar</button>
                    <button style={Object.assign({},btnO(wh,tx,"1.5px solid #C9E4EF"),{flex:1})} onClick={function(){setMH(null);}}>Cancelar</button>
                  </div>
                </div>
              </div>
            )}
            {mH.type==="delExtra" && (
              <div>
                <div style={sModH}>
                  <h3 style={{margin:0,color:tx}}>Cancelar hora adicional</h3>
                  <button style={sXBtn} onClick={function(){setMH(null);}}>X</button>
                </div>
                <div style={{padding:20,display:"flex",flexDirection:"column",gap:14}}>
                  <div style={{background:eb,border:"1px solid #F5B8B3",borderRadius:10,padding:14}}>
                    <div style={{color:er,fontWeight:700,marginBottom:6}}>Atencion</div>
                    <div style={{color:er,fontSize:13,lineHeight:1.6}}>Al cancelar el horario quedara libre para que otra profesional pueda reservarlo.</div>
                  </div>
                  <div style={{display:"flex",gap:10}}>
                    <button style={Object.assign({},btnO(eb,er,"1.5px solid #F5B8B3"),{flex:1})} onClick={function(){sol("extra","eliminar",{},null,mH.r.id);}}>Si, cancelar</button>
                    <button style={Object.assign({},btnO(wh,tx,"1.5px solid #C9E4EF"),{flex:1})} onClick={function(){setMH(null);}}>Volver</button>
                  </div>
                </div>
              </div>
            )}
            {(mH.type==="add"||mH.type==="edit") && (
              <SolHorarioForm tipo={mH.type} h={mH.h} horarios={horarios} user={user} onSol={function(datos){sol("fijo",mH.type==="add"?"agregar":"modificar",datos,mH.h&&mH.h.id);}} onClose={function(){setMH(null);}}/>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


// ─── Configuracion (Admin) ────────────────────────────────────
function ConfigView({config,setConfig,notify}) {
  const [invPass,setInvPass] = useState(config.invPass||"invitada123");
  const [alias,setAlias] = useState((config.transferencia&&config.transferencia.alias)||"");
  const [cbu,setCbu] = useState((config.transferencia&&config.transferencia.cbu)||"");
  const [banco,setBanco] = useState((config.transferencia&&config.transferencia.banco)||"");
  const [titular,setTitular] = useState((config.transferencia&&config.transferencia.titular)||"");
  const [flyer,setFlyer] = useState(config.flyer||"");
  const [fotos,setFotos] = useState(config.fotos||{C1:[],C2:[],C3:[],C4:[],C5:[]});
  const [selCons,setSelCons] = useState("C1");
  const [newFoto,setNewFoto] = useState("");
  const [descripciones,setDescripciones] = useState(config.descripciones||{C1:"",C2:"",C3:"",C4:"",C5:""});

  useEffect(function() {
    setInvPass(config.invPass||"invitada123");
    setAlias((config.transferencia&&config.transferencia.alias)||"");
    setCbu((config.transferencia&&config.transferencia.cbu)||"");
    setBanco((config.transferencia&&config.transferencia.banco)||"");
    setTitular((config.transferencia&&config.transferencia.titular)||"");
    setFlyer(config.flyer||"");
    setFotos(config.fotos||{C1:[],C2:[],C3:[],C4:[],C5:[]});
    setDescripciones(config.descripciones||{C1:"",C2:"",C3:"",C4:"",C5:""});
  }, [config]);

  function save() {
    setConfig({id:"main",invPass:invPass,transferencia:{alias:alias,cbu:cbu,banco:banco,titular:titular},flyer:flyer,fotos:fotos,descripciones:descripciones});
    notify("Configuracion guardada");
  }
  function fixUrl(url) {
    if(!url) return "";
    // Google Drive share link: /d/FILE_ID/
    const m = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if(m) return "https://drive.google.com/thumbnail?id="+m[1]+"&sz=w800";
    // Google Drive open link: ?id=FILE_ID
    const m2 = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if(m2) return "https://drive.google.com/thumbnail?id="+m2[1]+"&sz=w800";
    return url;
  }
  function addFoto() {
    if(!newFoto.trim()) return;
    const updated = Object.assign({},fotos,{[selCons]:(fotos[selCons]||[]).concat([newFoto.trim()])});
    setFotos(updated);
    setNewFoto("");
    notify("Foto agregada");
  }
  function delFoto(cons,idx) {
    const updated = Object.assign({},fotos,{[cons]:(fotos[cons]||[]).filter(function(_,i){return i!==idx;})});
    setFotos(updated);
  }

  return (
    <div>
      <h2 style={{color:tx,fontSize:20,fontWeight:800,marginBottom:16}}>Configuracion</h2>
      <div style={Object.assign({},sPanel,{marginBottom:16})}>
        <div style={{color:mu,fontSize:11,fontWeight:700,textTransform:"uppercase",marginBottom:12}}>Acceso invitadas</div>
        <label style={sLbl}>Contrasena para invitadas</label>
        <input style={sInp} value={invPass} onChange={function(e){setInvPass(e.target.value);}} placeholder="invitada123"/>
        <div style={{color:mu,fontSize:11,marginTop:4}}>Las invitadas ingresan con usuario "invitada" y esta contrasena</div>
      </div>
      <div style={Object.assign({},sPanel,{marginBottom:16})}>
        <div style={{color:mu,fontSize:11,fontWeight:700,textTransform:"uppercase",marginBottom:12}}>Datos de transferencia</div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <div><label style={sLbl}>Titular</label><input style={sInp} value={titular} onChange={function(e){setTitular(e.target.value);}} placeholder="Nombre completo"/></div>
          <div><label style={sLbl}>CBU</label><input style={sInp} value={cbu} onChange={function(e){setCbu(e.target.value);}} placeholder="0000000000000000000000"/></div>
          <div><label style={sLbl}>Alias</label><input style={sInp} value={alias} onChange={function(e){setAlias(e.target.value);}} placeholder="alias.mercadopago"/></div>
          <div><label style={sLbl}>Banco</label><input style={sInp} value={banco} onChange={function(e){setBanco(e.target.value);}} placeholder="Ej: Brubank, Galicia..."/></div>
        </div>
      </div>
      <div style={Object.assign({},sPanel,{marginBottom:16})}>
        <div style={{color:mu,fontSize:11,fontWeight:700,textTransform:"uppercase",marginBottom:12}}>Flyer de convivencia (link Google Drive)</div>
        <input style={sInp} value={flyer} onChange={function(e){setFlyer(e.target.value);}} placeholder="Pega el link de Google Drive"/>
        {flyer && <img src={fixUrl(flyer)} alt="flyer" style={{width:"100%",borderRadius:8,marginTop:8,maxHeight:300,objectFit:"contain"}}/>}
      </div>
      <div style={Object.assign({},sPanel,{marginBottom:16})}>
        <div style={{color:mu,fontSize:11,fontWeight:700,textTransform:"uppercase",marginBottom:12}}>Descripcion y fotos por consultorio</div>
        <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap"}}>
          {["C1","C2","C3","C4","C5"].map(function(c){return(
            <button key={c} onClick={function(){setSelCons(c);}} style={{padding:"6px 14px",borderRadius:8,border:"none",background:selCons===c?br:bg,color:selCons===c?wh:mu,fontFamily:"inherit",fontWeight:700,cursor:"pointer",fontSize:13}}>
              {c}{(fotos[c]||[]).length>0?" ("+fotos[c].length+")":""}
            </button>
          );})}
        </div>
        <div style={{marginBottom:14,background:lt,borderRadius:10,padding:12,border:"1.5px solid #4BA3C3"}}>
          <label style={{color:br,fontSize:12,fontWeight:700,textTransform:"uppercase",display:"block",marginBottom:6}}>Descripcion de {selCons} (visible para psicologas e invitadas)</label>
          <textarea style={Object.assign({},sInp,{minHeight:80,resize:"vertical",fontSize:13,background:wh})}
            value={descripciones[selCons]||""}
            onChange={function(e){setDescripciones(function(d){return Object.assign({},d,{[selCons]:e.target.value});});}}
            placeholder="Ej: Consultorio luminoso, planta baja, con aire acondicionado..."/>
        </div>
        <div style={{display:"flex",gap:8,marginBottom:10}}>
          <input style={Object.assign({},sInp,{flex:1})} value={newFoto} onChange={function(e){setNewFoto(e.target.value);}} placeholder="Link de Google Drive"/>
          <button style={btn(br,wh)} onClick={addFoto}>+</button>
        </div>
        {(fotos[selCons]||[]).length===0 && <div style={{color:mu,fontSize:13,textAlign:"center",padding:10}}>Sin fotos para {selCons}</div>}
        {(fotos[selCons]||[]).map(function(url,i){return(
          <div key={i} style={{position:"relative",marginBottom:8}}>
            <img src={fixUrl(url)} alt={"foto "+i} style={{width:"100%",borderRadius:10,maxHeight:220,objectFit:"cover"}}/>
            <button onClick={function(){delFoto(selCons,i);}} style={{position:"absolute",top:6,right:6,background:"rgba(0,0,0,.55)",color:wh,border:"none",borderRadius:6,padding:"4px 10px",cursor:"pointer",fontFamily:"inherit",fontSize:12}}>X</button>
          </div>
        );})}
      </div>
      <button style={Object.assign({},btn(br,wh),{width:"100%",padding:"13px 16px",fontSize:15})} onClick={save}>Guardar configuracion</button>
    </div>
  );
}

// ─── Consultorios View (Invitada) ─────────────────────────────
function ConsultoriosView({config,horarios}) {
  const [selC,setSelC] = useState("C1");
  const [fotoAbierta,setFotoAbierta] = useState(null);
  const fotos = (config.fotos&&config.fotos[selC])||[];
  function fixUrl(url) {
    if(!url) return "";
    var id = null;
    var m1 = url.match(/\/d\/([a-zA-Z0-9_-]{25,})/);
    var m2 = url.match(/id=([a-zA-Z0-9_-]{25,})/);
    if(m1) id = m1[1];
    else if(m2) id = m2[1];
    if(id) return "https://lh3.googleusercontent.com/d/"+id+"=s800";
    return url;
  }
  function altUrl(url) {
    if(!url) return "";
    var id = null;
    var m1 = url.match(/\/d\/([a-zA-Z0-9_-]{25,})/);
    var m2 = url.match(/id=([a-zA-Z0-9_-]{25,})/);
    if(m1) id = m1[1];
    else if(m2) id = m2[1];
    if(id) return "https://drive.google.com/thumbnail?id="+id+"&sz=w800";
    return url;
  }

  const cons = CONS.find(function(c){return c.id===selC;});
  return (
    <>
    <div>
      <h2 style={{color:tx,fontSize:20,fontWeight:800,marginBottom:16}}>Consultorios</h2>
      <div style={{display:"flex",gap:6,marginBottom:16,flexWrap:"wrap"}}>
        {CONS.map(function(c){return(
          <button key={c.id} onClick={function(){setSelC(c.id);}} style={{padding:"8px 16px",borderRadius:10,border:"none",background:selC===c.id?br:wh,color:selC===c.id?wh:tx,fontFamily:"inherit",fontWeight:700,cursor:"pointer",fontSize:13,boxShadow:"0 1px 4px rgba(75,163,195,.1)"}}>
            {c.id}
          </button>
        );})}
      </div>
      <div style={sPanel}>
        <div style={{color:tx,fontWeight:700,fontSize:16,marginBottom:4}}>{selC}</div>
        <div style={{color:mu,fontSize:13,marginBottom:14}}>{cons?cons.sn:""}</div>
        {fotos.length>0?(
          <div style={{marginBottom:16}}>
            {fotos.map(function(url,i){return(
            <img key={i} src={fixUrl(url)} alt={"foto "+i}
              style={{width:"100%",borderRadius:10,marginBottom:8,maxHeight:220,objectFit:"cover",cursor:"pointer"}}
              onError={function(e){if(e.target.src!==altUrl(url))e.target.src=altUrl(url);}}
              onClick={function(){setFotoAbierta(fixUrl(url));}}/>
          );})}
          </div>
        ):(
          <div style={{background:bg,borderRadius:8,padding:20,textAlign:"center",color:mu,marginBottom:14}}>Sin fotos aun</div>
        )}
        <div style={{color:tx,fontSize:14,lineHeight:1.7,marginBottom:16,padding:"12px 0",borderBottom:"1px solid #EBF6FA",minHeight:20}}>
          {(config.descripciones&&config.descripciones[selC])
            ? config.descripciones[selC]
            : <span style={{color:mu,fontStyle:"italic"}}>Sin descripcion cargada aun.</span>
          }
        </div>

      </div>
    </div>
    {fotoAbierta && (
      <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.92)",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={function(){setFotoAbierta(null);}}>
        <img src={fotoAbierta} alt="foto" style={{maxWidth:"95vw",maxHeight:"90vh",borderRadius:12,objectFit:"contain"}}/>
        <button style={{position:"absolute",top:16,right:16,background:"rgba(255,255,255,.2)",border:"none",color:wh,fontSize:24,cursor:"pointer",borderRadius:8,width:40,height:40,fontFamily:"inherit"}} onClick={function(){setFotoAbierta(null);}}>X</button>
      </div>
    )}
    </>
  );
}

// ─── Solicitud Invitada ────────────────────────────────────────
function SolicitudInvitadaView({horarios,reservas,config,notify,setSolHor}) {
  const [nombre,setNombre] = useState("");
  const [tel,setTel] = useState("");
  const [email,setEmail] = useState("");
  const [enviado,setEnviado] = useState(false);
  const [slots,setSlots] = useState([]);
  const [addDia,setAddDia] = useState(1);
  const [addCons,setAddCons] = useState("C1");
  const [addIni,setAddIni] = useState("09:00");
  const [addFin,setAddFin] = useState("12:00");

  const totalHoras = slots.reduce(function(acc,s){return acc+Math.max((toMin(s.fin)-toMin(s.ini))/60,0);},0);
  const minHoras = 3;

  function conflictoSlot(s) {
    const sMin=toMin(s.ini), eMin=toMin(s.fin);
    if(eMin<=sMin) return "Fin debe ser mayor al inicio";
    const ocu=(horarios||[]).filter(function(x){
      return x.consultorio===s.cons&&Number(x.diaSemana)===Number(s.dia)&&sMin<toMin(x.fin)&&eMin>toMin(x.inicio);
    });
    return ocu.length?"Ese horario esta ocupado en "+s.cons:null;
  }

  function libresParaSlot(dia,ini,fin) {
    const sMin=toMin(ini),eMin=toMin(fin);
    if(eMin<=sMin) return [];
    return CONS.filter(function(c){
      return !(horarios||[]).some(function(x){return x.consultorio===c.id&&Number(x.diaSemana)===Number(dia)&&sMin<toMin(x.fin)&&eMin>toMin(x.inicio);});
    });
  }

  function addSlot() {
    if(toMin(addFin)<=toMin(addIni)){notify("Fin debe ser mayor al inicio","err");return;}
    const nuevo={dia:Number(addDia),cons:addCons,ini:addIni,fin:addFin};
    const conf=conflictoSlot(nuevo);
    if(conf){notify(conf,"err");return;}
    if(slots.some(function(s){return Number(s.dia)===Number(addDia);})){
      notify("Ya hay un horario ese dia. Eliminalos primero.","err"); return;
    }
    setSlots(function(p){return p.concat([nuevo]);});
  }
  function removeSlot(i){setSlots(function(p){return p.filter(function(_,idx){return idx!==i;});});}

  function calcCostoSemanal() {
    return slots.reduce(function(acc,s){return acc+calcPrecio(s.ini,s.fin).sub;},0);
  }

  function enviar() {
    if(!nombre.trim()||!tel.trim()){notify("Completa tu nombre y WhatsApp","err");return;}
    if(slots.length===0){notify("Agrega al menos un horario","err");return;}
    if(totalHoras<minHoras){notify("Minimo "+minHoras+"hs semanales en total","err");return;}
    const s={id:Date.now(),tipo:"invitada",nombre:nombre,tel:tel,email:email,slots:slots,totalHoras:totalHoras,costoSemanal:calcCostoSemanal(),estado:"pendiente",fechaSol:new Date().toISOString()};
    saveDoc("solHor",s.id,s);
    notify("Solicitud enviada!");
    setEnviado(true);
  }

  if(enviado) return (
    <div style={Object.assign({},sPanel,{textAlign:"center",padding:40})}>
      <div style={{fontSize:48,marginBottom:16}}>✓</div>
      <div style={{color:ok,fontWeight:700,fontSize:18,marginBottom:8}}>Solicitud enviada!</div>
      <div style={{color:mu,fontSize:14,lineHeight:1.6}}>Te contactaremos a la brevedad para confirmar tu reserva.</div>
    </div>
  );

  const addConflicto = (toMin(addFin)>toMin(addIni)) ? conflictoSlot({dia:addDia,cons:addCons,ini:addIni,fin:addFin}) : null;
  const addLibres = libresParaSlot(addDia,addIni,addFin);

  return (
    <div>
      <h2 style={{color:tx,fontSize:20,fontWeight:800,marginBottom:4}}>Solicitar horario fijo</h2>
      <div style={{color:mu,fontSize:13,marginBottom:16}}>Minimo {minHoras}hs semanales en total. Podes agregar varios dias.</div>

      <div style={Object.assign({},sPanel,{marginBottom:16})}>
        <div style={{color:mu,fontSize:11,fontWeight:700,textTransform:"uppercase",marginBottom:12}}>Tus datos</div>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          <div><label style={sLbl}>Nombre completo</label><input style={sInp} value={nombre} onChange={function(e){setNombre(e.target.value);}} placeholder="Tu nombre"/></div>
          <div><label style={sLbl}>WhatsApp</label><input style={sInp} value={tel} onChange={function(e){setTel(e.target.value);}} placeholder="549..."/></div>
          <div><label style={sLbl}>Email</label><input style={sInp} value={email} onChange={function(e){setEmail(e.target.value);}} placeholder="tu@email.com"/></div>
        </div>
      </div>

      <div style={Object.assign({},sPanel,{marginBottom:16})}>
        <div style={{color:mu,fontSize:11,fontWeight:700,textTransform:"uppercase",marginBottom:12}}>Horarios fijos semanales</div>
        {slots.length===0 && <div style={{color:mu,fontSize:13,textAlign:"center",padding:"10px 0",marginBottom:10}}>Todavia no agregaste horarios</div>}
        {slots.map(function(s,i){
          return (
            <div key={i} style={{background:ob,border:"1px solid #A7E3C0",borderRadius:10,padding:"10px 14px",marginBottom:8,display:"flex",alignItems:"center",gap:10}}>
              <div style={{flex:1}}>
                <div style={{color:tx,fontWeight:700,fontSize:13}}>{DIAS[s.dia]} - {s.cons} {CONS.find(function(c){return c.id===s.cons;})?("("+(CONS.find(function(c){return c.id===s.cons;}).sede==="VL"?"Vic. Lopez":"Uruguay")+")"):"" }</div>
                <div style={{color:mu,fontSize:12}}>{s.ini}-{s.fin} - {Math.max((toMin(s.fin)-toMin(s.ini))/60,0).toFixed(1)}hs - {ars(calcPrecio(s.ini,s.fin).sub)}/sem</div>
              </div>
              <button style={{background:"transparent",border:"none",color:er,fontSize:18,cursor:"pointer",padding:"0 4px",fontFamily:"inherit"}} onClick={function(){removeSlot(i);}}>X</button>
            </div>
          );
        })}
        <div style={{background:bg,borderRadius:10,padding:14,border:"1.5px dashed #4BA3C3",marginTop:8}}>
          <div style={{color:br,fontSize:12,fontWeight:700,marginBottom:10}}>+ Agregar dia</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
            <div>
              <label style={sLbl}>Dia</label>
              <select style={sInp} value={addDia} onChange={function(e){setAddDia(Number(e.target.value));}}>
                {[1,2,3,4,5,6].map(function(d){return <option key={d} value={d}>{DIAS[d]}</option>;})}
              </select>
            </div>
            <div>
              <label style={sLbl}>Consultorio</label>
              <select style={sInp} value={addCons} onChange={function(e){setAddCons(e.target.value);}}>
                {CONS.map(function(c){return <option key={c.id} value={c.id}>{c.id} - {c.sede==="VL"?"VL":"UY"}</option>;})}
              </select>
            </div>
            <div>
              <label style={sLbl}>Desde</label>
              <input style={sInp} type="time" value={addIni} onChange={function(e){setAddIni(e.target.value);}}/>
            </div>
            <div>
              <label style={sLbl}>Hasta</label>
              <input style={sInp} type="time" value={addFin} onChange={function(e){setAddFin(e.target.value);}}/>
            </div>
          </div>
          {addConflicto && (
            <div style={{background:eb,border:"1px solid #F5B8B3",borderRadius:8,padding:"8px 12px",marginBottom:8,color:er,fontSize:12}}>
              {addConflicto}
              {addLibres.length>0 && (
                <div style={{marginTop:6,display:"flex",gap:6,flexWrap:"wrap"}}>
                  {addLibres.map(function(c){return(
                    <button key={c.id} style={{background:ob,color:ok,border:"1px solid #A7E3C0",borderRadius:6,padding:"3px 10px",fontSize:11,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}} onClick={function(){setAddCons(c.id);}}>
                      {c.id} - {c.sede==="VL"?"Vic. Lopez":"Uruguay"}
                    </button>
                  );})}
                </div>
              )}
            </div>
          )}
          {!addConflicto && toMin(addFin)>toMin(addIni) && (
            <div style={{color:ok,fontSize:12,marginBottom:8}}>Disponible - {ars(calcPrecio(addIni,addFin).sub)}/sem</div>
          )}
          <button style={Object.assign({},btnO(wh,br,"1.5px solid #4BA3C3"),{width:"100%",padding:"8px",fontSize:13})} onClick={addSlot}>
            + Agregar este dia
          </button>
        </div>
      </div>

      <div style={Object.assign({},sPanel,{marginBottom:16,background:totalHoras>=minHoras?ob:eb,border:totalHoras>=minHoras?"1px solid #A7E3C0":"1px solid #F5B8B3"})}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{color:tx,fontWeight:700,fontSize:15}}>Total: {totalHoras.toFixed(1)}hs semanales</div>
            {slots.length>0&&<div style={{color:mu,fontSize:12}}>Costo: {ars(calcCostoSemanal())}/semana</div>}
          </div>
          <div style={{color:totalHoras>=minHoras?ok:er,fontWeight:700,fontSize:13}}>
            {totalHoras>=minHoras?"Minimo cumplido":"Faltan "+(minHoras-totalHoras).toFixed(1)+"hs"}
          </div>
        </div>
      </div>

      <button style={Object.assign({},btn(br,wh),{width:"100%",padding:"13px 16px",fontSize:15,opacity:(totalHoras<minHoras||!nombre||!tel||slots.length===0)?0.4:1})} disabled={!!(totalHoras<minHoras||!nombre||!tel||slots.length===0)} onClick={enviar}>
        Enviar solicitud ({totalHoras.toFixed(1)}hs semanales)
      </button>
      <div style={{color:mu,fontSize:12,textAlign:"center",marginTop:8}}>Minimo {minHoras}hs semanales - Sujeto a aprobacion</div>
    </div>
  );
}


// ─── Estadisticas ─────────────────────────────────────────────
function EstadisticasView({psicos,horarios,reservas,calcFact}) {
  const now = new Date();
  const [mes,setMes] = useState(now.getMonth());
  const [anio,setAnio] = useState(now.getFullYear());

  // Hours per consultorio per week
  function hrsConsultorio(consId) {
    return horarios.filter(function(h){return h.consultorio===consId;}).reduce(function(acc,h){return acc+(toMin(h.fin)-toMin(h.inicio))/60;},0);
  }
  // Total available hours per week per consultorio (8-21 = 13hs x 6 days)
  const maxHrsSem = 13 * 6;

  // Global monthly total
  function totalMes() {
    return psicos.reduce(function(acc,p){return acc+calcFact(p,mes,anio).total;},0);
  }
  function totalBruto() {
    return psicos.reduce(function(acc,p){const r=calcFact(p,mes,anio);return acc+r.bruto;},0);
  }
  function totalDesc() {
    return psicos.reduce(function(acc,p){const r=calcFact(p,mes,anio);return acc+r.montoDesc;},0);
  }

  // Psico ranking by billing
  const ranking = psicos.map(function(p){return {nombre:p.nombre,total:calcFact(p,mes,anio).total};}).sort(function(a,b){return b.total-a.total;});

  // Occupancy by sede
  function hrsSede(sede) {
    return horarios.filter(function(h){return h.sede===sede;}).reduce(function(acc,h){return acc+(toMin(h.fin)-toMin(h.inicio))/60;},0);
  }
  const maxHrsVL = 13*6*3; // 3 consultorios
  const maxHrsUY = 13*6*2; // 2 consultorios

  return (
    <div>
      <h2 style={{color:tx,fontSize:20,fontWeight:800,marginBottom:16}}>Estadisticas</h2>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:20}}>
        <select style={Object.assign({},sInp,{width:"auto"})} value={mes} onChange={function(e){setMes(Number(e.target.value));}}>{MESES.map(function(m,i){return <option key={i} value={i}>{m}</option>;})}</select>
        <select style={Object.assign({},sInp,{width:"auto"})} value={anio} onChange={function(e){setAnio(Number(e.target.value));}}>{[2025,2026,2027].map(function(y){return <option key={y}>{y}</option>;})}</select>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
        <div style={Object.assign({},sPanel,{textAlign:"center"})}>
          <div style={{color:mu,fontSize:11,fontWeight:700,textTransform:"uppercase",marginBottom:8}}>Total del mes</div>
          <div style={{color:ok,fontSize:24,fontWeight:800}}>{ars(totalMes())}</div>
          {totalDesc()>0 && <div style={{color:er,fontSize:12,marginTop:4}}>Desc. aplicados: {ars(totalDesc())}</div>}
        </div>
        <div style={Object.assign({},sPanel,{textAlign:"center"})}>
          <div style={{color:mu,fontSize:11,fontWeight:700,textTransform:"uppercase",marginBottom:8}}>Psicologas activas</div>
          <div style={{color:br,fontSize:24,fontWeight:800}}>{psicos.filter(function(p){return calcFact(p,mes,anio).total>0;}).length}</div>
          <div style={{color:mu,fontSize:12}}>de {psicos.length} total</div>
        </div>
      </div>

      <div style={Object.assign({},sPanel,{marginBottom:16})}>
        <div style={{color:mu,fontSize:11,fontWeight:700,textTransform:"uppercase",marginBottom:14}}>Ocupacion por sede (horas semanales fijas)</div>
        {[{id:"VL",nombre:"Vicente Lopez",max:maxHrsVL,cons:["C1","C2","C3"]},{id:"UY",nombre:"Uruguay",max:maxHrsUY,cons:["C4","C5"]}].map(function(sede) {
          const usadas = hrsSede(sede.id);
          const pct = Math.min(Math.round((usadas/sede.max)*100),100);
          return (
            <div key={sede.id} style={{marginBottom:16}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                <div style={{color:tx,fontWeight:600,fontSize:14}}>{sede.nombre}</div>
                <div style={{color:mu,fontSize:13}}>{usadas.toFixed(1)}hs / {sede.max}hs sem ({pct}%)</div>
              </div>
              <div style={{background:"#E9F0F3",borderRadius:20,height:10,overflow:"hidden"}}>
                <div style={{width:pct+"%",height:"100%",background:pct>80?"#E53E3E":pct>60?br:ok,borderRadius:20,transition:"width .5s"}}/>
              </div>
              {sede.cons.map(function(cid) {
                const hc = hrsConsultorio(cid);
                const pc = Math.min(Math.round((hc/maxHrsSem)*100),100);
                return (
                  <div key={cid} style={{display:"flex",alignItems:"center",gap:8,marginTop:8,paddingLeft:12}}>
                    <div style={{color:mu,fontSize:12,width:24}}>{cid}</div>
                    <div style={{flex:1,background:"#E9F0F3",borderRadius:20,height:7,overflow:"hidden"}}>
                      <div style={{width:pc+"%",height:"100%",background:lt,borderRadius:20}}/>
                    </div>
                    <div style={{color:mu,fontSize:11,width:60,textAlign:"right"}}>{hc.toFixed(1)}hs ({pc}%)</div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      <div style={Object.assign({},sPanel,{marginBottom:16})}>
        <div style={{color:mu,fontSize:11,fontWeight:700,textTransform:"uppercase",marginBottom:14}}>Ranking facturacion {MESES[mes]}</div>
        {ranking.filter(function(r){return r.total>0;}).map(function(r,i) {
          const maxT = ranking[0].total || 1;
          const pct = Math.round((r.total/maxT)*100);
          return (
            <div key={r.nombre} style={{marginBottom:10}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                <div style={{color:tx,fontSize:13,fontWeight:600}}>{i+1}. {r.nombre}</div>
                <div style={{color:ok,fontSize:13,fontWeight:700}}>{ars(r.total)}</div>
              </div>
              <div style={{background:"#E9F0F3",borderRadius:20,height:8,overflow:"hidden"}}>
                <div style={{width:pct+"%",height:"100%",background:PCOLS[i%PCOLS.length],borderRadius:20}}/>
              </div>
            </div>
          );
        })}
        {ranking.filter(function(r){return r.total>0;}).length===0 && (
          <div style={{color:mu,textAlign:"center",padding:20}}>Sin datos para este mes</div>
        )}
      </div>

      <div style={sPanel}>
        <div style={{color:mu,fontSize:11,fontWeight:700,textTransform:"uppercase",marginBottom:14}}>Disponibilidad semanal por consultorio</div>
        {["C1","C2","C3","C4","C5"].map(function(cid) {
          const c = CONS.find(function(x){return x.id===cid;});
          const hFijos = horarios.filter(function(h){return h.consultorio===cid;});
          const diasOcupados = [1,2,3,4,5,6].filter(function(d){return hFijos.some(function(h){return h.diaSemana===d;});});
          const diasLibres = [1,2,3,4,5,6].filter(function(d){return !hFijos.some(function(h){return h.diaSemana===d;});});
          return (
            <div key={cid} style={{marginBottom:14,padding:"10px 12px",background:bg,borderRadius:10,border:"1px solid #C9E4EF"}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}>
                <div style={{color:tx,fontWeight:700}}>{cid} <span style={{color:mu,fontSize:12,fontWeight:400}}>({c.sn})</span></div>
                <span style={bge(diasLibres.length>0?ob:eb,diasLibres.length>0?ok:er)}>{diasLibres.length>0?diasLibres.length+" dias libres":"Sin disponibilidad"}</span>
              </div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {[1,2,3,4,5,6].map(function(d) {
                  const ocupado = hFijos.some(function(h){return h.diaSemana===d;});
                  return (
                    <div key={d} style={{background:ocupado?er:ok,color:wh,borderRadius:6,padding:"3px 8px",fontSize:11,fontWeight:700}}>
                      {DIAS[d].substring(0,3)}
                    </div>
                  );
                })}
              </div>
              {diasLibres.length>0 && (
                <div style={{color:ok,fontSize:12,marginTop:6}}>Libre: {diasLibres.map(function(d){return DIAS[d];}).join(", ")}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function EditarPerfilBtn({user,psicos,setPsicos,notify}) {
  const [open,setOpen] = useState(false);
  const p = psicos.find(function(x){return x.nombre===user;});
  const [wa,setWa] = useState(p?p.wa||"":"");
  const [email,setEmail] = useState(p?p.email||"":"");
  const [analisis,setAnalisis] = useState(p?p.analisis||[]:[]);
  const [disponible,setDisponible] = useState(p?p.disponible!==false:true);

  function save() {
    if(!p) return;
    saveDoc("psicos",p.id,Object.assign({},p,{wa:wa,email:email,analisis:analisis,disponible:disponible}));
    notify("Perfil actualizado");
    setOpen(false);
  }

  const ANALS=["Cognitivo Conductual","Psicoanalitico","Sistemico / Familiar","Humanista / Gestalt","EMDR","Mindfulness / ACT","Integrativo","Otro"];

  return (
    <div>
      <button onClick={function(){setOpen(function(v){return !v;});}} style={{display:"flex",alignItems:"center",gap:12,width:"100%",padding:"14px 20px",border:"none",borderBottom:"1px solid #C9E4EF",background:"transparent",cursor:"pointer",fontFamily:"inherit",color:"#1C3A4A",fontSize:15}}>
        <span style={{fontSize:20}}>&#9998;</span>
        <span>Editar mi perfil</span>
      </button>
      {open && (
        <div style={{padding:"12px 20px",borderBottom:"1px solid #C9E4EF",background:"#F0F8FB",display:"flex",flexDirection:"column",gap:10}}>
          <div>
            <label style={{color:"#6B97AA",fontSize:11,fontWeight:600,textTransform:"uppercase",display:"block",marginBottom:4}}>WhatsApp (549...)</label>
            <input style={{background:"#fff",border:"1.5px solid #C9E4EF",borderRadius:8,padding:"8px 12px",color:"#1C3A4A",fontSize:14,width:"100%",fontFamily:"inherit"}} value={wa} onChange={function(e){setWa(e.target.value);}} placeholder="Ej: 5491161572283"/>
          </div>
          <div>
            <label style={{color:"#6B97AA",fontSize:11,fontWeight:600,textTransform:"uppercase",display:"block",marginBottom:4}}>Email</label>
            <input style={{background:"#fff",border:"1.5px solid #C9E4EF",borderRadius:8,padding:"8px 12px",color:"#1C3A4A",fontSize:14,width:"100%",fontFamily:"inherit"}} value={email} onChange={function(e){setEmail(e.target.value);}} placeholder="tu@email.com"/>
          </div>
          <div>
            <label style={{color:"#6B97AA",fontSize:11,fontWeight:600,textTransform:"uppercase",display:"block",marginBottom:6}}>Tipo de analisis</label>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {ANALS.map(function(a){
                const sel=analisis.includes(a);
                return <button key={a} onClick={function(){setAnalisis(function(prev){return sel?prev.filter(function(x){return x!==a;}):[...prev,a];});}} style={{background:sel?"#4BA3C3":"#fff",color:sel?"#fff":"#6B97AA",border:sel?"1.5px solid #4BA3C3":"1.5px solid #C9E4EF",borderRadius:20,padding:"4px 12px",fontSize:12,cursor:"pointer",fontFamily:"inherit",fontWeight:sel?700:400}}>{a}</button>;
              })}
            </div>
          </div>
          <label style={{display:"flex",alignItems:"center",gap:8,color:"#1C3A4A",fontSize:14,cursor:"pointer"}}>
            <input type="checkbox" checked={disponible} onChange={function(e){setDisponible(e.target.checked);}}/>
            Disponible para derivaciones
          </label>
          <div style={{display:"flex",gap:8}}>
            <button style={{flex:1,background:"#4BA3C3",color:"#fff",border:"none",borderRadius:10,padding:"10px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}} onClick={save}>Guardar</button>
            <button style={{flex:1,background:"#fff",color:"#1C3A4A",border:"1.5px solid #C9E4EF",borderRadius:10,padding:"10px",fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}} onClick={function(){setOpen(false);}}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}

function CambiarPassBtn({user,setPsicos,notify}) {
  const [open,setOpen] = useState(false);
  const [actual,setActual] = useState("");
  const [nueva,setNueva] = useState("");
  const [conf,setConf] = useState("");
  function cambiar() {
    if(nueva.length<4){notify("Minimo 4 caracteres","err");return;}
    if(nueva!==conf){notify("Las contrasenas no coinciden","err");return;}
    setPsicos(function(ps){
      const p = ps.find(function(x){return x.nombre===user;});
      if(!p){notify("Error","err");return ps;}
      if((p.pass||"psico123")!==actual){notify("Contrasena actual incorrecta","err");return ps;}
      notify("Contrasena cambiada");
      setOpen(false);setActual("");setNueva("");setConf("");
      return ps.map(function(x){return x.nombre===user?Object.assign({},x,{pass:nueva}):x;});
    });
  }
  return (
    <div>
      <button onClick={function(){setOpen(function(v){return !v;});}} style={{display:"flex",alignItems:"center",gap:12,width:"100%",padding:"14px 20px",border:"none",borderBottom:"1px solid #C9E4EF",background:"transparent",cursor:"pointer",fontFamily:"inherit",color:tx,fontSize:15}}>
        <span style={{fontSize:20}}>&#128274;</span>
        <span>Cambiar contrasena</span>
      </button>
      {open && (
        <div style={{padding:"12px 20px",borderBottom:"1px solid #C9E4EF",background:bg,display:"flex",flexDirection:"column",gap:8}}>
          <input style={Object.assign({},sInp,{fontSize:13})} type="password" value={actual} onChange={function(e){setActual(e.target.value);}} placeholder="Contrasena actual"/>
          <input style={Object.assign({},sInp,{fontSize:13})} type="password" value={nueva} onChange={function(e){setNueva(e.target.value);}} placeholder="Nueva contrasena (min 4 car.)"/>
          <input style={Object.assign({},sInp,{fontSize:13})} type="password" value={conf} onChange={function(e){setConf(e.target.value);}} placeholder="Confirmar nueva contrasena" onKeyDown={function(e){if(e.key==="Enter")cambiar();}}/>
          <button style={btn(br,wh)} onClick={cambiar}>Guardar contrasena</button>
        </div>
      )}
    </div>
  );
}

function SolHorarioForm({tipo,h,horarios,user,onSol,onClose}) {
  const [dia,setDia] = useState(h?h.diaSemana:1);
  const [ini,setIni] = useState(h?h.inicio:"09:00");
  const [fin,setFin] = useState(h?h.fin:"14:00");
  const [cons,setCons] = useState(h?h.consultorio:"C1");
  const pr = calcPrecio(ini,fin);
  function checkConflicto() {
    if(!ini||!fin||toMin(fin)<=toMin(ini)) return "El horario de fin debe ser mayor al inicio.";
    const sMin=toMin(ini), eMin=toMin(fin);
    const c=(horarios||[]).filter(function(x){
      if(x.consultorio!==cons) return false;
      if(Number(x.diaSemana)!==Number(dia)) return false;
      if(h && x.id===h.id) return false; // exclude own horario when editing
      return sMin<toMin(x.fin) && eMin>toMin(x.inicio);
    });
    return c.length ? "Ese horario esta ocupado en "+cons : null;
  }
  const conflicto = checkConflicto();

  // Find available consultorios at same time same day
  function getLibres() {
    if(!ini||!fin||toMin(fin)<=toMin(ini)) return [];
    const sMin=toMin(ini),eMin=toMin(fin);
    return CONS.filter(function(c){
      if(c.id===cons) return false;
      const ocupado=(horarios||[]).some(function(x){
        return x.consultorio===c.id&&Number(x.diaSemana)===Number(dia)&&sMin<toMin(x.fin)&&eMin>toMin(x.inicio);
      });
      return !ocupado;
    });
  }
  const libres = conflicto ? getLibres() : [];
  const sedeNombre = function(sede){ return sede==="VL"?"Vicente Lopez":"Uruguay"; };

  return (
    <div>
      <div style={sModH}>
        <h3 style={{margin:0,color:tx}}>{tipo==="add"?"Solicitar horario":"Modificar horario"}</h3>
        <button style={sXBtn} onClick={onClose}>X</button>
      </div>
      <div style={{padding:20,display:"flex",flexDirection:"column",gap:12}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          <div>
            <label style={sLbl}>Dia</label>
            <select style={sInp} value={dia} onChange={function(e){setDia(Number(e.target.value));}}>
              {[1,2,3,4,5,6].map(function(d){return <option key={d} value={d}>{DIAS[d]}</option>;})}
            </select>
          </div>
          <div>
            <label style={sLbl}>Consultorio</label>
            <select style={sInp} value={cons} onChange={function(e){setCons(e.target.value);}}>
              {CONS.map(function(c){return <option key={c.id} value={c.id}>{c.id} - {c.sn}</option>;})}
            </select>
          </div>
          <div>
            <label style={sLbl}>Desde</label>
            <input style={sInp} type="time" value={ini} onChange={function(e){setIni(e.target.value);}}/>
          </div>
          <div>
            <label style={sLbl}>Hasta</label>
            <input style={sInp} type="time" value={fin} onChange={function(e){setFin(e.target.value);}}/>
          </div>
        </div>
        {conflicto&&(
          <div style={{background:eb,border:"1px solid #F5B8B3",borderRadius:8,padding:"12px 14px",color:er,fontSize:13}}>
            <div style={{fontWeight:700,marginBottom:6}}>{conflicto}</div>
            {libres.length>0?(
              <div>
                <div style={{color:tx,fontSize:12,fontWeight:600,marginBottom:4}}>Consultorios disponibles en ese horario:</div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {libres.map(function(c){return(
                    <button key={c.id} style={{background:ob,color:ok,border:"1px solid #A7E3C0",borderRadius:10,padding:"6px 14px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"inherit",textAlign:"left"}} onClick={function(){setCons(c.id);}}>
                      <div>{c.id}</div>
                      <div style={{fontWeight:400,fontSize:11,color:"#2D8A5E"}}>{sedeNombre(c.sede)}</div>
                    </button>
                  );})}
                </div>
                <div style={{color:mu,fontSize:11,marginTop:4}}>Toca uno para seleccionarlo</div>
              </div>
            ):(
              <div style={{color:mu,fontSize:12,marginTop:4}}>No hay consultorios disponibles en ese horario ese dia.</div>
            )}
          </div>
        )}
        {!conflicto&&ini&&fin&&toMin(fin)>toMin(ini)&&<div style={{background:ob,border:"1px solid #A7E3C0",borderRadius:8,padding:"8px 12px",color:ok,fontSize:13}}>Horario disponible - <b>{ars(pr.sub)}/semana</b>{pr.ley&&" - "+pr.ley}</div>}
        <div style={{color:mu,fontSize:11}}>Queda pendiente de aprobacion.</div>
        <div style={{display:"flex",gap:10}}>
          <button style={Object.assign({},btn(br,wh),{opacity:conflicto?0.4:1})} disabled={!!conflicto} onClick={function(){onSol({diaSemana:Number(dia),inicio:ini,fin:fin,consultorio:cons,sede:(CONS.find(function(c){return c.id===cons;})||{sede:"VL"}).sede});}}>Enviar solicitud</button>
          <button style={btnO(wh,tx,"1.5px solid #C9E4EF")} onClick={onClose}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}
