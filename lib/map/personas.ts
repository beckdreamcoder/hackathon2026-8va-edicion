import { CAMPOY, distancia, type LngLat } from "./geo";
import type { VecinoId } from "@/lib/demo/shared";

/**
 * Personas e incidentes SIMULADOS para el mapa (radar y calor). No provienen de ningún servicio real:
 * son datos de demostración. No hay alertas oficiales conectadas.
 */

export type EstadoPersona = "solicita" | "disponible" | "emergencia";

export const ESTADO_PERSONA: Record<EstadoPersona, { etiqueta: string; fondo: string; badge: string }> = {
  solicita: { etiqueta: "Solicita ayuda", fondo: "bg-[#e8710a]", badge: "bg-[#fdebd3] text-[#8a4300]" },
  disponible: { etiqueta: "Disponible", fondo: "bg-[#2f7d32]", badge: "bg-[#e1f1e2] text-[#1f5a22]" },
  emergencia: { etiqueta: "Emergencia", fondo: "bg-[#c8102e]", badge: "bg-[#fbe3e7] text-[#9e0c24]" },
};

export type PersonaSim = {
  key: string;
  vecino: VecinoId;
  lngLat: LngLat;
  estado: EstadoPersona;
  tipo: "movilidad" | "favor" | "emergencia";
  /** Emergencia SOS de demostración. */
  sos?: boolean;
  /** Mensaje corto que se ve sobre el marcador. */
  msg: string;
  necesidad: string;
  origen: string;
  destino?: string;
  /** Destino geográfico, si se conoce (para evaluar compatibilidad con una ruta). */
  destinoLngLat?: LngLat;
};

/** Mi zona aproximada (centro del radar). */
export const MI_ZONA: LngLat = CAMPOY;

export const PERSONAS_SIM: PersonaSim[] = [
  { key: "p-luis", vecino: "luis", lngLat: [-77.0132, -12.0183], estado: "solicita", tipo: "movilidad", msg: "Voy a Campoy, ¿alguien me lleva?", necesidad: "Necesita que lo lleven a Campoy", origen: "Zárate (zona aproximada)", destino: "Campoy", destinoLngLat: CAMPOY },
  { key: "p-carmen", vecino: "carmen", lngLat: [-77.0275, -11.982], estado: "solicita", tipo: "movilidad", msg: "Voy al hospital mañana, ¿me llevan?", necesidad: "Necesita traslado al hospital, mañana 9:00", origen: "Norte de SJL (zona aproximada)", destino: "Hospital de la zona", destinoLngLat: [-76.999, -11.97] },
  // Coordenadas ajustadas a calles reales cercanas a Campoy (zona aproximada, 0,9 a 1,4 km de mi zona).
  { key: "p-jorge", vecino: "jorge", lngLat: [-76.99843, -12.00869], estado: "solicita", tipo: "movilidad", msg: "Voy al hospital, ¿alguien me acerca?", necesidad: "Necesita que lo acerquen al hospital", origen: "Campoy Sector 5 (zona aproximada)", destino: "Hospital de la zona", destinoLngLat: [-76.999, -11.97] },
  { key: "p-lucia", vecino: "lucia", lngLat: [-77.01401, -12.00394], estado: "solicita", tipo: "favor", msg: "Estoy por Campoy, ¿alguien me da una mano?", necesidad: "Necesita una mano con cosas pesadas", origen: "Campoy Sector 2 (zona aproximada)" },
  { key: "p-sofia", vecino: "sofia", lngLat: [-76.9925, -12.006], estado: "emergencia", tipo: "emergencia", sos: true, msg: "¡Necesito ayuda urgente! ¿Hay algún vecino cerca?", necesidad: "SOS: pide ayuda urgente (emergencia de demostración)", origen: "Campoy Sector 4 (zona aproximada)" },
  { key: "p-carlos", vecino: "carlos", lngLat: [-76.989, -11.993], estado: "disponible", tipo: "movilidad", msg: "Paso por el hospital · 3 asientos", necesidad: "Ofrece llevar a vecinos hacia el hospital", origen: "Campoy (zona aproximada)", destino: "Hospital de la zona" },
];

export type TipoIncidente = "sismo" | "inundacion" | "agua" | "ayuda";

export const TIPO_INCIDENTE: Record<TipoIncidente, { etiqueta: string; icono: string }> = {
  sismo: { etiqueta: "Sismo", icono: "M3 12h4l2-6 4 12 2-6h6" },
  inundacion: { etiqueta: "Inundación", icono: "M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.500 6-11 6-11z" },
  agua: { etiqueta: "Corte de agua", icono: "M5 5l14 14M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.500 6-11 6-11z" },
  ayuda: { etiqueta: "Solicitud de ayuda", icono: "M12 20s-8-5-8-11a4.500 4.500 0 0 1 8-2.500A4.500 4.500 0 0 1 20 9c0 6-8 11-8 11z" },
};

export type IncidenteSim = {
  id: string;
  tipo: TipoIncidente;
  lngLat: LngLat;
  /** 1 (baja) a 5 (alta). */
  intensidad: number;
  radioM: number;
  titulo: string;
  detalle: string;
  hace: string;
  /** Pantalla de la app donde se gestiona, si corresponde. */
  href?: string;
};

export const INCIDENTES_SIM: IncidenteSim[] = [
  { id: "sim-sismo-1", tipo: "sismo", lngLat: [-77.0428, -12.0464], intensidad: 3, radioM: 1300, titulo: "Sismo leve percibido (M 3.8)", detalle: "Percibido por 14 vecinos. Sin daños reportados.", hace: "hace 12 min" },
  { id: "sim-inund-1", tipo: "inundacion", lngLat: [-77.0145, -11.985], intensidad: 4, radioM: 520, titulo: "Aniego en avenida principal", detalle: "Agua acumulada en dos cuadras. Evita el paso de vehículos bajos.", hace: "hace 25 min" },
  { id: "sim-agua-1", tipo: "agua", lngLat: [-76.985, -12.01], intensidad: 2, radioM: 650, titulo: "Corte de agua programado", detalle: "Sin servicio por mantenimiento. Reposición estimada en 4 horas.", hace: "hace 1 h" },
  { id: "sim-ayuda-1", tipo: "ayuda", lngLat: [-77.005, -12.025], intensidad: 3, radioM: 450, titulo: "Varias solicitudes de ayuda juntas", detalle: "Tres vecinos piden ayuda con herramientas y traslados.", hace: "hace 18 min", href: "/favores" },
];

/** Etiqueta de intensidad para la leyenda y las fichas. */
export const NIVEL = ["", "Muy baja", "Baja", "Media", "Alta", "Muy alta"];

/** Distancia real en metros desde mi zona. */
export const desdeMiZona = (p: LngLat) => distancia(MI_ZONA, p);

export const RADIOS_KM = [3, 5, 10] as const;
export const kmTxt = (m: number) => (m < 1000 ? `${Math.round(m)} m` : `${(m / 1000).toFixed(1)} km`);
