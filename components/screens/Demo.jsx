"use client";

import { useViewStack } from "@/lib/hooks/use-view-stack";

import { Fragment } from "react";
import { screenStyles } from "./screen-styles";
import { animateMotion } from "./animate-motion";

const animateSkeleton = animateMotion(
  [{ backgroundPosition: "200% 0" }, { backgroundPosition: "-200% 0" }],
  { duration: 1400, iterations: Infinity },
);

/**
 * Pantalla Demo del prototipo BarrioConecta.
 * Los valores de demostración sustituyen a la lógica del prototipo (DCLogic), que no se migró.
 */
export default function Demo() {
  const nav = useViewStack("consola");
  const askReset = () => {};
  const closeReset = () => {};
  const dates = [{name: "8 nov", cls: screenStyles.chipActive, pick: () => {}}, {name: "30 nov", cls: screenStyles.chip, pick: () => {}}, {name: "1 dic", cls: screenStyles.chip, pick: () => {}}];
  const doReset = () => {};
  const ia = [{name: "Controlada", cls: screenStyles.chipActive, pick: () => {}}, {name: "Sin respuesta", cls: screenStyles.chip, pick: () => {}}];
  const inst = [{name: "Sin respuesta", cls: screenStyles.chipActive, pick: () => {}}, {name: "Ayuda solicitada", cls: screenStyles.chip, pick: () => {}}, {name: "Respuesta confirmada", cls: screenStyles.chip, pick: () => {}}];
  const log = [];
  const monthInfo = "Noviembre en curso: se muestra avance de Vecino del mes.";
  const noLog = true;
  const retried = false;
  const retry = () => {};
  const roles = [{name: "Vecino", cls: screenStyles.chipActive, pick: () => {}}, {name: "Coordinador", cls: screenStyles.chip, pick: () => {}}, {name: "Editor", cls: screenStyles.chip, pick: () => {}}];
  const sheetReset = false;
  const signals = [{name: "Normal", cls: screenStyles.chipActive, pick: () => {}}, {name: "Intermitente", cls: screenStyles.chip, pick: () => {}}, {name: "Sin conexión", cls: screenStyles.chip, pick: () => {}}];
  const sms = [{name: "Activa", cls: screenStyles.chipActive, pick: () => {}}, {name: "Caída", cls: screenStyles.chip, pick: () => {}}];
  const tCon = screenStyles.chipActive;
  const tEst = screenStyles.chip;
  const terrs = [{name: "Costa · Lima", cls: screenStyles.chipActive, pick: () => {}}, {name: "Sierra · Cusco", cls: screenStyles.chip, pick: () => {}}, {name: "Selva · Loreto", cls: screenStyles.chip, pick: () => {}}];
  const title = "Consola de demostración";
  const users = [{name: "María", cls: screenStyles.chipActive, pick: () => {}}, {name: "Luis", cls: screenStyles.chip, pick: () => {}}, {name: "Carlos", cls: screenStyles.chip, pick: () => {}}];
  return (
    <div className={screenStyles.screen}>
      <div className={screenStyles.frame}>
      <div className="flex items-center gap-1 pt-2 pr-2 pb-2 pl-4 min-h-16 flex-none [&_h1]:text-[22px] [&_h1]:flex-1"><h1>{title}</h1><span className={screenStyles.badgeDemo}>Solo para la demostración</span></div>
      <div className="flex gap-2 pt-0 px-4 pb-2 flex-none" role="tablist"><button className={tCon} role="tab" onClick={() => nav.go("consola")}>Consola (P55)</button><button className={tEst} role="tab" onClick={() => nav.go("estados")}>Estados (P56)</button></div>
      
      {nav.is("consola") && (<>
      <div className={screenStyles.content}>
        <div className="bg-[#fff4d6] text-[#5c3d00] border border-[#e6c77a] rounded-[14px] px-3 py-2.5 text-[14px] font-bold" role="note">Esta consola está separada del recorrido normal. En la versión Next.js escribirá en la base local; aquí solo muestra su interfaz y registra eventos.</div>
        <div className={screenStyles.card}><p className={screenStyles.label}>Usuario</p><div className={screenStyles.wrap}>{(users ?? []).map((o, __i1) => (<Fragment key={__i1}><button className={o.cls} onClick={o.pick}>{o.name}</button></Fragment>))}</div>
          <p className={screenStyles.label}>Rol</p><div className={screenStyles.wrap}>{(roles ?? []).map((o, __i1) => (<Fragment key={__i1}><button className={o.cls} onClick={o.pick}>{o.name}</button></Fragment>))}</div>
          <p className={screenStyles.label}>Territorio</p><div className={screenStyles.wrap}>{(terrs ?? []).map((o, __i1) => (<Fragment key={__i1}><button className={o.cls} onClick={o.pick}>{o.name}</button></Fragment>))}</div></div>
        <div className={screenStyles.card}><p className={screenStyles.label}>Fecha del simulador</p><div className={screenStyles.wrap}>{(dates ?? []).map((o, __i1) => (<Fragment key={__i1}><button className={o.cls} onClick={o.pick}>{o.name}</button></Fragment>))}</div><p className={screenStyles.muted}>{monthInfo}</p></div>
        <div className={screenStyles.card}><p className={screenStyles.label}>Señal del dispositivo</p><div className={screenStyles.wrap}>{(signals ?? []).map((o, __i1) => (<Fragment key={__i1}><button className={o.cls} onClick={o.pick}>{o.name}</button></Fragment>))}</div>
          <p className={screenStyles.label}>Central SMS simulada</p><div className={screenStyles.wrap}>{(sms ?? []).map((o, __i1) => (<Fragment key={__i1}><button className={o.cls} onClick={o.pick}>{o.name}</button></Fragment>))}</div>
          <p className={screenStyles.label}>Respuesta de IA simulada</p><div className={screenStyles.wrap}>{(ia ?? []).map((o, __i1) => (<Fragment key={__i1}><button className={o.cls} onClick={o.pick}>{o.name}</button></Fragment>))}</div>
          <p className={screenStyles.label}>Respuesta institucional simulada</p><div className={screenStyles.wrap}>{(inst ?? []).map((o, __i1) => (<Fragment key={__i1}><button className={o.cls} onClick={o.pick}>{o.name}</button></Fragment>))}</div></div>
        <div className={screenStyles.card}><p className={screenStyles.label}>Eventos</p>{(log ?? []).map((e, __i1) => (<Fragment key={__i1}><p className="font-[ui-monospace,Menlo,monospace] text-[13px] text-(--color-ink) bg-[#f6f2ec] rounded-[12px] px-2.5 py-2">{e.t}</p></Fragment>))}{noLog && (<><p className={screenStyles.muted}>Todavía no hay eventos.</p></>)}</div>
        <button className={screenStyles.buttonSecondary} onClick={askReset}>Restablecer datos de ejemplo</button>
      </div>
      </>)}
      
      {nav.is("estados") && (<>
      <div className={screenStyles.content}>
        <p className={screenStyles.muted}>Estados que cada pantalla debe resolver: carga, vacío, error, permiso denegado, sin conexión, información antigua, confirmación, envío pendiente y simulación.</p>
        <div className={screenStyles.card}><span className={screenStyles.badge}>Carga</span><div ref={animateSkeleton} className="h-3.5 rounded-[7px] bg-[linear-gradient(90deg,#EDE6DC,#F7F2EA,#EDE6DC)] bg-size-[200%_100%] w-[70%]!"></div><div ref={animateSkeleton} className="h-3.5 rounded-[7px] bg-[linear-gradient(90deg,#EDE6DC,#F7F2EA,#EDE6DC)] bg-size-[200%_100%]"></div><div ref={animateSkeleton} className="h-3.5 rounded-[7px] bg-[linear-gradient(90deg,#EDE6DC,#F7F2EA,#EDE6DC)] bg-size-[200%_100%] w-[50%]!"></div></div>
        <div className={screenStyles.card}><span className={screenStyles.badge}>Vacío con acción</span><p className="font-bold">Aún no tienes coordinaciones</p><p className={screenStyles.muted}>Se crean cuando ambas personas aceptan.</p><a className={`${screenStyles.button} min-h-12!`} href="/favores">Ver favores cercanos</a></div>
        <div className={screenStyles.card}><span className={screenStyles.badgeAlert}>Error recuperable</span><p className="font-bold">No pudimos cargar los avisos</p><p className={screenStyles.muted}>Revisa tu conexión e intenta de nuevo. No se perdió nada.</p><button className={`${screenStyles.buttonOutline} min-h-12!`} onClick={retry}>Reintentar</button>{retried && (<><p className={screenStyles.success} role="status">✓ Listo, volvimos a cargar.</p></>)}</div>
        <div className={screenStyles.card}><span className={screenStyles.badgeAlert}>Permiso denegado</span><p className="font-bold">No tenemos acceso a tu ubicación</p><p className={screenStyles.muted}>Puedes elegir tu zona a mano o activar el permiso en los ajustes del navegador.</p><a className={`${screenStyles.buttonOutline} min-h-12!`} href="/">Elegir mi zona</a></div>
        <div className={screenStyles.card}><span className={screenStyles.badge}>Sin conexión</span><div className="bg-[#fff4d6] text-[#5c3d00] border border-[#e6c77a] rounded-[14px] px-3 py-2.5 text-[14px] font-bold">Sin conexión · mostrando datos guardados. Última sincronización completa: hoy 7:50 a. m.</div></div>
        <div className={screenStyles.card}><span className={screenStyles.badge}>Información antigua</span><p className="font-bold">Corte de agua en la avenida principal</p><span className={screenStyles.badgeDemo}>Sin actualización reciente · hace 3 h</span><p className={screenStyles.muted}>Un reporte viejo no se marca como resuelto por el simple paso del tiempo.</p></div>
        <div className={screenStyles.card}><span className={screenStyles.badge}>Confirmación</span><p className="font-bold">¿Cancelar esta coordinación?</p><p className={screenStyles.muted}>El acuerdo se conserva. Esto no se puede deshacer.</p><div className="grid-cols-2 grid! gap-2!"><button className={`${screenStyles.buttonSecondary} min-h-12!`}>Volver</button><button className={`${screenStyles.button} min-h-12!`}>Sí, cancelar</button></div></div>
        <div className={screenStyles.card}><span className={screenStyles.badgeDemo}>Envío pendiente</span><p className="font-bold">Tu reporte se enviará al reconectar</p><a className={`${screenStyles.buttonOutline} min-h-12!`} href="/offline">Ver pendientes</a></div>
        <div className={screenStyles.card}><span className={screenStyles.badgeDemo}>Simulación</span><p className={screenStyles.muted}>Identidad, biometría, entidades, pagos, SMS y respuestas de IA llevan siempre esta insignia mientras sean simulados.</p></div>
      </div>
      </>)}
      
      <nav className={screenStyles.navigation} aria-label="Principal">
        <a href="/inicio"><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" /></svg>Inicio</a>
        <a href="/mapa"><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z" /><circle cx="12" cy="10" r="2.5" /></svg>Mapa</a>
        <a href="/perfil"><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>Mi perfil</a>
      </nav>
      
      {sheetReset && (<>
      <div className={screenStyles.scrim} aria-hidden="true"></div>
      <div className="absolute left-0 right-0 bottom-0 bg-white rounded-[24px_24px_0_0] border-t border-t-(--color-line) shadow-[0_-8px_24px_rgba(32,33,36,.15)] px-4 py-5 flex flex-col gap-3 z-5" role="dialog" aria-label="Restablecer datos"><h2 className="text-[22px]!">¿Restablecer los datos de ejemplo?</h2><p className={screenStyles.muted}>Se borrarán los cambios de esta demostración y volverán las semillas originales.</p><button className={screenStyles.button} onClick={doReset}>Sí, restablecer</button><button className={screenStyles.buttonSecondary} onClick={closeReset}>Cancelar</button></div>
      </>)}
      </div>
    </div>
  );
}
