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
    plaka: ""
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

  const handlePdfDownload = () => {
    if (!formData.adSoyad || !formData.plaka) {
      alert("Lütfen Ad Soyad ve Plaka bilgisini doldurunuz!");
      return;
    }
    const selectedParts = [...parts.baseParts];
    Object.keys(selectedExtras).forEach(key => {
      if (selectedExtras[key]) {
        selectedParts.push(...parts.optional[key]);
      }
    });
    selectedParts.push(parts.labor);

    generatePdf(formData, calculateTotal(), selectedParts);
  };

  return (
    <div className="app-background">
      <div className="app-container">
        <h1 className="text-3xl font-bold text-center mb-6">Çalışkanel Bosch Car Servis</h1>

        <div className="selectors flex flex-col md:flex-row justify-center items-center mb-6 gap-4">
          <select
            value={selectedBrand}
            onChange={(e) => {
              setSelectedBrand(e.target.value);
              setSelectedModel("");
              setParts(null);
            }}
            className="border p-2 rounded"
          >
            <option value="">Marka Seç</option>
            {brands.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>

          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            disabled={!selectedBrand}
            className="border p-2 rounded"
          >
            <option value="">Model Seç</option>
            {models.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        {parts && (
          <>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-200">
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
                <tr className="font-bold">
                  <td>{parts.labor.kategori}</td>
                  <td>{parts.labor.urun_tip}</td>
                  <td>{parts.labor.birim}</td>
                  <td>{parts.labor.fiyat}</td>
                  <td>{parts.labor.toplam}</td>
                </tr>
              </tbody>
            </table>

            <div className="text-2xl text-center font-bold my-6">
              Toplam Tutar (KDV Dahil): {calculateTotal()} TL
            </div>

            <div className="extras flex justify-center gap-6 mb-6">
              {["balata", "disk", "silecek"].map(opt => (
                <label key={opt}>
                  <input
                    type="checkbox"
                    checked={selectedExtras[opt]}
                    onChange={() => setSelectedExtras(prev => ({ ...prev, [opt]: !prev[opt] }))}
                  />
                  {" "}{opt.toUpperCase()}
                </label>
              ))}
            </div>

            <div className="flex flex-col md:flex-row justify-center gap-4">
              <input
                type="text"
                name="adSoyad"
                placeholder="Ad Soyad"
                value={formData.adSoyad}
                onChange={(e) => setFormData({ ...formData, adSoyad: e.target.value })}
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="plaka"
                placeholder="Plaka"
                value={formData.plaka}
                onChange={(e) => setFormData({ ...formData, plaka: e.target.value })}
                className="border p-2 rounded"
              />
              <button
                onClick={handlePdfDownload}
                className="button bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-700"
              >
                📄 Teklifi PDF Olarak Al
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
