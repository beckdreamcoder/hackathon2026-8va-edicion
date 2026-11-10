"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useT } from "@/lib/i18n";
import { useTutorial, TUTORIAL_INICIAL, iniciarTutorial } from "@/lib/demo/tutorial";
import { hidratar } from "@/lib/demo/store";

type Paso = { id: number; ruta: string; sel: string; texto?: RegExp };

/** Pasos del tutorial: pantalla real y elemento que se resalta. Los textos están en lib/i18n (tour.pN.t / tour.pN.d). */
const PASOS: Paso[] = [
  { id: 1, ruta: "/inicio", sel: 'a[href="/comunidad"]' },
  { id: 2, ruta: "/mapa", sel: ".maplibregl-map" },
  { id: 3, ruta: "/mapa", sel: "button", texto: /^Radar$/ },
  { id: 4, ruta: "/mapa", sel: "button", texto: /^RutaJuntos$/ },
  { id: 5, ruta: "/publicar", sel: "button", texto: /Favor gratuito|Free favor/ },
  { id: 6, ruta: "/buscar", sel: "#bq" },
  { id: 7, ruta: "/favores", sel: "button", texto: /^(Ofrecen ayuda|Ofrezco ayuda|I offer help)$/ },
  { id: 8, ruta: "/cachuelos", sel: "button", texto: /^(Ofrecen servicios|Necesito un servicio|I need a service)$/ },
  { id: 9, ruta: "/coordinaciones", sel: "button", texto: /^(Pendientes|Pending)\b/ },
  { id: 10, ruta: "/emergencias", sel: "button", texto: /Reportar con cámara|Report with camera/ },
  { id: 11, ruta: "/solidaria", sel: 'a[href="/campanas"]' },
  { id: 12, ruta: "/junta", sel: "h2" },
  { id: 13, ruta: "/perfil", sel: "button", texto: /^(Editar perfil|Edit profile)$/ },
];

const MARCA_INGRESO = "bc:ingreso-tutorial";
const BTN = "min-h-11 rounded-[14px] px-4 font-bold text-[15px] border-2";
const reducir = () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

function buscar(p: Paso): HTMLElement | null {
  const els = Array.from(document.querySelectorAll<HTMLElement>(p.sel));
  const el = p.texto ? els.find((e) => p.texto!.test((e.textContent ?? "").trim())) : els[0];
  if (!el) return null;
  const r = el.getBoundingClientRect();
  return r.width > 0 && r.height > 0 ? el : null;
}

/**
 * Invitación inicial y guía paso a paso. Resalta el elemento real de cada pantalla sin bloquear la interacción
 * (el velo no captura clics). No pulsa botones ni crea nada: solo explica.
 */
