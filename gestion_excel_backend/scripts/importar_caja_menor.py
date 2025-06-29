import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)) + "/..")

import pandas as pd
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app import models
from datetime import datetime

# Cargar Excel
archivo = "data/01_Historico_Gastos_2024_v2.xlsx"
df = pd.read_excel(archivo, sheet_name="4. Gastos CajaMenor", header=None)

# Vista previa
print("🧠 Vista previa:")
print(df.head(10))

# Usar fila 2 como encabezado real
df.columns = df.iloc[2]
df = df[3:]  # eliminar filas de encabezado originales

# Renombrar columnas
df = df.rename(columns={
    "Fecha": "fecha",
    "Semana": "semana",
    "Presupuesto": "presupuesto",
    "Centro de Costos": "centro_costo",
    "SubProyecto": "subproyecto",
    "Valor": "valor"
})

print("📄 Columnas reales encontradas:", df.columns)

# Conexión BD
db: Session = SessionLocal()
insertados = 0

for _, row in df.iterrows():
    if pd.isnull(row["subproyecto"]) or pd.isnull(row["valor"]):
        continue

    # Proyecto
    proyecto = db.query(models.Proyecto).filter(models.Proyecto.nombre == str(row["subproyecto"]).strip()).first()
    if not proyecto:
        print(f"⚠️ Proyecto no encontrado: {row['subproyecto']}")
        continue

    # Mes (en español)
    try:
        mes_num = pd.to_datetime(row["fecha"]).month
        meses_es = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]
        mes_str = meses_es[mes_num - 1]
    except Exception:
        print(f"⚠️ Fecha inválida: {row['fecha']}")
        continue

    periodo = db.query(models.Periodo).filter(models.Periodo.nombre == mes_str).first()
    if not periodo:
        print(f"⚠️ Periodo no encontrado: {mes_str}")
        continue

    gasto = models.CajaMenor(
        proyecto_id=proyecto.id,
        periodo_id=periodo.id,
        valor=row["valor"],
        fecha=pd.to_datetime(row["fecha"]).date() if not pd.isnull(row["fecha"]) else None,
        responsable=None,
        descripcion=None
    )
    db.add(gasto)
    insertados += 1

db.commit()
print(f"✅ CajaMenor importados: {insertados}")
