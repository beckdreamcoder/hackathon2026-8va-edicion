/**
 * Actividad de ejemplo con la que arranca la app (después de instalarla o de restablecer los datos).
 * Muestra cada estado del recorrido sin tener que crearlo a mano: solicitud recibida y enviada, chat activo
 * con acuerdo por confirmar, acuerdo confirmado, coordinación completada con sellos y una cancelada.
 *
 * Los `pubId` usan el prefijo «ej:» a propósito: no coinciden con ninguna publicación del catálogo, así que
 * estos ejemplos no agregan ni cambian puntos en el mapa.
 */
import type { Coordinacion, Mensaje } from "./coordinaciones";
import type { AvisoDemo, Sello, VecinoId } from "./shared";
import type { Aporte } from "./campanas";

const m = (id: string, from: Mensaje["from"], text: string, at: string): Mensaje => ({ id, from, text, at });

export const COORDINACIONES_EJEMPLO: Coordinacion[] = [
  {
    // Recibida: María debe aceptar o rechazar
    id: "ej-olla", tipo: "favor", pubId: "ej:olla", categoria: "Utensilios", titulo: "Olla grande para la faena del domingo",
    solicitante: "rosa", receptor: "maria", estado: "solicitada",
    creada: "2026-11-08T13:40:00.000Z", actualizada: "2026-11-08T13:40:00.000Z",
    msgs: [m("ej-olla-1", "sistema", "Rosa envió una solicitud.", "2026-11-08T13:40:00.000Z")],
    read: {}, acuerdo: null, cierre: [], sellos: [],
  },
  {
    // Chat activo: Luis propuso el acuerdo y falta que María confirme
    id: "ej-taladro", tipo: "favor", pubId: "ej:taladro", categoria: "Herramientas", titulo: "Préstamo de taladro para colgar repisas",
    solicitante: "maria", receptor: "luis", estado: "aceptada",
    creada: "2026-11-07T15:05:00.000Z", actualizada: "2026-11-08T14:12:00.000Z",
    msgs: [
      m("ej-tal-1", "sistema", "María envió una solicitud.", "2026-11-07T15:05:00.000Z"),
      m("ej-tal-2", "sistema", "Luis aceptó. Se abrió el chat temporal.", "2026-11-07T16:20:00.000Z"),
      m("ej-tal-3", "maria", "¡Gracias, Luis! ¿A qué hora puedo pasar a recogerlo?", "2026-11-07T16:24:00.000Z"),
      m("ej-tal-4", "luis", "Mañana desde las 10 a. m. Te lo presto con brocas y extensión.", "2026-11-08T14:05:00.000Z"),
      m("ej-tal-5", "sistema", "Luis propuso el acuerdo: Pasaje Los Olivos 120 · 2026-11-09 · 10:00.", "2026-11-08T14:10:00.000Z"),
      m("ej-tal-6", "luis", "Confirma cuando puedas y te espero.", "2026-11-08T14:12:00.000Z"),
    ],
    read: { maria: 4, luis: 6 },
    acuerdo: { lugar: "Pasaje Los Olivos 120", fecha: "2026-11-09", hora: "10:00", nota: "Devolverlo el lunes por la tarde.", propuestoPor: "luis", conf: ["luis"] },
    cierre: [], sellos: [],
  },
  {
    // Cachuelo con acuerdo confirmado por ambos: pendiente de realizarse
    id: "ej-fuga", tipo: "cachuelo", pubId: "ej:fuga", categoria: "Gasfitería", titulo: "Arreglo de fuga en el baño",
    solicitante: "maria", receptor: "pedro", estado: "acordada",
    creada: "2026-11-06T18:00:00.000Z", actualizada: "2026-11-07T20:30:00.000Z",
    msgs: [
      m("ej-fug-1", "sistema", "María envió una solicitud.", "2026-11-06T18:00:00.000Z"),
      m("ej-fug-2", "sistema", "Pedro aceptó. Se abrió el chat temporal.", "2026-11-06T19:10:00.000Z"),
      m("ej-fug-3", "pedro", "Primero reviso la fuga y te confirmo el precio antes de empezar.", "2026-11-06T19:12:00.000Z"),
      m("ej-fug-4", "maria", "Perfecto. ¿Te parece el miércoles en la mañana?", "2026-11-07T20:10:00.000Z"),
      m("ej-fug-5", "sistema", "Pedro propuso el acuerdo: Campoy Sector 2, Mz. B Lt. 7 · 2026-11-12 · 09:00.", "2026-11-07T20:20:00.000Z"),
      m("ej-fug-6", "sistema", "Ambas personas confirmaron el acuerdo.", "2026-11-07T20:30:00.000Z"),
    ],
    read: { maria: 6, pedro: 6 },
    acuerdo: { lugar: "Campoy Sector 2, Mz. B Lt. 7", fecha: "2026-11-12", hora: "09:00", nota: "S/ 80 por mano de obra; materiales aparte con boleta.", propuestoPor: "pedro", conf: ["pedro", "maria"] },
    cierre: [], sellos: [],
  },
  {
    // Movilidad completada por ambos, con sellos de Visto Bueno Vecinal
    id: "ej-traslado", tipo: "movilidad", pubId: "ej:traslado", categoria: "Centro de salud", titulo: "Traslado al centro de salud",
    solicitante: "maria", receptor: "carlos", estado: "completada",
    creada: "2026-11-03T12:00:00.000Z", actualizada: "2026-11-04T16:00:00.000Z",
    msgs: [
      m("ej-tra-1", "sistema", "María envió una solicitud.", "2026-11-03T12:00:00.000Z"),
      m("ej-tra-2", "sistema", "Carlos aceptó. Se abrió el chat temporal.", "2026-11-03T12:30:00.000Z"),
      m("ej-tra-3", "carlos", "Paso por el centro de salud a las 8:30. Tengo un asiento libre.", "2026-11-03T12:32:00.000Z"),
      m("ej-tra-4", "sistema", "Ambas personas confirmaron el acuerdo.", "2026-11-03T13:00:00.000Z"),
      m("ej-tra-5", "maria", "¡Muchas gracias por llevarme, Carlos!", "2026-11-04T15:40:00.000Z"),
      m("ej-tra-6", "sistema", "Coordinación completada por ambas personas. Pueden darse un sello.", "2026-11-04T16:00:00.000Z"),
    ],
    read: { maria: 6, carlos: 6 },
    acuerdo: { lugar: "Paradero de la Av. Principal", fecha: "2026-11-04", hora: "08:30", nota: "", propuestoPor: "carlos", conf: ["carlos", "maria"] },
    cierre: ["carlos", "maria"], sellos: ["maria", "carlos"],
  },
  {
    // Enviada por María: esperando respuesta
    id: "ej-tramite", tipo: "favor", pubId: "ej:tramite", categoria: "Habilidades", titulo: "Ayuda con un trámite en línea",
    solicitante: "maria", receptor: "carmen", estado: "solicitada",
    creada: "2026-11-08T16:15:00.000Z", actualizada: "2026-11-08T16:15:00.000Z",
    msgs: [m("ej-trm-1", "sistema", "María envió una solicitud.", "2026-11-08T16:15:00.000Z")],
    read: {}, acuerdo: null, cierre: [], sellos: [],
  },
  {
    // Cancelada con motivo: el historial se conserva en solo lectura
    id: "ej-clases", tipo: "cachuelo", pubId: "ej:clases", categoria: "Clases", titulo: "Clases de matemática para secundaria",
    solicitante: "maria", receptor: "jorge", estado: "cancelada", cerradaPor: "maria", motivo: "Encontramos un horario en el colegio.",
    creada: "2026-11-01T14:00:00.000Z", actualizada: "2026-11-02T10:00:00.000Z",
    msgs: [
      m("ej-cla-1", "sistema", "María envió una solicitud.", "2026-11-01T14:00:00.000Z"),
      m("ej-cla-2", "sistema", "Jorge aceptó. Se abrió el chat temporal.", "2026-11-01T15:00:00.000Z"),
      m("ej-cla-3", "sistema", "María canceló la coordinación · Motivo: Encontramos un horario en el colegio. El acuerdo y el chat se conservan.", "2026-11-02T10:00:00.000Z"),
    ],
    read: { maria: 3, jorge: 3 }, acuerdo: null, cierre: [], sellos: [],
  },
];