export function Tutorial() {
  const { t } = useT();
  const router = useRouter();
  const pathname = usePathname();
  const [tut, setTut] = useTutorial();
  const [rect, setRect] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const [buscando, setBuscando] = useState(true);
  const objetivo = useRef<HTMLElement | null>(null);
  const tarjeta = useRef<HTMLDivElement>(null);
  const ultimoPaso = useRef(-1);

  const paso = PASOS[Math.min(tut.paso, PASOS.length - 1)];
  const enRuta = pathname === paso.ruta;
  const ultimo = tut.paso >= PASOS.length - 1;

  const cerrar = useCallback((estado: "completado" | "omitido") => setTut({ ...TUTORIAL_INICIAL, estado }), [setTut]);

  // Cada ingreso a una cuenta (pasar por Acceso «/» y llegar a Inicio) abre el tutorial desde el primer paso,
  // sin importar si ya se completó u omitió antes. La marca vive en sessionStorage para sobrevivir a la recarga
  // que hace el enlace de ingreso.
  useEffect(() => {
    try {
      if (pathname === "/") { window.sessionStorage.setItem(MARCA_INGRESO, "1"); return undefined; }
      if (pathname !== "/inicio" || window.sessionStorage.getItem(MARCA_INGRESO) !== "1") return undefined;
    } catch {
      return undefined; // sin sessionStorage (modo privado estricto): no se fuerza el tutorial
    }
    // Se espera a que carguen los datos guardados: antes de eso cualquier escritura se descarta
    let vivo = true;
    hidratar().then(() => {
      if (!vivo) return;
      try { window.sessionStorage.removeItem(MARCA_INGRESO); } catch { /* nada */ }
      iniciarTutorial();
    });
    return () => { vivo = false; };
  }, [pathname]);

  // Al cambiar de paso se abre su pantalla (si la persona navega a mano, el progreso se conserva)
  useEffect(() => {
    if (!tut.activo) { ultimoPaso.current = -1; return; }
    if (ultimoPaso.current !== tut.paso) {
      ultimoPaso.current = tut.paso;
      if (pathname !== paso.ruta) router.push(paso.ruta);
    }
  }, [tut.activo, tut.paso, paso.ruta, pathname, router]);

  // Localiza el elemento (con reintentos mientras carga) y sigue su posición
  useEffect(() => {
    if (!tut.activo || !enRuta) return undefined;
    let vivo = true;
    let intentos = 0;
    let primera = true;
    const medir = () => {
      if (!vivo) return;
      let el = objetivo.current;
      if (!el || !el.isConnected) { el = buscar(paso); objetivo.current = el; }
      if (el) {
        if (primera) { primera = false; el.scrollIntoView({ block: "center", behavior: reducir() ? "auto" : "smooth" }); }
        const r = el.getBoundingClientRect();
        setRect((a) => (a && Math.abs(a.x - r.left) < 1 && Math.abs(a.y - r.top) < 1 && Math.abs(a.w - r.width) < 1 && Math.abs(a.h - r.height) < 1 ? a : { x: r.left, y: r.top, w: r.width, h: r.height }));
        setBuscando(false);
      } else if (++intentos > 14) { setRect(null); setBuscando(false); }
    };
    const id = setInterval(medir, 220);
    const primero = setTimeout(medir, 60);
    return () => { vivo = false; clearInterval(id); clearTimeout(primero); objetivo.current = null; setRect(null); setBuscando(true); };
  }, [tut.activo, tut.paso, enRuta, paso]);

  // Foco en la tarjeta al cambiar de paso, para teclado y lectores de pantalla
  useEffect(() => { if (tut.activo) tarjeta.current?.focus({ preventScroll: true }); }, [tut.activo, tut.paso]);

  const mover = useCallback((d: number) => setTut({ paso: Math.max(0, Math.min(PASOS.length - 1, tut.paso + d)) }), [setTut, tut.paso]);
  useEffect(() => {
    if (!tut.activo) return undefined;
    const tecla = (e: KeyboardEvent) => {
      const escribiendo = /^(INPUT|TEXTAREA|SELECT)$/.test((e.target as HTMLElement)?.tagName ?? "");
      if (e.key === "Escape") cerrar("omitido");
      else if (!escribiendo && e.key === "ArrowRight" && !ultimo) mover(1);
      else if (!escribiendo && e.key === "ArrowLeft" && tut.paso > 0) mover(-1);
    };
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  }, [tut.activo, tut.paso, ultimo, mover, cerrar]);

  // Invitación a quien entra por primera vez (solo en Inicio, una vez)
  if (!tut.activo) {
    if (tut.estado !== "pendiente" || pathname !== "/inicio") return null;
    return (
      <div className="fixed inset-x-3 bottom-24 z-60 mx-auto max-w-[26rem] rounded-[20px] border border-(--color-line) bg-white p-4 shadow-[0_8px_28px_rgba(32,33,36,.28)] flex flex-col gap-3" role="dialog" aria-labelledby="tour-inv" aria-modal="false">
        <h2 id="tour-inv" className="text-[19px] font-extrabold">{t("tour.invitacion.titulo")}</h2>
        <p className="text-[15px] text-(--color-muted)">{t("tour.invitacion.texto")}</p>
        <div className="grid grid-cols-2 gap-2">
          <button className={`${BTN} border-(--color-line) bg-white text-(--color-ink)`} onClick={() => cerrar("omitido")}>{t("tour.ahoraNo")}</button>
          <button className={`${BTN} border-(--color-brand) bg-(--color-brand) text-white`} onClick={iniciarTutorial}>{t("tour.comenzar")}</button>
        </div>
      </div>
    );
  }

  const abajo = rect ? rect.y + rect.h / 2 > (typeof window !== "undefined" ? window.innerHeight : 800) / 2 : false;
  return (
    <>
      {rect && (
        <div
          aria-hidden="true"
          className="bc-tour-aro fixed z-55 pointer-events-none rounded-[16px] transition-[left,top,width,height] duration-200"
          style={{ left: rect.x - 6, top: rect.y - 6, width: rect.w + 12, height: rect.h + 12, animation: "bc-pulso 1.8s ease-in-out infinite" }}
        />
      )}
      <div
        ref={tarjeta}
        tabIndex={-1}
        role="dialog"
        aria-modal="false"
        aria-label={t("tour.region")}
        aria-labelledby="tour-t"
        aria-describedby="tour-d"
        className={`fixed inset-x-3 z-60 mx-auto max-w-[26rem] rounded-[20px] border border-(--color-line) bg-white p-4 shadow-[0_8px_28px_rgba(32,33,36,.3)] flex flex-col gap-2.5 outline-none ${abajo ? "top-14" : "bottom-24"}`}
      >
        <div className="flex items-center gap-2">
          <span className="text-[13px] font-bold text-(--color-muted) flex-1" aria-live="polite">{t("tour.progreso", { n: tut.paso + 1, total: PASOS.length })}</span>
          <div className="flex gap-1" aria-hidden="true">
            {PASOS.map((p, i) => (<i key={p.id} className={`block h-1.5 rounded-full ${i === tut.paso ? "w-4 bg-(--color-brand)" : i < tut.paso ? "w-1.5 bg-(--color-brand) opacity-50" : "w-1.5 bg-(--color-line)"}`} />))}
          </div>
        </div>
        <h2 id="tour-t" className="text-[19px] font-extrabold leading-tight">{t(`tour.p${paso.id}.t`)}</h2>
        <p id="tour-d" className="text-[15px]">{t(`tour.p${paso.id}.d`)}</p>
        {enRuta && !buscando && !rect && (<p className="text-[13px] text-(--color-muted)" role="status">{t("tour.sinElemento")}</p>)}
        <p className="text-[12px] text-(--color-muted)">{t("tour.demo")}</p>
        {!enRuta && (<button className="text-left text-[14px] font-bold text-(--color-brand) underline" onClick={() => router.push(paso.ruta)}>{paso.ruta}</button>)}
        <div className="flex items-center gap-2">
          <button className="min-h-11 px-2 text-[15px] font-bold text-(--color-muted) underline" onClick={() => cerrar("omitido")}>{t("tour.saltar")}</button>
          <span className="flex-1" />
          <button className={`${BTN} border-(--color-line) bg-white text-(--color-ink) disabled:opacity-40`} disabled={tut.paso === 0} onClick={() => mover(-1)}>{t("tour.anterior")}</button>
          {ultimo
            ? (<button className={`${BTN} border-(--color-brand) bg-(--color-brand) text-white`} onClick={() => cerrar("completado")}>{t("tour.finalizar")}</button>)
            : (<button className={`${BTN} border-(--color-brand) bg-(--color-brand) text-white`} onClick={() => mover(1)}>{t("tour.siguiente")}</button>)}
        </div>
      </div>
    </>
  );
}
