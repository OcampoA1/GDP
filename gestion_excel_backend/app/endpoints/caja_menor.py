from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import schemas, crud
from app.database import get_db

router = APIRouter()

@router.post("/", response_model=schemas.CajaMenor)
def crear(data: schemas.CajaMenorCreate, db: Session = Depends(get_db)):
    return crud.crear_caja_menor(db, data)

@router.get("/", response_model=list[schemas.CajaMenor])
def listar(db: Session = Depends(get_db)):
    return crud.listar_caja_menor(db)

@router.get("/{id}", response_model=schemas.CajaMenor)
def obtener(id: int, db: Session = Depends(get_db)):
    obj = crud.obtener_caja_menor(db, id)
    if not obj:
        raise HTTPException(status_code=404, detail="No encontrado")
    return obj

@router.put("/{id}", response_model=schemas.CajaMenor)
def actualizar(id: int, data: schemas.CajaMenorCreate, db: Session = Depends(get_db)):
    return crud.actualizar_caja_menor(db, id, data)

@router.delete("/{id}", response_model=schemas.CajaMenor)
def eliminar(id: int, db: Session = Depends(get_db)):
    return crud.eliminar_caja_menor(db, id)
