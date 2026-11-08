"use client";

import { useEffect } from "react";

/**
 * Con las scrollbars ocultas, la rueda del mouse no mueve las filas horizontales por sí sola.
 * Este manejador convierte el giro vertical en desplazamiento horizontal solo sobre filas que
 * desbordan en horizontal y no tienen desplazamiento vertical. Táctil, trackpad y teclado siguen nativos.
 */
export function HScroll() {
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      for (let el = e.target as HTMLElement | null; el && el !== document.body; el = el.parentElement) {
        const css = getComputedStyle(el);
        const horizontal = /(auto|scroll)/.test(css.overflowX) && el.scrollWidth > el.clientWidth + 1;
        const vertical = /(auto|scroll)/.test(css.overflowY) && el.scrollHeight > el.clientHeight + 1;
        if (vertical) return;
        if (horizontal) {
          const antes = el.scrollLeft;
          el.scrollLeft += e.deltaY;
          if (el.scrollLeft !== antes) e.preventDefault();
          return;
        }
      }
    };
    document.addEventListener("wheel", onWheel, { passive: false });
    return () => document.removeEventListener("wheel", onWheel);
  }, []);
  return null;
}
