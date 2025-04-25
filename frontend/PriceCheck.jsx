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
    }
  }, [selectedBrand]);

  useEffect(() => {
    if (selectedBrand && selectedModel) {
      axios
        .get(`/api/parts?brand=${selectedBrand}&model=${selectedModel}`)
        .then((res) => setParts(res.data));
    }
  }, [selectedBrand, selectedModel]);

  const totalPrice = parts
    ? [...parts.baseParts, ...Object.values(parts.optional).flat(), parts.labor].reduce(
        (sum, item) => sum + (item.toplam || 0),
        0
      )
    : 0;

  return (
    <div className="min-h-screen p-4 bg-gradient-to-b from-purple-800 to-indigo-900 text-white">
      <h1 className="text-2xl font-bold text-center mb-6">Periyodik Bakım Fiyat Sorgulama</h1>

      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-6">
        <select
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          className="p-2 rounded bg-white text-black"
        >
          <option value="">Marka Seç</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>

        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          disabled={!selectedBrand}
          className="p-2 rounded bg-white text-black"
        >
          <option value="">Model Seç</option>
          {models.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>
      </div>

      {parts && (
        <div className="bg-white text-black rounded-lg p-4 shadow-xl max-w-xl mx-auto">
          <h2 className="text-xl font-semibold mb-2 text-center">Parça Listesi</h2>
          <table className="w-full text-sm mb-4">
            <thead>
              <tr>
                <th className="text-left">Kategori</th>
                <th className="text-left">Ürün</th>
                <th className="text-right">Birim</th>
                <th className="text-right">Fiyat (TL)</th>
                <th className="text-right">Toplam (TL)</th>
              </tr>
            </thead>
            <tbody>
              {[...parts.baseParts, ...Object.values(parts.optional).flat(), parts.labor].map((item, idx) => (
                <tr key={idx}>
                  <td>{item.kategori}</td>
                  <td>{item.urun_tip}</td>
                  <td className="text-right">{item.birim}</td>
                  <td className="text-right">{item.fiyat}</td>
                  <td className="text-right">{item.toplam}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-right font-semibold text-indigo-800">
            Toplam: {totalPrice} TL (KDV Dahil)
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceCheck;
