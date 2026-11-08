"use client";

import { getDemo, setDemo, useDemoState } from "./store";
import { logEvento, type VecinoId } from "./shared";
import { solicitar, enviarMensaje, type Parameters_Solicitar } from "./coordinaciones";

/**
 * Cola local de operaciones preparadas sin conexión.
 * No hay servidor: «aplicar» significa ejecutar la operación en este dispositivo cuando vuelve la conexión.
 * Nunca se afirma que algo se sincronizó con un servidor ni se avisa a nadie fuera de la app.
 */
export type OpCola = {
  id: string;
  tipo: "solicitud" | "mensaje";
  creado: number;
  estado: "pendiente" | "aplicada" | "error";
  intentos: number;
  error?: string;
  usuario: VecinoId;
  titulo: string;
  datos: { pub?: Parameters_Solicitar; coordId?: string; texto?: string };
};
export const COLA_INICIAL = { items: [] as OpCola[] };
export const useCola = () => useDemoState("cola", COLA_INICIAL);

const nuevoId = () => `op-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
const lista = () => getDemo("cola", COLA_INICIAL).items;
const guardar = (items: OpCola[]) => setDemo("cola", COLA_INICIAL, { items: items.slice(0, 60) });

export type ResultadoCola = { ok: true; id: string } | { ok: false; error: string };

export function encolarSolicitud(pub: Parameters_Solicitar, usuario: VecinoId): ResultadoCola {
  if (lista().some((o) => o.tipo === "solicitud" && o.estado !== "aplicada" && o.usuario === usuario && o.datos.pub?.id === pub.id)) return { ok: false, error: "Ya guardaste esta solicitud: está pendiente de enviar." };
  if (pub.autor === usuario) return { ok: false, error: "No puedes solicitar tu propia publicación." };
  const op: OpCola = { id: nuevoId(), tipo: "solicitud", creado: Date.now(), estado: "pendiente", intentos: 0, usuario, titulo: pub.titulo, datos: { pub } };
  guardar([op, ...lista()]);
  logEvento(`Solicitud guardada sin conexión: «${pub.titulo}» (pendiente de enviar)`);
  return { ok: true, id: op.id };
}

export function encolarMensaje(coordId: string, usuario: VecinoId, texto: string, titulo: string): ResultadoCola {
  const t = texto.trim();
  if (!t) return { ok: false, error: "Escribe un mensaje." };
  const op: OpCola = { id: nuevoId(), tipo: "mensaje", creado: Date.now(), estado: "pendiente", intentos: 0, usuario, titulo, datos: { coordId, texto: t.slice(0, 500) } };
  guardar([op, ...lista()]);
  return { ok: true, id: op.id };
}

function aplicar(op: OpCola): { ok: boolean; error?: string } {
  if (op.tipo === "solicitud" && op.datos.pub) {
    const r = solicitar(op.datos.pub as never, op.usuario);
    return r.ok ? { ok: true } : { ok: false, error: r.error };
  }
  if (op.tipo === "mensaje" && op.datos.coordId) {
    const r = enviarMensaje(op.datos.coordId, op.usuario, op.datos.texto ?? "");
    return r.ok ? { ok: true } : { ok: false, error: r.error };
  }
  return { ok: false, error: "Operación desconocida." };
}

/** Aplica en este dispositivo lo pendiente (o con error). Cada operación tiene un ID: reintentar no la duplica. */
export function procesarCola(soloId?: string) {
  let aplicadas = 0;
  let errores = 0;
  const items = lista().map((op) => {
    if (op.estado === "aplicada" || (soloId && op.id !== soloId)) return op;
    const r = aplicar(op);
    if (r.ok) { aplicadas++; return { ...op, estado: "aplicada" as const, intentos: op.intentos + 1, error: undefined }; }
    errores++;
    return { ...op, estado: "error" as const, intentos: op.intentos + 1, error: r.error };
  });
  guardar(items);
  if (aplicadas) logEvento(`Cola local: ${aplicadas} operación(es) aplicadas en este dispositivo (no hay servidor)`);
  return { aplicadas, errores, total: aplicadas + errores };
}

export function descartarOp(id: string) {
  guardar(lista().filter((o) => o.id !== id));
}
export const pendientesCola = (items: OpCola[]) => items.filter((o) => o.estado !== "aplicada");
