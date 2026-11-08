"use client";

import { useViewStack } from "@/lib/hooks/use-view-stack";

import { useTextInput } from "@/lib/hooks/use-text-input";

import { useCheckbox } from "@/lib/hooks/use-checkbox";

import { Fragment, useState } from "react";
import { useDemoState } from "@/lib/demo/store";
import { useSesion, chip, avisar, logEvento, emitirSello } from "@/lib/demo/shared";

const MOV_INICIAL = { actor: "maria", tab: "nec", stage: "none", ampliado: false, conf: [], sellos: [], coordId: "", req: { origen: "Campoy", destino: "Hospital de la zona", cuando: "Mañana 9:00 a. m.", plazas: "1 plaza", urgente: false } };
const CUANDO = ["Mañana 9:00 a. m.", "Hoy 4:00 p. m."];
const PLAZAS = ["1 plaza", "2 plazas"];
import { screenStyles } from "./screen-styles";

/**
 * Pantalla Movilidad del prototipo BarrioConecta.
 * Los valores de demostración sustituyen a la lógica del prototipo (DCLogic), que no se migró.
 */
export default function Movilidad() {
  const nav = useViewStack("home");
  const origen = useTextInput("Campoy \u00b7 Sector 2");
  const destino = useTextInput("Hospital de la zona");
  const [m, setM] = useDemoState("movilidad-hospital", MOV_INICIAL);
  const [sesion, setSesion] = useSesion();
  const actor = m.actor;
  const other = actor === "maria" ? "carlos" : "maria";
  const [cuando, setCuando] = useState(CUANDO[0]);
  const [plazas, setPlazas] = useState(PLAZAS[0]);
  const avisos = useCheckbox(true);
  const urg = useCheckbox(false);
  const req = m.req;

  const asM = () => setM({ actor: "maria" });
  const asC = () => setM({ actor: "carlos" });
  const chipM = chip(actor === "maria");
  const chipC = chip(actor === "carlos");
  const tabIsNec = m.tab === "nec";
  const tabIsPaso = m.tab === "paso";
  const tabNec = chip(tabIsNec);
  const tabPaso = chip(tabIsPaso);
  const setNec = () => setM({ tab: "nec" });
  const setPaso = () => setM({ tab: "paso" });

  const st = m.stage;
  const hasReq = st !== "none";
  const noReq = !hasReq;
  const statusTxt = { none: "Sin solicitud", avisada: "Solicitado", oferta: "Oferta recibida", ficha: m.conf.length === 2 ? "Acordado" : "En coordinación", viaje: "En traslado", done: "Completado", cancel: "Cancelado" }[st];
  const b_none = st === "none";
  const b_avisada_m = st === "avisada" && actor === "maria";
  const b_avisada_c = st === "avisada" && actor === "carlos";
  const b_oferta_m = st === "oferta" && actor === "maria";
  const b_oferta_c = st === "oferta" && actor === "carlos";
  const b_ficha = st === "ficha" || st === "viaje";
  const b_done = st === "done";
  const b_cancel = st === "cancel";
  const ampl = m.ampliado;
  const notAmpl = !m.ampliado;

  const sendReq = () => {
    setM({ stage: "avisada", ampliado: false, conf: [], sellos: [], coordId: "", req: { origen: origen.value.trim() || "Campoy", destino: destino.value.trim() || "Hospital de la zona", cuando, plazas, urgente: urg.checked } });
    avisar({ categoria: "junta", titulo: "Traslado prioritario en tu junta", texto: `María necesita llegar a ${destino.value.trim() || "Hospital de la zona"} · ${cuando}.`, href: "/movilidad" });
    logEvento(`Traslado pedido: aviso primero a la junta (Carlos, Rosa, Luis)${urg.checked ? " · marcado urgente: se indicó llamar al 106" : ""}`);
    nav.go("detalle");
  };
  const ampliar = () => { setM({ ampliado: true }); logEvento("María amplió el aviso de traslado a su comunidad"); };
  const offer = () => { if (st === "avisada") { setM({ stage: "oferta" }); logEvento("Carlos ofreció plaza: «Puedo llevarte»"); } };
  const acceptOffer = () => { if (st === "oferta") { setM({ stage: "ficha", conf: [], coordId: `mov-${Date.now()}` }); logEvento("María aceptó a Carlos · ficha de traslado abierta"); } };
  const cM = m.conf.includes("maria") ? "confirmó" : "pendiente";
  const cC = m.conf.includes("carlos") ? "confirmó" : "pendiente";
  const iConf = st === "ficha" && m.conf.includes(actor) && m.conf.length < 2;
  const needConf = st === "ficha" && !m.conf.includes(actor);
  const confirmFicha = () => { if (!m.conf.includes(actor)) setM({ conf: [...m.conf, actor] }); };
  const agreedFicha = st === "ficha" && m.conf.length === 2;
  const canStart = agreedFicha && actor === "carlos";
  const waitStart = agreedFicha && actor === "maria";
  const canArrive = st === "viaje" && actor === "maria";
  const waitArrive = st === "viaje" && actor === "carlos";
  const startTrip = () => { setM({ stage: "viaje" }); logEvento("Carlos marcó «En traslado» (manual, sin rastreo)"); };
  const arrive = () => { setM({ stage: "done" }); logEvento("María confirmó la llegada · traslado completado"); };
  const cancel = () => {
    if (st === "oferta") { setM({ stage: "avisada" }); return; } // rechazar oferta
    setM({ stage: "cancel" });
    logEvento("Traslado cancelado");
  };
  const reset = () => setM({ stage: "none", conf: [], sellos: [], ampliado: false });
  const selloGiven = m.sellos.includes(actor);
  const giveSello = () => {
    const r = emitirSello({ coordId: m.coordId, from: actor, to: other, tipo: "movilidad" }, st === "done");
    if (r === "emitido" || r === "duplicado") setM({ sellos: [...new Set([...m.sellos, actor])] });
  };
  const enJunta = !!sesion.juntaId;
  const toggleJunta = () => { setSesion({ juntaId: enJunta ? null : "campoy" }); logEvento(enJunta ? "Salió de la junta" : "Se unió a la junta"); };
  return (
    <div className={screenStyles.screen}>
      <div className={screenStyles.frame}>
      
      {nav.is("home") && (<><div className={screenStyles.header}><button className={screenStyles.iconButton} aria-label="Volver" onClick={nav.back}><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Movilidad solidaria</h1></div></>)}
      {nav.is("nuevo") && (<><div className={screenStyles.header}><button className={screenStyles.iconButton} aria-label="Volver" onClick={nav.back}><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Pedir un traslado</h1></div></>)}
      {nav.is("detalle") && (<><div className={screenStyles.header}><button className={screenStyles.iconButton} aria-label="Volver" onClick={nav.back}><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Detalle del traslado</h1></div></>)}
      {nav.is("junta") && (<><div className={screenStyles.header}><button className={screenStyles.iconButton} aria-label="Volver" onClick={nav.back}><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Mi junta vecinal</h1></div></>)}
      
      <div className="flex gap-2 pt-0 px-4 pb-2 items-center flex-none [&_span]:text-[14px] [&_span]:text-(--color-muted) [&_span]:font-bold [&_span]:whitespace-nowrap [&_.chip]:min-h-10 [&_.chip]:px-3 [&_.chip]:py-0" role="group" aria-label="Probar como"><span>Probar como:</span><button className={chipM} onClick={asM}>María (pide)</button><button className={chipC} onClick={asC}>Carlos (pasa)</button></div>
      
      {nav.is("home") && (<>
      <div className={screenStyles.content}>
        <div className="bg-[#fff1e6] border border-[#f0c8a8] rounded-[16px] px-3.5 py-3 text-[15px]" role="note"><b>No es transporte médico de urgencia.</b> Ante una urgencia, llama al 106 (SAMU). No esperes respuestas de vecinos.</div>
        <div className={screenStyles.wrap}><button className={tabNec} onClick={setNec}>Necesito un traslado</button><button className={tabPaso} onClick={setPaso}>Paso por ahí</button></div>
        {tabIsNec && (<>
          {hasReq && (<><button className={screenStyles.card} onClick={() => nav.go("detalle")}><div className={screenStyles.row}><span className={screenStyles.badgeFavor}>Gratis</span><span className={screenStyles.badge}>{statusTxt}</span></div><h3 className="text-[19px]!">María necesita llegar al hospital</h3><p className={screenStyles.muted}>Desde {req.origen} (zona aproximada) · {req.cuando} · {req.plazas}</p></button></>)}
          {noReq && (<><div className={screenStyles.card} role="status"><p className="font-bold!">Aún no hay traslados pedidos</p><p className={screenStyles.muted}>Pide uno y tu junta recibirá el aviso primero.</p></div></>)}
        </>)}
        {tabIsPaso && (<><div className={screenStyles.card}><div className={screenStyles.row}><span className={screenStyles.badgeFavor}>Gratis</span><span className={screenStyles.badgeDemo}>Ejemplo</span></div><h3 className="text-[19px]!">Carlos pasa por el hospital mañana</h3><p className={screenStyles.muted}>Sale 8:45 a. m. · 2 plazas · Desde Campoy</p></div></>)}
        <button className={screenStyles.button} onClick={() => nav.go("nuevo")}><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>Pedir un traslado</button>
        <button className={screenStyles.buttonSecondary} onClick={() => nav.go("junta")}>Mi junta vecinal</button>
      </div>
      </>)}
      
      {nav.is("nuevo") && (<>
      <div className={screenStyles.content}>
        <div className="bg-white border border-(--color-line) rounded-[20px] p-4 shadow-[0_2px_8px_rgba(32,33,36,.05)] flex flex-col gap-3 text-left w-full items-start [&_input]:w-6.5 [&_input]:h-6.5 [&_input]:mt-0.5 [&_input]:accent-(--color-brand) [&_input]:flex-none flex-row!"><input id="urg" type="checkbox" {...urg.props} /><label htmlFor="urg"><b>Es una urgencia médica o hay peligro ahora</b></label></div>
        {urg.checked && (<><div className="bg-[#fff1e6] border border-(--color-line) rounded-[20px] p-4 shadow-[0_2px_8px_rgba(32,33,36,.05)] flex flex-col gap-2 text-left w-full border-[#f0c8a8]!" role="alert"><p className="font-bold!">Llama primero al 106 (SAMU)</p><p className={screenStyles.muted}>Un vecino no reemplaza una ambulancia. No esperes respuestas de tu junta.</p><a className={screenStyles.button} href="tel:106">Llamar al 106</a></div></>)}
        <div className={screenStyles.field}><label htmlFor="o">Origen aproximado</label><input id="o" className={screenStyles.input} {...origen.props} /></div>
        <div className={screenStyles.field}><label htmlFor="d">Destino</label><input id="d" className={screenStyles.input} {...destino.props} /></div>
        <div className={screenStyles.field}><p className={screenStyles.label}>¿Cuándo?</p><div className={screenStyles.wrap}><button className={chip(cuando === "Mañana 9:00 a. m.")} onClick={() => setCuando("Mañana 9:00 a. m.")}>Mañana 9:00 a. m.</button><button className={chip(cuando === "Hoy 4:00 p. m.")} onClick={() => setCuando("Hoy 4:00 p. m.")}>Hoy 4:00 p. m.</button></div></div>
        <div className={screenStyles.field}><p className={screenStyles.label}>Personas</p><div className={screenStyles.wrap}><button className={chip(plazas === "1 plaza")} onClick={() => setPlazas("1 plaza")}>1 plaza</button><button className={chip(plazas === "2 plazas")} onClick={() => setPlazas("2 plazas")}>2 plazas</button></div></div>
        <div className={screenStyles.card}><p className={screenStyles.label}>Destinatarios</p><p>Mi junta primero</p><p className={screenStyles.muted}>Tu punto exacto se comparte solo en privado, después de aceptar.</p></div>
        <button className={screenStyles.button} onClick={sendReq}>Enviar a mi junta</button>
      </div>
      </>)}
      
      {nav.is("detalle") && (<>
      <div className={screenStyles.content}>
        <div className={screenStyles.card}><div className={screenStyles.row}><span className={screenStyles.badgeFavor}>Gratis</span><span className={screenStyles.badge}>{statusTxt}</span></div><h2 className="text-[22px]!">María necesita llegar al hospital</h2><p className={screenStyles.muted}>Desde {req.origen} (zona aproximada) · {req.cuando} · {req.plazas} · {req.urgente ? "Marcado urgente: llama al 106" : "No urgente"}</p></div>
      
        {b_none && (<><div className={screenStyles.card} role="status"><p className="font-bold!">Aún no hay solicitud</p><button className={screenStyles.button} onClick={() => nav.go("nuevo")}>Pedir un traslado</button></div></>)}
      
        {b_avisada_m && (<>
          <div className={screenStyles.card}><p className={screenStyles.label}>Aviso enviado a tu junta</p><div className="flex [&_.av]:ml-[-10px] [&_.av]:border-2 [&_.av]:border-white [&_.av]:w-10 [&_.av]:h-10 [&_.av]:text-[16px] [&_.av:first-child]:ml-0"><span className="w-11 h-11 rounded-[50%] grid place-items-center font-extrabold font-[Nunito,system-ui,sans-serif] text-[18px] flex-none bg-[#f4d9c6] text-[#8a2b07] av" aria-hidden="true">C</span><span className="w-11 h-11 rounded-[50%] grid place-items-center font-extrabold font-[Nunito,system-ui,sans-serif] text-[18px] flex-none bg-[#e6f0e4] text-[#2f5a2d] av" aria-hidden="true">R</span><span className="font-[Nunito,system-ui,sans-serif] m-0 leading-[1.15] tracking-[-.01em] w-11 h-11 rounded-[50%] grid place-items-center font-extrabold text-[18px] flex-none bg-[#ddf0f2] text-[#14505a] av" aria-hidden="true">L</span></div><p className={screenStyles.muted}>Miembros que recibieron el aviso de demostración (no se afirma entrega real).</p><span className={screenStyles.badgeDemo}>Simulación</span></div>
          {notAmpl && (<><button className={screenStyles.buttonOutline} onClick={ampliar}>Ampliar a mi comunidad</button></>)}
          {ampl && (<><p className={screenStyles.success} role="status">✓ Ampliaste el aviso a tu comunidad por decisión tuya.</p></>)}
          <p className={screenStyles.muted}>Cambia a «Carlos» arriba: es un vecino de tu junta que pasa por esa zona.</p>
        </>)}
      
        {b_avisada_c && (<>
          <div className={screenStyles.card}><p className={screenStyles.label}>Coincidencia sugerida</p><p>Tu ruta habitual pasa por la zona del hospital a las 8:45 a. m.</p><p className={screenStyles.muted}>Se comparan zonas y horarios. No se calcula una ruta vial.</p></div>
          <button className={screenStyles.button} onClick={offer}>Puedo llevarte</button>
        </>)}
      
        {b_oferta_m && (<>
          <div className={screenStyles.card}><div className={screenStyles.row}><span className="w-11 h-11 rounded-[50%] grid place-items-center font-extrabold font-[Nunito,system-ui,sans-serif] text-[18px] flex-none bg-[#e6f0e4] text-[#2f5a2d] av" aria-hidden="true">C</span><div className={screenStyles.grow}><b>Carlos puede llevarte</b><p className={screenStyles.muted}>Miembro de tu junta · 6 referencias vecinas</p></div></div><p className={screenStyles.muted}>Sale 8:45 a. m. · 2 plazas · pasa por el hospital</p></div>
          <button className={screenStyles.button} onClick={acceptOffer}>Aceptar a Carlos</button><button className={screenStyles.buttonSecondary} onClick={cancel}>Rechazar</button>
        </>)}
        {b_oferta_c && (<><div className={screenStyles.card} role="status"><p className={screenStyles.success}>✓ Oferta enviada</p><p className={screenStyles.muted}>Esperando que María acepte. Cambia a «María» arriba.</p></div></>)}
      
        {b_ficha && (<>
          <div className={screenStyles.card}><p className={screenStyles.label}>Ficha de traslado</p><p>Encuentro: <b>Esquina Av. Principal con Jr. Los Olivos</b></p><p>Destino: <b>{req.destino}</b></p><p>Hora: <b>Mañana 8:45 a. m.</b></p><p>María: <b>{cM}</b> · Carlos: <b>{cC}</b></p>
            {needConf && (<><button className={screenStyles.button} onClick={confirmFicha}>Confirmar ficha</button></>)}
            {iConf && (<><p className={screenStyles.success} role="status">Esperando confirmación de la otra persona.</p></>)}
            <p className={screenStyles.muted}>El encuentro exacto se acordó en privado. Nunca se rastrea tu ubicación.</p></div>
          {canStart && (<><button className={screenStyles.button} onClick={startTrip}>Marcar «En traslado» (manual)</button></>)}
          {canArrive && (<><button className={screenStyles.button} onClick={arrive}>Confirmar que llegué</button></>)}
          {waitStart && (<><p className={screenStyles.muted}>Carlos marcará el inicio del traslado. Cambia a «Carlos» arriba.</p></>)}
          {waitArrive && (<><p className={screenStyles.muted}>María confirmará la llegada. Cambia a «María» arriba.</p></>)}
          <button className={screenStyles.buttonSecondary} onClick={cancel}>Cancelar traslado</button>
        </>)}
      
        {b_done && (<><div className={screenStyles.card} role="status"><p className={screenStyles.success}>✓ Traslado completado</p><p className={screenStyles.muted}>Gracias por ayudar. Pueden dejarse un Visto Bueno Vecinal.</p>{!selloGiven && (<button className={screenStyles.buttonOutline} onClick={giveSello}>Dar sello a {other === "carlos" ? "Carlos" : "María"}</button>)}{selloGiven && (<p className={screenStyles.success} role="status">✓ Sello emitido. Solo uno por traslado.</p>)}</div></>)}
        {b_cancel && (<><div className={screenStyles.card} role="status"><p className="font-bold!">Traslado cancelado</p><p className={screenStyles.muted}>El acuerdo se conserva en el historial.</p><button className={screenStyles.button} onClick={reset}>Empezar de nuevo</button></div></>)}
      </div>
      </>)}
      
      {nav.is("junta") && (<>
      <div className={screenStyles.content}>
        <div className={screenStyles.card}><div className={screenStyles.row}><span className="font-[Nunito,system-ui,sans-serif] m-0 leading-[1.15] tracking-[-.01em] w-11 h-11 rounded-[50%] grid place-items-center font-extrabold text-[18px] flex-none bg-[#ddf0f2] text-[#14505a] av" aria-hidden="true">J</span><div className={screenStyles.grow}><h2 className="text-[21px]!">Junta Vecinal Campoy Unido</h2><p className={screenStyles.muted}>Campoy · San Juan de Lurigancho</p></div></div><span className={screenStyles.badgeDemo}>Junta de demostración</span><p className={screenStyles.muted}>No tiene reconocimiento estatal real. Pertenecer no verifica a nadie.</p></div>
        {hasReq && (<><button className={`${screenStyles.card} border-(--color-brand)!`} onClick={() => nav.go("detalle")}><span className={screenStyles.badgeFavor}>Traslado prioritario</span><b>María necesita llegar al hospital</b><p className={screenStyles.muted}>{req.cuando} · {statusTxt}</p></button></>)}
        <h3 className="text-[19px]!">Avisos</h3>
        <div className={screenStyles.card}><p className="font-bold!">Reunión vecinal el sábado</p><p className={screenStyles.muted}>Local comunal · 5:00 p. m. · Aviso de demostración</p></div>
        <div className={screenStyles.card}><p className="font-bold!">Faena de limpieza del parque</p><p className={screenStyles.muted}>Domingo 8:00 a. m. · Aviso de demostración</p></div>
        <h3 className="text-[19px]!">Miembros visibles</h3>
        <div className={screenStyles.card}><div className="flex [&_.av]:ml-[-10px] [&_.av]:border-2 [&_.av]:border-white [&_.av]:w-10 [&_.av]:h-10 [&_.av]:text-[16px] [&_.av:first-child]:ml-0"><span className="w-11 h-11 rounded-[50%] grid place-items-center font-extrabold font-[Nunito,system-ui,sans-serif] text-[18px] flex-none bg-[#f4d9c6] text-[#8a2b07] av" aria-hidden="true">M</span><span className="w-11 h-11 rounded-[50%] grid place-items-center font-extrabold font-[Nunito,system-ui,sans-serif] text-[18px] flex-none bg-[#e6f0e4] text-[#2f5a2d] av" aria-hidden="true">C</span><span className="font-[Nunito,system-ui,sans-serif] m-0 leading-[1.15] tracking-[-.01em] w-11 h-11 rounded-[50%] grid place-items-center font-extrabold text-[18px] flex-none bg-[#ddf0f2] text-[#14505a] av" aria-hidden="true">R</span></div><p className={screenStyles.muted}>Solo se muestran quienes dieron permiso. Nunca se muestran conversaciones privadas.</p></div>
        <div className="bg-white border border-(--color-line) rounded-[20px] p-4 shadow-[0_2px_8px_rgba(32,33,36,.05)] flex flex-col gap-3 text-left w-full items-start [&_input]:w-6.5 [&_input]:h-6.5 [&_input]:mt-0.5 [&_input]:accent-(--color-brand) [&_input]:flex-none flex-row!"><input id="av" type="checkbox" {...avisos.props} /><label htmlFor="av"><b>Recibir avisos de mi junta</b></label></div>
        <button className={screenStyles.buttonSecondary} onClick={toggleJunta}>{enJunta ? "Salir de la junta" : "Unirme a la junta"}</button>
        <p className={`${screenStyles.muted} text-center!`}>Puedes usar toda la app sin pertenecer a una junta.</p>
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
