import { enLima, type LngLat } from "../geo";
import { RutaError, type RutaCalculada, type ServicioRutas } from "./types";

/** Cliente del servicio de rutas: llama a `/api/ruta`, que consulta el motor de grafos en el servidor. */
export const servicioRutas: ServicioRutas = {
  async calcular(puntos: LngLat[], signal?: AbortSignal): Promise<RutaCalculada> {
    if (puntos.length < 2) throw new RutaError("Elige un origen y un destino.", "sin_ruta");
    if (puntos.some((p) => !enLima(p))) throw new RutaError("El servicio de rutas cubre Lima Metropolitana.", "fuera_de_lima");
    if (typeof navigator !== "undefined" && navigator.onLine === false) throw new RutaError("Sin conexión: no se puede calcular una ruta.", "sin_conexion");
    let res: Response;
    try {
      res = await fetch("/api/ruta", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ puntos }), signal });
    } catch (e) {
      if ((e as Error).name === "AbortError") throw e;
      throw new RutaError("No se pudo contactar el servicio de rutas.", "sin_conexion");
    }
    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.geometria) throw new RutaError(data?.error ?? "El servicio de rutas no respondió.", data?.codigo ?? "servicio");
    return data as RutaCalculada;
  },
};
