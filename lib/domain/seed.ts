import type { Publicacion } from "./types";

/** Datos ficticios para la demo. Se muestran con la etiqueta "Datos de demostración". */
export const publicacionesDemo: Publicacion[] = [
  {
    id: "demo-1",
    tipo: "favor",
    titulo: "Préstamo de taladro por un día",
    categoria: "Préstamo de herramientas",
    zonaAproximada: "Zona de 300 m",
    ambito: "local",
    estado: "abierta",
    precioReferencial: null,
    esDemostracion: true,
  },
  {
    id: "demo-2",
    tipo: "cachuelo",
    titulo: "Reparación de grifo en cocina",
    categoria: "Gasfitería",
    zonaAproximada: "Zona de 300 m",
    ambito: "local",
    estado: "abierta",
    precioReferencial: 40,
    esDemostracion: true,
  },
];
