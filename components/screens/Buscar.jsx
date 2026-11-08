"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { screenStyles } from "./screen-styles";
import { ScreenShell } from "./screen-shell";
import { useTextInput } from "@/lib/hooks/use-text-input";
import { chip, useSesion, VECINOS } from "@/lib/demo/shared";
import { useDemoState, setDemo } from "@/lib/demo/store";
import { useIncidentes, estadoOpDe } from "@/lib/demo/incidentes";
import { useCampanas, ESTADO_CAMPANA } from "@/lib/demo/campanas";
import { useCatalogo, ESTADOS_CAT, TIPOS_CAT, DISTRITO_PROPIO } from "@/lib/demo/catalogo";
import { km } from "@/lib/map/geo";
import PublicacionDetalle from "@/components/publicaciones/PublicacionDetalle";

/** Semillas históricas de la demo (sin ID de publicación): se abren en su pantalla. */
const BASE = [
  { tipo: "Favor", titulo: "Necesito una escalera de 3 metros prestada", cat: "Herramientas", zona: "Campoy Sector 2", dist: 300, disp: "Hoy", href: "/favores", tags: ["escalera", "pintar", "prestar", "herramienta"] },
  { tipo: "Favor", titulo: "Ayudo con trámites digitales a adultos mayores", cat: "Habilidades", zona: "Campoy Sector 4", dist: 700, disp: "Fines de semana", href: "/favores", tags: ["trámite", "celular", "whatsapp", "ayuda", "enseñar"] },
  { tipo: "Favor", titulo: "Presto herramientas de jardinería", cat: "Herramientas", zona: "Campoy Sector 3", dist: 450, disp: "Fines de semana", href: "/favores", tags: ["jardín", "plantas", "herramienta", "prestar"] },
  { tipo: "Cachuelo", titulo: "Gasfitería · Pedro arregla fugas", cat: "Gasfitería", zona: "Campoy Sector 3", dist: 500, disp: "Esta semana", href: "/cachuelos", tags: ["fuga", "agua", "caño", "baño", "grifo", "gasfitero"] },
  { tipo: "Cachuelo", titulo: "Clases de matemática de secundaria", cat: "Clases", zona: "Campoy Sector 1", dist: 900, disp: "Esta semana", href: "/cachuelos", tags: ["clase", "matemática", "tarea", "colegio"] },
  { tipo: "Movilidad", titulo: "Carlos pasa por el hospital mañana", cat: "Movilidad", zona: "Campoy", dist: 400, disp: "Hoy", href: "/movilidad", tags: ["hospital", "llevar", "traslado", "carro", "posta"] },
].map((b) => ({ ...b, distrito: DISTRITO_PROPIO, estado: "abierto", creado: 0 }));
/** Palabras que no aportan significado a la búsqueda. */
const VACIAS = ["una", "uno", "unos", "unas", "los", "las", "del", "con", "por", "para", "que", "tengo", "necesito", "quiero", "alguien", "busco", "hay", "mis", "mas", "más", "sin", "este", "esta"];
const TIPOS = ["Todo", "Favor", "Cachuelo", "Movilidad", "Recurso", "Emergencia", "Campaña"];
const DISTS = [["Cerca (1 km)", 1000], ["Mi comunidad", 99999]];
const DISPS = ["Cualquiera", "Hoy", "Esta semana", "Fines de semana"];
const ORDEN = [["cerca", "Más cerca"], ["reciente", "Más reciente"]];
const SELECT = "min-h-11 border-[1.5px] border-[#cfc7bf] rounded-[14px] px-3 bg-white w-full text-[15px]";

