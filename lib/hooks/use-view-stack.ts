"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Pila de vistas dentro de una pantalla.
 * - `go(vista)` avanza a una vista nueva y la guarda en la pila.
 * - `back()` vuelve a la vista anterior. Si ya estás en la primera vista de la pantalla,
 *   usa el historial del navegador, así que nunca salta al inicio por defecto.
 * - `is(vista)` indica si la vista actual es esa.
 */
export function useViewStack<T extends string>(initial: T, enlazables: readonly T[] = []) {
  const router = useRouter();
  const [stack, setStack] = useState<T[]>([initial]);
  /** Sentido del último cambio de vista: sirve para animar la entrada (hacia delante o hacia atrás). */
  const [dir, setDir] = useState<"fwd" | "back">("fwd");

  // Enlace directo a una vista interna (`?vista=sms`): solo vistas declaradas como enlazables.
  // Se aplica después del montaje para no alterar el HTML prerenderizado; «Volver» regresa a la vista inicial.
  const lista = enlazables.join(",");
  useEffect(() => {
    const v = new URLSearchParams(window.location.search).get("vista") as T | null;
    if (!v || v === initial || !lista.split(",").includes(v)) return;
    const t = setTimeout(() => setStack([initial, v]), 0);
    return () => clearTimeout(t);
  }, [initial, lista]);

  const current = stack[stack.length - 1];

  const go = useCallback((view: T) => {
    setDir("fwd");
    setStack((prev) => [...prev, view]);
  }, []);

  const back = useCallback(() => {
    if (stack.length > 1) {
      setDir("back");
      setStack((prev) => prev.slice(0, -1));
      return;
    }
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/inicio");
    }
  }, [stack.length, router]);

  const is = useCallback((view: T) => current === view, [current]);

  /** Vuelve a la vista inicial de la pantalla, borrando el resto de la pila. */
  const reiniciar = useCallback(() => {
    setDir("back");
    setStack([initial]);
  }, [initial]);

  return { current, go, back, is, reiniciar, dir };
}
