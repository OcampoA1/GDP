from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app import crud, schemas

router = APIRouter()

@router.get("/", response_model=list[schemas.Compra])
def listar(db: Session = Depends(get_db)):
    return crud.listar_compras(db)

@router.post("/", response_model=schemas.Compra)
def crear(compra: schemas.CompraCreate, db: Session = Depends(get_db)):
    return crud.crear_compra(db, compra)

@router.get("/{compra_id}", response_model=schemas.Compra)
def obtener(compra_id: int, db: Session = Depends(get_db)):
    db_compra = crud.obtener_compra(db, compra_id)
    if db_compra is None:
        raise HTTPException(status_code=404, detail="Compra no encontrada")
    return db_compra

@router.put("/{compra_id}", response_model=schemas.Compra)
def actualizar(compra_id: int, compra: schemas.CompraCreate, db: Session = Depends(get_db)):
    return crud.actualizar_compra(db, compra_id, compra)

@router.delete("/{compra_id}", response_model=schemas.Compra)
def eliminar(compra_id: int, db: Session = Depends(get_db)):
    return crud.eliminar_compra(db, compra_id)
