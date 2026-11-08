/* BarrioConecta · service worker.
 * Qué guarda: la interfaz (páginas estáticas, scripts, estilos, iconos) y las teselas de mapa ya vistas.
 * Qué NO guarda: datos personales. Los datos de la persona viven en IndexedDB del navegador, nunca en estas cachés,
 * y las respuestas marcadas `no-store`/`private` y todo `/api/` (salvo teselas) pasan sin guardarse.
 * Versiones: al cambiar VERSION se crean cachés nuevas y se borran las antiguas; la versión nueva espera a que
 * la persona pulse «Actualizar» (mensaje SKIP_WAITING) para no cambiar la app a mitad de una acción.
 */
const VERSION = "v2";
const SHELL = `bc-shell-${VERSION}`;
const PAGINAS = `bc-paginas-${VERSION}`;
const ESTATICO = `bc-estatico-${VERSION}`;
const TESELAS = `bc-teselas-${VERSION}`;
const ZONA = "bc-zona-v1"; // copia de la zona guardada desde «Mis zonas sin conexión»
const ACTUALES = [SHELL, PAGINAS, ESTATICO, TESELAS, ZONA];
const MAX_TESELAS = 150;

const NUCLEO = ["/", "/inicio", "/mapa", "/emergencias", "/offline", "/perfil", "/coordinaciones", "/buscar", "/favores", "/cachuelos", "/movilidad", "/campanas", "/recursos", "/junta", "/comunidad", "/publicar"];
const RECURSOS = ["/manifest.webmanifest", "/icons/icon-192.png", "/icons/icon-512.png", "/icons/apple-touch-icon.png"];

const cacheable = (res) => res && res.ok && !/no-store|private/i.test(res.headers.get("cache-control") || "");

/** Guarda en STATIC los scripts y estilos que una página cargada necesita. */
async function guardarActivos(html) {
  const urls = [...new Set([...html.matchAll(/\/_next\/static\/[^"'\\\s)]+/g)].map((m) => m[0]))];
  const c = await caches.open(ESTATICO);
  await Promise.all(urls.map((u) => c.match(u).then((hit) => hit || fetch(u).then((r) => cacheable(r) && c.put(u, r)).catch(() => {}))));
}

self.addEventListener("install", (e) => {
  e.waitUntil(
    (async () => {
      const c = await caches.open(SHELL);
      await Promise.all(NUCLEO.map(async (u) => {
        try {
          const r = await fetch(u, { credentials: "same-origin" });
          if (cacheable(r)) { const copia = r.clone(); await c.put(u, r); await guardarActivos(await copia.text()); }
        } catch { /* sin red al instalar: se completa con el uso */ }
      }));
      await Promise.all(RECURSOS.map((u) => fetch(u).then((r) => cacheable(r) && c.put(u, r)).catch(() => {})));
      // Primera instalación: se activa ya. En una actualización espera la confirmación de la persona.
      if (!self.registration.active) await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    const nombres = await caches.keys();
    await Promise.all(nombres.filter((n) => n.startsWith("bc-") && !ACTUALES.includes(n)).map((n) => caches.delete(n)));
    await self.clients.claim();
  })());
});

self.addEventListener("message", (e) => {
  if (e.data?.type === "SKIP_WAITING") { self.skipWaiting(); return; }
  if (e.data?.type !== "precache") return;
  e.waitUntil(
    caches.open(ZONA).then((c) =>
      Promise.all((e.data.urls || []).map((u) => fetch(u, { credentials: "same-origin" }).then((r) => cacheable(r) && c.put(u, r)).catch(() => {}))),
    ),
  );
});

async function recortar(nombre, max) {
  const c = await caches.open(nombre);
  const claves = await c.keys();
  if (claves.length > max) await Promise.all(claves.slice(0, claves.length - max).map((k) => c.delete(k)));
}

/** Caché primero (recursos con hash en el nombre, que no cambian). */
async function cachePrimero(req, nombre) {
  const c = await caches.open(nombre);
  const hit = await c.match(req);
  if (hit) return hit;
  const r = await fetch(req);
  if (cacheable(r)) c.put(req, r.clone());
  return r;
}

/** Devuelve lo guardado y actualiza en segundo plano. */
async function revalidar(req, nombre, max) {
  const c = await caches.open(nombre);
  const hit = await c.match(req);
  const red = fetch(req).then((r) => { if (cacheable(r)) { c.put(req, r.clone()); if (max) recortar(nombre, max); } return r; }).catch(() => null);
  return hit || (await red) || new Response("Sin conexión", { status: 504, statusText: "Sin conexión" });
}

/** Red primero con tiempo límite; si falla, lo último guardado. */
async function redPrimero(req, nombre, ms) {
  const c = await caches.open(nombre);
  try {
    const r = await Promise.race([fetch(req), new Promise((_, no) => setTimeout(() => no(new Error("lento")), ms))]);
    if (cacheable(r)) c.put(req, r.clone());
    return r;
  } catch {
    return (await c.match(req, { ignoreSearch: req.mode === "navigate" })) || (await caches.match(req, { ignoreSearch: true }));
  }
}

self.addEventListener("fetch", (e) => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== "GET" || url.origin !== self.location.origin) return;
  const ruta = url.pathname;

  // Teselas del mapa: solo las zonas ya vistas funcionan sin conexión
  if (ruta.startsWith("/api/mapa/tile/")) { e.respondWith(revalidar(req, TESELAS, MAX_TESELAS)); return; }
  // Resto de /api: siempre red, nunca se guarda
  if (ruta.startsWith("/api/")) {
    e.respondWith(fetch(req).catch(() => (ruta === "/api/mapa/config" ? Response.json({ proveedor: "osm" }) : Response.json({ error: "Sin conexión" }, { status: 503 }))));
    return;
  }
  // Recursos con hash, iconos y worker del mapa
  if (ruta.startsWith("/_next/static/") || ruta.startsWith("/icons/") || ruta.startsWith("/maplibre/")) { e.respondWith(cachePrimero(req, ESTATICO)); return; }

  // Navegación y cargas de pantalla (RSC): red primero, con lo guardado y la pantalla offline como respaldo
  if (req.mode === "navigate" || url.searchParams.has("_rsc")) {
    e.respondWith((async () => {
      const r = (await redPrimero(req, PAGINAS, 4000)) || (await caches.match(ruta, { ignoreSearch: true }));
      if (r) return r;
      if (req.mode === "navigate") return (await caches.match("/offline")) || new Response("Sin conexión", { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } });
      return Response.error();
    })());
    return;
  }
  e.respondWith(revalidar(req, SHELL));
});
