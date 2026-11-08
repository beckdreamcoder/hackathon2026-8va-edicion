"use client";

import { useViewStack } from "@/lib/hooks/use-view-stack";

import { useTextInput } from "@/lib/hooks/use-text-input";
import { useCheckbox } from "@/lib/hooks/use-checkbox";

import { Fragment, useState } from "react";
import { useRouter } from "next/navigation";
import { screenStyles } from "./screen-styles";
import { useSesion, logEvento, chip } from "@/lib/demo/shared";

const DNI_DEMO = "12345678";

/** Directorio territorial ficticio: costa, sierra y selva. */
const TERRITORIOS = [
  { id: "lima", name: "Lima", zona: "Costa", prov: "Lima", dist: "San Juan de Lurigancho", locs: ["Campoy", "Mariátegui", "Canto Grande"], juntas: [{ id: "campoy", name: "Junta Vecinal Campoy Unido", zona: "Campoy · Sector 2" }, { id: "olivos", name: "Junta del Pasaje Los Olivos", zona: "Campoy · Sector 4" }] },
  { id: "piura", name: "Piura", zona: "Costa", prov: "Piura", dist: "Castilla", locs: ["Miraflores", "El Indio", "Tacalá"], juntas: [{ id: "tacala", name: "Junta Vecinal Tacalá Solidario", zona: "Tacalá · Manzana B" }] },
  { id: "cusco", name: "Cusco", zona: "Sierra", prov: "Cusco", dist: "San Sebastián", locs: ["Tupac Amaru", "Kari Grande", "Santa Rosa"], juntas: [{ id: "kari", name: "Junta Vecinal Kari Grande", zona: "Kari Grande · Sector 1" }] },
  { id: "puno", name: "Puno", zona: "Sierra", prov: "Puno", dist: "Puno", locs: ["Chanu Chanu", "Huáscar", "Alto Puno"], juntas: [] },
  { id: "loreto", name: "Loreto", zona: "Selva", prov: "Maynas", dist: "Belén", locs: ["Pueblo Libre", "Bajo Belén", "San Pedro"], juntas: [{ id: "belen", name: "Junta Vecinal Bajo Belén", zona: "Bajo Belén · Calle 3" }] },
  { id: "sanmartin", name: "San Martín", zona: "Selva", prov: "San Martín", dist: "Tarapoto", locs: ["Partido Alto", "Nueve de Abril", "Atumpampa"], juntas: [{ id: "atum", name: "Junta Vecinal Atumpampa", zona: "Atumpampa · Jr. Lima" }] },
];
import { animateMotion } from "./animate-motion";

const animateScan = animateMotion(
  [{ top: "12%" }, { top: "86%" }],
  { duration: 1200, easing: "ease-in-out", iterations: Infinity, direction: "alternate" },
);

/**
 * Pantalla Acceso del prototipo BarrioConecta.
 * Los valores de demostración sustituyen a la lógica del prototipo (DCLogic), que no se migró.
 */
