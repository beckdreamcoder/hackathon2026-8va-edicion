"use client";

import { useViewStack } from "@/lib/hooks/use-view-stack";

import { useCheckbox } from "@/lib/hooks/use-checkbox";
import { useTextInput } from "@/lib/hooks/use-text-input";

import { Fragment } from "react";
import "./Publicar.css";

/**
 * Pantalla Publicar del prototipo BarrioConecta.
 * Los valores de demostración sustituyen a la lógica del prototipo (DCLogic), que no se migró.
 */
export default function Publicar() {
  const nav = useViewStack("tipo");
  const responsable = useTextInput("");
  const plazo = useTextInput("");
  const alCom = "chip";
  const alJunta = "chip on";
  const benef = useCheckbox(false);
  const catSug = "Otros";
  const cats = [{name: "Herramientas", cls: "chip on", pick: () => {}}, {name: "Habilidades", cls: "chip", pick: () => {}}, {name: "Ayuda temporal", cls: "chip", pick: () => {}}, {name: "Movilidad", cls: "chip", pick: () => {}}];
  const chipOfrezco = "chip";
  const chipPido = "chip on";
  const desc = useTextInput("");
  const esCach = false;
  const esCamp = false;
  const esEmerg = false;
  const esFavor = true;
  const esMov = false;
  const falta = false;
  const faltaMsg = "Cuéntanos en pocas palabras qué necesitas u ofreces.";
  const formas = [{name: "Bienes", cls: "chip on", pick: () => {}}, {name: "Dinero", cls: "chip", pick: () => {}}, {name: "Compra solidaria", cls: "chip", pick: () => {}}, {name: "Tiempo", cls: "chip", pick: () => {}}, {name: "Logística", cls: "chip", pick: () => {}}];
  const hasSug = false;
  const is_listo = false;
  const is_revisar = false;
  const limite = false;
  const listoEstado = "Publicado";
  const listoText = "Tu publicación ya está visible para tu junta.";
  const listoTitle = "¡Listo!";
  const next = () => {};
  const noEmerg = true;
  const placeholder = "Ejemplo: necesito una escalera prestada para el sábado";
  const precio = useTextInput("");
  const pubLabel = "Publicar";
  const publish = () => {};
  const resTag = "Gratis";
  const resTagCls = "tag fav";
  const resTitle = "Mi publicación";
  const reset = () => {};
  const setCom = () => {};
  const setJunta = () => {};
  const setOfrezco = () => {};
  const setPido = () => {};
  const sinRed = useCheckbox(false);
  const suggest = () => {};
  const tipoNombre = "Favor gratuito · Necesito ayuda";
  const tipos = [{name: "Favor gratuito", sub: "Préstamos, habilidades, ayuda temporal y movilidad", tag: "Gratis", tagCls: "tag fav", cls: "opt on", pick: () => {}}, {name: "Cachuelo", sub: "Trabajo o servicio remunerado", tag: "Con precio", tagCls: "tag cac", cls: "opt", pick: () => {}}, {name: "Emergencia", sub: "Reporte con cámara y ubicación", tag: "Urgente", tagCls: "tag eme", cls: "opt", pick: () => {}}, {name: "Campaña de apoyo", sub: "Causas solidarias con responsable y plazo", tag: "Solidaridad", tagCls: "tag sol", cls: "opt", pick: () => {}}];
  const title = useTextInput("");
  return (
    <div className="scr-publicar">
      <div className="app">
      
      {nav.is("tipo") && (<>
      <div className="top"><a className="ib" href="/inicio" aria-label="Cerrar"><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg></a><h1>¿Qué quieres publicar?</h1></div>
      <div className="prog" aria-hidden="true"><i className="on"></i><i></i><i></i></div>
      <div className="body">
        <p className="mut" style={{fontWeight: "700"}}>Paso 1 de 3 · Elige el tipo</p>
        {(tipos ?? []).map((t, __i1) => (<Fragment key={__i1}>
          <button className={`${t.cls ?? ""}`} onClick={t.pick}><div className="sp"><b>{t.name}</b><span className="mut">{t.sub}</span></div><span className={`${t.tagCls ?? ""}`}>{t.tag}</span></button>
        </Fragment>))}
        {esFavor && (<>
          <div className="field"><p className="lbl">¿Pides o ofreces?</p><div className="wrap"><button className={`${chipPido ?? ""}`} onClick={setPido}>Necesito ayuda</button><button className={`${chipOfrezco ?? ""}`} onClick={setOfrezco}>Ofrezco ayuda</button></div>
          <p className="mut">Movilidad solidaria es un tipo de favor: la eliges en el siguiente paso.</p></div>
        </>)}
        {esEmerg && (<>
          <div className="card" style={{background: "#FFF1E6", borderColor: "#F0C8A8"}}><p style={{fontWeight: "700"}}>Para una emergencia, primero llama</p><p className="mut">Policía 105 · Bomberos 116 · SAMU 106. La evidencia nueva se toma con la cámara, no desde la galería.</p><a className="btn" href="/emergencias">Reportar con cámara</a></div>
        </>)}
        {noEmerg && (<><button className="btn" onClick={() => nav.go("datos")}>Continuar</button></>)}
      </div>
      </>)}
      
      {nav.is("datos") && (<>
      <div className="top"><button className="ib" aria-label="Volver" onClick={nav.back}><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Cuéntalo en pocas palabras</h1></div>
      <div className="prog" aria-hidden="true"><i className="on"></i><i className="on"></i><i></i></div>
      <div className="body">
        <p className="mut" style={{fontWeight: "700"}}>Paso 2 de 3 · {tipoNombre}</p>
        <div className="field"><label htmlFor="desc">Descripción</label><textarea id="desc" className="in" placeholder={`${placeholder ?? ""}`} {...desc.props}></textarea></div>
        <button className="btn o" onClick={suggest}><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" /></svg>Sugerencia automática</button>
        <span className="tag sim" style={{marginTop: "-8px"}}>Simulada · no se envía sola</span>
        {hasSug && (<>
          <div className="card" style={{borderColor: "#C8102E"}}><p className="lbl">Propuesta (puedes editarla)</p><label htmlFor="tit" style={{position: "absolute", left: "-9999px"}}>Título</label><input id="tit" className="in" {...title.props} /><p className="mut">Categoría sugerida: {catSug}</p></div>
        </>)}
        {esFavor && (<>
          <div className="field"><p className="lbl">Categoría</p><div className="wrap">{(cats ?? []).map((c, __i1) => (<Fragment key={__i1}><button className={`${c.cls ?? ""}`} onClick={c.pick}>{c.name}</button></Fragment>))}</div></div>
          {esMov && (<><div className="card" role="note"><p className="mut">Movilidad solidaria avisa primero a tu junta. Si es una urgencia médica, llama al 106; no esperes respuestas de vecinos.</p><a className="btn o" href="/movilidad">Ir al flujo de movilidad</a></div></>)}
          <div className="field"><p className="lbl">Disponibilidad</p><div className="wrap"><button className="chip on">Hoy</button><button className="chip">Esta semana</button><button className="chip">Fines de semana</button></div></div>
        </>)}
        {esCach && (<>
          <div className="field"><label htmlFor="precio">Precio referencial</label><input id="precio" className="in" placeholder="S/ o \u00abA convenir\u00bb" {...precio.props} /><p className="mut">Los pagos no se hacen en la app: el precio se acuerda entre ustedes.</p></div>
        </>)}
        {esCamp && (<>
          <div className="field"><label htmlFor="resp">Responsable</label><input id="resp" className="in" placeholder="Nombre de la persona u organizaci\u00f3n" {...responsable.props} /></div>
          <div className="field"><label htmlFor="plazo">Plazo</label><input id="plazo" className="in" placeholder="Fecha l\u00edmite" {...plazo.props} /></div>
          <div className="field"><p className="lbl">Formas de apoyo</p><div className="wrap">{(formas ?? []).map((f, __i1) => (<Fragment key={__i1}><button className={`${f.cls ?? ""}`} onClick={f.pick}>{f.name}</button></Fragment>))}</div><span className="tag sim">Dinero y compras simulados</span></div>
          <div className="sw"><input id="benef" type="checkbox" {...benef.props} /><label htmlFor="benef"><b>La persona beneficiaria autorizó esta campaña</b><br /><span className="mut">Obligatorio si la campaña es sobre otra persona.</span></label></div>
        </>)}
        {falta && (<><p className="err" role="alert">{faltaMsg}</p></>)}
        <button className="btn" onClick={next}>Revisar</button>
      </div>
      </>)}
      
      {is_revisar && (<>
      <div className="top"><button className="ib" aria-label="Volver" onClick={nav.back}><svg className="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Revisa y publica</h1></div>
      <div className="prog" aria-hidden="true"><i className="on"></i><i className="on"></i><i className="on"></i></div>
      <div className="body">
        <p className="mut" style={{fontWeight: "700"}}>Paso 3 de 3 · Confirmación</p>
        <div className="card"><span className={`${resTagCls ?? ""}`}>{resTag}</span><h2 style={{fontSize: "22px"}}>{resTitle}</h2><p className="mut">{desc.value}</p></div>
        <div className="card"><p className="lbl">Zona aproximada</p><div className="row"><svg className="ic" style={{color: "#C8102E"}} viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg><p>Campoy · Sector 2 <span className="mut">(no se muestra tu dirección exacta)</span></p></div></div>
        <div className="field"><p className="lbl">¿Quién lo verá?</p><div className="wrap"><button className={`${alJunta ?? ""}`} onClick={setJunta}>Mi junta primero</button><button className={`${alCom ?? ""}`} onClick={setCom}>Mi comunidad</button></div></div>
        <div className="sw"><input id="off" type="checkbox" {...sinRed.props} /><label htmlFor="off"><b>Simular que no tengo conexión</b><br /><span className="mut">Se guardará como pendiente y se enviará al reconectar.</span></label></div>
        {limite && (<><p className="err" role="alert">Llegaste al límite de 3 solicitudes de cachuelos por día. Puedes seguir respondiendo mensajes. Vuelve mañana para publicar otra.</p></>)}
        <button className="btn" onClick={publish}>{pubLabel}</button>
        <p className="mut" style={{textAlign: "center"}}>Nada se publica hasta que tú confirmes.</p>
      </div>
      </>)}
      
      {is_listo && (<>
      <div className="top"><h1 style={{paddingLeft: "8px"}}>{listoTitle}</h1></div>
      <div className="body" style={{justifyContent: "center", gap: "20px", textAlign: "center", alignItems: "center"}}>
        <svg className="ic" style={{width: "96px", height: "96px", strokeWidth: "1.5", color: "#2F5A2D"}} viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M8 12.500l3 3 5-6" /></svg>
        <p role="status" style={{fontSize: "19px"}}>{listoText}</p>
        <span className="tag sim">Estado: {listoEstado}</span>
        <a className="btn" href="/favores">Ver en el muro</a>
        <button className="btn g" onClick={reset}>Publicar otra</button>
        <a className="btn g" href="/inicio">Volver al inicio</a>
      </div>
      </>)}
      
      </div>
    </div>
  );
}
