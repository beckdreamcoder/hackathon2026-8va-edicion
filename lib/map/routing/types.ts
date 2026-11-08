import type { LngLat } from "../geo";

/** Resultado de calcular una ruta sobre la red vial. */
export type RutaCalculada = {
  /** Recorrido siguiendo calles reales: lista de [lng, lat]. */
  geometria: LngLat[];
  distanciaM: number;
  duracionS: number;
  /** Distancia y duración de cada tramo entre puntos consecutivos. */
  tramos: { distanciaM: number; duracionS: number }[];
  /** Quién calculó la ruta. Nunca se rellena con líneas rectas. */
  fuente: string;
};

export class RutaError extends Error {
  constructor(message: string, readonly codigo: "sin_ruta" | "servicio" | "fuera_de_lima" | "sin_conexion" = "servicio") {
    super(message);
    this.name = "RutaError";
  }
}

/**
 * Contrato del servicio de rutas. El mapa solo conoce esta interfaz: se puede cambiar OSRM
 * por Valhalla, GraphHopper u otro motor basado en grafos sin tocar la pantalla.
 */
export interface ServicioRutas {
  /** Ruta por calles que pasa por todos los puntos, en orden. Lanza `RutaError` si no puede calcularla. */
  calcular(puntos: LngLat[], signal?: AbortSignal): Promise<RutaCalculada>;
}
