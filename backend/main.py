from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import pandas as pd

app = FastAPI()

# EXCEL'i oku
excel_path = "backend/yeni_bosch_fiyatlari.xlsm"
sheets = pd.read_excel(excel_path, sheet_name=None)

# ✅ API endpoint'lerini ÖNCE tanımla
@app.get("/api/brands")
def get_brands():
    df = sheets["02_TavsiyeEdilenBakımListesi"]
    return sorted(df["MARKA"].dropna().unique().tolist())

# ✅ En son StaticFiles mount et
app.mount("/", StaticFiles(directory="frontend/dist", html=True), name="static")
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

