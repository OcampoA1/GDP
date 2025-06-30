from sqlalchemy.orm import Session
from . import models, schemas

def crear_proyecto(db: Session, proyecto: schemas.ProyectoCreate):
    db_obj = models.Proyecto(**proyecto.dict())
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def listar_proyectos(db: Session):
    return db.query(models.Proyecto).all()

def actualizar_proyecto(db: Session, proyecto_id: int, datos: schemas.ProyectoCreate):
    proyecto = db.query(models.Proyecto).filter(models.Proyecto.id == proyecto_id).first()
    if not proyecto:
        return None
    for key, value in datos.dict().items():
        setattr(proyecto, key, value)
    db.commit()
    db.refresh(proyecto)
    return proyecto

def eliminar_proyecto(db: Session, proyecto_id: int):
    proyecto = db.query(models.Proyecto).filter(models.Proyecto.id == proyecto_id).first()
    if not proyecto:
        return False
    db.delete(proyecto)
    db.commit()
    return True



def crear_rrhh(db: Session, rrhh: schemas.RrhhCreate):
    nuevo_rrhh = models.Rrhh(**rrhh.dict())
    db.add(nuevo_rrhh)
    db.commit()
    db.refresh(nuevo_rrhh)
    return nuevo_rrhh

def listar_rrhh(db: Session):
    return db.query(models.Rrhh).all()

def obtener_rrhh(db: Session, rrhh_id: int):
    return db.query(models.Rrhh).filter(models.Rrhh.id == rrhh_id).first()

def actualizar_rrhh(db: Session, rrhh_id: int, datos: schemas.RrhhCreate):
    rrhh = db.query(models.Rrhh).filter(models.Rrhh.id == rrhh_id).first()
    for key, value in datos.dict().items():
        setattr(rrhh, key, value)
    db.commit()
    db.refresh(rrhh)
    return rrhh

def eliminar_rrhh(db: Session, rrhh_id: int):
    rrhh = db.query(models.Rrhh).filter(models.Rrhh.id == rrhh_id).first()
    db.delete(rrhh)
    db.commit()
    return rrhh


def crear_sueldo(db: Session, sueldo: schemas.SueldoCreate):
    nuevo_sueldo = models.Sueldo(**sueldo.dict())
    db.add(nuevo_sueldo)
    db.commit()
    db.refresh(nuevo_sueldo)
    return nuevo_sueldo

def listar_sueldos(db: Session):
    return db.query(models.Sueldo).all()

def obtener_sueldo(db: Session, sueldo_id: int):
    return db.query(models.Sueldo).filter(models.Sueldo.id == sueldo_id).first()

def actualizar_sueldo(db: Session, sueldo_id: int, datos: schemas.SueldoCreate):
    sueldo = db.query(models.Sueldo).filter(models.Sueldo.id == sueldo_id).first()
    for key, value in datos.dict().items():
        setattr(sueldo, key, value)
    db.commit()
    db.refresh(sueldo)
    return sueldo

def eliminar_sueldo(db: Session, sueldo_id: int):
    sueldo = db.query(models.Sueldo).filter(models.Sueldo.id == sueldo_id).first()
    db.delete(sueldo)
    db.commit()
    return sueldo


def crear_movimiento(db: Session, movimiento: schemas.MovimientoCreate):
    nuevo = models.Movimiento(**movimiento.dict())
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return nuevo

def listar_movimientos(db: Session):
    return db.query(models.Movimiento).all()

def obtener_movimiento(db: Session, movimiento_id: int):
    return db.query(models.Movimiento).filter(models.Movimiento.id == movimiento_id).first()

def actualizar_movimiento(db: Session, movimiento_id: int, datos: schemas.MovimientoCreate):
    mov = db.query(models.Movimiento).filter(models.Movimiento.id == movimiento_id).first()
    for key, value in datos.dict().items():
        setattr(mov, key, value)
    db.commit()
    db.refresh(mov)
    return mov

def eliminar_movimiento(db: Session, movimiento_id: int):
    mov = db.query(models.Movimiento).filter(models.Movimiento.id == movimiento_id).first()
    db.delete(mov)
    db.commit()
    return mov


def crear_caja_menor(db: Session, data: schemas.CajaMenorCreate):
    registro = models.CajaMenor(**data.dict())
    db.add(registro)
    db.commit()
    db.refresh(registro)
    return registro

def listar_caja_menor(db: Session):
    return db.query(models.CajaMenor).all()

def obtener_caja_menor(db: Session, id: int):
    return db.query(models.CajaMenor).filter(models.CajaMenor.id == id).first()

def actualizar_caja_menor(db: Session, id: int, data: schemas.CajaMenorCreate):
    registro = db.query(models.CajaMenor).filter(models.CajaMenor.id == id).first()
    for key, value in data.dict().items():
        setattr(registro, key, value)
    db.commit()
    db.refresh(registro)
    return registro

def eliminar_caja_menor(db: Session, id: int):
    registro = db.query(models.CajaMenor).filter(models.CajaMenor.id == id).first()
    db.delete(registro)
    db.commit()
    return registro

def listar_compras(db: Session):
    return db.query(models.Compra).all()

def crear_compra(db: Session, compra: schemas.CompraCreate):
    db_compra = models.Compra(**compra.dict())
    db.add(db_compra)
    db.commit()
    db.refresh(db_compra)
    return db_compra

def obtener_compra(db: Session, compra_id: int):
    return db.query(models.Compra).filter(models.Compra.id == compra_id).first()

def actualizar_compra(db: Session, compra_id: int, compra: schemas.CompraCreate):
    db_compra = obtener_compra(db, compra_id)
    if db_compra:
        for key, value in compra.dict().items():
            setattr(db_compra, key, value)
        db.commit()
        db.refresh(db_compra)
    return db_compra

def eliminar_compra(db: Session, compra_id: int):
    db_compra = obtener_compra(db, compra_id)
    if db_compra:
        db.delete(db_compra)
        db.commit()
    return db_compra


def listar_administracion(db: Session):
    return db.query(models.Administracion).all()

def obtener_administracion(db: Session, id: int):
    return db.query(models.Administracion).filter(models.Administracion.id == id).first()

def crear_administracion(db: Session, data: schemas.AdministracionCreate):
    obj = models.Administracion(**data.dict())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

def actualizar_administracion(db: Session, id: int, data: schemas.AdministracionUpdate):
    obj = obtener_administracion(db, id)
    if obj:
        for key, value in data.dict().items():
            setattr(obj, key, value)
        db.commit()
        db.refresh(obj)
    return obj

def eliminar_administracion(db: Session, id: int):
    obj = obtener_administracion(db, id)
    if obj:
        db.delete(obj)
        db.commit()
    return obj
