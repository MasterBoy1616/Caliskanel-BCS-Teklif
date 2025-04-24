from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from routes.api import router as api_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Burada dikkat: dist klasörü backend içinde olmalı!
app.mount("/", StaticFiles(directory="dist", html=True), name="static")

app.include_router(api_router)
