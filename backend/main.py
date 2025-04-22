from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Excel dosyasını bir kez yükle
df = pd.read_excel("backend/yeni_bosch_fiyatlari.xlsm", sheet_name="02_TavsiyeEdilenBakımListesi")

# Marka ve Model Listesi Üret
markalar = sorted(df["MARKA"].dropna().unique())

@app.get("/api/markalar")
def get_markalar():
    return markalar

@app.get("/api/modeller")
def get_modeller(marka: str):
    modeller = sorted(df[df["MARKA"] == marka]["MODEL"].dropna().unique())
    return modeller

@app.get("/api/parcalar")
def get_parcalar(marka: str, model: str):
    filtre = (df["MARKA"] == marka) & (df["MODEL"] == model)
    secilen = df[filtre]

    parcalar = []

    # Önce sabit olanlar (MotorYağ, YağFiltresi, HavaFiltresi, PolenFiltre, YakıtFiltresi)
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

    # Sonra Periyodik Bakım İşçilik ekle
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
