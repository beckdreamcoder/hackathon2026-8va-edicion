"use client";

import { getDemo, hayDemo, setDemo, useDemoState } from "./store";
import { VECINOS, SESION_INICIAL, avisar, logEvento, emitirSello, type VecinoId } from "./shared";
import type { PublicacionDemo } from "./publicaciones";

/**
 * Motor de coordinación genérico (favores, cachuelos, movilidad y publicaciones nuevas).
 * Flujo: solicitud → aceptación → chat → acuerdo → cierre → sello.
 */

export type TipoCoord = "favor" | "cachuelo" | "movilidad";
export type EstadoCoord = "solicitada" | "aceptada" | "acordada" | "completada" | "rechazada" | "cancelada";

export type Mensaje = { id: string; from: VecinoId | "sistema"; text: string; at: string; /** Respuesta simulada de la otra persona (demostración). */ sim?: boolean };
export type Acuerdo = { lugar: string; fecha: string; hora: string; nota: string; propuestoPor: VecinoId; conf: VecinoId[] };

export type Coordinacion = {
  id: string;
  tipo: TipoCoord;
  /** Publicación de origen (null en coordinaciones de flujos fijos registrados). */
  pubId: string | null;
  titulo: string;
  solicitante: VecinoId;
  receptor: VecinoId;
  estado: EstadoCoord;
  creada: string;
  actualizada: string;
  msgs: Mensaje[];
  read: Partial<Record<VecinoId, number>>;
  acuerdo: Acuerdo | null;
  cierre: VecinoId[];
  sellos: VecinoId[];
  cerradaPor?: VecinoId;
  /** Motivo opcional al cancelar. */
  motivo?: string;
  /** Coordinación de un flujo fijo: se gestiona en su pantalla `href`. */
  legado?: boolean;
  href?: string;
};

export const COORD_INICIAL = { items: [] as Coordinacion[] };
export const BLOQUEOS_INICIAL = { items: [] as { by: VecinoId; target: VecinoId }[] };

export function useCoordinaciones() {
  return useDemoState("coordinaciones", COORD_INICIAL);
}
export function useBloqueos() {
  return useDemoState("bloqueos", BLOQUEOS_INICIAL);
}

export type Resultado = { ok: true; id?: string } | { ok: false; error: string };
const fallo = (error: string): Resultado => ({ ok: false, error });

/* ---------- Utilidades de lectura ---------- */

export const ESTADOS_ACTIVOS: EstadoCoord[] = ["solicitada", "aceptada", "acordada"];
export const esActiva = (c: Coordinacion) => ESTADOS_ACTIVOS.includes(c.estado);
export const esAbierta = (c: Coordinacion) => c.estado === "aceptada" || c.estado === "acordada";
export const participa = (c: Coordinacion, u: VecinoId) => c.solicitante === u || c.receptor === u;
export const otroDe = (c: Coordinacion, u: VecinoId): VecinoId => (c.solicitante === u ? c.receptor : c.solicitante);

export const ETIQUETA_ESTADO: Record<EstadoCoord, string> = {
  solicitada: "Solicitud enviada",
  aceptada: "En coordinación",
  acordada: "Acordada",
  completada: "Completada",
  rechazada: "Rechazada",
  cancelada: "Cancelada",
};
export const ETIQUETA_TIPO: Record<TipoCoord, string> = { favor: "Favor", cachuelo: "Cachuelo", movilidad: "Movilidad" };

export function noLeidos(c: Coordinacion, u: VecinoId) {
  const desde = c.read[u] ?? 0;
  return c.msgs.slice(desde).filter((m) => m.from !== u && m.from !== "sistema").length;
}

export function proximoPaso(c: Coordinacion, u: VecinoId) {
  const otro = VECINOS[otroDe(c, u)].name;
  switch (c.estado) {
    case "solicitada":
      return c.receptor === u ? "Responde la solicitud" : `Esperando respuesta de ${otro}`;
    case "aceptada":
      if (!c.acuerdo) return "Acuerden lugar, fecha y hora";
      return c.acuerdo.conf.includes(u) ? `Esperando que ${otro} confirme` : "Confirma el acuerdo";
    case "acordada":
      return c.cierre.includes(u) ? `Esperando que ${otro} confirme el cierre` : "Marca como completado cuando termine";
    case "completada":
      return c.sellos.includes(u) ? "Coordinación cerrada" : `Agradece a ${otro} con un sello`;
    default:
      return "Sin pasos pendientes";
  }
}

