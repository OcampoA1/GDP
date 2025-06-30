export interface AdministracionOut {
  id: number;
  tipo_costo?: string | null;
  descripcion?: string | null;
  periodicidad?: string | null;
  valor: number;
  fecha?: string | null;
}

export interface AdministracionCreate {
  tipo_costo?: string | null;
  descripcion?: string | null;
  periodicidad?: string | null;
  valor: number;
  fecha?: string | null;
}

export interface AdministracionUpdate extends AdministracionCreate {}
