/** Indica qué proveedor de teselas usa el servidor, sin revelar ninguna clave. */
export async function GET() {
  return Response.json({ proveedor: process.env.MAPTILER_KEY ? "maptiler" : "osm" });
}
