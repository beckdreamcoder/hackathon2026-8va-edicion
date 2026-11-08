"use client";

import { useViewStack } from "@/lib/hooks/use-view-stack";

import { Fragment } from "react";
import "./Noticias.css";

/**
 * Pantalla Noticias del prototipo BarrioConecta.
 * Los valores de demostración sustituyen a la lógica del prototipo (DCLogic), que no se migró.
 */
export default function Noticias() {
  const nav = useViewStack("lista");
  const addSello = () => {};
  const canSello = () => {};
  const closeMonth = () => {};
  const closeVecino = () => {};
  const closed = false;
  const cur = {i: 0, tagCls: "tag fav", hasCamp: false, hasEme: false, scope: "Local", title: "Más unidos en comunidad", meta: "Editor demo · 8 nov 2026 · Campoy", color: "#F3E3D3", text: "Vecinos y vecinas se reunieron para sembrar plantas en el parque del Sector 2. La junta de demostración invita a la próxima faena el domingo a las 8:00 a. m."};
  const dupSello = () => {};
  const feat = {i: 0, tagCls: "tag fav", hasCamp: false, hasEme: false, scope: "Local", title: "Más unidos en comunidad", meta: "Editor demo · 8 nov 2026 · Campoy", color: "#F3E3D3", text: "Vecinos y vecinas se reunieron para sembrar plantas en el parque del Sector 2. La junta de demostración invita a la próxima faena el domingo a las 8:00 a. m.", open: () => {}};
  const hasFeat = true;
  const hasNote = false;
  const is_detalle = false;
  const items = [{i: 1, tagCls: "tag fav", hasCamp: true, hasEme: false, scope: "Local", title: "Punto de acopio de abrigo en el local comunal", meta: "Editor demo · 7 nov 2026 · Campoy", color: "#DDF0F2", text: "La junta de demostración recibe frazadas y ropa limpia de lunes a viernes. Revisa horario y recursos admitidos en la campaña.", camp: true, open: () => {}}, {i: 2, tagCls: "tag fav", hasCamp: false, hasEme: true, scope: "Local", title: "Calles anegadas: qué hacer y a quién llamar", meta: "Editor demo · 8 nov 2026 · Campoy", color: "#FFE9DA", text: "Evita zonas con agua, mantente lejos de cables y sigue las guías oficiales. Este aviso enlaza el incidente de ejemplo INC-0007.", eme: true, open: () => {}}, {i: 3, tagCls: "tag sol", hasCamp: true, hasEme: false, scope: "Mayor alcance", title: "Colecta nacional de abrigo antes de las heladas", meta: "Editor demo · 6 nov 2026 · Sierra sur", color: "#E6F0E4", text: "Una colecta de ejemplo para familias de zonas altas. Los centros de acopio y las formas de apoyo se muestran en la campaña.", camp: true, open: () => {}}, {i: 4, tagCls: "tag sol", hasCamp: false, hasEme: false, scope: "Mayor alcance", title: "Recordatorio: números de emergencia 105, 116 y 106", meta: "Editor demo · 5 nov 2026 · Todo el país", color: "#FBE3E7", text: "Guarda estos números en tu teléfono. En BarrioConecta están disponibles sin conexión en el Centro de emergencias.", open: () => {}}];
  const leaderLine = "Rosa · 12 sellos";
  const monthLbl = "noviembre 2026 · en curso";
  const monthShort = "noviembre";
  const note = "";
  const open = true;
  const openVecino = () => {};
  const people = [{name: "Rosa", ini: "R", avCls: "av", sellos: 12, w: "width:100%"}, {name: "Luis", ini: "L", avCls: "av l", sellos: 11, w: "width:92%"}, {name: "Carlos", ini: "C", avCls: "av", sellos: 6, w: "width:50%"}];
  const reopen = () => {};
  const resultTxt = "Rosa con 12 sellos";
  const scopes = [{name: "Todo", cls: "chip on", pick: () => {}}, {name: "Local", cls: "chip", pick: () => {}}, {name: "Mayor alcance", cls: "chip", pick: () => {}}];
  const sheetV = false;
  return (
    <div className="scr-noticias">
      <div className="app">
      
      {nav.is("lista") && (<>
      <div className="top"><button className="ib" aria-label="Volver" onClick={nav.back}><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Noticias</h1></div>
      <div className="body">
        <div className="wrap" role="group" aria-label="\u00c1mbito">{(scopes ?? []).map((s, __i1) => (<Fragment key={__i1}><button className={`${s.cls ?? ""}`} onClick={s.pick}>{s.name}</button></Fragment>))}</div>
        <span className="tag sim">Noticias de ejemplo · editor de demostración</span>
        {hasFeat && (<>
          <button className="card" style={{padding: "0", overflow: "hidden", gap: "0"}} onClick={feat.open}>
            <svg viewBox="0 0 358 190" width="100%" aria-hidden="true"><rect width="358" height="190" fill="#F3E3D3" /><rect y="140" width="358" height="50" fill="#D9CDBE" /><circle cx="90" cy="92" r="24" fill="#8A5300" /><rect x="62" y="116" width="56" height="60" rx="22" fill="#C8102E" /><circle cx="160" cy="84" r="24" fill="#5E4A3A" /><rect x="132" y="108" width="56" height="68" rx="22" fill="#2F5A2D" /><circle cx="228" cy="94" r="24" fill="#A87850" /><rect x="200" y="118" width="56" height="58" rx="22" fill="#1F6F7A" /><circle cx="292" cy="100" r="22" fill="#7A5A3A" /><rect x="266" y="122" width="52" height="54" rx="20" fill="#E6B34A" /><path d="M110 150c8-30 20-30 28-10M240 150c8-26 18-26 24-8" stroke="#6E9B55" strokeWidth="6" fill="none" /></svg>
            <div style={{padding: "14px 16px 16px", display: "flex", flexDirection: "column", gap: "6px"}}><div className="row"><span className={`${feat.tagCls ?? ""}`}>{feat.scope}</span><span className="mut">{feat.meta}</span></div><h2 style={{fontSize: "22px"}}>{feat.title}</h2></div>
          </button>
        </>)}
        {(items ?? []).map((n, __i1) => (<Fragment key={__i1}>
          <button className="card" style={{flexDirection: "row", alignItems: "stretch", padding: "12px"}} onClick={n.open}><span style={{width: "84px", borderRadius: "14px", background: `${n.color ?? ""}`, flex: "none", minHeight: "84px"}}></span><div className="sp" style={{display: "flex", flexDirection: "column", gap: "4px"}}><span className={`${n.tagCls ?? ""}`}>{n.scope}</span><b style={{fontSize: "16px", lineHeight: "1.25"}}>{n.title}</b><span className="mut" style={{fontSize: "14px"}}>{n.meta}</span></div></button>
        </Fragment>))}
        <button className="card" style={{flexDirection: "row", alignItems: "center"}} onClick={openVecino}><span className="av" aria-hidden="true">R</span><div className="sp"><b>Vecino del mes</b><p className="mut">Avance de noviembre · {leaderLine}</p></div><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg></button>
      </div>
      </>)}
      
      {is_detalle && (<>
      <div className="top"><button className="ib" aria-label="Volver" onClick={nav.back}><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Noticia</h1></div>
      <div className="body">
        <span className="img" style={{height: "180px", background: `${cur.color ?? ""}`}}></span>
        <div className="row"><span className={`${cur.tagCls ?? ""}`}>{cur.scope}</span><span className="tag sim">Fuente demo</span></div>
        <h2 style={{fontSize: "25px"}}>{cur.title}</h2>
        <p className="mut">{cur.meta}</p>
        <p>{cur.text}</p>
        {cur.hasCamp && (<><a className="btn" href="/campanas">Ver campaña</a></>)}
        {cur.hasEme && (<><a className="btn" href="/emergencias">Ver emergencia INC-0007</a></>)}
        <p className="mut">Contenido de ejemplo gestionado por un editor de demostración. No pertenece a ningún medio real.</p>
      </div>
      </>)}
      
      <nav className="nav" aria-label="Principal">
        <a href="/inicio"><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" /></svg>Inicio</a>
        <a href="/mapa"><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>Mapa</a>
        <a href="/perfil"><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>Mi perfil</a>
      </nav>
      
      {sheetV && (<>
      <div className="scrim" aria-hidden="true"></div>
      <div className="sheet" role="dialog" aria-label="Vecino del mes">
        <div className="row"><h2 style={{fontSize: "23px"}} className="sp">Vecino del mes</h2><button className="ib" aria-label="Cerrar" onClick={closeVecino}><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg></button></div>
        <p className="mut">Campoy · {monthLbl}</p>
        {open && (<><span className="tag sim">Avance del mes · no es ganador definitivo</span></>)}
        {closed && (<><div className="card" style={{borderColor: "#C8102E"}} role="status"><span className="tag red">Reconocimiento de {monthShort}</span><p style={{fontWeight: "700", fontSize: "19px"}}>{resultTxt}</p></div></>)}
        {(people ?? []).map((p, __i1) => (<Fragment key={__i1}>
          <div className="card"><div className="row"><span className={`${p.avCls ?? ""}`} aria-hidden="true">{p.ini}</span><div className="sp"><b>{p.name}</b><p className="mut">{p.sellos} sellos válidos</p></div></div><div className="bar" aria-hidden="true"><i style={{}}></i></div></div>
        </Fragment>))}
        <p className="mut">Los sellos vienen de coordinaciones completadas por ambas partes. No suman clics, dinero aportado ni exposición al peligro. El reconocimiento no verifica oficialmente a nadie.</p>
        <p className="lbl">Demostración (simulador de fecha y sellos)</p>
        {open && (<>
          <button className="btn o" onClick={addSello}>Completar una ayuda de Luis (+1 sello)</button>
          <button className="btn g" onClick={dupSello}>Intentar sello duplicado</button>
          <button className="btn g" onClick={canSello}>Intentar sumar coordinación cancelada</button>
          <button className="btn" onClick={closeMonth}>Cerrar noviembre (30 nov)</button>
        </>)}
        {closed && (<><button className="btn g" onClick={reopen}>Volver a noviembre en curso</button></>)}
        {hasNote && (<><p className="err" role="alert">{note}</p></>)}
      </div>
      </>)}
      </div>
    </div>
  );
}
