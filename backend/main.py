from fastapi import FastAPI, Request, Body
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import pandas as pd
import json
import os
from datetime import datetime

app = FastAPI()

# Excel dosyası
excel_path = "backend/yeni_bosch_fiyatlari.xlsm"
sheets = pd.read_excel(excel_path, sheet_name=None)

# Log dosyaları
FIYAT_LOG_PATH = "backend/logs/fiyat_bakma_logu.json"
RANDEVU_LOG_PATH = "backend/logs/randevu_logu.json"

# ============ API İŞLEMLERİ ============

def parse_miktar(birim_str):
    try:
        if pd.isna(birim_str): return 1
        value = str(birim_str).split()[0].replace(",", ".")
        return float(value)
    except:
        return 1

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
        "birim": miktar,
        "fiyat": fiyat,
        "toplam": toplam
    }

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
            base_parts.append(parse_row(match.iloc[0]))

    def get_optional_parts(parca_kategori, iscilik_anahtar=None):
        parts = []
        match_part = df[df["KATEGORİ"] == parca_kategori]
        if not match_part.empty:
            parts.append(parse_row(match_part.iloc[0]))
        if iscilik_anahtar:
            match_iscilik = df[(df["KATEGORİ"] == "İşçilik") & (df["ÜRÜN/TİP"].str.contains(iscilik_anahtar, na=False))]
            if not match_iscilik.empty:
                parts.append(parse_row(match_iscilik.iloc[0]))
        return parts

    optional = {
        "balata": get_optional_parts("ÖnFrenBalata", "Balata"),
        "disk": get_optional_parts("ÖnFrenDisk", "Disk"),
        "silecek": get_optional_parts("Silecek")
    }

    labor_match = df[(df["KATEGORİ"] == "İşçilik") & (df["ÜRÜN/TİP"].str.contains("Periyodik", na=False))]
    if not labor_match.empty:
        labor = parse_row(labor_match.iloc[0])
    else:
        labor = {"kategori": "İşçilik", "urun_tip": "Periyodik Bakım", "birim": 1, "fiyat": 0, "toplam": 0}

    return {
        "baseParts": base_parts,
        "optional": optional,
        "labor": labor
    }

# Loglama
@app.post("/api/log/fiyatbakma")
def log_fiyat_bakma():
    os.makedirs(os.path.dirname(FIYAT_LOG_PATH), exist_ok=True)
    log = {"timestamp": datetime.now().isoformat()}
    try:
        if os.path.exists(FIYAT_LOG_PATH):
            with open(FIYAT_LOG_PATH, "r+") as f:
                logs = json.load(f)
                logs.append(log)
                f.seek(0)
                json.dump(logs, f, indent=2)
                f.truncate()
        else:
            with open(FIYAT_LOG_PATH, "w") as f:
                json.dump([log], f, indent=2)
    except:
        pass
    return {"success": True}

@app.post("/api/log/randevu")
async def log_randevu(request: Request):
    data = await request.json()
    os.makedirs(os.path.dirname(RANDEVU_LOG_PATH), exist_ok=True)
    try:
        if os.path.exists(RANDEVU_LOG_PATH):
            with open(RANDEVU_LOG_PATH, "r+") as f:
                logs = json.load(f)
                logs.append(data)
                f.seek(0)
                json.dump(logs, f, indent=2, ensure_ascii=False)
                f.truncate()
        else:
            with open(RANDEVU_LOG_PATH, "w", encoding="utf-8") as f:
                json.dump([data], f, indent=2, ensure_ascii=False)
    except:
        pass
    return {"success": True}

@app.get("/api/randevular")
def get_randevular():
    if os.path.exists(RANDEVU_LOG_PATH):
        with open(RANDEVU_LOG_PATH, "r", encoding="utf-8") as f:
            randevular = json.load(f)
            randevular.sort(key=lambda x: x.get("randevuTarihi", ""), reverse=True)
            return randevular
    return []

# ============ FRONTEND SERVE ============

# assets ve dosyaları sunmak
app.mount("/assets", StaticFiles(directory="frontend/dist/assets"), name="assets")

# favicon.ico varsa yükle
if os.path.exists("frontend/dist/favicon.ico"):
    app.mount("/favicon.ico", StaticFiles(directory="frontend/dist/favicon.ico"), name="favicon")

# bütün diğer yolları yakala → frontend index.html dön
@app.get("/{full_path:path}")
async def serve_spa(full_path: str):
    index_path = "frontend/dist/index.html"
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {"detail": "Frontend Build Eksik veya Hatalı!"}