/** Sellos que corresponden a la coordinación completada de ejemplo (uno por persona, mes de noviembre). */
export const SELLOS_EJEMPLO: Sello[] = [
  { id: "ej-sello-1", coordId: "ej-traslado", from: "maria", to: "carlos", mes: "2026-11", tipo: "movilidad", valido: true, comentario: "Puntual y muy amable." },
  { id: "ej-sello-2", coordId: "ej-traslado", from: "carlos", to: "maria", mes: "2026-11", tipo: "movilidad", valido: true },
];

/** Avisos que acompañan a la actividad de ejemplo (cada uno lleva a su pantalla). */
export const AVISOS_EJEMPLO: AvisoDemo[] = [
  { id: "ej-av-1", categoria: "favor", titulo: "Rosa envió una solicitud", texto: "Para «Olla grande para la faena del domingo».", href: "/coordinaciones", leida: false, hace: "hace 20 min" },
  { id: "ej-av-2", categoria: "favor", titulo: "Luis propuso un acuerdo", texto: "Pasaje Los Olivos 120 · 9 nov · 10:00", href: "/coordinaciones", leida: false, hace: "hace 1 h" },
  { id: "ej-av-3", categoria: "cachuelo", titulo: "Acuerdo confirmado con Pedro", texto: "Arreglo de fuga en el baño · 12 nov · 9:00", href: "/coordinaciones", leida: true, hace: "ayer" },
  { id: "ej-av-4", categoria: "solidaridad", titulo: "Tu apoyo fue confirmado", texto: "Útiles escolares para Punchana recibió tus 5 cuadernos.", href: "/campanas", leida: true, hace: "hace 3 días" },
];

/** Apoyos de María en campañas: uno ya recibido por la organización y otro comprometido. */
export const APORTES_EJEMPLO: Aporte[] = [
  { id: "ej-ap-1", campId: "camp-utiles", vecino: "maria" as VecinoId, modalidad: "Bienes", cantidad: 5, nota: "Cuadernos cuadriculados", estado: "confirmado", fecha: "2026-11-05" },
  { id: "ej-ap-2", campId: "camp-pollada", vecino: "maria" as VecinoId, modalidad: "Voluntariado", cantidad: 1, nota: "Apoyo en la cocina el sábado", estado: "prometido", fecha: "2026-11-07" },
];
