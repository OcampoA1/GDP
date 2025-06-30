from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware  # <-- NUEVO

from .database import engine
from . import models
from .endpoints import proyectos
from .endpoints import rrhh
from .endpoints import sueldos, movimientos, caja_menor, compras, administracion

# Swagger con tema obsidian
app = FastAPI(swagger_ui_parameters={"syntaxHighlight": {"theme": "obsidian"}})

# Habilitar CORS (para frontend u otros clientes)
origins = ["*"]  # Cambia esto a dominios específicos en producción

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

models.Base.metadata.create_all(bind=engine)

# Rutas incluidas
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
