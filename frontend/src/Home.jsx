// frontend/src/Home.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import { generatePdf } from "./pdfGenerator";

const Home = () => {
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [parts, setParts] = useState(null);
  const [selectedExtras, setSelectedExtras] = useState({
    balata: false,
    disk: false,
    silecek: false,
  });
  const [formData, setFormData] = useState({
    adSoyad: "",
    telefon: "",
    plaka: "",
    randevuTarihi: ""
  });

  useEffect(() => {
    axios.get("/api/brands").then(res => setBrands(res.data));
  }, []);

  useEffect(() => {
    if (selectedBrand) {
      axios.get(`/api/models?brand=${selectedBrand}`).then(res => setModels(res.data));
    }
  }, [selectedBrand]);

  useEffect(() => {
    if (selectedBrand && selectedModel) {
      axios.get(`/api/parts?brand=${selectedBrand}&model=${selectedModel}`).then(res => setParts(res.data));
      axios.post("/api/log/fiyatbakma");
    }
  }, [selectedBrand, selectedModel]);

  const calculateTotal = () => {
    if (!parts) return 0;
    let total = 0;
    parts.baseParts.forEach(p => total += p.toplam);
    Object.keys(selectedExtras).forEach(key => {
      if (selectedExtras[key]) {
        parts.optional[key].forEach(p => total += p.toplam);
      }
    });
    total += parts.labor.toplam;
    return total;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/randevu", {
        ...formData,
        arac: `${selectedBrand} ${selectedModel}`,
        fiyat: calculateTotal(),
        secimler: selectedExtras
      });
      generatePdf(formData, selectedBrand, selectedModel, parts, selectedExtras);
      alert("✅ Randevu oluşturuldu ve PDF hazırlandı.");
    } catch (error) {
      alert("❌ Randevu oluşturulamadı!");
    }
  };

  return (
    <div>
      <h2>Periyodik Bakım Fiyat Sorgulama</h2>

      <div className="selectors">
        <select value={selectedBrand} onChange={(e) => {
          setSelectedBrand(e.target.value);
          setSelectedModel("");
          setParts(null);
        }}>
          <option value="">Marka Seç</option>
          {brands.map((b, i) => <option key={i} value={b}>{b}</option>)}
        </select>

        <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} disabled={!selectedBrand}>
          <option value="">Model Seç</option>
          {models.map((m, i) => <option key={i} value={m}>{m}</option>)}
        </select>
      </div>

      {parts && (
        <>
          <table>
            <thead>
              <tr>
                <th>Kategori</th>
                <th>Ürün</th>
                <th>Birim</th>
                <th>Fiyat (TL)</th>
                <th>Toplam (TL)</th>
              </tr>
            </thead>
            <tbody>
              {parts.baseParts.map((p, i) => (
                <tr key={i}>
                  <td>{p.kategori}</td>
                  <td>{p.urun_tip}</td>
                  <td>{p.birim}</td>
                  <td>{p.fiyat}</td>
                  <td>{p.toplam}</td>
                </tr>
              ))}
              {Object.entries(parts.optional).map(([key, items]) => 
                selectedExtras[key] ? items.map((p, i) => (
                  <tr key={`${key}-${i}`}>
                    <td>{p.kategori}</td>
                    <td>{p.urun_tip}</td>
                    <td>{p.birim}</td>
                    <td>{p.fiyat}</td>
                    <td>{p.toplam}</td>
                  </tr>
                )) : null
              )}
              <tr>
                <td>{parts.labor.kategori}</td>
                <td>{parts.labor.urun_tip}</td>
                <td>{parts.labor.birim}</td>
                <td>{parts.labor.fiyat}</td>
                <td>{parts.labor.toplam}</td>
              </tr>
            </tbody>
          </table>

          <div className="extras">
            {["balata", "disk", "silecek"].map(opt => (
              <label key={opt}>
                <input type="checkbox" checked={selectedExtras[opt]} onChange={() => setSelectedExtras(prev => ({ ...prev, [opt]: !prev[opt] }))} />
                {opt.toUpperCase()}
              </label>
            ))}
          </div>

          <h3>Toplam: {calculateTotal()} TL (KDV Dahil)</h3>
        </>
      )}

      {parts && (
        <form onSubmit={handleSubmit} className="mt-6">
          <h2>Randevu Bilgileri</h2>
          <input name="adSoyad" placeholder="Ad Soyad" required onChange={(e) => setFormData({...formData, adSoyad: e.target.value})} />
          <input name="telefon" placeholder="Telefon" required onChange={(e) => setFormData({...formData, telefon: e.target.value})} />
          <input name="plaka" placeholder="Plaka" required onChange={(e) => setFormData({...formData, plaka: e.target.value})} />
          <input type="datetime-local" name="randevuTarihi" required onChange={(e) => setFormData({...formData, randevuTarihi: e.target.value})} />

          <button type="submit" className="button">📄 Teklif Oluştur</button>
        </form>
      )}
    </div>
  );
};

export default Home;
