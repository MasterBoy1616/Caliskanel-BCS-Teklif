from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import os

app = FastAPI()

# Static files (React frontend build dosyaları)
app.mount("/static", StaticFiles(directory="frontend/dist/assets"), name="static")

@app.get("/{full_path:path}")
async def serve_spa(full_path: str):
    index_path = os.path.join("frontend", "dist", "index.html")
    return FileResponse(index_path)
