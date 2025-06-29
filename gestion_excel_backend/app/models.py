from sqlalchemy import Column, Integer, Text, Numeric
from .database import Base
from sqlalchemy import Column, Integer, String, Numeric, ForeignKey, Text, Date, Boolean
from sqlalchemy.orm import relationship

class Proyecto(Base):
    __tablename__ = "proyectos"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(Text, nullable=False)
    centro_costo = Column(Text)
    subproyecto = Column(Text)
    estado = Column(Text)
    presupuesto = Column(Numeric)

class Rrhh(Base):
    __tablename__ = "rrhh"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String, nullable=False)
    equipo = Column(String)
    proyecto = Column(String, nullable=False)
    dedicacion_total = Column(Numeric)


class Sueldo(Base):
    __tablename__ = "sueldos"

    id = Column(Integer, primary_key=True, index=True)
    periodo_id = Column(Integer, ForeignKey("periodos.id"))
    rrhh_id = Column(Integer, ForeignKey("rrhh.id"))
    proyecto_id = Column(Integer, ForeignKey("proyectos.id"))
    horas = Column(Integer)
    valor = Column(Numeric)
    fecha = Column(Date)

class Periodo(Base):
    __tablename__ = "periodos"

    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String)  # <- Este es el campo que se usa para buscar el mes
    fecha_inicio = Column(Date)
    fecha_fin = Column(Date)
    es_consolidado = Column(Boolean, default=False)

class Movimiento(Base):
    __tablename__ = "movimientos"

    id = Column(Integer, primary_key=True, index=True)
    periodo_id = Column(Integer, ForeignKey("periodos.id"))
    proyecto_id = Column(Integer, ForeignKey("proyectos.id"))
    valor = Column(Numeric, nullable=False)
    tipo = Column(String, nullable=False)
    fecha = Column(Date)
    observaciones = Column(Text)

class CajaMenor(Base):
    __tablename__ = "caja_menor"

    id = Column(Integer, primary_key=True, index=True)
    proyecto_id = Column(Integer, ForeignKey("proyectos.id"))
    periodo_id = Column(Integer, ForeignKey("periodos.id"))
    valor = Column(Numeric)
    fecha = Column(Date)
    responsable = Column(String, nullable=True)
    concepto = Column(String, nullable=True)
    observaciones = Column(Text, nullable=True)

class Compra(Base):
    __tablename__ = "compras"

    id = Column(Integer, primary_key=True, index=True)
    periodo_id = Column(Integer, ForeignKey("periodos.id"))
    proyecto_id = Column(Integer, ForeignKey("proyectos.id"))
    proveedor = Column(String)
    descripcion = Column(String)
    valor = Column(Numeric)
    forma_pago = Column(String)         # <--- agrega este
    estado = Column(String)             # <--- y este si falta
    fecha = Column(Date)

    proyecto = relationship("Proyecto")
    periodo = relationship("Periodo")

class Administracion(Base):
    __tablename__ = "administracion"

    id = Column(Integer, primary_key=True, index=True)
    tipo_costo = Column(String)
    descripcion = Column(String)
    periodicidad = Column(String)
    valor = Column(Numeric)
    fecha = Column(Date)

