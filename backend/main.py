from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import pandas as pd

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/brands")
def get_brands():
    df = pd.read_excel("backend/yeni_bosch_fiyatlari.xlsm", sheet_name="02_TavsiyeEdilenBakımListesi")
    brands = df["MARKA"].dropna().unique().tolist()
    return brands

@app.get("/api/models")
def get_models(brand: str):
    df = pd.read_excel("backend/yeni_bosch_fiyatlari.xlsm", sheet_name="02_TavsiyeEdilenBakımListesi")
    models = df[df["MARKA"] == brand]["MODEL"].dropna().unique().tolist()
    return models

@app.get("/api/parts")
def get_parts(brand: str, model: str):
    df = pd.read_excel("backend/yeni_bosch_fiyatlari.xlsm", sheet_name="02_TavsiyeEdilenBakımListesi")
    parts = df[(df["MARKA"] == brand) & (df["MODEL"] == model)]
    result = parts[["KATEGORİ", "ÜRÜN/TİP", "Birim", "Tavsiye Edilen Satış Fiyatı"]]
    result.columns = ["kategori", "urun", "birim", "fiyat"]
    return result.to_dict(orient="records")

@app.get("/")
def read_root():
    return {"message": "Backend Aktif!"}
