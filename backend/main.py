from fastapi import FastAPI, Request, Body
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import pandas as pd
import os
import json

app = FastAPI()

# Excel Dosyası
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
    df = df[(df["MARKA"] == brand) & (df["MODEL"] == model)]

    kategori_listesi = ["MotorYağ", "YağFiltresi", "HavaFiltresi", "PolenFiltre", "YakıtFiltresi"]
    base_parts = []
    for kategori in kategori_listesi:
        match = df[df["KATEGORİ"] == kategori]
        if not match.empty:
            row = match.iloc[0]
            base_parts.append({
                "kategori": row["KATEGORİ"],
                "urun_tip": row["ÜRÜN/TİP"],
                "birim": 1,
                "fiyat": row["Tavsiye Edilen Satış Fiyatı"],
                "toplam": row["Tavsiye Edilen Satış Fiyatı"]
            })

    optional = {
        "balata": [],
        "disk": [],
        "silecek": []
    }
    for item in optional.keys():
        matches = df[df["KATEGORİ"] == item]
        for idx, row in matches.iterrows():
            optional[item].append({
                "kategori": row["KATEGORİ"],
                "urun_tip": row["ÜRÜN/TİP"],
                "birim": 1,
                "fiyat": row["Tavsiye Edilen Satış Fiyatı"],
                "toplam": row["Tavsiye Edilen Satış Fiyatı"]
            })

    labor = {
        "kategori": "İşçilik",
        "urun_tip": "Periyodik Bakım",
        "birim": 1,
        "fiyat": 800,
        "toplam": 800
    }

    return {"baseParts": base_parts, "optional": optional, "labor": labor}

@app.post("/api/log/fiyatbakma")
async def log_fiyat_bakma():
    log_path = "backend/logs/fiyat_bakma_logu.json"
    os.makedirs(os.path.dirname(log_path), exist_ok=True)
    try:
        with open(log_path, "r") as f:
            logs = json.load(f)
    except:
        logs = []
    logs.append({"event": "fiyat_bakma"})
    with open(log_path, "w") as f:
        json.dump(logs, f)
    return {"success": True}

@app.get("/api/log/fiyatbakmasayisi")
def fiyatbakmasayisi():
    log_path = "backend/logs/fiyat_bakma_logu.json"
    if os.path.exists(log_path):
        with open(log_path, "r") as f:
            logs = json.load(f)
            return {"adet": len(logs)}
    return {"adet": 0}

@app.get("/api/log/randevusayisi")
def randevusayisi():
    return {"adet": 0}

# Frontend Yayınlama
app.mount("/", StaticFiles(directory="frontend/dist", html=True), name="static")

@app.get("/{full_path:path}")
async def serve_spa(full_path: str):
    return FileResponse("frontend/dist/index.html")
