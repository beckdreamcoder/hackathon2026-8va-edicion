"use client";

import { useViewStack } from "@/lib/hooks/use-view-stack";

import { useCheckbox } from "@/lib/hooks/use-checkbox";
import { useTextInput } from "@/lib/hooks/use-text-input";

import { Fragment } from "react";
import "./Offline.css";

/**
 * Pantalla Offline del prototipo BarrioConecta.
 * Los valores de demostración sustituyen a la lógica del prototipo (DCLogic), que no se migró.
 */
export default function Offline() {
  const nav = useViewStack("zonas");
  const question = useTextInput("");
  const cOff = "chip";
  const cOn = "chip on";
  const cid = "";
  const cstatus = "";
  const delWarn = false;
  const delZone = () => {};
  const dlFail = false;
  const dlLbl = "Actualizar";
  const dlRun = false;
  const failMode = useCheckbox(false);
  const goOffline = () => {};
  const goOnline = () => {};
  const hasConsulta = false;
  const kinds = [{name: "Necesito orientación", cls: "chip on", pick: () => {}}, {name: "Busco suministros", cls: "chip", pick: () => {}}, {name: "Necesito ayuda", cls: "chip", pick: () => {}}, {name: "Consultar mi solicitud", cls: "chip", pick: () => {}}];
  const msg = false;
  const msgCls = "ok";
  const msgTxt = "";
  const msgs = [];
  const needZone = false;
  const offline = false;
  const pct = 100;
  const pendCount = 2;
  const queue = [{title: "Favor: «Presto escalera»", kind: "Ordinaria", stateLbl: "Pendiente", tagCls: "sim", ask: false, canCancel: true, yes: () => {}, no: () => {}, cancel: () => {}}, {title: "Reporte: calles anegadas en Campoy", kind: "Emergencia", stateLbl: "Pendiente", tagCls: "sim", ask: false, canCancel: true, yes: () => {}, no: () => {}, cancel: () => {}}];
  const reconnect = () => {};
  const reply = useTextInput("");
  const sendReply = () => {};
  const sendSms = () => {};
  const setQ = () => {};
  const startDl = () => {};
  const sync = () => {};
  const synced = false;
  const zone = useTextInput("");
  const zoneInfo = "48 MB · Última sincronización COMPLETA: hoy 7:50 a. m.";
  const zoneTag = "Descargada";
  return (
    <div className="scr-offline">
      <div className="app">
      
      {nav.is("zonas") && (<><div className="top"><button className="ib" aria-label="Volver" onClick={nav.back}><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Mis zonas sin conexión</h1></div></>)}
      {nav.is("pend") && (<><div className="top"><button className="ib" aria-label="Volver" onClick={nav.back}><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Pendientes de envío</h1></div></>)}
      {nav.is("sms") && (<><div className="top"><button className="ib" aria-label="Volver" onClick={nav.back}><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Consulta por SMS</h1></div></>)}
      {nav.is("consulta") && (<><div className="top"><button className="ib" aria-label="Volver" onClick={nav.back}><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Consulta {cid}</h1></div></>)}
      
      <div className="conn" role="group" aria-label="Conexi\u00f3n del dispositivo"><span>Conexión:</span><button className={`${cOn ?? ""}`} onClick={goOnline}>En línea</button><button className={`${cOff ?? ""}`} onClick={goOffline}>Sin conexión</button></div>
      {offline && (<><div className="banner" role="status">Sin conexión. Verás lo descargado con su hora. No hay mensajes ni noticias nuevas.</div></>)}
      
      {nav.is("zonas") && (<>
      <div className="body">
        <div className="card"><div className="row"><b className="sp">Campoy · San Juan de Lurigancho</b><span className="tag fav">{zoneTag}</span></div>
          <p className="mut">{zoneInfo}</p>
          {dlRun && (<><div className="bar" role="progressbar" aria-valuenow={`${pct ?? ""}`} aria-valuemin="0" aria-valuemax="100" aria-label="Descarga"><i style={{}}></i></div><p className="mut" role="status">Descargando… {pct} %</p></>)}
          {dlFail && (<><p className="err" role="alert">No se pudo completar la descarga. Conservamos tu versión anterior.</p></>)}
          <div className="row" style={{flexWrap: "wrap"}}><button className="btn" style={{flex: "1", minHeight: "48px"}} onClick={startDl}>{dlLbl}</button><button className="btn g" style={{flex: "1", minHeight: "48px"}} onClick={delZone}>Eliminar</button></div>
          <div className="sw"><input id="fl" type="checkbox" {...failMode.props} /><label htmlFor="fl"><span className="mut">Simular que la descarga falla</span></label></div>
          {delWarn && (<><p className="err" role="alert">Tienes 2 envíos pendientes. Eliminar la zona no los borra; se enviarán cuando haya conexión.</p></>)}
          <p className="mut">Incluye mapa de demostración, incidencias con hora, calor de instantánea, contactos oficiales y orientación. Se guarda en el dispositivo (IndexedDB y caché), no solo en memoria.</p></div>
        <div className="card"><div className="row"><b className="sp">Calca Centro</b><span className="tag">No descargada</span></div><p className="mut">Fuera de la zona descargada verías un aviso y la lista de reportes como alternativa.</p><button className="btn o" style={{minHeight: "48px"}}>Guardar zona</button></div>
        <div className="card"><p className="lbl">Espacio</p><div className="bar" aria-hidden="true"><i style={{width: "18%"}}></i></div><p className="mut">Usado por BarrioConecta: 48 MB · Espacio libre suficiente</p></div>
        <button className="btn" onClick={() => nav.go("pend")}>Pendientes de envío ({pendCount})</button>
        <button className="btn o" onClick={() => nav.go("sms")}>Consulta por SMS</button>
      </div>
      </>)}
      
      {nav.is("pend") && (<>
      <div className="body">
        {(queue ?? []).map((q, __i1) => (<Fragment key={__i1}>
          <div className="card"><div className="row"><span className={`tag ${q.tagCls ?? ""}`}>{q.stateLbl}</span><span className="mut sp" style={{textAlign: "right"}}>{q.kind}</span></div><b>{q.title}</b>
            {q.ask && (<><p className="mut">Antes de enviar: ¿esta emergencia sigue vigente?</p><div style={{display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: "8px"}}><button className="btn g" style={{minHeight: "48px"}} onClick={q.no}>Ya no</button><button className="btn" style={{minHeight: "48px"}} onClick={q.yes}>Sigue vigente</button></div></>)}
            {q.canCancel && (<><button className="btn g" style={{minHeight: "44px"}} onClick={q.cancel}>Cancelar envío</button></>)}</div>
        </Fragment>))}
        {msg && (<><p className={`${msgCls ?? ""}`} role="status">{msgTxt}</p></>)}
        <button className="btn" onClick={sync}>Sincronizar ahora</button>
        <p className="mut">Cada envío tiene un identificador único: reintentar no duplica ni revive reportes cerrados.</p>
      </div>
      </>)}
      
      {nav.is("sms") && (<>
      <div className="body">
        <span className="tag sim">Teléfono y central estatal simulados</span>
        <div className="card" role="note"><p className="mut">Esto simula a una persona <b>sin datos móviles</b> que solo tiene SMS. No es lo mismo que perder la conexión del dispositivo. Una PWA no puede leer tu bandeja de SMS: en la vida real el mensaje llega a tu app de mensajes.</p></div>
        <div className="field"><p className="lbl">¿Qué necesitas?</p><div className="wrap">{(kinds ?? []).map((k, __i1) => (<Fragment key={__i1}><button className={`${k.cls ?? ""}`} onClick={k.pick}>{k.name}</button></Fragment>))}</div></div>
        <div className="field"><label htmlFor="q">Tu pregunta</label><textarea id="q" className="in" placeholder="Ejemplo: \u00bfd\u00f3nde recojo agua?" {...question.props}></textarea></div>
        <div className="field"><label htmlFor="z">Localidad (opcional)</label><input id="z" className="in" placeholder="Ejemplo: Campoy" {...zone.props} /></div>
        <button className="btn" onClick={sendSms}>Enviar SMS (simulado)</button>
        {hasConsulta && (<><button className="btn o" onClick={() => nav.go("consulta")}>Ver mi consulta {cid}</button></>)}
      </div>
      </>)}
      
      {nav.is("consulta") && (<>
      <div className="body" role="log" aria-live="polite">
        <div className="row"><span className="tag sim">SMS simulado</span><span className="tag">{cstatus}</span></div>
        <span className="tag red">Consulta privada · no se publica</span>
        {(msgs ?? []).map((m, __i1) => (<Fragment key={__i1}><div className={`${m.cls ?? ""}`}><b>{m.who} · {m.time}</b>{m.t}</div></Fragment>))}
        {needZone && (<><div className="field"><label htmlFor="rz">Tu respuesta</label><input id="rz" className="in" placeholder="Ejemplo: Campoy" {...reply.props} /></div><button className="btn" onClick={sendReply}>Responder por SMS</button></>)}
        <button className="btn o" onClick={reconnect}>Simular que recupero la conexión</button>
        {synced && (<><p className="ok" role="status">✓ Esta consulta ya aparece en Emergencias › Mis consultas con el mismo ID y tu celular vinculado.</p></>)}
        <p className="mut">Respuestas de ejemplo con guías controladas; no se usa IA real ni se inventan suministros, rutas seguras ni despachos.</p>
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
