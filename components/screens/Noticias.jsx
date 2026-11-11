"use client";

import { useViewStack } from "@/lib/hooks/use-view-stack";

import { Fragment, useState } from "react";
import { useSesion, useSellos, emitirSello, logEvento, chip, VECINOS } from "@/lib/demo/shared";
import { screenStyles } from "./screen-styles";

const FEAT = {i: 0, tagCls: screenStyles.badgeFavor, hasCamp: false, hasEme: false, scope: "Local", title: "Más unidos en comunidad", meta: "Redacción BarrioConecta · 8 nov 2026 · Campoy", imageBackground: "bg-[#f3e3d3]", text: "Vecinos y vecinas se reunieron para sembrar plantas en el parque del Sector 2. La junta vecinal invita a la próxima faena el domingo a las 8:00 a. m."};
const ITEMS = [{i: 1, tagCls: screenStyles.badgeFavor, hasCamp: true, hasEme: false, scope: "Local", title: "Punto de acopio de abrigo en el local comunal", meta: "Redacción BarrioConecta · 7 nov 2026 · Campoy", imageBackground: "bg-[#ddf0f2]", text: "La junta vecinal recibe frazadas y ropa limpia de lunes a viernes. Revisa horario y recursos admitidos en la campaña.", camp: true}, {i: 2, tagCls: screenStyles.badgeFavor, hasCamp: false, hasEme: true, scope: "Local", title: "Calles anegadas: qué hacer y a quién llamar", meta: "Redacción BarrioConecta · 8 nov 2026 · Campoy", imageBackground: "bg-[#ffe9da]", text: "Evita zonas con agua, mantente lejos de cables y sigue las guías oficiales. Este aviso enlaza el incidente INC-0007.", eme: true}, {i: 3, tagCls: screenStyles.badgeSolidarity, hasCamp: true, hasEme: false, scope: "Mayor alcance", title: "Colecta nacional de abrigo antes de las heladas", meta: "Redacción BarrioConecta · 6 nov 2026 · Sierra sur", imageBackground: "bg-[#e6f0e4]", text: "Una colecta para familias de zonas altas. Los centros de acopio y las formas de apoyo se muestran en la campaña.", camp: true}, {i: 4, tagCls: screenStyles.badgeSolidarity, hasCamp: false, hasEme: false, scope: "Mayor alcance", title: "Recordatorio: números de emergencia 105, 116 y 106", meta: "Redacción BarrioConecta · 5 nov 2026 · Todo el país", imageBackground: "bg-[#fbe3e7]", text: "Guarda estos números en tu teléfono. En BarrioConecta están disponibles sin conexión en el Centro de emergencias."}];
const AV_CLS = ["w-14 h-14 rounded-[50%] grid place-items-center font-extrabold font-[Nunito,system-ui,sans-serif] text-[22px] flex-none bg-[#e6f0e4] text-[#2f5a2d]", "w-14 h-14 rounded-[50%] grid place-items-center font-extrabold font-[Nunito,system-ui,sans-serif] text-[22px] flex-none bg-[#ddf0f2] text-[#14505a]"];

/**
 * Pantalla Noticias del prototipo BarrioConecta.
 * Los valores de demostración sustituyen a la lógica del prototipo (DCLogic), que no se migró.
 */
