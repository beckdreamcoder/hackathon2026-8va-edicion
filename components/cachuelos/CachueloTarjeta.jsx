"use client";

import { screenStyles } from "@/components/screens/screen-styles";
import { VECINOS } from "@/lib/demo/shared";
import { ESTADO_CACH } from "./use-cachuelos";

/** Tarjeta seleccionable de un cachuelo (misma apariencia que las tarjetas actuales de Cachuelos). */
export default function CachueloTarjeta({ vm, onAbrir }) {
  return (
    <button className={`${screenStyles.card} border-l-0 border-t-[5px] border-t-[#8a5300]`} onClick={() => onAbrir(vm)} aria-label={`${vm.titulo}, ${vm.pago}, ${ESTADO_CACH[vm.estado]}`}>
      <div className={screenStyles.row}>
        <span className={screenStyles.badgeCachuelo}>{vm.pago}</span>
        <span className={vm.estado === "abierto" ? screenStyles.badge : screenStyles.badgeSolidarity}>{ESTADO_CACH[vm.estado]}</span>
        {vm.pendientes > 0 && (<span className={screenStyles.badgeAlert}>{vm.pendientes} {vm.pendientes === 1 ? "solicitud" : "solicitudes"}</span>)}
        {vm.simulado && (<span className={`${screenStyles.badgeDemo} ml-auto`}>Ejemplo</span>)}
      </div>
      <h3 className="text-[19px]!">{vm.titulo}</h3>
      <p className="text-[14px] line-clamp-2">{vm.descripcion}</p>
      <p className={screenStyles.muted}>{vm.categoria} · {vm.ubicacion}</p>
      <p className="text-[14px] font-bold">Publica {VECINOS[vm.vecino]?.name ?? "un vecino"}{vm.modo === "ofrezco" ? " · ofrece su servicio" : " · necesita un servicio"}</p>
    </button>
  );
}
