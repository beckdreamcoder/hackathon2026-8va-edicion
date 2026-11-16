"use client";

import { useViewStack } from "@/lib/hooks/use-view-stack";

import { useTextInput } from "@/lib/hooks/use-text-input";
import { useCheckbox } from "@/lib/hooks/use-checkbox";

import { Fragment, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { screenStyles } from "./screen-styles";
import { useSesion, logEvento, chip } from "@/lib/demo/shared";
import { volcarPendientes } from "@/lib/demo/store";

const DNI_DEMO = "12345678";
/** DNI recordado en este navegador: si ya pasó la autenticación, la app no vuelve a la pantalla de inicio. */
const DNI_GUARDADO = "bc-dni";
const guardarDni = (dni) => {
  try {
    window.localStorage.setItem(DNI_GUARDADO, dni);
  } catch {
    // Sin almacenamiento disponible (modo privado, bloqueado): la app sigue funcionando sin recordar el DNI.
  }
};
/** DNIs con cuenta creada en este navegador: sirven para iniciar sesión con el campo DNI. */
const DNIS_REGISTRADOS = "bc-dnis";
const leerDnis = () => {
  try {
    const lista = JSON.parse(window.localStorage.getItem(DNIS_REGISTRADOS) ?? "[]");
    return Array.isArray(lista) ? lista : [];
  } catch {
    return [];
  }
};
const registrarDni = (dni) => {
  try {
    const lista = leerDnis();
    if (!lista.includes(dni)) window.localStorage.setItem(DNIS_REGISTRADOS, JSON.stringify([...lista, dni]));
  } catch {
    // Sin almacenamiento: el DNI queda solo en la sesión actual.
  }
};
/** DNI de prueba para la consulta RENIEC/PNP simulada. */
const DNI_VALIDO = "71234567";
const DNI_DENUNCIAS = "87654321";
/** Pasos que se muestran mientras se consulta RENIEC y PNP (cada uno dura PASO_MS). */
const PASOS_CONSULTA = ["Recuperando datos de RENIEC", "Recuperando datos de PNP", "Verificando información"];
const PASO_MS = 700;
/** Mensajes de la simulación de validación facial (paso 2). */
const FASES_ROSTRO = ["Detectando rostro…", "Analizando puntos faciales…", "Comparando con la foto de tu DNI…", "✓ Rostro validado"];

/** Domicilio ficticio que devolvería RENIEC para el DNI de prueba (demostración). */
const DOMICILIO_RENIEC = "Jr. Los Pinos 245, Campoy, San Juan de Lurigancho, Lima";
const DOMICILIO_RENIEC_UBIC = { label: DOMICILIO_RENIEC, loc: "Campoy", dep: "Lima" };

import { juntasDeLocalidad, localidadesAledanasFicticias } from "@/lib/demo/juntas";
import { animateMotion } from "./animate-motion";
import CamaraRostro from "./CamaraRostro";
import "./transiciones.css";

const animateScan = animateMotion(
  [{ top: "12%" }, { top: "86%" }],
  { duration: 1200, easing: "ease-in-out", iterations: Infinity, direction: "alternate" },
);

/** Tarjeta de un dato de la revisión final; el lápiz abre/cierra su edición ahí mismo. */
function TarjetaDato({ titulo, abierta, onToggle, children }) {
  return (
    <section className="bg-white border border-(--color-line) rounded-[20px] p-4 shadow-[0_2px_8px_rgba(32,33,36,.05)] flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <p className="font-bold! text-[15px]!">{titulo}</p>
        {onToggle && (
          <button type="button" aria-label={abierta ? `Terminar de editar ${titulo}` : `Editar ${titulo}`} onClick={onToggle} className="w-10 h-10 shrink-0 rounded-full border border-(--color-line) bg-white grid place-items-center text-(--color-brand)">
            {abierta ? <span className="font-bold">✓</span> : (<svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16v4z" /></svg>)}
          </button>
        )}
      </div>
      {children}
    </section>
  );
}

/**
 * Pantalla Acceso del prototipo BarrioConecta.
 * Los valores de demostración sustituyen a la lógica del prototipo (DCLogic), que no se migró.
 */
export default function Acceso() {
  const nav = useViewStack("acceso");
  const router = useRouter();
  const [sesion, setSesion] = useSesion();

  // Si ya pasó la autenticación en este navegador, pasar directo a la app.
  useEffect(() => {
    if (!sesion.registrada) return;
    try {
      if (window.localStorage.getItem(DNI_GUARDADO)) router.replace("/inicio");
    } catch {
      // Sin almacenamiento: se queda en la pantalla de acceso.
    }
  }, [sesion.registrada, router]);
  const dni = useTextInput("");
  const dni2 = useTextInput("");
  const dataOk = useCheckbox(false);
  // Paso 3: dirección (buscador con predicciones) y domicilio de RENIEC (sin GPS)
  const [direccion, setDireccion] = useState("");
  const [dirElegida, setDirElegida] = useState(null); // dirección seleccionada de la lista
  const [sugerencias, setSugerencias] = useState([]);
  const [buscando, setBuscando] = useState(false);
  const [editando, setEditando] = useState(null); // tarjeta abierta en la revisión: direccion | zona | junta | null
  const toggleEdit = (id) => setEditando((v) => (v === id ? null : id));
  const [usoReniec, setUsoReniec] = useState(false);
  const [zonaAbierta, setZonaAbierta] = useState(false); // «Prefiero elegir mi zona»

  // Paso 1: consulta RENIEC/PNP
  const [query, setQuery] = useState("idle"); // idle | loading | ok | err | dup | den
  const [paso, setPaso] = useState(0); // paso de la consulta en curso (índice de PASOS_CONSULTA)
  const [tipDni, setTipDni] = useState(false); // tooltip informativo del campo DNI
  // Paso 2: comparación facial
  const [face, setFace] = useState("idle"); // idle | run | done
  const [fase, setFase] = useState(0); // fase de la simulación facial (índice de FASES_ROSTRO)
  const [camaraLista, setCamaraLista] = useState(false); // true cuando la persona permitió o denegó la cámara
  // Paso 3: consentimientos
  const [showDetail, setShowDetail] = useState(false);
  // Localidad y departamento salen de la dirección elegida (o del domicilio de RENIEC); no se eligen a mano
  const ubicacion = dirElegida ?? (usoReniec ? DOMICILIO_RENIEC_UBIC : null);
  const locRev = ubicacion?.loc ?? "";
  const depRev = ubicacion?.dep ?? "";
  // Localidades aledañas ficticias, derivadas de la localidad elegida (sin servicios externos)
  const vecinasRev = localidadesAledanasFicticias(locRev);
  const [joined, setJoined] = useState(null);
  const [showErr, setShowErr] = useState(false);

  const dni2Ok = /^\d{8}$/.test(dni2.value);
  const canQuery = dataOk.checked && dni2Ok && query !== "loading";
  const cantQuery = !dni2Ok || !dataOk.checked;
  const qLoading = query === "loading";
  const qOk = query === "ok";
  const qErr = query === "err" || query === "dup";
  const faceRun = face === "run";
  const faceDone = face === "done";

  // Identidad verificada: se muestra el resultado 2 s y luego pasa al paso 2 (si la persona no sale antes).
  const goView = nav.go;
  const enDni = nav.is("dni");
  useEffect(() => {
    if (!qOk || !enDni) return;
    const t = setTimeout(() => {
      setQuery("idle");
      setFace("run");
      setFase(0);
      setCamaraLista(false);
      dataOk.setChecked(false); // el consentimiento de la pantalla de permisos empieza sin marcar
      goView("rostro");
    }, 2000);
    return () => clearTimeout(t);
  }, [qOk, enDni, goView]);

  const runQuery = () => {
    setQuery("loading");
    setPaso(0);
    setTimeout(() => setPaso(1), PASO_MS);
    setTimeout(() => setPaso(2), PASO_MS * 2);
    setTimeout(() => {
      if (dni2.value === DNI_DEMO) setQuery("dup");
      else if (dni2.value === DNI_VALIDO) setQuery("ok");
      else if (dni2.value === DNI_DENUNCIAS) setQuery("den");
      else setQuery("err");
    }, PASO_MS * 3);
  };

  // Paso 2 simulado: al entrar a la pantalla del rostro corre sola (15 s) y luego pasa al paso 3.
  const enRostro = nav.is("rostro");
  // La simulación empieza solo cuando la persona responde al permiso de la cámara.
  useEffect(() => {
    if (!enRostro || !camaraLista) return;
    const ts = [
      setTimeout(() => setFase(1), 1250),
      setTimeout(() => setFase(2), 2500),
      setTimeout(() => { setFase(3); setFace("done"); }, 3750),
      setTimeout(() => goView("permisos"), 5000),
    ];
    return () => ts.forEach(clearTimeout);
  }, [enRostro, camaraLista, goView]);

  // Predicciones de dirección (OpenStreetMap/Nominatim, solo Perú). Espera 350 ms tras la última tecla.
  useEffect(() => {
    const q = direccion.trim();
    if (q.length < 3 || dirElegida?.label === q) {
      setSugerencias([]);
      setBuscando(false);
      return;
    }
    const ctrl = new AbortController();
    setBuscando(true);
    const t = setTimeout(async () => {
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&countrycodes=pe&accept-language=es&q=${encodeURIComponent(q)}`;
        const res = await fetch(url, { signal: ctrl.signal });
        const data = await res.json();
        if (ctrl.signal.aborted) return;
        // Localidad: el barrio o distrito más cercano que trae OpenStreetMap; departamento: la región
        setSugerencias(data.map((d) => {
          const a = d.address ?? {};
          return {
            id: d.place_id,
            label: d.display_name,
            loc: a.suburb || a.neighbourhood || a.quarter || a.city_district || a.town || a.village || a.city || "",
            dep: a.state || a.region || "",
          };
        }));
      } catch {
        if (!ctrl.signal.aborted) setSugerencias([]);
      } finally {
        if (!ctrl.signal.aborted) setBuscando(false);
      }
    }, 350);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [direccion, dirElegida]);

  // Juntas de la localidad de la dirección (ficticias si no hay en la demo) y de las aledañas reales
  const juntasLoc = juntasDeLocalidad(locRev, depRev);
  const juntasAle = vecinasRev.flatMap((v) => juntasDeLocalidad(v, depRev));
  const hayJuntas = juntasLoc.length + juntasAle.length > 0;
  const sinJuntas = !hayJuntas;
  const juntas = [...juntasLoc, ...juntasAle].map((j) => ({
    id: j.id,
    name: j.name,
    zona: j.zona,
    joinLbl: joined === j.id ? "✓ Te uniste" : "Unirme",
    // Botón neutro para "Unirme": el rojo queda reservado para la acción principal de cada pantalla
    joinCls: joined === j.id ? screenStyles.buttonOutline : "min-h-12 rounded-[18px] border-2 border-(--color-line) bg-white text-(--color-ink) font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full",
    join: () => setJoined(joined === j.id ? null : j.id),
  }));

  /** Solo una opción activa a la vez: «Usar mi ubicación», una dirección elegida o el consentimiento. */
  const cambiarReniec = (on) => {
    setUsoReniec(on);
    if (on) { setDirElegida(null); setDireccion(""); dataOk.setChecked(false); }
  };
  const elegirDireccion = (d) => {
    setDirElegida(d);
    setUsoReniec(false);
    dataOk.setChecked(false);
  };
  const cambiarConsentimiento = (on) => {
    dataOk.setChecked(on);
    if (on) { setUsoReniec(false); setDirElegida(null); setDireccion(""); setZonaAbierta(false); }
  };
  const unaOpcion = [usoReniec, !!dirElegida, dataOk.checked].filter(Boolean).length === 1;
  // Las opciones que no están elegidas quedan bloqueadas mientras otra esté activa
  const consentimientoBloqueado = usoReniec || !!dirElegida;
  const ubicacionBloqueada = !!dirElegida || dataOk.checked;

  /** Buscador de dirección con predicciones (se usa en la elección de zona y en la revisión). */
  const buscadorDireccion = (
    <>
      <div className={`${screenStyles.field} relative`}>
        <label htmlFor="direccion">Buscar tu dirección</label>
        <input id="direccion" disabled={usoReniec} aria-disabled={usoReniec} className="min-h-13 border-[1.5px] border-[#cfc7bf] rounded-[16px] px-3.5 py-0 bg-white w-full focus-visible:border-(--color-brand) disabled:opacity-50 disabled:bg-[#f7f3ee] disabled:cursor-not-allowed" placeholder="Calle, jirón o avenida" autoComplete="off" value={direccion} onChange={(e) => { setDireccion(e.target.value); setDirElegida(null); }} />
        {direccion.trim().length >= 3 && !dirElegida && (
          <div className="absolute left-0 right-0 top-full mt-1 z-20 bg-white border border-(--color-line) rounded-[16px] shadow-[0_8px_20px_rgba(32,33,36,.18)] overflow-hidden">
            {buscando && <p className={`${screenStyles.muted} px-4 py-3`}>Buscando direcciones…</p>}
            {!buscando && sugerencias.length === 0 && <p className={`${screenStyles.muted} px-4 py-3`}>Sin resultados. Escribe más detalles.</p>}
            {!buscando && sugerencias.length > 0 && (
              <ul role="listbox" aria-label="Sugerencias de dirección">
                {sugerencias.map((s) => (
                  <li key={s.id} role="option" aria-selected={false}>
                    <button type="button" className="w-full text-left px-4 py-3 text-[14px] border-b border-(--color-line) last:border-b-0 hover:bg-(--color-line)" onClick={() => { setDireccion(s.label); elegirDireccion({ label: s.label, loc: s.loc, dep: s.dep }); setSugerencias([]); }}>{s.label}</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
      {dirElegida && (
        <div className="flex items-start gap-2">
          <p className={`${screenStyles.muted} flex-1`} role="status">Dirección seleccionada: {dirElegida.label}</p>
          <button type="button" className="font-bold text-(--color-brand) min-h-11 px-2 flex-none" onClick={() => { setDirElegida(null); setDireccion(""); }}>Quitar</button>
        </div>
      )}
    </>
  );


  const toggleDetail = () => setShowDetail((v) => !v);

  /** Cierra el registro o el ingreso, guarda la sesión antes de cambiar de pantalla y entra a la app sin recargar la página. */
  const irAInicio = async (cerrar) => {
    cerrar();
    await volcarPendientes();
    router.push("/inicio");
  };
  const finishRegistro = () => {
    registrarDni(dni2.value);
    guardarDni(dni2.value);
    setSesion({ registrada: true, dni: dni2.value, userId: "maria", departamento: depRev, localidad: locRev, localidadesAledanas: vecinasRev, juntaId: joined, ubicacionPermitida: usoReniec,direccion: ubicacion?.label ?? "" });
    logEvento(`Registro demo completado · ${locRev}, ${depRev}${joined ? " · se unió a una junta" : ""}`);
  };
  const loginDemo = (dniUsado = DNI_DEMO) => {
    guardarDni(dniUsado);
    setSesion({ registrada: true, dni: dniUsado, userId: "maria", juntaId: sesion.juntaId ?? "campoy" });
    logEvento("Ingreso demo como María");
  };
  const ingresar = (e) => {
    e.preventDefault();
    const dniIngresado = dni.value;
    const registrado = dniIngresado === DNI_DEMO || dniIngresado === DNI_VALIDO || leerDnis().includes(dniIngresado) || (sesion.registrada && dniIngresado === sesion.dni);
    if (registrado) irAInicio(() => loginDemo(dniIngresado));
    else setShowErr(true);
  };
  return (
    <div className={screenStyles.screen}>
      <div className="w-full md:max-w-[46rem] mx-auto h-dvh md:border-x md:border-(--color-line) flex flex-col bg-white overflow-hidden">
      
      <div key={nav.current} className={`${nav.dir === "back" ? "vista-back" : "vista-fwd"} registro-vista flex-1 min-h-0 flex flex-col`}>
      {nav.is("acceso") && (<>
      <div className="flex-1 min-h-0 overflow-y-auto pt-1 px-4 pb-6 flex flex-col gap-3.5 pt-7! items-stretch!">
        <div className="flex flex-col! items-center! gap-1!">
          <svg width="76" height="70" viewBox="0 0 64 60" aria-hidden="true"><path d="M5 28 32 5l27 23" fill="none" stroke="#C8102E" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" /><circle cx="32" cy="29" r="5" fill="#C8102E" /><circle cx="20" cy="33" r="4.5" fill="#C8102E" /><circle cx="44" cy="33" r="4.5" fill="#C8102E" /><path d="M25 55V42a7 7 0 0 1 14 0v13zM12 55V44a6 6 0 0 1 11-3M52 55V44a6 6 0 0 0-11-3" fill="#C8102E" /></svg>
          <h1 className="text-[36px]! font-extrabold!"><span className="text-(--color-ink)">Barrio</span><span className="text-(--color-brand)">Conecta</span></h1>
          <p className={`${screenStyles.muted} text-[17px]!`}>Un Perú más cercano</p>
        </div>
        <svg viewBox="0 0 260 72" role="img" aria-labelledby="sep-title" className="block w-full! h-auto!"><title id="sep-title">Separador con una muralla escalonada y tres cuadrados</title><path d="M10 30H54V36H62V45H78V36H86V30H105V24H113V18H122V8H138V18H147V24H155V30H176V36H184V45H200V36H208V30H250" fill="none" stroke="#a19790" strokeWidth="2" strokeLinejoin="round" /><g fill="none" stroke="#bd1227" strokeWidth="2.2"><rect x="65" y="20" width="8" height="8" /><rect x="126" y="30" width="8" height="8" /><rect x="188" y="20" width="8" height="8" /></g></svg>
        <div className={screenStyles.field}>
          <label htmlFor="dni">DNI</label>
          <div className="relative">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="absolute left-3.5! top-[50%]! [transform:translateY(-50%)]! w-6.5! h-6.5! fill-none! stroke-[var(--color-muted)]! stroke-[1.6]! [stroke-linecap:round]! pointer-events-none!"><rect x="2.5" y="5" width="19" height="14" rx="2" /><circle cx="8" cy="11" r="2.2" /><path d="M5 16a3.5 3.5 0 0 1 6 0M14 10h4M14 14h3" /></svg><input id="dni" className="min-h-13 border-[1.5px] border-[#cfc7bf] rounded-[16px] px-3.5 py-0 bg-white w-full focus-visible:border-(--color-brand) pl-12.5!" inputMode="numeric" maxLength="8" placeholder="Ingresa tu DNI" {...dni.props} />
          </div>
          {showErr && (<><p className={screenStyles.error} role="alert">Ese DNI no está registrado. Revisa el número o crea tu cuenta.</p></>)}
        </div>
        <button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-(--color-brand) text-white font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed" onClick={ingresar}>Ingresar</button>
        <div className="grid grid-cols-2! gap-3!">
          <button className="min-h-19 rounded-[18px] border-2 border-(--color-line) bg-white text-(--color-ink) font-bold px-5 py-0 flex items-center justify-center gap-1 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed flex-col! text-[16px]!" onClick={() => nav.go("bio_huella")}><svg className="w-6 h-6 fill-current stroke-none stroke-2 [stroke-linecap:round] [stroke-linejoin:round] flex-none text-(--color-brand)! w-7.5! h-7.5!" viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M7 5.21a.77.77 0 0 1-.46-1.38A15.46 15.46 0 0 1 16 1c2.66 0 6.48.45 9.5 2.62a.77.77 0 0 1 .18 1.07a.78.78 0 0 1-1.08.17A15 15 0 0 0 16 2.53a14 14 0 0 0-8.5 2.52a.74.74 0 0 1-.5.16" /><path fill="currentColor" d="M28.23 12.26a.78.78 0 0 1-.63-.33C25.87 9.49 22.78 6.24 16 6.24a14 14 0 0 0-11.63 5.7a.77.77 0 0 1-1.07.17a.76.76 0 0 1-.15-1.11A15.54 15.54 0 0 1 16 4.71c5.61 0 9.81 2.08 12.84 6.34a.77.77 0 0 1-.19 1.07a.8.8 0 0 1-.42.14" /><path fill="currentColor" d="M12.28 31a.78.78 0 0 1-.72-.49a.75.75 0 0 1 .44-1c4.37-1.68 7-5.12 7-9.21a2.8 2.8 0 0 0-3-3c-1.86 0-2.76 1-3 3.35a4.27 4.27 0 0 1-4.52 3.83a4.27 4.27 0 0 1-4.32-4.59A11.71 11.71 0 0 1 16 8.39a12 12 0 0 1 12 11.93a18.7 18.7 0 0 1-1.39 6.5a.78.78 0 0 1-1 .41a.76.76 0 0 1-.41-1a17.3 17.3 0 0 0 1.27-5.91A10.45 10.45 0 0 0 16 9.92a10.18 10.18 0 0 0-10.38 10a2.77 2.77 0 0 0 2.79 3.06a2.74 2.74 0 0 0 3-2.48c.36-3.11 1.89-4.69 4.56-4.69a4.31 4.31 0 0 1 4.52 4.56c0 4.74-3 8.72-8 10.63a1 1 0 0 1-.21 0" /><path fill="currentColor" d="M19.77 30.28a.8.8 0 0 1-.52-.2a.76.76 0 0 1 0-1.08a12.63 12.63 0 0 0 3.54-8.68c0-1.56-.48-6.65-6.7-6.65a6.83 6.83 0 0 0-4.94 1.87A6.17 6.17 0 0 0 9.32 20a.77.77 0 0 1-.77.76a.76.76 0 0 1-.77-.76A7.73 7.73 0 0 1 10 14.46a8.34 8.34 0 0 1 6-2.32c6.08 0 8.24 4.4 8.24 8.18a14.1 14.1 0 0 1-3.9 9.68a.75.75 0 0 1-.57.28" /><path fill="currentColor" d="M8.66 27.74a14 14 0 0 1-1.56-.09a.76.76 0 1 1 .17-1.52c2.49.28 4.45-.16 5.84-1.32a6.37 6.37 0 0 0 2.12-4.53a.75.75 0 0 1 .82-.71a.78.78 0 0 1 .72.81A7.9 7.9 0 0 1 14.09 26a8.2 8.2 0 0 1-5.43 1.74" /></svg>Huella</button>
          <button className="min-h-19 rounded-[18px] border-2 border-(--color-line) bg-white text-(--color-ink) font-bold px-5 py-0 flex items-center justify-center gap-1 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed flex-col! text-[16px]!" onClick={() => nav.go("bio_rostro")}><svg className="w-6 h-6 fill-none stroke-current stroke-1 [stroke-linecap:round] [stroke-linejoin:round] flex-none text-(--color-brand)! w-7.5! h-7.5!" viewBox="0 0 14 14" aria-hidden="true"><path d="M4 3.988v1m6-1v1m-3 .5v1.25a1 1 0 0 1-1 1h-.5m-.214 2.564a2.49 2.49 0 0 0 3.428 0m1.3-9.372q.555.061 1.102.125a2.09 2.09 0 0 1 1.833 1.836l.12 1.095m-3.055 9.058q.555-.06 1.102-.125a2.09 2.09 0 0 0 1.833-1.836l.12-1.095M4 .93q-.555.061-1.102.125A2.09 2.09 0 0 0 1.065 2.89q-.062.543-.12 1.095M4 13.044q-.555-.06-1.102-.125a2.09 2.09 0 0 1-1.833-1.836q-.062-.542-.12-1.095" /></svg>Rostro</button>
        </div>
        <button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-white text-(--color-brand) font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed border-[transparent]! bg-none! bg-transparent!" onClick={() => nav.go("dni")}>Crear cuenta</button>
        <p className={`${screenStyles.muted} text-center!`}>Ingresa con tu DNI, tu huella o tu rostro.</p>
        <svg viewBox="0 0 358 150" width="100%" aria-hidden="true" className="mt-auto! rounded-[20px]!"><rect width="358" height="150" fill="#F6EEE3" /><path d="M180 120 270 56l70 52v42H180z" fill="#E9E1D6" /><rect x="14" y="70" width="86" height="80" fill="#F4D9C6" /><path d="M8 72 57 40l49 32z" fill="#C8102E" /><rect x="30" y="92" width="22" height="26" fill="#fff" stroke="#C8102E" strokeWidth="2" /><rect x="62" y="104" width="22" height="46" fill="#8A5300" /><rect x="108" y="86" width="70" height="64" fill="#F8E6B8" /><path d="M104 88 143 62l39 26z" fill="#E6B34A" /><rect x="124" y="104" width="20" height="22" fill="#fff" stroke="#8A5300" strokeWidth="2" /><rect x="196" y="78" width="80" height="72" fill="#FBE0E3" /><path d="M190 80 236 52l46 28z" fill="#C8102E" /><circle cx="318" cy="84" r="24" fill="#6E9B55" /><circle cx="300" cy="96" r="16" fill="#86B06B" /><rect x="314" y="96" width="6" height="54" fill="#7A5A3A" /><rect x="284" y="64" width="3" height="86" fill="#3F4A50" /><circle cx="285" cy="62" r="6" fill="#F3C969" /><rect x="0" y="136" width="358" height="14" fill="#D9CDBE" /></svg>
      </div>
      </>)}
      
      {nav.is("bio_huella") && (<>
      <div className={screenStyles.header}><button className={screenStyles.iconButton} aria-label="Volver" onClick={nav.back}><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Ingreso con huella</h1></div>
      <div className="flex-1 min-h-0 overflow-y-auto pt-1 px-4 pb-6 flex flex-col gap-4 items-center! justify-center! text-center!">
        
        <svg className="w-6 h-6 fill-none stroke-current stroke-[1.4] [stroke-linecap:round] [stroke-linejoin:round] flex-none text-(--color-brand)! w-30! h-30!" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 11v4a6 6 0 0 1-1 3M8 11a4 4 0 0 1 8 0v2a9 9 0 0 1-1 4M5 12a7 7 0 0 1 14 0v1M6 17a12 12 0 0 0 1 2" /></svg>
        <h2 className="text-[24px]!">Apoya tu dedo en el lector</h2>
        <p className={screenStyles.muted}>Apoya tu dedo y espera la confirmación.</p>
        <a className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-(--color-brand) text-white font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed" href="/inicio" onClick={(e) => { e.preventDefault(); irAInicio(loginDemo); }}>Ingresar</a>
        <button className="min-h-13 rounded-[18px] border-2 border-(--color-line) bg-white text-(--color-ink) font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => nav.go("acceso")}>Cancelar</button>
      </div>
      </>)}
      
      {nav.is("bio_rostro") && (<>
      <div className={screenStyles.header}><button className={screenStyles.iconButton} aria-label="Volver" onClick={nav.back}><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Ingreso con rostro</h1></div>
      <div className="flex-1 min-h-0 overflow-y-auto pt-1 px-4 pb-6 flex flex-col gap-4 items-center! justify-center! text-center!">
        
        <svg className="w-6 h-6 fill-none stroke-current stroke-[1.4] [stroke-linecap:round] [stroke-linejoin:round] flex-none text-(--color-brand)! w-30! h-30!" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3M9 10v1M15 10v1M9 15c1.5 1.5 4.5 1.5 6 0" /></svg>
        <h2 className="text-[24px]!">Mira al frente</h2>
        <p className={screenStyles.muted}>Ubica tu rostro frente a la pantalla, con buena luz.</p>
        <a className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-(--color-brand) text-white font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed" href="/inicio" onClick={(e) => { e.preventDefault(); irAInicio(loginDemo); }}>Ingresar</a>
        <button className="min-h-13 rounded-[18px] border-2 border-(--color-line) bg-white text-(--color-ink) font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => nav.go("acceso")}>Cancelar</button>
      </div>
      </>)}
      
      {nav.is("dni") && (<>
      <div className={screenStyles.header}><button className={screenStyles.iconButton} aria-label="Volver" onClick={nav.back}><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Crear cuenta</h1></div>
      <div className="flex gap-1.5 pt-0 px-4 pb-2 [&_i]:flex-1 [&_i]:h-1.5 [&_i]:rounded-[3px] [&_i]:bg-(--color-line) [&_i.on]:bg-(--color-brand)" aria-hidden="true"><i className="on"></i><i></i><i></i><i></i></div>
      <div className="flex-1 min-h-0 overflow-y-auto pt-1 px-4 pb-6 flex flex-col gap-4">
        <p className={`${screenStyles.muted} font-bold!`}>Paso 1 de 4 · Tu DNI</p>
        <div className={screenStyles.field}><label htmlFor="dni2">Número de DNI (8 dígitos)</label>
          <div className="relative">
            <input id="dni2" className="min-h-13 border-[1.5px] border-[#cfc7bf] rounded-[16px] px-3.5 pr-12! py-0 bg-white w-full focus-visible:border-(--color-brand)" inputMode="numeric" maxLength="8" {...dni2.props} onChange={(e) => dni2.setValue(e.target.value.replace(/\D/g, "").slice(0, 8))} onPaste={(e) => { e.preventDefault(); dni2.setValue(e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 8)); }} />
            <button type="button" aria-label="Información sobre la verificación" aria-expanded={tipDni} aria-controls="tip-dni" onClick={() => setTipDni((v) => !v)} className="absolute right-2 top-[50%] [transform:translateY(-50%)] z-30 w-8 h-8 grid place-items-center rounded-full text-(--color-muted)">
            <svg aria-hidden="true" focusable="false" viewBox="0 0 1024 1024" className="w-5.5 h-5.5"><path fill="none" d="M0 0h1024v1024H0z" /><path fill="currentColor" d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448s448-200.6 448-448S759.4 64 512 64m0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372s372 166.6 372 372s-166.6 372-372 372" /><path fill="currentColor" d="M464 336a48 48 0 1 0 96 0a48 48 0 1 0-96 0m72 112h-48c-4.4 0-8 3.6-8 8v272c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V456c0-4.4-3.6-8-8-8" /></svg>
            </button>
            <div className={`fixed inset-0 z-10 bg-black/50 transition-opacity duration-200 ${tipDni ? "opacity-100" : "opacity-0 pointer-events-none"}`} onClick={() => setTipDni(false)} aria-hidden="true"></div>
            <div id="tip-dni" role="tooltip" aria-hidden={!tipDni} className={`absolute left-0 right-0 top-full mt-3 z-20 bg-white border-2 border-(--color-brand) rounded-[16px] p-4 text-[15px] font-medium leading-snug text-(--color-ink) shadow-[0_12px_32px_rgba(0,0,0,.45)] transition-all duration-200 ${tipDni ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none invisible"}`}>
              Realizaremos una verificación de tu identidad consultando con el servicio de la RENIEC y de la PNP para validar si tu perfil cumple con las políticas de la app
            </div>
          </div></div>
        <div className="flex flex-col gap-2 px-1">
          <div className={screenStyles.checkboxRow}><input id="c2" type="checkbox" aria-label="Tratar mis datos personales" {...dataOk.props} />
            <div className="flex flex-col gap-0.5">
              <button type="button" className="font-bold! text-left text-[15px]! self-start" aria-expanded={showDetail} aria-controls="detalle-datos" onClick={toggleDetail}>Tratar mis datos personales</button>
              <p className={`${screenStyles.muted} text-[13px]!`}>Necesario para verificar tu DNI.</p>
            </div></div>
          {showDetail && (<p id="detalle-datos" className={`${screenStyles.muted} text-[13px]!`}>Usamos tu DNI solo para identificar tu cuenta. Muestras un nombre público mínimo y una zona aproximada.</p>)}
        </div>
        {canQuery && !qOk && (<><button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-(--color-brand) text-white font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed" onClick={runQuery}>Verificar mi DNI</button></>)}
        {cantQuery && (<><button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-(--color-brand) text-white font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed" disabled>{dni2Ok ? "Acepta el tratamiento de datos" : "Escribe 8 dígitos"}</button></>)}
        {qLoading && (
          <div className="bg-white border border-(--color-line) rounded-[20px] p-4 shadow-[0_2px_8px_rgba(32,33,36,.05)] flex flex-col gap-3" role="status" aria-live="polite">
            <p className="font-bold!">Verificando tu identidad…</p>
            {PASOS_CONSULTA.slice(0, paso + 1).map((texto, i) => (
              <div key={texto} className="paso-entra flex items-center gap-3">
                {i < paso ? (
                  <span className="paso-check w-5 h-5 rounded-full bg-(--color-brand) text-white grid place-items-center text-[12px] font-bold flex-none" aria-hidden="true">✓</span>
                ) : (
                  <span className="w-5 h-5 rounded-full border-2 border-(--color-line) border-t-(--color-brand) animate-spin flex-none" aria-hidden="true"></span>
                )}
                <span className={i < paso ? "text-(--color-muted)" : "font-bold!"}>{texto}</span>
              </div>
            ))}
          </div>
        )}
        {qOk && (<>
          <div className="bg-white border border-(--color-line) rounded-[20px] p-4 shadow-[0_2px_8px_rgba(32,33,36,.05)] flex flex-col gap-2" role="status"><p className={screenStyles.success}>✓ Identidad verificada</p><p className={screenStyles.muted}>RENIEC: DNI vigente · PNP: sin observaciones. Tus datos personales no se muestran a otros vecinos.</p></div>
        </>)}
        {query === "den" && (
          <div className="vista-fade fixed inset-0 z-50 grid place-items-center bg-black/40 px-4">
            <div role="alertdialog" aria-modal="true" aria-labelledby="den-title" aria-describedby="den-desc" className="bg-white rounded-[20px] p-5 w-full max-w-[24rem] shadow-[0_8px_28px_rgba(32,33,36,.28)] flex flex-col gap-3">
              <p id="den-title" className={screenStyles.error}>Acceso denegado · Registro PNP</p>
              <p id="den-desc" className={screenStyles.muted}>Registra procesos penales vigentes por delitos graves. No podemos habilitar una cuenta mientras la situación esté activa. Acude a la comisaría de tu jurisdicción para regularizarla.</p>
              <button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-(--color-brand) text-white font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full" onClick={() => { setQuery("idle"); nav.reiniciar(); }}>Entendido</button>
            </div>
          </div>
        )}
        {qErr && (<>
          <div className="bg-white border border-(--color-line) rounded-[20px] p-4 shadow-[0_2px_8px_rgba(32,33,36,.05)] flex flex-col gap-2" role="alert"><p className={screenStyles.error}>{query === "dup" ? "Este DNI ya tiene una cuenta" : query === "den" ? "Este DNI tiene denuncias registradas" : "No pudimos validar este DNI"}</p><p className={screenStyles.muted}>{query === "dup" ? "Ingresa con él desde la pantalla de acceso o usa otro número." : query === "den" ? "La PNP registra denuncias asociadas a este DNI. No podemos crear la cuenta." : "Revisa el número o intenta de nuevo."}</p></div>
          <button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-white text-(--color-brand) font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed" onClick={runQuery}>Reintentar</button>
        </>)}
      </div>
      </>)}
      
      {nav.is("rostro") && (<>
      <div className={screenStyles.header}><button className={screenStyles.iconButton} aria-label="Volver" onClick={nav.back}><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Crear cuenta</h1></div>
      <div className="flex gap-1.5 pt-0 px-4 pb-2 [&_i]:flex-1 [&_i]:h-1.5 [&_i]:rounded-[3px] [&_i]:bg-(--color-line) [&_i.on]:bg-(--color-brand)" aria-hidden="true"><i className="on"></i><i className="on"></i><i></i><i></i></div>
      <div className="flex-1 min-h-0 overflow-y-auto pt-1 px-4 pb-6 flex flex-col gap-4">
        <p className={`${screenStyles.muted} font-bold!`}>Paso 2 de 4 · Tu rostro</p>
        <span className={screenStyles.badge}>Validación facial</span>
        <div className="relative h-47.5! rounded-[20px]! bg-white! border-2! border-dashed! border-(--color-brand)! grid! place-items-center! overflow-hidden!">
          <svg viewBox="0 0 100 130" width="80" aria-hidden="true"><ellipse cx="50" cy="62" rx="36" ry="48" fill="none" stroke="#C8102E" strokeWidth="3" strokeDasharray="6 5" /></svg>
          {faceRun && (<><span ref={animateScan} className="absolute top-[50%] left-[8%] right-[8%] h-[3px] bg-(--color-brand) opacity-80"></span></>)}
          <p className={`${screenStyles.muted} absolute! bottom-2! text-[13px]! text-center!`}>Tu cámara</p>
        </div>
        <p className={screenStyles.muted}>Mantén el rostro centrado. La validación empieza sola.</p>
        {(faceRun || faceDone) && (
          <div className="vista-fade fixed inset-0 z-50 grid place-items-center bg-black/60 px-4">
            <div role="alertdialog" aria-modal="true" aria-labelledby="rostro-title" className="paso-entra bg-white rounded-[24px] p-5 w-full max-w-[22rem] shadow-[0_12px_32px_rgba(0,0,0,.45)] flex flex-col items-center gap-3 text-center">
              <p id="rostro-title" className="font-bold! text-[17px]!">Validación facial</p>
              <CamaraRostro done={faceDone} onListo={setCamaraLista} />
              <div className="w-full h-1.5 rounded-full bg-(--color-line) overflow-hidden" aria-hidden="true"><div className={`${camaraLista ? "rostro-progreso" : "w-0"} h-full bg-(--color-brand)`}></div></div>
              <p className={faceDone ? screenStyles.success : "font-bold!"} role="status">{camaraLista ? FASES_ROSTRO[fase] : "Esperando permiso de la cámara…"}</p>
              <p className={screenStyles.muted}>Tu imagen no se guarda.</p>
            </div>
          </div>
        )}
      </div>
      </>)}
      
      {nav.is("permisos") && (<>
      <div className={screenStyles.header}><button className={screenStyles.iconButton} aria-label="Volver" onClick={nav.back}><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Crear cuenta</h1></div>
      <div className="flex gap-1.5 pt-0 px-4 pb-2 [&_i]:flex-1 [&_i]:h-1.5 [&_i]:rounded-[3px] [&_i]:bg-(--color-line) [&_i.on]:bg-(--color-brand)" aria-hidden="true"><i className="on"></i><i className="on"></i><i className="on"></i><i></i></div>
      <div className="flex-1 min-h-0 overflow-y-auto pt-1 px-4 pb-6 flex flex-col gap-4">
        <p className={`${screenStyles.muted} font-bold!`}>Paso 3 de 4 · Tus permisos</p>
        <div className="bg-white border border-(--color-line) rounded-[20px] p-4 shadow-[0_2px_8px_rgba(32,33,36,.05)] flex flex-col gap-3">
          <div className={screenStyles.checkboxRow}><input id="c-ubi" type="checkbox" checked={usoReniec} disabled={ubicacionBloqueada} onChange={(e) => cambiarReniec(e.target.checked)} /><label htmlFor="c-ubi" className={ubicacionBloqueada ? "opacity-50" : ""}><b>Usar mi ubicación</b><br /><span className={screenStyles.muted}>Para mostrarte vecinos y alertas cerca. Puedes elegir tu zona a mano.</span></label></div>
          <button type="button" aria-expanded={zonaAbierta} disabled={usoReniec || dataOk.checked} aria-controls="elegir-zona" onClick={() => { if (!zonaAbierta) { setUsoReniec(false); dataOk.setChecked(false); } setZonaAbierta((v) => !v); }} className="min-h-11 rounded-full border-2 border-(--color-line) bg-white text-(--color-ink) font-bold px-5 self-start disabled:opacity-50 disabled:cursor-not-allowed">Prefiero elegir mi zona</button>
          {usoReniec ? (<p className={screenStyles.muted} role="status">Ya usas tu domicilio de RENIEC. Desmarca «Usar mi ubicación» para elegir tu zona.</p>) : !zonaAbierta && (<p className={screenStyles.muted}>Elegirás tu zona a mano en el siguiente paso.</p>)}
          {zonaAbierta && !usoReniec && (<div id="elegir-zona" className="flex flex-col gap-3">{buscadorDireccion}</div>)}
        </div>
        <div className={`bg-white border border-(--color-line) rounded-[20px] p-4 shadow-[0_2px_8px_rgba(32,33,36,.05)] flex flex-col gap-2 ${consentimientoBloqueado ? "opacity-50" : ""}`}>
          <div className={screenStyles.checkboxRow}><input id="c-datos" type="checkbox" aria-label="Tratar mis datos personales" checked={dataOk.checked} disabled={consentimientoBloqueado} onChange={(e) => cambiarConsentimiento(e.target.checked)} /><div className="flex flex-col gap-0.5"><b>Tratar mis datos personales</b><p className={screenStyles.muted}>Necesario para crear tu cuenta. Tu DNI nunca es público.</p></div></div>
          <button type="button" aria-expanded={showDetail} aria-controls="detalle-datos-p" onClick={toggleDetail} className="font-bold text-(--color-brand) text-left self-start min-h-11">Ver detalle</button>
          {showDetail && (<p id="detalle-datos-p" className={`${screenStyles.muted} text-[13px]!`}>Usamos tu DNI solo para identificar tu cuenta. Mostramos un nombre público mínimo y una zona aproximada.</p>)}
        </div>
        <p className={screenStyles.muted} role="status">{unaOpcion ? "" : "Elige una sola opción para continuar."}</p>
        <button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-(--color-brand) text-white font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed" disabled={!unaOpcion} onClick={() => nav.go("juntas")}>Continuar</button>
      </div>
      </>)}
      
      {nav.is("juntas") && (<>
      <div className={screenStyles.header}><button className={screenStyles.iconButton} aria-label="Volver" onClick={nav.back}><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Tu junta vecinal</h1></div>
      <div className="flex gap-1.5 pt-0 px-4 pb-2 [&_i]:flex-1 [&_i]:h-1.5 [&_i]:rounded-[3px] [&_i]:bg-(--color-line) [&_i.on]:bg-(--color-brand)" aria-hidden="true"><i className="on"></i><i className="on"></i><i className="on"></i><i className="on"></i></div>
      <div className="flex-1 min-h-0 overflow-y-auto pt-1 px-4 pb-6 flex flex-col gap-4">
        <p className={`${screenStyles.muted} font-bold!`}>Paso 4 de 4 · Tu junta vecinal</p>
        <p className={screenStyles.muted}>Sumarte es voluntario. Elige una junta de tu localidad o de las aledañas, o continúa sin junta.</p>
        {juntas.length === 0 && (<div className="bg-white border border-(--color-line) rounded-[20px] p-4 flex flex-col gap-1"><p className="font-bold!">Aún no hay juntas para tu zona</p><p className={screenStyles.muted}>Indica una dirección con localidad para ver las juntas cercanas.</p></div>)}
        {juntas.map((j) => (
          <div key={j.id} className="bg-white border border-(--color-line) rounded-[20px] p-4 shadow-[0_2px_8px_rgba(32,33,36,.05)] flex flex-col gap-2">
            <p className="font-bold!">{j.name}</p>
            <p className={screenStyles.muted}>{j.zona}</p>
            <button className={`${j.joinCls} min-h-11! w-full`} onClick={j.join}>{j.joinLbl}</button>
          </div>
        ))}
        <button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-(--color-brand) text-white font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full" onClick={() => nav.go("territorio")}>Continuar</button>
        <button className="min-h-13 rounded-[18px] border-2 border-(--color-line) bg-white text-(--color-ink) font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full" onClick={() => { setJoined(null); nav.go("territorio"); }}>Ahora no</button>
      </div>
      </>)}

      {nav.is("territorio") && (<>
      <div className={screenStyles.header}><button className={screenStyles.iconButton} aria-label="Volver" onClick={nav.back}><svg className={screenStyles.icon} viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7" /></svg></button><h1>Revisa tus datos</h1></div>
      <div className="flex-1 min-h-0 overflow-y-auto pt-1 px-4 pb-6 flex flex-col gap-4">
        <p className={screenStyles.muted}>Revisa que todo esté bien. Toca el lápiz para cambiar un dato ahí mismo.</p>

        <TarjetaDato titulo="Identidad">
          <p className="font-bold!">DNI {dni2.value.slice(0, 2)}••••{dni2.value.slice(-2)}</p>
          <p className={screenStyles.muted}>Verificado con RENIEC y PNP.</p>
        </TarjetaDato>

        <TarjetaDato titulo="Dirección" abierta={editando === "direccion"} onToggle={() => toggleEdit("direccion")}>
          {editando === "direccion" ? buscadorDireccion : (<>
            <p className="font-bold!">{ubicacion?.label ?? "Sin dirección. Toca el lápiz para agregarla."}</p>
            {locRev && (<p className={screenStyles.muted}>Localidad: {locRev}{depRev ? ` · ${depRev}` : ""}</p>)}
          </>)}
        </TarjetaDato>

        <TarjetaDato titulo="Junta vecinal" abierta={editando === "junta"} onToggle={hayJuntas ? () => toggleEdit("junta") : undefined}>
          {editando === "junta" ? (
            (juntas ?? []).map((j) => (
              <div key={j.id} className="border border-(--color-line) rounded-[16px] p-3 flex flex-col gap-2">
                <p className="font-bold!">{j.name}</p>
                <p className={screenStyles.muted}>{j.zona}</p>
                <button className={`${j.joinCls} min-h-11! w-full`} onClick={j.join}>{j.joinLbl}</button>
              </div>
            ))
          ) : (
            <p className="font-bold!">{joined ? juntas.find((j) => j.id === joined)?.name : "Sin junta"}</p>
          )}
          {sinJuntas && <p className={screenStyles.muted}>Indica una dirección con localidad para ver juntas cerca de ti. Puedes usar BarrioConecta sin junta.</p>}
          {!sinJuntas && <p className={screenStyles.muted}>Sumarte es voluntario. Puedes usar toda la app sin junta.</p>}
        </TarjetaDato>

        <button className="min-h-13 rounded-[18px] border-2 border-(--color-brand) bg-(--color-brand) text-white font-bold px-5 py-0 flex items-center justify-center gap-2 text-center w-full disabled:opacity-50 disabled:cursor-not-allowed" onClick={() => irAInicio(finishRegistro)}>Confirmar y continuar</button>
        <p className={`${screenStyles.muted} text-center!`}>Lima es solo un ejemplo: BarrioConecta sirve en costa, sierra y selva.</p>
      </div>
      </>)}
      
      </div>
      </div>
    </div>
  );
}