export function estaBloqueado(a: VecinoId, b: VecinoId) {
  const { items } = getDemo("bloqueos", BLOQUEOS_INICIAL);
  return items.some((x) => (x.by === a && x.target === b) || (x.by === b && x.target === a));
}

export function activaDe(items: Coordinacion[], pubId: string, solicitante: VecinoId) {
  return items.find((c) => c.pubId === pubId && c.solicitante === solicitante && esActiva(c));
}

/* ---------- Núcleo de escritura ---------- */

const ahora = () => new Date().toISOString();
let seq = 0;
const nuevoId = (p: string) => `${p}-${Date.now().toString(36)}${(seq++).toString(36)}${Math.random().toString(36).slice(2, 5)}`;

function lista() {
  return getDemo("coordinaciones", COORD_INICIAL).items;
}
function guardar(items: Coordinacion[]) {
  setDemo("coordinaciones", COORD_INICIAL, { items });
}
function obtener(id: string) {
  return lista().find((c) => c.id === id);
}
function actualizar(id: string, fn: (c: Coordinacion) => Coordinacion) {
  guardar(lista().map((c) => (c.id === id ? { ...fn(c), actualizada: ahora() } : c)));
}
const sistema = (text: string): Mensaje => ({ id: nuevoId("m"), from: "sistema", text, at: ahora() });
const fechaDemo = () => getDemo("sesion", SESION_INICIAL).fecha;

function notificar(c: Coordinacion, para: VecinoId, titulo: string, texto: string, categoria: "favor" | "junta" = "favor") {
  if (para === c.solicitante || para === c.receptor) avisar({ categoria, titulo, texto, href: "/coordinaciones" });
}

/* ---------- Solicitud, aceptación, rechazo y cancelación ---------- */

export function tipoDePublicacion(p: Pick<PublicacionDemo, "tipo" | "categoria">): TipoCoord | null {
  if (p.tipo === "cachuelo") return "cachuelo";
  if (p.tipo === "favor") return p.categoria === "Movilidad" ? "movilidad" : "favor";
  return null;
}

export type Parameters_Solicitar = Pick<PublicacionDemo, "id" | "tipo" | "modo" | "autor" | "titulo" | "categoria" | "estado">;

/** Una persona solicita (o se ofrece en) una publicación de otra persona. */
export function solicitar(p: PublicacionDemo, solicitante: VecinoId): Resultado {
  const tipo = tipoDePublicacion(p);
  const autor = p.autor as VecinoId;
  if (!tipo) return fallo("Esta publicación no admite coordinación.");
  if (p.estado !== "publicado") return fallo("La publicación aún no está enviada.");
  if (!VECINOS[autor]) return fallo("No se encontró a la persona que publicó.");
  if (autor === solicitante) return fallo("No puedes solicitar tu propia publicación.");
  if (estaBloqueado(autor, solicitante)) return fallo("No puedes enviar solicitudes a esta persona.");
  if (activaDe(lista(), p.id, solicitante)) return fallo("Ya tienes una coordinación activa para esta publicación.");
  const t = ahora();
  const c: Coordinacion = {
    id: nuevoId("co"), tipo, pubId: p.id, titulo: p.titulo, solicitante, receptor: autor, estado: "solicitada",
    creada: t, actualizada: t, msgs: [sistema(`${VECINOS[solicitante].name} envió una solicitud.`)], read: {}, acuerdo: null, cierre: [], sellos: [],
  };
  guardar([c, ...lista()]);
  notificar(c, autor, `${VECINOS[solicitante].name} envió una solicitud`, `Para «${p.titulo}».`, "junta");
  logEvento(`${VECINOS[solicitante].name} solicitó «${p.titulo}» (${tipo})`);
  return { ok: true, id: c.id };
}

