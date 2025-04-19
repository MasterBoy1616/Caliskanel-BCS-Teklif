import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminPanel = () => {
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [parts, setParts] = useState(null);
  const [percentage, setPercentage] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");

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

  const handleUpdatePrices = async () => {
    if (!parts) return;
    try {
      const updatedParts = { ...parts };
      updatedParts.baseParts.forEach(p => {
        p.fiyat = Math.round(p.fiyat * (1 + percentage / 100));
        p.toplam = p.fiyat * p.birim;
      });
      Object.values(updatedParts.optional).forEach(optArray =>
        optArray.forEach(p => {
          p.fiyat = Math.round(p.fiyat * (1 + percentage / 100));
          p.toplam = p.fiyat * p.birim;
        })
      );
      updatedParts.labor.fiyat = Math.round(updatedParts.labor.fiyat * (1 + percentage / 100));
      updatedParts.labor.toplam = updatedParts.labor.fiyat * updatedParts.labor.birim;

      await axios.post("/api/save-prices", updatedParts);
      setSuccessMessage("✅ Fiyatlar başarıyla güncellendi!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      console.error(error);
      setSuccessMessage("❌ Fiyat kaydederken hata oluştu.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>

      <div className="flex gap-4 mb-6">
        <select
          value={selectedBrand}
          onChange={(e) => { setSelectedBrand(e.target.value); setSelectedModel(""); setParts(null); }}
          className="border p-2 rounded"
        >
          <option value="">Marka Seç</option>
          {brands.map((b, i) => <option key={i} value={b}>{b}</option>)}
        </select>

        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          disabled={!selectedBrand}
          className="border p-2 rounded"
        >
          <option value="">Model Seç</option>
          {models.map((m, i) => <option key={i} value={m}>{m}</option>)}
        </select>
      </div>

      {parts && (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border mb-6">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Kategori</th>
                <th className="p-2 border">Ürün</th>
                <th className="p-2 border">Birim</th>
                <th className="p-2 border">Fiyat</th>
                <th className="p-2 border">Toplam</th>
              </tr>
            </thead>
            <tbody>
              {parts.baseParts.map((p, i) => (
                <tr key={i}>
                  <td className="p-2 border">{p.kategori}</td>
                  <td className="p-2 border">{p.urun_tip}</td>
                  <td className="p-2 border">{p.birim}</td>
                  <td className="p-2 border">{p.fiyat} TL</td>
                  <td className="p-2 border">{p.toplam} TL</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex items-center gap-4 mb-4">
            <input
              type="number"
              value={percentage}
              onChange={(e) => setPercentage(parseFloat(e.target.value))}
              className="border p-2 w-20"
              placeholder="% Artış"
            />
            <button onClick={handleUpdatePrices} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              Fiyatları Kaydet
            </button>
          </div>

          {successMessage && (
            <div className="text-green-600 font-semibold">{successMessage}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
