"use client";

import { useViewStack } from "@/lib/hooks/use-view-stack";

import { useCheckbox } from "@/lib/hooks/use-checkbox";
import { useTextInput } from "@/lib/hooks/use-text-input";

import { Fragment } from "react";
import { screenStyles } from "./screen-styles";

/**
 * Pantalla Offline del prototipo BarrioConecta.
 * Los valores de demostración sustituyen a la lógica del prototipo (DCLogic), que no se migró.
 */
export default function Offline() {
  const nav = useViewStack("zonas");
  const question = useTextInput("");
  const cOff = "min-h-11 rounded-full border-[1.5px] border-[#cfc7bf] bg-white px-3.5 py-0 font-bold text-[15px] whitespace-nowrap chip";
  const cOn = "min-h-11 rounded-full border-[1.5px] border-(--color-ink) bg-(--color-ink) px-3.5 py-0 font-bold text-[15px] whitespace-nowrap text-white chip";
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
  const kinds = [{name: "Necesito orientación", cls: "min-h-11 rounded-full border-[1.5px] border-(--color-ink) bg-(--color-ink) px-3.5 py-0 font-bold text-[15px] whitespace-nowrap text-white chip", pick: () => {}}, {name: "Busco suministros", cls: "min-h-11 rounded-full border-[1.5px] border-[#cfc7bf] bg-white px-3.5 py-0 font-bold text-[15px] whitespace-nowrap chip", pick: () => {}}, {name: "Necesito ayuda", cls: "min-h-11 rounded-full border-[1.5px] border-[#cfc7bf] bg-white px-3.5 py-0 font-bold text-[15px] whitespace-nowrap chip", pick: () => {}}, {name: "Consultar mi solicitud", cls: "min-h-11 rounded-full border-[1.5px] border-[#cfc7bf] bg-white px-3.5 py-0 font-bold text-[15px] whitespace-nowrap chip", pick: () => {}}];
  const msg = false;
  const msgCls = screenStyles.success;
  const msgTxt = "";
  const msgs = [];
  const needZone = false;
  const offline = false;
  const pct = 100;
  const pendCount = 2;
  const queue = [{title: "Favor: «Presto escalera»", kind: "Ordinaria", stateLbl: "Pendiente", tagCls: screenStyles.badgeDemo, ask: false, canCancel: true, yes: () => {}, no: () => {}, cancel: () => {}}, {title: "Reporte: calles anegadas en Campoy", kind: "Emergencia", stateLbl: "Pendiente", tagCls: screenStyles.badgeDemo, ask: false, canCancel: true, yes: () => {}, no: () => {}, cancel: () => {}}];
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
    <div className="m-0 bg-white text-(--color-ink) font-[Nunito,system-ui,sans-serif] text-[17px] leading-[1.4] [&_h1]:font-[Nunito,system-ui,sans-serif] [&_h1]:m-0 [&_h1]:leading-[1.15] [&_h1]:tracking-[-.01em] [&_h2]:font-[Nunito,system-ui,sans-serif] [&_h2]:m-0 [&_h2]:leading-[1.15] [&_h2]:tracking-[-.01em] [&_h3]:font-[Nunito,system-ui,sans-serif] [&_h3]:m-0 [&_h3]:leading-[1.15] [&_h3]:tracking-[-.01em] [&_h4]:font-[Nunito,system-ui,sans-serif] [&_h4]:m-0 [&_h4]:leading-[1.15] [&_h4]:tracking-[-.01em] [&_.t]:font-[Nunito,system-ui,sans-serif] [&_.t]:m-0 [&_.t]:leading-[1.15] [&_.t]:tracking-[-.01em] [&_p]:m-0 [&_button]:cursor-pointer [&_:focus-visible]:outline-3 [&_:focus-visible]:outline-(--color-ink) [&_:focus-visible]:outline-offset-2 [&_textarea.in]:px-3.5 [&_textarea.in]:py-3 [&_textarea.in]:min-h-21 [&_textarea.in]:resize-none">
      <div className={screenStyles.frame}>
      
      {nav.is("zonas") && (<><div className={screenStyles.header}><button className={screenStyles.iconButton} aria-label="Volver" onClick={nav.back}><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Mis zonas sin conexión</h1></div></>)}
      {nav.is("pend") && (<><div className={screenStyles.header}><button className={screenStyles.iconButton} aria-label="Volver" onClick={nav.back}><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Pendientes de envío</h1></div></>)}
      {nav.is("sms") && (<><div className={screenStyles.header}><button className={screenStyles.iconButton} aria-label="Volver" onClick={nav.back}><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Consulta por SMS</h1></div></>)}
      {nav.is("consulta") && (<><div className={screenStyles.header}><button className={screenStyles.iconButton} aria-label="Volver" onClick={nav.back}><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Consulta {cid}</h1></div></>)}
      
      <div className="flex gap-2 pt-0 px-4 pb-2 items-center flex-none [&_span]:text-[14px] [&_span]:text-(--color-muted) [&_span]:font-bold [&_span]:whitespace-nowrap [&_.chip]:min-h-10 [&_.chip]:px-3 [&_.chip]:py-0" role="group" aria-label="Conexi\u00f3n del dispositivo"><span>Conexión:</span><button className={cOn} onClick={goOnline}>En línea</button><button className={cOff} onClick={goOffline}>Sin conexión</button></div>
      {offline && (<><div className="mt-0 mx-4 mb-2 bg-[#fff4d6] text-[#5c3d00] border border-[#e6c77a] rounded-[14px] px-3 py-2 text-[14px] font-bold flex-none" role="status">Sin conexión. Verás lo descargado con su hora. No hay mensajes ni noticias nuevas.</div></>)}
      
      {nav.is("zonas") && (<>
      <div className={screenStyles.content}>
        <div className={screenStyles.card}><div className={screenStyles.row}><b className={screenStyles.grow}>Campoy · San Juan de Lurigancho</b><span className={screenStyles.badgeFavor}>{zoneTag}</span></div>
          <p className={screenStyles.muted}>{zoneInfo}</p>
          {dlRun && (<><div className="h-3 rounded-[6px] bg-(--color-line) overflow-hidden [&_i]:block [&_i]:h-full [&_i]:bg-[#2f5a2d]" role="progressbar" aria-valuenow={`${pct ?? ""}`} aria-valuemin="0" aria-valuemax="100" aria-label="Descarga"><i></i></div><p className={screenStyles.muted} role="status">Descargando… {pct} %</p></>)}
          {dlFail && (<><p className={screenStyles.error} role="alert">No se pudo completar la descarga. Conservamos tu versión anterior.</p></>)}
          <div className={`${screenStyles.row} flex-wrap!`}><button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-(--color-brand) text-white font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 flex-1! min-h-12!" onClick={startDl}>{dlLbl}</button><button className="min-h-13 rounded-[18px] border-2 border-(--color-line) bg-white text-(--color-ink) font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 flex-1! min-h-12!" onClick={delZone}>Eliminar</button></div>
          <div className={screenStyles.checkboxRow}><input id="fl" type="checkbox" {...failMode.props} /><label htmlFor="fl"><span className={screenStyles.muted}>Simular que la descarga falla</span></label></div>
          {delWarn && (<><p className={screenStyles.error} role="alert">Tienes 2 envíos pendientes. Eliminar la zona no los borra; se enviarán cuando haya conexión.</p></>)}
          <p className={screenStyles.muted}>Incluye mapa de demostración, incidencias con hora, calor de instantánea, contactos oficiales y orientación. Se guarda en el dispositivo (IndexedDB y caché), no solo en memoria.</p></div>
        <div className={screenStyles.card}><div className={screenStyles.row}><b className={screenStyles.grow}>Calca Centro</b><span className={screenStyles.badge}>No descargada</span></div><p className={screenStyles.muted}>Fuera de la zona descargada verías un aviso y la lista de reportes como alternativa.</p><button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-white text-(--color-brand) font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 min-h-12!">Guardar zona</button></div>
        <div className={screenStyles.card}><p className={screenStyles.label}>Espacio</p><div className="h-3 rounded-[6px] bg-(--color-line) overflow-hidden [&_i]:block [&_i]:h-full [&_i]:bg-[#2f5a2d]" aria-hidden="true"><i className="w-[18%]!"></i></div><p className={screenStyles.muted}>Usado por BarrioConecta: 48 MB · Espacio libre suficiente</p></div>
        <button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-(--color-brand) text-white font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50" onClick={() => nav.go("pend")}>Pendientes de envío ({pendCount})</button>
        <button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-white text-(--color-brand) font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50" onClick={() => nav.go("sms")}>Consulta por SMS</button>
      </div>
      </>)}
      
      {nav.is("pend") && (<>
      <div className={screenStyles.content}>
        {(queue ?? []).map((q, __i1) => (<Fragment key={__i1}>
          <div className={screenStyles.card}><div className={screenStyles.row}><span className={q.tagCls}>{q.stateLbl}</span><span className="flex-1 min-w-0 text-(--color-muted) text-[15px] text-right!">{q.kind}</span></div><b>{q.title}</b>
            {q.ask && (<><p className={screenStyles.muted}>Antes de enviar: ¿esta emergencia sigue vigente?</p><div className="grid-cols-2 grid! gap-2!"><button className="min-h-13 rounded-[18px] border-2 border-(--color-line) bg-white text-(--color-ink) font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 min-h-12!" onClick={q.no}>Ya no</button><button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-(--color-brand) text-white font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 min-h-12!" onClick={q.yes}>Sigue vigente</button></div></>)}
            {q.canCancel && (<><button className="min-h-13 rounded-[18px] border-2 border-(--color-line) bg-white text-(--color-ink) font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 min-h-11!" onClick={q.cancel}>Cancelar envío</button></>)}</div>
        </Fragment>))}
        {msg && (<><p className={msgCls} role="status">{msgTxt}</p></>)}
        <button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-(--color-brand) text-white font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50" onClick={sync}>Sincronizar ahora</button>
        <p className={screenStyles.muted}>Cada envío tiene un identificador único: reintentar no duplica ni revive reportes cerrados.</p>
      </div>
      </>)}
      
      {nav.is("sms") && (<>
      <div className={screenStyles.content}>
        <span className={screenStyles.badgeDemo}>Teléfono y central estatal simulados</span>
        <div className={screenStyles.card} role="note"><p className={screenStyles.muted}>Esto simula a una persona <b>sin datos móviles</b> que solo tiene SMS. No es lo mismo que perder la conexión del dispositivo. Una PWA no puede leer tu bandeja de SMS: en la vida real el mensaje llega a tu app de mensajes.</p></div>
        <div className={screenStyles.field}><p className={screenStyles.label}>¿Qué necesitas?</p><div className={screenStyles.wrap}>{(kinds ?? []).map((k, __i1) => (<Fragment key={__i1}><button className={k.cls} onClick={k.pick}>{k.name}</button></Fragment>))}</div></div>
        <div className={screenStyles.field}><label htmlFor="q">Tu pregunta</label><textarea id="q" className="min-h-21 border-[1.5px] border-[#cfc7bf] rounded-[16px] px-3.5 py-3 bg-white w-full resize-none" placeholder="Ejemplo: \u00bfd\u00f3nde recojo agua?" {...question.props}></textarea></div>
        <div className={screenStyles.field}><label htmlFor="z">Localidad (opcional)</label><input id="z" className={screenStyles.input} placeholder="Ejemplo: Campoy" {...zone.props} /></div>
        <button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-(--color-brand) text-white font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50" onClick={sendSms}>Enviar SMS (simulado)</button>
        {hasConsulta && (<><button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-white text-(--color-brand) font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50" onClick={() => nav.go("consulta")}>Ver mi consulta {cid}</button></>)}
      </div>
      </>)}
      
      {nav.is("consulta") && (<>
      <div className={screenStyles.content} role="log" aria-live="polite">
        <div className={screenStyles.row}><span className={screenStyles.badgeDemo}>SMS simulado</span><span className={screenStyles.badge}>{cstatus}</span></div>
        <span className={screenStyles.badgeAlert}>Consulta privada · no se publica</span>
        {(msgs ?? []).map((m, __i1) => (<Fragment key={__i1}><div className={m.cls}><b>{m.who} · {m.time}</b>{m.t}</div></Fragment>))}
        {needZone && (<><div className={screenStyles.field}><label htmlFor="rz">Tu respuesta</label><input id="rz" className={screenStyles.input} placeholder="Ejemplo: Campoy" {...reply.props} /></div><button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-(--color-brand) text-white font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50" onClick={sendReply}>Responder por SMS</button></>)}
        <button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-white text-(--color-brand) font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50" onClick={reconnect}>Simular que recupero la conexión</button>
        {synced && (<><p className={screenStyles.success} role="status">✓ Esta consulta ya aparece en Emergencias › Mis consultas con el mismo ID y tu celular vinculado.</p></>)}
        <p className={screenStyles.muted}>Respuestas de ejemplo con guías controladas; no se usa IA real ni se inventan suministros, rutas seguras ni despachos.</p>
      </div>
      </>)}
      
      <nav className={screenStyles.navigation} aria-label="Principal">
        <a href="/inicio"><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" /></svg>Inicio</a>
        <a href="/mapa"><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>Mapa</a>
        <a href="/perfil"><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>Mi perfil</a>
      </nav>
      </div>
    </div>
  );
}
