"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Pila de vistas dentro de una pantalla.
 * - `go(vista)` avanza a una vista nueva y la guarda en la pila.
 * - `back()` vuelve a la vista anterior. Si ya estás en la primera vista de la pantalla,
 *   usa el historial del navegador, así que nunca salta al inicio por defecto.
 * - `is(vista)` indica si la vista actual es esa.
 */
export function useViewStack<T extends string>(initial: T) {
  const router = useRouter();
  const [stack, setStack] = useState<T[]>([initial]);

  const current = stack[stack.length - 1];

  const go = useCallback((view: T) => {
    setStack((prev) => [...prev, view]);
  }, []);

  const back = useCallback(() => {
    if (stack.length > 1) {
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

  return { current, go, back, is };
}
