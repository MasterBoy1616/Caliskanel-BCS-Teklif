from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd

app = FastAPI()

# CORS middleware doğru şekilde ekliyoruz
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],    # İstersen buraya sadece frontend domain yazabilirsin, ama "*" şu an sorun çıkarmaz
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Excel dosyası ve sheet ismi
EXCEL_PATH = "backend/yeni_bosch_fiyatlari.xlsm"
SHEET_NAME = "02_TavsiyeEdilenBakımListesi"

# Excel okuma fonksiyonu
def read_excel():
    return pd.read_excel(EXCEL_PATH, sheet_name=SHEET_NAME)

# Marka listesi endpoint
@app.get("/api/markalar")
def get_markalar():
    df = read_excel()
    markalar = df["MARKA"].dropna().unique().tolist()
    return markalar

# Model listesi endpoint
@app.get("/api/modeller")
def get_modeller(marka: str):
    df = read_excel()
    modeller = df[df["MARKA"] == marka]["MODEL"].dropna().unique().tolist()
    return modeller

# Parçalar listesi endpoint
@app.get("/api/parcalar")
def get_parcalar(marka: str, model: str):
    df = read_excel()
    filtre = (df["MARKA"] == marka) & (df["MODEL"] == model)
    parts = df[filtre]
    results = []

    for _, row in parts.iterrows():
        if pd.notna(row["ÜRÜN/TİP"]) and pd.notna(row["Birim"]) and pd.notna(row["Tavsiye Edilen Satış Fiyatı"]):
            results.append({
                "urun": row["ÜRÜN/TİP"],
                "adet": float(row["Birim"]),
                "birim_fiyat": int(row["Tavsiye Edilen Satış Fiyatı"]),
                "toplam": round(float(row["Birim"]) * int(row["Tavsiye Edilen Satış Fiyatı"]))
            })

    return results
