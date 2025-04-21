from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

app = FastAPI()

# Frontend static dosyalarını sun (JS, CSS, IMG)
app.mount("/assets", StaticFiles(directory="frontend/dist/assets"), name="assets")

# Tüm diğer istekleri index.html'e yönlendir
@app.get("/{full_path:path}")
async def catch_all(full_path: str):
    index_path = "frontend/dist/index.html"
    if os.path.exists(index_path):
        return FileResponse(index_path)
    return {"detail": "Frontend not found!"}
