import React, { useState, useEffect } from "react";
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
        
        // LocalStorage kaydet
        localStorage.setItem("selectedBrand", selectedBrand);
        localStorage.setItem("selectedModel", selectedModel);
      });

      // Fiyat bakma logu kaydet
      axios.post("/api/log/fiyatbakma");
    }
  }, [selectedBrand, selectedModel]);

  const calculateTotal = () => {
    if (!parts) return 0;
    let total = 0;
    parts.baseParts.forEach((p) => total += p.toplam);
    Object.keys(selectedExtras).forEach((key) => {
      if (selectedExtras[key]) {
        parts.optional[key].forEach((p) => total += p.toplam);
      }
    });
    total += parts.labor.toplam;
    return total;
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Periyodik Bakım Fiyat Sorgulama</h2>

      <div className="flex gap-4 mb-6">
        <select
          value={selectedBrand}
          onChange={(e) => {
            setSelectedBrand(e.target.value);
            setSelectedModel("");
            setParts(null);
          }}
          className="border p-2 rounded w-1/2"
        >
          <option value="">Marka Seç</option>
          {brands.map((brand, index) => (
            <option key={index} value={brand}>{brand}</option>
          ))}
        </select>

        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          disabled={!selectedBrand}
          className="border p-2 rounded w-1/2"
        >
          <option value="">Model Seç</option>
          {models.map((model, index) => (
            <option key={index} value={model}>{model}</option>
          ))}
        </select>
      </div>

      {parts && (
        <>
          <table className="w-full border-collapse mb-6">
            <thead>
              <tr className="bg-gray-200">
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
                selectedExtras[key] ? items.map((p, i) => (
                  <tr key={`${key}-${i}`}>
                    <td className="border p-2">{p.kategori}</td>
                    <td className="border p-2">{p.urun_tip}</td>
                    <td className="border p-2">{p.birim}</td>
                    <td className="border p-2">{p.fiyat}</td>
                    <td className="border p-2">{p.toplam}</td>
                  </tr>
                )) : null
              )}
              <tr className="font-semibold">
                <td className="border p-2">{parts.labor.kategori}</td>
                <td className="border p-2">{parts.labor.urun_tip}</td>
                <td className="border p-2">{parts.labor.birim}</td>
                <td className="border p-2">{parts.labor.fiyat}</td>
                <td className="border p-2">{parts.labor.toplam}</td>
              </tr>
            </tbody>
          </table>

          <div className="text-xl font-bold mb-4">
            Toplam: {calculateTotal()} TL (KDV Dahil)
          </div>

          <div className="flex gap-4 mt-4">
            {["balata", "disk", "silecek"].map((extra) => (
              <label key={extra} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedExtras[extra]}
                  onChange={() =>
                    setSelectedExtras(prev => ({ ...prev, [extra]: !prev[extra] }))
                  }
                />
                {extra.toUpperCase()}
              </label>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
