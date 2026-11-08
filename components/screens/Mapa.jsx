"use client";

import { Fragment, useState } from "react";
import { useDemoState } from "@/lib/demo/store";
import { useSesion, VECINOS } from "@/lib/demo/shared";
import { useIncidentes, autoresDistintos, estadoCorroboracion } from "@/lib/demo/incidentes";
import { usePublicaciones } from "@/lib/demo/publicaciones";

const MAPA_UI = { fav: true, cac: true, eme: true, heat: false, zoom: 1 };
const F_FAV = "min-h-11 rounded-full border-[1.5px] border-[#2f5a2d] bg-[#2f5a2d] px-3.5 py-0 font-bold text-[15px] whitespace-nowrap flex items-center gap-1.5 text-white on";
const F_CAC = "min-h-11 rounded-full border-[1.5px] border-[#8a5300] bg-[#8a5300] px-3.5 py-0 font-bold text-[15px] whitespace-nowrap flex items-center gap-1.5 text-white on";
const F_EME = "min-h-11 rounded-full border-[1.5px] border-[#9a3412] bg-[#9a3412] px-3.5 py-0 font-bold text-[15px] whitespace-nowrap flex items-center gap-1.5 text-white on";
const CHIP_MAP_OFF = "min-h-11 rounded-full border-[1.5px] border-[#cfc7bf] bg-white px-3.5 py-0 font-bold text-[15px] whitespace-nowrap flex items-center gap-1.5";
const CHIP_INK = "min-h-11 rounded-full border-[1.5px] border-(--color-ink) bg-(--color-ink) px-3.5 py-0 font-bold text-[15px] whitespace-nowrap flex items-center gap-1.5 text-white";
const MK = { group: "w-11 h-11 rounded-[50%] grid place-items-center font-extrabold text-[17px] font-[Nunito,system-ui,sans-serif] bg-(--color-ink) border-3 border-white text-white shadow-[0_2px_6px_rgba(0,0,0,.25)] relative [&_.b]:absolute [&_.b]:right-[-6px] [&_.b]:top-[-6px] [&_.b]:w-5 [&_.b]:h-5 [&_.b]:rounded-[50%] [&_.b]:bg-white [&_.b]:border-[1.5px] [&_.b]:border-current [&_.b]:grid [&_.b]:place-items-center [&_.b_svg]:w-3 [&_.b_svg]:h-3 [&_.b_svg]:fill-none [&_.b_svg]:stroke-current [&_.b_svg]:stroke-[2.4] [&_.b_svg]:[stroke-linecap:round] [&_.b_svg]:[stroke-linejoin:round]", fav: "w-11 h-11 rounded-[50%] grid place-items-center font-extrabold text-[17px] font-[Nunito,system-ui,sans-serif] bg-[#2f5a2d] border-3 border-white text-white shadow-[0_2px_6px_rgba(0,0,0,.25)] relative [&_.b]:absolute [&_.b]:right-[-6px] [&_.b]:top-[-6px] [&_.b]:w-5 [&_.b]:h-5 [&_.b]:rounded-[50%] [&_.b]:bg-white [&_.b]:border-[1.5px] [&_.b]:border-current [&_.b]:grid [&_.b]:place-items-center [&_.b_svg]:w-3 [&_.b_svg]:h-3 [&_.b_svg]:fill-none [&_.b_svg]:stroke-current [&_.b_svg]:stroke-[2.4] [&_.b_svg]:[stroke-linecap:round] [&_.b_svg]:[stroke-linejoin:round]", cac: "w-11 h-11 rounded-[50%] grid place-items-center font-extrabold text-[17px] font-[Nunito,system-ui,sans-serif] bg-[#8a5300] border-3 border-white text-white shadow-[0_2px_6px_rgba(0,0,0,.25)] relative [&_.b]:absolute [&_.b]:right-[-6px] [&_.b]:top-[-6px] [&_.b]:w-5 [&_.b]:h-5 [&_.b]:rounded-[50%] [&_.b]:bg-white [&_.b]:border-[1.5px] [&_.b]:border-current [&_.b]:grid [&_.b]:place-items-center [&_.b_svg]:w-3 [&_.b_svg]:h-3 [&_.b_svg]:fill-none [&_.b_svg]:stroke-current [&_.b_svg]:stroke-[2.4] [&_.b_svg]:[stroke-linecap:round] [&_.b_svg]:[stroke-linejoin:round]", eme: "w-11 h-11 rounded-[50%] grid place-items-center font-extrabold text-[17px] font-[Nunito,system-ui,sans-serif] bg-[#9a3412] border-3 border-white text-white shadow-[0_2px_6px_rgba(0,0,0,.25)] relative [&_.b]:absolute [&_.b]:right-[-6px] [&_.b]:top-[-6px] [&_.b]:w-5 [&_.b]:h-5 [&_.b]:rounded-[50%] [&_.b]:bg-white [&_.b]:border-[1.5px] [&_.b]:border-current [&_.b]:grid [&_.b]:place-items-center [&_.b_svg]:w-3 [&_.b_svg]:h-3 [&_.b_svg]:fill-none [&_.b_svg]:stroke-current [&_.b_svg]:stroke-[2.4] [&_.b_svg]:[stroke-linecap:round] [&_.b_svg]:[stroke-linejoin:round]" };
/** Publicaciones semilla, con ubicación pública aproximada. */
const BASE = [
  { key: "f1", kind: "fav", x: 30, y: 36, ini: "M", who: "María · Campoy Sector 2", bub: "Necesito escalera", title: "Necesito una escalera de 3 metros prestada", note: "Herramientas · Disponible hoy por la tarde · zona aproximada", href: "/favores" },
  { key: "f2", kind: "fav", x: 36, y: 42, ini: "R", who: "Rosa · Campoy Sector 4", bub: "Ayudo con trámites", title: "Ayudo con trámites digitales a adultos mayores", note: "Habilidades · Sábados por la mañana", href: "/favores" },
  { key: "c1", kind: "cac", x: 68, y: 33, ini: "P", who: "Pedro · Campoy Sector 3", bub: "Arreglo fugas", title: "Gasfitería · Pedro arregla fugas", note: "A convenir · Lo recomiendan 4 vecinos", href: "/cachuelos" },
  { key: "c2", kind: "cac", x: 74, y: 39, ini: "A", who: "Ana · Campoy Sector 1", bub: "Clases de matemática", title: "Clases de matemática de secundaria", note: "S/ 25 por hora · Vecina nueva", href: "/cachuelos" },
];
import { screenStyles } from "./screen-styles";

