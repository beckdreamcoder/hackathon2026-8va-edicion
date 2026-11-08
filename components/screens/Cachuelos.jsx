"use client";

import { useViewStack } from "@/lib/hooks/use-view-stack";

import { useTextInput } from "@/lib/hooks/use-text-input";

import { Fragment } from "react";
import "./Cachuelos.css";

/**
 * Pantalla Cachuelos del prototipo BarrioConecta.
 * Los valores de demostración sustituyen a la lógica del prototipo (DCLogic), que no se migró.
 */
export default function Cachuelos() {
  const nav = useViewStack("lista");
  const accept = () => {};
  const accepted = false;
  const agreed = false;
  const asM = () => {};
  const asP = () => {};
  const cM = "pendiente";
  const cP = "pendiente";
  const canRec = true;
  const canRequest = true;
  const changeTerms = () => {};
  const chipM = "chip on";
  const chipP = "chip";
  const completed = false;
  const cond = useTextInput("");
  const confirmAg = () => {};
  const dM = "pendiente";
  const dP = "pendiente";
  const dateSel = "Jueves";
  const dates = [{name: "Jueves", cls: "chip on", pick: () => {}}, {name: "Viernes", cls: "chip", pick: () => {}}, {name: "Sábado", cls: "chip", pick: () => {}}];
  const doneBtn = () => {};
  const doneLbl = "Marcar servicio completado";
  const editHint = "Pedro propone; tú puedes pedir cambios aquí";
  const editing = true;
  const iConfirmed = false;
  const iNeedConfirm = true;
  const pedroPend = false;
  const price = useTextInput("");
  const propose = () => {};
  const proposed = false;
  const recDone = false;
  const recommend = () => {};
  const reject = () => {};
  const rejected = false;
  const reqSentM = false;
  const request = () => {};
  const s1 = "";
  const s2 = "";
  const s3 = "";
  const setServ = () => {};
  const setTrab = () => {};
  const statusTxt = "Abierta";
  const tabIsServ = true;
  const tabIsTrab = false;
  const tabServ = "chip on";
  const tabTrab = "chip";
  return (
    <div className="scr-cachuelos">
      <div className="app">
      
      {nav.is("lista") && (<><div className="top"><button className="ib" aria-label="Volver" onClick={nav.back}><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Cachuelos</h1></div></>)}
      {nav.is("detalle") && (<><div className="top"><button className="ib" aria-label="Volver" onClick={nav.back}><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Detalle del servicio</h1></div></>)}
      {nav.is("perfil") && (<><div className="top"><button className="ib" aria-label="Volver" onClick={nav.back}><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Perfil de vecino</h1></div></>)}
      {nav.is("acuerdo") && (<><div className="top"><button className="ib" aria-label="Volver" onClick={nav.back}><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Ficha de acuerdo</h1></div></>)}
      
      <div className="who" role="group" aria-label="Probar como"><span>Probar como:</span><button className={`${chipM ?? ""}`} onClick={asM}>María (pide)</button><button className={`${chipP ?? ""}`} onClick={asP}>Pedro (ofrece)</button></div>
      
      {nav.is("lista") && (<>
      <div className="body">
        <div className="wrap"><button className={`${tabServ ?? ""}`} onClick={setServ}>Necesito un servicio</button><button className={`${tabTrab ?? ""}`} onClick={setTrab}>Busco trabajo</button></div>
        {tabIsServ && (<>
          <button className="card amb" onClick={() => nav.go("detalle")}><div className="row"><span className="tag cac">A convenir</span><span className="tag">{statusTxt}</span></div><h3 style={{fontSize: "19px"}}>Gasfitería · Pedro arregla fugas</h3><p className="mut">Campoy Sector 3 · Disponible esta semana</p><p style={{fontWeight: "700", fontSize: "15px"}}>Lo recomiendan 4 vecinos de tu comunidad</p></button>
          <div className="card amb"><div className="row"><span className="tag cac">S/ 25 por hora</span><span className="tag sim">Ejemplo</span></div><h3 style={{fontSize: "19px"}}>Clases de matemática de secundaria</h3><p className="mut">Campoy Sector 1 · Tardes · Vecina nueva</p></div>
        </>)}
        {tabIsTrab && (<>
          <div className="card amb"><div className="row"><span className="tag cac">S/ 60 referencial</span><span className="tag sim">Ejemplo</span></div><h3 style={{fontSize: "19px"}}>Necesito pintar un cuarto pequeño</h3><p className="mut">Campoy Sector 2 · Fin de semana</p></div>
        </>)}
        <a className="btn" href="/publicar"><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>Publicar cachuelo</a>
      </div>
      </>)}
      
      {nav.is("detalle") && (<>
      <div className="body">
        <div className="card amb"><div className="row"><span className="tag cac">A convenir</span><span className="tag">{statusTxt}</span></div><h2 style={{fontSize: "24px"}}>Arreglo fugas de agua en cocina y baño</h2><p>Llevo mis herramientas. Primero reviso y te digo el precio antes de empezar.</p><p className="mut">Gasfitería · Campoy Sector 3 · Esta semana, por las tardes</p></div>
        <button className="card" onClick={() => nav.go("perfil")} style={{flexDirection: "row", alignItems: "center"}}><span className="av p" aria-hidden="true">P</span><div className="sp"><b>Pedro</b><p className="mut">Recomendado por 4 vecinos</p></div><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg></button>
        <div className="card"><p style={{fontWeight: "700"}}>Lo recomiendan en tu comunidad</p><p className="mut">«Llegó puntual y explicó el costo antes.» — Rosa</p></div>
        {canRequest && (<><button className="btn" onClick={request}>Solicitar servicio</button><button className="btn g" onClick={request}>Me interesa</button></>)}
        {reqSentM && (<><div className="card" role="status"><p className="ok">✓ Solicitud enviada a Pedro</p><p className="mut">Pedro debe aceptar para abrir el chat. Cambia a «Pedro» arriba para probarlo.</p></div></>)}
        {pedroPend && (<><div className="card" role="status"><p style={{fontWeight: "700"}}>María solicita tu servicio</p><div style={{display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: "8px"}}><button className="btn g" style={{minHeight: "48px"}} onClick={reject}>Rechazar</button><button className="btn" style={{minHeight: "48px"}} onClick={accept}>Aceptar</button></div></div></>)}
        {accepted && (<><button className="btn" onClick={() => nav.go("acuerdo")}>Ver ficha de acuerdo</button><a className="btn g" href="/favores">Abrir chat temporal</a></>)}
        {rejected && (<><div className="card" role="status"><p style={{fontWeight: "700"}}>La solicitud no fue aceptada</p></div></>)}
        <p className="mut">Los pagos no se hacen en la app. Revisa las condiciones y evita adelantos a personas que no conoces.</p>
      </div>
      </>)}
      
      {nav.is("perfil") && (<>
      <div className="body">
        <div className="card" style={{alignItems: "center", textAlign: "center"}}><span className="av p" aria-hidden="true" style={{width: "72px", height: "72px", fontSize: "28px"}}>P</span><h2 style={{fontSize: "24px"}}>Pedro</h2><p className="mut">Campoy Sector 3 · Gasfitería</p><span className="tag sim">Identidad simulada · DNI privado</span></div>
        <div className="card"><p style={{fontWeight: "700"}}>Recomendado por 4 vecinos</p><details><summary>Ver comentarios</summary><div style={{display: "flex", flexDirection: "column", gap: "10px", paddingTop: "6px"}}><p className="mut">«Llegó puntual y explicó el costo antes.» — Rosa · Servicio completado</p><p className="mut">«Arregló la fuga el mismo día.» — Carlos · Servicio completado</p></div></details><p className="mut">Sin estrellas: solo recomendaciones tras una coordinación completada.</p></div>
        <button className="btn g">Reportar o bloquear</button>
      </div>
      </>)}
      
      {nav.is("acuerdo") && (<>
      <div className="body">
        <div className="card"><span className="tag">{statusTxt}</span><div className={`step ${s1 ?? ""}`}><i></i>Solicitud aceptada</div><div className={`step ${s2 ?? ""}`}><i></i>Acuerdo confirmado por ambos</div><div className={`step ${s3 ?? ""}`}><i></i>Servicio realizado</div></div>
        {editing && (<>
          <div className="card"><p className="lbl">{editHint}</p>
            <div className="field"><label htmlFor="pr">Precio acordado</label><input id="pr" className="in" {...price.props} /></div>
            <div className="field"><p className="lbl">Fecha</p><div className="wrap">{(dates ?? []).map((d, __i1) => (<Fragment key={__i1}><button className={`${d.cls ?? ""}`} onClick={d.pick}>{d.name}</button></Fragment>))}</div></div>
            <div className="field"><label htmlFor="cd">Condiciones</label><textarea id="cd" className="in" {...cond.props}></textarea></div>
            <button className="btn" onClick={propose}>Proponer acuerdo</button></div>
        </>)}
        {proposed && (<>
          <div className="card"><p className="lbl">Acuerdo propuesto</p><p><b>{price.value}</b> · {dateSel}</p><p className="mut">{cond.value}</p><p>Pedro: <b>{cP}</b> · María: <b>{cM}</b></p>
            {iNeedConfirm && (<><button className="btn" onClick={confirmAg}>Confirmar acuerdo</button></>)}
            {iConfirmed && (<><p className="ok" role="status">Esperando confirmación de la otra persona.</p></>)}
            <button className="btn g" onClick={changeTerms}>Cambiar términos</button><p className="mut">Si cambias los términos, se borran las confirmaciones anteriores.</p></div>
        </>)}
        {agreed && (<>
          <div className="card"><p className="ok">✓ Acuerdo confirmado por ambos</p><p className="mut">Esto no es un pago recibido. Paguen directamente como acordaron.</p>
            <button className="btn" onClick={doneBtn}>{doneLbl}</button><p className="mut">Cierre: María {dM} · Pedro {dP}</p></div>
        </>)}
        {completed && (<>
          <div className="card"><p className="ok">✓ Servicio completado por ambos</p>
            {canRec && (<><button className="btn" onClick={recommend}>Recomendar con Visto Bueno Vecinal</button></>)}
            {recDone && (<><p className="ok" role="status">✓ Recomendación emitida. Solo una por servicio.</p></>)}</div>
        </>)}
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
