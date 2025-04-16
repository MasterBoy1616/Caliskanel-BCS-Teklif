from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
import pandas as pd

app = FastAPI()

# EXCEL'i oku
excel_path = "backend/yeni_bosch_fiyatlari.xlsm"
sheets = pd.read_excel(excel_path, sheet_name=None)

# ✅ API endpoint'lerini ÖNCE tanımla
@app.get("/api/brands")
def get_brands():
    df = sheets["02_TavsiyeEdilenBakımListesi"]
    return sorted(df["MARKA"].dropna().unique().tolist())

# ✅ En son StaticFiles mount et
app.mount("/", StaticFiles(directory="frontend/dist", html=True), name="static")
