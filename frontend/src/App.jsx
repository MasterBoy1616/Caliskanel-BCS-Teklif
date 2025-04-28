import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [parts, setParts] = useState(null);

  useEffect(() => {
    axios.get("/api/brands").then((response) => {
      setBrands(response.data);
    });
  }, []);

  useEffect(() => {
    if (selectedBrand) {
      axios.get(`/api/models?brand=${selectedBrand}`).then((response) => {
        setModels(response.data);
      });
    }
  }, [selectedBrand]);

  useEffect(() => {
    if (selectedBrand && selectedModel) {
      axios.get(`/api/parts?brand=${selectedBrand}&model=${selectedModel}`).then((response) => {
        setParts(response.data);
      });
    }
  }, [selectedBrand, selectedModel]);

  const calculateTotal = () => {
    if (!parts) return 0;
    let total = 0;
    parts.baseParts.forEach(p => total += p.toplam);
    if (parts.labor) total += parts.labor.toplam;
    return total;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-800 via-indigo-700 to-blue-600 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Çalışkanel BCS Periyodik Bakım Fiyat Sorgulama
        </h1>

        <div className="space-y-4">
          <select
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">Marka Seçin</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>

          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
          >
            <option value="">Model Seçin</option>
            {models.map((model) => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>
        </div>

        {parts && (
          <div className="mt-8">
            <div className="grid grid-cols-3 gap-2 font-semibold text-gray-700 mb-2">
              <span>Kategori</span>
              <span>Ürün</span>
              <span className="text-right">Toplam</span>
            </div>
            {parts.baseParts.map((part, index) => (
              <div key={index} className="grid grid-cols-3 gap-2 text-sm py-1 border-b">
                <span>{part.kategori}</span>
                <span>{part.urun_tip}</span>
                <span className="text-right">{part.toplam} TL</span>
              </div>
            ))}
            <div className="grid grid-cols-3 gap-2 font-bold text-gray-900 mt-4">
              <span>İşçilik</span>
              <span>Periyodik Bakım</span>
              <span className="text-right">{parts.labor?.toplam || 0} TL</span>
            </div>

            <div className="text-xl font-bold text-center text-green-600 mt-6">
              Toplam: {calculateTotal()} TL (+ KDV)
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
