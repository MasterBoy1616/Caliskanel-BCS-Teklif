from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import pandas as pd
from starlette.staticfiles import StaticFiles
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

frontend_path = os.path.join(os.path.dirname(__file__), "..", "frontend", "dist")
app.mount("/", StaticFiles(directory=frontend_path, html=True), name="static")

@app.get("/api/parts")
def get_parts():
    df = pd.read_excel("./backend/yeni_bosch_fiyatlari.xlsm", sheet_name="02_TavsiyeEdilenBakımListesi")
    parcalar = []
    for _, row in df.iterrows():
        if row["KATEGORİ"] in ["MotorYağ", "YağFiltresi", "HavaFiltresi", "PolenFiltre", "YakıtFiltresi", "İşçilik", "Silecek", "Balata", "Disk"]:
            parcalar.append({
                "kategori": row["KATEGORİ"],
                "urun_tip": row["ÜRÜN/TİP"],
                "birim": row["Birim"],
                "fiyat": round(row["Tavsiye Edilen Satış Fiyatı"]),
            })
    return parcalar
