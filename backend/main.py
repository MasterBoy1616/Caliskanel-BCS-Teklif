# backend/main.py

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Excel dosyasını yükle
excel_path = "backend/yeni_bosch_fiyatlari.xlsm"
if not os.path.exists(excel_path):
    raise FileNotFoundError(f"Excel dosyası bulunamadı: {excel_path}")

sheet_name = "02_TavsiyeEdilenBakimListesi"
df = pd.read_excel(excel_path, sheet_name=sheet_name)

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
            "kategori": row["KATEGORİ"],
            "urun": row["ÜRÜN/TİP"],
            "birim": row["Birim"],
            "fiyat": row["Tavsiye Edilen Satış Fiyatı"],
            "toplam": row["Birim"] * row["Tavsiye Edilen Satış Fiyatı"]
        })
    return parts
