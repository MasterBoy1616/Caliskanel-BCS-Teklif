from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import pandas as pd
import os

app = FastAPI()

# Frontend'i servis et
app.mount("/", StaticFiles(directory="frontend/dist", html=True), name="static")

# Excel verisi
excel_path = "backend/yeni_bosch_fiyatlari.xlsm"
sheets = pd.read_excel(excel_path, sheet_name=None)

@app.get("/api/brands")
def get_brands():
    df = sheets["02_TavsiyeEdilenBakımListesi"]
    return sorted(df["MARKA"].dropna().unique().tolist())

@app.get("/api/models")
def get_models(brand: str):
    df = sheets["02_TavsiyeEdilenBakımListesi"]
    filtered = df[df["MARKA"] == brand]
    return sorted(filtered["MODEL"].dropna().unique().tolist())

@app.get("/api/types")
def get_types(brand: str, model: str):
    df = sheets["02_TavsiyeEdilenBakımListesi"]
    filtered = df[(df["MARKA"] == brand) & (df["MODEL"] == model)]
    return sorted(filtered["ÜRÜN/TİP"].dropna().unique().tolist())

@app.get("/api/parts")
def get_parts(brand: str, model: str, type: str):
    df = sheets["02_TavsiyeEdilenBakımListesi"]
    df = df[(df["MARKA"] == brand) & (df["MODEL"] == model)]
    base_keywords = ["MotorYağ", "YağFiltresi", "HavaFiltresi", "PolenFiltre", "YakıtFiltresi"]
    base_parts = []
    for part in base_keywords:
        match = df[(df["KATEGORİ"] != "İşçilik") & (df["ÜRÜN/TİP"].str.contains(part, na=False))]
        if not match.empty:
            row = match.iloc[0]
            base_parts.append({"name": row["ÜRÜN/TİP"], "price": row["Tavsiye Edilen Satış Fiyatı"]})
    def get_optional(part_keyword, labor_keyword):
        parts = []
        part_match = df[(df["KATEGORİ"] != "İşçilik") & (df["ÜRÜN/TİP"].str.contains(part_keyword, na=False))]
        labor_match = df[(df["KATEGORİ"] == "İşçilik") & (df["ÜRÜN/TİP"].str.contains(labor_keyword, na=False))]
        if not part_match.empty:
            parts.append({"name": part_match.iloc[0]["ÜRÜN/TİP"], "price": part_match.iloc[0]["Tavsiye Edilen Satış Fiyatı"]})
        if not labor_match.empty:
            parts.append({"name": labor_match.iloc[0]["ÜRÜN/TİP"], "price": labor_match.iloc[0]["Tavsiye Edilen Satış Fiyatı"]})
        return parts
    return {
        "baseParts": base_parts,
        "optional": {
            "buji": get_optional("Buji", "BujiDeğişim"),
            "balata": get_optional("ÖnFrenBalata", "Balata"),
            "disk": get_optional("ÖnFrenDisk", "Disk")
        }
    }
