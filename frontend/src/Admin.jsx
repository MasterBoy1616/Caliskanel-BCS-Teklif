import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminPanel = () => {
  const [randevular, setRandevular] = useState([]);
  const [fiyatSayisi, setFiyatSayisi] = useState(0);
  const [randevuSayisi, setRandevuSayisi] = useState(0);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [parts, setParts] = useState(null);

  useEffect(() => {
    fetchLogs();
    fetchBrands();
  }, []);

  const fetchLogs = async () => {
    const fiyatResponse = await axios.get("/api/log/fiyatbakmasayisi");
    const randevuResponse = await axios.get("/api/log/randevusayisi");
    setFiyatSayisi(fiyatResponse.data.adet);
    setRandevuSayisi(randevuResponse.data.adet);
  };

  const fetchBrands = async () => {
    const res = await axios.get("/api/brands");
    setBrands(res.data);
  };

  const fetchModels = async (brand) => {
    const res = await axios.get(`/api/models?brand=${brand}`);
    setModels(res.data);
  };

  const fetchParts = async () => {
    if (!selectedBrand || !selectedModel) return;
    const res = await axios.get(`/api/parts?brand=${selectedBrand}&model=${selectedModel}`);
    setParts(res.data);
  };

  const handleSave = async () => {
    try {
      await axios.post("/api/save-prices", parts);
      alert("✅ Fiyatlar başarıyla kaydedildi!");
    } catch (err) {
      console.error(err);
      alert("❌ Kaydetme sırasında hata oluştu.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Admin Paneli</h2>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="bg-blue-100 p-4 rounded shadow text-center">
          <h3 className="text-xl font-bold">Toplam Fiyat Bakma</h3>
          <p className="text-3xl">{fiyatSayisi}</p>
        </div>
        <div className="bg-green-100 p-4 rounded shadow text-center">
          <h3 className="text-xl font-bold">Toplam Randevu Talebi</h3>
          <p className="text-3xl">{randevuSayisi}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-2xl font-bold mb-4">Fiyat Güncelleme</h3>

        <div className="flex gap-4 mb-4">
          <select
            className="border p-2 rounded w-1/2"
            value={selectedBrand}
            onChange={(e) => {
              setSelectedBrand(e.target.value);
              setSelectedModel("");
              setParts(null);
              fetchModels(e.target.value);
            }}
          >
            <option value="">Marka Seç</option>
            {brands.map((brand, idx) => (
              <option key={idx} value={brand}>
                {brand}
              </option>
            ))}
          </select>

          <select
            className="border p-2 rounded w-1/2"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            disabled={!selectedBrand}
          >
            <option value="">Model Seç</option>
            {models.map((model, idx) => (
              <option key={idx} value={model}>
                {model}
              </option>
            ))}
          </select>

          <button
            onClick={fetchParts}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Getir
          </button>
        </div>

        {parts && (
          <>
            <table className="w-full border-collapse mb-4">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border p-2">Kategori</th>
                  <th className="border p-2">Ürün</th>
                  <th className="border p-2">Adet</th>
                  <th className="border p-2">Fiyat (₺)</th>
                </tr>
              </thead>
              <tbody>
                {parts.baseParts.map((part, idx) => (
                  <tr key={idx}>
                    <td className="border p-2">{part.kategori}</td>
                    <td className="border p-2">{part.urun_tip}</td>
                    <td className="border p-2">{part.birim}</td>
                    <td className="border p-2">{part.fiyat}</td>
                  </tr>
                ))}
                {Object.keys(parts.optional).map((key) =>
                  parts.optional[key].map((part, idx) => (
                    <tr key={`${key}-${idx}`}>
                      <td className="border p-2">{part.kategori}</td>
                      <td className="border p-2">{part.urun_tip}</td>
                      <td className="border p-2">{part.birim}</td>
                      <td className="border p-2">{part.fiyat}</td>
                    </tr>
                  ))
                )}
                <tr>
                  <td className="border p-2">{parts.labor.kategori}</td>
                  <td className="border p-2">{parts.labor.urun_tip}</td>
                  <td className="border p-2">{parts.labor.birim}</td>
                  <td className="border p-2">{parts.labor.fiyat}</td>
                </tr>
              </tbody>
            </table>

            <button
              onClick={handleSave}
              className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              Fiyatları Kaydet
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
