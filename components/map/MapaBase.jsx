"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState } from "react";
import { CAMPOY } from "@/lib/map/geo";

const ENVOLTURA = "min-w-12 min-h-12 flex flex-col items-center justify-end bg-transparent border-0 p-0 cursor-pointer";
const ETIQUETA = "bg-white border border-(--color-line) rounded-[12px] px-2 py-[3px] text-[12px] font-bold whitespace-normal text-center leading-tight mb-[3px] shadow-[0_1px_4px_rgba(0,0,0,.15)] max-w-40";
const UMBRAL_PX = 48;
const ZOOM_SIN_GRUPOS = 15;

const PERSONA_SVG = `<svg viewBox="0 0 24 24" class="w-6 h-6 fill-none stroke-current stroke-2" style="stroke-linecap:round;stroke-linejoin:round"><circle cx="12" cy="8" r="3.5"/><path d="M5 20a7 7 0 0 1 14 0"/></svg>`;

function crearElemento({ cls, ini, persona, label, bub, badge, sos, onClick }) {
  const el = document.createElement("button");
  el.type = "button";
  el.className = ENVOLTURA;
  el.setAttribute("aria-label", label ?? "");
  if (bub) { const b = document.createElement("span"); b.className = ETIQUETA; b.textContent = bub; el.append(b); }
  const dot = document.createElement("span");
  dot.className = cls;
  if (persona) dot.innerHTML = PERSONA_SVG; else dot.textContent = ini ?? "";
  if (sos) {
    const s = document.createElement("span");
    s.className = "absolute -top-2.5 -right-4 bg-white text-[#c8102e] border-[1.5px] border-[#c8102e] rounded-full px-1.5 text-[10px] font-extrabold leading-4 shadow-[0_1px_3px_rgba(0,0,0,.3)] animate-pulse motion-reduce:animate-none";
    s.textContent = "SOS";
    dot.append(s);
  } else if (badge) {
    const b = document.createElement("span");
    b.className = "b";
    b.setAttribute("aria-hidden", "true");
    b.innerHTML = `<svg viewBox="0 0 24 24"><path d="${badge}"/></svg>`;
    dot.append(b);
  }
  el.append(dot);
  if (onClick) el.addEventListener("click", (e) => { e.stopPropagation(); onClick(); });
  return el;
}

/**
 * Mapa geográfico real (MapLibre). Teselas por `/api/mapa/tile` (la clave de MapTiler, si existe, solo vive en el servidor).
 * No sabe nada de rutas ni de coordinaciones: dibuja puntos, calor, una línea y marcadores extra, y avisa de los clics.
 */
