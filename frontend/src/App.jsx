// frontend/src/App.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [parts, setParts] = useState(null);

  useEffect(() => {
    axios.get("/api/brands").then((res) => setBrands(res.data));
  }, []);

  useEffect(() => {
    if (selectedBrand) {
      axios.get(`/api/models?brand=${selectedBrand}`).then((res) => setModels(res.data));
    } else {
      setModels([]);
    }
  }, [selectedBrand]);

  useEffect(() => {
    if (selectedBrand && selectedModel) {
      axios.get(`/api/parts?brand=${selectedBrand}&model=${selectedModel}`)
        .then((res) => setParts(res.data));
    } else {
      setParts(null);
    }
  }, [selectedBrand, selectedModel]);

  const calculateTotal = () => {
    if (!parts) return 0;
    let total = 0;
    parts.baseParts.forEach(p => total += p.toplam);
    total += parts.labor.toplam;
    return total;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-center">Periyodik Bakım Fiyat Sorgulama</h1>
        <div className="flex flex-col md:flex-row md:space-x-4 mb-6">
          <select
            className="border p-2 rounded mb-4 md:mb-0 flex-1"
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
          >
            <option value="">Marka Seç</option>
            {brands.map((b, index) => (
              <option key={index} value={b}>{b}</option>
            ))}
          </select>
          <select
            className="border p-2 rounded flex-1"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            disabled={!selectedBrand}
          >
            <option value="">Model Seç</option>
            {models.map((m, index) => (
              <option key={index} value={m}>{m}</option>
            ))}
          </select>
        </div>

        {parts && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="bg-gray-200">
                  <th className="text-left p-2">Kategori</th>
                  <th className="text-left p-2">Ürün</th>
                  <th className="text-center p-2">Birim</th>
                  <th className="text-center p-2">Fiyat (TL)</th>
                  <th className="text-center p-2">Toplam (TL)</th>
                </tr>
              </thead>
              <tbody>
                {parts.baseParts.map((p, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-2">{p.kategori}</td>
                    <td className="p-2">{p.urun_tip}</td>
                    <td className="p-2 text-center">{p.birim}</td>
                    <td className="p-2 text-center">{p.fiyat}</td>
                    <td className="p-2 text-center">{p.toplam}</td>
                  </tr>
                ))}
                <tr className="bg-gray-100 border-t">
                  <td className="p-2">{parts.labor.kategori}</td>
                  <td className="p-2">{parts.labor.urun_tip}</td>
                  <td className="p-2 text-center">{parts.labor.birim}</td>
                  <td className="p-2 text-center">{parts.labor.fiyat}</td>
                  <td className="p-2 text-center">{parts.labor.toplam}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {parts && (
          <div className="text-right text-xl font-bold mt-4">
            Toplam: {calculateTotal()} TL (KDV Dahil)
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
