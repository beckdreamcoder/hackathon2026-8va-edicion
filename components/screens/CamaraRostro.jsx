"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Validación facial en vivo: cámara frontal del dispositivo + detección de rostro en el navegador.
 * - El detector (MediaPipe Tasks Vision) se carga desde CDN; el modelo viene de Google Storage.
 * - El marco punteado se dibuja sobre el video siguiendo el rostro; al validar, cambia a verde y sólido.
 * - Si no hay permiso de cámara (o no es un contexto seguro, como HTTP en la red local), muestra un vector de referencia.
 * - Nada se guarda ni se envía: el video solo se usa en este dispositivo.
 */

const TASKS_VISION = "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.14";
const MODELO_ROSTRO =
  "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite";

/** `onListo` se llama una vez que la persona permitió la cámara o la denegó (o no hay cámara). */
export default function CamaraRostro({ done = false, onListo }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const doneRef = useRef(done);
  const [estado, setEstado] = useState("iniciando"); // iniciando | camara | sin-camara

  useEffect(() => {
    doneRef.current = done;
  }, [done]);

  // Avisa a la pantalla en cuanto la persona respondió al permiso (o no hay cámara).
  useEffect(() => {
    if (estado !== "iniciando") onListo?.(true);
  }, [estado, onListo]);

  useEffect(() => {
    let cancelado = false;
    let stream = null;
    let raf = 0;
    let detector = null;
    let modeloFallo = false;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas ? canvas.getContext("2d") : null;


    const dibujar = () => {
      raf = requestAnimationFrame(dibujar);
      if (!ctx || !video || video.readyState < 2) return;
      const vw = video.videoWidth;
      const vh = video.videoHeight;
      if (canvas.width !== vw || canvas.height !== vh) {
        canvas.width = vw;
        canvas.height = vh;
      }
      ctx.clearRect(0, 0, vw, vh);

      let caja = null;
      if (detector) {
        try {
          caja = detector.detectForVideo(video, performance.now()).detections[0]?.boundingBox ?? null;
        } catch {
          caja = null;
        }
      } else if (modeloFallo) {
        // Sin detector: marco centrado de referencia para que la validación se vea igual.
        caja = { originX: vw * 0.25, originY: vh * 0.15, width: vw * 0.5, height: vh * 0.6 };
      }
      if (!caja) return;

      const hecho = doneRef.current;
      ctx.lineWidth = Math.max(4, vw / 120);
      ctx.strokeStyle = hecho ? "#2e7d32" : "#C8102E";
      ctx.setLineDash(hecho ? [] : [Math.max(12, vw / 40), Math.max(9, vw / 50)]);
      ctx.lineDashOffset = -((performance.now() / 40) % 40);
      const margen = vw / 30;
      ctx.strokeRect(caja.originX - margen, caja.originY - margen, caja.width + margen * 2, caja.height + margen * 2);
    };

    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
      } catch {
        if (!cancelado) {
          setEstado("sin-camara");
        }
        return;
      }
      if (cancelado) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
      video.srcObject = stream;
      try {
        await video.play();
      } catch {
        // El navegador puede pedir un toque; el video se verá en cuanto empiece.
      }
      if (cancelado) return;
      setEstado("camara");
      raf = requestAnimationFrame(dibujar);

      try {
        const vision = await import(/* webpackIgnore: true */ `${TASKS_VISION}/+esm`);
        const fileset = await vision.FilesetResolver.forVisionTasks(`${TASKS_VISION}/wasm`);
        const nuevo = await vision.FaceDetector.createFromOptions(fileset, {
          baseOptions: { modelAssetPath: MODELO_ROSTRO, delegate: "GPU" },
          runningMode: "VIDEO",
        });
        if (cancelado) {
          nuevo.close();
          return;
        }
        detector = nuevo;
      } catch {
        modeloFallo = true;
      }
    })();

    return () => {
      cancelado = true;
      cancelAnimationFrame(raf);
      if (stream) stream.getTracks().forEach((t) => t.stop());
      if (detector) detector.close();
    };
  }, [onListo]);

  if (estado === "sin-camara") {
    return (
      <div className="relative w-full aspect-[3/4] rounded-[18px] bg-white border-2 border-dashed border-(--color-brand) grid place-items-center overflow-hidden">
        <svg viewBox="0 0 200 230" className="w-[180px] h-auto" aria-hidden="true">
          <path d="M30 230c0-42 30-62 70-62s70 20 70 62z" fill="#ddf0f2" />
          <rect x="88" y="132" width="24" height="26" rx="6" fill="#e8b89a" />
          <ellipse cx="100" cy="92" rx="40" ry="48" fill="#f4d9c6" />
          <path d="M60 86c0-30 18-44 40-44s40 14 40 44c-8-14-20-20-40-20s-32 6-40 20z" fill="#5e4636" />
          <circle cx="86" cy="96" r="4" fill="#3a2e28" />
          <circle cx="114" cy="96" r="4" fill="#3a2e28" />
          <path d="M90 122q10 8 20 0" fill="none" stroke="#8a5a44" strokeWidth="3" strokeLinecap="round" />
          <rect x="50" y="22" width="100" height="140" rx="30" fill="none" stroke={done ? "#2e7d32" : "#C8102E"} strokeWidth="3" strokeDasharray={done ? undefined : "8 6"} className={done ? undefined : "rostro-marco"} />
        </svg>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-[3/4] rounded-[18px] bg-black overflow-hidden">
      <video ref={videoRef} className="absolute inset-0 w-full h-full object-cover [transform:scaleX(-1)]" playsInline muted autoPlay />
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover [transform:scaleX(-1)] pointer-events-none" aria-hidden="true" />
      {estado === "iniciando" && (
        <p className="absolute inset-0 grid place-items-center text-white text-[14px]">Abriendo cámara…</p>
      )}
    </div>
  );
}