export function responder(id: string, actor: VecinoId, aceptar: boolean): Resultado {
  const c = obtener(id);
  if (!c || c.legado) return fallo("Coordinación no encontrada.");
  if (c.estado !== "solicitada") return fallo("La solicitud ya fue respondida.");
  if (c.receptor !== actor) return fallo("Solo quien publicó puede responder.");
  if (aceptar && estaBloqueado(c.receptor, c.solicitante)) return fallo("No puedes aceptar: hay un bloqueo entre ustedes.");
  const quien = VECINOS[actor].name;
  actualizar(id, (x) => ({
    ...x,
    estado: aceptar ? "aceptada" : "rechazada",
    cerradaPor: aceptar ? undefined : actor,
    msgs: [...x.msgs, sistema(aceptar ? `${quien} aceptó. Se abrió el chat temporal.` : `${quien} rechazó la solicitud.`)],
  }));
  notificar(c, c.solicitante, aceptar ? `${quien} aceptó tu solicitud` : `${quien} no pudo aceptar tu solicitud`, `«${c.titulo}»`);
  logEvento(`${quien} ${aceptar ? "aceptó" : "rechazó"} la solicitud de ${VECINOS[c.solicitante].name} · «${c.titulo}»`);
  return { ok: true, id };
}

export function cancelar(id: string, actor: VecinoId, motivo = ""): Resultado {
  const c = obtener(id);
  if (!c || c.legado) return fallo("Coordinación no encontrada.");
  if (!participa(c, actor)) return fallo("No participas en esta coordinación.");
  if (!esActiva(c)) return fallo("Esta coordinación ya está cerrada.");
  if (c.estado === "solicitada" && actor !== c.solicitante) return fallo("Usa «Rechazar» para responder una solicitud.");
  const quien = VECINOS[actor].name;
  const m = motivo.trim().slice(0, 140);
  actualizar(id, (x) => ({ ...x, estado: "cancelada", cerradaPor: actor, motivo: m || undefined, msgs: [...x.msgs, sistema(`${quien} canceló la coordinación${m ? ` · Motivo: ${m}` : ""}. El acuerdo y el chat se conservan.`)] }));
  notificar(c, otroDe(c, actor), `${quien} canceló la coordinación`, `«${c.titulo}»`);
  logEvento(`${quien} canceló la coordinación «${c.titulo}»`);
  return { ok: true, id };
}

/* ---------- Chat temporal ---------- */

export function enviarMensaje(id: string, actor: VecinoId, texto: string): Resultado {
  const c = obtener(id);
  const text = texto.trim();
  if (!c || c.legado) return fallo("Coordinación no encontrada.");
  if (!participa(c, actor)) return fallo("No participas en esta coordinación.");
  if (!esAbierta(c)) return fallo("El chat está en solo lectura.");
  if (!text) return fallo("Escribe un mensaje.");
  if (estaBloqueado(c.solicitante, c.receptor)) return fallo("Hay un bloqueo entre ustedes: no se pueden enviar mensajes.");
  const m: Mensaje = { id: nuevoId("m"), from: actor, text: text.slice(0, 500), at: ahora() };
  actualizar(id, (x) => ({ ...x, msgs: [...x.msgs, m], read: { ...x.read, [actor]: x.msgs.length + 1 } }));
  notificar(c, otroDe(c, actor), `${VECINOS[actor].name} te escribió`, `«${c.titulo}»`);
  return { ok: true, id };
}

export function marcarLeido(id: string, actor: VecinoId) {
  const c = obtener(id);
  if (!c || (c.read[actor] ?? 0) === c.msgs.length) return;
  actualizar(id, (x) => ({ ...x, read: { ...x.read, [actor]: x.msgs.length } }));
}

const RESPUESTAS = ["Perfecto, gracias.", "Me parece bien, ¿a qué hora?", "Listo, quedamos así.", "Estoy atento, avísame cualquier cambio.", "¿Puedes confirmar el lugar?"];

