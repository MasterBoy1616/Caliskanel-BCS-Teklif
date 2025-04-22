from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Fiyat dosyasını oku
df = pd.read_excel("backend/yeni_bosch_fiyatlari.xlsm")

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
            "urun": row["ÜRÜN/TİP"],
            "adet": int(row["Birim"]),
            "birim_fiyat": int(row["Tavsiye Edilen Satış Fiyatı"]),
            "toplam": int(row["Birim"]) * int(row["Tavsiye Edilen Satış Fiyatı"])
        })
    return parts
