"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useDemoState } from "@/lib/demo/store";
import { useSesion, VECINOS } from "@/lib/demo/shared";
import { useIncidentes, autoresDistintos, posInc, entidadDeIncidente, estadoOpDe } from "@/lib/demo/incidentes";
import { usePublicaciones } from "@/lib/demo/publicaciones";
import { distancia, enLima, porcentajeALngLat } from "@/lib/map/geo";
import { ESTADO_PERSONA, INCIDENTES_SIM, MI_ZONA, PERSONAS_SIM } from "@/lib/map/personas";
import { ANEXO_22, COMUNIDAD_SIM } from "@/lib/map/comunidad";
import { CAMPOY } from "@/lib/map/geo";
import MapaBase from "@/components/map/MapaBase";
import RutaJuntosPanel from "@/components/map/RutaJuntosPanel";
import { FichaCalor, FichaPersona, LeyendaCalor, RadarTira } from "@/components/map/FichasMapa";
import FichaRuta from "@/components/map/FichaRuta";
import { useRutaJuntos } from "@/components/map/use-rutajuntos";
import { screenStyles } from "./screen-styles";

const MAPA_UI = { fav: true, cac: true, eme: true, heat: false, zoom: 1 };
const CHIP = "min-h-10 rounded-full border-[1.5px] px-3 font-bold text-[14px] whitespace-nowrap flex items-center gap-1.5";
const OFF = `${CHIP} border-[#cfc7bf] bg-white`;
const ON = { fav: `${CHIP} border-[#2f5a2d] bg-[#2f5a2d] text-white`, cac: `${CHIP} border-[#8a5300] bg-[#8a5300] text-white`, eme: `${CHIP} border-[#9a3412] bg-[#9a3412] text-white`, heat: `${CHIP} border-[#c8102e] bg-[#c8102e] text-white`, radar: `${CHIP} border-[#2f7d32] bg-[#2f7d32] text-white`, ruta: `${CHIP} border-[#1f3a5f] bg-[#1f3a5f] text-white` };
const MK_BASE = "w-11 h-11 rounded-[50%] grid place-items-center font-extrabold text-[17px] font-[Nunito,system-ui,sans-serif] border-3 border-white text-white shadow-[0_2px_6px_rgba(0,0,0,.25)] relative [&_.b]:absolute [&_.b]:right-[-6px] [&_.b]:top-[-6px] [&_.b]:w-5 [&_.b]:h-5 [&_.b]:rounded-[50%] [&_.b]:bg-white [&_.b]:text-(--color-ink) [&_.b]:border-[1.5px] [&_.b]:border-current [&_.b]:grid [&_.b]:place-items-center [&_.b_svg]:w-3 [&_.b_svg]:h-3 [&_.b_svg]:fill-none [&_.b_svg]:stroke-current [&_.b_svg]:stroke-[2.4] [&_.b_svg]:[stroke-linecap:round] [&_.b_svg]:[stroke-linejoin:round]";
const MK_GRUPO = `${MK_BASE} bg-(--color-ink)`;
const mkPersona = (estado) => `${MK_BASE} ${ESTADO_PERSONA[estado].fondo}`;
const MK_VEH = "w-11 h-11 rounded-[12px] grid place-items-center bg-[#1f3a5f] border-3 border-white text-white shadow-[0_2px_8px_rgba(0,0,0,.35)]";
const MK_A = "w-9 h-9 rounded-[50%] grid place-items-center font-extrabold text-[16px] bg-(--color-ink) border-3 border-white text-white shadow-[0_2px_6px_rgba(0,0,0,.3)]";
const MK_B = "w-9 h-9 rounded-[50%] grid place-items-center font-extrabold text-[16px] bg-(--color-brand) border-3 border-white text-white shadow-[0_2px_6px_rgba(0,0,0,.3)]";
const MK_GPS = "w-5 h-5 rounded-[50%] bg-[#1f6feb] border-[3px] border-white shadow-[0_0_0_6px_rgba(31,111,235,.25)]";
const MK_REF = "w-8 h-8 rounded-[8px] grid place-items-center font-extrabold text-[20px] bg-white border-2 border-dashed border-(--color-ink) text-(--color-ink) shadow-[0_1px_4px_rgba(0,0,0,.3)]";
const MK_PARADA = "w-7 h-7 rounded-[8px] grid place-items-center font-extrabold text-[13px] bg-white border-2 border-[#1f3a5f] text-[#1f3a5f] shadow-[0_1px_4px_rgba(0,0,0,.25)]";
const INSIGNIA = {
  movilidad: "M5 16V11l2-5h10l2 5v5M5 16h14M8 13h.01M16 13h.01",
  favor: "M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z",
  cachuelo: "M14.5 5.5a4 4 0 0 0-5 5L3 17l4 4 6.5-6.5a4 4 0 0 0 5-5L16 12l-3-1-1-3z",
  emergencia: "M12 5v8M12 17v.5",
};
const FILTROS_FILA = "flex gap-2 pt-0 pl-4 pr-9 pb-2 overflow-x-auto flex-none snap-x scroll-pl-4 [&>*]:shrink-0 [&>*]:snap-start [mask-image:linear-gradient(to_right,#000_calc(100%-28px),transparent)]";

