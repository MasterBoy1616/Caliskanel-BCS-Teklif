import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminPanel = () => {
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [parts, setParts] = useState([]);
  const [optionalParts, setOptionalParts] = useState([]);
  const [labor, setLabor] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    axios.get("/api/brands").then((res) => setBrands(res.data));
  }, []);

  useEffect(() => {
    if (selectedBrand) {
      axios.get(`/api/models?brand=${selectedBrand}`).then((res) => setModels(res.data));
    }
  }, [selectedBrand]);

  const loadParts = () => {
    if (selectedBrand && selectedModel) {
      axios.get(`/api/parts?brand=${selectedBrand}&model=${selectedModel}`).then((res) => {
        setParts(res.data.baseParts || []);
        setOptionalParts([
          ...(res.data.optional.balata || []),
          ...(res.data.optional.disk || []),
          ...(res.data.optional.silecek || [])
        ]);
        setLabor(res.data.labor || {});
      });
    }
  };

  const handleChangePart = (index, field, value) => {
    const updated = [...parts];
    updated[index][field] = field === "birim" || field === "fiyat" ? parseFloat(value) : value;
    updated[index].toplam = updated[index].birim * updated[index].fiyat;
    setParts(updated);
  };

  const handleChangeOptional = (index, field, value) => {
    const updated = [...optionalParts];
    updated[index][field] = field === "birim" || field === "fiyat" ? parseFloat(value) : value;
    updated[index].toplam = updated[index].birim * updated[index].fiyat;
    setOptionalParts(updated);
  };

  const handleChangeLabor = (field, value) => {
    const updated = { ...labor };
    updated[field] = field === "birim" || field === "fiyat" ? parseFloat(value) : value;
    updated.toplam = updated.birim * updated.fiyat;
    setLabor(updated);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await axios.post("/api/save-prices", {
        brand: selectedBrand,
        model: selectedModel,
        parts,
        optionalParts,
        labor,
      });
      alert("Fiyatlar başarıyla kaydedildi ✅");
    } catch (error) {
      alert("Fiyat kaydedilemedi ❌");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>

      <div className="flex gap-4 mb-6">
        <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)} className="border p-2">
          <option value="">Marka Seç</option>
          {brands.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>

        <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} className="border p-2" disabled={!selectedBrand}>
          <option value="">Model Seç</option>
          {models.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>

        <button onClick={loadParts} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Yükle
        </button>
      </div>

      {(parts.length > 0 || optionalParts.length > 0) && (
        <>
          <table className="min-w-full mb-6">
            <thead>
              <tr>
                <th className="border p-2">Kategori</th>
                <th className="border p-2">Ürün/TİP</th>
                <th className="border p-2">Birim</th>
                <th className="border p-2">Fiyat (TL)</th>
                <th className="border p-2">Toplam (TL)</th>
              </tr>
            </thead>
            <tbody>
              {parts.map((p, i) => (
                <tr key={i}>
                  <td className="border p-2">{p.kategori}</td>
                  <td className="border p-2">{p.urun_tip}</td>
                  <td className="border p-2">
                    <input value={p.birim} onChange={(e) => handleChangePart(i, "birim", e.target.value)} className="border p-1 w-20" />
                  </td>
                  <td className="border p-2">
                    <input value={p.fiyat} onChange={(e) => handleChangePart(i, "fiyat", e.target.value)} className="border p-1 w-20" />
                  </td>
                  <td className="border p-2">{p.toplam}</td>
                </tr>
              ))}
              {optionalParts.map((p, i) => (
                <tr key={"opt-" + i}>
                  <td className="border p-2">{p.kategori}</td>
                  <td className="border p-2">{p.urun_tip}</td>
                  <td className="border p-2">
                    <input value={p.birim} onChange={(e) => handleChangeOptional(i, "birim", e.target.value)} className="border p-1 w-20" />
                  </td>
                  <td className="border p-2">
                    <input value={p.fiyat} onChange={(e) => handleChangeOptional(i, "fiyat", e.target.value)} className="border p-1 w-20" />
                  </td>
                  <td className="border p-2">{p.toplam}</td>
                </tr>
              ))}
              <tr className="bg-gray-100 font-bold">
                <td className="border p-2">{labor.kategori}</td>
                <td className="border p-2">{labor.urun_tip}</td>
                <td className="border p-2">
                  <input value={labor.birim} onChange={(e) => handleChangeLabor("birim", e.target.value)} className="border p-1 w-20" />
                </td>
                <td className="border p-2">
                  <input value={labor.fiyat} onChange={(e) => handleChangeLabor("fiyat", e.target.value)} className="border p-1 w-20" />
                </td>
                <td className="border p-2">{labor.toplam}</td>
              </tr>
            </tbody>
          </table>

          <button onClick={handleSave} disabled={saving} className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
            {saving ? "Kaydediliyor..." : "💾 Fiyatları Kaydet"}
          </button>
        </>
      )}
    </div>
  );
};

export default AdminPanel;
