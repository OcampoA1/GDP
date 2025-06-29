from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, schemas
from app.database import get_db

router = APIRouter()

@router.get("/", response_model=list[schemas.AdministracionOut])
def listar(db: Session = Depends(get_db)):
    return crud.listar_administracion(db)

@router.get("/{id}", response_model=schemas.AdministracionOut)
def obtener(id: int, db: Session = Depends(get_db)):
    adm = crud.obtener_administracion(db, id)
    if not adm:
        raise HTTPException(status_code=404, detail="No encontrado")
    return adm

@router.post("/", response_model=schemas.AdministracionOut)
def crear(data: schemas.AdministracionCreate, db: Session = Depends(get_db)):
    return crud.crear_administracion(db, data)

@router.put("/{id}", response_model=schemas.AdministracionOut)
def actualizar(id: int, data: schemas.AdministracionUpdate, db: Session = Depends(get_db)):
    return crud.actualizar_administracion(db, id, data)

@router.delete("/{id}")
def eliminar(id: int, db: Session = Depends(get_db)):
    crud.eliminar_administracion(db, id)
    return {"ok": True}
