from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import pandas as pd

app = FastAPI()

@app.get("/api/brands")
def get_brands():
    return ["FIAT", "RENAULT", "FORD"]

@app.get("/{full_path:path}")
async def serve_spa(full_path: str):
    return FileResponse("frontend/dist/index.html")

app.mount("/static", StaticFiles(directory="frontend/dist/assets"), name="static")