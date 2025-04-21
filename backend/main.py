from fastapi import FastAPI, Request
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import pandas as pd
import os
import json

app = FastAPI()

# API kısımları (örnek olarak aşağıda birkaç tanesi var)
@app.get("/api/brands")
def get_brands():
    df = pd.read_excel("backend/yeni_bosch_fiyatlari.xlsm", sheet_name="02_TavsiyeEdilenBakımListesi")
    return sorted(df["MARKA"].dropna().unique().tolist())

# Diğer API uç noktaların da burada olacak: /api/models, /api/parts vs...

# Frontend statik dosyalar için (Vite build çıktısı)
app.mount("/static", StaticFiles(directory="frontend/dist/assets"), name="static")

@app.get("/{full_path:path}")
async def serve_react_app(full_path: str):
    file_path = f"frontend/dist/{full_path}"
    if os.path.isfile(file_path):
        return FileResponse(file_path)
    return FileResponse("frontend/dist/index.html")
