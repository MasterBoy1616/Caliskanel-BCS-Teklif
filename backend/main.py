from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import pandas as pd
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static dosyaları backend/dist klasöründen serve edeceğiz:
app.mount("/", StaticFiles(directory="dist", html=True), name="static")

@app.get("/")
def read_root():
    return FileResponse("dist/index.html")
