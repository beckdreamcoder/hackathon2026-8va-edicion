"use client";

import { useMemo } from "react";
import { getDemo, setDemo, useDemoState } from "./store";
import { usePublicaciones, type PublicacionDemo } from "./publicaciones";
import { useSesion, VECINOS, logEvento, avisar, type VecinoId } from "./shared";
import { abrirCoordinacionMovilidad } from "./coordinaciones";

/**
 * Red solidaria: campañas (creadas en Publicar y de ejemplo) con aportes SIMULADOS.
 * No hay cobros ni pasarelas de pago: el dinero es solo un número de demostración.
 */
export type Modalidad = "Bienes" | "Voluntariado" | "Dinero" | "Compra solidaria";

export const MODALIDADES: Record<Modalidad, { nombre: string; ayuda: string; unidad: string; coordina: boolean }> = {
  Bienes: { nombre: "Donación de bienes", ayuda: "Entregas tus bienes en el punto de acopio; se coordina por el chat.", unidad: "unidades", coordina: true },
  Voluntariado: { nombre: "Voluntariado", ayuda: "Acuerdas un turno de apoyo con la organización.", unidad: "turnos", coordina: true },
  Dinero: { nombre: "Aporte económico (simulado)", ayuda: "Aporte SIMULADO: no existe ningún cobro, tarjeta ni banco conectado.", unidad: "S/", coordina: false },
  "Compra solidaria": { nombre: "Compra solidaria", ayuda: "Compras lo que se solicita y coordinas su entrega.", unidad: "artículos", coordina: true },
};
export const MODALIDADES_LISTA = Object.keys(MODALIDADES) as Modalidad[];
/** Equivalencia de la meta: 1 unidad = 1 bien, 1 turno, 1 artículo o S/ 10 simulados. */
export const SOLES_POR_UNIDAD = 10;

export type Aporte = { id: string; campId: string; vecino: VecinoId; modalidad: Modalidad; cantidad: number; nota: string; estado: "prometido" | "confirmado" | "rechazado"; fecha: string; coordId?: string };
export const APORTES_INICIAL = { items: [] as Aporte[] };
export const FINALIZADAS_INICIAL = { ids: [] as string[] };

export const valorAporte = (a: Pick<Aporte, "modalidad" | "cantidad">) => (a.modalidad === "Dinero" ? a.cantidad / SOLES_POR_UNIDAD : a.cantidad);

export type EstadoCampana = "proxima" | "activa" | "finalizada";
export const ESTADO_CAMPANA: Record<EstadoCampana, string> = { proxima: "Próxima", activa: "Activa", finalizada: "Finalizada" };

export type Campana = {
  id: string; origen: "pub" | "sim"; titulo: string; descripcion: string; organizador: string; vecino: VecinoId; zona: string; meta: number;
  recursos: string[]; modalidades: Modalidad[]; inicio: string; plazo: string; imagen?: string; base: number; simulado: boolean; nota?: string;
  estado: EstadoCampana; progreso: number; comprometido: number; aportes: Aporte[];
};

