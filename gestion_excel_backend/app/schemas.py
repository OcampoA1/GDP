from pydantic import BaseModel
from typing import Optional
from datetime import date

class ProyectoBase(BaseModel):
    nombre: str
    centro_costo: Optional[str]
    subproyecto: Optional[str]
    estado: Optional[str]
    presupuesto: Optional[float]

class ProyectoCreate(ProyectoBase):
    pass

class Proyecto(ProyectoBase):
    id: int
    class Config:
        orm_mode = True

class RrhhBase(BaseModel):
    nombre: str
    equipo: Optional[str] = None
    proyecto: Optional[str] = None
    dedicacion_total: Optional[float] = None

class RrhhCreate(RrhhBase):
    pass

class Rrhh(RrhhBase):
    id: int

    class Config:
        orm_mode = True


class SueldoBase(BaseModel):
    periodo_id: int
    rrhh_id: int
    proyecto_id: int
    horas: int
    valor: float
    fecha: date

class SueldoCreate(SueldoBase):
    pass

class Sueldo(SueldoBase):
    id: int

    class Config:
        from_attributes = True  # Para Pydantic v2+


class MovimientoBase(BaseModel):
    periodo_id: Optional[int]       # ← Acepta None
    proyecto_id: int
    valor: float
    tipo: Optional[str]             # ← Acepta None
    fecha: date
    observaciones: Optional[str]

class MovimientoCreate(MovimientoBase):
    pass

class Movimiento(MovimientoBase):
    id: int

    class Config:
        from_attributes = True  # Usar esto en Pydantic v2


class CajaMenorBase(BaseModel):
    proyecto_id: int
    periodo_id: int
    valor: float
    fecha: Optional[date]
    responsable: Optional[str]
    concepto: Optional[str]  # <- OPCIONAL
    observaciones: Optional[str]  # <- OPCIONAL

class CajaMenorCreate(CajaMenorBase):
    pass

class CajaMenor(CajaMenorBase):
    id: int

    class Config:
        from_attributes = True


class CompraBase(BaseModel):
    proyecto_id: int
    periodo_id: int
    valor: float
    fecha: Optional[date]
    proveedor: Optional[str]
    descripcion: Optional[str]

class CompraCreate(CompraBase):
    pass

class Compra(CompraBase):
    id: int

    class Config:
        from_attributes = True

class AdministracionBase(BaseModel):
    tipo_costo: Optional[str]
    descripcion: Optional[str]
    periodicidad: Optional[str]
    valor: float
    fecha: Optional[date]

    class Config:
        from_attributes = True

class AdministracionCreate(AdministracionBase):
    pass

class AdministracionUpdate(AdministracionBase):
    pass

class AdministracionOut(AdministracionBase):
    id: int

