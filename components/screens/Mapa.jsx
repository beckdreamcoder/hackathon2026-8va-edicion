"use client";

import { Fragment } from "react";
import "./Mapa.css";

/**
 * Pantalla Mapa del prototipo BarrioConecta.
 * Los valores de demostración sustituyen a la lógica del prototipo (DCLogic), que no se migró.
 */
export default function Mapa() {
  const cac = true;
  const clearSel = () => {};
  const eme = true;
  const fCac = "chip cac on";
  const fEme = "chip eme on";
  const fFav = "chip fav on";
  const fav = true;
  const hasSel = false;
  const heat = false;
  const heatChip = "chip";
  const heatSrc = "Fuente: reportes vecinos de demostración.";
  const heats = [];
  const legBottom = "12px";
  const markers = [{key: "A", pos: "left:32%;top:38%", cls: "pin cl", ini: "2", label: "Grupo de 2 publicaciones. Acerca el mapa para verlas", showBub: false, bub: "", isFav: false, isCac: false, isEme: false, pick: () => {}}, {key: "B", pos: "left:69%;top:34%", cls: "pin cl", ini: "2", label: "Grupo de 2 publicaciones. Acerca el mapa para verlas", showBub: false, bub: "", isFav: false, isCac: false, isEme: false, pick: () => {}}, {key: "C", pos: "left:50%;top:67%", cls: "pin cl", ini: "2", label: "Grupo de 2 publicaciones. Acerca el mapa para verlas", showBub: false, bub: "", isFav: false, isCac: false, isEme: false, pick: () => {}}];
  const offChip = "chip";
  const offline = false;
  const sel = {tag: "", tagCls: "tag", who: "", title: "", note: "", href: "#"};
  const tCac = () => {};
  const tEme = () => {};
  const tFav = () => {};
  const title = "Mapa";
  const toggleHeat = () => {};
  const toggleOff = () => {};
  const z1 = "on";
  const z2 = "";
  const zoomIn = () => {};
  const zoomOut = () => {};
  return (
    <div className="scr-mapa">
      <div className="app">
      <div className="top"><h1>{title}</h1>
        <button className={`${heatChip ?? ""}`} style={{minHeight: "44px"}} onClick={toggleHeat} aria-pressed={`${heat ?? ""}`}><svg className="ic" style={{width: "20px", height: "20px"}} viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3c1 4 5 5 5 10a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3-1-5 1-9z" /></svg>Calor</button>
        <button className={`${offChip ?? ""}`} style={{minHeight: "44px"}} onClick={toggleOff} aria-pressed={`${offline ?? ""}`}>Sin conexión</button>
      </div>
      <div className="filters" role="group" aria-label="Filtros del mapa">
        <button className={`${fFav ?? ""}`} onClick={tFav} aria-pressed={`${fav ?? ""}`}><svg className="ic" style={{width: "20px", height: "20px"}} viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z" /></svg>Favores</button>
        <button className={`${fCac ?? ""}`} onClick={tCac} aria-pressed={`${cac ?? ""}`}><svg className="ic" style={{width: "20px", height: "20px"}} viewBox="0 0 24 24" aria-hidden="true"><path d="M14.5 5.5a4 4 0 0 0-5 5L3 17l4 4 6.5-6.5a4 4 0 0 0 5-5L16 12l-3-1-1-3z" /></svg>Cachuelos</button>
        <button className={`${fEme ?? ""}`} onClick={tEme} aria-pressed={`${eme ?? ""}`}><svg className="ic" style={{width: "20px", height: "20px"}} viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l10 18H2z" /><path d="M12 10v5M12 18v.5" /></svg>Emergencias</button>
      </div>
      
      <div className="map">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" width="100%" height="100%" aria-hidden="true" style={{position: "absolute", inset: "0"}}>
          <rect width="100" height="100" fill="#EFE8DD" />
          <path d="M0 78 Q30 70 55 80 T100 74 V100 H0z" fill="#D5E6EA" />
          <rect x="8" y="8" width="24" height="16" rx="3" fill="#D9E8CF" />
          <g fill="none" stroke="#FFFFFF" strokeWidth="5" vectorEffect="non-scaling-stroke" strokeLinecap="round"><path d="M0 28 H100" /><path d="M0 52 H100" /><path d="M25 0 V100" /><path d="M70 0 V100" /><path d="M0 14 L45 52 L100 40" /></g>
          <g fill="none" stroke="#DCD2C3" strokeWidth="1" vectorEffect="non-scaling-stroke"><path d="M0 28 H100" /><path d="M0 52 H100" /><path d="M25 0 V100" /><path d="M70 0 V100" /></g>
        </svg>
        <span className="tag sim" style={{position: "absolute", left: "12px", bottom: `${legBottom ?? ""}`, zIndex: "1"}}>Mapa de demostración · no oficial</span>
        {offline && (<><div className="banner" role="status">Sin conexión · datos de la zona descargada. Última sincronización completa: hoy 7:50 a. m.</div></>)}
        {(heats ?? []).map((h, __i1) => (<Fragment key={__i1}><div className="heat" style={{}}></div></Fragment>))}
        {(markers ?? []).map((m, __i1) => (<Fragment key={__i1}>
          <button className="mk" style={{}} onClick={m.pick} aria-label={`${m.label ?? ""}`}>
            {m.showBub && (<><span className="bub">{m.bub}</span></>)}
            <span className={`${m.cls ?? ""}`}>{m.ini}{m.isFav && (<><span className="b" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.5A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z" /></svg></span></>)}{m.isCac && (<><span className="b" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M14.5 5.5a4 4 0 0 0-5 5L3 17l4 4 6.5-6.5a4 4 0 0 0 5-5L16 12l-3-1-1-3z" /></svg></span></>)}{m.isEme && (<><span className="b" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 4v9M12 18v.5" /></svg></span></>)}</span>
          </button>
        </Fragment>))}
        <div className="zoom"><button className={`${z2 ?? ""}`} aria-label="Acercar" onClick={zoomIn}>+</button><button className={`${z1 ?? ""}`} aria-label="Alejar" onClick={zoomOut}>−</button></div>
        {heat && (<><div className="leg" role="note"><b>Calor de reportes recientes.</b> Muestra concentración y antigüedad de reportes, no peligro confirmado ni dónde no hay riesgo. {heatSrc}</div></>)}
        {hasSel && (<>
          <div className="card float" role="dialog" aria-label="Detalle del punto">
            <div className="row"><span className={`${sel.tagCls ?? ""}`}>{sel.tag}</span><span className="mut sp">{sel.who}</span><button className="ib" style={{width: "44px", height: "44px", border: "0", background: "none"}} aria-label="Cerrar tarjeta" onClick={clearSel}><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg></button></div>
            <h3 style={{fontSize: "19px"}}>{sel.title}</h3><p className="mut">{sel.note}</p>
            <a className="btn" style={{minHeight: "48px"}} href="{{ sel.href }}">Abrir publicación</a>
          </div>
        </>)}
      </div>
      
      <nav className="nav" aria-label="Principal">
        <a href="/inicio"><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" /></svg>Inicio</a>
        <a className="on" href="/mapa" aria-current="page"><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>Mapa</a>
        <a href="/perfil"><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>Mi perfil</a>
      </nav>
      </div>
    </div>
  );
}
