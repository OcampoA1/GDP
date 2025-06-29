import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)) + "/..")

import pandas as pd
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app import models
from datetime import datetime

# 📄 Leer el Excel sin encabezado
archivo = "data/01_Historico_Gastos_2024_v2.xlsx"
df = pd.read_excel(archivo, sheet_name="5. Compras", header=None)

# 🧠 Vista previa de las primeras filas
print("🧠 Vista previa:")
print(df.head(10))

# 🏷️ Reasignar columnas (manual según estructura esperada)
df.columns = [
    "fecha",          # 0
    "semana",         # 1
    "presupuesto",    # 2
    "centro_costo",   # 3
    "proyecto",       # 4
    "iva",            # 5
    "proveedor",      # 6
    "valor",          # 7
    "forma_pago",     # 8
    "estado",         # 9
    "descripcion",    # 10
    "observaciones"   # 11
]

# 📄 Mostrar columnas
print("📄 Columnas reasignadas:", df.columns)

# 🚀 Conexión BD
db: Session = SessionLocal()
insertados = 0

for _, row in df.iterrows():
    if pd.isnull(row["proyecto"]) or pd.isnull(row["valor"]):
        continue

    # 🎯 Buscar proyecto
    proyecto = db.query(models.Proyecto).filter(models.Proyecto.nombre == str(row["proyecto"]).strip()).first()
    if not proyecto:
        print(f"⚠️ Proyecto no encontrado: {row['proyecto']}")
        continue

    # 🕓 Buscar periodo por nombre del mes
    mes_nombre = pd.to_datetime(row["fecha"]).strftime("%B")  # ej. 'January'
    mes_nombre_es = mes_nombre.capitalize().replace("January", "Enero")\
                                           .replace("February", "Febrero")\
                                           .replace("March", "Marzo")\
                                           .replace("April", "Abril")\
                                           .replace("May", "Mayo")\
                                           .replace("June", "Junio")\
                                           .replace("July", "Julio")\
                                           .replace("August", "Agosto")\
                                           .replace("September", "Septiembre")\
                                           .replace("October", "Octubre")\
                                           .replace("November", "Noviembre")\
                                           .replace("December", "Diciembre")

    periodo = db.query(models.Periodo).filter(models.Periodo.nombre == mes_nombre_es).first()
    if not periodo:
        print(f"⚠️ Periodo no encontrado: {mes_nombre_es}")
        continue

    compra = models.Compra(
        proyecto_id=proyecto.id,
        periodo_id=periodo.id,
        proveedor=row["proveedor"] if not pd.isnull(row["proveedor"]) else None,
        descripcion=row["descripcion"] if not pd.isnull(row["descripcion"]) else None,
        valor=row["valor"],
        forma_pago=row["forma_pago"] if not pd.isnull(row["forma_pago"]) else None,
        estado=row["estado"] if not pd.isnull(row["estado"]) else None,
        fecha=pd.to_datetime(row["fecha"]).date() if not pd.isnull(row["fecha"]) else None
    )

    db.add(compra)
    insertados += 1

db.commit()
print(f"✅ Compras importadas: {insertados}")
