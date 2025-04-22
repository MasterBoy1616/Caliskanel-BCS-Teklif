import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import pandas as pd

app = FastAPI()

# CORS ayarı
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Path ayarları
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIST_DIR = os.path.join(BASE_DIR, "../frontend/dist")
EXCEL_PATH = os.path.join(BASE_DIR, "yeni_bosch_fiyatlari.xlsm")
SHEET_NAME = "02_TavsiyeEdilenBakımListesi"

# React build dosyalarını FastAPI üzerinden sun
app.mount("/assets", StaticFiles(directory=os.path.join(FRONTEND_DIST_DIR, "assets")), name="assets")

@app.get("/")
async def serve_index():
    return FileResponse(os.path.join(FRONTEND_DIST_DIR, "index.html"))

# API yolları
def read_excel():
    return pd.read_excel(EXCEL_PATH, sheet_name=SHEET_NAME)

@app.get("/api/markalar")
def get_markalar():
    df = read_excel()
    return df["MARKA"].dropna().unique().tolist()

@app.get("/api/modeller")
def get_modeller(marka: str):
    df = read_excel()
    modeller = df[df["MARKA"] == marka]["MODEL"].dropna().unique().tolist()
    return modeller

@app.get("/api/parcalar")
def get_parcalar(marka: str, model: str):
    df = read_excel()
    filtre = (df["MARKA"] == marka) & (df["MODEL"] == model)
    secilen = df[filtre]

    parcalar = []

    for kategori in ["MotorYağ", "YağFiltresi", "HavaFiltresi", "PolenFiltre", "YakıtFiltresi"]:
        parca = secilen[secilen["KATEGORİ"] == kategori]
        if not parca.empty:
            row = parca.iloc[0]
            parcalar.append({
                "urun": row["ÜRÜN/TİP"],
                "adet": float(row["Birim"]),
                "birim_fiyat": int(row["Tavsiye Edilen Satış Fiyatı"]),
                "toplam": round(float(row["Birim"]) * int(row["Tavsiye Edilen Satış Fiyatı"]))
            })

    iscilik = secilen[(secilen["KATEGORİ"] == "İşçilik") & (secilen["ÜRÜN/TİP"] == "PeriyodikBakım")]
    if not iscilik.empty:
        row = iscilik.iloc[0]
        parcalar.append({
            "urun": "Periyodik Bakım İşçilik",
            "adet": 1,
            "birim_fiyat": int(row["Tavsiye Edilen Satış Fiyatı"]),
            "toplam": int(row["Tavsiye Edilen Satış Fiyatı"]),
        })

    return parcalar
