from fastapi import FastAPI
from .database import engine
from . import models
from .endpoints import proyectos
from .endpoints import rrhh
from .endpoints import sueldos, movimientos, caja_menor, compras, administracion
app = FastAPI()

models.Base.metadata.create_all(bind=engine)

app.include_router(proyectos.router, prefix="/api/proyectos")
app.include_router(rrhh.router, prefix="/api/rrhh")
app.include_router(sueldos.router, prefix="/api/sueldos")
app.include_router(movimientos.router, prefix="/api/movimientos") 
app.include_router(caja_menor.router, prefix="/api/caja_menor") 
app.include_router(compras.router, prefix="/api/compras")
app.include_router(administracion.router, prefix="/api/administracion")

@app.get("/")
def root():
    return {"message": "Backend corriendo local 🚀"}
