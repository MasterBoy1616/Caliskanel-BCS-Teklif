from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import pandas as pd
import os

# Dosya ve sayfa ayarları
EXCEL_PATH = "backend/yeni_bosch_fiyatlari.xlsm"
SHEET_NAME = "02_TavsiyeEdilenBakımListesi"

app = FastAPI()

# CORS ayarları (Frontend erişimi için)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ana sayfa istekleri için frontend'i mount et
app.mount("/", StaticFiles(directory="frontend/dist", html=True), name="static")


# EXCEL oku
def read_excel():
    df = pd.read_excel(EXCEL_PATH, sheet_name=SHEET_NAME)
    return df

# API: Markalar
@app.get("/api/markalar")
def get_markalar():
    df = read_excel()
    markalar = df["MARKA"].dropna().unique().tolist()
    return markalar

# API: Modeller
@app.get("/api/modeller")
def get_modeller(marka: str):
    df = read_excel()
    modeller = df[df["MARKA"] == marka]["MODEL"].dropna().unique().tolist()
    return modeller

# API: Parçalar
@app.get("/api/parcalar")
def get_parcalar(marka: str, model: str):
    df = read_excel()
    filtre = (df["MARKA"] == marka) & (df["MODEL"] == model)
    secilen = df[filtre]

    parcalar = []

    # Sabit parçalar
    for kategori in ["MotorYağ", "YağFiltresi", "HavaFiltresi", "PolenFiltre", "YakıtFiltresi"]:
        parca = secilen[secilen["KATEGORİ"] == kategori]
        if not parca.empty:
            row = parca.iloc[0]
            parcalar.append({
                "urun": row["ÜRÜN/TİP"],
                "adet": float(row["Birim"]),
                "birim_fiyat": int(row["Tavsiye Edilen Satış Fiyatı"]),
                "toplam_fiyat": round(float(row["Birim"]) * int(row["Tavsiye Edilen Satış Fiyatı"]))
            })

    # İşçilik
    iscilik = secilen[(secilen["KATEGORİ"] == "İşçilik") & (secilen["ÜRÜN/TİP"] == "PeriyodikBakım")]
    if not iscilik.empty:
        row = iscilik.iloc[0]
        parcalar.append({
            "urun": "Periyodik Bakım İşçilik",
            "adet": 1,
            "birim_fiyat": int(row["Tavsiye Edilen Satış Fiyatı"]),
            "toplam_fiyat": int(row["Tavsiye Edilen Satış Fiyatı"]),
        })

    return parcalar