/**
 * Pantalla Mapa del prototipo BarrioConecta.
 * Los valores de demostración sustituyen a la lógica del prototipo (DCLogic), que no se migró.
 */
export default function Mapa() {
  const [sesion, setSesion] = useSesion();
  const [incsAll] = useIncidentes();
  // Solo incidentes con al menos un reporte enviado (los pendientes no se publican)
  const incs = { items: incsAll.items.filter((i) => i.reportes.some((r) => r.estado === "enviado")) };
  const [pubs] = usePublicaciones();
  const [ui, setUi] = useDemoState("mapa-ui", MAPA_UI);
  const [selKey, setSelKey] = useState(null);
  const { fav, cac, eme, heat, zoom } = ui;
  const offline = sesion.senal === "Sin datos";
  const fFav = fav ? F_FAV : CHIP_MAP_OFF;
  const fCac = cac ? F_CAC : CHIP_MAP_OFF;
  const fEme = eme ? F_EME : CHIP_MAP_OFF;
  const tFav = () => setUi({ fav: !fav });
  const tCac = () => setUi({ cac: !cac });
  const tEme = () => setUi({ eme: !eme });
  const heatChip = heat ? F_EME : CHIP_MAP_OFF;
  const offChip = offline ? CHIP_INK : CHIP_MAP_OFF;
  const toggleHeat = () => setUi({ heat: !heat });
  const toggleOff = () => setSesion({ senal: offline ? "Normal" : "Sin datos" });
  const zoomIn = () => setUi({ zoom: 2 });
  const zoomOut = () => setUi({ zoom: 1 });
  const z1 = zoom === 1 ? "on" : "";
  const z2 = zoom === 2 ? "on" : "";
  const title = "Mapa";

  // Mismo registro que los muros: semillas + publicaciones del usuario + incidentes
  const hash = (s) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 997, 7);
  const puntos = [
    ...BASE.filter((p) => (p.kind === "fav" && fav) || (p.kind === "cac" && cac)),
    ...pubs.items
      .filter((p) => p.estado === "publicado" && ((p.tipo === "favor" && fav) || (p.tipo === "cachuelo" && cac)))
      .map((p) => ({ key: p.id, kind: p.tipo === "favor" ? "fav" : "cac", x: 15 + (hash(p.id) % 70), y: 15 + (hash(p.id + "y") % 55), ini: (VECINOS[p.autor]?.ini ?? "T"), who: `${VECINOS[p.autor]?.name ?? "Tú"} · zona aproximada`, bub: p.titulo, title: p.titulo, note: `${p.categoria} · ${p.disponibilidad} · creado por ti`, href: p.tipo === "favor" ? "/favores" : "/cachuelos" })),
    ...(eme ? incs.items.map((i) => ({ key: i.id, kind: "eme", x: i.x, y: i.y, ini: "!", who: `${i.id} · ${estadoCorroboracion(i)}`, bub: i.titulo, title: i.titulo, note: `${autoresDistintos(i)} vecinos distintos · actualizado ${i.actualizado}${offline ? " · copia guardada, no es dato en vivo" : ""}`, href: "/emergencias" })) : []),
  ];
  // Agrupación por cercanía cuando el mapa está alejado
  const grupos = [];
  puntos.forEach((p) => {
    const g = zoom === 1 && grupos.find((g) => Math.hypot(g.x - p.x, g.y - p.y) < 14);
    if (g) g.items.push(p);
    else grupos.push({ x: p.x, y: p.y, items: [p] });
  });
  const markers = grupos.map((g) => {
    const one = g.items.length === 1 ? g.items[0] : null;
    return {
      key: one ? one.key : `g-${g.x}-${g.y}`,
      style: { left: `${g.x}%`, top: `${g.y}%` },
      cls: one ? MK[one.kind] : MK.group,
      ini: one ? one.ini : String(g.items.length),
      label: one ? one.title : `Grupo de ${g.items.length} publicaciones. Acerca el mapa para verlas`,
      showBub: !!one && zoom === 2,
      bub: one?.bub ?? "",
      isFav: one?.kind === "fav",
      pick: () => (one ? setSelKey(one.key) : setUi({ zoom: 2 })),
    };
  });
  const heats = heat ? incs.items.map((i) => ({ style: { left: `${i.x}%`, top: `${i.y}%`, width: `${60 + autoresDistintos(i) * 35}px`, height: `${60 + autoresDistintos(i) * 35}px`, opacity: i.actualizado === "ahora" || i.actualizado.includes("25") ? 1 : 0.55 } })) : [];
  const heatSrc = offline ? "Fuente: instantánea guardada de la zona, no peligro actual." : "Fuente: reportes vecinos de demostración.";
  const found = puntos.find((p) => p.key === selKey);
  const hasSel = !!found;
  const sel = found ? { tag: found.kind === "fav" ? "Favor · Gratis" : found.kind === "cac" ? "Cachuelo" : "Emergencia", tagCls: found.kind === "fav" ? screenStyles.badgeFavor : found.kind === "cac" ? screenStyles.badgeCachuelo : screenStyles.badgeEmergency, who: found.who, title: found.title, note: found.note, href: found.href } : null;
  const clearSel = () => setSelKey(null);
  const vacio = puntos.length === 0;
  return (
    <div className={screenStyles.screen}>
      <div className={screenStyles.frame}>
      <div className="flex items-center gap-1 pt-2 pr-2 pb-1 pl-4 min-h-15 flex-none [&_h1]:text-[22px] [&_h1]:flex-1"><h1>{title}</h1>
        <button className={`${heatChip} min-h-11!`} onClick={toggleHeat} aria-pressed={heat}><svg className={`${screenStyles.icon} w-5! h-5!`} viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-9z" /></svg>Calor</button>
        <button className={`${offChip} min-h-11!`} onClick={toggleOff} aria-pressed={offline}>Sin conexión</button>
      </div>
      <div className="flex gap-2 pt-0 px-4 pb-2 overflow-x-auto flex-none" role="group" aria-label="Filtros del mapa">
        <button className={fFav} onClick={tFav} aria-pressed={fav}><svg className={`${screenStyles.icon} w-5! h-5!`} viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z" /></svg>Favores</button>
        <button className={fCac} onClick={tCac} aria-pressed={cac}><svg className={`${screenStyles.icon} w-5! h-5!`} viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 5.5a4 4 0 0 0-5 5L3 17l4 4 6.5-6.5a4 4 0 0 0 5-5L16 12l-3-1-1-3z" /></svg>Cachuelos</button>
        <button className={fEme} onClick={tEme} aria-pressed={eme}><svg className={`${screenStyles.icon} w-5! h-5!`} viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l10 18H2z" /><path d="M12 10v5M12 18v.5" /></svg>Emergencias</button>
      </div>
      
      <div className="relative flex-1 min-h-0 overflow-hidden bg-[#efe8dd]">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" width="100%" height="100%" aria-hidden="true" className="inset-0 absolute!">
          <rect width="100" height="100" fill="#EFE8DD" />
          <path d="M0 78 Q30 70 55 80 T100 74 V100 H0z" fill="#D5E6EA" />
          <rect x="8" y="8" width="24" height="16" rx="3" fill="#D9E8CF" />
          <g fill="none" stroke="#FFFFFF" strokeWidth="5" vectorEffect="non-scaling-stroke" strokeLinecap="round"><path d="M0 28 H100" /><path d="M0 52 H100" /><path d="M25 0 V100" /><path d="M70 0 V100" /><path d="M0 14 L45 52 L100 40" /></g>
          <g fill="none" stroke="#DCD2C3" strokeWidth="1" vectorEffect="non-scaling-stroke"><path d="M0 28 H100" /><path d="M0 52 H100" /><path d="M25 0 V100" /><path d="M70 0 V100" /></g>
        </svg>
        <span className={`${screenStyles.badgeDemo} absolute bottom-3 left-3 z-1`}>Mapa de demostración · no oficial</span>
        {vacio && (<div className={`${screenStyles.card} absolute! left-4! right-4! top-4! z-2!`} role="status"><p className="font-bold!">No hay puntos con estos filtros</p><p className={screenStyles.muted}>Activa otro filtro o publica algo en tu zona.</p></div>)}
        {offline && (<><div className="absolute left-3 right-18 top-3 bg-[#fff4d6] text-[#5c3d00] rounded-[14px] px-3 py-2 text-[14px] font-bold border border-[#e6c77a]" role="status">Sin conexión · datos de la zona descargada con su hora. No es información en vivo.</div></>)}
        {(heats ?? []).map((h, __i1) => (<Fragment key={__i1}><div className="absolute [transform:translate(-50%,-50%)] rounded-[50%] bg-[radial-gradient(circle,rgba(217,72,15,.55)_0,rgba(217,72,15,.28)_45%,rgba(217,72,15,0)_70%)] pointer-events-none" style={h.style}></div></Fragment>))}
        {(markers ?? []).map((m) => (<Fragment key={m.key}>
          <button className="absolute [transform:translate(-50%,-100%)] flex flex-col items-center bg-none bg-transparent border-0 p-0 min-w-12 min-h-12 justify-end" onClick={m.pick} aria-label={`${m.label ?? ""}`} style={m.style}>
            {m.showBub && (<><span className="bg-white border border-(--color-line) rounded-[12px] px-2 py-[3px] text-[12px] font-bold whitespace-nowrap mb-[3px] shadow-[0_1px_4px_rgba(0,0,0,.15)] max-w-37.5 overflow-hidden text-ellipsis">{m.bub}</span></>)}
            <span className={m.cls}>{m.ini}{m.isFav && (<><span className="b" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z" /></svg></span></>)}{m.isCac && (<><span className="b" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M14.5 5.5a4 4 0 0 0-5 5L3 17l4 4 6.5-6.5a4 4 0 0 0 5-5L16 12l-3-1-1-3z" /></svg></span></>)}{m.isEme && (<><span className="b" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 4v9M12 18v.5" /></svg></span></>)}</span>
          </button>
        </Fragment>))}
        <div className="absolute right-3 top-3 flex flex-col gap-2 [&_button]:w-12 [&_button]:h-12 [&_button]:rounded-[14px] [&_button]:border [&_button]:border-(--color-line) [&_button]:bg-white [&_button]:text-[24px] [&_button]:font-bold [&_button]:shadow-[0_2px_6px_rgba(0,0,0,.15)] [&_button.on]:bg-(--color-ink) [&_button.on]:text-white"><button className={z2} aria-label="Acercar" onClick={zoomIn}>+</button><button className={z1} aria-label="Alejar" onClick={zoomOut}>−</button></div>
        {heat && (<><div className="absolute left-3 bottom-3 right-3 bg-[rgba(255,255,255,.95)] border border-(--color-line) rounded-[14px] px-3 py-2 text-[13px]" role="note"><b>Calor de reportes recientes.</b> Muestra concentración y antigüedad de reportes, no peligro confirmado ni dónde no hay riesgo. {heatSrc}</div></>)}
        {hasSel && (<>
          <div className="bg-white border border-(--color-line) rounded-[20px] p-3.5 shadow-[0_2px_8px_rgba(32,33,36,.08)] flex flex-col gap-1.5 absolute left-3 right-3 bottom-3 z-3" role="dialog" aria-label="Detalle del punto">
            <div className="flex items-center gap-2.5"><span className={sel.tagCls}>{sel.tag}</span><span className="flex-1 min-w-0 text-(--color-muted) text-[15px]">{sel.who}</span><button className="w-11! h-11! border-0! bg-none! bg-transparent!" aria-label="Cerrar tarjeta" onClick={clearSel}><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg></button></div>
            <h3 className="text-[19px]!">{sel.title}</h3><p className={screenStyles.muted}>{sel.note}</p>
            <a className={`${screenStyles.button} min-h-12!`} href={sel.href}>Abrir publicación</a>
          </div>
        </>)}
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
