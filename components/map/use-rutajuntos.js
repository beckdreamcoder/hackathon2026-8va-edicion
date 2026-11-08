"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CAMPOY, posicionEn, proyectar } from "@/lib/map/geo";
import { ANEXO_22, ESTACION_BAYOVAR } from "@/lib/map/comunidad";
import { servicioRutas } from "@/lib/map/routing/cliente";
import { RutaError } from "@/lib/map/routing/types";
import { PASAJEROS_SEMILLA, VEHICULO_SEMILLA, crearLinea, evaluar, ordenarParadas } from "@/lib/map/rutajuntos";
import { useBloqueos, estaBloqueado, abrirCoordinacionMovilidad } from "@/lib/demo/coordinaciones";
import { useSesion, VECINOS, logEvento } from "@/lib/demo/shared";

export const DESTINO_EJEMPLO = [-76.999, -11.97];
const TICK_MS = 100;

/**
 * Controlador de RutaJuntos: puntos A/B, ruta calculada por el servicio de rutas, simulación del
 * vehículo, evaluación de pasajeros y aceptación con recálculo. No dibuja nada: solo orquesta.
 */
export function useRutaJuntos({ activo, apiRef }) {
  const [sesion] = useSesion();
  const [bloqueos] = useBloqueos();
  const [A, setA] = useState(null);
  const [B, setB] = useState(null);
  const [objetivo, setObjetivo] = useState("A");
  const [ruta, setRuta] = useState({ estado: "vacio", linea: null, fuente: "", error: "" });
  const [pas, setPas] = useState({}); // id -> { estado: "aceptado"|"abordo"|"entregado", coordId, desvioRealS }
  const [paradas, setParadas] = useState([]); // pendientes: { pasajeroId, tipo, punto, alo, hecha }
  const [aviso, setAviso] = useState("");
  const [corriendo, setCorriendo] = useState(false);
  const [velocidad, setVelocidad] = useState(30);
  const [progreso, setProgreso] = useState(0);
  const [propuestas, setPropuestas] = useState({}); // id -> { texto, estado: "enviada"|"aceptada"|"rechazada"|"error", motivo, desvioRealS }

  const dRef = useRef(0);
  const lineaRef = useRef(null);
  const baseRef = useRef(null);
  const paradasRef = useRef([]);
  const abortRef = useRef(null);
  const velRef = useRef(30);
  const tickRef = useRef(0);
  const pasRef = useRef({});
  const propRef = useRef({});
  const corrRef = useRef(false);
  const libresRef = useRef(0);
  const timers = useRef([]);
  useEffect(() => { lineaRef.current = ruta.linea; paradasRef.current = paradas; velRef.current = velocidad; pasRef.current = pas; propRef.current = propuestas; corrRef.current = corriendo; });

  const vehiculo = VEHICULO_SEMILLA;
  const ocupados = Object.values(pas).filter((v) => ["aceptado", "abordo"].includes(v.estado)).reduce((s, v) => s + (v.plazas ?? 1), 0);
  const libres = vehiculo.asientos - ocupados;
  useEffect(() => { libresRef.current = libres; });

  const colocar = useCallback((d) => {
    const l = lineaRef.current;
    if (l && apiRef.current) apiRef.current.moverVehiculo(posicionEn(l.geometria, l.acc, d).punto);
  }, [apiRef]);

  const detener = useCallback(() => setCorriendo(false), []);

  const aplicarRuta = useCallback((r, { base = false } = {}) => {
    const linea = crearLinea(r.geometria, r.distanciaM, r.duracionS);
    if (base) baseRef.current = linea;
    dRef.current = 0;
    setProgreso(0);
    lineaRef.current = linea;
    setRuta({ estado: "ok", linea, fuente: r.fuente, error: "" });
    apiRef.current?.ajustar(r.geometria);
    return linea;
  }, [apiRef]);

  const fallar = useCallback((e) => {
    if (e?.name === "AbortError") return;
    const msg = e instanceof RutaError ? e.message : "No se pudo calcular la ruta.";
    setRuta((r) => ({ ...r, estado: "error", error: msg }));
    setAviso("");
  }, []);

  const calcularBase = useCallback(async (a, b) => {
    abortRef.current?.abort();
    const ac = new AbortController();
    abortRef.current = ac;
    detener();
    setPas({}); setParadas([]); setAviso(""); setPropuestas({});
    setRuta({ estado: "cargando", linea: null, fuente: "", error: "" });
    apiRef.current?.quitarVehiculo();
    try {
      const r = await servicioRutas.calcular([a, b], ac.signal);
      aplicarRuta(r, { base: true });
      logEvento(`RutaJuntos: ruta calculada · ${(r.distanciaM / 1000).toFixed(1)} km`);
    } catch (e) { fallar(e); }
  }, [apiRef, aplicarRuta, detener, fallar]);

  /** Clic en el mapa mientras RutaJuntos está activo. */
  const elegirPunto = useCallback((ll) => {
    if (!objetivo) return;
    if (objetivo === "A") { setA(ll); setB(null); setRuta({ estado: "vacio", linea: null, fuente: "", error: "" }); setPas({}); setParadas([]); setPropuestas({}); detener(); apiRef.current?.quitarVehiculo(); setObjetivo("B"); }
    else { setB(ll); setObjetivo(null); if (A) calcularBase(A, ll); }
  }, [objetivo, A, calcularBase, detener, apiRef]);

  const usarEjemplo = useCallback(() => { setA(CAMPOY); setB(DESTINO_EJEMPLO); setObjetivo(null); calcularBase(CAMPOY, DESTINO_EJEMPLO); }, [calcularBase]);

  const usarEjemploJicamarca = useCallback(() => { setA(ANEXO_22); setB(ESTACION_BAYOVAR); setObjetivo(null); calcularBase(ANEXO_22, ESTACION_BAYOVAR); }, [calcularBase]);

  const limpiar = useCallback(() => {
    abortRef.current?.abort(); detener();
    setA(null); setB(null); setObjetivo("A"); setPas({}); setParadas([]); setPropuestas({}); setAviso("");
    setRuta({ estado: "vacio", linea: null, fuente: "", error: "" }); baseRef.current = null; dRef.current = 0; setProgreso(0);
    apiRef.current?.quitarVehiculo();
  }, [apiRef, detener]);

  /** Recalcula desde la posición actual del vehículo pasando por las paradas pendientes. */
  const recalcular = useCallback(async (paradasNuevas, { pasajeroNuevo } = {}) => {
    const l = lineaRef.current; const base = baseRef.current;
    if (!l || !base || !B) return { ok: false };
    detener();
    abortRef.current?.abort();
    const ac = new AbortController(); abortRef.current = ac;
    const origen = posicionEn(l.geometria, l.acc, dRef.current).punto;
    const restantes = ordenarParadas(base, paradasNuevas.filter((p) => !p.hecha));
    setAviso("Recalculando ruta…");
    try {
      const r = await servicioRutas.calcular([origen, ...restantes.map((p) => p.punto), B], ac.signal);
      const restoAntes = l.duracionS * (1 - dRef.current / Math.max(1, l.distanciaM));
      const linea = aplicarRuta(r);
      const conAlo = restantes.map((p) => ({ ...p, alo: proyectar(linea.geometria, linea.acc, p.punto).alo }));
      setParadas(conAlo);
      setAviso("");
      return { ok: true, linea, desvioRealS: Math.round(r.duracionS - restoAntes), pasajeroNuevo };
    } catch (e) { fallar(e); return { ok: false }; }
  }, [B, aplicarRuta, detener, fallar]);

  const tramo = Math.floor(progreso / 100);
  const evaluaciones = useMemo(() => {
    const l = ruta.linea;
    if (!l) return [];
    return PASAJEROS_SEMILLA.map((p) => ({
      p, estado: pas[p.id]?.estado ?? "disponible", info: pas[p.id],
      ev: evaluar(l, p, libres, tramo * 100, estaBloqueado(VEHICULO_SEMILLA.conductor, p.vecino)),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ruta.linea, pas, libres, bloqueos, tramo]);

  /** Confirma a un pasajero: recalcula la ruta por su recogida y abre la coordinación en el motor existente. */
  const aceptarPasajero = useCallback(async (p) => {
    const l = lineaRef.current;
    if (!l) return { ok: false, error: "Primero calcula una ruta." };
    if (pasRef.current[p.id]) return { ok: false, error: "Ya está aceptado." };
    if (Object.values(pasRef.current).some((v) => v.vecino === p.vecino)) return { ok: false, error: "Ya aceptaste a esta persona." };
    const ev = evaluar(l, p, libresRef.current, dRef.current, estaBloqueado(VEHICULO_SEMILLA.conductor, p.vecino));
    if (!ev.compatible) return { ok: false, error: ev.motivos[0] };
    const eraCorriendo = corrRef.current;
    const nuevas = [...paradasRef.current, { pasajeroId: p.id, tipo: "recogida", punto: p.origen, hecha: false }, ...(p.sinDestino ? [] : [{ pasajeroId: p.id, tipo: "destino", punto: p.destino, hecha: false }])];
    const r = await recalcular(nuevas, { pasajeroNuevo: p });
    if (!r.ok) return { ok: false, error: "No se pudo recalcular la ruta. Intenta de nuevo." };
    const co = abrirCoordinacionMovilidad({
      conductor: vehiculo.conductor, pasajero: p.vecino, titulo: `RutaJuntos · ${p.origenTxt} → ${p.destinoTxt}`,
      lugar: p.origenTxt, hora: new Date().toTimeString().slice(0, 5), nota: "Punto de recogida propuesto desde RutaJuntos (datos simulados).",
    });
    if (!co.ok) { setAviso(co.error); return { ok: false, error: co.error }; }
    setPas((s) => ({ ...s, [p.id]: { estado: "aceptado", vecino: p.vecino, plazas: p.plazas, coordId: co.id, desvioRealS: r.desvioRealS } }));
    if (eraCorriendo) setCorriendo(true);
    return { ok: true, desvioRealS: r.desvioRealS, coordId: co.id };
  }, [recalcular, vehiculo.conductor]);

  const aceptar = useCallback(async (id) => {
    const p = PASAJEROS_SEMILLA.find((x) => x.id === id);
    if (p) { const r = await aceptarPasajero(p); if (!r.ok) setAviso(r.error); }
  }, [aceptarPasajero]);

  /** Envía una propuesta de aventón. NO acepta ni abre chat: el pasajero responde de forma simulada. */
  const proponer = useCallback((p, texto) => {
    const act = propRef.current[p.id];
    if (act?.estado === "enviada" || act?.estado === "aceptada" || pasRef.current[p.id]) return { ok: false, error: "Ya hay una propuesta en curso." };
    const t = texto.trim();
    if (!t) return { ok: false, error: "Escribe tu propuesta." };
    if (!lineaRef.current) return { ok: false, error: "Primero calcula una ruta." };
    setPropuestas((s) => ({ ...s, [p.id]: { texto: t.slice(0, 160), estado: "enviada" } }));
    logEvento(`RutaJuntos: propuesta enviada a ${VECINOS[p.vecino]?.name ?? "pasajero"} (respuesta simulada)`);
    timers.current.push(setTimeout(async () => {
      const l = lineaRef.current;
      const ev = l ? evaluar(l, p, libresRef.current, dRef.current, estaBloqueado(VEHICULO_SEMILLA.conductor, p.vecino)) : null;
      if (!ev || !ev.compatible) { setPropuestas((s) => ({ ...s, [p.id]: { ...s[p.id], estado: "rechazada", motivo: ev ? ev.motivos[0] : "Ya no hay una ruta activa" } })); return; }
      const r = await aceptarPasajero(p);
      setPropuestas((s) => ({ ...s, [p.id]: { ...s[p.id], estado: r.ok ? "aceptada" : "error", motivo: r.error, desvioRealS: r.desvioRealS } }));
    }, 1800));
    return { ok: true };
  }, [aceptarPasajero]);

  const evaluarPara = (p) => (ruta.linea ? evaluar(ruta.linea, p, libres, tramo * 100, estaBloqueado(VEHICULO_SEMILLA.conductor, p.vecino)) : null);

  /* ---------- Simulación del movimiento ---------- */
  useEffect(() => {
    if (!corriendo) return undefined;
    const t = setInterval(() => {
      const l = lineaRef.current;
      if (!l) return;
      dRef.current = Math.min(l.distanciaM, dRef.current + velRef.current * (l.distanciaM / Math.max(1, l.duracionS)) * (TICK_MS / 1000));
      colocar(dRef.current);
      if (tickRef.current++ % 3 === 0) setProgreso(Math.round(dRef.current));
      const hechas = paradasRef.current.filter((p) => !p.hecha && p.alo <= dRef.current);
      if (hechas.length) {
        setParadas((ps) => ps.map((p) => (hechas.includes(p) ? { ...p, hecha: true } : p)));
        setPas((s) => {
          const n = { ...s };
          hechas.forEach((p) => { if (n[p.pasajeroId]) n[p.pasajeroId] = { ...n[p.pasajeroId], estado: p.tipo === "recogida" ? "abordo" : "entregado" }; });
          return n;
        });
      }
      if (dRef.current >= l.distanciaM) setCorriendo(false);
    }, TICK_MS);
    return () => clearInterval(t);
  }, [corriendo, colocar]);

  const iniciar = useCallback(() => {
    const l = lineaRef.current;
    if (!l) return;
    if (dRef.current >= l.distanciaM) { dRef.current = 0; setProgreso(0); setParadas((ps) => ps.map((p) => ({ ...p, hecha: false }))); setPas((s) => Object.fromEntries(Object.entries(s).map(([k, v]) => [k, { ...v, estado: "aceptado" }]))); }
    colocar(dRef.current);
    setCorriendo(true);
  }, [colocar]);

  // Vehículo visible solo con RutaJuntos activo y una ruta calculada
  useEffect(() => {
    if (!activo) { apiRef.current?.quitarVehiculo(); return; }
    if (ruta.linea) colocar(dRef.current);
  }, [activo, ruta.linea, colocar, apiRef]);

  useEffect(() => () => { abortRef.current?.abort(); timers.current.forEach(clearTimeout); }, []);

  return {
    sesion, vehiculo, A, B, objetivo, setObjetivo, ruta, pas, paradas, aviso, corriendo, velocidad, setVelocidad, progreso, libres, evaluaciones, propuestas, proponer, evaluarPara,
    elegirPunto, usarEjemplo, usarEjemploJicamarca, limpiar, reintentar: () => { if (A && B) calcularBase(A, B); }, recalcular: () => recalcular(paradasRef.current), aceptar, iniciar, pausar: detener,
    nombre: (id) => VECINOS[id]?.name ?? id,
  };
}
