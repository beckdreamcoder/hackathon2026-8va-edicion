/** Utilidades geográficas puras (sin dependencias del mapa ni del servicio de rutas). */

export type LngLat = [number, number]; // [lng, lat], igual que GeoJSON y MapLibre

export const LIMA_CENTRO: LngLat = [-77.0428, -12.0464];
/** Caja que acepta el servicio de rutas: Lima Metropolitana y alrededores. [oeste, sur, este, norte] */
export const LIMA_CAJA: [number, number, number, number] = [-77.25, -12.45, -76.75, -11.75];
/** Centro aproximado de Campoy (zona de la demo; no es una dirección exacta). */
export const CAMPOY: LngLat = [-77.0013, -12.0005];

const R = 6371000;
const rad = (g: number) => (g * Math.PI) / 180;

export function enLima([lng, lat]: LngLat) {
  return lng >= LIMA_CAJA[0] && lng <= LIMA_CAJA[2] && lat >= LIMA_CAJA[1] && lat <= LIMA_CAJA[3];
}

/** Distancia en metros entre dos puntos (haversine). */
export function distancia(a: LngLat, b: LngLat) {
  const dLat = rad(b[1] - a[1]);
  const dLng = rad(b[0] - a[0]);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a[1])) * Math.cos(rad(b[1])) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Rumbo inicial de a hacia b, en grados (0-360). */
export function rumbo(a: LngLat, b: LngLat) {
  const y = Math.sin(rad(b[0] - a[0])) * Math.cos(rad(b[1]));
  const x = Math.cos(rad(a[1])) * Math.sin(rad(b[1])) - Math.sin(rad(a[1])) * Math.cos(rad(b[1])) * Math.cos(rad(b[0] - a[0]));
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

/** Coseno de la diferencia entre dos rumbos: 1 = misma dirección, -1 = opuesta. */
export const cosRumbos = (a: number, b: number) => Math.cos(rad(a - b));

/** Metros acumulados al inicio de cada vértice de la línea. */
export function acumulada(linea: LngLat[]) {
  const acc = [0];
  for (let i = 1; i < linea.length; i++) acc.push(acc[i - 1] + distancia(linea[i - 1], linea[i]));
  return acc;
}

export type Proyeccion = { punto: LngLat; distanciaM: number; alo: number; indice: number };

/** Punto más cercano de la línea a `p`: distancia al punto, metros recorridos hasta él e índice de tramo. */
export function proyectar(linea: LngLat[], acc: number[], p: LngLat): Proyeccion {
  const k = Math.cos(rad(p[1]));
  let mejor: Proyeccion = { punto: linea[0], distanciaM: Infinity, alo: 0, indice: 0 };
  for (let i = 0; i < linea.length - 1; i++) {
    const [ax, ay] = [linea[i][0] * k, linea[i][1]];
    const [bx, by] = [linea[i + 1][0] * k, linea[i + 1][1]];
    const [px, py] = [p[0] * k, p[1]];
    const dx = bx - ax;
    const dy = by - ay;
    const len2 = dx * dx + dy * dy;
    const t = len2 === 0 ? 0 : Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len2));
    const q: LngLat = [linea[i][0] + (linea[i + 1][0] - linea[i][0]) * t, linea[i][1] + (linea[i + 1][1] - linea[i][1]) * t];
    const d = distancia(p, q);
    if (d < mejor.distanciaM) mejor = { punto: q, distanciaM: d, alo: acc[i] + t * (acc[i + 1] - acc[i]), indice: i };
  }
  return mejor;
}

/** Posición y rumbo tras recorrer `d` metros sobre la línea. */
export function posicionEn(linea: LngLat[], acc: number[], d: number): { punto: LngLat; rumbo: number } {
  const total = acc[acc.length - 1];
  const x = Math.max(0, Math.min(total, d));
  let i = 1;
  while (i < acc.length - 1 && acc[i] < x) i++;
  const tramo = acc[i] - acc[i - 1] || 1;
  const t = (x - acc[i - 1]) / tramo;
  const a = linea[i - 1];
  const b = linea[i];
  return { punto: [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t], rumbo: rumbo(a, b) };
}

export const km = (m: number) => (m < 1000 ? `${Math.round(m)} m` : `${(m / 1000).toFixed(1)} km`);
export const minutos = (s: number) => (s < 90 ? `${Math.max(1, Math.round(s / 60))} min` : `${Math.round(s / 60)} min`);

/**
 * Convierte la posición del mapa ilustrativo anterior (porcentaje 0-100) a coordenadas reales
 * dentro de una caja alrededor de Campoy. Mantiene los datos existentes sin cambiar su modelo.
 */
export function porcentajeALngLat(x: number, y: number): LngLat {
  const ancho = 0.034; // ≈ 3,7 km
  const alto = 0.03; // ≈ 3,3 km
  return [CAMPOY[0] - ancho / 2 + (x / 100) * ancho, CAMPOY[1] + alto / 2 - (y / 100) * alto];
}