export default function Acceso() {
  const nav = useViewStack("acceso");
  const router = useRouter();
  const [sesion, setSesion] = useSesion();
  const busqueda = useTextInput("");
  const dni = useTextInput("");
  const dni2 = useTextInput("");
  const dataOk = useCheckbox(false);
  const locOk = useCheckbox(false);

  // Paso 1: consulta RENIEC/PNP simulada
  const [escenario, setEscenario] = useState("ok");
  const [query, setQuery] = useState("idle"); // idle | loading | ok | err | dup
  // Paso 2: comparación facial simulada
  const [face, setFace] = useState("idle"); // idle | run | done
  const [camNote, setCamNote] = useState("");
  // Paso 3: consentimientos
  const [triedFinish, setTriedFinish] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [locNote, setLocNote] = useState("");
  // Territorio y juntas
  const [depId, setDepId] = useState("lima");
  const [loc, setLoc] = useState("Campoy");
  const [openJunta, setOpenJunta] = useState(null);
  const [joined, setJoined] = useState(null);
  const [tuNum, setTuNum] = useState(1);
  const [showErr, setShowErr] = useState(false);

  const chipErr = chip(escenario === "err");
  const chipOk = chip(escenario === "ok");
  const dni2Ok = /^\d{8}$/.test(dni2.value);
  const canQuery = dni2Ok && query !== "loading";
  const cantQuery = !dni2Ok;
  const qLoading = query === "loading";
  const qOk = query === "ok";
  const qErr = query === "err" || query === "dup";
  const scenOk = () => { setEscenario("ok"); setQuery("idle"); };
  const scenErr = () => { setEscenario("err"); setQuery("idle"); };
  const faceIdle = face === "idle";
  const faceRun = face === "run";
  const faceDone = face === "done";
  const faceReset = () => { setFace("idle"); setCamNote(""); };

  const runQuery = () => {
    setQuery("loading");
    setTimeout(() => {
      if (dni2.value === DNI_DEMO) setQuery("dup");
      else setQuery(escenario === "ok" ? "ok" : "err");
    }, 1200);
  };

  const faceStart = async (useCamera) => {
    setCamNote("");
    if (useCamera && navigator.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach((t) => t.stop());
        setCamNote("Cámara autorizada. La imagen no se guarda.");
      } catch {
        setCamNote("Permiso de cámara denegado o no disponible. Seguimos con la demostración.");
      }
    }
    setFace("run");
    setTimeout(() => setFace("done"), 1800);
  };

  const pedirUbicacion = (e) => {
    locOk.props.onChange(e);
    if (!e.target.checked) return;
    if (!navigator.geolocation) {
      locOk.setChecked(false);
      setLocNote("Tu navegador no permite ubicación. Elige tu zona a mano.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      () => setLocNote("Ubicación autorizada. Solo se usa una zona aproximada."),
      () => {
        locOk.setChecked(false);
        setLocNote("Ubicación denegada. Podrás elegir tu zona a mano en el siguiente paso.");
      },
      { timeout: 8000 },
    );
  };

  const filtro = busqueda.value.trim().toLowerCase();
  const cur = TERRITORIOS.find((t) => t.id === depId);
  const deps = TERRITORIOS.filter(
    (t) => !filtro || t.name.toLowerCase().includes(filtro) || t.dist.toLowerCase().includes(filtro) || t.locs.some((l) => l.toLowerCase().includes(filtro)),
  ).map((t) => ({ name: t.name, zona: t.zona, cls: chip(t.id === depId), pick: () => { setDepId(t.id); setLoc(t.locs[0]); setJoined(null); } }));
  const locs = cur.locs.map((l) => ({ name: l, cls: chip(l === loc), pick: () => setLoc(l) }));
  const juntasZona = cur.juntas;
  const hayJuntas = juntasZona.length > 0;
  const sinJuntas = !hayJuntas;
  const juntas = juntasZona.map((j) => ({
    name: j.name,
    zona: j.zona,
    open: openJunta === j.id,
    verLbl: openJunta === j.id ? "Ocultar ficha" : "Ver ficha",
    toggle: () => setOpenJunta(openJunta === j.id ? null : j.id),
    joinLbl: joined === j.id ? "✓ Te uniste" : "Unirme",
    joinCls: joined === j.id ? screenStyles.buttonOutline : screenStyles.button,
    join: () => { setJoined(joined === j.id ? null : j.id); setOpenJunta(j.id); },
  }));

  const TUTORIAL = [
    ["Explora lo que hay cerca", "Busca favores, cachuelos y avisos de tu barrio en el mapa o en Mi comunidad."],
    ["Publica en tres pasos", "Elige el tipo, cuéntalo en pocas palabras y revisa antes de publicar."],
    ["Coordina con confianza", "Cuando ambos aceptan se abre un chat temporal. Al terminar, agradece con un sello."],
  ];
  const [tuTitle, tuText] = TUTORIAL[tuNum - 1];
  const tu1 = tuNum === 1, tu2 = tuNum === 2, tu3 = tuNum === 3;
  const d1 = tuNum >= 1 ? "on" : "", d2 = tuNum >= 2 ? "on" : "", d3 = tuNum >= 3 ? "on" : "";
  const tuNext = tuNum < 3;
  const tuLast = tuNum === 3;
  const tuAdv = () => setTuNum((n) => Math.min(3, n + 1));

  const noDataBtn = !dataOk.checked;
  const noData = triedFinish && !dataOk.checked;
  const tryFinish = () => setTriedFinish(true);
  const toggleDetail = () => setShowDetail((v) => !v);
  const locManual = () => { locOk.setChecked(false); setLocNote("Elegirás tu zona a mano en el siguiente paso."); };

  const finishRegistro = () => {
    setSesion({ registrada: true, dni: dni2.value, userId: "maria", departamento: cur.name, localidad: loc, juntaId: joined, ubicacionPermitida: locOk.checked });
    logEvento(`Registro demo completado · ${loc}, ${cur.name}${joined ? " · se unió a una junta" : ""}`);
  };
  const loginDemo = () => {
    setSesion({ registrada: true, userId: "maria", juntaId: sesion.juntaId ?? "campoy" });
    logEvento("Ingreso demo como María");
  };
  const ingresar = (e) => {
    e.preventDefault();
    if (dni.value === DNI_DEMO || (sesion.registrada && dni.value === sesion.dni)) {
      loginDemo();
      router.push("/inicio");
    } else setShowErr(true);
  };
  return (
    <div className={screenStyles.screen}>
      <div className="w-full md:max-w-[46rem] mx-auto h-dvh md:border-x md:border-(--color-line) flex flex-col bg-white overflow-hidden">
      
      {nav.is("acceso") && (<>
      <div className="flex-1 min-h-0 overflow-y-auto pt-1 px-4 pb-6 flex flex-col gap-3.5 pt-7! items-stretch!">
        <div className="flex flex-col! items-center! gap-1!">
          <svg width="76" height="70" viewBox="0 0 64 60" aria-hidden="true"><path d="M5 28 32 5l27 23" fill="none" stroke="#C8102E" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" /><circle cx="32" cy="29" r="5" fill="#C8102E" /><circle cx="20" cy="33" r="4.5" fill="#C8102E" /><circle cx="44" cy="33" r="4.5" fill="#C8102E" /><path d="M25 55V42a7 7 0 0 1 14 0v13zM12 55V44a6 6 0 0 1 11-3M52 55V44a6 6 0 0 0-11-3" fill="#C8102E" /></svg>
          <h1 className="text-[36px]! font-extrabold!"><span className="text-(--color-ink)">Barrio</span><span className="text-(--color-brand)">Conecta</span></h1>
          <p className={`${screenStyles.muted} text-[17px]!`}>Un Perú más cercano</p>
        </div>
        <svg viewBox="0 0 260 72" role="img" aria-labelledby="sep-title" className="block w-full! h-auto!"><title id="sep-title">Separador con una muralla escalonada y tres cuadrados</title><path d="M10 30H54V36H62V45H78V36H86V30H105V24H113V18H122V8H138V18H147V24H155V30H176V36H184V45H200V36H208V30H250" fill="none" stroke="#a19790" strokeWidth="2" strokeLinejoin="round" /><g fill="none" stroke="#bd1227" strokeWidth="2.2"><rect x="65" y="20" width="8" height="8" /><rect x="126" y="30" width="8" height="8" /><rect x="188" y="20" width="8" height="8" /></g></svg>
        <div className={screenStyles.field}>
          <label htmlFor="dni">DNI</label>
          <div className="relative">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="absolute left-3.5! top-[50%]! [transform:translateY(-50%)]! w-6.5! h-6.5! fill-none! stroke-[var(--color-muted)]! stroke-[1.6]! [stroke-linecap:round]! pointer-events-none!"><rect x="2.5" y="5" width="19" height="14" rx="2" /><circle cx="8" cy="11" r="2.2" /><path d="M5 16a3.5 3.5 0 0 1 6 0M14 10h4M14 14h3" /></svg><input id="dni" className="min-h-13 border-[1.5px] border-[#cfc7bf] rounded-[16px] px-3.5 py-0 bg-white w-full focus-visible:border-(--color-brand) pl-12.5!" inputMode="numeric" maxLength="8" placeholder="Ingresa tu DNI" {...dni.props} />
          </div>
          {showErr && (<><p className={screenStyles.error} role="alert">Ese DNI no está registrado en la demostración. Crea tu cuenta o prueba con 12345678.</p></>)}
        </div>
        <button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-(--color-brand) text-white font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed" onClick={ingresar}>Ingresar</button>
        <div className="grid grid-cols-2! gap-3!">
          <button className="min-h-19 rounded-[18px] border-2 border-(--color-line) bg-white text-(--color-ink) font-bold px-5 py-0 flex items-center justify-center gap-1 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed flex-col! text-[16px]!" onClick={() => nav.go("bio_huella")}><svg className="w-6 h-6 fill-current stroke-none stroke-2 [stroke-linecap:round] [stroke-linejoin:round] flex-none text-(--color-brand)! w-7.5! h-7.5!" viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M7 5.21a.77.77 0 0 1-.46-1.38A15.46 15.46 0 0 1 16 1c2.66 0 6.48.45 9.5 2.62a.77.77 0 0 1 .18 1.07a.78.78 0 0 1-1.08.17A15 15 0 0 0 16 2.53a14 14 0 0 0-8.5 2.52a.74.74 0 0 1-.5.16" /><path fill="currentColor" d="M28.23 12.26a.78.78 0 0 1-.63-.33C25.87 9.49 22.78 6.24 16 6.24a14 14 0 0 0-11.63 5.7a.77.77 0 0 1-1.07.17a.76.76 0 0 1-.15-1.11A15.54 15.54 0 0 1 16 4.71c5.61 0 9.81 2.08 12.84 6.34a.77.77 0 0 1-.19 1.07a.8.8 0 0 1-.42.14" /><path fill="currentColor" d="M12.28 31a.78.78 0 0 1-.72-.49a.75.75 0 0 1 .44-1c4.37-1.68 7-5.12 7-9.21a2.8 2.8 0 0 0-3-3c-1.86 0-2.76 1-3 3.35a4.27 4.27 0 0 1-4.52 3.83a4.27 4.27 0 0 1-4.32-4.59A11.71 11.71 0 0 1 16 8.39a12 12 0 0 1 12 11.93a18.7 18.7 0 0 1-1.39 6.5a.78.78 0 0 1-1 .41a.76.76 0 0 1-.41-1a17.3 17.3 0 0 0 1.27-5.91A10.45 10.45 0 0 0 16 9.92a10.18 10.18 0 0 0-10.38 10a2.77 2.77 0 0 0 2.79 3.06a2.74 2.74 0 0 0 3-2.48c.36-3.11 1.89-4.69 4.56-4.69a4.31 4.31 0 0 1 4.52 4.56c0 4.74-3 8.72-8 10.63a1 1 0 0 1-.21 0" /><path fill="currentColor" d="M19.77 30.28a.8.8 0 0 1-.52-.2a.76.76 0 0 1 0-1.08a12.63 12.63 0 0 0 3.54-8.68c0-1.56-.48-6.65-6.7-6.65a6.83 6.83 0 0 0-4.94 1.87A6.17 6.17 0 0 0 9.32 20a.77.77 0 0 1-.77.76a.76.76 0 0 1-.77-.76A7.73 7.73 0 0 1 10 14.46a8.34 8.34 0 0 1 6-2.32c6.08 0 8.24 4.4 8.24 8.18a14.1 14.1 0 0 1-3.9 9.68a.75.75 0 0 1-.57.28" /><path fill="currentColor" d="M8.66 27.74a14 14 0 0 1-1.56-.09a.76.76 0 1 1 .17-1.52c2.49.28 4.45-.16 5.84-1.32a6.37 6.37 0 0 0 2.12-4.53a.75.75 0 0 1 .82-.71a.78.78 0 0 1 .72.81A7.9 7.9 0 0 1 14.09 26a8.2 8.2 0 0 1-5.43 1.74" /></svg>Huella</button>
          <button className="min-h-19 rounded-[18px] border-2 border-(--color-line) bg-white text-(--color-ink) font-bold px-5 py-0 flex items-center justify-center gap-1 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed flex-col! text-[16px]!" onClick={() => nav.go("bio_rostro")}><svg className="w-6 h-6 fill-none stroke-current stroke-1 [stroke-linecap:round] [stroke-linejoin:round] flex-none text-(--color-brand)! w-7.5! h-7.5!" viewBox="0 0 14 14" aria-hidden="true"><path d="M4 3.988v1m6-1v1m-3 .5v1.25a1 1 0 0 1-1 1h-.5m-.214 2.564a2.49 2.49 0 0 0 3.428 0m1.3-9.372q.555.061 1.102.125a2.09 2.09 0 0 1 1.833 1.836l.12 1.095m-3.055 9.058q.555-.06 1.102-.125a2.09 2.09 0 0 0 1.833-1.836l.12-1.095M4 .93q-.555.061-1.102.125A2.09 2.09 0 0 0 1.065 2.89q-.062.543-.12 1.095M4 13.044q-.555-.06-1.102-.125a2.09 2.09 0 0 1-1.833-1.836q-.062-.542-.12-1.095" /></svg>Rostro</button>
        </div>
        <button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-white text-(--color-brand) font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed border-[transparent]! bg-none! bg-transparent!" onClick={() => nav.go("dni")}>Crear cuenta</button>
        <p className={`${screenStyles.muted} text-center!`}>Ingreso por DNI de demostración. No es seguridad real de producción.</p>
        <svg viewBox="0 0 358 150" width="100%" aria-hidden="true" className="mt-auto! rounded-[20px]!"><rect width="358" height="150" fill="#F6EEE3" /><path d="M180 120 270 56l70 52v42H180z" fill="#E9E1D6" /><rect x="14" y="70" width="86" height="80" fill="#F4D9C6" /><path d="M8 72 57 40l49 32z" fill="#C8102E" /><rect x="30" y="92" width="22" height="26" fill="#fff" stroke="#C8102E" strokeWidth="2" /><rect x="62" y="104" width="22" height="46" fill="#8A5300" /><rect x="108" y="86" width="70" height="64" fill="#F8E6B8" /><path d="M104 88 143 62l39 26z" fill="#E6B34A" /><rect x="124" y="104" width="20" height="22" fill="#fff" stroke="#8A5300" strokeWidth="2" /><rect x="196" y="78" width="80" height="72" fill="#FBE0E3" /><path d="M190 80 236 52l46 28z" fill="#C8102E" /><circle cx="318" cy="84" r="24" fill="#6E9B55" /><circle cx="300" cy="96" r="16" fill="#86B06B" /><rect x="314" y="96" width="6" height="54" fill="#7A5A3A" /><rect x="284" y="64" width="3" height="86" fill="#3F4A50" /><circle cx="285" cy="62" r="6" fill="#F3C969" /><rect x="0" y="136" width="358" height="14" fill="#D9CDBE" /></svg>
      </div>
      </>)}
      
      {nav.is("bio_huella") && (<>
      <div className={screenStyles.header}><button className={screenStyles.iconButton} aria-label="Volver" onClick={nav.back}><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Ingreso con huella</h1></div>
      <div className="flex-1 min-h-0 overflow-y-auto pt-1 px-4 pb-6 flex flex-col gap-4 items-center! justify-center! text-center!">
        <span className={screenStyles.badgeDemo}>Simulación de demostración</span>
        <svg className="w-6 h-6 fill-none stroke-current stroke-[1.4] [stroke-linecap:round] [stroke-linejoin:round] flex-none text-(--color-brand)! w-30! h-30!" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 11v4a6 6 0 0 1-1 3M8 11a4 4 0 0 1 8 0v2a9 9 0 0 1-1 4M5 12a7 7 0 0 1 14 0v1M6 17a12 12 0 0 0 1 2" /></svg>
        <h2 className="text-[24px]!">Apoya tu dedo en el lector</h2>
        <p className={screenStyles.muted}>Esta experiencia es solo de demostración. No se lee ni se guarda ninguna huella real.</p>
        <a className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-(--color-brand) text-white font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed" href="/inicio" onClick={loginDemo}>Simular ingreso como María</a>
        <button className="min-h-13 rounded-[18px] border-2 border-(--color-line) bg-white text-(--color-ink) font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => nav.go("acceso")}>Cancelar</button>
      </div>
      </>)}
      
      {nav.is("bio_rostro") && (<>
      <div className={screenStyles.header}><button className={screenStyles.iconButton} aria-label="Volver" onClick={nav.back}><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Ingreso con rostro</h1></div>
      <div className="flex-1 min-h-0 overflow-y-auto pt-1 px-4 pb-6 flex flex-col gap-4 items-center! justify-center! text-center!">
        <span className={screenStyles.badgeDemo}>Simulación de demostración</span>
        <svg className="w-6 h-6 fill-none stroke-current stroke-[1.4] [stroke-linecap:round] [stroke-linejoin:round] flex-none text-(--color-brand)! w-30! h-30!" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M9 10v1M15 10v1M9 15c1.5 1.5 4.5 1.5 6 0" /></svg>
        <h2 className="text-[24px]!">Mira al frente</h2>
        <p className={screenStyles.muted}>No se usa tu cámara en esta simulación ni se conserva ninguna imagen de tu rostro.</p>
        <a className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-(--color-brand) text-white font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed" href="/inicio" onClick={loginDemo}>Simular ingreso como María</a>
        <button className="min-h-13 rounded-[18px] border-2 border-(--color-line) bg-white text-(--color-ink) font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => nav.go("acceso")}>Cancelar</button>
      </div>
      </>)}
      
      {nav.is("dni") && (<>
      <div className={screenStyles.header}><button className={screenStyles.iconButton} aria-label="Volver" onClick={nav.back}><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Crear cuenta</h1></div>
      <div className="flex gap-1.5 pt-0 px-4 pb-2 [&_i]:flex-1 [&_i]:h-1.5 [&_i]:rounded-[3px] [&_i]:bg-(--color-line) [&_i.on]:bg-(--color-brand)" aria-hidden="true"><i className="on"></i><i></i><i></i></div>
      <div className="flex-1 min-h-0 overflow-y-auto pt-1 px-4 pb-6 flex flex-col gap-4">
        <p className={`${screenStyles.muted} font-bold!`}>Paso 1 de 3 · Tu DNI</p>
        <span className={screenStyles.badgeDemo}>Consulta RENIEC y PNP simulada</span>
        <div className={screenStyles.field}><label htmlFor="dni2">DNI de demostración (8 dígitos)</label><input id="dni2" className="min-h-13 border-[1.5px] border-[#cfc7bf] rounded-[16px] px-3.5 py-0 bg-white w-full focus-visible:border-(--color-brand)" inputMode="numeric" maxLength="8" {...dni2.props} /></div>
        <div className={screenStyles.field}><p className="font-bold! text-[15px]!">Resultado que quieres probar</p>
          <div className={screenStyles.wrap}><button className={chipOk} onClick={scenOk}>Resultado válido</button><button className={chipErr} onClick={scenErr}>Con error</button></div></div>
        {canQuery && (<><button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-(--color-brand) text-white font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed" onClick={runQuery}>Consultar (simulado)</button></>)}
        {cantQuery && (<><button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-(--color-brand) text-white font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed" disabled>Escribe 8 dígitos</button></>)}
        {qLoading && (<><div className="bg-white border border-(--color-line) rounded-[20px] p-4 shadow-[0_2px_8px_rgba(32,33,36,.05)] flex flex-col gap-2" role="status"><p className="font-bold!">Consultando… (simulado)</p><p className={screenStyles.muted}>RENIEC · PNP</p></div></>)}
        {qOk && (<>
          <div className="bg-white border border-(--color-line) rounded-[20px] p-4 shadow-[0_2px_8px_rgba(32,33,36,.05)] flex flex-col gap-2" role="status"><p className={screenStyles.success}>✓ Consulta simulada completada</p><p className={screenStyles.muted}>No se muestran datos personales reales ni antecedentes. Es solo una demostración.</p></div>
          <button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-(--color-brand) text-white font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => nav.go("rostro")}>Continuar</button>
        </>)}
        {qErr && (<>
          <div className="bg-white border border-(--color-line) rounded-[20px] p-4 shadow-[0_2px_8px_rgba(32,33,36,.05)] flex flex-col gap-2" role="alert"><p className={screenStyles.error}>{query === "dup" ? "Este DNI ya tiene una cuenta de demostración" : "No pudimos validar este DNI (error simulado)"}</p><p className={screenStyles.muted}>{query === "dup" ? "Ingresa con él desde la pantalla de acceso o usa otro número." : "Revisa el número o intenta de nuevo."}</p></div>
          <button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-white text-(--color-brand) font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed" onClick={runQuery}>Reintentar</button>
        </>)}
      </div>
      </>)}
      
      {nav.is("rostro") && (<>
      <div className={screenStyles.header}><button className={screenStyles.iconButton} aria-label="Volver" onClick={nav.back}><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Crear cuenta</h1></div>
      <div className="flex gap-1.5 pt-0 px-4 pb-2 [&_i]:flex-1 [&_i]:h-1.5 [&_i]:rounded-[3px] [&_i]:bg-(--color-line) [&_i.on]:bg-(--color-brand)" aria-hidden="true"><i className="on"></i><i className="on"></i><i></i></div>
      <div className="flex-1 min-h-0 overflow-y-auto pt-1 px-4 pb-6 flex flex-col gap-4">
        <p className={`${screenStyles.muted} font-bold!`}>Paso 2 de 3 · Tu rostro</p>
        <span className={screenStyles.badgeDemo}>Comparación facial simulada</span>
        <div className="grid grid-cols-2! gap-3!">
          <div className="relative h-47.5! rounded-[20px]! bg-white! border-2! border-dashed! border-(--color-brand)! grid! place-items-center! overflow-hidden!">
            <svg viewBox="0 0 100 130" width="80" aria-hidden="true"><ellipse cx="50" cy="62" rx="36" ry="48" fill="none" stroke="#C8102E" strokeWidth="3" strokeDasharray="6 5" /></svg>
            {faceRun && (<><span ref={animateScan} className="absolute top-[50%] left-[8%] right-[8%] h-[3px] bg-(--color-brand) opacity-80"></span></>)}
            <p className={`${screenStyles.muted} absolute! bottom-2! text-[13px]! text-center!`}>Tu cámara</p>
          </div>
          <div className="border border-(--color-line) h-47.5! rounded-[20px]! bg-white! p-3! flex! flex-col! gap-2! justify-center! items-center!">
            <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="#5E6268" strokeWidth="1.6" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="2" /><circle cx="8" cy="11" r="2.5" /><path d="M4.5 16a4 4 0 0 1 7 0M14 10h5M14 14h4" /></svg>
            <p className={`${screenStyles.muted} text-[14px]! text-center!`}>Foto de DNI ficticia</p>
          </div>
        </div>
        <p className={screenStyles.muted}>Tu navegador te pedirá permiso antes de usar la cámara. Sin cámara, usa la demostración.</p>
        {camNote && (<p className={screenStyles.muted} role="status">{camNote}</p>)}
        {faceIdle && (<>
          <button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-(--color-brand) text-white font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => faceStart(true)}>Tomar foto (simulado)</button>
          <button className="min-h-13 rounded-[18px] border-2 border-(--color-line) bg-white text-(--color-ink) font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => faceStart(false)}>No tengo cámara · usar demostración</button>
        </>)}
        {faceRun && (<><div className="bg-white border border-(--color-line) rounded-[20px] p-4 shadow-[0_2px_8px_rgba(32,33,36,.05)] flex flex-col gap-2" role="status"><p className="font-bold!">Comparando… (simulado)</p></div></>)}
        {faceDone && (<>
          <div className="bg-white border border-(--color-line) rounded-[20px] p-4 shadow-[0_2px_8px_rgba(32,33,36,.05)] flex flex-col gap-2" role="status"><p className={screenStyles.success}>✓ Coincidencia simulada</p><p className={screenStyles.muted}>No se guarda biometría real.</p></div>
          <button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-(--color-brand) text-white font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => nav.go("permisos")}>Continuar</button>
          <button className="min-h-13 rounded-[18px] border-2 border-(--color-line) bg-white text-(--color-ink) font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed" onClick={faceReset}>Repetir captura</button>
        </>)}
      </div>
      </>)}
      
      {nav.is("permisos") && (<>
      <div className={screenStyles.header}><button className={screenStyles.iconButton} aria-label="Volver" onClick={nav.back}><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Crear cuenta</h1></div>
      <div className="flex gap-1.5 pt-0 px-4 pb-2 [&_i]:flex-1 [&_i]:h-1.5 [&_i]:rounded-[3px] [&_i]:bg-(--color-line) [&_i.on]:bg-(--color-brand)" aria-hidden="true"><i className="on"></i><i className="on"></i><i className="on"></i></div>
      <div className="flex-1 min-h-0 overflow-y-auto pt-1 px-4 pb-6 flex flex-col gap-4">
        <p className={`${screenStyles.muted} font-bold!`}>Paso 3 de 3 · Tus permisos</p>
        <div className="bg-white border border-(--color-line) rounded-[20px] p-4 shadow-[0_2px_8px_rgba(32,33,36,.05)] flex flex-col gap-2">
          <div className={screenStyles.checkboxRow}><input id="c1" type="checkbox" checked={locOk.checked} onChange={pedirUbicacion} /><label htmlFor="c1"><b>Usar mi ubicación</b><br /><span className={screenStyles.muted}>Para mostrarte vecinos y alertas cerca. Puedes elegir tu zona a mano.</span></label></div>
          <button className="min-h-11 rounded-full border-[1.5px] border-[#cfc7bf] bg-white px-4 py-0 font-bold text-[15px] self-start!" onClick={locManual}>Prefiero elegir mi zona</button>
          {locNote && (<p className={screenStyles.muted} role="status">{locNote}</p>)}
        </div>
        <div className="bg-white border border-(--color-line) rounded-[20px] p-4 shadow-[0_2px_8px_rgba(32,33,36,.05)] flex flex-col gap-2">
          <div className={screenStyles.checkboxRow}><input id="c2" type="checkbox" {...dataOk.props} /><label htmlFor="c2"><b>Tratar mis datos personales</b><br /><span className={screenStyles.muted}>Necesario para crear tu cuenta. Tu DNI nunca es público.</span></label></div>
          <button className="min-h-11 rounded-full border-[1.5px] border-[#cfc7bf] bg-white p-0 font-bold text-[15px] self-start! border-[transparent]! text-(--color-brand)!" onClick={toggleDetail}>Ver detalle</button>
          {showDetail && (<><p className={screenStyles.muted}>Usamos tu DNI solo para identificar tu cuenta de demostración. Muestras un nombre público mínimo y una zona aproximada.</p></>)}
        </div>
        {noData && (<><div className="bg-white border border-(--color-line) rounded-[20px] p-4 shadow-[0_2px_8px_rgba(32,33,36,.05)] flex flex-col gap-2" role="alert"><p className={screenStyles.error}>Sin este consentimiento no creamos tu cuenta.</p><p className={screenStyles.muted}>Puedes seguir viendo el directorio público de juntas y contactos de emergencia.</p></div></>)}
        {dataOk.checked && (<><button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-(--color-brand) text-white font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => nav.go("territorio")}>Finalizar registro</button></>)}
        {noDataBtn && (<><button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-(--color-brand) text-white font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed" onClick={tryFinish}>Finalizar registro</button></>)}
      </div>
      </>)}
      
      {nav.is("territorio") && (<>
      <div className={screenStyles.header}><button className={screenStyles.iconButton} aria-label="Volver" onClick={nav.back}><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>¿Dónde vives?</h1></div>
      <div className="flex-1 min-h-0 overflow-y-auto pt-1 px-4 pb-6 flex flex-col gap-4">
        <div className={screenStyles.field}><label htmlFor="busq">Buscar tu localidad</label><input id="busq" className="min-h-13 border-[1.5px] border-[#cfc7bf] rounded-[16px] px-3.5 py-0 bg-white w-full focus-visible:border-(--color-brand)" placeholder="Distrito o barrio" {...busqueda.props} /></div>
        <p className="font-bold! text-[15px]!">Departamento</p>
        <div className={screenStyles.wrap}>
          {(deps ?? []).map((d, __i1) => (<Fragment key={__i1}><button className={d.cls} onClick={d.pick}>{d.name} · {d.zona}</button></Fragment>))}
        </div>
        <div className="bg-white border border-(--color-line) rounded-[20px] p-4 shadow-[0_2px_8px_rgba(32,33,36,.05)] flex flex-col gap-2">
          <p className={screenStyles.muted}>Provincia</p><p className="font-bold!">{cur.prov}</p>
          <p className={screenStyles.muted}>Distrito</p><p className="font-bold!">{cur.dist}</p>
          <p className={screenStyles.muted}>Localidad o comunidad</p>
          <div className={screenStyles.wrap}>{(locs ?? []).map((l, __i1) => (<Fragment key={__i1}><button className={l.cls} onClick={l.pick}>{l.name}</button></Fragment>))}</div>
        </div>
        <div className="relative h-23! rounded-[20px]! bg-[#efe8dd]! border! border-(--color-line)! overflow-hidden!">
          <svg viewBox="0 0 358 92" width="100%" height="92" aria-hidden="true"><path d="M0 60 70 40l60 16 80-30 70 26 78-14" fill="none" stroke="#CFC4B3" strokeWidth="2" /><path d="M0 80 90 62l80 10 90-24 98 20" fill="none" stroke="#CFC4B3" strokeWidth="2" /><path d="M179 24s-9-8-9-14a9 9 0 0 1 18 0c0 6-9 14-9 14z" transform="translate(0 20)" fill="#C8102E" /></svg>
          <span className={`${screenStyles.badgeDemo} absolute! left-2! bottom-2!`}>Mapa de demostración</span>
        </div>
        <button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-(--color-brand) text-white font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => nav.go("juntas")}>Confirmar zona</button>
        <p className={`${screenStyles.muted} text-center!`}>Lima es solo un ejemplo: BarrioConecta sirve en costa, sierra y selva.</p>
      </div>
      </>)}
      
      {nav.is("juntas") && (<>
      <div className={screenStyles.header}><button className={screenStyles.iconButton} aria-label="Volver" onClick={nav.back}><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Juntas cerca de ti</h1></div>
      <div className="flex-1 min-h-0 overflow-y-auto pt-1 px-4 pb-6 flex flex-col gap-4">
        <p className={screenStyles.muted}>Sumarte es voluntario. Puedes usar toda la app sin junta.</p>
        {hayJuntas && (<>
          {(juntas ?? []).map((j, __i1) => (<Fragment key={__i1}>
            <div className="border border-(--color-line) rounded-[20px] bg-white p-4 flex flex-col gap-2.5">
              <div className={screenStyles.row}><svg className={`${screenStyles.icon} text-(--color-brand)!`} viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3" /><circle cx="5" cy="10" r="2.2" /><circle cx="19" cy="10" r="2.2" /><path d="M6 20a6 6 0 0 1 12 0M1.5 18a4 4 0 0 1 4-4M22.5 18a4 4 0 0 0-4-4" /></svg><div className={screenStyles.grow}><h3 className="text-[19px]!">{j.name}</h3><p className={screenStyles.muted}>{j.zona}</p></div></div>
              <span className={screenStyles.badgeDemo}>Junta de demostración</span>
              {j.open && (<><p className={screenStyles.muted}>Avisos del barrio, pedidos de ayuda y traslados solidarios entre miembros. Sin reconocimiento oficial; no verifica a nadie.</p></>)}
              <div className="grid grid-cols-2! gap-2!">
                <button className="min-h-12 rounded-[18px] border-2 border-(--color-line) bg-white text-(--color-ink) font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed" onClick={j.toggle}>{j.verLbl}</button>
                <button className={`${j.joinCls} min-h-12!`} onClick={j.join}>{j.joinLbl}</button>
              </div>
            </div>
          </Fragment>))}
        </>)}
        {sinJuntas && (<><div className="bg-white border border-(--color-line) rounded-[20px] p-4 shadow-[0_2px_8px_rgba(32,33,36,.05)] flex flex-col gap-2" role="status"><p className="font-bold!">Aún no hay juntas en esta zona</p><p className={screenStyles.muted}>Puedes usar BarrioConecta con normalidad. Más adelante podrás sumarte si se registra una.</p></div></>)}
        <button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-(--color-brand) text-white font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => nav.go("tutorial")}>Continuar</button>
        <button className="min-h-13 rounded-[18px] border-2 border-(--color-line) bg-white text-(--color-ink) font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => nav.go("tutorial")}>Ahora no</button>
      </div>
      </>)}
      
      {nav.is("tutorial") && (<>
      <div className={screenStyles.header}><h1 className="pl-2">Así funciona</h1><a className="min-h-11 rounded-[18px] border-2 border-(--color-line) bg-white text-(--color-ink) font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed w-auto! text-[15px]!" href="/inicio" onClick={finishRegistro}>Omitir</a></div>
      <div className="flex-1 min-h-0 overflow-y-auto pt-1 px-4 pb-6 flex flex-col gap-5 justify-center!">
        <div className="bg-white border border-(--color-line) rounded-[20px] px-5 py-7 shadow-[0_2px_8px_rgba(32,33,36,.05)] flex flex-col gap-2 items-center! text-center!">
          <span className={screenStyles.badgeAlert}>Paso {tuNum} de 3</span>
          <svg className="w-6 h-6 fill-none stroke-current stroke-[1.5] [stroke-linecap:round] [stroke-linejoin:round] flex-none text-(--color-brand)! w-18! h-18!" viewBox="0 0 24 24" aria-hidden="true">{tu1 && (<><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></>)}{tu2 && (<><path d="M12 5v14M5 12h14" /></>)}{tu3 && (<><path d="M4 5h16v11H9l-5 4z" /></>)}</svg>
          <h2 className="text-[26px]!">{tuTitle}</h2>
          <p className={`${screenStyles.muted} text-[17px]!`}>{tuText}</p>
        </div>
        <div className="flex gap-1.5 pt-0 px-4 pb-2 [&_i]:flex-1 [&_i]:h-1.5 [&_i]:rounded-[3px] [&_i]:bg-(--color-line) [&_i.on]:bg-(--color-brand) justify-center!" aria-hidden="true"><i className={`${d1} max-w-9!`}></i><i className={`${d2} max-w-9!`}></i><i className={`${d3} max-w-9!`}></i></div>
        {tuNext && (<><button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-(--color-brand) text-white font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed" onClick={tuAdv}>Siguiente</button></>)}
        {tuLast && (<><a className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-(--color-brand) text-white font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed" href="/inicio" onClick={finishRegistro}>Ir a mi inicio</a></>)}
        <p className={`${screenStyles.muted} text-center!`}>¿Es una emergencia? Llama al 106 o al 116 desde tu teléfono en cualquier momento.</p>
      </div>
      </>)}
      
      </div>
    </div>
  );
}
