"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { screenStyles } from "./screen-styles";
import { ScreenShell } from "./screen-shell";
import { useTextInput } from "@/lib/hooks/use-text-input";
import { chip, useSesion } from "@/lib/demo/shared";
import { usePublicaciones } from "@/lib/demo/publicaciones";
import { useIncidentes } from "@/lib/demo/incidentes";

/** Catálogo de búsqueda: semillas de la demo. */
const BASE = [
  { tipo: "Favor", titulo: "Necesito una escalera de 3 metros prestada", cat: "Herramientas", zona: "Campoy Sector 2", dist: 300, disp: "Hoy", href: "/favores", tags: ["escalera", "pintar", "prestar", "herramienta"] },
  { tipo: "Favor", titulo: "Ayudo con trámites digitales a adultos mayores", cat: "Habilidades", zona: "Campoy Sector 4", dist: 700, disp: "Fines de semana", href: "/favores", tags: ["trámite", "celular", "whatsapp", "ayuda", "enseñar"] },
  { tipo: "Favor", titulo: "Presto herramientas de jardinería", cat: "Herramientas", zona: "Campoy Sector 3", dist: 450, disp: "Fines de semana", href: "/favores", tags: ["jardín", "plantas", "herramienta", "prestar"] },
  { tipo: "Cachuelo", titulo: "Gasfitería · Pedro arregla fugas", cat: "Gasfitería", zona: "Campoy Sector 3", dist: 500, disp: "Esta semana", href: "/cachuelos", tags: ["fuga", "agua", "caño", "baño", "grifo", "gasfitero"] },
  { tipo: "Cachuelo", titulo: "Clases de matemática de secundaria", cat: "Clases", zona: "Campoy Sector 1", dist: 900, disp: "Esta semana", href: "/cachuelos", tags: ["clase", "matemática", "tarea", "colegio"] },
  { tipo: "Movilidad", titulo: "Carlos pasa por el hospital mañana", cat: "Movilidad", zona: "Campoy", dist: 400, disp: "Hoy", href: "/movilidad", tags: ["hospital", "llevar", "traslado", "carro", "posta"] },
];
/** Palabras que no aportan significado a la búsqueda. */
const VACIAS = ["una", "uno", "unos", "unas", "los", "las", "del", "con", "por", "para", "que", "tengo", "necesito", "quiero", "alguien", "busco", "hay", "mis", "mas", "más", "sin", "este", "esta"];
const TIPOS = ["Todo", "Favor", "Cachuelo", "Movilidad", "Emergencia"];
const DISTS = [["Cerca (1 km)", 1000], ["Mi comunidad", 99999]];
const DISPS = ["Cualquiera", "Hoy", "Esta semana", "Fines de semana"];

/** P11 · Búsqueda con coincidencias explicadas (reglas, sin modelo de IA). */
export default function Buscar() {
  const router = useRouter();
  const [sesion] = useSesion();
  const [pubs] = usePublicaciones();
  const [incs] = useIncidentes();
  const q = useTextInput("");
  const [tipo, setTipo] = useState("Todo");
  const [dist, setDist] = useState(99999);
  const [disp, setDisp] = useState("Cualquiera");

  const catalogo = [
    ...BASE,
    ...pubs.items.filter((p) => p.estado === "publicado" && p.tipo !== "campana").map((p) => ({ tipo: p.tipo === "favor" ? (p.categoria === "Movilidad" ? "Movilidad" : "Favor") : "Cachuelo", titulo: p.titulo, cat: p.categoria, zona: p.zona, dist: 200, disp: p.disponibilidad, href: p.tipo === "favor" ? "/favores" : "/cachuelos", tags: p.descripcion.toLowerCase().split(/\s+/) })),
    ...incs.items.map((i) => ({ tipo: "Emergencia", titulo: i.titulo, cat: i.tipo, zona: i.zona, dist: 300, disp: "Hoy", href: "/emergencias", tags: [i.tipo.toLowerCase(), "agua", "emergencia", "lluvia"] })),
  ];
  const palabras = q.value.toLowerCase().split(/[\s,.¿?¡!]+/).filter((w) => w.length > 2 && !VACIAS.includes(w));
  const resultados = catalogo
    .filter((r) => (tipo === "Todo" || r.tipo === tipo) && r.dist <= dist && (disp === "Cualquiera" || r.disp === disp))
    .map((r) => {
      const hits = palabras.filter((w) => r.titulo.toLowerCase().includes(w) || r.cat.toLowerCase().includes(w) || r.tags.some((t) => t.length > 2 && (t.includes(w) || w.includes(t))));
      return { ...r, hits };
    })
    .filter((r) => palabras.length === 0 || r.hits.length > 0)
    .sort((a, b) => b.hits.length - a.hits.length || a.dist - b.dist);
  const offline = sesion.senal === "Sin datos";
  const badge = (t) => (t === "Cachuelo" ? screenStyles.badgeCachuelo : t === "Emergencia" ? screenStyles.badgeEmergency : screenStyles.badgeFavor);

  return (
    <ScreenShell title="Buscar" onBack={() => router.back()}>
      <div className={screenStyles.field}>
        <label htmlFor="bq">¿Qué necesitas?</label>
        <input id="bq" className={screenStyles.input} placeholder="Ejemplo: alguien que arregle una fuga" {...q.props} />
      </div>
      <span className={screenStyles.badgeDemo}>Coincidencia simulada por palabras, sin IA real</span>
      <div className="flex gap-2 overflow-x-auto pb-0.5" role="group" aria-label="Tipo">{TIPOS.map((t) => (<button key={t} className={chip(t === tipo)} onClick={() => setTipo(t)}>{t}</button>))}</div>
      <div className={screenStyles.wrap} role="group" aria-label="Cercanía">{DISTS.map(([n, d]) => (<button key={n} className={chip(d === dist)} onClick={() => setDist(d)}>{n}</button>))}</div>
      <div className="flex gap-2 overflow-x-auto pb-0.5" role="group" aria-label="Disponibilidad">{DISPS.map((d) => (<button key={d} className={chip(d === disp)} onClick={() => setDisp(d)}>{d}</button>))}</div>
      {offline && (<p className={screenStyles.muted} role="status">Sin conexión: buscas solo en los datos guardados de tu zona.</p>)}
      <p className={screenStyles.muted} role="status">{resultados.length} resultado(s)</p>
      {resultados.map((r, i) => (
        <a key={i} className={screenStyles.card} href={r.href}>
          <div className={screenStyles.row}><span className={badge(r.tipo)}>{r.tipo === "Cachuelo" ? "Cachuelo · remunerado" : r.tipo === "Emergencia" ? "Emergencia" : `${r.tipo} · Gratis`}</span><span className="flex-1 min-w-0 text-(--color-muted) text-[15px] text-right">a {r.dist} m</span></div>
          <b>{r.titulo}</b>
          <p className={screenStyles.muted}>{r.cat} · {r.zona} · {r.disp}</p>
          {r.hits.length > 0 && (<p className="text-[14px]! font-bold! text-[#2f5a2d]!">Coincide por: {r.hits.join(", ")} · {r.dist <= 500 ? "muy cerca" : "en tu comunidad"}</p>)}
        </a>
      ))}
      {resultados.length === 0 && (
        <div className={screenStyles.card} role="status"><p className="font-bold!">No encontramos coincidencias</p><p className={screenStyles.muted}>Prueba con otras palabras o publica lo que necesitas.</p><a className={screenStyles.button} href="/publicar">Publicar</a></div>
      )}
    </ScreenShell>
  );
}
