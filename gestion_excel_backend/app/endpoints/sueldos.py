from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import crud, schemas
from ..database import SessionLocal

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.Sueldo)
def crear_sueldo(sueldo: schemas.SueldoCreate, db: Session = Depends(get_db)):
    return crud.crear_sueldo(db, sueldo)

@router.get("/", response_model=list[schemas.Sueldo])
def listar_sueldos(db: Session = Depends(get_db)):
    return crud.listar_sueldos(db)

@router.get("/{sueldo_id}", response_model=schemas.Sueldo)
def obtener_sueldo(sueldo_id: int, db: Session = Depends(get_db)):
    return crud.obtener_sueldo(db, sueldo_id)

@router.put("/{sueldo_id}", response_model=schemas.Sueldo)
def actualizar_sueldo(sueldo_id: int, sueldo: schemas.SueldoCreate, db: Session = Depends(get_db)):
    return crud.actualizar_sueldo(db, sueldo_id, sueldo)

@router.delete("/{sueldo_id}", response_model=schemas.Sueldo)
def eliminar_sueldo(sueldo_id: int, db: Session = Depends(get_db)):
    return crud.eliminar_sueldo(db, sueldo_id)
