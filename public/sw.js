/* BarrioConecta · service worker de la demo.
 * Red primero para páginas y recursos del mismo origen; si no hay red, usa la copia guardada.
 * "Guardar zona" envía un mensaje `precache` con las rutas a conservar.
 */
const CACHE = "bc-zona-v1";

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

self.addEventListener("message", (e) => {
  if (e.data?.type !== "precache") return;
  e.waitUntil(
    caches.open(CACHE).then((c) =>
      Promise.all((e.data.urls || []).map((u) => fetch(u, { credentials: "same-origin" }).then((r) => r.ok && c.put(u, r)).catch(() => {}))),
    ),
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== self.location.origin) return;
  e.respondWith(
    fetch(req)
      .then((res) => {
        if (res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req, { ignoreSearch: req.mode === "navigate" }).then((r) => r || caches.match("/offline"))),
  );
});