type Semilla = Omit<Campana, "estado" | "progreso" | "comprometido" | "aportes"> & { finalizada?: boolean };
const TODAS: Modalidad[] = ["Bienes", "Voluntariado", "Dinero", "Compra solidaria"];
export const CAMPANAS_SIM: Semilla[] = [
  { id: "camp-utiles", origen: "sim", titulo: "Útiles escolares para Punchana", descripcion: "Reunimos cuadernos, lápices y mochilas para niños de primaria antes del inicio de clases.", organizador: "Colegio comunitario (ejemplo)", vecino: "tomas", zona: "Punchana · ejemplo", meta: 120, recursos: ["Cuadernos", "Lápices", "Mochilas"], modalidades: TODAS, inicio: "2026-10-20", plazo: "30 de noviembre", base: 45, simulado: true },
  { id: "camp-pollada", origen: "sim", titulo: "Pollada pro ayuda médica", descripcion: "Actividad solidaria para costear un tratamiento médico. Requiere la autorización de la persona beneficiaria.", organizador: "Familia organizadora (ejemplo)", vecino: "ursula", zona: "San Juan de Lurigancho · ejemplo", meta: 150, recursos: ["Aportes", "Voluntarios de cocina"], modalidades: ["Dinero", "Voluntariado", "Compra solidaria"], inicio: "2026-11-01", plazo: "22 de noviembre", base: 60, simulado: true, nota: "Autorizada por la persona beneficiaria (ejemplo)." },
  { id: "camp-agua", origen: "sim", titulo: "Colecta de agua para Anexo 22", descripcion: "Bidones y botellas de agua para familias sin servicio. Empieza pronto.", organizador: "Junta vecinal de ejemplo", vecino: "wilson", zona: "Jicamarca Anexo 22 · ejemplo", meta: 400, recursos: ["Bidones de 20 L", "Botellas de agua"], modalidades: ["Bienes", "Voluntariado", "Compra solidaria"], inicio: "2026-11-20", plazo: "15 de diciembre", base: 0, simulado: true },
  { id: "camp-abrigo-25", origen: "sim", titulo: "Abrigo para familias de Calca (2025)", descripcion: "Campaña terminada: se entregaron frazadas y ropa de abrigo a 80 familias.", organizador: "Junta Vecinal Calca Centro (ejemplo)", vecino: "yesenia", zona: "Calca · ejemplo", meta: 200, recursos: ["Frazadas", "Ropa de abrigo"], modalidades: TODAS, inicio: "2025-05-01", plazo: "30 de junio de 2025", base: 200, simulado: true, finalizada: true },
];

const FORMA_A_MODALIDAD: Record<string, Modalidad> = { Bienes: "Bienes", Tiempo: "Voluntariado", "Logística": "Voluntariado", Dinero: "Dinero", "Compra solidaria": "Compra solidaria" };

function desdePub(p: PublicacionDemo): Semilla & { cerrada: boolean } {
  const mods = [...new Set((p.formas ?? []).map((f) => FORMA_A_MODALIDAD[f]).filter(Boolean))] as Modalidad[];
  return {
    id: p.id, origen: "pub", titulo: p.titulo, descripcion: p.descripcion, organizador: p.responsable || VECINOS[p.autor as VecinoId]?.name || "Vecino", vecino: p.autor as VecinoId, zona: p.zona,
    meta: p.meta && p.meta > 0 ? p.meta : 100, recursos: p.formas ?? [], modalidades: mods.length ? mods : TODAS, inicio: p.inicio || p.fecha, plazo: p.plazo, imagen: p.imagen, base: 0, simulado: false, cerrada: !!p.cerrada,
  };
}

export function useCampanas(): Campana[] {
  const [pubs] = usePublicaciones();
  const [ap] = useDemoState("campana-aportes", APORTES_INICIAL);
  const [fin] = useDemoState("campana-finalizadas", FINALIZADAS_INICIAL);
  const [sesion] = useSesion();
  return useMemo(() => {
    const semillas: (Semilla & { cerrada?: boolean })[] = [...pubs.items.filter((p) => p.tipo === "campana" && p.estado === "publicado").map(desdePub), ...CAMPANAS_SIM];
    return semillas.map(({ finalizada, cerrada, ...s }) => {
      const aportes = ap.items.filter((a) => a.campId === s.id);
      const estado: EstadoCampana = finalizada || cerrada || fin.ids.includes(s.id) ? "finalizada" : s.inicio > sesion.fecha ? "proxima" : "activa";
      const progreso = s.base + aportes.filter((a) => a.estado === "confirmado").reduce((t, a) => t + valorAporte(a), 0);
      const comprometido = aportes.filter((a) => a.estado === "prometido").reduce((t, a) => t + valorAporte(a), 0);
      return { ...s, estado, progreso, comprometido, aportes };
    });
  }, [pubs.items, ap.items, fin.ids, sesion.fecha]);
}

