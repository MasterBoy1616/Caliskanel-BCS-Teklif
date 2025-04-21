# backend/main.py

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
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

# Excel dosyası yolu
EXCEL_PATH = "backend/yeni_bosch_fiyatlari.xlsm"

# Excel'i yükle
df = pd.read_excel(EXCEL_PATH, sheet_name="02_TavsiyeEdilenBakımListesi")

# Gerekli kolonlar: MARKA, MODEL, KATEGORİ, ÜRÜN/TİP, Birim, Tavsiye Edilen Satış Fiyatı
df = df[["MARKA", "MODEL", "KATEGORİ", "ÜRÜN/TİP", "Birim", "Tavsiye Edilen Satış Fiyatı"]]

@app.get("/api/brands")
def get_brands():
    brands = df["MARKA"].dropna().unique().tolist()
    return {"brands": brands}

@app.get("/api/models")
def get_models(brand: str = Query(...)):
    models = df[df["MARKA"] == brand]["MODEL"].dropna().unique().tolist()
    return {"models": models}

@app.get("/api/parts")
def get_parts(brand: str = Query(...), model: str = Query(...)):
    selected = df[(df["MARKA"] == brand) & (df["MODEL"] == model)]

    # Zorunlu parçalar
    required_parts = ["MotorYağ", "YağFiltresi", "HavaFiltresi", "PolenFiltre"]
    optional_parts = ["YakıtFiltresi", "Balata", "Disk", "Silecek"]
    base_parts = []
    labor = None
    extras = {"balata": [], "disk": [], "silecek": []}

    for _, row in selected.iterrows():
        kategori = row["KATEGORİ"]
        urun = row["ÜRÜN/TİP"]
        birim = row["Birim"]
        fiyat = row["Tavsiye Edilen Satış Fiyatı"]
        toplam = birim * fiyat

        part = {
            "kategori": kategori,
            "urun": urun,
            "birim": birim,
            "fiyat": fiyat,
            "toplam": toplam
        }

        if kategori in required_parts:
            base_parts.append(part)

        elif kategori == "İşçilik" and "Periyodik Bakım" in urun:
            labor = part

        elif kategori == "Balata":
            extras["balata"].append(part)

        elif kategori == "Disk":
            extras["disk"].append(part)

        elif kategori == "Silecek":
            extras["silecek"].append(part)

    return {
        "baseParts": base_parts,
        "labor": labor,
        "optional": extras
    }