/** Personas semilla de Favores y Cachuelos, con ubicación pública aproximada. */
const BASE = [
  { key: "f1", kind: "fav", estado: "solicita", tipo: "favor", vecino: "maria", x: 30, y: 36, nombre: "María", msg: "Necesito escalera de 3 m", necesidad: "Necesito una escalera de 3 metros prestada", origen: "Campoy Sector 2", note: "Herramientas · hoy por la tarde", href: "/favores" },
  { key: "f2", kind: "fav", estado: "disponible", tipo: "favor", vecino: "rosa", x: 36, y: 42, nombre: "Rosa", msg: "Ayudo con trámites digitales", necesidad: "Ayudo con trámites digitales a adultos mayores", origen: "Campoy Sector 4", note: "Habilidades · sábados por la mañana", href: "/favores" },
  { key: "c1", kind: "cac", estado: "disponible", tipo: "cachuelo", vecino: "pedro", x: 68, y: 33, nombre: "Pedro", msg: "Arreglo fugas de agua", necesidad: "Gasfitería · arreglo fugas de agua", origen: "Campoy Sector 3", note: "A convenir · lo recomiendan 4 vecinos", href: "/cachuelos" },
  { key: "c2", kind: "cac", estado: "disponible", tipo: "cachuelo", vecino: null, x: 74, y: 39, nombre: "Ana", msg: "Clases de matemática", necesidad: "Clases de matemática de secundaria", origen: "Campoy Sector 1", note: "S/ 25 por hora · vecina nueva", href: "/cachuelos" },
];
const hash = (s) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 997, 7);
const tipoSim = (t) => (/inund/i.test(t) ? "inundacion" : /agua/i.test(t) ? "agua" : "ayuda");

/**
 * Pantalla Mapa: mapa geográfico real de Lima (MapLibre) con capas de la comunidad, Radar, Calor y RutaJuntos.
 * Geografía y calles: datos reales. Personas, incidentes, vehículos y pasajeros: simulaciones locales.
 */
