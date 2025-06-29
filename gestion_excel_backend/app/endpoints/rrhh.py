from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import crud, schemas
from ..database import SessionLocal

router = APIRouter()

# Dependencia para obtener la sesión de DB
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=list[schemas.Rrhh])
def listar_rrhh(db: Session = Depends(get_db)):
    return crud.listar_rrhh(db)

@router.post("/", response_model=schemas.Rrhh)
def crear_rrhh(rrhh: schemas.RrhhCreate, db: Session = Depends(get_db)):
    return crud.crear_rrhh(db, rrhh)

@router.get("/{rrhh_id}", response_model=schemas.Rrhh)
def obtener_rrhh(rrhh_id: int, db: Session = Depends(get_db)):
    rrhh = crud.obtener_rrhh(db, rrhh_id)
    if not rrhh:
        raise HTTPException(status_code=404, detail="RRHH no encontrado")
    return rrhh

@router.put("/{rrhh_id}", response_model=schemas.Rrhh)
def actualizar_rrhh(rrhh_id: int, datos: schemas.RrhhCreate, db: Session = Depends(get_db)):
    return crud.actualizar_rrhh(db, rrhh_id, datos)

@router.delete("/{rrhh_id}", response_model=schemas.Rrhh)
def eliminar_rrhh(rrhh_id: int, db: Session = Depends(get_db)):
    rrhh = crud.eliminar_rrhh(db, rrhh_id)
    if not rrhh:
        raise HTTPException(status_code=404, detail="RRHH no encontrado")
    return rrhh
