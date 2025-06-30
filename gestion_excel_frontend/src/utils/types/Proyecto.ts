export interface Proyecto {
  id: number;
  nombre: string;
  centro_costo?: string | null;
  subproyecto?: string | null;
  estado?: string | null;
  presupuesto?: number | null;
}

export interface ProyectoCreate {
  nombre: string;
  centro_costo?: string | null;
  subproyecto?: string | null;
  estado?: string | null;
  presupuesto?: number | null;
}
