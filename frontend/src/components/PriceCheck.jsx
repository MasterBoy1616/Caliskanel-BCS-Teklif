import React, { useState, useEffect } from "react";
import axios from "axios";

const PriceCheck = () => {
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
      setSelectedModel("");
    }
  }, [selectedBrand]);

  useEffect(() => {
    if (selectedBrand && selectedModel) {
      axios.get(`/api/parts?brand=${selectedBrand}&model=${selectedModel}`)
        .then((res) => setParts(res.data));
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
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">Periyodik Bakım Fiyat Sorgulama</h1>

      <div className="space-y-4">
        <select
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          className="w-full border rounded p-2"
        >
          <option value="">Marka Seç</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>

        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="w-full border rounded p-2"
          disabled={!selectedBrand}
        >
          <option value="">Model Seç</option>
          {models.map((model) => (
            <option key={model} value={model}>{model}</option>
          ))}
        </select>
      </div>

      {parts && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Parça Listesi</h2>
          <table className="w-full text-sm border border-collapse">
            <thead>
              <tr>
                <th className="border p-1">Kategori</th>
                <th className="border p-1">Ürün</th>
                <th className="border p-1">Birim</th>
                <th className="border p-1">Fiyat (TL)</th>
                <th className="border p-1">Toplam (TL)</th>
              </tr>
            </thead>
            <tbody>
              {parts.baseParts.map((part, index) => (
                <tr key={index}>
                  <td className="border p-1">{part.kategori}</td>
                  <td className="border p-1">{part.urun_tip}</td>
                  <td className="border p-1">{part.birim}</td>
                  <td className="border p-1">{part.fiyat}</td>
                  <td className="border p-1">{part.toplam}</td>
                </tr>
              ))}
              <tr>
                <td className="border p-1">{parts.labor.kategori}</td>
                <td className="border p-1">{parts.labor.urun_tip}</td>
                <td className="border p-1">{parts.labor.birim}</td>
                <td className="border p-1">{parts.labor.fiyat}</td>
                <td className="border p-1">{parts.labor.toplam}</td>
              </tr>
            </tbody>
          </table>

          <div className="text-right font-bold mt-4">Toplam: {calculateTotal()} TL</div>
        </div>
      )}
    </div>
  );
};

export default PriceCheck;
