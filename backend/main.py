from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import pandas as pd
import os

EXCEL_PATH = "backend/yeni_bosch_fiyatlari.xlsm"
SHEET_NAME = "02_TavsiyeEdilenBakımListesi"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/", StaticFiles(directory="dist", html=True), name="static")

def read_excel():
    if os.path.exists(EXCEL_PATH):
        df = pd.read_excel(EXCEL_PATH, sheet_name=SHEET_NAME)
        return df
    else:
        return pd.DataFrame()

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
