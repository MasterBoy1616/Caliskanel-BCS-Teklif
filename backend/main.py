from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import pandas as pd
import os

app = FastAPI()

# CORS ayarı
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Excel dosyası yolu
EXCEL_PATH = "backend/yeni_bosch_fiyatlari.xlsm"
SHEET_NAME = "02_TavsiyeEdilenBakımListesi"

def read_excel():
    return pd.read_excel(EXCEL_PATH, sheet_name=SHEET_NAME)

@app.get("/api/markalar")
def get_markalar():
    df = read_excel()
    markalar = df["MARKA"].dropna().unique().tolist()
    return markalar

@app.get("/api/modeller")
def get_modeller(marka: str):
    df = read_excel()
    marka = marka.strip().upper()
    df["MARKA"] = df["MARKA"].str.strip().str.upper()
    df["MODEL"] = df["MODEL"].str.strip()

    modeller = df[df["MARKA"] == marka]["MODEL"].dropna().unique().tolist()
    return modeller

@app.get("/api/parcalar")
def get_parcalar(marka: str, model: str):
    df = read_excel()
    marka = marka.strip().upper()
    model = model.strip().upper()
    df["MARKA"] = df["MARKA"].str.strip().str.upper()
    df["MODEL"] = df["MODEL"].str.strip().str.upper()

    filtre = (df["MARKA"] == marka) & (df["MODEL"] == model)
    parts = df[filtre]
    results = []

    for _, row in parts.iterrows():
        if pd.notna(row["ÜRÜN/TİP"]) and pd.notna(row["Birim"]) and pd.notna(row["Tavsiye Edilen Satış Fiyatı"]):
            results.append({
                "urun": row["ÜRÜN/TİP"],
                "adet": float(row["Birim"]),
                "birim_fiyat": int(row["Tavsiye Edilen Satış Fiyatı"]),
                "toplam": round(float(row["Birim"]) * int(row["Tavsiye Edilen Satış Fiyatı"]))
            })

    return results
