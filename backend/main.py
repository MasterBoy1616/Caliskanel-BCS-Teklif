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

EXCEL_PATH = "backend/yeni_bosch_fiyatlari.xlsm"
SHEET_NAME = "02_TavsiyeEdilenBakımListesi"

def read_excel():
    df = pd.read_excel(EXCEL_PATH, sheet_name=SHEET_NAME)
    return df

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

    sabit_kategoriler = ["MotorYağ", "YağFiltresi", "HavaFiltresi", "PolenFiltre", "YakıtFiltresi"]
    for kategori in sabit_kategoriler:
        parca = secilen[secilen["KATEGORİ"] == kategori]
        if not parca.empty:
            row = parca.iloc[0]
            parcalar.append({
                "kategori": kategori,
                "urun": row["ÜRÜN/TİP"],
                "adet": row["Birim"],
                "birim_fiyat": row["Tavsiye Edilen Satış Fiyatı"],
                "toplam": row["Birim"] * row["Tavsiye Edilen Satış Fiyatı"],
            })

    iscilik = secilen[(secilen["KATEGORİ"] == "İşçilik") & (secilen["ÜRÜN/TİP"] == "PeriyodikBakım")]
    if not iscilik.empty:
        row = iscilik.iloc[0]
        parcalar.append({
            "kategori": "İşçilik",
            "urun": "Periyodik Bakım İşçilik",
            "adet": 1,
            "birim_fiyat": row["Tavsiye Edilen Satış Fiyatı"],
            "toplam": row["Tavsiye Edilen Satış Fiyatı"],
        })

    return parcalar
