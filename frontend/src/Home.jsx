import React, { useState, useEffect } from "react";
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
    plaka: "",
  });

  useEffect(() => {
    axios.get("/api/brands").then((res) => setBrands(res.data));
  }, []);

  useEffect(() => {
    if (selectedBrand) {
      axios.get(`/api/models?brand=${selectedBrand}`).then((res) => setModels(res.data));
    }
  }, [selectedBrand]);

  useEffect(() => {
    if (selectedBrand && selectedModel) {
      axios.get(`/api/parts?brand=${selectedBrand}&model=${selectedModel}`).then((res) => setParts(res.data));
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

  const handlePdfDownload = (e) => {
    e.preventDefault();
    if (!formData.adSoyad || !formData.plaka) {
      alert("Ad Soyad ve Plaka boş olamaz.");
      return;
    }
    generatePdf(formData, selectedBrand, selectedModel, parts, selectedExtras);
  };

  return (
    <div className="app-background">
      <div className="app-container">
        <h1 className="text-2xl font-bold mb-4 text-center">Periyodik Bakım Fiyat Sorgulama</h1>

        <div className="selectors flex flex-wrap gap-4 mb-4">
          <select value={selectedBrand} onChange={(e) => {
            setSelectedBrand(e.target.value);
            setSelectedModel("");
            setParts(null);
          }} className="border p-2 rounded">
            <option value="">Marka Seçin</option>
            {brands.map(b => <option key={b} value={b}>{b}</option>)}
          </select>

          <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}
            disabled={!selectedBrand} className="border p-2 rounded">
            <option value="">Model Seçin</option>
            {models.map(m => <option key={m} value={m}>{m}</option>)}
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
                    <td>{p.fiyat} TL</td>
                    <td>{p.toplam} TL</td>
                  </tr>
                ))}
                {Object.entries(parts.optional).map(([key, items]) =>
                  selectedExtras[key]
                    ? items.map((p, i) => (
                        <tr key={`${key}-${i}`}>
                          <td>{p.kategori}</td>
                          <td>{p.urun_tip}</td>
                          <td>{p.birim}</td>
                          <td>{p.fiyat} TL</td>
                          <td>{p.toplam} TL</td>
                        </tr>
                      ))
                    : null
                )}
                <tr className="font-bold">
                  <td>{parts.labor.kategori}</td>
                  <td>{parts.labor.urun_tip}</td>
                  <td>{parts.labor.birim}</td>
                  <td>{parts.labor.fiyat} TL</td>
                  <td>{parts.labor.toplam} TL</td>
                </tr>
              </tbody>
            </table>

            <div className="text-2xl font-bold mt-6 text-center">
              Toplam Tutar: {calculateTotal()} TL (KDV Dahil)
            </div>
          </>
        )}

        <div className="extras mt-6 flex flex-wrap gap-4">
          {["balata", "disk", "silecek"].map(opt => (
            <label key={opt}>
              <input
                type="checkbox"
                checked={selectedExtras[opt]}
                onChange={() => setSelectedExtras(prev => ({ ...prev, [opt]: !prev[opt] }))}
              />
              {" "}
              {opt.toUpperCase()}
            </label>
          ))}
        </div>

        <form className="flex flex-col items-center mt-6 gap-4" onSubmit={handlePdfDownload}>
          <input
            type="text"
            name="adSoyad"
            placeholder="Ad Soyad"
            value={formData.adSoyad}
            onChange={(e) => setFormData({ ...formData, adSoyad: e.target.value })}
            className="border p-2 rounded w-64"
            required
          />
          <input
            type="text"
            name="plaka"
            placeholder="Plaka"
            value={formData.plaka}
            onChange={(e) => setFormData({ ...formData, plaka: e.target.value })}
            className="border p-2 rounded w-64"
            required
          />
          <button type="submit" className="button bg-blue-500 hover:bg-blue-700">
            📄 Teklifi PDF Olarak Al
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;
