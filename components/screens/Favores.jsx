"use client";

import { useViewStack } from "@/lib/hooks/use-view-stack";

import { useTextInput } from "@/lib/hooks/use-text-input";

import { Fragment } from "react";
import "./Favores.css";

/**
 * Pantalla Favores del prototipo BarrioConecta.
 * Los valores de demostración sustituyen a la lógica del prototipo (DCLogic), que no se migró.
 */
export default function Favores() {
  const nav = useViewStack("muro");
  const accept = () => {};
  const asL = () => {};
  const asM = () => {};
  const canOffer = false;
  const canSello = false;
  const chatClosed = false;
  const chatOpen = true;
  const chipL = "chip";
  const chipM = "chip on";
  const cierreDone = false;
  const cierrePend = true;
  const cierreTitle = "Completar favor";
  const closeSheet = () => {};
  const confL = "pendiente";
  const confM = "pendiente";
  const confirmClose = () => {};
  const doCancel = () => {};
  const doRep = () => {};
  const draft = useTextInput("");
  const giveSello = () => {};
  const goChat = false;
  const hasCoord = false;
  const hasUnread = false;
  const isAuthorPending = false;
  const isAuthorView = false;
  const meConf = false;
  const meNotConf = true;
  const msgs = [];
  const myUnread = false;
  const myUnreadN = 0;
  const nextStep = "Coordinen el encuentro";
  const noCoord = true;
  const offer = () => {};
  const offerSent = false;
  const openCierre = () => {};
  const openCoord = () => {};
  const openRep = () => {};
  const otherAv = "av l";
  const otherIni = "L";
  const otherName = "Luis";
  const quick = [{t: "¿A qué hora puedes?", pick: () => {}}, {t: "Estoy en camino", pick: () => {}}, {t: "Necesito reprogramar", pick: () => {}}];
  const reject = () => {};
  const repDone = false;
  const repOpen = true;
  const selloGiven = false;
  const send = () => {};
  const setNec = () => {};
  const setOfr = () => {};
  const sheetCierre = false;
  const sheetRep = false;
  const solDone = false;
  const solDoneTxt = "Rechazaste esta solicitud.";
  const solNone = true;
  const solNoneTxt = "No tienes solicitudes nuevas";
  const solPending = false;
  const statusTxt = "Abierta";
  const tabIsNec = true;
  const tabIsOfr = false;
  const tabNec = "chip on";
  const tabOfr = "chip";
  const unreadN = 0;
  const wasRejected = false;
  return (
    <div className="scr-favores">
      <div className="app" style={{position: "relative"}}>
      
      {nav.is("muro") && (<>
      <div className="top"><button className="ib" aria-label="Volver" onClick={nav.back}><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Favores</h1><button className="ib" aria-label="Mis coordinaciones" onClick={() => nav.go("coords")}><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z" /></svg>{hasUnread && (<><span className="bd" style={{position: "absolute", margin: "-26px -28px 0 0"}}>{unreadN}</span></>)}</button></div>
      </>)}
      {nav.is("detalle") && (<>
      <div className="top"><button className="ib" aria-label="Volver" onClick={nav.back}><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Detalle del favor</h1></div>
      </>)}
      {nav.is("solicitudes") && (<>
      <div className="top"><button className="ib" aria-label="Volver" onClick={nav.back}><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Solicitudes recibidas</h1></div>
      </>)}
      {nav.is("coords") && (<>
      <div className="top"><button className="ib" aria-label="Volver" onClick={nav.back}><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Mis coordinaciones</h1></div>
      </>)}
      {nav.is("chat") && (<>
      <div className="top"><button className="ib" aria-label="Volver" onClick={nav.back}><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><span className={`${otherAv ?? ""}`} aria-hidden="true">{otherIni}</span><div className="sp"><h1 style={{fontSize: "19px"}}>{otherName}</h1><p className="mut">Escalera de 3 metros</p></div><button className="ib" aria-label="M\u00e1s opciones" onClick={openRep}><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" /></svg></button></div>
      </>)}
      
      <div className="who" role="group" aria-label="Probar como">
        <span>Probar como:</span><button className={`${chipM ?? ""}`} onClick={asM}>María (solicita)</button><button className={`${chipL ?? ""}`} onClick={asL}>Luis (ofrece)</button>
      </div>
      
      {nav.is("muro") && (<>
      <div className="body">
        <div className="wrap"><button className={`${tabNec ?? ""}`} onClick={setNec}>Necesito ayuda</button><button className={`${tabOfr ?? ""}`} onClick={setOfr}>Ofrezco ayuda</button></div>
        <div className="scrollx" role="group" aria-label="Categor\u00eda"><button className="chip on">Todos</button><button className="chip">Herramientas</button><button className="chip">Habilidades</button><button className="chip">Ayuda temporal</button><button className="chip">Movilidad</button></div>
        {tabIsNec && (<>
          <button className="card" onClick={() => nav.go("detalle")}><div className="row"><span className="tag fav">Gratis</span><span className="tag">{statusTxt}</span><span className="mut sp" style={{textAlign: "right"}}>a 300 m</span></div><h3 style={{fontSize: "19px"}}>Necesito una escalera de 3 metros prestada</h3><p className="mut">Herramientas · Campoy Sector 2 · Disponible hoy por la tarde</p><div className="row"><span className="av" aria-hidden="true" style={{width: "32px", height: "32px", fontSize: "14px"}}>M</span><span className="mut">María</span></div></button>
          <div className="card"><div className="row"><span className="tag fav">Gratis</span><span className="tag sim">Ejemplo</span></div><h3 style={{fontSize: "19px"}}>Alguien que me enseñe a usar WhatsApp</h3><p className="mut">Habilidades · Campoy Sector 4 · Esta semana</p></div>
        </>)}
        {tabIsOfr && (<>
          <div className="card"><div className="row"><span className="tag fav">Gratis</span><span className="tag sim">Ejemplo</span></div><h3 style={{fontSize: "19px"}}>Ayudo con trámites digitales a adultos mayores</h3><p className="mut">Habilidades · Rosa · Sábados por la mañana</p></div>
          <div className="card"><div className="row"><span className="tag fav">Gratis</span><span className="tag sim">Ejemplo</span></div><h3 style={{fontSize: "19px"}}>Presto herramientas de jardinería</h3><p className="mut">Herramientas · Luis · Fines de semana</p></div>
        </>)}
        <a className="btn" href="/publicar"><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>Publicar un favor</a>
      </div>
      </>)}
      
      {nav.is("detalle") && (<>
      <div className="body">
        <div className="card"><div className="row"><span className="tag fav">Gratis</span><span className="tag">{statusTxt}</span></div><h2 style={{fontSize: "24px"}}>Necesito una escalera de 3 metros prestada</h2><p>Voy a pintar el frente de mi casa el sábado. La devuelvo el mismo día, limpia.</p><p className="mut">Herramientas · Campoy Sector 2 (zona aproximada) · Disponible hoy por la tarde</p></div>
        <div className="card"><div className="row"><span className="av" aria-hidden="true">M</span><div className="sp"><b>María</b><p className="mut">Vecina nueva · sin referencias aún</p></div></div><p className="mut">Sin dinero ni obligación de devolver el favor.</p></div>
        {canOffer && (<><button className="btn" onClick={offer}>Ofrecer ayuda</button></>)}
        {offerSent && (<><div className="card" role="status"><p className="ok">✓ Tu oferta fue enviada</p><p className="mut">María debe aceptar para que se abra el chat. Cambia a «María» arriba para probarlo.</p></div></>)}
        {isAuthorView && (<><button className="btn" onClick={() => nav.go("solicitudes")}>Ver solicitudes recibidas</button></>)}
        {goChat && (<><button className="btn" onClick={() => nav.go("chat")}>Abrir chat</button></>)}
        {wasRejected && (<><div className="card" role="status"><p style={{fontWeight: "700"}}>Esta solicitud no fue aceptada</p><p className="mut">Puedes buscar otro favor cercano.</p></div></>)}
      </div>
      </>)}
      
      {nav.is("solicitudes") && (<>
      <div className="body">
        {solPending && (<>
          <div className="card"><div className="row"><span className="av l" aria-hidden="true">L</span><div className="sp"><b>Luis quiere ayudarte</b><p className="mut">Vecino con 4 referencias · Campoy Sector 3</p></div></div><p className="mut">Para: «Necesito una escalera de 3 metros prestada»</p>
            <div style={{display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: "8px"}}><button className="btn g" style={{minHeight: "48px"}} onClick={reject}>Rechazar</button><button className="btn" style={{minHeight: "48px"}} onClick={accept}>Aceptar</button></div>
            <p className="mut">Al aceptar, ambos aceptan y se abre un chat temporal.</p></div>
          <p className="mut">Otras personas que se postulen se guardan sin abrir chat privado.</p>
        </>)}
        {solNone && (<><div className="card" role="status"><p style={{fontWeight: "700"}}>{solNoneTxt}</p><p className="mut">Cuando alguien ofrezca ayuda, aparecerá aquí.</p></div></>)}
        {solDone && (<><div className="card" role="status"><p className="ok">{solDoneTxt}</p></div><button className="btn" onClick={() => nav.go("coords")}>Ir a mis coordinaciones</button></>)}
      </div>
      </>)}
      
      {nav.is("coords") && (<>
      <div className="body">
        <div className="wrap"><button className="chip on">Activas</button><button className="chip">Cerradas</button></div>
        {hasCoord && (<>
          <button className="card" onClick={openCoord}><div className="row"><span className={`${otherAv ?? ""}`} aria-hidden="true">{otherIni}</span><div className="sp"><b>{otherName}</b><p className="mut">Escalera de 3 metros · Favor</p></div>{myUnread && (<><span className="bd" aria-label="mensajes sin leer">{myUnreadN}</span></>)}</div><div className="row"><span className="tag">{statusTxt}</span></div><p style={{fontWeight: "700", color: "#9E0C24"}}>Próximo paso: {nextStep}</p></button>
        </>)}
        {noCoord && (<><div className="card" role="status"><p style={{fontWeight: "700"}}>Aún no tienes coordinaciones</p><p className="mut">Se crean cuando ambas personas aceptan. Mientras tanto no hay chat privado.</p></div></>)}
        {isAuthorPending && (<><button className="btn o" onClick={() => nav.go("solicitudes")}>Tienes 1 solicitud nueva</button></>)}
      </div>
      </>)}
      
      {nav.is("chat") && (<>
      <div style={{padding: "0 16px 8px", flex: "none"}}><div className="card" style={{padding: "10px 14px", flexDirection: "row", alignItems: "center", gap: "10px"}}><span className="tag">{statusTxt}</span><p className="mut sp" style={{fontWeight: "700"}}>Siguiente: {nextStep}</p></div></div>
      <div className="body" style={{gap: "10px"}} role="log" aria-live="polite">
        {(msgs ?? []).map((m, __i1) => (<Fragment key={__i1}><div className={`${m.cls ?? ""}`}><b>{m.who}</b>{m.text}</div></Fragment>))}
      </div>
      {chatOpen && (<>
      <div style={{padding: "8px 16px 8px", display: "flex", flexDirection: "column", gap: "8px", borderTop: "1px solid #E3DDD7", background: "#fff", flex: "none"}}>
        <div className="scrollx">{(quick ?? []).map((q, __i1) => (<Fragment key={__i1}><button className="chip" onClick={q.pick}>{q.t}</button></Fragment>))}</div>
        <div className="row"><label htmlFor="msg" style={{position: "absolute", left: "-9999px"}}>Mensaje</label><input id="msg" className="in" placeholder="Escribe un mensaje" {...draft.props} /><button className="ib" style={{background: "#C8102E", color: "#fff", borderRadius: "16px"}} aria-label="Enviar" onClick={send}><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l16-8-6 16-3-7z" /></svg></button></div>
        <div style={{display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: "8px"}}><button className="btn o" style={{minHeight: "48px"}} onClick={openCierre}>Completar favor</button><button className="btn g" style={{minHeight: "48px"}} onClick={doCancel}>Cancelar</button></div>
      </div>
      </>)}
      {chatClosed && (<>
      <div style={{padding: "12px 16px", borderTop: "1px solid #E3DDD7", background: "#fff", display: "flex", flexDirection: "column", gap: "8px", flex: "none"}}><p className="mut" role="status">Chat en solo lectura por 30 días de demostración. El acuerdo y los estados se conservan.</p>{canSello && (<><button className="btn" onClick={openCierre}>Agradecer y dar sello</button></>)}</div>
      </>)}
      </>)}
      
      {sheetCierre && (<>
      <div className="scrim" aria-hidden="true"></div>
      <div className="sheet" role="dialog" aria-label="Cierre del favor">
        <h2 style={{fontSize: "22px"}}>{cierreTitle}</h2>
        {cierrePend && (<>
          <p className="mut">El favor se completa cuando ambas personas confirman.</p>
          <p>María: <b>{confM}</b> · Luis: <b>{confL}</b></p>
          {meNotConf && (<><button className="btn" onClick={confirmClose}>Confirmar que se completó</button></>)}
          {meConf && (<><p className="ok" role="status">Esperando confirmación de la otra persona. Cambia de perfil arriba para confirmar.</p></>)}
        </>)}
        {cierreDone && (<>
          <p className="ok" role="status">✓ Favor completado por ambas personas</p>
          <p className="mut">Puedes agradecer con un sello de Visto Bueno Vecinal. Es opcional y se emite una sola vez por favor.</p>
          {canSello && (<><button className="btn" onClick={giveSello}>Dar sello a {otherName}</button></>)}
          {selloGiven && (<><p className="ok" role="status">✓ Sello emitido. No se puede repetir.</p><a className="btn o" href="/noticias">Ver Vecino del mes</a></>)}
        </>)}
        <button className="btn g" onClick={closeSheet}>Cerrar</button>
      </div>
      </>)}
      
      {sheetRep && (<>
      <div className="scrim" aria-hidden="true"></div>
      <div className="sheet" role="dialog" aria-label="Reportar o bloquear">
        <h2 style={{fontSize: "22px"}}>Reportar o bloquear</h2>
        {repOpen && (<>
          <div className="wrap"><button className="chip">Mensajes molestos</button><button className="chip">No cumplió</button><button className="chip">Otro motivo</button></div>
          <p className="mut">Reportar no borra pruebas ni avisa automáticamente a autoridades. Si hay una coordinación activa, podrás cerrarla o cancelarla; el acuerdo se conserva.</p>
          <button className="btn" onClick={doRep}>Confirmar reporte</button>
        </>)}
        {repDone && (<><p className="ok" role="status">✓ Reporte guardado en la demostración.</p></>)}
        <button className="btn g" onClick={closeSheet}>Cerrar</button>
      </div>
      </>)}
      
      <nav className="nav" aria-label="Principal">
        <a href="/inicio"><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" /></svg>Inicio</a>
        <a href="/mapa"><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>Mapa</a>
        <a href="/perfil"><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>Mi perfil</a>
      </nav>
      </div>
    </div>
  );
}
