export interface Rrhh {
  id: number;
  nombre: string;
  equipo?: string | null;
  proyecto?: string | null;
  dedicacion_total?: number | null;
}

export interface RrhhCreate {
  nombre: string;
  equipo?: string | null;
  proyecto?: string | null;
  dedicacion_total?: number | null;
}
