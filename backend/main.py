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

# Dosya yolu
EXCEL_PATH = "yeni_bosch_fiyatlari.xlsm"

# Veriyi oku
def read_excel():
    df = pd.read_excel(EXCEL_PATH, sheet_name="02_TavsiyeEdilenBakımListesi")
    return df

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
    parts = df[(df["MARKA"] == marka) & (df["MODEL"] == model)]
    periyodik = parts[
        parts["ÜRÜN/TİP"].isin([
            "MotorYağ", "YağFiltresi", "HavaFiltresi", "PolenFiltre", "YakıtFiltresi"
        ])
    ]
    # İşçilikleri çek
    iscilik = df[(df["KATEGORİ"] == "İşçilik") & (df["ÜRÜN/TİP"] == "PeriyodikBakım")]

    results = []
    for _, row in periyodik.iterrows():
        results.append({
            "kategori": row["KATEGORİ"],
            "urun": row["ÜRÜN/TİP"],
            "adet": row["Birim"],
            "birim_fiyat": row["Tavsiye Edilen Satış Fiyatı"],
            "toplam": row["Birim"] * row["Tavsiye Edilen Satış Fiyatı"],
        })

    for _, row in iscilik.iterrows():
        results.append({
            "kategori": "İşçilik",
            "urun": "Periyodik Bakım İşçilik",
            "adet": 1,
            "birim_fiyat": row["Tavsiye Edilen Satış Fiyatı"],
            "toplam": row["Tavsiye Edilen Satış Fiyatı"],
        })

    return results
