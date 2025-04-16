from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import pandas as pd

app = FastAPI()

excel_path = "backend/yeni_bosch_fiyatlari.xlsm"
sheets = pd.read_excel(excel_path, sheet_name=None)

def hesapla(row):
    try:
        miktar = float(str(row["Birim"]).split()[0].replace(",", "."))
        return miktar * row["Tavsiye Edilen Satış Fiyatı"]
    except:
        return row["Tavsiye Edilen Satış Fiyatı"]

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

    def fetch_parts(keyword, is_labor=False):
        filt = (df["ÜRÜN/TİP"].str.contains(keyword, na=False)) & ((df["KATEGORİ"] == "İşçilik") if is_labor else (df["KATEGORİ"] != "İşçilik"))
        parts = []
        for _, row in df[filt].iterrows():
            parts.append({
                "kategori": row["KATEGORİ"],
                "urun_tip": row["ÜRÜN/TİP"],
                "birim": row["Birim"],
                "fiyat": row["Tavsiye Edilen Satış Fiyatı"],
                "toplam": hesapla(row)
            })
        return parts

    base_keywords = ["MotorYağ", "YağFiltresi", "HavaFiltresi", "PolenFiltre", "YakıtFiltresi"]
    base_parts = []
    for kw in base_keywords:
        parts = fetch_parts(kw)
        if parts:
            base_parts.append(parts[0])

    optional = {
        "buji": fetch_parts("Buji") + fetch_parts("BujiDeğişim", is_labor=True),
        "balata": fetch_parts("ÖnFrenBalata") + fetch_parts("Balata", is_labor=True),
        "disk": fetch_parts("ÖnFrenDisk") + fetch_parts("Disk", is_labor=True)
    }

    labor_row = df[(df["KATEGORİ"] == "İşçilik") & (df["ÜRÜN/TİP"].str.contains("Periyodik", na=False))]
    if not labor_row.empty:
        row = labor_row.iloc[0]
        labor = {
            "kategori": row["KATEGORİ"],
            "urun_tip": row["ÜRÜN/TİP"],
            "birim": row["Birim"],
            "fiyat": row["Tavsiye Edilen Satış Fiyatı"],
            "toplam": hesapla(row)
        }
    else:
        labor = {"kategori": "İşçilik", "urun_tip": "Periyodik Bakım", "birim": "1", "fiyat": 0, "toplam": 0}

    return {
        "baseParts": base_parts,
        "optional": optional,
        "labor": labor
    }

app.mount("/", StaticFiles(directory="frontend/dist", html=True), name="static")
