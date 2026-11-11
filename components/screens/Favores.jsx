"use client";

import { useViewStack } from "@/lib/hooks/use-view-stack";

import { useTextInput } from "@/lib/hooks/use-text-input";

import { Fragment, useEffect, useState } from "react";
import { useDemoState } from "@/lib/demo/store";
import { VECINOS, chip, avisar, logEvento, emitirSello } from "@/lib/demo/shared";
import { usePublicaciones } from "@/lib/demo/publicaciones";
import { useBloqueos, registrarLegado, cambiarUsuarioDemo } from "@/lib/demo/coordinaciones";
import Link from "next/link";
import { PostCard } from "./post-card";

const FAVOR_INICIAL = { actor: "maria", tab: "nec", stage: "open", coordId: "", conf: [], sellos: [], msgs: [], read: {} };
const AVATAR = "w-11 h-11 rounded-[50%] grid place-items-center font-extrabold font-[Nunito,system-ui,sans-serif] text-[18px] flex-none bg-[#ddf0f2] text-[#14505a]";
const BUBBLE_ME = "self-end max-w-[82%] rounded-[18px] rounded-br-[6px] bg-(--color-brand) text-white px-3.5 py-2 flex flex-col gap-0.5 [&_b]:text-[13px] [&_b]:opacity-90";
const BUBBLE_OTHER = "self-start max-w-[82%] rounded-[18px] rounded-bl-[6px] bg-[#f1ece6] text-(--color-ink) px-3.5 py-2 flex flex-col gap-0.5 [&_b]:text-[13px] [&_b]:text-(--color-muted)";
const QUICK = ["¿A qué hora puedes?", "Estoy en camino", "Necesito reprogramar"];
import { screenStyles } from "./screen-styles";

/**
 * Pantalla Favores del prototipo BarrioConecta.
 * Los valores de demostración sustituyen a la lógica del prototipo (DCLogic), que no se migró.
 */
