// Datos de prueba para la pantalla de notificaciones.
// Reemplazar por la fuente real (API o base de datos) cuando exista.

export type CategoriaNotificacion = "favor" | "cachuelo" | "solidaridad" | "emergencia" | "junta" | "sistema";

export type Notificacion = {
  id: string;
  categoria: CategoriaNotificacion;
  titulo: string;
  texto: string;
  hace: string;
  leida: boolean;
};

export const notificacionesTest: Notificacion[] = [
  {
    id: "n1",
    categoria: "emergencia",
    titulo: "Corte de agua en Campoy",
    texto: "Sector 2 sin agua hasta las 18:00. Lleva agua de reserva.",
    hace: "hace 5 min",
    leida: false,
  },
  {
    id: "n2",
    categoria: "favor",
    titulo: "Doña Rosa aceptó tu favor",
    texto: "Te ayudará a cuidar a tu hijo el sábado por la mañana.",
    hace: "hace 40 min",
    leida: false,
  },
  {
    id: "n3",
    categoria: "cachuelo",
    titulo: "Nueva postulación",
    texto: "Carlos M. se postuló a tu cachuelo de pintura de muro.",
    hace: "hace 2 h",
    leida: false,
  },
  {
    id: "n4",
    categoria: "solidaridad",
    titulo: "Campaña de apoyo: pollada pro ayuda médica",
    texto: "Sábado 14:00 en el parque central. Tu aporte suma.",
    hace: "ayer",
    leida: false,
  },
  {
    id: "n5",
    categoria: "junta",
    titulo: "Reunión de la junta vecinal",
    texto: "Jueves 19:30 en el local comunal. Temas: alumbrado y limpieza.",
    hace: "hace 2 días",
    leida: true,
  },
  {
    id: "n6",
    categoria: "sistema",
    titulo: "Bienvenida a BarrioConecta",
    texto: "Elige tu zona y, si quieres, únete a una junta.",
    hace: "hace 3 días",
    leida: true,
  },
];
