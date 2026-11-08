"use client";

import Link from "next/link";
import { screenStyles } from "@/components/screens/screen-styles";
import { chip } from "@/lib/demo/shared";
import { km, minutos } from "@/lib/map/geo";

const BARRA = "h-2 rounded-full bg-[#f1ece6] overflow-hidden";
const ESTADOS = { disponible: "Disponible", aceptado: "Aceptado · esperando recogida", abordo: "A bordo", entregado: "Entregado" };

/** Panel de RutaJuntos: puntos A/B, datos de la ruta, simulación y pasajeros evaluados. */
export default function RutaJuntosPanel({ rj, abierto, setAbierto, offline }) {
  const { ruta, A, B, objetivo, vehiculo, libres } = rj;
  const l = ruta.linea;
  const pct = l ? Math.min(100, Math.round((rj.progreso / Math.max(1, l.distanciaM)) * 100)) : 0;
  return (
    <div className="absolute left-3 right-3 bottom-20 z-3 max-h-[50%] overflow-y-auto bg-white border border-(--color-line) rounded-[20px] shadow-[0_2px_12px_rgba(32,33,36,.18)] p-3.5 flex flex-col gap-3" role="region" aria-label="RutaJuntos">
      <div className={screenStyles.row}>
        <h2 className="text-[19px]! flex-1">RutaJuntos</h2>
        <button className={`${screenStyles.chip} min-h-10!`} onClick={() => setAbierto(!abierto)} aria-expanded={abierto}>{abierto ? "Ocultar" : "Mostrar"}</button>
      </div>
      <div className="flex flex-wrap gap-1.5">
        <span className={screenStyles.badgeFavor}>Mapa y calles: reales</span>
        <span className={screenStyles.badgeDemo}>Vehículo y pasajeros: simulados</span>
      </div>

      {abierto && (<>
        <div className="flex flex-col gap-2">
          <p className={screenStyles.muted}>{objetivo === "A" ? "Toca el mapa para fijar el origen A." : objetivo === "B" ? "Ahora toca el mapa para fijar el destino B." : "Puedes cambiar A o B y tocar de nuevo el mapa."}</p>
          <div className={screenStyles.wrap}>
            <button className={chip(objetivo === "A")} onClick={() => rj.setObjetivo("A")}>A {A ? "✓" : "· elegir"}</button>
            <button className={chip(objetivo === "B")} onClick={() => rj.setObjetivo("B")} disabled={!A}>B {B ? "✓" : "· elegir"}</button>
            <button className={screenStyles.chip} onClick={rj.usarEjemplo}>Viaje de ejemplo</button>
            <button className={screenStyles.chip} onClick={rj.usarEjemploJicamarca}>Ejemplo Jicamarca</button>
            {(A || B) && (<button className={screenStyles.chip} onClick={rj.limpiar}>Limpiar</button>)}
          </div>
        </div>

        {offline && (<p className={screenStyles.error} role="alert">Sin conexión: no se puede calcular una ruta.</p>)}
        {ruta.estado === "cargando" && (<p className={screenStyles.muted} role="status">Calculando ruta por calles…</p>)}
        {ruta.estado === "error" && (
          <div className="bg-[#fbe3e7] rounded-[14px] p-3 flex flex-col gap-2" role="alert">
            <p className="font-bold! text-[#9e0c24]">{ruta.error}</p>
            <p className={screenStyles.muted}>No se muestra ninguna ruta porque no hay un cálculo real. Intenta de nuevo.</p>
            {A && B && (<button className={`${screenStyles.buttonOutline} min-h-11!`} onClick={rj.reintentar}>Reintentar</button>)}
          </div>
        )}

        {l && (<>
          <div className={screenStyles.card}>
            <div className={screenStyles.row}><b className="text-[20px]">{km(l.distanciaM)}</b><b className="text-[20px]">{minutos(l.duracionS)}</b></div>
            <p className={screenStyles.muted}>Recorrido por calles reales · {ruta.fuente}</p>
            <div className={BARRA} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label="Avance del vehículo simulado"><div className="h-full bg-(--color-brand)" style={{ width: `${pct}%` }} /></div>
            {rj.aviso && (<p className={screenStyles.muted} role="status">{rj.aviso}</p>)}
            <div className={screenStyles.wrap}>
              {rj.corriendo
                ? (<button className={`${screenStyles.button} min-h-11! w-auto! px-4!`} onClick={rj.pausar}>Pausar</button>)
                : (<button className={`${screenStyles.button} min-h-11! w-auto! px-4!`} onClick={rj.iniciar}>{pct >= 100 ? "Repetir" : pct > 0 ? "Continuar" : "Simular viaje"}</button>)}
              <button className={screenStyles.chip} onClick={rj.recalcular}>Recalcular ruta</button>
            </div>
            <div className={screenStyles.wrap} role="group" aria-label="Velocidad simulada">
              <span className={`${screenStyles.muted} self-center`}>Velocidad simulada</span>
              {[10, 30, 60].map((v) => (<button key={v} className={chip(rj.velocidad === v)} onClick={() => rj.setVelocidad(v)}>×{v}</button>))}
            </div>
          </div>

          <div className={screenStyles.card}>
            <div className={screenStyles.row}><b className="flex-1">{vehiculo.nombre}</b><span className={screenStyles.badgeDemo}>Simulado</span></div>
            <p className={screenStyles.muted}>{libres} de {vehiculo.asientos} asientos libres</p>
          </div>

          <h3 className="text-[17px]!">Pasajeros cercanos <span className={screenStyles.badgeDemo}>Simulados</span></h3>
          {rj.evaluaciones.map(({ p, ev, estado, info }) => (
            <div key={p.id} className={screenStyles.card}>
              <div className={screenStyles.row}><b className="flex-1">{rj.nombre(p.vecino)} · {p.plazas} {p.plazas === 1 ? "asiento" : "asientos"}</b>
                <span className={estado === "disponible" ? (ev.compatible ? screenStyles.badgeFavor : screenStyles.badge) : screenStyles.badgeSolidarity}>{estado === "disponible" ? (ev.compatible ? "Compatible" : "No compatible") : ESTADOS[estado]}</span></div>
              <p className={screenStyles.muted}>{p.origenTxt} → {p.destinoTxt}</p>
              <p className={screenStyles.muted}>Recogida a {km(ev.recogidaM)} de la ruta · destino a {km(ev.destinoM)} · dirección {Math.round(Math.max(0, ev.coseno) * 100)}%</p>
              {estado === "disponible" && (<>
                <p className={screenStyles.muted}>Desvío estimado: ~{minutos(ev.desvioS)} <i>(estimación; se confirma al recalcular)</i></p>
                {!ev.compatible && (<p className={screenStyles.error}>{ev.motivos.join(" · ")}</p>)}
                {ev.compatible && (<button className={`${screenStyles.button} min-h-11!`} onClick={() => rj.aceptar(p.id)}>Aceptar pasajero</button>)}
              </>)}
              {info?.desvioRealS != null && (<p className="text-[#2f5a2d] font-bold text-[14px]">Desvío calculado: {info.desvioRealS >= 0 ? "+" : "−"}{minutos(Math.abs(info.desvioRealS))} sobre la ruta anterior</p>)}
              {info?.coordId && (<Link className={`${screenStyles.buttonOutline} min-h-11!`} href="/coordinaciones">Abrir coordinación</Link>)}
            </div>
          ))}
        </>)}
      </>)}
    </div>
  );
}
