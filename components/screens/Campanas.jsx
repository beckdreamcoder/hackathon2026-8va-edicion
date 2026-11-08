"use client";

import { useViewStack } from "@/lib/hooks/use-view-stack";

import { useTextInput } from "@/lib/hooks/use-text-input";

import { Fragment } from "react";
import "./Campanas.css";

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
  const chipM = "chip on";
  const chipR = "chip";
  const confirmIntent = () => {};
  const hasIntent = false;
  const intent = 14;
  const isDinero = false;
  const markReceived = () => {};
  const modeHelp = "Entrega tus bienes en el centro de acopio.";
  const modes = [{name: "Bienes", cls: "chip on", pick: () => {}}, {name: "Dinero", cls: "chip", pick: () => {}}, {name: "Tiempo", cls: "chip", pick: () => {}}, {name: "Logística", cls: "chip", pick: () => {}}];
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
    <div className="scr-campanas">
      <div className="app">
      
      {nav.is("lista") && (<><div className="top"><button className="ib" aria-label="Volver" onClick={nav.back}><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Campañas de apoyo</h1></div></>)}
      {nav.is("detalle") && (<><div className="top"><button className="ib" aria-label="Volver" onClick={nav.back}><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Campaña</h1></div></>)}
      {nav.is("acopio") && (<><div className="top"><button className="ib" aria-label="Volver" onClick={nav.back}><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Centro de acopio</h1></div></>)}
      {nav.is("apoyos") && (<><div className="top"><button className="ib" aria-label="Volver" onClick={nav.back}><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Mis apoyos</h1></div></>)}
      
      <div className="who" role="group" aria-label="Probar como"><span>Probar como:</span><button className={`${chipM ?? ""}`} onClick={asM}>María (apoya)</button><button className={`${chipR ?? ""}`} onClick={asR}>Responsable de la campaña</button></div>
      
      {nav.is("lista") && (<>
      <div className="body">
        <div className="wrap"><button className="chip on">Activas</button><button className="chip">Finalizadas</button></div>
        <span className="tag sim">Campañas de ejemplo · dinero y compras simulados</span>
        <button className="card" onClick={() => nav.go("detalle")}><div className="row"><span className="tag sol">Acopio</span><span className="tag">Activa</span></div><h3 style={{fontSize: "20px"}}>Abrigo para familias de Calca</h3><p className="mut">Responsable: Junta Vecinal Calca Centro · hasta el 30 de noviembre</p><p style={{fontWeight: "700", fontSize: "15px"}}>{intent} personas quieren apoyar</p></button>
        <div className="card"><div className="row"><span className="tag sol">Donación</span><span className="tag sim">Ejemplo</span></div><h3 style={{fontSize: "20px"}}>Útiles escolares para Punchana</h3><p className="mut">Responsable: Colegio comunitario · 6 personas quieren apoyar</p></div>
        <div className="card"><div className="row"><span className="tag sol">Actividad solidaria</span><span className="tag sim">Ejemplo</span></div><h3 style={{fontSize: "20px"}}>Pollada pro ayuda médica</h3><p className="mut">Responsable: familia organizadora · requiere autorización del beneficiario</p></div>
        <a className="btn" href="/publicar"><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>Crear campaña</a>
        <button className="btn g" onClick={() => nav.go("apoyos")}>Mis apoyos</button>
      </div>
      </>)}
      
      {nav.is("detalle") && (<>
      <div className="body">
        <div className="row"><span className="tag sol">Acopio</span><span className="tag">Activa</span><span className="tag sim">Ejemplo</span></div>
        <h2 style={{fontSize: "25px"}}>Abrigo para familias de Calca</h2>
        <p>Recibimos frazadas, ropa de abrigo limpia y gorros para las familias de la zona alta antes de las heladas.</p>
        <p className="mut">Responsable: Junta Vecinal Calca Centro (demostración) · Plazo: 30 de noviembre · Autorizada por el responsable</p>
        <div className="stat"><div><b>{intent}</b><span className="mut">quieren apoyar (intención)</span></div><div><b>{received}</b><span className="mut">aportes recibidos y confirmados</span></div></div>
        <div className="card"><p className="lbl">Dinero (simulado, no se cobra)</p><div className="stat"><div><b>S/ {offered}</b><span className="mut">ofrecido</span></div><div><b>S/ {recv}</b><span className="mut">recibido</span></div></div><p className="mut">Lo ofrecido no cuenta como recaudado hasta que el responsable confirme que lo recibió.</p></div>
        <div className="card"><p className="lbl">Actualizaciones</p><p className="mut">8 nov · Ya se reunieron 40 frazadas. Faltan gorros y ropa para niños.</p></div>
      
        {vM && (<>
          {noIntent && (<><button className="btn" onClick={startIntent}>Quiero apoyar</button></>)}
          {picking && (<>
            <div className="card"><p className="lbl">¿Cómo quieres apoyar?</p><div className="wrap">{(modes ?? []).map((m, __i1) => (<Fragment key={__i1}><button className={`${m.cls ?? ""}`} onClick={m.pick}>{m.name}</button></Fragment>))}</div>
              {isDinero && (<><div className="field"><label htmlFor="mt">Monto (simulado)</label><input id="mt" className="in" inputMode="numeric" {...monto.props} /></div><span className="tag sim">No se realiza ningún cobro</span></>)}
              <p className="mut">{modeHelp}</p>
              <button className="btn" onClick={confirmIntent}>Confirmar mi apoyo</button><button className="btn g" onClick={cancelPick}>Cancelar</button></div>
          </>)}
          {hasIntent && (<>
            <div className="card" role="status"><p className="ok">✓ Tu intención de apoyar está registrada</p><p>Forma: <b>{myMode}</b> · Estado del aporte: <b>{aporteState}</b></p><p className="mut">{nextText}</p>
              <button className="btn o" onClick={() => nav.go("acopio")}>Ver centro de acopio</button><a className="btn g" href="/favores">Abrir chat de logística</a>
              <button className="btn g" onClick={withdraw}>Retirar mi intención</button><p className="mut">Retirar la intención no borra un aporte ya recibido.</p></div>
          </>)}
        </>)}
        {vR && (<>
          <div className="card"><p className="lbl">Panel del responsable</p>
            {resPend && (<><p>María ofrece: <b>{myMode}</b> {montoTxt}</p><button className="btn" onClick={markReceived}>Confirmar recepción</button></>)}
            {resNone && (<><p className="mut">No hay aportes pendientes de confirmar. Cambia a «María» para crear uno.</p></>)}
            {resDone && (<><p className="ok" role="status">✓ Aporte de María recibido</p></>)}
            <button className="btn g">Publicar actualización</button><button className="btn g">Finalizar campaña</button></div>
        </>)}
        <button className="btn g">Compartir enlace de campaña</button>
      </div>
      </>)}
      
      {nav.is("acopio") && (<>
      <div className="body">
        <div className="row"><span className="tag sol">Acopio</span><span className="tag fav">Abierto ahora</span><span className="tag sim">Ejemplo</span></div>
        <h2 style={{fontSize: "24px"}}>Local comunal de Calca Centro</h2>
        <div style={{position: "relative", height: "130px", borderRadius: "20px", background: "#EFE8DD", border: "1px solid #E3DDD7", overflow: "hidden"}}><svg viewBox="0 0 358 130" width="100%" height="130" aria-hidden="true"><path d="M0 70H358M120 0V130M250 0V130" stroke="#fff" strokeWidth="8" /><path d="M185 76s-11-10-11-18a11 11 0 0 1 22 0c0 8-11 18-11 18z" fill="#1F6F7A" /></svg><span className="tag sim" style={{position: "absolute", left: "8px", bottom: "8px"}}>Mapa de demostración</span></div>
        <div className="card"><p className="lbl">Dirección pública</p><p>Jr. Comercio 123, Calca (ejemplo ficticio)</p><p className="lbl">Horario</p><p>Lunes a viernes · 9:00 a. m. a 5:00 p. m.</p><p className="lbl">Recursos admitidos</p><p>Frazadas, ropa de abrigo limpia, gorros</p><p className="mut">Actualizado hoy 8:00 a. m. · Información de demostración</p></div>
        <button className="btn" onClick={() => nav.go("detalle")}>Volver a la campaña</button>
      </div>
      </>)}
      
      {nav.is("apoyos") && (<>
      <div className="body">
        <h2 style={{fontSize: "20px"}}>Campañas que apoyo</h2>
        {hasIntent && (<><div className="card"><b>Abrigo para familias de Calca</b><p className="mut">Forma: {myMode} {montoTxt}</p><div className="row"><span className="tag sim">Prometido</span><span className="tag">{aporteState}</span></div><button className="btn o" onClick={() => nav.go("detalle")}>Retomar</button></div></>)}
        {noIntent2 && (<><div className="card" role="status"><p style={{fontWeight: "700"}}>Aún no apoyas ninguna campaña</p><button className="btn" onClick={() => nav.go("lista")}>Ver campañas</button></div></>)}
        <h2 style={{fontSize: "20px"}}>Campañas que organizo</h2>
        <div className="card" role="status"><p className="mut">Todavía no organizas ninguna campaña.</p><a className="btn o" href="/publicar">Crear campaña</a></div>
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
