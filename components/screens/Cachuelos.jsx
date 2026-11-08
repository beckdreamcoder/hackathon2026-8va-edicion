"use client";

import { useViewStack } from "@/lib/hooks/use-view-stack";

import { useTextInput } from "@/lib/hooks/use-text-input";

import { Fragment } from "react";
import { screenStyles } from "./screen-styles";

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
  const chipM = "min-h-11 rounded-full border-[1.5px] border-(--color-brand) bg-(--color-brand) px-3.5 py-0 font-bold text-[15px] whitespace-nowrap text-white chip";
  const chipP = "min-h-11 rounded-full border-[1.5px] border-[#cfc7bf] bg-white px-3.5 py-0 font-bold text-[15px] whitespace-nowrap chip";
  const completed = false;
  const cond = useTextInput("");
  const confirmAg = () => {};
  const dM = "pendiente";
  const dP = "pendiente";
  const dateSel = "Jueves";
  const dates = [{name: "Jueves", cls: "min-h-11 rounded-full border-[1.5px] border-(--color-brand) bg-(--color-brand) px-3.5 py-0 font-bold text-[15px] whitespace-nowrap text-white chip", pick: () => {}}, {name: "Viernes", cls: "min-h-11 rounded-full border-[1.5px] border-[#cfc7bf] bg-white px-3.5 py-0 font-bold text-[15px] whitespace-nowrap chip", pick: () => {}}, {name: "Sábado", cls: "min-h-11 rounded-full border-[1.5px] border-[#cfc7bf] bg-white px-3.5 py-0 font-bold text-[15px] whitespace-nowrap chip", pick: () => {}}];
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
  const tabServ = "min-h-11 rounded-full border-[1.5px] border-(--color-brand) bg-(--color-brand) px-3.5 py-0 font-bold text-[15px] whitespace-nowrap text-white chip";
  const tabTrab = "min-h-11 rounded-full border-[1.5px] border-[#cfc7bf] bg-white px-3.5 py-0 font-bold text-[15px] whitespace-nowrap chip";
  return (
    <div className="m-0 bg-white text-(--color-ink) font-[Nunito,system-ui,sans-serif] text-[17px] leading-[1.4] [&_h1]:font-[Nunito,system-ui,sans-serif] [&_h1]:m-0 [&_h1]:leading-[1.15] [&_h1]:tracking-[-.01em] [&_h2]:font-[Nunito,system-ui,sans-serif] [&_h2]:m-0 [&_h2]:leading-[1.15] [&_h2]:tracking-[-.01em] [&_h3]:font-[Nunito,system-ui,sans-serif] [&_h3]:m-0 [&_h3]:leading-[1.15] [&_h3]:tracking-[-.01em] [&_h4]:font-[Nunito,system-ui,sans-serif] [&_h4]:m-0 [&_h4]:leading-[1.15] [&_h4]:tracking-[-.01em] [&_.t]:font-[Nunito,system-ui,sans-serif] [&_.t]:m-0 [&_.t]:leading-[1.15] [&_.t]:tracking-[-.01em] [&_p]:m-0 [&_button]:cursor-pointer [&_:focus-visible]:outline-3 [&_:focus-visible]:outline-(--color-ink) [&_:focus-visible]:outline-offset-2 [&_textarea.in]:px-3.5 [&_textarea.in]:py-3 [&_textarea.in]:min-h-21 [&_textarea.in]:resize-none [&_details_summary]:min-h-11 [&_details_summary]:flex [&_details_summary]:items-center [&_details_summary]:cursor-pointer [&_details_summary]:font-bold [&_details_summary]:text-(--color-brand)">
      <div className={screenStyles.frame}>
      
      {nav.is("lista") && (<><div className={screenStyles.header}><button className={screenStyles.iconButton} aria-label="Volver" onClick={nav.back}><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Cachuelos</h1></div></>)}
      {nav.is("detalle") && (<><div className={screenStyles.header}><button className={screenStyles.iconButton} aria-label="Volver" onClick={nav.back}><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Detalle del servicio</h1></div></>)}
      {nav.is("perfil") && (<><div className={screenStyles.header}><button className={screenStyles.iconButton} aria-label="Volver" onClick={nav.back}><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Perfil de vecino</h1></div></>)}
      {nav.is("acuerdo") && (<><div className={screenStyles.header}><button className={screenStyles.iconButton} aria-label="Volver" onClick={nav.back}><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Ficha de acuerdo</h1></div></>)}
      
      <div className="flex gap-2 pt-0 px-4 pb-2 items-center flex-none [&_span]:text-[14px] [&_span]:text-(--color-muted) [&_span]:font-bold [&_span]:whitespace-nowrap [&_.chip]:min-h-10 [&_.chip]:px-3 [&_.chip]:py-0" role="group" aria-label="Probar como"><span>Probar como:</span><button className={chipM} onClick={asM}>María (pide)</button><button className={chipP} onClick={asP}>Pedro (ofrece)</button></div>
      
      {nav.is("lista") && (<>
      <div className={screenStyles.content}>
        <div className={screenStyles.wrap}><button className={tabServ} onClick={setServ}>Necesito un servicio</button><button className={tabTrab} onClick={setTrab}>Busco trabajo</button></div>
        {tabIsServ && (<>
          <button className="bg-white border border-(--color-line) rounded-[20px] p-4 shadow-[0_1px_3px_rgba(0,0,0,.1),0_1px_2px_-1px_rgba(0,0,0,.1)] flex flex-col gap-2 text-left w-full border-l-0 border-t-[5px] border-t-[#8a5300]" onClick={() => nav.go("detalle")}><div className={screenStyles.row}><span className={screenStyles.badgeCachuelo}>A convenir</span><span className={screenStyles.badge}>{statusTxt}</span></div><h3 className="text-[19px]!">Gasfitería · Pedro arregla fugas</h3><p className={screenStyles.muted}>Campoy Sector 3 · Disponible esta semana</p><p className="font-bold! text-[15px]!">Lo recomiendan 4 vecinos de tu comunidad</p></button>
          <div className="bg-white border border-(--color-line) rounded-[20px] p-4 shadow-[0_1px_3px_rgba(0,0,0,.1),0_1px_2px_-1px_rgba(0,0,0,.1)] flex flex-col gap-2 text-left w-full border-l-0 border-t-[5px] border-t-[#8a5300]"><div className={screenStyles.row}><span className={screenStyles.badgeCachuelo}>S/ 25 por hora</span><span className={screenStyles.badgeDemo}>Ejemplo</span></div><h3 className="text-[19px]!">Clases de matemática de secundaria</h3><p className={screenStyles.muted}>Campoy Sector 1 · Tardes · Vecina nueva</p></div>
        </>)}
        {tabIsTrab && (<>
          <div className="bg-white border border-(--color-line) rounded-[20px] p-4 shadow-[0_1px_3px_rgba(0,0,0,.1),0_1px_2px_-1px_rgba(0,0,0,.1)] flex flex-col gap-2 text-left w-full border-l-0 border-t-[5px] border-t-[#8a5300]"><div className={screenStyles.row}><span className={screenStyles.badgeCachuelo}>S/ 60 referencial</span><span className={screenStyles.badgeDemo}>Ejemplo</span></div><h3 className="text-[19px]!">Necesito pintar un cuarto pequeño</h3><p className={screenStyles.muted}>Campoy Sector 2 · Fin de semana</p></div>
        </>)}
        <a className={screenStyles.button} href="/publicar"><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>Publicar cachuelo</a>
      </div>
      </>)}
      
      {nav.is("detalle") && (<>
      <div className={screenStyles.content}>
        <div className="bg-white border border-(--color-line) rounded-[20px] p-4 shadow-[0_1px_3px_rgba(0,0,0,.1),0_1px_2px_-1px_rgba(0,0,0,.1)] flex flex-col gap-2 text-left w-full border-l-0 border-t-[5px] border-t-[#8a5300]"><div className={screenStyles.row}><span className={screenStyles.badgeCachuelo}>A convenir</span><span className={screenStyles.badge}>{statusTxt}</span></div><h2 className="text-[24px]!">Arreglo fugas de agua en cocina y baño</h2><p>Llevo mis herramientas. Primero reviso y te digo el precio antes de empezar.</p><p className={screenStyles.muted}>Gasfitería · Campoy Sector 3 · Esta semana, por las tardes</p></div>
        <button className="bg-white border border-(--color-line) rounded-[20px] p-4 shadow-[0_1px_3px_rgba(0,0,0,.1),0_1px_2px_-1px_rgba(0,0,0,.1)] flex flex-col gap-2 text-left w-full flex-row! items-center!" onClick={() => nav.go("perfil")}><span className="w-12 h-12 rounded-[50%] grid place-items-center font-extrabold font-[Nunito,system-ui,sans-serif] text-[19px] flex-none bg-[#fbebd0] text-[#6b4000]" aria-hidden="true">P</span><div className={screenStyles.grow}><b>Pedro</b><p className={screenStyles.muted}>Recomendado por 4 vecinos</p></div><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5l7 7-7 7" /></svg></button>
        <div className="bg-white border border-(--color-line) rounded-[20px] p-4 shadow-[0_1px_3px_rgba(0,0,0,.1),0_1px_2px_-1px_rgba(0,0,0,.1)] flex flex-col gap-2 text-left w-full"><p className="font-bold!">Lo recomiendan en tu comunidad</p><p className={screenStyles.muted}>«Llegó puntual y explicó el costo antes.» — Rosa</p></div>
        {canRequest && (<><button className={screenStyles.button} onClick={request}>Solicitar servicio</button><button className={screenStyles.buttonSecondary} onClick={request}>Me interesa</button></>)}
        {reqSentM && (<><div className="bg-white border border-(--color-line) rounded-[20px] p-4 shadow-[0_1px_3px_rgba(0,0,0,.1),0_1px_2px_-1px_rgba(0,0,0,.1)] flex flex-col gap-2 text-left w-full" role="status"><p className={screenStyles.success}>✓ Solicitud enviada a Pedro</p><p className={screenStyles.muted}>Pedro debe aceptar para abrir el chat. Cambia a «Pedro» arriba para probarlo.</p></div></>)}
        {pedroPend && (<><div className="bg-white border border-(--color-line) rounded-[20px] p-4 shadow-[0_1px_3px_rgba(0,0,0,.1),0_1px_2px_-1px_rgba(0,0,0,.1)] flex flex-col gap-2 text-left w-full" role="status"><p className="font-bold!">María solicita tu servicio</p><div className="grid-cols-2 grid! gap-2!"><button className={`${screenStyles.buttonSecondary} min-h-12!`} onClick={reject}>Rechazar</button><button className={`${screenStyles.button} min-h-12!`} onClick={accept}>Aceptar</button></div></div></>)}
        {accepted && (<><button className={screenStyles.button} onClick={() => nav.go("acuerdo")}>Ver ficha de acuerdo</button><a className={screenStyles.buttonSecondary} href="/favores">Abrir chat temporal</a></>)}
        {rejected && (<><div className="bg-white border border-(--color-line) rounded-[20px] p-4 shadow-[0_1px_3px_rgba(0,0,0,.1),0_1px_2px_-1px_rgba(0,0,0,.1)] flex flex-col gap-2 text-left w-full" role="status"><p className="font-bold!">La solicitud no fue aceptada</p></div></>)}
        <p className={screenStyles.muted}>Los pagos no se hacen en la app. Revisa las condiciones y evita adelantos a personas que no conoces.</p>
      </div>
      </>)}
      
      {nav.is("perfil") && (<>
      <div className={screenStyles.content}>
        <div className="bg-white border border-(--color-line) rounded-[20px] p-4 shadow-[0_1px_3px_rgba(0,0,0,.1),0_1px_2px_-1px_rgba(0,0,0,.1)] flex flex-col gap-2 text-center w-full items-center!"><span className="w-12 h-12 rounded-[50%] grid place-items-center font-extrabold font-[Nunito,system-ui,sans-serif] text-[19px] flex-none bg-[#fbebd0] text-[#6b4000] w-18! h-18! text-[28px]!" aria-hidden="true">P</span><h2 className="text-[24px]!">Pedro</h2><p className={screenStyles.muted}>Campoy Sector 3 · Gasfitería</p><span className={screenStyles.badgeDemo}>Identidad simulada · DNI privado</span></div>
        <div className="bg-white border border-(--color-line) rounded-[20px] p-4 shadow-[0_1px_3px_rgba(0,0,0,.1),0_1px_2px_-1px_rgba(0,0,0,.1)] flex flex-col gap-2 text-left w-full"><p className="font-bold!">Recomendado por 4 vecinos</p><details><summary>Ver comentarios</summary><div className="pt-1.5 flex! flex-col! gap-2.5!"><p className={screenStyles.muted}>«Llegó puntual y explicó el costo antes.» — Rosa · Servicio completado</p><p className={screenStyles.muted}>«Arregló la fuga el mismo día.» — Carlos · Servicio completado</p></div></details><p className={screenStyles.muted}>Sin estrellas: solo recomendaciones tras una coordinación completada.</p></div>
        <button className={screenStyles.buttonSecondary}>Reportar o bloquear</button>
      </div>
      </>)}
      
      {nav.is("acuerdo") && (<>
      <div className={screenStyles.content}>
        <div className="bg-white border border-(--color-line) rounded-[20px] p-4 shadow-[0_1px_3px_rgba(0,0,0,.1),0_1px_2px_-1px_rgba(0,0,0,.1)] flex flex-col gap-2 text-left w-full"><span className={screenStyles.badge}>{statusTxt}</span><div className={s1 ? "flex gap-2.5 items-center text-[15px] [&_i]:w-3 [&_i]:h-3 [&_i]:rounded-[50%] [&_i]:bg-[#2f5a2d] [&_i]:flex-none" : "flex gap-2.5 items-center text-[15px] [&_i]:w-3 [&_i]:h-3 [&_i]:rounded-[50%] [&_i]:bg-[#cfc7bf] [&_i]:flex-none"}><i></i>Solicitud aceptada</div><div className={s2 ? "flex gap-2.5 items-center text-[15px] [&_i]:w-3 [&_i]:h-3 [&_i]:rounded-[50%] [&_i]:bg-[#2f5a2d] [&_i]:flex-none" : "flex gap-2.5 items-center text-[15px] [&_i]:w-3 [&_i]:h-3 [&_i]:rounded-[50%] [&_i]:bg-[#cfc7bf] [&_i]:flex-none"}><i></i>Acuerdo confirmado por ambos</div><div className={s3 ? "flex gap-2.5 items-center text-[15px] [&_i]:w-3 [&_i]:h-3 [&_i]:rounded-[50%] [&_i]:bg-[#2f5a2d] [&_i]:flex-none" : "flex gap-2.5 items-center text-[15px] [&_i]:w-3 [&_i]:h-3 [&_i]:rounded-[50%] [&_i]:bg-[#cfc7bf] [&_i]:flex-none"}><i></i>Servicio realizado</div></div>
        {editing && (<>
          <div className="bg-white border border-(--color-line) rounded-[20px] p-4 shadow-[0_1px_3px_rgba(0,0,0,.1),0_1px_2px_-1px_rgba(0,0,0,.1)] flex flex-col gap-2 text-left w-full"><p className={screenStyles.label}>{editHint}</p>
            <div className={screenStyles.field}><label htmlFor="pr">Precio acordado</label><input id="pr" className={screenStyles.input} {...price.props} /></div>
            <div className={screenStyles.field}><p className={screenStyles.label}>Fecha</p><div className={screenStyles.wrap}>{(dates ?? []).map((d, __i1) => (<Fragment key={__i1}><button className={d.cls} onClick={d.pick}>{d.name}</button></Fragment>))}</div></div>
            <div className={screenStyles.field}><label htmlFor="cd">Condiciones</label><textarea id="cd" className="min-h-21 border-[1.5px] border-[#cfc7bf] rounded-[16px] px-3.5 py-3 bg-white w-full resize-none" {...cond.props}></textarea></div>
            <button className={screenStyles.button} onClick={propose}>Proponer acuerdo</button></div>
        </>)}
        {proposed && (<>
          <div className="bg-white border border-(--color-line) rounded-[20px] p-4 shadow-[0_1px_3px_rgba(0,0,0,.1),0_1px_2px_-1px_rgba(0,0,0,.1)] flex flex-col gap-2 text-left w-full"><p className={screenStyles.label}>Acuerdo propuesto</p><p><b>{price.value}</b> · {dateSel}</p><p className={screenStyles.muted}>{cond.value}</p><p>Pedro: <b>{cP}</b> · María: <b>{cM}</b></p>
            {iNeedConfirm && (<><button className={screenStyles.button} onClick={confirmAg}>Confirmar acuerdo</button></>)}
            {iConfirmed && (<><p className={screenStyles.success} role="status">Esperando confirmación de la otra persona.</p></>)}
            <button className={screenStyles.buttonSecondary} onClick={changeTerms}>Cambiar términos</button><p className={screenStyles.muted}>Si cambias los términos, se borran las confirmaciones anteriores.</p></div>
        </>)}
        {agreed && (<>
          <div className="bg-white border border-(--color-line) rounded-[20px] p-4 shadow-[0_1px_3px_rgba(0,0,0,.1),0_1px_2px_-1px_rgba(0,0,0,.1)] flex flex-col gap-2 text-left w-full"><p className={screenStyles.success}>✓ Acuerdo confirmado por ambos</p><p className={screenStyles.muted}>Esto no es un pago recibido. Paguen directamente como acordaron.</p>
            <button className={screenStyles.button} onClick={doneBtn}>{doneLbl}</button><p className={screenStyles.muted}>Cierre: María {dM} · Pedro {dP}</p></div>
        </>)}
        {completed && (<>
          <div className="bg-white border border-(--color-line) rounded-[20px] p-4 shadow-[0_1px_3px_rgba(0,0,0,.1),0_1px_2px_-1px_rgba(0,0,0,.1)] flex flex-col gap-2 text-left w-full"><p className={screenStyles.success}>✓ Servicio completado por ambos</p>
            {canRec && (<><button className={screenStyles.button} onClick={recommend}>Recomendar con Visto Bueno Vecinal</button></>)}
            {recDone && (<><p className={screenStyles.success} role="status">✓ Recomendación emitida. Solo una por servicio.</p></>)}</div>
        </>)}
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
