import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminPanel = () => {
  const [fiyatlar, setFiyatlar] = useState([]);
  const [oran, setOran] = useState(0);

  useEffect(() => {
    fetchFiyatlar();
  }, []);

  const fetchFiyatlar = async () => {
    try {
      const res = await axios.get("/api/brands");
      setFiyatlar(res.data || []);
    } catch (error) {
      console.error("Fiyatları alırken hata oluştu:", error);
    }
  };

  const handleOranChange = (e) => {
    setOran(parseFloat(e.target.value));
  };

  const handleApplyOran = () => {
    const guncellenmisFiyatlar = fiyatlar.map((item) => ({
      ...item,
      fiyat: (item.fiyat * (1 + oran / 100)).toFixed(2),
    }));
    setFiyatlar(guncellenmisFiyatlar);
  };

  const handleSave = async () => {
    try {
      await axios.post("/api/update-prices", fiyatlar);
      alert("✅ Fiyatlar başarıyla kaydedildi!");
    } catch (error) {
      console.error("Fiyat kaydederken hata:", error);
      alert("❌ Fiyatlar kaydedilemedi!");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Admin Panel - Fiyat Düzenleme</h2>

      <div className="flex gap-4 mb-4">
        <input
          type="number"
          value={oran}
          onChange={handleOranChange}
          placeholder="% Artış/İndirim"
          className="border p-2 rounded w-40"
        />
        <button
          onClick={handleApplyOran}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Oranı Uygula
        </button>
        <button
          onClick={handleSave}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Kaydet
        </button>
      </div>

      <table className="w-full border-collapse mt-6">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Parça/Kategori</th>
            <th className="border p-2">Fiyat (TL)</th>
          </tr>
        </thead>
        <tbody>
          {fiyatlar.map((item, index) => (
            <tr key={index}>
              <td className="border p-2">{item}</td>
              <td className="border p-2">{/* Buraya detaylı fiyat bilgileri eklenecek */}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;
