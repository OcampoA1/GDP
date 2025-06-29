from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, schemas
from app.database import get_db

router = APIRouter()

@router.get("/", response_model=list[schemas.Movimiento])
def listar_movimientos(db: Session = Depends(get_db)):
    return crud.listar_movimientos(db)

@router.post("/", response_model=schemas.Movimiento)
def crear_movimiento(movimiento: schemas.MovimientoCreate, db: Session = Depends(get_db)):
    return crud.crear_movimiento(db, movimiento)

@router.get("/{movimiento_id}", response_model=schemas.Movimiento)
def obtener_movimiento(movimiento_id: int, db: Session = Depends(get_db)):
    mov = crud.obtener_movimiento(db, movimiento_id)
    if not mov:
        raise HTTPException(status_code=404, detail="Movimiento no encontrado")
    return mov

@router.put("/{movimiento_id}", response_model=schemas.Movimiento)
def actualizar_movimiento(movimiento_id: int, datos: schemas.MovimientoCreate, db: Session = Depends(get_db)):
    mov = crud.actualizar_movimiento(db, movimiento_id, datos)
    if not mov:
        raise HTTPException(status_code=404, detail="Movimiento no encontrado")
    return mov

@router.delete("/{movimiento_id}")
def eliminar_movimiento(movimiento_id: int, db: Session = Depends(get_db)):
    mov = crud.eliminar_movimiento(db, movimiento_id)
    if not mov:
        raise HTTPException(status_code=404, detail="Movimiento no encontrado")
    return {"mensaje": "Movimiento eliminado"}
