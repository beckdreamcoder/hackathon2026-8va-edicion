"use client";

import { useViewStack } from "@/lib/hooks/use-view-stack";

import { useCheckbox } from "@/lib/hooks/use-checkbox";
import { useTextInput } from "@/lib/hooks/use-text-input";

import { Fragment } from "react";
import { screenStyles } from "./screen-styles";

/**
 * Pantalla Publicar del prototipo BarrioConecta.
 * Los valores de demostración sustituyen a la lógica del prototipo (DCLogic), que no se migró.
 */
export default function Publicar() {
  const nav = useViewStack("tipo");
  const responsable = useTextInput("");
  const plazo = useTextInput("");
  const alCom = "min-h-11 rounded-full border-[1.5px] border-[#cfc7bf] bg-white px-4 py-0 font-bold text-[15px]";
  const alJunta = "min-h-11 rounded-full border-[1.5px] border-(--color-brand) bg-(--color-brand) px-4 py-0 font-bold text-[15px] text-white on";
  const benef = useCheckbox(false);
  const catSug = "Otros";
  const cats = [{name: "Herramientas", cls: "min-h-11 rounded-full border-[1.5px] border-(--color-brand) bg-(--color-brand) px-4 py-0 font-bold text-[15px] text-white on", pick: () => {}}, {name: "Habilidades", cls: "min-h-11 rounded-full border-[1.5px] border-[#cfc7bf] bg-white px-4 py-0 font-bold text-[15px]", pick: () => {}}, {name: "Ayuda temporal", cls: "min-h-11 rounded-full border-[1.5px] border-[#cfc7bf] bg-white px-4 py-0 font-bold text-[15px]", pick: () => {}}, {name: "Movilidad", cls: "min-h-11 rounded-full border-[1.5px] border-[#cfc7bf] bg-white px-4 py-0 font-bold text-[15px]", pick: () => {}}];
  const chipOfrezco = "min-h-11 rounded-full border-[1.5px] border-[#cfc7bf] bg-white px-4 py-0 font-bold text-[15px]";
  const chipPido = "min-h-11 rounded-full border-[1.5px] border-(--color-brand) bg-(--color-brand) px-4 py-0 font-bold text-[15px] text-white on";
  const desc = useTextInput("");
  const esCach = false;
  const esCamp = false;
  const esEmerg = false;
  const esFavor = true;
  const esMov = false;
  const falta = false;
  const faltaMsg = "Cuéntanos en pocas palabras qué necesitas u ofreces.";
  const formas = [{name: "Bienes", cls: "min-h-11 rounded-full border-[1.5px] border-(--color-brand) bg-(--color-brand) px-4 py-0 font-bold text-[15px] text-white on", pick: () => {}}, {name: "Dinero", cls: "min-h-11 rounded-full border-[1.5px] border-[#cfc7bf] bg-white px-4 py-0 font-bold text-[15px]", pick: () => {}}, {name: "Compra solidaria", cls: "min-h-11 rounded-full border-[1.5px] border-[#cfc7bf] bg-white px-4 py-0 font-bold text-[15px]", pick: () => {}}, {name: "Tiempo", cls: "min-h-11 rounded-full border-[1.5px] border-[#cfc7bf] bg-white px-4 py-0 font-bold text-[15px]", pick: () => {}}, {name: "Logística", cls: "min-h-11 rounded-full border-[1.5px] border-[#cfc7bf] bg-white px-4 py-0 font-bold text-[15px]", pick: () => {}}];
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
  const resTagCls = screenStyles.badgeFavor;
  const resTitle = "Mi publicación";
  const reset = () => {};
  const setCom = () => {};
  const setJunta = () => {};
  const setOfrezco = () => {};
  const setPido = () => {};
  const sinRed = useCheckbox(false);
  const suggest = () => {};
  const tipoNombre = "Favor gratuito · Necesito ayuda";
  const tipos = [{name: "Favor gratuito", sub: "Préstamos, habilidades, ayuda temporal y movilidad", tag: "Gratis", tagCls: screenStyles.badgeFavor, cls: "flex items-center gap-3.5 min-h-19 rounded-[20px] border-2 border-(--color-brand) bg-[#fff5f6] px-3.5 py-3 text-left w-full [&_.ic]:w-8.5 [&_.ic]:h-8.5 [&_.ic]:text-(--color-brand) [&_b]:block [&_b]:text-[18px] on", pick: () => {}}, {name: "Cachuelo", sub: "Trabajo o servicio remunerado", tag: "Con precio", tagCls: screenStyles.badgeCachuelo, cls: "flex items-center gap-3.5 min-h-19 rounded-[20px] border-2 border-(--color-line) bg-white px-3.5 py-3 text-left w-full [&_.ic]:w-8.5 [&_.ic]:h-8.5 [&_.ic]:text-(--color-brand) [&_b]:block [&_b]:text-[18px]", pick: () => {}}, {name: "Emergencia", sub: "Reporte con cámara y ubicación", tag: "Urgente", tagCls: screenStyles.badgeEmergency, cls: "flex items-center gap-3.5 min-h-19 rounded-[20px] border-2 border-(--color-line) bg-white px-3.5 py-3 text-left w-full [&_.ic]:w-8.5 [&_.ic]:h-8.5 [&_.ic]:text-(--color-brand) [&_b]:block [&_b]:text-[18px]", pick: () => {}}, {name: "Campaña de apoyo", sub: "Causas solidarias con responsable y plazo", tag: "Solidaridad", tagCls: screenStyles.badgeSolidarity, cls: "flex items-center gap-3.5 min-h-19 rounded-[20px] border-2 border-(--color-line) bg-white px-3.5 py-3 text-left w-full [&_.ic]:w-8.5 [&_.ic]:h-8.5 [&_.ic]:text-(--color-brand) [&_b]:block [&_b]:text-[18px]", pick: () => {}}];
  const title = useTextInput("");
  return (
    <div className="m-0 bg-white text-(--color-ink) font-[Nunito,system-ui,sans-serif] text-[17px] leading-[1.4] [&_h1]:font-[Nunito,system-ui,sans-serif] [&_h1]:m-0 [&_h1]:leading-[1.15] [&_h1]:tracking-[-.01em] [&_h2]:font-[Nunito,system-ui,sans-serif] [&_h2]:m-0 [&_h2]:leading-[1.15] [&_h2]:tracking-[-.01em] [&_h3]:font-[Nunito,system-ui,sans-serif] [&_h3]:m-0 [&_h3]:leading-[1.15] [&_h3]:tracking-[-.01em] [&_h4]:font-[Nunito,system-ui,sans-serif] [&_h4]:m-0 [&_h4]:leading-[1.15] [&_h4]:tracking-[-.01em] [&_.t]:font-[Nunito,system-ui,sans-serif] [&_.t]:m-0 [&_.t]:leading-[1.15] [&_.t]:tracking-[-.01em] [&_p]:m-0 [&_button]:cursor-pointer [&_:focus-visible]:outline-3 [&_:focus-visible]:outline-(--color-ink) [&_:focus-visible]:outline-offset-2 [&_textarea.in]:px-3.5 [&_textarea.in]:py-3 [&_textarea.in]:min-h-26 [&_textarea.in]:resize-none">
      <div className="w-97.5 h-211 flex flex-col bg-white overflow-hidden">
      
      {nav.is("tipo") && (<>
      <div className={screenStyles.header}><a className={screenStyles.iconButton} href="/inicio" aria-label="Cerrar"><svg className="w-6 h-6 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round] flex-none ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg></a><h1>¿Qué quieres publicar?</h1></div>
      <div className="flex gap-1.5 pt-0 px-4 pb-2 [&_i]:flex-1 [&_i]:h-1.5 [&_i]:rounded-[3px] [&_i]:bg-(--color-line) [&_i.on]:bg-(--color-brand)" aria-hidden="true"><i className="on"></i><i></i><i></i></div>
      <div className="flex-1 min-h-0 overflow-y-auto pt-1 px-4 pb-6 flex flex-col gap-4">
        <p className={`${screenStyles.muted} font-bold!`}>Paso 1 de 3 · Elige el tipo</p>
        {(tipos ?? []).map((t, __i1) => (<Fragment key={__i1}>
          <button className={t.cls} onClick={t.pick}><div className={screenStyles.grow}><b>{t.name}</b><span className={screenStyles.muted}>{t.sub}</span></div><span className={t.tagCls}>{t.tag}</span></button>
        </Fragment>))}
        {esFavor && (<>
          <div className={screenStyles.field}><p className={screenStyles.label}>¿Pides o ofreces?</p><div className={screenStyles.wrap}><button className={chipPido} onClick={setPido}>Necesito ayuda</button><button className={chipOfrezco} onClick={setOfrezco}>Ofrezco ayuda</button></div>
          <p className={screenStyles.muted}>Movilidad solidaria es un tipo de favor: la eliges en el siguiente paso.</p></div>
        </>)}
        {esEmerg && (<>
          <div className="bg-white border border-(--color-line) rounded-[20px] p-4 shadow-[0_2px_8px_rgba(32,33,36,.05)] flex flex-col gap-2 bg-[#fff1e6]! border-[#f0c8a8]!"><p className="font-bold!">Para una emergencia, primero llama</p><p className={screenStyles.muted}>Policía 105 · Bomberos 116 · SAMU 106. La evidencia nueva se toma con la cámara, no desde la galería.</p><a className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-(--color-brand) text-white font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed" href="/emergencias">Reportar con cámara</a></div>
        </>)}
        {noEmerg && (<><button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-(--color-brand) text-white font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => nav.go("datos")}>Continuar</button></>)}
      </div>
      </>)}
      
      {nav.is("datos") && (<>
      <div className={screenStyles.header}><button className={screenStyles.iconButton} aria-label="Volver" onClick={nav.back}><svg className="w-6 h-6 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round] flex-none ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Cuéntalo en pocas palabras</h1></div>
      <div className="flex gap-1.5 pt-0 px-4 pb-2 [&_i]:flex-1 [&_i]:h-1.5 [&_i]:rounded-[3px] [&_i]:bg-(--color-line) [&_i.on]:bg-(--color-brand)" aria-hidden="true"><i className="on"></i><i className="on"></i><i></i></div>
      <div className="flex-1 min-h-0 overflow-y-auto pt-1 px-4 pb-6 flex flex-col gap-4">
        <p className={`${screenStyles.muted} font-bold!`}>Paso 2 de 3 · {tipoNombre}</p>
        <div className={screenStyles.field}><label htmlFor="desc">Descripción</label><textarea id="desc" className="min-h-26 border-[1.5px] border-[#cfc7bf] rounded-[16px] px-3.5 py-3 bg-white w-full resize-none" placeholder={`${placeholder ?? ""}`} {...desc.props}></textarea></div>
        <button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-white text-(--color-brand) font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed" onClick={suggest}><svg className="w-6 h-6 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round] flex-none ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2z" /></svg>Sugerencia automática</button>
        <span className={`${screenStyles.badgeDemo} mt-[-8px]!`}>Simulada · no se envía sola</span>
        {hasSug && (<>
          <div className="bg-white border border-(--color-line) rounded-[20px] p-4 shadow-[0_2px_8px_rgba(32,33,36,.05)] flex flex-col gap-2 border-(--color-brand)!"><p className={screenStyles.label}>Propuesta (puedes editarla)</p><label htmlFor="tit" className="absolute left-[-9999px]!">Título</label><input id="tit" className={screenStyles.input} {...title.props} /><p className={screenStyles.muted}>Categoría sugerida: {catSug}</p></div>
        </>)}
        {esFavor && (<>
          <div className={screenStyles.field}><p className={screenStyles.label}>Categoría</p><div className={screenStyles.wrap}>{(cats ?? []).map((c, __i1) => (<Fragment key={__i1}><button className={c.cls} onClick={c.pick}>{c.name}</button></Fragment>))}</div></div>
          {esMov && (<><div className="bg-white border border-(--color-line) rounded-[20px] p-4 shadow-[0_2px_8px_rgba(32,33,36,.05)] flex flex-col gap-2" role="note"><p className={screenStyles.muted}>Movilidad solidaria avisa primero a tu junta. Si es una urgencia médica, llama al 106; no esperes respuestas de vecinos.</p><a className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-white text-(--color-brand) font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed" href="/movilidad">Ir al flujo de movilidad</a></div></>)}
          <div className={screenStyles.field}><p className={screenStyles.label}>Disponibilidad</p><div className={screenStyles.wrap}><button className="min-h-11 rounded-full border-[1.5px] border-(--color-brand) bg-(--color-brand) px-4 py-0 font-bold text-[15px] text-white on">Hoy</button><button className="min-h-11 rounded-full border-[1.5px] border-[#cfc7bf] bg-white px-4 py-0 font-bold text-[15px]">Esta semana</button><button className="min-h-11 rounded-full border-[1.5px] border-[#cfc7bf] bg-white px-4 py-0 font-bold text-[15px]">Fines de semana</button></div></div>
        </>)}
        {esCach && (<>
          <div className={screenStyles.field}><label htmlFor="precio">Precio referencial</label><input id="precio" className={screenStyles.input} placeholder="S/ o \u00abA convenir\u00bb" {...precio.props} /><p className={screenStyles.muted}>Los pagos no se hacen en la app: el precio se acuerda entre ustedes.</p></div>
        </>)}
        {esCamp && (<>
          <div className={screenStyles.field}><label htmlFor="resp">Responsable</label><input id="resp" className={screenStyles.input} placeholder="Nombre de la persona u organizaci\u00f3n" {...responsable.props} /></div>
          <div className={screenStyles.field}><label htmlFor="plazo">Plazo</label><input id="plazo" className={screenStyles.input} placeholder="Fecha l\u00edmite" {...plazo.props} /></div>
          <div className={screenStyles.field}><p className={screenStyles.label}>Formas de apoyo</p><div className={screenStyles.wrap}>{(formas ?? []).map((f, __i1) => (<Fragment key={__i1}><button className={f.cls} onClick={f.pick}>{f.name}</button></Fragment>))}</div><span className={screenStyles.badgeDemo}>Dinero y compras simulados</span></div>
          <div className={screenStyles.checkboxRow}><input id="benef" type="checkbox" {...benef.props} /><label htmlFor="benef"><b>La persona beneficiaria autorizó esta campaña</b><br /><span className={screenStyles.muted}>Obligatorio si la campaña es sobre otra persona.</span></label></div>
        </>)}
        {falta && (<><p className={screenStyles.error} role="alert">{faltaMsg}</p></>)}
        <button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-(--color-brand) text-white font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed" onClick={next}>Revisar</button>
      </div>
      </>)}
      
      {is_revisar && (<>
      <div className={screenStyles.header}><button className={screenStyles.iconButton} aria-label="Volver" onClick={nav.back}><svg className="w-6 h-6 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round] flex-none ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Revisa y publica</h1></div>
      <div className="flex gap-1.5 pt-0 px-4 pb-2 [&_i]:flex-1 [&_i]:h-1.5 [&_i]:rounded-[3px] [&_i]:bg-(--color-line) [&_i.on]:bg-(--color-brand)" aria-hidden="true"><i className="on"></i><i className="on"></i><i className="on"></i></div>
      <div className="flex-1 min-h-0 overflow-y-auto pt-1 px-4 pb-6 flex flex-col gap-4">
        <p className={`${screenStyles.muted} font-bold!`}>Paso 3 de 3 · Confirmación</p>
        <div className="bg-white border border-(--color-line) rounded-[20px] p-4 shadow-[0_2px_8px_rgba(32,33,36,.05)] flex flex-col gap-2"><span className={resTagCls}>{resTag}</span><h2 className="text-[22px]!">{resTitle}</h2><p className={screenStyles.muted}>{desc.value}</p></div>
        <div className="bg-white border border-(--color-line) rounded-[20px] p-4 shadow-[0_2px_8px_rgba(32,33,36,.05)] flex flex-col gap-2"><p className={screenStyles.label}>Zona aproximada</p><div className={screenStyles.row}><svg className="w-6 h-6 fill-none stroke-current stroke-2 [stroke-linecap:round] [stroke-linejoin:round] flex-none ic text-(--color-brand)!" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg><p>Campoy · Sector 2 <span className={screenStyles.muted}>(no se muestra tu dirección exacta)</span></p></div></div>
        <div className={screenStyles.field}><p className={screenStyles.label}>¿Quién lo verá?</p><div className={screenStyles.wrap}><button className={alJunta} onClick={setJunta}>Mi junta primero</button><button className={alCom} onClick={setCom}>Mi comunidad</button></div></div>
        <div className={screenStyles.checkboxRow}><input id="off" type="checkbox" {...sinRed.props} /><label htmlFor="off"><b>Simular que no tengo conexión</b><br /><span className={screenStyles.muted}>Se guardará como pendiente y se enviará al reconectar.</span></label></div>
        {limite && (<><p className={screenStyles.error} role="alert">Llegaste al límite de 3 solicitudes de cachuelos por día. Puedes seguir respondiendo mensajes. Vuelve mañana para publicar otra.</p></>)}
        <button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-(--color-brand) text-white font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed" onClick={publish}>{pubLabel}</button>
        <p className={`${screenStyles.muted} text-center!`}>Nada se publica hasta que tú confirmes.</p>
      </div>
      </>)}
      
      {is_listo && (<>
      <div className={screenStyles.header}><h1 className="pl-2">{listoTitle}</h1></div>
      <div className="flex-1 min-h-0 overflow-y-auto pt-1 px-4 pb-6 flex flex-col gap-5 justify-center! text-center! items-center!">
        <svg className="w-6 h-6 fill-none stroke-current stroke-[1.5] [stroke-linecap:round] [stroke-linejoin:round] flex-none ic w-24! h-24! text-[#2f5a2d]!" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M8 12.500l3 3 5-6" /></svg>
        <p role="status" className="text-[19px]!">{listoText}</p>
        <span className={screenStyles.badgeDemo}>Estado: {listoEstado}</span>
        <a className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-(--color-brand) text-white font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed" href="/favores">Ver en el muro</a>
        <button className="min-h-13 rounded-[18px] border-2 border-(--color-line) bg-white text-(--color-ink) font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed" onClick={reset}>Publicar otra</button>
        <a className="min-h-13 rounded-[18px] border-2 border-(--color-line) bg-white text-(--color-ink) font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed" href="/inicio">Volver al inicio</a>
      </div>
      </>)}
      
      </div>
    </div>
  );
}
