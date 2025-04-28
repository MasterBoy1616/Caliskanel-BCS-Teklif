from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd

app = FastAPI()

# CORS ayarı frontend bağlantısı için
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Excel dosyası
excel_path = "backend/yeni_bosch_fiyatlari.xlsm"
sheets = pd.read_excel(excel_path, sheet_name=None)

@app.get("/api/brands")
def get_brands():
    df = sheets["02_TavsiyeEdilenBakımListesi"]
    return sorted(df["MARKA"].dropna().unique().tolist())

@app.get("/api/models")
def get_models(brand: str):
    df = sheets["02_TavsiyeEdilenBakımListesi"]
    return sorted(df[df["MARKA"] == brand]["MODEL"].dropna().unique().tolist())

@app.get("/api/parts")
def get_parts(brand: str, model: str):
    df = sheets["02_TavsiyeEdilenBakımListesi"]
    filtered = df[(df["MARKA"] == brand) & (df["MODEL"] == model)]
    parts = []
    for _, row in filtered.iterrows():
        parts.append({
            "kategori": row["KATEGORİ"],
            "urun": row["\u00dcr\u00dcN/T\u0130P"],
            "birim": row["Birim"],
            "fiyat": row["Tavsiye Edilen Satış Fiyatı"]
        })
    return parts

# Frontend build'i yayınla
app.mount("/static", StaticFiles(directory="backend/dist/assets"), name="static")

@app.get("/{full_path:path}")
async def serve_spa(full_path: str):
    return FileResponse("backend/dist/index.html")
