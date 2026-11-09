"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { screenStyles } from "./screen-styles";
import { ScreenShell } from "./screen-shell";
import { useTextInput } from "@/lib/hooks/use-text-input";
import { chip, useSesion, VECINOS, logEvento } from "@/lib/demo/shared";
import { usePublicaciones } from "@/lib/demo/publicaciones";
import { useCatalogo, ESTADOS_CAT, DISTRITO_PROPIO } from "@/lib/demo/catalogo";
import { CLASES_RECURSO } from "@/lib/map/recursos-sim";
import PublicacionDetalle from "@/components/publicaciones/PublicacionDetalle";

const marca = () => Date.now();

/** Recursos comunitarios: agua, alimentos, herramientas, botiquines, transporte y otros (ofrecidos y solicitados). */
export default function Recursos() {
  const router = useRouter();
  const [sesion] = useSesion();
  const [, setPubs] = usePublicaciones();
  const catalogo = useCatalogo();
  const [vista, setVista] = useState("lista"); // lista | nuevo
  const [selId, setSelId] = useState("");
  const [modo, setModo] = useState("ofrezco");
  const [clase, setClase] = useState("todas");
  const [nModo, setNModo] = useState("ofrezco");
  const [nClase, setNClase] = useState("agua");
  const titulo = useTextInput("");
  const desc = useTextInput("");
  const cant = useTextInput("1");
  const [err, setErr] = useState("");
  const [listo, setListo] = useState("");

  const recursos = catalogo.filter((v) => v.recurso);
  const visibles = recursos.filter((v) => v.modo === modo && (clase === "todas" || v.recurso.clase === clase) && v.estado !== "cancelado");
  const selVm = recursos.find((v) => v.id === selId);

  const publicar = () => {
    const n = Math.floor(Number(cant.value));
    if (titulo.value.trim().length < 3) { setErr("Escribe un título de al menos 3 letras."); return; }
    if (desc.value.trim().length < 8) { setErr("Describe el recurso en pocas palabras."); return; }
    if (!(n >= 1 && n <= 999)) { setErr("Indica una cantidad entre 1 y 999."); return; }
    const now = marca();
    const unidad = n === 1 ? "unidad" : "unidades";
    const item = {
      id: `pub-${now}`, clientActionId: `ca-${now}`, tipo: "favor", modo: nModo, autor: sesion.userId, fecha: sesion.fecha, titulo: titulo.value.trim(), descripcion: desc.value.trim(),
      categoria: `Recurso · ${CLASES_RECURSO[nClase]}`, disponibilidad: "Según la entrega acordada", precio: null, responsable: "", plazo: "", formas: [], alcance: "comunidad",
      zona: `${sesion.localidad} · zona aproximada`, distrito: DISTRITO_PROPIO, estado: "publicado", recurso: { clase: nClase, cantidad: n, unidad },
    };
    setPubs((p) => ({ items: [item, ...p.items] }));
    logEvento(`Recurso publicado: «${item.titulo}» (${nModo === "ofrezco" ? "ofrecido" : "solicitado"})`);
    setErr(""); setListo(item.id); titulo.setValue(""); desc.setValue(""); cant.setValue("1");
  };

  if (selId) {
    return (
      <ScreenShell title="Recurso" onBack={() => setSelId("")}>
        {selVm ? (<PublicacionDetalle vm={selVm} />) : (<div className={screenStyles.card} role="status"><p className="font-bold!">Este recurso ya no está disponible</p><button className={screenStyles.button} onClick={() => setSelId("")}>Volver</button></div>)}
      </ScreenShell>
    );
  }

  if (vista === "nuevo") {
    return (
      <ScreenShell title="Publicar un recurso" onBack={() => { setVista("lista"); setErr(""); setListo(""); }}>
        <div className="flex gap-2" role="group" aria-label="Tipo de publicación">{[["ofrezco", "Ofrezco un recurso"], ["pido", "Necesito un recurso"]].map(([k, n]) => (<button key={k} className={chip(nModo === k)} aria-pressed={nModo === k} onClick={() => setNModo(k)}>{n}</button>))}</div>
        <div className={screenStyles.field}><p className={screenStyles.label}>Clase de recurso</p><div className={screenStyles.wrap}>{Object.entries(CLASES_RECURSO).map(([k, n]) => (<button key={k} className={chip(nClase === k)} aria-pressed={nClase === k} onClick={() => setNClase(k)}>{n}</button>))}</div></div>
        <div className={screenStyles.field}><label htmlFor="rt">Título</label><input id="rt" className={screenStyles.input} placeholder="Ej.: Bidones de agua de 20 litros" {...titulo.props} /></div>
        <div className={screenStyles.field}><label htmlFor="rd">Descripción</label><textarea id="rd" className="min-h-21 border-[1.5px] border-[#cfc7bf] rounded-[16px] px-3.5 py-3 bg-white w-full resize-none" {...desc.props}></textarea></div>
        <div className={screenStyles.field}><label htmlFor="rc">Cantidad</label><input id="rc" className={screenStyles.input} inputMode="numeric" {...cant.props} /></div>
        {err && (<p className={screenStyles.error} role="alert">{err}</p>)}
        {listo ? (<div className={screenStyles.card} role="status"><p className={screenStyles.success}>✓ Recurso publicado. Ya aparece en la lista, en Buscar y en el mapa.</p><button className={screenStyles.button} onClick={() => { setSelId(listo); setVista("lista"); }}>Ver mi recurso</button></div>) : (<button className={screenStyles.button} onClick={publicar}>Publicar recurso</button>)}
        <p className={screenStyles.muted}>La entrega se coordina por el chat de la coordinación.</p>
      </ScreenShell>
    );
  }

  return (
    <ScreenShell title="Recursos comunitarios" onBack={() => router.back()}>
      <div className="flex gap-2" role="group" aria-label="Ofrecidos o solicitados">{[["ofrezco", "Ofrecidos"], ["pido", "Solicitados"]].map(([k, n]) => (<button key={k} className={chip(modo === k)} aria-pressed={modo === k} onClick={() => setModo(k)}>{n}</button>))}</div>
      <div className="flex gap-2 overflow-x-auto pb-0.5 [&>*]:shrink-0" role="group" aria-label="Clase">{[["todas", "Todas"], ...Object.entries(CLASES_RECURSO)].map(([k, n]) => (<button key={k} className={chip(clase === k)} aria-pressed={clase === k} onClick={() => setClase(k)}>{n}</button>))}</div>
      <p className={screenStyles.muted} role="status">{visibles.length} {visibles.length === 1 ? "recurso" : "recursos"}</p>
      {visibles.map((v) => (
        <button key={v.id} className={screenStyles.card} onClick={() => setSelId(v.id)} aria-label={`${v.titulo}, abrir recurso`}>
          <div className={screenStyles.row}><span className={screenStyles.badgeSolidarity}>{v.categoria.replace("Recurso · ", "")}</span><span className={v.estado === "abierto" ? screenStyles.badge : screenStyles.badgeFavor}>{ESTADOS_CAT[v.estado]}</span></div>
          <h3 className="text-[19px]!">{v.titulo}</h3>
          <p className="text-[14px] line-clamp-2">{v.descripcion}</p>
          <p className="font-bold! text-[14px]!">{v.modo === "ofrezco" ? "Disponibles" : "Solicitados"}: {v.recurso.restante} de {v.recurso.cantidad} {v.recurso.unidad}</p>
          <p className={screenStyles.muted}>{v.distrito} · publica {VECINOS[v.vecino]?.name ?? "un vecino"}</p>
        </button>
      ))}
      {visibles.length === 0 && (<div className={screenStyles.card} role="status"><p className="font-bold!">No hay recursos con estos filtros</p><p className={screenStyles.muted}>Prueba otra clase o publica el tuyo.</p></div>)}
      <button className={screenStyles.button} onClick={() => setVista("nuevo")}>Publicar un recurso</button>
    </ScreenShell>
  );
}
