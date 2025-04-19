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
    parts.baseParts.forEach((p) => (total += p.toplam));
    Object.keys(selectedExtras).forEach((key) => {
      if (selectedExtras[key]) {
        parts.optional[key].forEach((p) => (total += p.toplam));
      }
    });
    total += parts.labor.toplam;
    return total;
  };

  const handleGeneratePdf = () => {
    generatePdf(formData, selectedBrand, selectedModel, parts, selectedExtras, calculateTotal());
  };

  return (
    <div className="app-background">
      <div className="app-container">
        <h1 className="text-3xl font-bold mb-6 text-center">Çalışkanel Bosch Car Servisi - Periyodik Bakım</h1>

        <div className="selectors flex flex-wrap gap-4 justify-center mb-6">
          <select
            value={selectedBrand}
            onChange={(e) => {
              setSelectedBrand(e.target.value);
              setSelectedModel("");
              setParts(null);
            }}
            className="border p-2 rounded"
          >
            <option value="">Marka Seçin</option>
            {brands.map((brand, idx) => (
              <option key={idx} value={brand}>
                {brand}
              </option>
            ))}
          </select>

          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            disabled={!selectedBrand}
            className="border p-2 rounded"
          >
            <option value="">Model Seçin</option>
            {models.map((model, idx) => (
              <option key={idx} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>

        {parts && (
          <>
            <table className="table-auto w-full border-collapse mb-6">
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
                {parts.baseParts.map((p, idx) => (
                  <tr key={idx}>
                    <td className="border p-2">{p.kategori}</td>
                    <td className="border p-2">{p.urun_tip}</td>
                    <td className="border p-2">{p.birim}</td>
                    <td className="border p-2">{p.fiyat}</td>
                    <td className="border p-2">{p.toplam}</td>
                  </tr>
                ))}
                {Object.entries(parts.optional).map(([key, items]) =>
                  selectedExtras[key]
                    ? items.map((p, idx) => (
                        <tr key={`${key}-${idx}`}>
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

            <div className="text-2xl font-bold text-center mb-6">
              Toplam Tutar: {calculateTotal()} TL (KDV Dahil)
            </div>

            <div className="extras flex justify-center gap-4 mb-6">
              {["balata", "disk", "silecek"].map((opt) => (
                <label key={opt} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedExtras[opt]}
                    onChange={() => setSelectedExtras((prev) => ({ ...prev, [opt]: !prev[opt] }))}
                  />
                  {opt.toUpperCase()}
                </label>
              ))}
            </div>

            <div className="flex flex-col items-center mb-6 gap-4">
              <input
                type="text"
                name="adSoyad"
                placeholder="Ad Soyad"
                value={formData.adSoyad}
                onChange={(e) => setFormData((prev) => ({ ...prev, adSoyad: e.target.value }))}
                className="border p-2 rounded w-full max-w-md"
                required
              />
              <input
                type="text"
                name="plaka"
                placeholder="Plaka"
                value={formData.plaka}
                onChange={(e) => setFormData((prev) => ({ ...prev, plaka: e.target.value }))}
                className="border p-2 rounded w-full max-w-md"
                required
              />
              <button onClick={handleGeneratePdf} className="button w-full max-w-md">
                📄 Teklifi PDF Olarak İndir
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
