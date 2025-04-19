import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminPanel = () => {
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [parts, setParts] = useState(null);
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
      axios.get(`/api/parts?brand=${selectedBrand}&model=${selectedModel}`).then((res) => setParts(res.data));
    }
  }, [selectedBrand, selectedModel]);

  const handleSave = async () => {
    try {
      const updatedData = {
        baseParts: parts.baseParts,
        optional: parts.optional,
        labor: parts.labor
      };
      await axios.post("/api/save-prices", updatedData);
      setSuccessMessage("Fiyatlar başarıyla kaydedildi ✅");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setSuccessMessage("Fiyat kaydederken hata oluştu ❌");
      setTimeout(() => setSuccessMessage(""), 3000);
    }
  };

  const handleInputChange = (section, index, field, value) => {
    const updated = { ...parts };
    if (section === "baseParts") {
      updated.baseParts[index][field] = value;
      updated.baseParts[index].toplam = Math.round(updated.baseParts[index].birim * updated.baseParts[index].fiyat);
    } else if (section === "optional") {
      const [key, idx] = index;
      updated.optional[key][idx][field] = value;
      updated.optional[key][idx].toplam = Math.round(updated.optional[key][idx].birim * updated.optional[key][idx].fiyat);
    } else if (section === "labor") {
      updated.labor[field] = value;
      updated.labor.toplam = Math.round(updated.labor.birim * updated.labor.fiyat);
    }
    setParts(updated);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold mb-6 text-blue-700">Admin Panel - Fiyat Yönetimi</h2>

      <div className="flex gap-4 mb-8">
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
          className="border p-2 rounded w-1/2"
        >
          <option value="">Model Seç</option>
          {models.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      {parts && (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto mb-8 border">
            <thead>
              <tr className="bg-blue-100">
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
                  <td className="p-2 border">
                    <input
                      type="number"
                      value={p.birim}
                      onChange={(e) => handleInputChange("baseParts", i, "birim", parseFloat(e.target.value))}
                      className="w-20 border p-1"
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="number"
                      value={p.fiyat}
                      onChange={(e) => handleInputChange("baseParts", i, "fiyat", parseFloat(e.target.value))}
                      className="w-24 border p-1"
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
                    <td className="p-2 border">
                      <input
                        type="number"
                        value={p.birim}
                        onChange={(e) => handleInputChange("optional", [key, i], "birim", parseFloat(e.target.value))}
                        className="w-20 border p-1"
                      />
                    </td>
                    <td className="p-2 border">
                      <input
                        type="number"
                        value={p.fiyat}
                        onChange={(e) => handleInputChange("optional", [key, i], "fiyat", parseFloat(e.target.value))}
                        className="w-24 border p-1"
                      />
                    </td>
                    <td className="p-2 border">{p.toplam} TL</td>
                  </tr>
                ))
              )}

              <tr className="font-bold bg-gray-100">
                <td className="p-2 border">{parts.labor.kategori}</td>
                <td className="p-2 border">{parts.labor.urun_tip}</td>
                <td className="p-2 border">
                  <input
                    type="number"
                    value={parts.labor.birim}
                    onChange={(e) => handleInputChange("labor", null, "birim", parseFloat(e.target.value))}
                    className="w-20 border p-1"
                  />
                </td>
                <td className="p-2 border">
                  <input
                    type="number"
                    value={parts.labor.fiyat}
                    onChange={(e) => handleInputChange("labor", null, "fiyat", parseFloat(e.target.value))}
                    className="w-24 border p-1"
                  />
                </td>
                <td className="p-2 border">{parts.labor.toplam} TL</td>
              </tr>
            </tbody>
          </table>

          <button
            onClick={handleSave}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded shadow"
          >
            Kaydet
          </button>

          {successMessage && (
            <div className="mt-4 text-center text-green-600 font-semibold">
              {successMessage}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
