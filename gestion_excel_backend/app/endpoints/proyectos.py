from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import crud, schemas
from ..database import SessionLocal

router = APIRouter()

# Dependencia para obtener la sesión de base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Crear proyecto
@router.post("/", response_model=schemas.Proyecto)
def crear_proyecto(proyecto: schemas.ProyectoCreate, db: Session = Depends(get_db)):
    return crud.crear_proyecto(db, proyecto)

# Listar proyectos
@router.get("/", response_model=list[schemas.Proyecto])
def listar_proyectos(db: Session = Depends(get_db)):
    return crud.listar_proyectos(db)

# Obtener proyecto por ID
@router.get("/{proyecto_id}", response_model=schemas.Proyecto)
def obtener_proyecto(proyecto_id: int, db: Session = Depends(get_db)):
    proyecto = crud.obtener_proyecto(db, proyecto_id)
    if not proyecto:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    return proyecto

# Actualizar proyecto
@router.put("/{proyecto_id}", response_model=schemas.Proyecto)
def actualizar_proyecto(proyecto_id: int, datos: schemas.ProyectoCreate, db: Session = Depends(get_db)):
    proyecto = crud.actualizar_proyecto(db, proyecto_id, datos)
    if not proyecto:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    return proyecto

# Eliminar proyecto
@router.delete("/{proyecto_id}")
def eliminar_proyecto(proyecto_id: int, db: Session = Depends(get_db)):
    eliminado = crud.eliminar_proyecto(db, proyecto_id)
    if not eliminado:
        raise HTTPException(status_code=404, detail="Proyecto no encontrado")
    return {"mensaje": "Proyecto eliminado"}
