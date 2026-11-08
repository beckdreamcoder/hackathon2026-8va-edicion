"use client";

import { useViewStack } from "@/lib/hooks/use-view-stack";

import { useTextInput } from "@/lib/hooks/use-text-input";

import { useCheckbox } from "@/lib/hooks/use-checkbox";

import { Fragment } from "react";
import "./Movilidad.css";

/**
 * Pantalla Movilidad del prototipo BarrioConecta.
 * Los valores de demostración sustituyen a la lógica del prototipo (DCLogic), que no se migró.
 */
export default function Movilidad() {
  const nav = useViewStack("home");
  const origen = useTextInput("Campoy \u00b7 Sector 2");
  const destino = useTextInput("Hospital de la zona");
  const acceptOffer = () => {};
  const ampl = false;
  const ampliar = () => {};
  const arrive = () => {};
  const asC = () => {};
  const asM = () => {};
  const avisos = useCheckbox(false);
  const b_avisada_c = false;
  const b_avisada_m = false;
  const b_cancel = false;
  const b_done = false;
  const b_ficha = false;
  const b_none = true;
  const b_oferta_c = false;
  const b_oferta_m = false;
  const cC = "pendiente";
  const cM = "pendiente";
  const canArrive = false;
  const canStart = false;
  const cancel = () => {};
  const chipC = "chip";
  const chipM = "chip on";
  const confirmFicha = () => {};
  const hasReq = false;
  const iConf = false;
  const needConf = false;
  const noReq = true;
  const notAmpl = true;
  const offer = () => {};
  const reset = () => {};
  const sendReq = () => {};
  const setNec = () => {};
  const setPaso = () => {};
  const startTrip = () => {};
  const statusTxt = "Sin solicitud";
  const tabIsNec = true;
  const tabIsPaso = false;
  const tabNec = "chip on";
  const tabPaso = "chip";
  const urg = useCheckbox(false);
  const waitArrive = false;
  const waitStart = false;
  return (
    <div className="scr-movilidad">
      <div className="app">
      
      {nav.is("home") && (<><div className="top"><button className="ib" aria-label="Volver" onClick={nav.back}><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Movilidad solidaria</h1></div></>)}
      {nav.is("nuevo") && (<><div className="top"><button className="ib" aria-label="Volver" onClick={nav.back}><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Pedir un traslado</h1></div></>)}
      {nav.is("detalle") && (<><div className="top"><button className="ib" aria-label="Volver" onClick={nav.back}><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Detalle del traslado</h1></div></>)}
      {nav.is("junta") && (<><div className="top"><button className="ib" aria-label="Volver" onClick={nav.back}><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Mi junta vecinal</h1></div></>)}
      
      <div className="who" role="group" aria-label="Probar como"><span>Probar como:</span><button className={`${chipM ?? ""}`} onClick={asM}>María (pide)</button><button className={`${chipC ?? ""}`} onClick={asC}>Carlos (pasa)</button></div>
      
      {nav.is("home") && (<>
      <div className="body">
        <div className="warn" role="note"><b>No es transporte médico de urgencia.</b> Ante una urgencia, llama al 106 (SAMU). No esperes respuestas de vecinos.</div>
        <div className="wrap"><button className={`${tabNec ?? ""}`} onClick={setNec}>Necesito un traslado</button><button className={`${tabPaso ?? ""}`} onClick={setPaso}>Paso por ahí</button></div>
        {tabIsNec && (<>
          {hasReq && (<><button className="card" onClick={() => nav.go("detalle")}><div className="row"><span className="tag fav">Gratis</span><span className="tag">{statusTxt}</span></div><h3 style={{fontSize: "19px"}}>María necesita llegar al hospital</h3><p className="mut">Desde Campoy (zona aproximada) · Mañana 9:00 a. m. · 1 plaza</p></button></>)}
          {noReq && (<><div className="card" role="status"><p style={{fontWeight: "700"}}>Aún no hay traslados pedidos</p><p className="mut">Pide uno y tu junta recibirá el aviso primero.</p></div></>)}
        </>)}
        {tabIsPaso && (<><div className="card"><div className="row"><span className="tag fav">Gratis</span><span className="tag sim">Ejemplo</span></div><h3 style={{fontSize: "19px"}}>Carlos pasa por el hospital mañana</h3><p className="mut">Sale 8:45 a. m. · 2 plazas · Desde Campoy</p></div></>)}
        <button className="btn" onClick={() => nav.go("nuevo")}><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>Pedir un traslado</button>
        <button className="btn g" onClick={() => nav.go("junta")}>Mi junta vecinal</button>
      </div>
      </>)}
      
      {nav.is("nuevo") && (<>
      <div className="body">
        <div className="sw card" style={{flexDirection: "row"}}><input id="urg" type="checkbox" {...urg.props} /><label htmlFor="urg"><b>Es una urgencia médica o hay peligro ahora</b></label></div>
        {urg.checked && (<><div className="card" style={{background: "#FFF1E6", borderColor: "#F0C8A8"}} role="alert"><p style={{fontWeight: "700"}}>Llama primero al 106 (SAMU)</p><p className="mut">Un vecino no reemplaza una ambulancia. No esperes respuestas de tu junta.</p><a className="btn" href="tel:106">Llamar al 106</a></div></>)}
        <div className="field"><label htmlFor="o">Origen aproximado</label><input id="o" className="in" {...origen.props} /></div>
        <div className="field"><label htmlFor="d">Destino</label><input id="d" className="in" {...destino.props} /></div>
        <div className="field"><p className="lbl">¿Cuándo?</p><div className="wrap"><button className="chip on">Mañana 9:00 a. m.</button><button className="chip">Hoy 4:00 p. m.</button></div></div>
        <div className="field"><p className="lbl">Personas</p><div className="wrap"><button className="chip on">1 plaza</button><button className="chip">2 plazas</button></div></div>
        <div className="card"><p className="lbl">Destinatarios</p><p>Mi junta primero</p><p className="mut">Tu punto exacto se comparte solo en privado, después de aceptar.</p></div>
        <button className="btn" onClick={sendReq}>Enviar a mi junta</button>
      </div>
      </>)}
      
      {nav.is("detalle") && (<>
      <div className="body">
        <div className="card"><div className="row"><span className="tag fav">Gratis</span><span className="tag">{statusTxt}</span></div><h2 style={{fontSize: "22px"}}>María necesita llegar al hospital</h2><p className="mut">Desde Campoy (zona aproximada) · Mañana 9:00 a. m. · 1 plaza · No urgente</p></div>
      
        {b_none && (<><div className="card" role="status"><p style={{fontWeight: "700"}}>Aún no hay solicitud</p><button className="btn" onClick={() => nav.go("nuevo")}>Pedir un traslado</button></div></>)}
      
        {b_avisada_m && (<>
          <div className="card"><p className="lbl">Aviso enviado a tu junta</p><div className="stack"><span className="av" aria-hidden="true">C</span><span className="av g" aria-hidden="true">R</span><span className="av t" aria-hidden="true">L</span></div><p className="mut">Miembros que recibieron el aviso de demostración (no se afirma entrega real).</p><span className="tag sim">Simulación</span></div>
          {notAmpl && (<><button className="btn o" onClick={ampliar}>Ampliar a mi comunidad</button></>)}
          {ampl && (<><p className="ok" role="status">✓ Ampliaste el aviso a tu comunidad por decisión tuya.</p></>)}
          <p className="mut">Cambia a «Carlos» arriba: es un vecino de tu junta que pasa por esa zona.</p>
        </>)}
      
        {b_avisada_c && (<>
          <div className="card"><p className="lbl">Coincidencia sugerida</p><p>Tu ruta habitual pasa por la zona del hospital a las 8:45 a. m.</p><p className="mut">Se comparan zonas y horarios. No se calcula una ruta vial.</p></div>
          <button className="btn" onClick={offer}>Puedo llevarte</button>
        </>)}
      
        {b_oferta_m && (<>
          <div className="card"><div className="row"><span className="av g" aria-hidden="true">C</span><div className="sp"><b>Carlos puede llevarte</b><p className="mut">Miembro de tu junta · 6 referencias vecinas</p></div></div><p className="mut">Sale 8:45 a. m. · 2 plazas · pasa por el hospital</p></div>
          <button className="btn" onClick={acceptOffer}>Aceptar a Carlos</button><button className="btn g" onClick={cancel}>Rechazar</button>
        </>)}
        {b_oferta_c && (<><div className="card" role="status"><p className="ok">✓ Oferta enviada</p><p className="mut">Esperando que María acepte. Cambia a «María» arriba.</p></div></>)}
      
        {b_ficha && (<>
          <div className="card"><p className="lbl">Ficha de traslado</p><p>Encuentro: <b>Esquina Av. Principal con Jr. Los Olivos</b></p><p>Destino: <b>Hospital de la zona</b></p><p>Hora: <b>Mañana 8:45 a. m.</b></p><p>María: <b>{cM}</b> · Carlos: <b>{cC}</b></p>
            {needConf && (<><button className="btn" onClick={confirmFicha}>Confirmar ficha</button></>)}
            {iConf && (<><p className="ok" role="status">Esperando confirmación de la otra persona.</p></>)}
            <p className="mut">El encuentro exacto se acordó en privado. Nunca se rastrea tu ubicación.</p></div>
          {canStart && (<><button className="btn" onClick={startTrip}>Marcar «En traslado» (manual)</button></>)}
          {canArrive && (<><button className="btn" onClick={arrive}>Confirmar que llegué</button></>)}
          {waitStart && (<><p className="mut">Carlos marcará el inicio del traslado. Cambia a «Carlos» arriba.</p></>)}
          {waitArrive && (<><p className="mut">María confirmará la llegada. Cambia a «María» arriba.</p></>)}
          <button className="btn g" onClick={cancel}>Cancelar traslado</button>
        </>)}
      
        {b_done && (<><div className="card" role="status"><p className="ok">✓ Traslado completado</p><p className="mut">Gracias por ayudar. Pueden dejarse un Visto Bueno Vecinal.</p><a className="btn o" href="/favores">Ir a cierre y sello</a></div></>)}
        {b_cancel && (<><div className="card" role="status"><p style={{fontWeight: "700"}}>Traslado cancelado</p><p className="mut">El acuerdo se conserva en el historial.</p><button className="btn" onClick={reset}>Empezar de nuevo</button></div></>)}
      </div>
      </>)}
      
      {nav.is("junta") && (<>
      <div className="body">
        <div className="card"><div className="row"><span className="av t" aria-hidden="true">J</span><div className="sp"><h2 style={{fontSize: "21px"}}>Junta Vecinal Campoy Unido</h2><p className="mut">Campoy · San Juan de Lurigancho</p></div></div><span className="tag sim">Junta de demostración</span><p className="mut">No tiene reconocimiento estatal real. Pertenecer no verifica a nadie.</p></div>
        {hasReq && (<><button className="card" style={{borderColor: "#C8102E"}} onClick={() => nav.go("detalle")}><span className="tag fav">Traslado prioritario</span><b>María necesita llegar al hospital</b><p className="mut">Mañana 9:00 a. m. · {statusTxt}</p></button></>)}
        <h3 style={{fontSize: "19px"}}>Avisos</h3>
        <div className="card"><p style={{fontWeight: "700"}}>Reunión vecinal el sábado</p><p className="mut">Local comunal · 5:00 p. m. · Aviso de demostración</p></div>
        <div className="card"><p style={{fontWeight: "700"}}>Faena de limpieza del parque</p><p className="mut">Domingo 8:00 a. m. · Aviso de demostración</p></div>
        <h3 style={{fontSize: "19px"}}>Miembros visibles</h3>
        <div className="card"><div className="stack"><span className="av" aria-hidden="true">M</span><span className="av g" aria-hidden="true">C</span><span className="av t" aria-hidden="true">R</span></div><p className="mut">Solo se muestran quienes dieron permiso. Nunca se muestran conversaciones privadas.</p></div>
        <div className="sw card" style={{flexDirection: "row"}}><input id="av" type="checkbox" {...avisos.props} /><label htmlFor="av"><b>Recibir avisos de mi junta</b></label></div>
        <button className="btn g">Salir de la junta</button>
        <p className="mut" style={{textAlign: "center"}}>Puedes usar toda la app sin pertenecer a una junta.</p>
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
