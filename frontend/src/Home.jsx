import React, { useState, useEffect } from "react";
import { generatePdf } from "./pdfGenerator";
import axios from "axios";

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

  const handlePdf = () => {
    generatePdf(formData, calculateTotal(), parts, selectedExtras, selectedBrand, selectedModel);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-center mb-6">Periyodik Bakım Fiyat Sorgulama</h1>

      <div className="selectors flex flex-wrap justify-center gap-4 mb-6">
        <select
          value={selectedBrand}
          onChange={(e) => {
            setSelectedBrand(e.target.value);
            setSelectedModel("");
            setParts(null);
          }}
          className="border p-2 rounded"
        >
          <option value="">Marka Seçiniz</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>

        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          disabled={!selectedBrand}
          className="border p-2 rounded"
        >
          <option value="">Model Seçiniz</option>
          {models.map((model) => (
            <option key={model} value={model}>{model}</option>
          ))}
        </select>
      </div>

      {parts && (
        <div>
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
              {parts.baseParts.map((part, index) => (
                <tr key={index}>
                  <td>{part.kategori}</td>
                  <td>{part.urun_tip}</td>
                  <td>{part.birim}</td>
                  <td>{part.fiyat}</td>
                  <td>{part.toplam}</td>
                </tr>
              ))}
              {Object.entries(parts.optional).map(([key, items]) =>
                selectedExtras[key] ? items.map((part, i) => (
                  <tr key={`${key}-${i}`}>
                    <td>{part.kategori}</td>
                    <td>{part.urun_tip}</td>
                    <td>{part.birim}</td>
                    <td>{part.fiyat}</td>
                    <td>{part.toplam}</td>
                  </tr>
                )) : null
              )}
              <tr className="font-bold">
                <td>{parts.labor.kategori}</td>
                <td>{parts.labor.urun_tip}</td>
                <td>{parts.labor.birim}</td>
                <td>{parts.labor.fiyat}</td>
                <td>{parts.labor.toplam}</td>
              </tr>
            </tbody>
          </table>

          <div className="text-2xl font-bold text-center mt-6">
            Toplam: {calculateTotal()} TL (KDV Dahil)
          </div>

          <div className="extras flex justify-center gap-4 mt-4">
            {["balata", "disk", "silecek"].map((opt) => (
              <label key={opt} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedExtras[opt]}
                  onChange={() => setSelectedExtras(prev => ({ ...prev, [opt]: !prev[opt] }))}
                />
                {opt.toUpperCase()}
              </label>
            ))}
          </div>

          <div className="flex flex-col gap-2 items-center mt-8">
            <input
              type="text"
              name="adSoyad"
              value={formData.adSoyad}
              onChange={(e) => setFormData({...formData, adSoyad: e.target.value})}
              placeholder="Ad Soyad"
              className="border p-2 rounded w-80"
            />
            <input
              type="text"
              name="plaka"
              value={formData.plaka}
              onChange={(e) => setFormData({...formData, plaka: e.target.value})}
              placeholder="Plaka"
              className="border p-2 rounded w-80"
            />
            <button onClick={handlePdf} className="button mt-4">
              📄 Teklifi PDF Olarak Al
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