export type ResultadoC = { ok: true; id: string } | { ok: false; error: string };

/** Registra una intención de apoyo. Si requiere entrega o turnos, abre la coordinación en el motor existente. */
export function crearAporte(c: Campana, d: { vecino: VecinoId; modalidad: Modalidad; cantidad: number; nota: string }, hoy: string): ResultadoC {
  if (c.estado !== "activa") return { ok: false, error: c.estado === "proxima" ? "Esta campaña aún no empieza." : "Esta campaña ya finalizó." };
  if (d.vecino === c.vecino) return { ok: false, error: "No puedes apoyar tu propia campaña." };
  if (!c.modalidades.includes(d.modalidad)) return { ok: false, error: "Esta campaña no admite esa forma de apoyo." };
  const min = d.modalidad === "Dinero" ? SOLES_POR_UNIDAD : 1;
  if (!Number.isFinite(d.cantidad) || d.cantidad < min) return { ok: false, error: d.modalidad === "Dinero" ? `El aporte simulado mínimo es S/ ${SOLES_POR_UNIDAD}.` : "Indica una cantidad de al menos 1." };
  const { items } = getDemo("campana-aportes", APORTES_INICIAL);
  if (items.some((a) => a.campId === c.id && a.vecino === d.vecino && a.modalidad === d.modalidad && a.estado !== "rechazado")) return { ok: false, error: "Ya registraste este tipo de apoyo en esta campaña." };
  let coordId: string | undefined;
  if (MODALIDADES[d.modalidad].coordina) {
    const r = abrirCoordinacionMovilidad({
      conductor: d.vecino, pasajero: c.vecino, titulo: `Campaña «${c.titulo}» · ${MODALIDADES[d.modalidad].nombre}`, lugar: `Punto de acopio · ${c.zona}`, hora: "10:00",
      nota: d.nota || "Coordinación creada desde Red solidaria (demostración).", tipo: "favor", via: "Red solidaria",
    });
    if (!r.ok) return { ok: false, error: r.error };
    coordId = r.id;
  }
  const now = Date.now();
  const id = `ap-${now}-${items.length}`;
  setDemo("campana-aportes", APORTES_INICIAL, { items: [...items, { id, campId: c.id, vecino: d.vecino, modalidad: d.modalidad, cantidad: Math.floor(d.cantidad), nota: d.nota.slice(0, 140), estado: "prometido", fecha: hoy, coordId }] });
  logEvento(`Apoyo registrado (${MODALIDADES[d.modalidad].nombre}) en «${c.titulo}» · simulado`);
  avisar({ categoria: "solidaridad", titulo: "Nuevo apoyo en tu campaña", texto: `${VECINOS[d.vecino].name} ofrece ${MODALIDADES[d.modalidad].nombre.toLowerCase()}.`, href: "/campanas" });
  return { ok: true, id };
}

/** El organizador confirma (cuenta en el progreso) o rechaza un apoyo prometido. */
export function responderAporte(id: string, confirmar: boolean) {
  const { items } = getDemo("campana-aportes", APORTES_INICIAL);
  setDemo("campana-aportes", APORTES_INICIAL, { items: items.map((a) => (a.id === id && a.estado === "prometido" ? { ...a, estado: confirmar ? "confirmado" : "rechazado" } : a)) });
  logEvento(`Apoyo ${confirmar ? "confirmado" : "rechazado"} por el organizador (simulado)`);
}

/** Cierra o reabre una campaña de ejemplo (las creadas en Publicar usan el campo `cerrada` de la publicación). */
export function alternarFinalizadaSim(id: string) {
  const { ids } = getDemo("campana-finalizadas", FINALIZADAS_INICIAL);
  setDemo("campana-finalizadas", FINALIZADAS_INICIAL, { ids: ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id] });
}