/** Respuesta SIMULADA de la otra persona (demostración, no es una persona real respondiendo). */
export function respuestaSimulada(id: string, delQue: VecinoId): Resultado {
  const c = obtener(id);
  if (!c || c.legado || !participa(c, delQue)) return fallo("Coordinación no encontrada.");
  if (!esAbierta(c)) return fallo("El chat está en solo lectura.");
  if (estaBloqueado(c.solicitante, c.receptor)) return fallo("Hay un bloqueo entre ustedes.");
  const from = otroDe(c, delQue);
  const ultimo = [...c.msgs].reverse().find((m) => m.from === delQue);
  const t = (ultimo?.text ?? "").toLowerCase();
  const text = /hora|cuándo|cuando/.test(t) ? "Podría a las 10 a. m., ¿te parece?" : /lugar|dónde|donde|punto/.test(t) ? "Nos vemos en el punto que propusiste." : RESPUESTAS[c.msgs.filter((m) => m.sim).length % RESPUESTAS.length];
  const m: Mensaje = { id: nuevoId("m"), from, text, at: ahora(), sim: true };
  actualizar(id, (x) => ({ ...x, msgs: [...x.msgs, m] }));
  return { ok: true, id };
}

/* ---------- Acuerdo de lugar, fecha y hora ---------- */

export function proponerAcuerdo(id: string, actor: VecinoId, a: { lugar: string; fecha: string; hora: string; nota?: string }): Resultado {
  const c = obtener(id);
  if (!c || c.legado) return fallo("Coordinación no encontrada.");
  if (!participa(c, actor)) return fallo("No participas en esta coordinación.");
  if (!esAbierta(c)) return fallo("Solo se puede acordar durante una coordinación abierta.");
  if (estaBloqueado(c.solicitante, c.receptor)) return fallo("Hay un bloqueo entre ustedes.");
  const lugar = a.lugar.trim();
  if (!lugar) return fallo("Indica el lugar de encuentro.");
  if (!a.fecha) return fallo("Indica la fecha.");
  if (a.fecha < fechaDemo()) return fallo("La fecha no puede ser anterior a hoy.");
  if (!a.hora) return fallo("Indica la hora.");
  const acuerdo: Acuerdo = { lugar: lugar.slice(0, 120), fecha: a.fecha, hora: a.hora, nota: (a.nota ?? "").trim().slice(0, 200), propuestoPor: actor, conf: [actor] };
  const cambio = !!c.acuerdo;
  actualizar(id, (x) => ({
    ...x,
    estado: "aceptada", // un cambio de términos anula confirmaciones y cierre
    acuerdo,
    cierre: [],
    msgs: [...x.msgs, sistema(`${VECINOS[actor].name} ${cambio ? "cambió" : "propuso"} el acuerdo: ${acuerdo.lugar} · ${acuerdo.fecha} · ${acuerdo.hora}.${cambio ? " Las confirmaciones anteriores quedaron anuladas." : ""}`)],
  }));
  notificar(c, otroDe(c, actor), `${VECINOS[actor].name} propuso un acuerdo`, `${acuerdo.lugar} · ${acuerdo.fecha} · ${acuerdo.hora}`);
  logEvento(`Acuerdo ${cambio ? "modificado" : "propuesto"} en «${c.titulo}»`);
  return { ok: true, id };
}

export function confirmarAcuerdo(id: string, actor: VecinoId): Resultado {
  const c = obtener(id);
  if (!c || c.legado || !c.acuerdo) return fallo("No hay un acuerdo propuesto.");
  if (!participa(c, actor)) return fallo("No participas en esta coordinación.");
  if (c.estado !== "aceptada") return fallo("El acuerdo ya no está pendiente.");
  if (c.acuerdo.conf.includes(actor)) return fallo("Ya confirmaste el acuerdo.");
  if (estaBloqueado(c.solicitante, c.receptor)) return fallo("Hay un bloqueo entre ustedes.");
  const conf = [...c.acuerdo.conf, actor];
  const listo = conf.length === 2;
  actualizar(id, (x) => ({
    ...x,
    estado: listo ? "acordada" : x.estado,
    acuerdo: x.acuerdo ? { ...x.acuerdo, conf } : x.acuerdo,
    msgs: [...x.msgs, sistema(listo ? "Ambas personas confirmaron el acuerdo." : `${VECINOS[actor].name} confirmó el acuerdo.`)],
  }));
  if (listo) {
    notificar(c, otroDe(c, actor), "Acuerdo confirmado", `«${c.titulo}»`);
    logEvento(`Acuerdo confirmado por ambos en «${c.titulo}»`);
  }
  return { ok: true, id };
}

