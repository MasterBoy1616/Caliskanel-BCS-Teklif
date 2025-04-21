import React, { useState, useEffect } from "react";
import axios from "axios";
import { generatePdf } from "./pdfGenerator";

const Home = () => {
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [parts, setParts] = useState([]);
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
      axios.get(`/api/parts?brand=${selectedBrand}&model=${selectedModel}`).then((res) => setParts(res.data.baseParts || []));
    }
  }, [selectedBrand, selectedModel]);

  const calculateTotal = () => {
    return parts.reduce((sum, p) => sum + (p.toplam || 0), 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (parts.length > 0) {
      generatePdf(formData, parts, calculateTotal());
    } else {
      alert("Lütfen önce bir marka ve model seçiniz!");
    }
  };

  return (
    <div className="app-background">
      <div className="app-container">
        <h1 className="text-3xl font-bold text-center mb-6">Çalışkanel Bosch Car Servis</h1>

        <div className="selectors flex flex-col md:flex-row gap-4 mb-4">
          <select
            value={selectedBrand}
            onChange={(e) => {
              setSelectedBrand(e.target.value);
              setSelectedModel("");
              setParts([]);
            }}
            className="border p-2 rounded w-full md:w-1/2"
          >
            <option value="">Marka Seçin</option>
            {brands.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>

          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            disabled={!selectedBrand}
            className="border p-2 rounded w-full md:w-1/2"
          >
            <option value="">Model Seçin</option>
            {models.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-6">
          <input
            type="text"
            name="adSoyad"
            placeholder="Ad Soyad"
            value={formData.adSoyad}
            onChange={(e) => setFormData({ ...formData, adSoyad: e.target.value })}
            required
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="plaka"
            placeholder="Araç Plaka"
            value={formData.plaka}
            onChange={(e) => setFormData({ ...formData, plaka: e.target.value })}
            required
            className="border p-2 rounded"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded font-bold"
          >
            📄 Teklifi PDF Olarak Al
          </button>
        </form>

        {parts.length > 0 && (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Kategori</th>
                <th className="border p-2">Ürün</th>
                <th className="border p-2">Birim</th>
                <th className="border p-2">Fiyat (TL)</th>
                <th className="border p-2">Toplam (TL)</th>
              </tr>
            </thead>
            <tbody>
              {parts.map((p, idx) => (
                <tr key={idx}>
                  <td className="border p-2">{p.kategori}</td>
                  <td className="border p-2">{p.urun_tip}</td>
                  <td className="border p-2">{p.birim}</td>
                  <td className="border p-2">{p.fiyat} TL</td>
                  <td className="border p-2">{p.toplam} TL</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {parts.length > 0 && (
          <div className="text-2xl text-right font-bold mt-6">
            Toplam: {calculateTotal()} TL (KDV Dahil)
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
