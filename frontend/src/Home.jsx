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
    parts.baseParts.forEach((p) => total += p.toplam);
    Object.keys(selectedExtras).forEach(key => {
      if (selectedExtras[key]) {
        parts.optional[key].forEach((p) => total += p.toplam);
      }
    });
    total += parts.labor.toplam;
    return total;
  };

  const handleGeneratePDF = () => {
    if (!selectedBrand || !selectedModel) {
      alert("Lütfen araç marka ve model seçiniz!");
      return;
    }
    generatePdf(formData, parts, selectedExtras, selectedBrand, selectedModel);
  };

  return (
    <div className="p-6 app-background">
      <div className="app-container">
        <h1 className="text-2xl font-bold mb-6 text-center">Periyodik Bakım Fiyat Sorgulama</h1>

        <div className="selectors flex flex-wrap gap-4 mb-6 justify-center">
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
              <option key={b} value={b}>
                {b}
              </option>
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
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap gap-4 mb-6 justify-center">
          {["balata", "disk", "silecek"].map((opt) => (
            <label key={opt} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedExtras[opt]}
                onChange={() =>
                  setSelectedExtras((prev) => ({ ...prev, [opt]: !prev[opt] }))
                }
              />
              {opt.toUpperCase()}
            </label>
          ))}
        </div>

        <div className="flex flex-wrap gap-4 mb-6 justify-center">
          <input
            type="text"
            placeholder="Ad Soyad"
            value={formData.adSoyad}
            onChange={(e) => setFormData({ ...formData, adSoyad: e.target.value })}
            className="border p-2 rounded w-64"
          />
          <input
            type="text"
            placeholder="Araç Plaka"
            value={formData.plaka}
            onChange={(e) => setFormData({ ...formData, plaka: e.target.value })}
            className="border p-2 rounded w-64"
          />
        </div>

        {parts && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse mb-6">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2">Kategori</th>
                  <th className="border p-2">Ürün</th>
                  <th className="border p-2">Birim</th>
                  <th className="border p-2">Fiyat (TL)</th>
                  <th className="border p-2">Toplam (TL)</th>
                </tr>
              </thead>
              <tbody>
                {parts.baseParts.map((p, i) => (
                  <tr key={i}>
                    <td className="border p-2">{p.kategori}</td>
                    <td className="border p-2">{p.urun_tip}</td>
                    <td className="border p-2">{p.birim}</td>
                    <td className="border p-2">{p.fiyat}</td>
                    <td className="border p-2">{p.toplam}</td>
                  </tr>
                ))}
                {Object.entries(parts.optional).map(([key, items]) =>
                  selectedExtras[key]
                    ? items.map((p, i) => (
                        <tr key={`${key}-${i}`}>
                          <td className="border p-2">{p.kategori}</td>
                          <td className="border p-2">{p.urun_tip}</td>
                          <td className="border p-2">{p.birim}</td>
                          <td className="border p-2">{p.fiyat}</td>
                          <td className="border p-2">{p.toplam}</td>
                        </tr>
                      ))
                    : null
                )}
                <tr className="font-bold">
                  <td className="border p-2">{parts.labor.kategori}</td>
                  <td className="border p-2">{parts.labor.urun_tip}</td>
                  <td className="border p-2">{parts.labor.birim}</td>
                  <td className="border p-2">{parts.labor.fiyat}</td>
                  <td className="border p-2">{parts.labor.toplam}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        <div className="text-2xl font-bold text-center mb-6">
          Toplam: {calculateTotal()} TL (KDV Dahil)
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleGeneratePDF}
            className="button bg-blue-600 hover:bg-blue-800 text-white px-6 py-3 rounded"
          >
            📄 Teklifi PDF Olarak Al
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
