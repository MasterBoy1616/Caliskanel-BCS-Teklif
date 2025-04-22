# backend/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import os

app = FastAPI()

# CORS ayarı: Frontend'in API'ye ulaşabilmesi için
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Tüm domainlere izin ver
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Excel dosyasını oku
excel_path = "backend/yeni_bosch_fiyatlari.xlsm"

if not os.path.exists(excel_path):
    raise FileNotFoundError(f"Excel dosyası bulunamadı: {excel_path}")

df = pd.read_excel(excel_path)

@app.get("/api/markalar")
def get_markalar():
    return df["MARKA"].dropna().unique().tolist()

@app.get("/api/modeller")
def get_modeller(marka: str):
    modeller = df[df["MARKA"] == marka]["MODEL"].dropna().unique()
    return modeller.tolist()

@app.get("/api/parcalar")
def get_parcalar(marka: str, model: str):
    filtered = df[(df["MARKA"] == marka) & (df["MODEL"] == model)]

    parts = []
    for _, row in filtered.iterrows():
        parts.append({
            "kategori": row.get("KATEGORİ", ""),
            "urun": row.get("ÜRÜN/TİP", ""),
            "adet": int(row.get("Birim", 1)),
            "birim_fiyat": int(row.get("Tavsiye Edilen Satış Fiyatı", 0)),
            "toplam": int(row.get("Birim", 1)) * int(row.get("Tavsiye Edilen Satış Fiyatı", 0))
        })

    return parts
