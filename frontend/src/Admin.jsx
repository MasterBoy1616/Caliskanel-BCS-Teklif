import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminPanel = () => {
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [parts, setParts] = useState([]);
  const [percentage, setPercentage] = useState(0);

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
      axios.get(`/api/parts?brand=${selectedBrand}&model=${selectedModel}`)
        .then((res) => {
          const allParts = [
            ...(res.data.baseParts || []),
            ...(res.data.optional?.balata || []),
            ...(res.data.optional?.disk || []),
            ...(res.data.optional?.silecek || []),
            res.data.labor
          ];
          setParts(allParts);
        });
    }
  }, [selectedBrand, selectedModel]);

  const handlePriceChange = (index, newPrice) => {
    const updatedParts = [...parts];
    updatedParts[index].fiyat = parseFloat(newPrice);
    updatedParts[index].toplam = Math.round(updatedParts[index].birim * updatedParts[index].fiyat);
    setParts(updatedParts);
  };

  const handleApplyPercentage = () => {
    const updatedParts = parts.map(part => ({
      ...part,
      fiyat: Math.round(part.fiyat * (1 + percentage / 100)),
      toplam: Math.round(part.birim * part.fiyat * (1 + percentage / 100))
    }));
    setParts(updatedParts);
  };

  const handleSave = () => {
    axios.post("/api/save-prices", parts)
      .then(() => alert("Fiyatlar başarıyla kaydedildi ✅"))
      .catch(() => alert("Hata: Fiyatlar kaydedilemedi ❌"));
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Admin Paneli - Fiyat Güncelleme</h1>

      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-6">
        <select
          value={selectedBrand}
          onChange={(e) => {
            setSelectedBrand(e.target.value);
            setSelectedModel("");
            setParts([]);
          }}
          className="border p-2 rounded"
        >
          <option value="">Marka Seç</option>
          {brands.map((b) => (
            <option key={b} value={b}>{b}</option>
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
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      {parts.length > 0 && (
        <>
          <div className="mb-4 flex gap-4 items-center justify-center">
            <input
              type="number"
              placeholder="Yüzde (%)"
              value={percentage}
              onChange={(e) => setPercentage(Number(e.target.value))}
              className="border p-2 rounded"
            />
            <button onClick={handleApplyPercentage} className="button bg-blue-500 text-white px-4 py-2 rounded">
              Yüzde Uygula
            </button>
            <button onClick={handleSave} className="button bg-green-600 text-white px-4 py-2 rounded">
              Kaydet
            </button>
          </div>

          <table className="w-full">
            <thead>
              <tr className="bg-gray-200">
                <th>Kategori</th>
                <th>Ürün</th>
                <th>Birim</th>
                <th>Fiyat (TL)</th>
                <th>Toplam (TL)</th>
              </tr>
            </thead>
            <tbody>
              {parts.map((p, i) => (
                <tr key={i}>
                  <td>{p.kategori}</td>
                  <td>{p.urun_tip}</td>
                  <td>{p.birim}</td>
                  <td>
                    <input
                      type="number"
                      value={p.fiyat}
                      onChange={(e) => handlePriceChange(i, e.target.value)}
                      className="border p-1 w-20 rounded"
                    />
                  </td>
                  <td>{p.toplam}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default AdminPanel;
