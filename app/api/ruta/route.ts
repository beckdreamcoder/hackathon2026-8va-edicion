import { enLima, type LngLat } from "@/lib/map/geo";

/**
 * Proxy del motor de rutas (OSRM por defecto). Corre en el servidor para evitar CORS y para poder
 * apuntar a un motor propio con `OSRM_URL`. Si el motor falla devuelve error: nunca inventa una ruta.
 */
const BASE = (process.env.OSRM_URL || "https://router.project-osrm.org").replace(/\/$/, "");

export async function POST(request: Request) {
  const cuerpo = await request.json().catch(() => null);
  const puntos: LngLat[] | undefined = cuerpo?.puntos;
  const valido = Array.isArray(puntos) && puntos.length >= 2 && puntos.length <= 12 && puntos.every((p) => Array.isArray(p) && p.length === 2 && p.every((n) => typeof n === "number" && Number.isFinite(n)));
  if (!valido) return Response.json({ error: "Puntos no válidos.", codigo: "sin_ruta" }, { status: 400 });
  if (!puntos.every((p) => enLima(p))) return Response.json({ error: "El servicio de rutas cubre Lima Metropolitana.", codigo: "fuera_de_lima" }, { status: 422 });

  const coords = puntos.map(([lng, lat]) => `${lng.toFixed(6)},${lat.toFixed(6)}`).join(";");
  try {
    const res = await fetch(`${BASE}/route/v1/driving/${coords}?overview=full&geometries=geojson&steps=false`, {
      signal: AbortSignal.timeout(10000),
      headers: { "User-Agent": "BarrioConecta-demo/0.1" },
    });
    const data = await res.json().catch(() => null);
    if (data?.code === "NoRoute") return Response.json({ error: "No hay una ruta por calles entre esos puntos.", codigo: "sin_ruta" }, { status: 404 });
    const r = data?.routes?.[0];
    if (!res.ok || data?.code !== "Ok" || !r?.geometry?.coordinates?.length) return Response.json({ error: "El servicio de rutas no pudo calcular el recorrido.", codigo: "servicio" }, { status: 502 });
    return Response.json({
      geometria: r.geometry.coordinates,
      distanciaM: r.distance,
      duracionS: r.duration,
      tramos: (r.legs ?? []).map((l: { distance: number; duration: number }) => ({ distanciaM: l.distance, duracionS: l.duration })),
      fuente: "OSRM · red vial de OpenStreetMap",
    });
  } catch {
    return Response.json({ error: "No se pudo contactar el servicio de rutas.", codigo: "servicio" }, { status: 502 });
  }
}
