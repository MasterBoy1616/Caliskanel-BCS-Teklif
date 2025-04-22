from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from functools import lru_cache

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

EXCEL_PATH = "yeni_bosch_fiyatlari.xlsm"
SHEET_NAME = "02_TavsiyeEdilenBakımListesi"

@lru_cache()
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

    # Periyodik Bakım İşçilik
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

@app.get("/api/ekstralar")
def get_ekstralar():
    ekstralar = [
        {"ad": "Ön Fren Balatası", "parca": "ÖnFrenBalata", "iscilik": "Balata"},
        {"ad": "Ön Fren Diski", "parca": "ÖnFrenDisk", "iscilik": "Disk"},
        {"ad": "Silecek Lastiği", "parca": "Silecek", "iscilik": None}
    ]
    return ekstralar