export default function Favores() {
  const nav = useViewStack("muro");
  const [pubs] = usePublicaciones();
  const draft = useTextInput("");
  const [f, setF] = useDemoState("favor-escalera", FAVOR_INICIAL);
  // Enlace directo a una pestaña (`?tab=`), p. ej. al terminar de publicar
  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("tab");
    if (!(t === "nec" || t === "ofr")) return;
    const id = setTimeout(() => setF({ tab: t }), 0);
    return () => clearTimeout(id);
  }, [setF]);
  const actor = f.actor;
  const other = actor === "maria" ? "luis" : "maria";
  const otherName = VECINOS[other].name;
  const otherIni = VECINOS[other].ini;
  const otherAv = AVATAR;

  const [bl] = useBloqueos();
  const bloq = bl.items.some((x) => (x.by === "maria" && x.target === "luis") || (x.by === "luis" && x.target === "maria"));
  const asM = () => cambiarUsuarioDemo("maria");
  const asL = () => cambiarUsuarioDemo("luis");
  useEffect(() => {
    if (!f.coordId) return;
    registrarLegado({ id: f.coordId, tipo: "favor", titulo: "Escalera de 3 metros", solicitante: "luis", receptor: "maria", href: "/favores",
      estado: f.stage === "completed" ? "completada" : f.stage === "cancelled" ? "cancelada" : "aceptada" });
  }, [f.coordId, f.stage]);
  const chipM = chip(actor === "maria");
  const chipL = chip(actor === "luis");
  const tabIsNec = f.tab === "nec";
  const tabIsOfr = f.tab === "ofr";
  const tabNec = chip(tabIsNec);
  const tabOfr = chip(tabIsOfr);
  const setNec = () => setF({ tab: "nec" });
  const setOfr = () => setF({ tab: "ofr" });

  const enCoord = f.stage === "accepted";
  const completed = f.stage === "completed";
  const cancelled = f.stage === "cancelled";
  const hasCoordStage = enCoord || completed || cancelled;
  const confirmedBy = (who) => f.conf.includes(who);
  const statusTxt =
    f.stage === "open" ? "Abierta"
    : f.stage === "offered" ? "Solicitud enviada"
    : f.stage === "rejected" ? "Abierta"
    : enCoord ? (f.conf.length ? "Esperando confirmación" : "En coordinación")
    : completed ? "Completada" : "Cancelada";

  const canOffer = actor === "luis" && f.stage === "open";
  const offerSent = actor === "luis" && f.stage === "offered";
  const isAuthorView = actor === "maria" && ["open", "offered", "rejected"].includes(f.stage);
  const goChat = hasCoordStage;
  const wasRejected = actor === "luis" && f.stage === "rejected";
  const solPending = f.stage === "offered";
  const solNone = f.stage === "open";
  const solNoneTxt = "No tienes solicitudes nuevas";
  const solDone = f.stage === "rejected" || hasCoordStage;
  const solDoneTxt = f.stage === "rejected" ? "Rechazaste esta solicitud." : "✓ Aceptaste a Luis. Se abrió el chat temporal.";
  const hasCoord = hasCoordStage;
  const noCoord = !hasCoordStage;
  const isAuthorPending = actor === "maria" && f.stage === "offered";

  const lastRead = f.read[actor] ?? 0;
  const unreadN = f.msgs.slice(lastRead).filter((m) => m.from !== actor).length;
  const hasUnread = unreadN > 0;
  const myUnread = hasUnread;
  const myUnreadN = unreadN;

  const nextStep =
    enCoord && confirmedBy(actor) ? `Esperando que ${otherName} confirme`
    : enCoord && f.conf.length ? "Confirma que el favor se completó"
    : enCoord ? "Coordinen el encuentro"
    : completed ? (f.sellos.includes(actor) ? "Favor cerrado" : `Agradece a ${otherName} con un sello`)
    : cancelled ? "Coordinación cancelada" : "Esperando aceptación";

  const msgs = f.msgs.map((m) => ({ cls: m.from === actor ? BUBBLE_ME : BUBBLE_OTHER, who: VECINOS[m.from].name, text: m.text }));
  const chatOpen = enCoord;
  const chatClosed = completed || cancelled;
  const quick = QUICK.map((t) => ({ t, pick: () => draft.setValue(t) }));

  useEffect(() => {
    if (nav.current === "chat" && f.msgs.length !== (f.read[actor] ?? 0)) setF((p) => ({ read: { ...p.read, [actor]: p.msgs.length } }));
  }, [nav.current, f.msgs.length, f.read, actor, setF]);

  const offer = () => {
    if (f.stage !== "open" || bloq) return;
    setF({ stage: "offered" });
    avisar({ categoria: "favor", titulo: "Luis quiere ayudarte", texto: "Se ofreció para la escalera de 3 metros.", href: "/favores" });
    logEvento("Luis ofreció ayuda en «Escalera de 3 metros»");
  };
  const accept = () => {
    if (f.stage !== "offered" || bloq) return; // evita aceptar dos veces por reintento
    setF({ stage: "accepted", coordId: `fav-${Date.now()}`, conf: [], sellos: [], msgs: [{ from: "maria", text: "¡Gracias por ofrecerte! ¿Puedes traerla el sábado temprano?" }] });
    avisar({ categoria: "favor", titulo: "María aceptó tu ayuda", texto: "Ya pueden coordinar por chat.", href: "/favores" });
    logEvento("María aceptó a Luis · se abrió chat temporal");
  };
  const reject = () => {
    if (f.stage !== "offered") return;
    setF({ stage: "rejected" });
    logEvento("María rechazó la oferta de Luis");
  };
  const send = () => {
    const text = draft.value.trim();
    if (!text || !chatOpen || bloq) return;
    setF((p) => ({ msgs: [...p.msgs, { from: actor, text }], read: { ...p.read, [actor]: p.msgs.length + 1 } }));
    draft.setValue("");
  };
  const openCoord = () => nav.go("chat");
  const [sheet, setSheet] = useState(null);
  const sheetCierre = sheet === "cierre";
  const sheetRep = sheet === "rep";
  const openCierre = () => setSheet("cierre");
  const openRep = () => { setRepDone(false); setSheet("rep"); };
  const closeSheet = () => setSheet(null);
  const cierreTitle = completed ? "Favor completado" : "Completar favor";
  const cierrePend = !completed;
  const cierreDone = completed;
  const confM = confirmedBy("maria") ? "confirmó" : "pendiente";
  const confL = confirmedBy("luis") ? "confirmó" : "pendiente";
  const meConf = confirmedBy(actor);
  const meNotConf = !meConf && enCoord;
  const confirmClose = () => {
    if (!enCoord || confirmedBy(actor)) return;
    const conf = [...f.conf, actor];
    if (conf.length === 2) {
      setF({ conf, stage: "completed" });
      avisar({ categoria: "favor", titulo: "Favor completado", texto: "Ambas personas confirmaron el cierre.", href: "/favores" });
      logEvento("Favor «Escalera» completado por ambas partes");
    } else setF({ conf });
  };
  const selloGiven = f.sellos.includes(actor);
  const canSello = completed && !selloGiven;
  const giveSello = () => {
    const r = emitirSello({ coordId: f.coordId, from: actor, to: other, tipo: "favor" }, completed);
    if (r === "emitido" || r === "duplicado") setF({ sellos: [...new Set([...f.sellos, actor])] });
  };
  const doCancel = () => {
    if (!enCoord) return;
    setF({ stage: "cancelled" });
    logEvento("Coordinación del favor cancelada");
  };
  const [repDone, setRepDone] = useState(false);
  const repOpen = !repDone;
  const doRep = () => { setRepDone(true); logEvento(`Reporte demo sobre ${otherName} (no se avisa a autoridades)`); };
  return (
    <div className={screenStyles.screen}>
      <div className="w-full md:max-w-[46rem] mx-auto h-dvh md:border-x md:border-(--color-line) flex flex-col bg-white overflow-hidden relative!">
      
      {nav.is("muro") && (<>
      <div className={screenStyles.header}><button className={screenStyles.iconButton} aria-label="Volver" onClick={nav.back}><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Favores</h1><Link className={`${screenStyles.iconButton} relative`} aria-label="Mis coordinaciones" href="/coordinaciones"><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z" /></svg>{hasUnread && (<><span className="min-w-5.5 h-5.5 rounded-[11px] bg-(--color-brand) text-white text-[13px] font-bold grid place-items-center px-1.5 py-0 absolute! top-0.5! right-0.5!">{unreadN}</span></>)}</Link></div>
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
      
      <div className="flex gap-2 pt-0 px-4 pb-2 items-center flex-wrap flex-none [&_span]:text-[14px] [&_span]:text-(--color-muted) [&_span]:font-bold [&_span]:whitespace-nowrap [&_.chip]:min-h-10 [&_.chip]:px-3 [&_.chip]:py-0" role="group" aria-label="Probar como">
        <span>Probar como:</span><button className={chipM} onClick={asM}>María (solicita)</button><button className={chipL} onClick={asL}>Luis (ofrece)</button>
      </div>
      {bloq && (<p className="px-4 pb-2 text-[#9e0c24] font-bold text-[14px]" role="alert">Hay un bloqueo entre María y Luis: no pueden enviarse mensajes ni solicitudes.</p>)}
      
      {nav.is("muro") && (<>
      <div className={screenStyles.content}>
        <div className={screenStyles.wrap}><button className={tabNec} onClick={setNec}>Piden ayuda</button><button className={tabOfr} onClick={setOfr}>Ofrecen ayuda</button></div>
        <div className="flex gap-2 overflow-x-auto pb-0.5 shrink-0 [&>*]:shrink-0" role="group" aria-label="Categor\u00eda"><button className="min-h-11 rounded-full border-[1.5px] border-(--color-brand) bg-(--color-brand) px-3.5 py-0 font-bold text-[15px] whitespace-nowrap text-white chip">Todos</button><button className="min-h-11 rounded-full border-[1.5px] border-[#cfc7bf] bg-white px-3.5 py-0 font-bold text-[15px] whitespace-nowrap chip">Herramientas</button><button className="min-h-11 rounded-full border-[1.5px] border-[#cfc7bf] bg-white px-3.5 py-0 font-bold text-[15px] whitespace-nowrap chip">Habilidades</button><button className="min-h-11 rounded-full border-[1.5px] border-[#cfc7bf] bg-white px-3.5 py-0 font-bold text-[15px] whitespace-nowrap chip">Ayuda temporal</button><button className="min-h-11 rounded-full border-[1.5px] border-[#cfc7bf] bg-white px-3.5 py-0 font-bold text-[15px] whitespace-nowrap chip">Movilidad</button></div>
        {tabIsNec && (<>
          {pubs.items.filter((p) => p.tipo === "favor" && p.modo === "pido").map((p) => (<PostCard key={p.id} p={p} />))}
          <button className={screenStyles.card} onClick={() => nav.go("detalle")}><div className={screenStyles.row}><span className={screenStyles.badgeFavor}>Gratis</span><span className={screenStyles.badge}>{statusTxt}</span><span className="flex-1 min-w-0 text-(--color-muted) text-[15px] text-right!">a 300 m</span></div><h3 className="text-[19px]!">Necesito una escalera de 3 metros prestada</h3><p className={screenStyles.muted}>Herramientas · Campoy Sector 2 · Disponible hoy por la tarde</p><div className={screenStyles.row}><span className="w-8 h-8 rounded-[50%] grid place-items-center font-extrabold font-[Nunito,system-ui,sans-serif] text-[18px] flex-none bg-[#f4d9c6] text-[#8a2b07] text-[14px]!" aria-hidden="true">M</span><span className={screenStyles.muted}>María</span></div></button>
          <div className={screenStyles.card}><div className={screenStyles.row}><span className={screenStyles.badgeFavor}>Gratis</span></div><h3 className="text-[19px]!">Alguien que me enseñe a usar WhatsApp</h3><p className={screenStyles.muted}>Habilidades · Campoy Sector 4 · Esta semana</p></div>
        </>)}
        {tabIsOfr && (<>
          {pubs.items.filter((p) => p.tipo === "favor" && p.modo === "ofrezco").map((p) => (<PostCard key={p.id} p={p} />))}
          <div className={screenStyles.card}><div className={screenStyles.row}><span className={screenStyles.badgeFavor}>Gratis</span></div><h3 className="text-[19px]!">Ayudo con trámites digitales a adultos mayores</h3><p className={screenStyles.muted}>Habilidades · Rosa · Sábados por la mañana</p></div>
          <div className={screenStyles.card}><div className={screenStyles.row}><span className={screenStyles.badgeFavor}>Gratis</span></div><h3 className="text-[19px]!">Presto herramientas de jardinería</h3><p className={screenStyles.muted}>Herramientas · Luis · Fines de semana</p></div>
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
        {solDone && (<><div className={screenStyles.card} role="status"><p className={screenStyles.success}>{solDoneTxt}</p></div><button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-(--color-brand) text-white font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => nav.go("coords")}>Ver el chat de este favor</button><Link className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-white text-(--color-brand) font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full" href="/coordinaciones">Ir a mis coordinaciones</Link></>)}
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
      <div className={`${screenStyles.content} gap-2.5! pb-3!`} role="log" aria-live="polite">
        {(msgs ?? []).map((m, __i1) => (<Fragment key={__i1}><div className={m.cls}><b>{m.who}</b>{m.text}</div></Fragment>))}
      </div>
      {chatOpen && (<>
      <div className="border-t border-t-(--color-line) pt-2! px-4! pb-24! flex! flex-col! gap-2! bg-white! flex-none!">
        <div className="flex gap-2 overflow-x-auto pb-0.5">{(quick ?? []).map((q, __i1) => (<Fragment key={__i1}><button className="min-h-11 rounded-full border-[1.5px] border-[#cfc7bf] bg-white px-3.5 py-0 font-bold text-[15px] whitespace-nowrap chip" onClick={q.pick}>{q.t}</button></Fragment>))}</div>
        <div className={screenStyles.row}><label htmlFor="msg" className="absolute left-[-9999px]!">Mensaje</label><input id="msg" className={screenStyles.input} placeholder="Escribe un mensaje" {...draft.props} /><button className="w-12 h-12 grid place-items-center border-0 bg-(--color-brand) rounded-[16px] text-(--color-ink) text-white! rounded-[16px]!" aria-label="Enviar" onClick={send}><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l16-8-6 16-3-7z" /></svg></button></div>
        <div className="grid-cols-2 grid! gap-2!"><button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-white text-(--color-brand) font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed min-h-12!" onClick={openCierre}>Completar favor</button><button className="min-h-13 rounded-[18px] border-2 border-(--color-line) bg-white text-(--color-ink) font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed min-h-12!" onClick={doCancel}>Cancelar</button></div>
      </div>
      </>)}
      {chatClosed && (<>
      <div className="border-t border-t-(--color-line) px-4! pt-3! pb-24! bg-white! flex! flex-col! gap-2! flex-none!"><p className={screenStyles.muted} role="status">Chat en solo lectura por 30 días. El acuerdo y los estados se conservan.</p>{canSello && (<><button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-(--color-brand) text-white font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed" onClick={openCierre}>Agradecer y dar sello</button></>)}</div>
      </>)}
      </>)}
      
      {sheetCierre && (<>
      <div className={screenStyles.scrim} aria-hidden="true"></div>
      <div className="absolute left-0 right-0 bottom-0 bg-white rounded-[24px_24px_0_0] border-t border-t-(--color-line) shadow-[0_-8px_24px_rgba(32,33,36,.15)] pt-5 px-4 pb-5 flex flex-col gap-3 z-40" role="dialog" aria-label="Cierre del favor">
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
      <div className="absolute left-0 right-0 bottom-0 bg-white rounded-[24px_24px_0_0] border-t border-t-(--color-line) shadow-[0_-8px_24px_rgba(32,33,36,.15)] pt-5 px-4 pb-5 flex flex-col gap-3 z-40" role="dialog" aria-label="Reportar o bloquear">
        <h2 className="text-[22px]!">Reportar o bloquear</h2>
        {repOpen && (<>
          <div className={screenStyles.wrap}><button className="min-h-11 rounded-full border-[1.5px] border-[#cfc7bf] bg-white px-3.5 py-0 font-bold text-[15px] whitespace-nowrap chip">Mensajes molestos</button><button className="min-h-11 rounded-full border-[1.5px] border-[#cfc7bf] bg-white px-3.5 py-0 font-bold text-[15px] whitespace-nowrap chip">No cumplió</button><button className="min-h-11 rounded-full border-[1.5px] border-[#cfc7bf] bg-white px-3.5 py-0 font-bold text-[15px] whitespace-nowrap chip">Otro motivo</button></div>
          <p className={screenStyles.muted}>Reportar no borra pruebas ni avisa automáticamente a autoridades. Si hay una coordinación activa, podrás cerrarla o cancelarla; el acuerdo se conserva.</p>
          <button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-(--color-brand) text-white font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed" onClick={doRep}>Confirmar reporte</button>
        </>)}
        {repDone && (<><p className={screenStyles.success} role="status">✓ Reporte enviado. Lo revisaremos.</p></>)}
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