export default function Mapa() {
  const [sesion, setSesion] = useSesion();
  const [incsAll] = useIncidentes();
  const [pubs] = usePublicaciones();
  const [ui, setUi] = useDemoState("mapa-ui", MAPA_UI);
  const [selKey, setSelKey] = useState(null);
  const [selCalor, setSelCalor] = useState(null);
  const [modoRuta, setModoRuta] = useState(false);
  const [panelAbierto, setPanelAbierto] = useState(true);
  // Centro del radar: ubicación del navegador (con permiso) o punto manual de referencia. Nunca se guarda ni se envía.
  const [radar, setRadar] = useState({ activo: false, km: 5, centro: null, origen: null, estado: "idle", eligiendo: false });
  const apiRef = useRef(null);
  const rj = useRutaJuntos({ activo: modoRuta, apiRef });
  const { fav, cac, eme, heat } = ui;
  const offline = sesion.senal === "Sin datos";

  // Solo incidentes con al menos un reporte enviado (los pendientes no se publican)
  const incs = useMemo(() => incsAll.items.filter((i) => i.reportes.some((r) => r.estado === "enviado")), [incsAll.items]);

  // Entidades del mapa: mismo registro que los muros + personas e incidentes simulados
  const entidades = useMemo(() => {
    const lista = [
      ...BASE.filter((p) => (p.kind === "fav" && fav) || (p.kind === "cac" && cac)).map((p) => ({ ...p, lngLat: porcentajeALngLat(p.x, p.y), simulado: true })),
      ...PERSONAS_SIM.filter((p) => (p.estado === "emergencia" ? eme : fav)).map((p) => ({ ...p, kind: p.estado === "emergencia" ? "eme" : "fav", nombre: VECINOS[p.vecino].name, simulado: true, note: "Persona simulada" })),
      ...COMUNIDAD_SIM.filter((c) => (c.tipo === "cachuelo" ? cac : c.estado === "emergencia" ? eme : fav)).map((c) => ({ ...c, kind: c.tipo === "cachuelo" ? "cac" : c.estado === "emergencia" ? "eme" : "fav", nombre: VECINOS[c.vecino].name, necesidad: c.titulo, comunidad: true, simulado: true, note: c.categoria })),
      ...pubs.items.filter((p) => p.estado === "publicado" && ((p.tipo === "favor" && fav) || (p.tipo === "cachuelo" && cac)))
        .map((p) => ({ key: p.id, kind: p.tipo === "favor" ? "fav" : "cac", estado: p.modo === "pido" ? "solicita" : "disponible", tipo: p.tipo === "favor" ? (p.categoria === "Movilidad" ? "movilidad" : "favor") : "cachuelo", vecino: p.autor, lngLat: porcentajeALngLat(15 + (hash(p.id) % 70), 15 + (hash(p.id + "y") % 55)), nombre: VECINOS[p.autor]?.name ?? "Tú", msg: p.titulo, necesidad: p.titulo, origen: p.zona, note: `${p.categoria} · ${p.disponibilidad}`, href: p.tipo === "favor" ? "/favores" : "/cachuelos" })),
      ...(eme ? incs.filter((i) => estadoOpDe(i) !== "Resuelta").map((i) => ({ ...entidadDeIncidente(i), kind: "eme", href: "/emergencias" })) : []),
      ...(eme && radar.activo ? INCIDENTES_SIM.map((i) => ({ key: i.id, kind: "eme", estado: "emergencia", tipo: "emergencia", vecino: null, lngLat: i.lngLat, nombre: i.titulo, msg: i.titulo, necesidad: i.detalle, origen: "", href: i.href, simulado: true })) : []),
    ];
    const ref = radar.activo ? radar.centro : MI_ZONA;
    return lista.map((p) => ({ ...p, dist: ref ? distancia(ref, p.lngLat) : Infinity }));
  }, [fav, cac, eme, pubs.items, incs, radar.activo, radar.centro]);

  const visibles = useMemo(() => (radar.activo ? entidades.filter((p) => p.dist <= radar.km * 1000) : entidades), [entidades, radar.activo, radar.km]);
  const resultados = useMemo(() => [...visibles].sort((a, b) => a.dist - b.dist), [visibles]);
  const puntosMapa = useMemo(() => visibles.map((p) => ({ key: p.key, lngLat: p.lngLat, cls: mkPersona(p.estado), persona: true, title: `${p.nombre}: ${p.msg}`, bub: p.msg, badge: INSIGNIA[p.estado === "emergencia" ? "emergencia" : p.tipo], sos: p.sos })), [visibles]);

  // Calor: incidentes SIMULADOS (sismos, inundaciones, cortes de agua, solicitudes de ayuda)
  const calorItems = useMemo(() => (heat ? [
    ...INCIDENTES_SIM,
    ...incs.map((i) => ({ id: i.id, tipo: tipoSim(i.tipo), lngLat: posInc(i), intensidad: Math.min(5, 1 + autoresDistintos(i) * 2), radioM: 380 + autoresDistintos(i) * 120, titulo: i.titulo, detalle: `${autoresDistintos(i)} ${autoresDistintos(i) === 1 ? "vecino reportó" : "vecinos distintos reportaron"} en ${i.zona}.`, hace: i.actualizado, href: "/emergencias" })),
  ] : []), [heat, incs]);
  const calor = useMemo(() => calorItems.map((i) => ({ id: i.id, lngLat: i.lngLat, r: i.radioM / 9.3, i: i.intensidad })), [calorItems]);
  const conteo = useMemo(() => calorItems.reduce((a, i) => ({ ...a, [i.tipo]: (a[i.tipo] ?? 0) + 1 }), {}), [calorItems]);
  const radarGeo = useMemo(() => (radar.activo && radar.centro ? { centro: radar.centro, radioM: radar.km * 1000 } : null), [radar.activo, radar.centro, radar.km]);

  // Marcadores de RutaJuntos: origen, destino, pasajeros sin recoger y paradas pendientes
  const sigPas = rj.evaluaciones.map((e) => `${e.p.id}:${e.estado}`).join("|");
  const sigParadas = rj.paradas.filter((s) => !s.hecha).map((s) => `${s.pasajeroId}-${s.tipo}`).join("|");
  const extras = useMemo(() => {
    const out = [];
    if (radar.activo && radar.centro && !modoRuta) {
      out.push(radar.origen === "gps"
        ? { key: "centro-radar", lngLat: radar.centro, cls: MK_GPS, ini: "", ancla: "center", bub: "Tu ubicación", label: "Centro del radar: tu ubicación actual" }
        : { key: "centro-radar", lngLat: radar.centro, cls: MK_REF, ini: "+", ancla: "center", bub: "Punto de referencia (manual)", label: "Centro del radar: punto de referencia manual" });
    }
    if (!modoRuta) return out;
    if (rj.A) out.push({ key: "A", lngLat: rj.A, cls: MK_A, ini: "A", label: "Origen A" });
    if (rj.B) out.push({ key: "B", lngLat: rj.B, cls: MK_B, ini: "B", label: "Destino B" });
    rj.evaluaciones.forEach(({ p, estado }) => {
      if (estado === "abordo" || estado === "entregado") return;
      out.push({ key: p.id, lngLat: p.origen, cls: mkPersona(estado === "aceptado" ? "disponible" : "solicita"), persona: true, badge: INSIGNIA.movilidad, bub: p.msg, onClick: () => setSelKey(p.id), label: `Pasajero simulado: ${VECINOS[p.vecino].name}, ${estado === "aceptado" ? "aceptado" : "solicita movilidad"}. Toca para ver su ficha` });
    });
    rj.paradas.filter((s) => !s.hecha).forEach((s) => out.push({ key: `${s.pasajeroId}-${s.tipo}`, lngLat: s.punto, cls: MK_PARADA, ini: s.tipo === "recogida" ? "R" : "D", ancla: "center", label: `${s.tipo === "recogida" ? "Recogida" : "Destino"} de ${VECINOS[rj.evaluaciones.find((e) => e.p.id === s.pasajeroId)?.p.vecino]?.name ?? "pasajero"}` }));
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modoRuta, rj.A, rj.B, sigPas, sigParadas, radar.activo, radar.centro, radar.origen]);

  const selEnt = entidades.find((p) => p.key === selKey);
  const esPersona = (e) => !!e && !!e.vecino && e.estado !== "emergencia" && (!e.comunidad || (e.tipo === "movilidad" && e.estado === "solicita"));
  const selPas = modoRuta ? rj.evaluaciones.find((e) => e.p.id === selKey) : null;
  const selPersona = !modoRuta ? selEnt : (!selPas && !esPersona(selEnt) ? selEnt : null);
  let selRuta = null;
  if (selPas) {
    const { p, ev } = selPas;
    selRuta = { id: p.id, vecino: p.vecino, nombre: VECINOS[p.vecino].name, msg: p.msg, origenTxt: p.origenTxt, destinoTxt: p.destinoTxt, estado: "solicita", pLike: p, ev };
  } else if (modoRuta && esPersona(selEnt)) {
    const e = selEnt;
    const pLike = { id: e.key, vecino: e.vecino, origen: e.lngLat, destino: e.destinoLngLat ?? rj.B ?? e.lngLat, sinDestino: !e.destinoLngLat, plazas: 1, origenTxt: e.origen, destinoTxt: e.destino ?? "tu destino (B)" };
    selRuta = { id: e.key, vecino: e.vecino, nombre: e.nombre, msg: e.msg, origenTxt: e.origen, destinoTxt: e.destino ?? "sin destino indicado", estado: e.estado, sinDestino: !e.destinoLngLat, pLike, ev: rj.evaluarPara(pLike) };
  }
  const selHeat = !modoRuta ? calorItems.find((i) => i.id === selCalor) : null;
  const vacio = entidades.length === 0 && !modoRuta;

  // Al cambiar el alcance del radar, el mapa se ajusta al círculo
  useEffect(() => {
    if (!radar.activo || !radar.centro || !apiRef.current) return;
    const c = radar.centro; const k = 111320 * Math.cos((c[1] * Math.PI) / 180); const r = radar.km * 1000;
    apiRef.current.ajustar([[c[0] - r / k, c[1] - r / 111320], [c[0] + r / k, c[1] + r / 111320]]);
  }, [radar.activo, radar.km, radar.centro]);

  /** Pide la ubicación al navegador (el permiso lo decide la persona). Sin permiso se elige un punto manual. */
  const pedirUbicacion = () => {
    const fallo = (estado) => setRadar((r) => ({ ...r, estado, eligiendo: true, ...(r.origen === "gps" ? { centro: null, origen: null } : {}) }));
    if (typeof navigator === "undefined" || !navigator.geolocation) { fallo("error"); return; }
    setRadar((r) => ({ ...r, estado: "pidiendo", eligiendo: false }));
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const ll = [pos.coords.longitude, pos.coords.latitude];
        if (!enLima(ll)) fallo("fuera");
        else setRadar((r) => ({ ...r, centro: ll, origen: "gps", estado: "ok", eligiendo: false }));
      },
      (err) => fallo(err?.code === 1 ? "denegado" : "error"),
      { timeout: 10000, maximumAge: 60000 },
    );
  };

  const limpiarSel = () => { setSelKey(null); setSelCalor(null); };
  const alClic = (ll) => {
    limpiarSel();
    if (modoRuta) { rj.elegirPunto(ll); return; }
    if (radar.activo && radar.eligiendo) setRadar((r) => ({ ...r, centro: ll, origen: "manual", estado: "manual", eligiendo: false }));
  };
  const alPick = (key) => { setSelCalor(null); setSelKey(key); };
  const alCalor = (id) => { if (modoRuta) return; setSelKey(null); setSelCalor(id); };
  const toggleRuta = () => { if (modoRuta) rj.pausar(); else setRadar((r) => ({ ...r, activo: false })); setModoRuta((v) => !v); limpiarSel(); };
  const toggleRadar = () => { if (modoRuta) { rj.pausar(); setModoRuta(false); } limpiarSel(); if (radar.activo) setRadar((r) => ({ ...r, activo: false, eligiendo: false })); else { setRadar((r) => ({ ...r, activo: true })); pedirUbicacion(); } };
  const abrirResultado = (p) => { setSelCalor(null); setSelKey(p.key); apiRef.current?.volarA(p.lngLat, 15.5); };
  const hayFicha = !!(selPersona || selHeat || selRuta);

  return (
    <div className={screenStyles.screen}>
      <div className={screenStyles.frame}>
      <div className="flex items-center gap-1 pt-2 pr-2 pb-1 pl-4 min-h-13 flex-none [&_h1]:text-[22px] [&_h1]:flex-1"><h1>Mapa</h1>
        <button className={`${offline ? `${CHIP} border-(--color-ink) bg-(--color-ink) text-white` : OFF}`} onClick={() => setSesion({ senal: offline ? "Normal" : "Sin datos" })} aria-pressed={offline}>Sin conexión</button>
      </div>
      <div className={FILTROS_FILA} role="group" aria-label="Filtros del mapa">
        <button className={fav ? ON.fav : OFF} onClick={() => setUi({ fav: !fav })} aria-pressed={fav}><svg className={`${screenStyles.icon} w-5! h-5!`} viewBox="0 0 24 24" aria-hidden="true"><path d={INSIGNIA.favor} /></svg>Favores</button>
        <button className={cac ? ON.cac : OFF} onClick={() => setUi({ cac: !cac })} aria-pressed={cac}><svg className={`${screenStyles.icon} w-5! h-5!`} viewBox="0 0 24 24" aria-hidden="true"><path d={INSIGNIA.cachuelo} /></svg>Cachuelos</button>
        <button className={eme ? ON.eme : OFF} onClick={() => setUi({ eme: !eme })} aria-pressed={eme}><svg className={`${screenStyles.icon} w-5! h-5!`} viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l10 18H2z" /><path d="M12 10v5M12 18v.5" /></svg>Emergencias</button>
        <button className={heat ? ON.heat : OFF} onClick={() => { setUi({ heat: !heat }); setSelCalor(null); }} aria-pressed={heat}><svg className={`${screenStyles.icon} w-5! h-5!`} viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-9z" /></svg>Calor</button>
        <button className={radar.activo ? ON.radar : OFF} onClick={toggleRadar} aria-pressed={radar.activo}><svg className={`${screenStyles.icon} w-5! h-5!`} viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="4" /><path d="M12 12l6-6" /></svg>Radar</button>
        <button className={modoRuta ? ON.ruta : OFF} onClick={toggleRuta} aria-pressed={modoRuta}><svg className={`${screenStyles.icon} w-5! h-5!`} viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="18" r="2.5" /><circle cx="18" cy="6" r="2.5" /><path d="M8 17c6 0 2-10 8-10" /></svg>RutaJuntos</button>
      </div>

      <div className="relative flex-1 min-h-0 overflow-hidden bg-[#efe8dd]">
        <MapaBase puntos={puntosMapa} extras={extras} calor={calor} linea={modoRuta ? rj.ruta.linea?.geometria ?? null : null} radar={radarGeo} grupoCls={MK_GRUPO} vehiculoCls={MK_VEH}
          seleccionando={(modoRuta && !!rj.objetivo) || (radar.activo && radar.eligiendo)} onMapClick={alClic} onPick={alPick} onCalor={alCalor} apiRef={apiRef} />
        {vacio && (<div className={`${screenStyles.card} absolute! left-4! right-4! top-4! z-2!`} role="status"><p className="font-bold!">No hay puntos con estos filtros</p><p className={screenStyles.muted}>Activa otro filtro o publica algo en tu zona.</p></div>)}
        {offline && (<div className="absolute left-3 right-18 top-3 z-2 bg-[#fff4d6] text-[#5c3d00] rounded-[14px] px-3 py-2 text-[14px] font-bold border border-[#e6c77a]" role="status">Sin conexión · datos de la zona descargada con su hora. No es información en vivo.</div>)}
        <div className="absolute right-3 top-3 z-2 flex flex-col gap-2 [&_button]:w-11 [&_button]:h-11 [&_button]:rounded-[14px] [&_button]:border [&_button]:border-(--color-line) [&_button]:bg-white [&_button]:text-[22px] [&_button]:font-bold [&_button]:shadow-[0_2px_6px_rgba(0,0,0,.15)]"><button aria-label="Acercar" onClick={() => apiRef.current?.zoomIn()}>+</button><button aria-label="Alejar" onClick={() => apiRef.current?.zoomOut()}>−</button></div>

        {/* Un solo elemento a la vez sobre el mapa, siempre por encima de la barra inferior */}
        <div className="absolute left-3 right-3 bottom-20 z-3 flex flex-col gap-2">
          {selRuta && (<FichaRuta key={selRuta.id} s={selRuta} rj={rj} onCerrar={limpiarSel} />)}
          {selPersona && (<FichaPersona key={selPersona.key} p={selPersona} onCerrar={limpiarSel} />)}
          {!selPersona && selHeat && (<FichaCalor i={selHeat} onCerrar={limpiarSel} />)}
          {!hayFicha && !modoRuta && radar.activo && (<RadarTira km={radar.km} setKm={(km) => setRadar((r) => ({ ...r, km }))} resultados={resultados} onAbrir={abrirResultado} centro={radar} onUsar={pedirUbicacion} onElegir={() => setRadar((r) => ({ ...r, eligiendo: true }))} onPreset={(ll) => setRadar((r) => ({ ...r, centro: ll, origen: "manual", estado: "manual", eligiendo: false }))} presets={[["Anexo 22", ANEXO_22], ["Campoy", CAMPOY]]} />)}
          {!hayFicha && !modoRuta && heat && !radar.activo && (<LeyendaCalor conteo={conteo} />)}
          {!hayFicha && !modoRuta && !heat && !radar.activo && (<span className={`${screenStyles.badgeDemo} text-[12px]!`}>Mapa real · personas e incidentes de demostración</span>)}
        </div>
        {modoRuta && !selRuta && !selPersona && (<RutaJuntosPanel rj={rj} abierto={panelAbierto} setAbierto={setPanelAbierto} offline={offline} />)}
      </div>

      <nav className="absolute left-3 right-3 bottom-3 z-10 flex bg-white px-1.5 py-2 border border-[#ede9e6] rounded-[28px] shadow-[0_8px_24px_rgba(32,33,36,.14)] [&_a]:flex-1 [&_a]:min-h-14 [&_a]:flex [&_a]:flex-col [&_a]:items-center [&_a]:justify-center [&_a]:gap-0.5 [&_a]:text-[13px] [&_a]:text-(--color-muted) [&_a]:rounded-[14px] [&_a.on]:text-(--color-brand) [&_a.on]:font-bold" aria-label="Principal">
        <a href="/inicio"><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" /></svg>Inicio</a>
        <a className="on" href="/mapa" aria-current="page"><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>Mapa</a>
        <a href="/perfil"><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>Mi perfil</a>
      </nav>
      </div>
    </div>
  );
}
