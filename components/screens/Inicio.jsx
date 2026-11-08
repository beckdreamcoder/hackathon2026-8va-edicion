"use client";

import { Fragment } from "react";
import "./Inicio.css";

/**
 * Pantalla Inicio del prototipo BarrioConecta.
 * Los valores de demostración sustituyen a la lógica del prototipo (DCLogic), que no se migró.
 */
export default function Inicio() {
  return (
    <div className="scr-inicio">
      <div className="app">
      <div style={{display: "flex", alignItems: "center", gap: "12px", padding: "12px 12px 4px 16px", minHeight: "64px", flex: "none"}}>
        <span className="av" aria-hidden="true">M</span>
        <div style={{flex: "1", minWidth: "0"}}><h1 style={{fontSize: "24px"}}>Hola, María</h1><p className="mut" style={{display: "flex", alignItems: "center", gap: "4px"}}><svg className="ic" style={{width: "18px", height: "18px", color: "#C8102E", fill: "currentColor", stroke: "none"}} viewBox="0 0 20 20" aria-hidden="true"><path fill="currentColor" d="M10 2.009c-2.762 0-5 2.229-5 4.99c0 4.774 5 11 5 11s5-6.227 5-11c0-2.76-2.238-4.99-5-4.99m0 7.751a2.7 2.7 0 1 1 0-5.4a2.7 2.7 0 0 1 0 5.4" /></svg>Mi barrio</p></div>
        <a className="ib" href="/notificaciones" aria-label="Avisos, 3 sin leer"><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 21h4" /></svg><i className="dot"></i></a>
      </div>
      <div className="body" style={{gap: "14px"}}>
        <svg viewBox="0 0 177 26" role="img" aria-labelledby="sep-title" style={{width: "100%", height: "auto", display: "block"}}><title id="sep-title">Separador con murallas escalonadas y siete cuadrados</title><path d="M0 15H5V17.5H13V15H20V12.5H24V10H27.5V5.5H34.5V10H38V12.5H42V15H53V17.5H56.5V21.5H63.5V17.5H67V15H77.5V12.5H81.5V10H85V5.5H92V10H95.5V12.5H99.5V15H110V17.5H113.5V21.5H120.5V17.5H124V15H134.5V12.5H138.5V10H142V5.5H149V10H152.5V12.5H156.5V15H164V17.5H172V15H177" fill="none" stroke="#a19790" strokeWidth="0.85" strokeLinejoin="round" /><g fill="none" stroke="#bd1227" strokeWidth="0.95"><rect x="7" y="9.5" width="3.5" height="3.5" /><rect x="29.25" y="14.5" width="3.5" height="3.5" /><rect x="58.25" y="9.5" width="3.5" height="3.5" /><rect x="86.75" y="14.5" width="3.5" height="3.5" /><rect x="115.25" y="9.5" width="3.5" height="3.5" /><rect x="143.75" y="14.5" width="3.5" height="3.5" /><rect x="167" y="9.5" width="3.5" height="3.5" /></g></svg>
        <h2 style={{fontSize: "36px", fontWeight: "800", textAlign: "center", padding: "4px 8px"}}>Conecta. Ayuda. Comparte.</h2>
        <div style={{display: "flex", justifyContent: "center"}} aria-hidden="true"><svg viewBox="0 0 250 42" role="img" aria-labelledby="sep-title2" style={{width: "100%", height: "auto", display: "block"}}><title id="sep-title2">Separador de tres rombos rojos</title><path d="M13 23.5H84 M167 23.5H238" fill="none" stroke="#a19790" strokeWidth="1.2" strokeLinecap="round" /><path d="M103.5 17.5l6 6-6 6-6-6Z M125.5 17.5l6 6-6 6-6-6Z M147.5 17.5l6 6-6 6-6-6Z" fill="none" stroke="#c81024" strokeWidth="2.2" strokeLinejoin="round" /></svg></div>
      
        <a className="mod card" style={{border: "2px solid #C8102E", color: "#202124", background: "#fff", gap: "0"}} href="/comunidad">
          <span style={{display: "flex", alignItems: "center", gap: "14px", flex: "1", minWidth: "0"}}>
            <svg className="ic" style={{color: "#C8102E", fill: "currentColor", stroke: "none"}} viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" clipRule="evenodd" d="M12 6a3.5 3.5 0 1 0 0 7a3.5 3.5 0 0 0 0-7m-1.5 8a4 4 0 0 0-4 4a2 2 0 0 0 2 2h7a2 2 0 0 0 2-2a4 4 0 0 0-4-4zm6.82-3.096a5.51 5.51 0 0 0-2.797-6.293a3.5 3.5 0 1 1 2.796 6.292ZM19.5 18h.5a2 2 0 0 0 2-2a4 4 0 0 0-4-4h-1.1a5.5 5.5 0 0 1-.471.762A6 6 0 0 1 19.5 18M4 7.5a3.5 3.5 0 0 1 5.477-2.889a5.5 5.5 0 0 0-2.796 6.293A3.5 3.5 0 0 1 4 7.5M7.1 12H6a4 4 0 0 0-4 4a2 2 0 0 0 2 2h.5a6 6 0 0 1 3.071-5.238A5.5 5.5 0 0 1 7.1 12" /></svg>
            <span style={{display: "block"}}><b>Mi comunidad</b><span className="t mut">Favores, cachuelos y ayuda cercana</span></span>
          </span>
        </a>
        <a className="mod" style={{background: "#C8102E", border: "2px solid #C8102E", color: "#fff", gap: "0"}} href="/campanas">
          <span style={{display: "flex", alignItems: "center", gap: "14px", flex: "1", minWidth: "0"}}>
            <svg className="ic" style={{fill: "currentColor", stroke: "none"}} viewBox="0 0 512 512" aria-hidden="true"><g fill="currentColor"><path d="M256 33C216-9 153-11 112 27c-42 39-42 105 0 147l138 138a8.5 8.5 0 0 0 12 0l138-138c42-42 42-108 0-147-41-38-104-36-144 6Z" /><path id="rs-hand" d="M104 512a9 9 0 0 1-9-10l5-60-83-110A72 72 0 0 1 2 285l9-132a32 32 0 0 1 64 2l-1 108 45 59c9 11 21 15 33 12l-50-64c-11-14-8-31 4-41 13-11 30-9 41 4l74 88c15 18 22 38 21 61l-1 121a9 9 0 0 1-9 9Z" /><use href="#rs-hand" transform="translate(512 0) scale(-1 1)" /></g></svg>
            <span style={{display: "block"}}><b>Red solidaria</b><span className="t">Noticias y campañas de apoyo</span></span>
          </span>
        </a>
        <a className="card" style={{display: "flex", alignItems: "center", gap: "12px", minHeight: "64px", padding: "0 16px"}} href="/movilidad"><svg className="ic" style={{color: "#C8102E"}} viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 17H4a1 1 0 0 1-1-1a3 3 0 0 1 3-3h1m0-3.05A2.5 2.5 0 1 1 9 5.5M19.5 17h.5a1 1 0 0 0 1-1a3 3 0 0 0-3-3h-1m0-3.05a2.5 2.5 0 1 0-2-4.45m.5 13.5h-7a1 1 0 0 1-1-1a3 3 0 0 1 3-3h3a3 3 0 0 1 3 3a1 1 0 0 1-1 1Zm-1-9.5a2.5 2.5 0 1 1-5 0a2.5 2.5 0 0 1 5 0Z" /></svg><b style={{flex: "1"}}>Mi junta vecinal</b><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg></a>
      </div>
      <nav className="nav" aria-label="Principal">
        <a className="on" href="/inicio" aria-current="page"><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" /></svg>Inicio</a>
        <a href="/mapa"><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>Mapa</a>
        <a href="/perfil"><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>Mi perfil</a>
      </nav>
      </div>
    </div>
  );
}