/* ---------- Cierre y sello ---------- */

export function confirmarCierre(id: string, actor: VecinoId): Resultado {
  const c = obtener(id);
  if (!c || c.legado) return fallo("Coordinación no encontrada.");
  if (!participa(c, actor)) return fallo("No participas en esta coordinación.");
  if (c.estado !== "acordada") return fallo("Primero deben confirmar el acuerdo.");
  if (c.cierre.includes(actor)) return fallo("Ya confirmaste el cierre.");
  const cierre = [...c.cierre, actor];
  const listo = cierre.length === 2;
  actualizar(id, (x) => ({
    ...x,
    estado: listo ? "completada" : x.estado,
    cierre,
    msgs: [...x.msgs, sistema(listo ? "Coordinación completada por ambas personas. Pueden darse un sello." : `${VECINOS[actor].name} marcó la coordinación como completada.`)],
  }));
  if (listo) {
    notificar(c, otroDe(c, actor), "Coordinación completada", `Puedes agradecer con un sello · «${c.titulo}»`);
    logEvento(`Coordinación completada por ambos: «${c.titulo}»`);
  }
  return { ok: true, id };
}

export function darSello(id: string, actor: VecinoId, comentario = ""): Resultado {
  const c = obtener(id);
  if (!c || c.legado) return fallo("Coordinación no encontrada.");
  if (!participa(c, actor)) return fallo("No participas en esta coordinación.");
  const r = emitirSello({ coordId: c.id, from: actor, to: otroDe(c, actor), tipo: c.tipo, comentario: comentario.trim().slice(0, 140) || undefined }, c.estado === "completada");
  if (r === "autosello") return fallo("No puedes darte un sello a ti mismo.");
  if (r === "no_completada") return fallo("El sello se habilita al completarse la coordinación.");
  if (!c.sellos.includes(actor)) actualizar(id, (x) => ({ ...x, sellos: [...x.sellos, actor] }));
  return { ok: true, id };
}

/** Fase visible de una coordinación: Pendiente, Acordado, En proceso o Finalizado. */
export function fase(c: Coordinacion, hoy: string) {
  switch (c.estado) {
    case "solicitada": return "Pendiente";
    case "aceptada": return c.acuerdo ? "Pendiente de confirmar" : "Pendiente de acuerdo";
    case "acordada": return c.cierre.length > 0 || (c.acuerdo && c.acuerdo.fecha <= hoy) ? "En proceso" : "Acordado";
    case "completada": return "Finalizado";
    case "rechazada": return "Rechazada";
    default: return "Cancelada";
  }
}

/** Reporte de demostración: queda en el registro de la consola, no avisa a nadie. */
export function reportar(by: VecinoId, target: VecinoId, motivo: string): Resultado {
  if (by === target) return fallo("No puedes reportarte a ti mismo.");
  logEvento(`Reporte de demostración de ${VECINOS[by].name} sobre ${VECINOS[target].name} · motivo: ${motivo}`);
  return { ok: true };
}

/* ---------- Bloqueo entre usuarios ---------- */

export function bloquear(by: VecinoId, target: VecinoId): Resultado {
  if (by === target) return fallo("No puedes bloquearte a ti mismo.");
  const { items } = getDemo("bloqueos", BLOQUEOS_INICIAL);
  if (!items.some((x) => x.by === by && x.target === target)) setDemo("bloqueos", BLOQUEOS_INICIAL, { items: [...items, { by, target }] });
  logEvento(`${VECINOS[by].name} bloqueó a ${VECINOS[target].name}: sin mensajes ni solicitudes entre ellos`);
  return { ok: true };
}

