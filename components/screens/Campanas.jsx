"use client";

import { useViewStack } from "@/lib/hooks/use-view-stack";

import { useTextInput } from "@/lib/hooks/use-text-input";

import { Fragment } from "react";
import { screenStyles } from "./screen-styles";

/**
 * Pantalla Campanas del prototipo BarrioConecta.
 * Los valores de demostración sustituyen a la lógica del prototipo (DCLogic), que no se migró.
 */
export default function Campanas() {
  const nav = useViewStack("lista");
  const aporteState = "Pendiente";
  const asM = () => {};
  const asR = () => {};
  const cancelPick = () => {};
  const chipM = "min-h-11 rounded-full border-[1.5px] border-[#1f6f7a] bg-[#1f6f7a] px-3.5 py-0 font-bold text-[15px] whitespace-nowrap text-white chip";
  const chipR = "min-h-11 rounded-full border-[1.5px] border-[#cfc7bf] bg-white px-3.5 py-0 font-bold text-[15px] whitespace-nowrap chip";
  const confirmIntent = () => {};
  const hasIntent = false;
  const intent = 14;
  const isDinero = false;
  const markReceived = () => {};
  const modeHelp = "Entrega tus bienes en el centro de acopio.";
  const modes = [{name: "Bienes", cls: "min-h-11 rounded-full border-[1.5px] border-[#1f6f7a] bg-[#1f6f7a] px-3.5 py-0 font-bold text-[15px] whitespace-nowrap text-white chip", pick: () => {}}, {name: "Dinero", cls: "min-h-11 rounded-full border-[1.5px] border-[#cfc7bf] bg-white px-3.5 py-0 font-bold text-[15px] whitespace-nowrap chip", pick: () => {}}, {name: "Tiempo", cls: "min-h-11 rounded-full border-[1.5px] border-[#cfc7bf] bg-white px-3.5 py-0 font-bold text-[15px] whitespace-nowrap chip", pick: () => {}}, {name: "Logística", cls: "min-h-11 rounded-full border-[1.5px] border-[#cfc7bf] bg-white px-3.5 py-0 font-bold text-[15px] whitespace-nowrap chip", pick: () => {}}];
  const monto = useTextInput("");
  const montoTxt = "";
  const myMode = "Bienes";
  const nextText = "Falta que el responsable confirme que recibió tu aporte. Cambia de perfil arriba para probarlo.";
  const noIntent = true;
  const noIntent2 = true;
  const offered = 200;
  const picking = false;
  const received = 3;
  const recv = 80;
  const resDone = false;
  const resNone = true;
  const resPend = false;
  const startIntent = () => {};
  const vM = true;
  const vR = false;
  const withdraw = () => {};
  return (
    <div className={screenStyles.screen}>
      <div className={screenStyles.frame}>
      
      {nav.is("lista") && (<><div className={screenStyles.header}><button className={screenStyles.iconButton} aria-label="Volver" onClick={nav.back}><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Campañas de apoyo</h1></div></>)}
      {nav.is("detalle") && (<><div className={screenStyles.header}><button className={screenStyles.iconButton} aria-label="Volver" onClick={nav.back}><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Campaña</h1></div></>)}
      {nav.is("acopio") && (<><div className={screenStyles.header}><button className={screenStyles.iconButton} aria-label="Volver" onClick={nav.back}><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Centro de acopio</h1></div></>)}
      {nav.is("apoyos") && (<><div className={screenStyles.header}><button className={screenStyles.iconButton} aria-label="Volver" onClick={nav.back}><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Mis apoyos</h1></div></>)}
      
      <div className="flex gap-2 pt-0 px-4 pb-2 items-center flex-none overflow-x-auto [&_span]:text-[14px] [&_span]:text-(--color-muted) [&_span]:font-bold [&_span]:whitespace-nowrap [&_.chip]:min-h-10 [&_.chip]:px-3 [&_.chip]:py-0" role="group" aria-label="Probar como"><span>Probar como:</span><button className={chipM} onClick={asM}>María (apoya)</button><button className={chipR} onClick={asR}>Responsable de la campaña</button></div>
      
      {nav.is("lista") && (<>
      <div className={screenStyles.content}>
        <div className={screenStyles.wrap}><button className="min-h-11 rounded-full border-[1.5px] border-[#1f6f7a] bg-[#1f6f7a] px-3.5 py-0 font-bold text-[15px] whitespace-nowrap text-white chip">Activas</button><button className="min-h-11 rounded-full border-[1.5px] border-[#cfc7bf] bg-white px-3.5 py-0 font-bold text-[15px] whitespace-nowrap chip">Finalizadas</button></div>
        <span className={screenStyles.badgeDemo}>Campañas de ejemplo · dinero y compras simulados</span>
        <button className={screenStyles.card} onClick={() => nav.go("detalle")}><div className={screenStyles.row}><span className={screenStyles.badgeSolidarity}>Acopio</span><span className={screenStyles.badge}>Activa</span></div><h3 className="text-[20px]!">Abrigo para familias de Calca</h3><p className={screenStyles.muted}>Responsable: Junta Vecinal Calca Centro · hasta el 30 de noviembre</p><p className="font-bold! text-[15px]!">{intent} personas quieren apoyar</p></button>
        <div className={screenStyles.card}><div className={screenStyles.row}><span className={screenStyles.badgeSolidarity}>Donación</span><span className={screenStyles.badgeDemo}>Ejemplo</span></div><h3 className="text-[20px]!">Útiles escolares para Punchana</h3><p className={screenStyles.muted}>Responsable: Colegio comunitario · 6 personas quieren apoyar</p></div>
        <div className={screenStyles.card}><div className={screenStyles.row}><span className={screenStyles.badgeSolidarity}>Actividad solidaria</span><span className={screenStyles.badgeDemo}>Ejemplo</span></div><h3 className="text-[20px]!">Pollada pro ayuda médica</h3><p className={screenStyles.muted}>Responsable: familia organizadora · requiere autorización del beneficiario</p></div>
        <a className={screenStyles.button} href="/publicar"><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>Crear campaña</a>
        <button className={screenStyles.buttonSecondary} onClick={() => nav.go("apoyos")}>Mis apoyos</button>
      </div>
      </>)}
      
      {nav.is("detalle") && (<>
      <div className={screenStyles.content}>
        <div className={screenStyles.row}><span className={screenStyles.badgeSolidarity}>Acopio</span><span className={screenStyles.badge}>Activa</span><span className={screenStyles.badgeDemo}>Ejemplo</span></div>
        <h2 className="text-[25px]!">Abrigo para familias de Calca</h2>
        <p>Recibimos frazadas, ropa de abrigo limpia y gorros para las familias de la zona alta antes de las heladas.</p>
        <p className={screenStyles.muted}>Responsable: Junta Vecinal Calca Centro (demostración) · Plazo: 30 de noviembre · Autorizada por el responsable</p>
        <div className="grid grid-cols-2 gap-2.5 [&_div]:bg-[#f6f2ec] [&_div]:rounded-[14px] [&_div]:px-3 [&_div]:py-2.5 [&_div]:flex [&_div]:flex-col [&_div]:gap-0.5 [&_b]:font-[Nunito,system-ui,sans-serif] [&_b]:text-[22px]"><div><b>{intent}</b><span className={screenStyles.muted}>quieren apoyar (intención)</span></div><div><b>{received}</b><span className={screenStyles.muted}>aportes recibidos y confirmados</span></div></div>
        <div className={screenStyles.card}><p className={screenStyles.label}>Dinero (simulado, no se cobra)</p><div className="grid grid-cols-2 gap-2.5 [&_div]:bg-[#f6f2ec] [&_div]:rounded-[14px] [&_div]:px-3 [&_div]:py-2.5 [&_div]:flex [&_div]:flex-col [&_div]:gap-0.5 [&_b]:font-[Nunito,system-ui,sans-serif] [&_b]:text-[22px]"><div><b>S/ {offered}</b><span className={screenStyles.muted}>ofrecido</span></div><div><b>S/ {recv}</b><span className={screenStyles.muted}>recibido</span></div></div><p className={screenStyles.muted}>Lo ofrecido no cuenta como recaudado hasta que el responsable confirme que lo recibió.</p></div>
        <div className={screenStyles.card}><p className={screenStyles.label}>Actualizaciones</p><p className={screenStyles.muted}>8 nov · Ya se reunieron 40 frazadas. Faltan gorros y ropa para niños.</p></div>
      
        {vM && (<>
          {noIntent && (<><button className={screenStyles.button} onClick={startIntent}>Quiero apoyar</button></>)}
          {picking && (<>
            <div className={screenStyles.card}><p className={screenStyles.label}>¿Cómo quieres apoyar?</p><div className={screenStyles.wrap}>{(modes ?? []).map((m, __i1) => (<Fragment key={__i1}><button className={m.cls} onClick={m.pick}>{m.name}</button></Fragment>))}</div>
              {isDinero && (<><div className={screenStyles.field}><label htmlFor="mt">Monto (simulado)</label><input id="mt" className={screenStyles.input} inputMode="numeric" {...monto.props} /></div><span className={screenStyles.badgeDemo}>No se realiza ningún cobro</span></>)}
              <p className={screenStyles.muted}>{modeHelp}</p>
              <button className={screenStyles.button} onClick={confirmIntent}>Confirmar mi apoyo</button><button className={screenStyles.buttonSecondary} onClick={cancelPick}>Cancelar</button></div>
          </>)}
          {hasIntent && (<>
            <div className={screenStyles.card} role="status"><p className={screenStyles.success}>✓ Tu intención de apoyar está registrada</p><p>Forma: <b>{myMode}</b> · Estado del aporte: <b>{aporteState}</b></p><p className={screenStyles.muted}>{nextText}</p>
              <button className={screenStyles.buttonOutline} onClick={() => nav.go("acopio")}>Ver centro de acopio</button><a className={screenStyles.buttonSecondary} href="/favores">Abrir chat de logística</a>
              <button className={screenStyles.buttonSecondary} onClick={withdraw}>Retirar mi intención</button><p className={screenStyles.muted}>Retirar la intención no borra un aporte ya recibido.</p></div>
          </>)}
        </>)}
        {vR && (<>
          <div className={screenStyles.card}><p className={screenStyles.label}>Panel del responsable</p>
            {resPend && (<><p>María ofrece: <b>{myMode}</b> {montoTxt}</p><button className={screenStyles.button} onClick={markReceived}>Confirmar recepción</button></>)}
            {resNone && (<><p className={screenStyles.muted}>No hay aportes pendientes de confirmar. Cambia a «María» para crear uno.</p></>)}
            {resDone && (<><p className={screenStyles.success} role="status">✓ Aporte de María recibido</p></>)}
            <button className={screenStyles.buttonSecondary}>Publicar actualización</button><button className={screenStyles.buttonSecondary}>Finalizar campaña</button></div>
        </>)}
        <button className={screenStyles.buttonSecondary}>Compartir enlace de campaña</button>
      </div>
      </>)}
      
      {nav.is("acopio") && (<>
      <div className={screenStyles.content}>
        <div className={screenStyles.row}><span className={screenStyles.badgeSolidarity}>Acopio</span><span className={screenStyles.badgeFavor}>Abierto ahora</span><span className={screenStyles.badgeDemo}>Ejemplo</span></div>
        <h2 className="text-[24px]!">Local comunal de Calca Centro</h2>
        <div className="relative h-32.5! rounded-[20px]! bg-[#efe8dd]! border! border-(--color-line)! overflow-hidden!"><svg viewBox="0 0 358 130" width="100%" height="130" aria-hidden="true"><path d="M0 70H358M120 0V130M250 0V130" stroke="#fff" strokeWidth="8" /><path d="M185 76s-11-10-11-18a11 11 0 0 1 22 0c0 8-11 18-11 18z" fill="#1F6F7A" /></svg><span className={`${screenStyles.badgeDemo} absolute! left-2! bottom-2!`}>Mapa de demostración</span></div>
        <div className={screenStyles.card}><p className={screenStyles.label}>Dirección pública</p><p>Jr. Comercio 123, Calca (ejemplo ficticio)</p><p className={screenStyles.label}>Horario</p><p>Lunes a viernes · 9:00 a. m. a 5:00 p. m.</p><p className={screenStyles.label}>Recursos admitidos</p><p>Frazadas, ropa de abrigo limpia, gorros</p><p className={screenStyles.muted}>Actualizado hoy 8:00 a. m. · Información de demostración</p></div>
        <button className={screenStyles.button} onClick={() => nav.go("detalle")}>Volver a la campaña</button>
      </div>
      </>)}
      
      {nav.is("apoyos") && (<>
      <div className={screenStyles.content}>
        <h2 className="text-[20px]!">Campañas que apoyo</h2>
        {hasIntent && (<><div className={screenStyles.card}><b>Abrigo para familias de Calca</b><p className={screenStyles.muted}>Forma: {myMode} {montoTxt}</p><div className={screenStyles.row}><span className={screenStyles.badgeDemo}>Prometido</span><span className={screenStyles.badge}>{aporteState}</span></div><button className={screenStyles.buttonOutline} onClick={() => nav.go("detalle")}>Retomar</button></div></>)}
        {noIntent2 && (<><div className={screenStyles.card} role="status"><p className="font-bold!">Aún no apoyas ninguna campaña</p><button className={screenStyles.button} onClick={() => nav.go("lista")}>Ver campañas</button></div></>)}
        <h2 className="text-[20px]!">Campañas que organizo</h2>
        <div className={screenStyles.card} role="status"><p className={screenStyles.muted}>Todavía no organizas ninguna campaña.</p><a className={screenStyles.buttonOutline} href="/publicar">Crear campaña</a></div>
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
