"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { screenStyles } from "./screen-styles";
import { ScreenShell } from "./screen-shell";
import { useTextInput } from "@/lib/hooks/use-text-input";
import { useCheckbox } from "@/lib/hooks/use-checkbox";
import { useSesion, logEvento } from "@/lib/demo/shared";
import { useDemoState, setDemo } from "@/lib/demo/store";
import { JUNTAS, MIEMBROS, useAvisosJunta, crearAviso, editarAviso, eliminarAviso } from "@/lib/demo/juntas";
import { usePerfilDatos, nombreDe } from "@/lib/demo/perfiles";

const MOV = { stage: "none", req: { cuando: "" } };

/** Mi junta vecinal: ficha, miembros, avisos comunitarios (con detalle y publicación), exploración de juntas y movilidad prioritaria. */
export default function Junta() {
  const router = useRouter();
  const [sesion, setSesion] = useSesion();
  const [mov] = useDemoState("movilidad-hospital", MOV);
  const [datos] = usePerfilDatos();
  const avisos = useCheckbox(true);
  const id = sesion.juntaId;
  const j = id ? JUNTAS[id] ?? JUNTAS.campoy : null;
  const lista = useAvisosJunta(id);
  const uid = sesion.userId;
  const puedePublicar = sesion.rol !== "Vecino"; // permisos existentes: coordinación y edición publican avisos
  const [vista, setVista] = useState("mi"); // mi | explorar | aviso | nuevo
  const [selId, setSelId] = useState("");
  const [editando, setEditando] = useState(false);
  const [confirmar, setConfirmar] = useState(false);
  const [err, setErr] = useState("");
  const [ok, setOk] = useState("");
  const titulo = useTextInput("");
  const texto = useTextInput("");
  const aviso = lista.find((a) => a.id === selId);
  const miembros = j ? [...new Set([...(MIEMBROS[id] ?? []), uid])] : [];

  const unirme = (jid) => { setSesion({ juntaId: jid }); setVista("mi"); setOk(`Te uniste a ${JUNTAS[jid].name}.`); logEvento(`Se unió a la ${JUNTAS[jid].name}`); };
  const salir = () => { setSesion({ juntaId: null }); setVista("mi"); setOk(""); logEvento("Salió de su junta (puede seguir usando toda la app)"); };
  const verPerfil = (v) => { setDemo("perfil-foco", { id: "" }, { id: v }); router.push("/perfil"); };

  const publicar = () => {
    const r = crearAviso({ juntaId: id, titulo: titulo.value, texto: texto.value, autor: uid, fecha: sesion.fecha });
    if (!r.ok) { setErr(r.error); return; }
    setErr(""); titulo.setValue(""); texto.setValue(""); setSelId(r.id); setVista("aviso"); setOk("✓ Aviso publicado: ya lo ven los miembros de la junta.");
  };
  const abrirAviso = (a) => { setSelId(a.id); setEditando(false); setConfirmar(false); setErr(""); setOk(""); setVista("aviso"); };
  const abrirEdicion = () => { titulo.setValue(aviso.titulo); texto.setValue(aviso.texto); setErr(""); setEditando(true); };
  const guardarEdicion = () => { const r = editarAviso(aviso.id, uid, { titulo: titulo.value, texto: texto.value }); if (!r.ok) { setErr(r.error); return; } setErr(""); setEditando(false); setOk("✓ Cambios guardados."); };
  const borrar = () => { const r = eliminarAviso(aviso.id, uid); if (!r.ok) { setErr(r.error); return; } setVista("mi"); setConfirmar(false); setOk("Aviso eliminado."); };

  if (vista === "explorar" || !j) {
    return (
      <ScreenShell title={j ? "Explorar juntas" : "Mi junta vecinal"} onBack={() => (j ? setVista("mi") : router.back())}>
        {!j && (<div className={screenStyles.card} role="status"><p className="font-bold!">Aún no perteneces a una junta</p><p className={screenStyles.muted}>Sumarte es voluntario. Puedes usar toda la app, incluidas las emergencias, sin junta.</p></div>)}
        {ok && (<p className={screenStyles.success} role="status">{ok}</p>)}
        <p className={screenStyles.muted}>Solo puedes unirte a juntas de tu departamento ({sesion.departamento}). Son juntas de demostración.</p>
        {Object.entries(JUNTAS).map(([jid, jj]) => {
          const aqui = jj.dep === sesion.departamento;
          return (
            <div key={jid} className={screenStyles.card}>
              <div className={screenStyles.row}><b className="flex-1">{jj.name}</b><span className={screenStyles.badgeDemo}>Demostración</span></div>
              <p className={screenStyles.muted}>{jj.zona} · {(MIEMBROS[jid] ?? []).length} miembros visibles · coordina {jj.coord}</p>
              {id === jid ? (<span className={screenStyles.badgeFavor}>Tu junta actual</span>) : aqui ? (<button className={screenStyles.button} onClick={() => unirme(jid)}>{id ? "Cambiarme a esta junta" : "Unirme"}</button>) : (<p className={screenStyles.muted}>Fuera de tu zona ({jj.dep}): no disponible para unirte.</p>)}
            </div>
          );
        })}
      </ScreenShell>
    );
  }

  if (vista === "nuevo") {
    return (
      <ScreenShell title="Publicar aviso" onBack={() => { setVista("mi"); setErr(""); }}>
        <span className={screenStyles.badgeDemo}>Aviso comunitario · no es una alerta oficial</span>
        {!puedePublicar && (<div className={screenStyles.card} role="note"><p className="font-bold!">Tu rol demo es «{sesion.rol}»</p><p className={screenStyles.muted}>Solo coordinación y edición publican avisos. Cambia el rol en la consola demo para probarlo.</p></div>)}
        <div className={screenStyles.field}><label htmlFor="at">Título</label><input id="at" className={screenStyles.input} maxLength={80} {...titulo.props} /></div>
        <div className={screenStyles.field}><label htmlFor="ax">Aviso</label><textarea id="ax" className="min-h-26 border-[1.5px] border-[#cfc7bf] rounded-[16px] px-3.5 py-3 bg-white w-full resize-none" maxLength={400} {...texto.props}></textarea></div>
        {err && (<p className={screenStyles.error} role="alert">{err}</p>)}
        <button className={screenStyles.button} disabled={!puedePublicar} onClick={publicar}>Publicar para {j.name}</button>
      </ScreenShell>
    );
  }

  if (vista === "aviso") {
    const mio = aviso && aviso.autor === uid && !aviso.semilla;
    return (
      <ScreenShell title="Aviso de la junta" onBack={() => { setVista("mi"); setErr(""); }}>
        {!aviso ? (<div className={screenStyles.card} role="status"><p className="font-bold!">Este aviso ya no está disponible</p><button className={screenStyles.button} onClick={() => setVista("mi")}>Volver a la junta</button></div>) : (<>
          {ok && (<p className={screenStyles.success} role="status">{ok}</p>)}
          <div className={screenStyles.card}>
            <div className={screenStyles.row}><span className={screenStyles.badgeSolidarity}>Aviso comunitario</span><span className={screenStyles.badgeDemo}>Demostración</span></div>
            {editando ? (<>
              <div className={screenStyles.field}><label htmlFor="et">Título</label><input id="et" className={screenStyles.input} maxLength={80} {...titulo.props} /></div>
              <div className={screenStyles.field}><label htmlFor="ex">Aviso</label><textarea id="ex" className="min-h-26 border-[1.5px] border-[#cfc7bf] rounded-[16px] px-3.5 py-3 bg-white w-full resize-none" maxLength={400} {...texto.props}></textarea></div>
              <div className="grid-cols-2 grid! gap-2!"><button className={screenStyles.buttonSecondary} onClick={() => setEditando(false)}>Descartar</button><button className={screenStyles.button} onClick={guardarEdicion}>Guardar</button></div>
            </>) : (<>
              <h2 className="text-[23px]!">{aviso.titulo}</h2>
              <p>{aviso.texto}</p>
              <p className={screenStyles.muted}>Publicado por <b>{nombreDe(aviso.autor, datos)}</b>{aviso.autor === j.coordId ? " (coordinación)" : ""} · {aviso.fecha} · ID {aviso.id}</p>
              <p className={screenStyles.muted}>Es un aviso de la junta vecinal. No es una alerta oficial: para emergencias llama al 105, 116 o 106.</p>
            </>)}
          </div>
          {mio && !editando && (confirmar
            ? (<div className={screenStyles.card} role="alertdialog" aria-label="Confirmar eliminación"><p className="font-bold!">¿Eliminar este aviso?</p><div className="grid-cols-2 grid! gap-2!"><button className={screenStyles.buttonSecondary} onClick={() => setConfirmar(false)}>No</button><button className={screenStyles.button} onClick={borrar}>Sí, eliminar</button></div></div>)
            : (<div className="grid-cols-2 grid! gap-2!"><button className={screenStyles.buttonOutline} onClick={abrirEdicion}>Editar</button><button className={screenStyles.buttonSecondary} onClick={() => setConfirmar(true)}>Eliminar</button></div>))}
          {!mio && (<p className={screenStyles.muted}>{aviso.semilla ? "Aviso de ejemplo: no se puede editar." : "Solo quien lo publicó puede editarlo o eliminarlo."}</p>)}
          {err && (<p className={screenStyles.error} role="alert">{err}</p>)}
        </>)}
      </ScreenShell>
    );
  }

  return (
    <ScreenShell title="Mi junta vecinal" onBack={() => router.back()}>
      {ok && (<p className={screenStyles.success} role="status">{ok}</p>)}
      <div className={screenStyles.card}>
        <h2 className="text-[21px]!">{j.name}</h2>
        <p className={screenStyles.muted}>{j.zona}</p>
        <span className={screenStyles.badgeDemo}>Junta de demostración</span>
        <p className={screenStyles.muted}>No tiene reconocimiento estatal real. Pertenecer no verifica a nadie. Tu rol demo: {sesion.rol}.</p>
      </div>
      {mov.stage !== "none" && mov.stage !== "cancel" && (
        <a className={`${screenStyles.card} border-(--color-brand)!`} href="/movilidad"><span className={screenStyles.badgeFavor}>Traslado prioritario</span><b>María necesita llegar al hospital</b><p className={screenStyles.muted}>{mov.req.cuando} · la junta recibe este aviso primero</p></a>
      )}

      <h3 className="text-[19px]!">Avisos de la junta</h3>
      <p className={screenStyles.muted}>Avisos comunitarios, no alertas oficiales. Alertas oficiales conectadas: ninguna.</p>
      {lista.length === 0 && (<div className={screenStyles.card} role="status"><p className="font-bold!">Aún no hay avisos</p></div>)}
      {lista.map((a) => (
        <button key={a.id} className={screenStyles.card} onClick={() => abrirAviso(a)} aria-label={`${a.titulo}, abrir aviso`}>
          <div className={screenStyles.row}><span className={screenStyles.badgeSolidarity}>Comunitario</span>{!a.semilla && (<span className={screenStyles.badgeFavor}>Nuevo</span>)}{a.semilla && (<span className={screenStyles.badgeDemo}>Ejemplo</span>)}</div>
          <p className="font-bold!">{a.titulo}</p>
          <p className="text-[14px] line-clamp-2">{a.texto}</p>
          <p className={screenStyles.muted}>{nombreDe(a.autor, datos)} · {a.fecha}</p>
        </button>
      ))}
      {puedePublicar
        ? (<button className={screenStyles.buttonOutline} onClick={() => { setErr(""); setOk(""); setVista("nuevo"); }}>Publicar aviso (rol {sesion.rol})</button>)
        : (<p className={screenStyles.muted}>Solo coordinación y edición publican avisos (tu rol demo: {sesion.rol}).</p>)}

      <h3 className="text-[19px]!">Miembros visibles ({miembros.length})</h3>
      <div className={screenStyles.card}>
        <div className="flex flex-wrap gap-2">{miembros.map((m) => (<button key={m} className={`${screenStyles.chip} min-h-10!`} onClick={() => verPerfil(m)}>{nombreDe(m, datos)}{m === j.coordId ? " · coordina" : ""}{m === uid ? " (tú)" : ""}</button>))}</div>
        <p className={screenStyles.muted}>Solo se muestran quienes dieron permiso. Nunca se muestran conversaciones privadas.</p>
      </div>

      <h3 className="text-[19px]!">Necesidades de los miembros</h3>
      <a className={screenStyles.card} href="/favores"><b>Escalera de 3 metros prestada</b><p className={screenStyles.muted}>Favor · María · visible porque lo publicó para su junta</p></a>
      <p className={screenStyles.muted}>Solo se muestran avisos y necesidades publicadas para la junta.</p>
      <div className={screenStyles.checkboxRow}><input id="avj" type="checkbox" {...avisos.props} /><label htmlFor="avj"><b>Recibir avisos de mi junta</b></label></div>
      <button className={screenStyles.buttonOutline} onClick={() => { setOk(""); setVista("explorar"); }}>Explorar otras juntas</button>
      <button className={screenStyles.buttonSecondary} onClick={salir}>Salir de la junta</button>
    </ScreenShell>
  );
}
