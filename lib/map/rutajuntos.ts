import { acumulada, cosRumbos, posicionEn, proyectar, rumbo, type LngLat } from "./geo";
import type { VecinoId } from "@/lib/demo/shared";

/**
 * RutaJuntos: lógica de emparejamiento entre un vehículo con ruta y pasajeros cercanos.
 * Vehículos y pasajeros son SIMULADOS (semilla de demostración). La ruta y la geografía vienen
 * del servicio de rutas y del mapa; aquí solo se evalúa la compatibilidad.
 */

export type Vehiculo = { id: string; conductor: VecinoId; nombre: string; asientos: number };
export type Pasajero = { id: string; vecino: VecinoId; origen: LngLat; destino: LngLat; origenTxt: string; destinoTxt: string; plazas: number; msg?: string; /** Sin destino propio: se asume el de la ruta y no se agrega parada de bajada. */ sinDestino?: boolean };

export const VEHICULO_SEMILLA: Vehiculo = { id: "veh-1", conductor: "carlos", nombre: "Carlos · auto", asientos: 3 };

export const PASAJEROS_SEMILLA: Pasajero[] = [
  // Posiciones pensadas sobre la ruta de ejemplo Campoy → hospital (viaje de ejemplo del panel).
  { id: "pas-rosa", vecino: "rosa", origen: [-77.0044, -11.9921], destino: [-77.003, -11.9727], origenTxt: "Av. Principal, Campoy", destinoTxt: "Cerca del hospital", plazas: 1, msg: "Voy al hospital, ¿alguien me lleva?" },
  { id: "pas-luis", vecino: "luis", origen: [-77.0036, -11.9753], destino: [-77.0049, -11.9918], origenTxt: "Cerca del hospital", destinoTxt: "Campoy Sector 3 (sentido contrario)", plazas: 1, msg: "Bajo a Campoy, ¿me acercan?" },
  { id: "pas-maria", vecino: "maria", origen: [-77.0155, -11.9862], destino: [-77.0001, -11.9718], origenTxt: "Campoy Sector 2 (alejada de la ruta)", destinoTxt: "Cerca del hospital", plazas: 1, msg: "Necesito llegar al hospital" },
  { id: "pas-carmen", vecino: "carmen", origen: [-77.0047, -11.9966], destino: [-77.0031, -11.9729], origenTxt: "Campoy Sector 4", destinoTxt: "Cerca del hospital", plazas: 4, msg: "Vamos 4 al hospital, ¿hay sitio?" },
];

export const UMBRALES = { recogidaM: 700, destinoM: 900, cosMin: 0.3, desvioMaxS: 360, adelanteMinM: 150 };

export type LineaRuta = { geometria: LngLat[]; acc: number[]; distanciaM: number; duracionS: number };

export const crearLinea = (geometria: LngLat[], distanciaM: number, duracionS: number): LineaRuta => ({ geometria, acc: acumulada(geometria), distanciaM, duracionS });

export type Evaluacion = {
  compatible: boolean;
  motivos: string[];
  recogidaM: number;
  destinoM: number;
  coseno: number;
  desvioM: number;
  desvioS: number;
  /** Metros de ruta hasta los puntos más cercanos a la recogida y al destino. */
  recogidaAlo: number;
  destinoAlo: number;
};

/**
 * Evalúa si un pasajero encaja en la ruta actual: ubicación (cercanía a la ruta), destino y dirección
 * (avanza en el mismo sentido), asientos y desvío estimado. El desvío es una ESTIMACIÓN geométrica;
 * el valor real se obtiene recalculando la ruta con el servicio de rutas al aceptar.
 */
export function evaluar(linea: LineaRuta, p: Pasajero, asientosLibres: number, desdeM: number, bloqueado: boolean): Evaluacion {
  const pr = proyectar(linea.geometria, linea.acc, p.origen);
  const pd = proyectar(linea.geometria, linea.acc, p.destino);
  const a = posicionEn(linea.geometria, linea.acc, pr.alo).punto;
  const b = posicionEn(linea.geometria, linea.acc, pd.alo).punto;
  const coseno = pd.alo - pr.alo > 1 ? cosRumbos(rumbo(p.origen, p.destino), rumbo(a, b)) : -1;
  const vel = Math.max(3, linea.distanciaM / Math.max(1, linea.duracionS));
  const desvioM = Math.round(1.3 * 2 * (pr.distanciaM + pd.distanciaM));
  const desvioS = Math.round(desvioM / vel + 90);

  const motivos: string[] = [];
  if (bloqueado) motivos.push("Hay un bloqueo entre ustedes");
  if (p.plazas > asientosLibres) motivos.push(`Pide ${p.plazas} ${p.plazas === 1 ? "asiento" : "asientos"} y quedan ${asientosLibres}`);
  if (pr.distanciaM > UMBRALES.recogidaM) motivos.push("El punto de recogida está lejos de la ruta");
  if (pd.distanciaM > UMBRALES.destinoM) motivos.push("Su destino queda lejos de la ruta");
  if (pr.alo < desdeM - 30) motivos.push("La recogida ya quedó atrás");
  if (pd.alo - pr.alo < UMBRALES.adelanteMinM || coseno < UMBRALES.cosMin) motivos.push("Va en otra dirección");
  if (desvioS > UMBRALES.desvioMaxS && motivos.length === 0) motivos.push("El desvío estimado es demasiado largo");

  return { compatible: motivos.length === 0, motivos, recogidaM: Math.round(pr.distanciaM), destinoM: Math.round(pd.distanciaM), coseno: Math.round(coseno * 100) / 100, desvioM, desvioS, recogidaAlo: pr.alo, destinoAlo: pd.alo };
}

export type Parada = { pasajeroId: string; tipo: "recogida" | "destino"; punto: LngLat };

/** Ordena las paradas según su avance sobre la ruta base, con la recogida siempre antes que el destino. */
export function ordenarParadas(base: LineaRuta, paradas: Parada[]): Parada[] {
  const clave = (p: Parada) => proyectar(base.geometria, base.acc, p.punto).alo + (p.tipo === "destino" ? 0.5 : 0);
  return [...paradas].sort((x, y) => (x.pasajeroId === y.pasajeroId ? (x.tipo === "recogida" ? -1 : 1) : clave(x) - clave(y)));
}
