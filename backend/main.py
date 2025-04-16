from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import pandas as pd
import numpy as np

app = FastAPI()

excel_path = "backend/yeni_bosch_fiyatlari.xlsm"
sheets = pd.read_excel(excel_path, sheet_name=None)

def parse_miktar(miktar_str):
    try:
        num = str(miktar_str).split()[0].replace(",", ".")
        return float(num)
    except:
        return 1

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
    df = df[(df["MARKA"] == brand) & (df["MODEL"] == model)]

    def parse_row(row):
        fiyat = row.get("Tavsiye Edilen Satış Fiyatı", 0)
        birim = row.get("Birim", "1")
        if pd.isna(fiyat): fiyat = 0
        if pd.isna(birim): birim = "1"
        miktar = parse_miktar(birim)
        toplam = round(fiyat * miktar)
        return {
            "kategori": row["KATEGORİ"],
            "urun_tip": row["ÜRÜN/TİP"],
            "birim": birim,
            "fiyat": fiyat,
            "toplam": toplam
        }

    def fetch_parts(keyword, is_labor=False):
        filt = (df["ÜRÜN/TİP"].str.contains(keyword, na=False)) & ((df["KATEGORİ"] == "İşçilik") if is_labor else (df["KATEGORİ"] != "İşçilik"))
        return [parse_row(row) for _, row in df[filt].iterrows()]

    base_keywords = ["MotorYağ", "YağFiltresi", "HavaFiltresi", "PolenFiltre", "YakıtFiltresi"]
    base_parts = []
    for kw in base_keywords:
        parts = fetch_parts(kw)
        if parts:
            base_parts.append(parts[0])

    optional = {
        "buji": fetch_parts("Buji") + fetch_parts("BujiDeğişim", is_labor=True),
        "balata": fetch_parts("ÖnFrenBalata") + fetch_parts("Balata", is_labor=True),
        "disk": fetch_parts("ÖnFrenDisk") + fetch_parts("Disk", is_labor=True)
    }

    labor_match = df[(df["KATEGORİ"] == "İşçilik") & (df["ÜRÜN/TİP"].str.contains("Periyodik", na=False))]
    labor = parse_row(labor_match.iloc[0]) if not labor_match.empty else {
        "kategori": "İşçilik", "urun_tip": "Periyodik Bakım", "birim": "1", "fiyat": 0, "toplam": 0
    }

    return {
        "baseParts": base_parts,
        "optional": optional,
        "labor": labor
    }

app.mount("/", StaticFiles(directory="frontend/dist", html=True), name="static")
