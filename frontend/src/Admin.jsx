// frontend/src/Admin.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminPanel = () => {
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [parts, setParts] = useState(null);
  const [message, setMessage] = useState("");
  const [parcaYuzde, setParcaYuzde] = useState(0);
  const [iscilikYuzde, setIscilikYuzde] = useState(0);

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
        .then((res) => setParts(res.data));
    }
  }, [selectedBrand, selectedModel]);

  const handleInputChange = (type, index, field, value, isOptional = false, optionalKey = "") => {
    setParts(prev => {
      const updated = { ...prev };
      if (isOptional) {
        updated.optional[optionalKey][index][field] = parseFloat(value) || 0;
        updated.optional[optionalKey][index].toplam = Math.round(updated.optional[optionalKey][index].fiyat * updated.optional[optionalKey][index].birim);
      } else if (type === "base") {
        updated.baseParts[index][field] = parseFloat(value) || 0;
        updated.baseParts[index].toplam = Math.round(updated.baseParts[index].fiyat * updated.baseParts[index].birim);
      } else if (type === "labor") {
        updated.labor[field] = parseFloat(value) || 0;
        updated.labor.toplam = Math.round(updated.labor.fiyat * updated.labor.birim);
      }
      return updated;
    });
  };

  const handleTopluArttir = (type) => {
    setParts(prev => {
      const updated = { ...prev };
      const oran = type === "parca" ? parseFloat(parcaYuzde) : parseFloat(iscilikYuzde);

      if (type === "parca") {
        updated.baseParts = updated.baseParts.map(p => ({
          ...p,
          fiyat: Math.round(p.fiyat * (1 + oran / 100)),
          toplam: Math.round(p.birim * p.fiyat * (1 + oran / 100))
        }));

        Object.keys(updated.optional).forEach(opt => {
          updated.optional[opt] = updated.optional[opt].map(p => ({
            ...p,
            fiyat: Math.round(p.fiyat * (1 + oran / 100)),
            toplam: Math.round(p.birim * p.fiyat * (1 + oran / 100))
          }));
        });
      } else if (type === "iscilik") {
        updated.labor.fiyat = Math.round(updated.labor.fiyat * (1 + oran / 100));
        updated.labor.toplam = Math.round(updated.labor.fiyat * updated.labor.birim);
      }

      return updated;
    });
  };

const handleSave = async () => {
  try {
    await axios.post("/api/save-prices", parts);
    setMessage("Fiyatlar başarıyla kaydedildi ✅");
  } catch (error) {
    console.error(error);
    setMessage("Fiyat kaydederken hata oluştu ❌");
  }
  setTimeout(() => setMessage(""), 3000);
};


  const calculateTotal = () => {
    if (!parts) return 0;
    let total = 0;
    parts.baseParts.forEach(p => total += p.toplam);
    Object.keys(parts.optional).forEach(key => {
      parts.optional[key].forEach(p => total += p.toplam);
    });
    total += parts.labor.toplam;
    return total;
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Admin Panel - Fiyat Yönetimi</h2>

      {/* Marka/Model Seçimi */}
      <div className="flex gap-4 mb-6">
        <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)} className="border p-2 rounded">
          <option value="">Marka Seç</option>
          {brands.map((b, i) => <option key={i} value={b}>{b}</option>)}
        </select>

        <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} className="border p-2 rounded" disabled={!selectedBrand}>
          <option value="">Model Seç</option>
          {models.map((m, i) => <option key={i} value={m}>{m}</option>)}
        </select>
      </div>

      {/* Toplu Yüzde Artırma */}
      <div className="flex gap-4 mb-6">
        <input
          type="number"
          placeholder="Parça Yüzdesi"
          className="border p-2 rounded"
          value={parcaYuzde}
          onChange={(e) => setParcaYuzde(e.target.value)}
        />
        <button
          onClick={() => handleTopluArttir("parca")}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
        >
          Parçaları Artır
        </button>

        <input
          type="number"
          placeholder="İşçilik Yüzdesi"
          className="border p-2 rounded"
          value={iscilikYuzde}
          onChange={(e) => setIscilikYuzde(e.target.value)}
        />
        <button
          onClick={() => handleTopluArttir("iscilik")}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
        >
          İşçilikleri Artır
        </button>
      </div>

      {/* Tablo */}
      {parts && (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border">Kategori</th>
                  <th className="p-2 border">Ürün/TİP</th>
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
                    <td className="p-2 border">
                      <input
                        type="number"
                        value={p.fiyat}
                        onChange={(e) => handleInputChange("base", i, "fiyat", e.target.value)}
                        className="border p-1 w-20"
                      />
                    </td>
                    <td className="p-2 border">{p.toplam} TL</td>
                  </tr>
                ))}
                {Object.entries(parts.optional).map(([key, items]) =>
                  items.map((p, i) => (
                    <tr key={`${key}-${i}`}>
                      <td className="p-2 border">{p.kategori}</td>
                      <td className="p-2 border">{p.urun_tip}</td>
                      <td className="p-2 border">{p.birim}</td>
                      <td className="p-2 border">
                        <input
                          type="number"
                          value={p.fiyat}
                          onChange={(e) => handleInputChange("optional", i, "fiyat", e.target.value, true, key)}
                          className="border p-1 w-20"
                        />
                      </td>
                      <td className="p-2 border">{p.toplam} TL</td>
                    </tr>
                  ))
                )}
                <tr className="font-semibold">
                  <td className="p-2 border">{parts.labor.kategori}</td>
                  <td className="p-2 border">{parts.labor.urun_tip}</td>
                  <td className="p-2 border">{parts.labor.birim}</td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      value={parts.labor.fiyat}
                      onChange={(e) => handleInputChange("labor", 0, "fiyat", e.target.value)}
                      className="border p-1 w-20"
                    />
                  </td>
                  <td className="p-2 border">{parts.labor.toplam} TL</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Kaydet Butonu */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSave}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded"
            >
              Fiyatları Kaydet
            </button>
          </div>

          {/* Bilgilendirme Mesajı */}
          {message && (
            <div className="mt-4 text-green-600 text-center font-bold">
              {message}
            </div>
          )}

          <h3 className="mt-8 text-lg font-bold">Toplam: {calculateTotal()} TL</h3>
        </>
      )}
    </div>
  );
};

export default AdminPanel;
