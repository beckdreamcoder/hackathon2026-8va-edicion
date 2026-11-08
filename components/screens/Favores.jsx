"use client";

import { useViewStack } from "@/lib/hooks/use-view-stack";

import { useTextInput } from "@/lib/hooks/use-text-input";

import { Fragment } from "react";
import { screenStyles } from "./screen-styles";

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
  const chipL = "min-h-11 rounded-full border-[1.5px] border-[#cfc7bf] bg-white px-3.5 py-0 font-bold text-[15px] whitespace-nowrap chip";
  const chipM = "min-h-11 rounded-full border-[1.5px] border-(--color-brand) bg-(--color-brand) px-3.5 py-0 font-bold text-[15px] whitespace-nowrap text-white chip";
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
  const otherAv = "w-11 h-11 rounded-[50%] grid place-items-center font-extrabold font-[Nunito,system-ui,sans-serif] text-[18px] flex-none bg-[#ddf0f2] text-[#14505a]";
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
  const tabNec = "min-h-11 rounded-full border-[1.5px] border-(--color-brand) bg-(--color-brand) px-3.5 py-0 font-bold text-[15px] whitespace-nowrap text-white chip";
  const tabOfr = "min-h-11 rounded-full border-[1.5px] border-[#cfc7bf] bg-white px-3.5 py-0 font-bold text-[15px] whitespace-nowrap chip";
  const unreadN = 0;
  const wasRejected = false;
  return (
    <div className={screenStyles.screen}>
      <div className="w-97.5 h-211 flex flex-col bg-white overflow-hidden relative!">
      
      {nav.is("muro") && (<>
      <div className={screenStyles.header}><button className={screenStyles.iconButton} aria-label="Volver" onClick={nav.back}><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Favores</h1><button className={screenStyles.iconButton} aria-label="Mis coordinaciones" onClick={() => nav.go("coords")}><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z" /></svg>{hasUnread && (<><span className="min-w-5.5 h-5.5 rounded-[11px] bg-(--color-brand) text-white text-[13px] font-bold grid place-items-center px-1.5 py-0 absolute! mt-[-26px]! mr-[-28px]! mb-0! ml-0!">{unreadN}</span></>)}</button></div>
      </>)}
      {nav.is("detalle") && (<>
      <div className={screenStyles.header}><button className={screenStyles.iconButton} aria-label="Volver" onClick={nav.back}><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Detalle del favor</h1></div>
      </>)}
      {nav.is("solicitudes") && (<>
      <div className={screenStyles.header}><button className={screenStyles.iconButton} aria-label="Volver" onClick={nav.back}><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Solicitudes recibidas</h1></div>
      </>)}
      {nav.is("coords") && (<>
      <div className={screenStyles.header}><button className={screenStyles.iconButton} aria-label="Volver" onClick={nav.back}><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Mis coordinaciones</h1></div>
      </>)}
      {nav.is("chat") && (<>
      <div className={screenStyles.header}><button className={screenStyles.iconButton} aria-label="Volver" onClick={nav.back}><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><span className={otherAv} aria-hidden="true">{otherIni}</span><div className={screenStyles.grow}><h1 className="text-[19px]!">{otherName}</h1><p className={screenStyles.muted}>Escalera de 3 metros</p></div><button className={screenStyles.iconButton} aria-label="M\u00e1s opciones" onClick={openRep}><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="5" r="1" /><circle cx="12" cy="12" r="1" /><circle cx="12" cy="19" r="1" /></svg></button></div>
      </>)}
      
      <div className="flex gap-2 pt-0 px-4 pb-2 items-center flex-none [&_span]:text-[14px] [&_span]:text-(--color-muted) [&_span]:font-bold [&_span]:whitespace-nowrap [&_.chip]:min-h-10 [&_.chip]:px-3 [&_.chip]:py-0" role="group" aria-label="Probar como">
        <span>Probar como:</span><button className={chipM} onClick={asM}>María (solicita)</button><button className={chipL} onClick={asL}>Luis (ofrece)</button>
      </div>
      
      {nav.is("muro") && (<>
      <div className={screenStyles.content}>
        <div className={screenStyles.wrap}><button className={tabNec} onClick={setNec}>Necesito ayuda</button><button className={tabOfr} onClick={setOfr}>Ofrezco ayuda</button></div>
        <div className="flex gap-2 overflow-x-auto pb-0.5" role="group" aria-label="Categor\u00eda"><button className="min-h-11 rounded-full border-[1.5px] border-(--color-brand) bg-(--color-brand) px-3.5 py-0 font-bold text-[15px] whitespace-nowrap text-white chip">Todos</button><button className="min-h-11 rounded-full border-[1.5px] border-[#cfc7bf] bg-white px-3.5 py-0 font-bold text-[15px] whitespace-nowrap chip">Herramientas</button><button className="min-h-11 rounded-full border-[1.5px] border-[#cfc7bf] bg-white px-3.5 py-0 font-bold text-[15px] whitespace-nowrap chip">Habilidades</button><button className="min-h-11 rounded-full border-[1.5px] border-[#cfc7bf] bg-white px-3.5 py-0 font-bold text-[15px] whitespace-nowrap chip">Ayuda temporal</button><button className="min-h-11 rounded-full border-[1.5px] border-[#cfc7bf] bg-white px-3.5 py-0 font-bold text-[15px] whitespace-nowrap chip">Movilidad</button></div>
        {tabIsNec && (<>
          <button className={screenStyles.card} onClick={() => nav.go("detalle")}><div className={screenStyles.row}><span className={screenStyles.badgeFavor}>Gratis</span><span className={screenStyles.badge}>{statusTxt}</span><span className="flex-1 min-w-0 text-(--color-muted) text-[15px] text-right!">a 300 m</span></div><h3 className="text-[19px]!">Necesito una escalera de 3 metros prestada</h3><p className={screenStyles.muted}>Herramientas · Campoy Sector 2 · Disponible hoy por la tarde</p><div className={screenStyles.row}><span className="w-8 h-8 rounded-[50%] grid place-items-center font-extrabold font-[Nunito,system-ui,sans-serif] text-[18px] flex-none bg-[#f4d9c6] text-[#8a2b07] text-[14px]!" aria-hidden="true">M</span><span className={screenStyles.muted}>María</span></div></button>
          <div className={screenStyles.card}><div className={screenStyles.row}><span className={screenStyles.badgeFavor}>Gratis</span><span className={screenStyles.badgeDemo}>Ejemplo</span></div><h3 className="text-[19px]!">Alguien que me enseñe a usar WhatsApp</h3><p className={screenStyles.muted}>Habilidades · Campoy Sector 4 · Esta semana</p></div>
        </>)}
        {tabIsOfr && (<>
          <div className={screenStyles.card}><div className={screenStyles.row}><span className={screenStyles.badgeFavor}>Gratis</span><span className={screenStyles.badgeDemo}>Ejemplo</span></div><h3 className="text-[19px]!">Ayudo con trámites digitales a adultos mayores</h3><p className={screenStyles.muted}>Habilidades · Rosa · Sábados por la mañana</p></div>
          <div className={screenStyles.card}><div className={screenStyles.row}><span className={screenStyles.badgeFavor}>Gratis</span><span className={screenStyles.badgeDemo}>Ejemplo</span></div><h3 className="text-[19px]!">Presto herramientas de jardinería</h3><p className={screenStyles.muted}>Herramientas · Luis · Fines de semana</p></div>
        </>)}
        <a className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-(--color-brand) text-white font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed" href="/publicar"><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>Publicar un favor</a>
      </div>
      </>)}
      
      {nav.is("detalle") && (<>
      <div className={screenStyles.content}>
        <div className={screenStyles.card}><div className={screenStyles.row}><span className={screenStyles.badgeFavor}>Gratis</span><span className={screenStyles.badge}>{statusTxt}</span></div><h2 className="text-[24px]!">Necesito una escalera de 3 metros prestada</h2><p>Voy a pintar el frente de mi casa el sábado. La devuelvo el mismo día, limpia.</p><p className={screenStyles.muted}>Herramientas · Campoy Sector 2 (zona aproximada) · Disponible hoy por la tarde</p></div>
        <div className={screenStyles.card}><div className={screenStyles.row}><span className="w-11 h-11 rounded-[50%] grid place-items-center font-extrabold font-[Nunito,system-ui,sans-serif] text-[18px] flex-none bg-[#f4d9c6] text-[#8a2b07]" aria-hidden="true">M</span><div className={screenStyles.grow}><b>María</b><p className={screenStyles.muted}>Vecina nueva · sin referencias aún</p></div></div><p className={screenStyles.muted}>Sin dinero ni obligación de devolver el favor.</p></div>
        {canOffer && (<><button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-(--color-brand) text-white font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed" onClick={offer}>Ofrecer ayuda</button></>)}
        {offerSent && (<><div className={screenStyles.card} role="status"><p className={screenStyles.success}>✓ Tu oferta fue enviada</p><p className={screenStyles.muted}>María debe aceptar para que se abra el chat. Cambia a «María» arriba para probarlo.</p></div></>)}
        {isAuthorView && (<><button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-(--color-brand) text-white font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => nav.go("solicitudes")}>Ver solicitudes recibidas</button></>)}
        {goChat && (<><button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-(--color-brand) text-white font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => nav.go("chat")}>Abrir chat</button></>)}
        {wasRejected && (<><div className={screenStyles.card} role="status"><p className="font-bold!">Esta solicitud no fue aceptada</p><p className={screenStyles.muted}>Puedes buscar otro favor cercano.</p></div></>)}
      </div>
      </>)}
      
      {nav.is("solicitudes") && (<>
      <div className={screenStyles.content}>
        {solPending && (<>
          <div className={screenStyles.card}><div className={screenStyles.row}><span className="w-11 h-11 rounded-[50%] grid place-items-center font-extrabold font-[Nunito,system-ui,sans-serif] text-[18px] flex-none bg-[#ddf0f2] text-[#14505a]" aria-hidden="true">L</span><div className={screenStyles.grow}><b>Luis quiere ayudarte</b><p className={screenStyles.muted}>Vecino con 4 referencias · Campoy Sector 3</p></div></div><p className={screenStyles.muted}>Para: «Necesito una escalera de 3 metros prestada»</p>
            <div className="grid-cols-2 grid! gap-2!"><button className="min-h-13 rounded-[18px] border-2 border-(--color-line) bg-white text-(--color-ink) font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed min-h-12!" onClick={reject}>Rechazar</button><button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-(--color-brand) text-white font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed min-h-12!" onClick={accept}>Aceptar</button></div>
            <p className={screenStyles.muted}>Al aceptar, ambos aceptan y se abre un chat temporal.</p></div>
          <p className={screenStyles.muted}>Otras personas que se postulen se guardan sin abrir chat privado.</p>
        </>)}
        {solNone && (<><div className={screenStyles.card} role="status"><p className="font-bold!">{solNoneTxt}</p><p className={screenStyles.muted}>Cuando alguien ofrezca ayuda, aparecerá aquí.</p></div></>)}
        {solDone && (<><div className={screenStyles.card} role="status"><p className={screenStyles.success}>{solDoneTxt}</p></div><button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-(--color-brand) text-white font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => nav.go("coords")}>Ir a mis coordinaciones</button></>)}
      </div>
      </>)}
      
      {nav.is("coords") && (<>
      <div className={screenStyles.content}>
        <div className={screenStyles.wrap}><button className="min-h-11 rounded-full border-[1.5px] border-(--color-brand) bg-(--color-brand) px-3.5 py-0 font-bold text-[15px] whitespace-nowrap text-white chip">Activas</button><button className="min-h-11 rounded-full border-[1.5px] border-[#cfc7bf] bg-white px-3.5 py-0 font-bold text-[15px] whitespace-nowrap chip">Cerradas</button></div>
        {hasCoord && (<>
          <button className={screenStyles.card} onClick={openCoord}><div className={screenStyles.row}><span className={otherAv} aria-hidden="true">{otherIni}</span><div className={screenStyles.grow}><b>{otherName}</b><p className={screenStyles.muted}>Escalera de 3 metros · Favor</p></div>{myUnread && (<><span className="min-w-5.5 h-5.5 rounded-[11px] bg-(--color-brand) text-white text-[13px] font-bold grid place-items-center px-1.5 py-0" aria-label="mensajes sin leer">{myUnreadN}</span></>)}</div><div className={screenStyles.row}><span className={screenStyles.badge}>{statusTxt}</span></div><p className="font-bold! text-[#9e0c24]!">Próximo paso: {nextStep}</p></button>
        </>)}
        {noCoord && (<><div className={screenStyles.card} role="status"><p className="font-bold!">Aún no tienes coordinaciones</p><p className={screenStyles.muted}>Se crean cuando ambas personas aceptan. Mientras tanto no hay chat privado.</p></div></>)}
        {isAuthorPending && (<><button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-white text-(--color-brand) font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => nav.go("solicitudes")}>Tienes 1 solicitud nueva</button></>)}
      </div>
      </>)}
      
      {nav.is("chat") && (<>
      <div className="pt-0! px-4! pb-2! flex-none!"><div className={`${screenStyles.card} px-3.5! py-2.5! flex-row! items-center! gap-2.5!`}><span className={screenStyles.badge}>{statusTxt}</span><p className="flex-1 min-w-0 text-(--color-muted) text-[15px] font-bold!">Siguiente: {nextStep}</p></div></div>
      <div className={`${screenStyles.content} gap-2.5!`} role="log" aria-live="polite">
        {(msgs ?? []).map((m, __i1) => (<Fragment key={__i1}><div className={m.cls}><b>{m.who}</b>{m.text}</div></Fragment>))}
      </div>
      {chatOpen && (<>
      <div className="border-t border-t-(--color-line) pt-2! px-4! pb-2! flex! flex-col! gap-2! bg-white! flex-none!">
        <div className="flex gap-2 overflow-x-auto pb-0.5">{(quick ?? []).map((q, __i1) => (<Fragment key={__i1}><button className="min-h-11 rounded-full border-[1.5px] border-[#cfc7bf] bg-white px-3.5 py-0 font-bold text-[15px] whitespace-nowrap chip" onClick={q.pick}>{q.t}</button></Fragment>))}</div>
        <div className={screenStyles.row}><label htmlFor="msg" className="absolute left-[-9999px]!">Mensaje</label><input id="msg" className={screenStyles.input} placeholder="Escribe un mensaje" {...draft.props} /><button className="w-12 h-12 grid place-items-center border-0 bg-(--color-brand) rounded-[16px] text-(--color-ink) text-white! rounded-[16px]!" aria-label="Enviar" onClick={send}><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l16-8-6 16-3-7z" /></svg></button></div>
        <div className="grid-cols-2 grid! gap-2!"><button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-white text-(--color-brand) font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed min-h-12!" onClick={openCierre}>Completar favor</button><button className="min-h-13 rounded-[18px] border-2 border-(--color-line) bg-white text-(--color-ink) font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed min-h-12!" onClick={doCancel}>Cancelar</button></div>
      </div>
      </>)}
      {chatClosed && (<>
      <div className="border-t border-t-(--color-line) px-4! py-3! bg-white! flex! flex-col! gap-2! flex-none!"><p className={screenStyles.muted} role="status">Chat en solo lectura por 30 días de demostración. El acuerdo y los estados se conservan.</p>{canSello && (<><button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-(--color-brand) text-white font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed" onClick={openCierre}>Agradecer y dar sello</button></>)}</div>
      </>)}
      </>)}
      
      {sheetCierre && (<>
      <div className={screenStyles.scrim} aria-hidden="true"></div>
      <div className="absolute left-0 right-0 bottom-0 bg-white rounded-[24px_24px_0_0] border-t border-t-(--color-line) shadow-[0_-8px_24px_rgba(32,33,36,.15)] pt-5 px-4 pb-5 flex flex-col gap-3 z-5" role="dialog" aria-label="Cierre del favor">
        <h2 className="text-[22px]!">{cierreTitle}</h2>
        {cierrePend && (<>
          <p className={screenStyles.muted}>El favor se completa cuando ambas personas confirman.</p>
          <p>María: <b>{confM}</b> · Luis: <b>{confL}</b></p>
          {meNotConf && (<><button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-(--color-brand) text-white font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed" onClick={confirmClose}>Confirmar que se completó</button></>)}
          {meConf && (<><p className={screenStyles.success} role="status">Esperando confirmación de la otra persona. Cambia de perfil arriba para confirmar.</p></>)}
        </>)}
        {cierreDone && (<>
          <p className={screenStyles.success} role="status">✓ Favor completado por ambas personas</p>
          <p className={screenStyles.muted}>Puedes agradecer con un sello de Visto Bueno Vecinal. Es opcional y se emite una sola vez por favor.</p>
          {canSello && (<><button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-(--color-brand) text-white font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed" onClick={giveSello}>Dar sello a {otherName}</button></>)}
          {selloGiven && (<><p className={screenStyles.success} role="status">✓ Sello emitido. No se puede repetir.</p><a className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-white text-(--color-brand) font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed" href="/noticias">Ver Vecino del mes</a></>)}
        </>)}
        <button className="min-h-13 rounded-[18px] border-2 border-(--color-line) bg-white text-(--color-ink) font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed" onClick={closeSheet}>Cerrar</button>
      </div>
      </>)}
      
      {sheetRep && (<>
      <div className={screenStyles.scrim} aria-hidden="true"></div>
      <div className="absolute left-0 right-0 bottom-0 bg-white rounded-[24px_24px_0_0] border-t border-t-(--color-line) shadow-[0_-8px_24px_rgba(32,33,36,.15)] pt-5 px-4 pb-5 flex flex-col gap-3 z-5" role="dialog" aria-label="Reportar o bloquear">
        <h2 className="text-[22px]!">Reportar o bloquear</h2>
        {repOpen && (<>
          <div className={screenStyles.wrap}><button className="min-h-11 rounded-full border-[1.5px] border-[#cfc7bf] bg-white px-3.5 py-0 font-bold text-[15px] whitespace-nowrap chip">Mensajes molestos</button><button className="min-h-11 rounded-full border-[1.5px] border-[#cfc7bf] bg-white px-3.5 py-0 font-bold text-[15px] whitespace-nowrap chip">No cumplió</button><button className="min-h-11 rounded-full border-[1.5px] border-[#cfc7bf] bg-white px-3.5 py-0 font-bold text-[15px] whitespace-nowrap chip">Otro motivo</button></div>
          <p className={screenStyles.muted}>Reportar no borra pruebas ni avisa automáticamente a autoridades. Si hay una coordinación activa, podrás cerrarla o cancelarla; el acuerdo se conserva.</p>
          <button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-(--color-brand) text-white font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed" onClick={doRep}>Confirmar reporte</button>
        </>)}
        {repDone && (<><p className={screenStyles.success} role="status">✓ Reporte guardado en la demostración.</p></>)}
        <button className="min-h-13 rounded-[18px] border-2 border-(--color-line) bg-white text-(--color-ink) font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed" onClick={closeSheet}>Cerrar</button>
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