export default function MapaBase({ puntos, extras, calor, linea, radar, grupoCls, vehiculoCls, seleccionando, onMapClick, onPick, onCalor, apiRef }) {
  const cont = useRef(null);
  const mapRef = useRef(null);
  const libRef = useRef(null);
  const marcas = useRef([]);
  const extraMarcas = useRef([]);
  const vehiculo = useRef(null);
  const cb = useRef({});
  const barrido = useRef(null);
  useEffect(() => { cb.current = { onMapClick, onPick, onCalor }; });
  const [listo, setListo] = useState(false);
  const [zoom, setZoom] = useState(13);
  const [falla, setFalla] = useState(false);

  useEffect(() => {
    let cancelado = false;
    let ro;
    (async () => {
      const mod = await import("maplibre-gl");
      const ml = mod.default ?? mod;
      const prov = await fetch("/api/mapa/config").then((r) => r.json()).then((j) => j.proveedor).catch(() => "osm");
      if (cancelado || !cont.current) return;
      ml.setWorkerUrl("/maplibre/maplibre-gl-worker.mjs");
      libRef.current = ml;
      const atr = prov === "maptiler"
        ? '© <a href="https://www.maptiler.com/copyright/" target="_blank" rel="noreferrer">MapTiler</a> © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>'
        : '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a>';
      const map = new ml.Map({
        container: cont.current,
        style: { version: 8, sources: { base: { type: "raster", tiles: [`${window.location.origin}/api/mapa/tile/{z}/{x}/{y}`], tileSize: 256, maxzoom: 19, attribution: atr } }, layers: [{ id: "base", type: "raster", source: "base" }] },
        center: CAMPOY, zoom: 13.5, minZoom: 9, maxZoom: 18,
        maxBounds: [[-77.35, -12.55], [-76.65, -11.65]],
        dragRotate: false, attributionControl: false, cooperativeGestures: false,
      });
      map.touchZoomRotate.disableRotation();
      map.addControl(new ml.AttributionControl({ compact: true }), "bottom-right");
      mapRef.current = map;
      map.on("error", (e) => { if (e?.sourceId === "base") setFalla(true); });
      map.on("data", (e) => { if (e?.sourceId === "base" && e.isSourceLoaded) setFalla(false); });
      map.on("zoomend", () => setZoom(Math.floor(map.getZoom() * 2) / 2));
      map.on("click", (e) => {
        const f = map.getLayer("calor") ? map.queryRenderedFeatures(e.point, { layers: ["calor"] })[0] : null;
        if (f && cb.current.onCalor) { cb.current.onCalor(f.properties.id); return; }
        cb.current.onMapClick?.([e.lngLat.lng, e.lngLat.lat]);
      });
      map.on("load", () => {
        const vacio = { type: "FeatureCollection", features: [] };
        map.addSource("calor", { type: "geojson", data: vacio });
        map.addLayer({ id: "calor", type: "circle", source: "calor", paint: {
          "circle-radius": ["interpolate", ["exponential", 2], ["zoom"], 10, ["*", ["get", "r"], 0.0625], 14, ["get", "r"], 18, ["*", ["get", "r"], 16]],
          "circle-color": ["interpolate", ["linear"], ["get", "i"], 1, "#f5c542", 3, "#f08a24", 5, "#c8102e"], "circle-opacity": 0.5, "circle-blur": 0.8 } });
        map.addSource("radar", { type: "geojson", data: vacio });
        map.addLayer({ id: "radar-relleno", type: "fill", source: "radar", paint: { "fill-color": "#2f7d32", "fill-opacity": 0.07 } });
        map.addLayer({ id: "radar-borde", type: "line", source: "radar", paint: { "line-color": "#2f7d32", "line-width": 2, "line-dasharray": [2, 2] } });
        map.addSource("ruta", { type: "geojson", data: vacio });
        map.addLayer({ id: "ruta-borde", type: "line", source: "ruta", layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": "#ffffff", "line-width": 9 } });
        map.addLayer({ id: "ruta-linea", type: "line", source: "ruta", layout: { "line-cap": "round", "line-join": "round" }, paint: { "line-color": "#c8102e", "line-width": 5 } });
        setListo(true);
      });
      ro = new ResizeObserver(() => map.resize());
      ro.observe(cont.current);
      apiRef.current = {
        zoomIn: () => map.zoomIn(),
        zoomOut: () => map.zoomOut(),
        volarA: (ll, z) => map.easeTo({ center: ll, zoom: z ?? map.getZoom() }),
        ajustar: (coords) => {
          if (!coords?.length) return;
          const b = coords.reduce((acc, c) => acc.extend(c), new ml.LngLatBounds(coords[0], coords[0]));
          map.fitBounds(b, { padding: { top: 70, bottom: 230, left: 40, right: 40 }, maxZoom: 16, duration: 600 });
        },
        moverVehiculo: (ll) => {
          if (!vehiculo.current) {
            const el = crearElemento({ cls: vehiculoCls, ini: "", label: "Vehículo (simulado)" });
            el.style.pointerEvents = "none";
            el.firstElementChild.innerHTML = '<svg viewBox="0 0 24 24" class="w-6 h-6 fill-none stroke-current stroke-2" style="stroke-linecap:round;stroke-linejoin:round"><path d="M5 16V11l2-5h10l2 5v5M5 16h14M5 16v2M19 16v2M8 13h.01M16 13h.01"/></svg>';
            vehiculo.current = new ml.Marker({ element: el, anchor: "center" }).setLngLat(ll).addTo(map);
          } else vehiculo.current.setLngLat(ll);
        },
        quitarVehiculo: () => { vehiculo.current?.remove(); vehiculo.current = null; },
      };
    })();
    return () => {
      cancelado = true;
      ro?.disconnect();
      marcas.current.forEach((m) => m.remove());
      extraMarcas.current.forEach((m) => m.remove());
      vehiculo.current?.remove();
      vehiculo.current = null;
      mapRef.current?.remove();
      mapRef.current = null;
      apiRef.current = null;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Puntos de Favores, Cachuelos y Emergencias, agrupados por cercanía en pantalla
  useEffect(() => {
    const map = mapRef.current; const ml = libRef.current;
    if (!listo || !map) return;
    marcas.current.forEach((m) => m.remove());
    marcas.current = [];
    const grupos = [];
    puntos.forEach((p) => {
      const px = map.project(p.lngLat);
      const g = zoom < ZOOM_SIN_GRUPOS && grupos.find((g) => Math.hypot(g.px.x - px.x, g.px.y - px.y) < UMBRAL_PX);
      if (g) g.items.push(p); else grupos.push({ px, items: [p] });
    });
    grupos.forEach((g) => {
      const uno = g.items.length === 1 ? g.items[0] : null;
      const centro = uno ? uno.lngLat : [g.items.reduce((s, p) => s + p.lngLat[0], 0) / g.items.length, g.items.reduce((s, p) => s + p.lngLat[1], 0) / g.items.length];
      const el = crearElemento(uno
        ? { cls: uno.cls, ini: uno.ini, persona: uno.persona, label: uno.title, bub: uno.bub, badge: uno.badge, sos: uno.sos, onClick: () => cb.current.onPick?.(uno.key) }
        : { cls: grupoCls, ini: String(g.items.length), label: `Grupo de ${g.items.length} puntos. Acerca el mapa para verlos`, onClick: () => map.easeTo({ center: centro, zoom: Math.min(map.getZoom() + 2, ZOOM_SIN_GRUPOS + 1) }) });
      marcas.current.push(new ml.Marker({ element: el, anchor: "bottom" }).setLngLat(centro).addTo(map));
    });
  }, [puntos, zoom, listo, grupoCls]);

  // Marcadores propios de RutaJuntos (origen, destino, pasajeros, paradas)
  useEffect(() => {
    const map = mapRef.current; const ml = libRef.current;
    if (!listo || !map) return;
    extraMarcas.current.forEach((m) => m.remove());
    extraMarcas.current = (extras ?? []).map((x) => new ml.Marker({ element: crearElemento(x), anchor: x.ancla ?? "bottom" }).setLngLat(x.lngLat).addTo(map));
  }, [extras, listo]);

  useEffect(() => {
    if (!listo) return;
    mapRef.current.getSource("calor")?.setData({ type: "FeatureCollection", features: (calor ?? []).map((c) => ({ type: "Feature", properties: { id: c.id, r: c.r, i: c.i }, geometry: { type: "Point", coordinates: c.lngLat } })) });
  }, [calor, listo]);

  // Radar: círculo de alcance en metros reales y barrido animado centrado en el usuario
  useEffect(() => {
    const map = mapRef.current; const ml = libRef.current;
    if (!listo || !map) return undefined;
    const poli = (c, r) => { const k = 111320 * Math.cos((c[1] * Math.PI) / 180); return Array.from({ length: 65 }, (_, i) => { const a = (i / 64) * 2 * Math.PI; return [c[0] + (r * Math.cos(a)) / k, c[1] + (r * Math.sin(a)) / 111320]; }); };
    map.getSource("radar")?.setData({ type: "FeatureCollection", features: radar ? [{ type: "Feature", properties: {}, geometry: { type: "Polygon", coordinates: [poli(radar.centro, radar.radioM)] } }] : [] });
    if (!radar) return undefined;
    const el = document.createElement("div");
    el.style.pointerEvents = "none";
    const giro = document.createElement("div");
    giro.className = "rounded-[50%] animate-spin motion-reduce:animate-none";
    giro.style.animationDuration = "3.5s";
    giro.style.background = "conic-gradient(from 0deg, rgba(47,125,50,0) 0deg, rgba(47,125,50,.38) 70deg, rgba(47,125,50,0) 72deg)";
    el.append(giro);
    const marca = new ml.Marker({ element: el, anchor: "center" }).setLngLat(radar.centro).addTo(map);
    barrido.current = marca;
    const tam = () => { const k = 111320 * Math.cos((radar.centro[1] * Math.PI) / 180); const a = map.project(radar.centro); const b = map.project([radar.centro[0] + radar.radioM / k, radar.centro[1]]); const d = Math.max(0, Math.abs(b.x - a.x) * 2); giro.style.width = `${d}px`; giro.style.height = `${d}px`; };
    tam();
    map.on("move", tam);
    return () => { map.off("move", tam); marca.remove(); barrido.current = null; map.getSource("radar")?.setData({ type: "FeatureCollection", features: [] }); };
  }, [radar, listo]);

  useEffect(() => {
    if (!listo) return;
    mapRef.current.getSource("ruta")?.setData({ type: "FeatureCollection", features: linea?.length > 1 ? [{ type: "Feature", properties: {}, geometry: { type: "LineString", coordinates: linea } }] : [] });
  }, [linea, listo]);

  useEffect(() => {
    if (mapRef.current) mapRef.current.getCanvas().style.cursor = seleccionando ? "crosshair" : "";
  }, [seleccionando, listo]);

  return (
    <div className="absolute inset-0 bg-[#efe8dd]">
      <div ref={cont} className="w-full h-full" role="application" aria-label="Mapa de Lima. Arrastra para mover, usa + y − o pellizca para acercar" />
      {falla && (<p className="absolute left-3 right-18 top-3 z-2 bg-[#fbe3e7] text-[#9e0c24] border border-[#f0b8c0] rounded-[14px] px-3 py-2 text-[14px] font-bold" role="alert">No se pudieron cargar las teselas del mapa. Revisa tu conexión.</p>)}
    </div>
  );
}