/** Búsqueda con filtros combinables (texto, categoría, distrito, estado) sobre el catálogo único de publicaciones. */
export default function Buscar() {
  const router = useRouter();
  const [sesion] = useSesion();
  const [incs] = useIncidentes();
  const catalogo = useCatalogo();
  const campanas = useCampanas();
  const [foco, setFoco] = useDemoState("pub-foco", { id: "" });
  const q = useTextInput("");
  const [tipo, setTipo] = useState("Todo");
  const [dist, setDist] = useState(99999);
  const [disp, setDisp] = useState("Cualquiera");
  const [cat, setCat] = useState("Todas");
  const [distrito, setDistrito] = useState("Todos");
  const [est, setEst] = useState("todos");
  const [orden, setOrden] = useState("cerca");
  const [selId, setSelId] = useState("");

  // Si se llegó desde una tarjeta del muro, se abre exactamente esa publicación
  useEffect(() => {
    if (!foco.id) return undefined;
    const t = setTimeout(() => { setSelId(foco.id); setFoco({ id: "" }); }, 0);
    return () => clearTimeout(t);
  }, [foco.id, setFoco]);

  const entradas = [
    ...BASE,
    ...catalogo.map((v) => ({ vm: v, tipo: v.recurso ? "Recurso" : TIPOS_CAT[v.tipo], titulo: v.titulo, cat: v.categoria, zona: v.ubicacion, distrito: v.distrito, dist: Math.round(v.dist), disp: v.disponibilidad, estado: v.estado, creado: v.creado, tags: `${v.descripcion} ${VECINOS[v.vecino]?.name ?? ""}`.toLowerCase().split(/\s+/) })),
    ...incs.items.map((i) => ({ tipo: "Emergencia", titulo: i.titulo, cat: i.tipo, zona: i.zona, distrito: DISTRITO_PROPIO, dist: 300, disp: "Hoy", estado: estadoOpDe(i) === "Resuelta" ? "completado" : estadoOpDe(i) === "En atención" ? "en_coordinacion" : "abierto", creado: i.creado ?? 0, incId: i.id, tags: [i.tipo.toLowerCase(), "agua", "emergencia", "lluvia", ...(i.descripcion ?? "").toLowerCase().split(/\s+/)] })),
    ...campanas.map((k) => ({ tipo: "Campaña", titulo: k.titulo, cat: "Campaña solidaria", zona: k.zona, distrito: DISTRITO_PROPIO, dist: 600, disp: "Esta semana", estado: k.estado === "finalizada" ? "completado" : k.estado === "activa" ? "abierto" : "abierto", creado: 0, campId: k.id, campEstado: ESTADO_CAMPANA[k.estado], tags: `${k.descripcion} ${k.organizador}`.toLowerCase().split(/\s+/) })),
  ];
  const cats = ["Todas", ...[...new Set(entradas.map((r) => r.cat))].sort((a, b) => a.localeCompare(b, "es"))];
  const distritos = ["Todos", ...[...new Set(entradas.map((r) => r.distrito))].sort((a, b) => a.localeCompare(b, "es"))];
  const palabras = q.value.toLowerCase().split(/[\s,.¿?¡!]+/).filter((w) => w.length > 2 && !VACIAS.includes(w));
  const resultados = entradas
    .filter((r) => (tipo === "Todo" || r.tipo === tipo) && r.dist <= dist && (disp === "Cualquiera" || r.disp.startsWith(disp)) && (cat === "Todas" || r.cat === cat) && (distrito === "Todos" || r.distrito === distrito) && (est === "todos" || r.estado === est))
    .map((r) => ({ ...r, hits: palabras.filter((w) => r.titulo.toLowerCase().includes(w) || r.cat.toLowerCase().includes(w) || r.distrito.toLowerCase().includes(w) || r.tags.some((t) => t.length > 2 && (t.includes(w) || w.includes(t)))) }))
    .filter((r) => palabras.length === 0 || r.hits.length > 0)
    .sort((a, b) => b.hits.length - a.hits.length || (orden === "reciente" ? b.creado - a.creado || a.dist - b.dist : a.dist - b.dist));
  const offline = sesion.senal === "Sin datos";
  const badge = (t) => (t === "Cachuelo" ? screenStyles.badgeCachuelo : t === "Emergencia" ? screenStyles.badgeEmergency : t === "Recurso" || t === "Campaña" ? screenStyles.badgeSolidarity : screenStyles.badgeFavor);
  const abrirExterno = (r) => { if (r.incId) { setDemo("inc-foco", { id: "" }, { id: r.incId }); router.push("/emergencias"); } else if (r.campId) { setDemo("camp-foco", { id: "" }, { id: r.campId }); router.push("/campanas"); } };
  const selVm = catalogo.find((v) => v.id === selId);

  if (selId) {
    return (
      <ScreenShell title="Publicación" onBack={() => setSelId("")}>
        {selVm ? (<PublicacionDetalle vm={selVm} />) : (<div className={screenStyles.card} role="status"><p className="font-bold!">Esta publicación ya no está disponible</p><button className={screenStyles.button} onClick={() => setSelId("")}>Volver a la búsqueda</button></div>)}
      </ScreenShell>
    );
  }

  return (
    <ScreenShell title="Buscar" onBack={() => router.back()}>
      <div className={screenStyles.field}>
        <label htmlFor="bq">¿Qué necesitas?</label>
        <input id="bq" className={screenStyles.input} placeholder="Ejemplo: alguien que arregle una fuga" {...q.props} />
      </div>
      <span className={screenStyles.badgeDemo}>Coincidencia simulada por palabras, sin IA real</span>
      <div className="flex gap-2 overflow-x-auto pb-0.5 [&>*]:shrink-0" role="group" aria-label="Tipo">{TIPOS.map((t) => (<button key={t} className={chip(t === tipo)} aria-pressed={t === tipo} onClick={() => setTipo(t)}>{t}</button>))}</div>
      <div className="grid grid-cols-2 gap-2">
        <div className={screenStyles.field}><label htmlFor="bc" className="text-[13px]!">Categoría</label><select id="bc" className={SELECT} value={cat} onChange={(e) => setCat(e.target.value)}>{cats.map((c) => (<option key={c}>{c}</option>))}</select></div>
        <div className={screenStyles.field}><label htmlFor="bd" className="text-[13px]!">Distrito</label><select id="bd" className={SELECT} value={distrito} onChange={(e) => setDistrito(e.target.value)}>{distritos.map((c) => (<option key={c}>{c}</option>))}</select></div>
      </div>
      <div className="flex gap-2 overflow-x-auto pb-0.5 [&>*]:shrink-0" role="group" aria-label="Estado">{[["todos", "Todos"], ...Object.entries(ESTADOS_CAT)].map(([k, n]) => (<button key={k} className={chip(est === k)} aria-pressed={est === k} onClick={() => setEst(k)}>{n}</button>))}</div>
      <div className="flex gap-2 overflow-x-auto pb-0.5 [&>*]:shrink-0" role="group" aria-label="Cercanía">{DISTS.map(([n, d]) => (<button key={n} className={chip(d === dist)} aria-pressed={d === dist} onClick={() => setDist(d)}>{n}</button>))}</div>
      <div className="flex gap-2 overflow-x-auto pb-0.5 [&>*]:shrink-0" role="group" aria-label="Disponibilidad">{DISPS.map((d) => (<button key={d} className={chip(d === disp)} aria-pressed={d === disp} onClick={() => setDisp(d)}>{d}</button>))}</div>
      <div className="flex gap-2 items-center overflow-x-auto pb-0.5 [&>*]:shrink-0" role="group" aria-label="Ordenar"><span className={screenStyles.muted}>Ordenar:</span>{ORDEN.map(([k, n]) => (<button key={k} className={chip(orden === k)} aria-pressed={orden === k} onClick={() => setOrden(k)}>{n}</button>))}</div>
      {offline && (<p className={screenStyles.muted} role="status">Sin conexión: buscas solo en los datos guardados de tu zona.</p>)}
      <p className={screenStyles.muted} role="status">{resultados.length} resultado(s)</p>
      {resultados.map((r, i) => {
        const cuerpo = (<>
          <div className={screenStyles.row}><span className={badge(r.tipo)}>{r.tipo === "Cachuelo" ? `Cachuelo · ${r.vm?.pago ?? "remunerado"}` : r.tipo === "Emergencia" ? "Emergencia · simulada" : r.tipo === "Campaña" ? `Campaña · ${r.campEstado}` : `${r.tipo} · Gratis`}</span>{(r.vm || r.incId) && (<span className={r.estado === "abierto" ? screenStyles.badge : r.estado === "cancelado" ? screenStyles.badgeAlert : screenStyles.badgeSolidarity}>{ESTADOS_CAT[r.estado]}</span>)}<span className="flex-1 min-w-0 text-(--color-muted) text-[15px] text-right">a {km(r.dist)}</span></div>
          <b>{r.titulo}</b>
          <p className={screenStyles.muted}>{r.cat} · {r.distrito} · {r.zona}{r.vm ? ` · publica ${VECINOS[r.vm.vecino]?.name ?? "un vecino"}` : ""}</p>
          {r.vm?.simulado && (<span className={`${screenStyles.badgeDemo} text-[12px]!`}>Ejemplo</span>)}
          {r.hits.length > 0 && (<p className="text-[14px]! font-bold! text-[#2f5a2d]!">Coincide por: {r.hits.join(", ")} · {r.dist <= 500 ? "muy cerca" : "en tu comunidad"}</p>)}
        </>);
        return r.vm
          ? (<button key={r.vm.id} className={screenStyles.card} onClick={() => setSelId(r.vm.id)} aria-label={`${r.titulo}, abrir publicación`}>{cuerpo}</button>)
          : (r.incId || r.campId)
            ? (<button key={`x-${i}`} className={screenStyles.card} onClick={() => abrirExterno(r)} aria-label={`${r.titulo}, abrir detalle`}>{cuerpo}</button>)
            : (<a key={`l-${i}`} className={screenStyles.card} href={r.href}>{cuerpo}</a>);
      })}
      {resultados.length === 0 && (
        <div className={screenStyles.card} role="status"><p className="font-bold!">No encontramos coincidencias</p><p className={screenStyles.muted}>Prueba con otras palabras o filtros, o publica lo que necesitas.</p><a className={screenStyles.button} href="/publicar">Publicar</a></div>
      )}
    </ScreenShell>
  );
}
