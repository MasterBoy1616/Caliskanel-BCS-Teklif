## Caliskanel BCS Final Kurulum

### Backend kurulumu:
1. `pip install -r backend/requirements.txt`
2. Excel dosyasını kontrol et: `backend/yeni_bosch_fiyatlari.xlsm`
3. Sunucuyu çalıştır:
   ```bash
   uvicorn backend.main:app --host 0.0.0.0 --port 8000
