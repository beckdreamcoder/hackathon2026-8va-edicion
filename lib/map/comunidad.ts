import type { LngLat } from "./geo";
import type { VecinoId } from "@/lib/demo/shared";
import datos from "./comunidad-datos.json";

/**
 * Comunidad SIMULADA repartida por Lima: cachuelos, favores, movilidad y emergencias SOS de demostración.
 * Las ubicaciones se ajustaron a calles reales (OpenStreetMap); las personas y mensajes son ficticios.
 * Ningún dato sale del navegador ni avisa a servicios reales.
 */
export type PublicacionSim = {
  key: string;
  vecino: VecinoId;
  distrito: string;
  tipo: "cachuelo" | "favor" | "movilidad" | "emergencia";
  estado: "solicita" | "disponible" | "emergencia";
  categoria: string;
  titulo: string;
  descripcion: string;
  /** Pago referencial en soles (solo cachuelos). */
  pago: string | null;
  msg: string;
  origen: string;
  destino?: string;
  destinoLngLat?: LngLat;
  lngLat: LngLat;
  sos?: boolean;
  /** Pasajeros pensados para probar RutaJuntos cerca de Anexo 22. */
  anexo22?: boolean;
};

export const COMUNIDAD_SIM = datos as unknown as PublicacionSim[];

/** Puntos de referencia reales que se pueden fijar como centro manual del radar. */
export const ANEXO_22: LngLat = [-76.96066, -11.92527]; // Plaza de Armas de Jicamarca Anexo 22
export const ESTACION_BAYOVAR: LngLat = [-76.98762, -11.95979];
