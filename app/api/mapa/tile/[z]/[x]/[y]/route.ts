/**
 * Proxy de teselas del mapa. Con `MAPTILER_KEY` (solo servidor) usa MapTiler; sin ella, OpenStreetMap.
 * La clave nunca llega al navegador.
 */
export async function GET(_req: Request, ctx: { params: Promise<{ z: string; x: string; y: string }> }) {
  const { z, x, y } = await ctx.params;
  const [zn, xn, yn] = [z, x, y.replace(/\.png$/, "")].map(Number);
  if (![zn, xn, yn].every((n) => Number.isInteger(n) && n >= 0) || zn > 19 || xn >= 2 ** zn || yn >= 2 ** zn) return new Response("Tesela no válida", { status: 400 });

  const key = process.env.MAPTILER_KEY;
  const url = key
    ? `https://api.maptiler.com/maps/streets-v2/256/${zn}/${xn}/${yn}.png?key=${encodeURIComponent(key)}`
    : `https://tile.openstreetmap.org/${zn}/${xn}/${yn}.png`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(10000), headers: { "User-Agent": "BarrioConecta-demo/0.1" } });
    if (!res.ok) return new Response("Sin tesela", { status: res.status === 404 ? 404 : 502 });
    return new Response(res.body, { headers: { "Content-Type": res.headers.get("content-type") ?? "image/png", "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800" } });
  } catch {
    return new Response("Servicio de mapa no disponible", { status: 502 });
  }
}