export default function Noticias() {
  const nav = useViewStack("lista");
  const [sesion, setSesion] = useSesion();
  const [sellos] = useSellos();
  const [scope, setScope] = useState("Todo");
  const [selI, setSelI] = useState(0);
  const [sheetV, setSheetV] = useState(false);
  const [note, setNote] = useState("");

  const all = [FEAT, ...ITEMS];
  const visibles = all.filter((n) => scope === "Todo" || n.scope === scope);
  const withOpen = (n) => ({ ...n, open: () => { setSelI(n.i); nav.go("detalle"); } });
  const hasFeat = visibles.length > 0;
  const feat = hasFeat ? withOpen(visibles[0]) : null;
  const items = visibles.slice(1).map(withOpen);
  const cur = all.find((n) => n.i === selI) ?? FEAT;
  const is_detalle = nav.is("detalle");
  const scopes = ["Todo", "Local", "Mayor alcance"].map((name) => ({ name, cls: chip(name === scope), pick: () => setScope(name) }));

  // Vecino del mes: se deriva de los sellos válidos del mes (America/Lima)
  const MES = "2026-11";
  const closed = sesion.fecha.slice(0, 7) > MES;
  const open = !closed;
  const ranking = Object.entries(
    sellos.items.filter((s) => s.valido && s.mes === MES).reduce((acc, s) => ({ ...acc, [s.to]: (acc[s.to] ?? 0) + 1 }), {}),
  ).sort((a, b) => b[1] - a[1]);
  const max = ranking[0]?.[1] ?? 0;
  const people = ranking.slice(0, 3).map(([id, n], i) => ({
    name: VECINOS[id]?.name ?? id,
    ini: VECINOS[id]?.ini ?? "?",
    avCls: AV_CLS[i % 2],
    sellos: n,
    w: `${max ? Math.round((n / max) * 100) : 0}%`,
  }));
  const ganadores = ranking.filter(([, n]) => n === max && max > 0).map(([id]) => VECINOS[id]?.name ?? id);
  const leaderLine = people[0] ? `${people[0].name} · ${people[0].sellos} sellos` : "Aún sin sellos";
  const monthLbl = closed ? "noviembre 2026 · mes cerrado" : "noviembre 2026 · en curso";
  const monthShort = "noviembre";
  const resultTxt = ganadores.length === 0 ? "Sin sellos este mes: todavía no hay ganador" : ganadores.length > 1 ? `Reconocimiento compartido: ${ganadores.join(" y ")} con ${max} sellos` : `${ganadores[0]} con ${max} sellos`;
  const hasNote = !!note;
  const openVecino = () => { setNote(""); setSheetV(true); };
  const closeVecino = () => setSheetV(false);
  const addSello = () => {
    const r = emitirSello({ coordId: `demo-luis-${Date.now()}`, from: "carmen", to: "luis", tipo: "favor" }, true);
    setNote(r === "emitido" ? "" : "No se pudo emitir el sello.");
  };
  const dupSello = () => {
    emitirSello({ coordId: "demo-dup", from: "carmen", to: "luis", tipo: "favor" }, true);
    const r = emitirSello({ coordId: "demo-dup", from: "carmen", to: "luis", tipo: "favor" }, true);
    setNote(r === "duplicado" ? "Bloqueado: ya existe un sello de esa persona para esa coordinación." : "");
  };
  const canSello = () => {
    const r = emitirSello({ coordId: `demo-cancel-${Date.now()}`, from: "carmen", to: "luis", tipo: "favor" }, false);
    setNote(r === "no_completada" ? "Bloqueado: una coordinación cancelada no genera sellos." : "");
  };
  const closeMonth = () => { setSesion({ fecha: "2026-12-01" }); setNote(""); logEvento("Cierre de noviembre (fecha 1 dic)"); };
  const reopen = () => { setSesion({ fecha: "2026-11-08" }); setNote(""); };
  return (
    <div className={screenStyles.screen}>
      <div className={screenStyles.frame}>
      
      {nav.is("lista") && (<>
      <div className={screenStyles.header}><button className={screenStyles.iconButton} aria-label="Volver" onClick={nav.back}><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Noticias</h1></div>
      <div className={screenStyles.content}>
        <div className={screenStyles.wrap} role="group" aria-label="\u00c1mbito">{(scopes ?? []).map((s, __i1) => (<Fragment key={__i1}><button className={s.cls} onClick={s.pick}>{s.name}</button></Fragment>))}</div>
        {hasFeat && (<>
          <button className="bg-white border border-(--color-line) rounded-[20px] p-0 shadow-[0_2px_8px_rgba(32,33,36,.05)] flex flex-col gap-2 text-left w-full overflow-hidden! gap-0!" onClick={feat.open}>
            <svg viewBox="0 0 358 190" width="100%" aria-hidden="true"><rect width="358" height="190" fill="#F3E3D3" /><rect y="140" width="358" height="50" fill="#D9CDBE" /><circle cx="90" cy="92" r="24" fill="#8A5300" /><rect x="62" y="116" width="56" height="60" rx="22" fill="#C8102E" /><circle cx="160" cy="84" r="24" fill="#5E4A3A" /><rect x="132" y="108" width="56" height="68" rx="22" fill="#2F5A2D" /><circle cx="228" cy="94" r="24" fill="#A87850" /><rect x="200" y="118" width="56" height="58" rx="22" fill="#1F6F7A" /><circle cx="292" cy="100" r="22" fill="#7A5A3A" /><rect x="266" y="122" width="52" height="54" rx="20" fill="#E6B34A" /><path d="M110 150c8-30 20-30 28-10M240 150c8-26 18-26 24-8" stroke="#6E9B55" strokeWidth="6" fill="none" /></svg>
            <div className="pt-3.5 px-4 pb-4 flex! flex-col! gap-1.5!"><div className={screenStyles.row}><span className={feat.tagCls}>{feat.scope}</span><span className={screenStyles.muted}>{feat.meta}</span></div><h2 className="text-[22px]!">{feat.title}</h2></div>
          </button>
        </>)}
        {(items ?? []).map((n, __i1) => (<Fragment key={__i1}>
          <button className="bg-white border border-(--color-line) rounded-[20px] p-3 shadow-[0_2px_8px_rgba(32,33,36,.05)] flex flex-col gap-2 text-left w-full flex-row! items-stretch!" onClick={n.open}><span className={`w-21 rounded-[14px]! flex-none! min-h-21! ${n.imageBackground}`}></span><div className={`${screenStyles.grow} flex! flex-col! gap-1!`}><span className={n.tagCls}>{n.scope}</span><b className="leading-[1.25] text-[16px]!">{n.title}</b><span className={`${screenStyles.muted} text-[14px]!`}>{n.meta}</span></div></button>
        </Fragment>))}
        <button className={`${screenStyles.card} flex-row! items-center!`} onClick={openVecino}><span className="w-14 h-14 rounded-[50%] grid place-items-center font-extrabold font-[Nunito,system-ui,sans-serif] text-[22px] flex-none bg-[#e6f0e4] text-[#2f5a2d]" aria-hidden="true">{people[0]?.ini ?? "?"}</span><div className={screenStyles.grow}><b>Vecino del mes</b><p className={screenStyles.muted}>{closed ? "Noviembre cerrado" : "Avance de noviembre"} · {leaderLine}</p></div><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg></button>
      </div>
      </>)}
      
      {is_detalle && (<>
      <div className={screenStyles.header}><button className={screenStyles.iconButton} aria-label="Volver" onClick={nav.back}><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Noticia</h1></div>
      <div className={screenStyles.content}>
        <span className={`rounded-[20px] overflow-hidden relative block w-full h-45! ${cur.imageBackground}`}></span>
        <div className={screenStyles.row}><span className={cur.tagCls}>{cur.scope}</span><span className={screenStyles.badgeDemo}>Fuente demo</span></div>
        <h2 className="text-[25px]!">{cur.title}</h2>
        <p className={screenStyles.muted}>{cur.meta}</p>
        <p>{cur.text}</p>
        {cur.hasCamp && (<><a className={screenStyles.button} href="/campanas">Ver campaña</a></>)}
        {cur.hasEme && (<><a className={screenStyles.button} href="/emergencias?vista=detalle&inc=INC-0007">Ver emergencia INC-0007</a></>)}
        <p className={screenStyles.muted}>Publicado por la redacción de BarrioConecta con información de la comunidad.</p>
      </div>
      </>)}
      
      <nav className={screenStyles.navigation} aria-label="Principal">
        <a href="/inicio"><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" /></svg>Inicio</a>
        <a href="/mapa"><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>Mapa</a>
        <a href="/perfil"><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>Mi perfil</a>
      </nav>
      
      {sheetV && (<>
      <div className={screenStyles.scrim} aria-hidden="true"></div>
      <div className="absolute left-0 right-0 bottom-0 max-h-[88%] overflow-y-auto bg-white rounded-[24px_24px_0_0] border-t border-t-(--color-line) shadow-[0_-8px_24px_rgba(32,33,36,.15)] px-4 py-5 flex flex-col gap-3 z-40" role="dialog" aria-label="Vecino del mes">
        <div className={screenStyles.row}><h2 className={`${screenStyles.grow} text-[23px]!`}>Vecino del mes</h2><button className={screenStyles.iconButton} aria-label="Cerrar" onClick={closeVecino}><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg></button></div>
        <p className={screenStyles.muted}>Campoy · {monthLbl}</p>
        {open && (<><span className={screenStyles.badgeDemo}>Avance del mes · no es ganador definitivo</span></>)}
        {closed && (<><div className={`${screenStyles.card} border-(--color-brand)!`} role="status"><span className={screenStyles.badgeAlert}>Reconocimiento de {monthShort}</span><p className="font-bold text-[19px]!">{resultTxt}</p></div></>)}
        {(people ?? []).map((p, __i1) => (<Fragment key={__i1}>
          <div className={screenStyles.card}><div className={screenStyles.row}><span className={p.avCls} aria-hidden="true">{p.ini}</span><div className={screenStyles.grow}><b>{p.name}</b><p className={screenStyles.muted}>{p.sellos} sellos válidos</p></div></div><div className="h-2.5 rounded-[5px] bg-(--color-line) overflow-hidden [&_i]:block [&_i]:h-full [&_i]:bg-(--color-brand)" aria-hidden="true"><i style={{ width: p.w }}></i></div></div>
        </Fragment>))}
        <p className={screenStyles.muted}>Los sellos vienen de coordinaciones completadas por ambas partes. No suman clics, dinero aportado ni exposición al peligro. El reconocimiento no verifica oficialmente a nadie.</p>
        <p className={screenStyles.label}>Herramientas del reconocimiento</p>
        {open && (<>
          <button className={screenStyles.buttonOutline} onClick={addSello}>Completar una ayuda de Luis (+1 sello)</button>
          <button className={screenStyles.buttonSecondary} onClick={dupSello}>Intentar sello duplicado</button>
          <button className={screenStyles.buttonSecondary} onClick={canSello}>Intentar sumar coordinación cancelada</button>
          <button className={screenStyles.button} onClick={closeMonth}>Cerrar noviembre (30 nov)</button>
        </>)}
        {closed && (<><button className={screenStyles.buttonSecondary} onClick={reopen}>Volver a noviembre en curso</button></>)}
        {hasNote && (<><p className={screenStyles.error} role="alert">{note}</p></>)}
      </div>
      </>)}
      </div>
    </div>
  );
}
