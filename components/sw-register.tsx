"use client";

import { useEffect } from "react";

/** Registra el service worker solo en producción para no interferir con la recarga en desarrollo. */
export function SwRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production" || !("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);
  return null;
}
