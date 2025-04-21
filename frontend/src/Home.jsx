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
      axios.get(`/api/parts?brand=${selectedBrand}&model=${selectedModel}`).then((res) => {
        setParts(res.data);
      });
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

  const handleCreatePdf = () => {
    generatePdf(formData, selectedBrand, selectedModel, parts, selectedExtras);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Periyodik Bakım Fiyat Sorgulama</h2>

      <div className="selectors mb-4">
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

      <div className="mb-4">
        <input
          type="text"
          placeholder="Ad Soyad"
          value={formData.adSoyad}
          onChange={(e) => setFormData({ ...formData, adSoyad: e.target.value })}
          className="border p-2 rounded mr-2"
        />
        <input
          type="text"
          placeholder="Plaka"
          value={formData.plaka}
          onChange={(e) => setFormData({ ...formData, plaka: e.target.value })}
          className="border p-2 rounded"
        />
      </div>

      {parts && (
        <>
          <table className="w-full border-collapse mb-4">
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

          <div className="text-2xl font-bold mb-4 text-center">
            Toplam: {calculateTotal().toLocaleString()} TL (KDV Dahil)
          </div>

          <div className="extras flex gap-4 mb-4">
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

          <button onClick={handleCreatePdf} className="button">
            📄 Teklifi PDF Olarak Al
          </button>
        </>
      )}
    </div>
  );
};

export default Home;