export function desbloquear(by: VecinoId, target: VecinoId) {
  const { items } = getDemo("bloqueos", BLOQUEOS_INICIAL);
  setDemo("bloqueos", BLOQUEOS_INICIAL, { items: items.filter((x) => !(x.by === by && x.target === target)) });
  logEvento(`${VECINOS[by].name} desbloqueó a ${VECINOS[target].name}`);
}

/** RutaJuntos: el conductor acepta a un pasajero y se abre una coordinación de movilidad con el punto de encuentro propuesto. */
export function abrirCoordinacionMovilidad(d: { conductor: VecinoId; pasajero: VecinoId; titulo: string; lugar: string; hora: string; nota?: string; tipo?: TipoCoord; via?: string }): Resultado {
  const tipo = d.tipo ?? "movilidad";
  const via = d.via ?? "RutaJuntos";
  if (d.conductor === d.pasajero) return fallo("No puedes coordinar contigo mismo.");
  const pubId = tipo === "movilidad" && !d.via ? `rj:${d.conductor}:${d.pasajero}` : `mapa:${tipo}:${d.conductor}:${d.pasajero}`;
  const previa = lista().find((c) => c.pubId === pubId && esActiva(c));
  if (previa) return { ok: true, id: previa.id };
  if (estaBloqueado(d.conductor, d.pasajero)) return fallo("Hay un bloqueo entre ustedes.");
  const t = ahora();
  const c: Coordinacion = {
    id: nuevoId("co"), tipo, pubId, titulo: d.titulo, solicitante: d.pasajero, receptor: d.conductor, estado: "aceptada", creada: t, actualizada: t,
    msgs: [sistema(`${VECINOS[d.conductor].name} ${tipo === "movilidad" ? "se ofreció a llevar a" : "se ofreció a ayudar a"} ${VECINOS[d.pasajero].name} (${via}). Se propuso el punto de encuentro: ${d.lugar}.`)],
    read: {}, acuerdo: { lugar: d.lugar, fecha: fechaDemo(), hora: d.hora, nota: d.nota ?? "", propuestoPor: d.conductor, conf: [d.conductor] }, cierre: [], sellos: [],
  };
  guardar([c, ...lista()]);
  notificar(c, d.pasajero, `${VECINOS[d.conductor].name} ${tipo === "movilidad" ? "puede llevarte" : "quiere ayudarte"}`, `${d.lugar} · confirma el acuerdo`);
  logEvento(`${via}: ${VECINOS[d.conductor].name} y ${VECINOS[d.pasajero].name} · «${d.titulo}»`);
  return { ok: true, id: c.id };
}

/** Cambia la sesión demo y alinea el «Probar como» de los flujos fijos que ya tienen estado. */
export function cambiarUsuarioDemo(id: VecinoId) {
  setDemo("sesion", SESION_INICIAL, { userId: id });
  const sync = (key: string, validos: VecinoId[]) => {
    if (validos.includes(id) && hayDemo(key)) setDemo(key, {}, { actor: id });
  };
  sync("favor-escalera", ["maria", "luis"]);
  sync("movilidad-hospital", ["maria", "carlos"]);
  sync("cachuelo-gasfiteria", ["maria", "pedro"]);
  logEvento(`Sesión demo cambiada a ${VECINOS[id].name}`);
}

/* ---------- Flujos fijos (Favores, Cachuelos, Movilidad): se reflejan en «Mis coordinaciones» ---------- */

export function registrarLegado(d: { id: string; tipo: TipoCoord; titulo: string; solicitante: VecinoId; receptor: VecinoId; estado: EstadoCoord; href: string }) {
  if (!d.id) return;
  const actual = obtener(d.id);
  if (actual?.estado === d.estado) return;
  if (actual) {
    actualizar(d.id, (x) => ({ ...x, estado: d.estado }));
    return;
  }
  const t = ahora();
  guardar([
    { id: d.id, tipo: d.tipo, pubId: null, titulo: d.titulo, solicitante: d.solicitante, receptor: d.receptor, estado: d.estado, creada: t, actualizada: t, msgs: [], read: {}, acuerdo: null, cierre: [], sellos: [], legado: true, href: d.href },
    ...lista(),
  ]);
}
