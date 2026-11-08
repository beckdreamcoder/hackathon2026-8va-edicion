/** Modelo mínimo de dominio. Fuente: consolidado V2 (F03–F05, F08, F10). */

export type TipoPublicacion = "favor" | "cachuelo" | "emergencia" | "campana";

export type EstadoCoordinacion =
  | "abierta"
  | "en_coordinacion"
  | "completada"
  | "cancelada";

export type Ambito = "local" | "solidario";

export type Publicacion = {
  id: string;
  tipo: TipoPublicacion;
  titulo: string;
  categoria: string;
  zonaAproximada: string;
  ambito: Ambito;
  estado: EstadoCoordinacion;
  /** Precio referencial en soles; null = "A convenir". Solo cachuelos. */
  precioReferencial: number | null;
  /** Todo dato del MVP es ficticio y debe rotularse. */
  esDemostracion: true;
};
