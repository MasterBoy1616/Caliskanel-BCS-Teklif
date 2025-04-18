// frontend/src/Admin.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminPanel = () => {
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [parts, setParts] = useState(null);
  const [fiyatBakmaCount, setFiyatBakmaCount] = useState(0);
  const [randevuCount, setRandevuCount] = useState(0);
  const [randevular, setRandevular] = useState([]);

  useEffect(() => {
    axios.get("/api/brands").then((res) => setBrands(res.data));
    axios.get("/api/log/fiyatbakmasayisi").then((res) => setFiyatBakmaCount(res.data.adet));
    axios.get("/api/log/randevusayisi").then((res) => setRandevuCount(res.data.adet));
    axios.get("/api/randevular").then((res) => 
      setRandevular(res.data.map(r => ({ ...r, durum: "Beklemede" })))
    );
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

  const handleOnayla = (index) => {
    setRandevular(prev =>
      prev.map((r, i) => (i === index ? { ...r, durum: "Onaylandı" } : r))
    );
  };

  const handleIptalEt = (index) => {
    setRandevular(prev =>
      prev.map((r, i) => (i === index ? { ...r, durum: "İptal Edildi" } : r))
    );
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Admin Panel - Fiyat Takibi</h2>

      {/* Seçim Alanı */}
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

      {/* Sayaçlar */}
      <div className="flex gap-8 mb-6">
        <div className="bg-blue-100 p-4 rounded shadow text-center">
          <h3 className="text-lg font-bold">Fiyat Sorgulama</h3>
          <p className="text-2xl">{fiyatBakmaCount}</p>
        </div>
        <div className="bg-green-100 p-4 rounded shadow text-center">
          <h3 className="text-lg font-bold">Randevu Alımı</h3>
          <p className="text-2xl">{randevuCount}</p>
        </div>
      </div>

      {/* Fiyat Listesi */}
      {parts && (
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
                  <td className="p-2 border">{p.fiyat} TL</td>
                  <td className="p-2 border">{p.toplam} TL</td>
                </tr>
              ))}
              {Object.entries(parts.optional).map(([key, items]) =>
                items.map((p, i) => (
                  <tr key={`${key}-${i}`}>
                    <td className="p-2 border">{p.kategori}</td>
                    <td className="p-2 border">{p.urun_tip}</td>
                    <td className="p-2 border">{p.birim}</td>
                    <td className="p-2 border">{p.fiyat} TL</td>
                    <td className="p-2 border">{p.toplam} TL</td>
                  </tr>
                ))
              )}
              <tr className="font-semibold">
                <td className="p-2 border">{parts.labor.kategori}</td>
                <td className="p-2 border">{parts.labor.urun_tip}</td>
                <td className="p-2 border">{parts.labor.birim}</td>
                <td className="p-2 border">{parts.labor.fiyat} TL</td>
                <td className="p-2 border">{parts.labor.toplam} TL</td>
              </tr>
            </tbody>
          </table>

          <h3 className="mt-6 text-lg font-bold">Toplam: {calculateTotal()} TL</h3>
        </div>
      )}

      {/* Randevu Listesi */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Gelen Randevular</h2>
        {randevular.length === 0 ? (
          <p>Henüz randevu alınmamış.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border">Ad Soyad</th>
                  <th className="p-2 border">Telefon</th>
                  <th className="p-2 border">Plaka</th>
                  <th className="p-2 border">Araç</th>
                  <th className="p-2 border">Randevu Tarihi</th>
                  <th className="p-2 border">Durum</th>
                  <th className="p-2 border">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {randevular.map((r, i) => (
                  <tr key={i}>
                    <td className="p-2 border">{r.adSoyad}</td>
                    <td className="p-2 border">{r.telefon}</td>
                    <td className="p-2 border">{r.plaka}</td>
                    <td className="p-2 border">{r.arac}</td>
                    <td className="p-2 border">{r.randevuTarihi.replace("T", " ")}</td>
                    <td className="p-2 border font-bold">{r.durum}</td>
                    <td className="p-2 border flex gap-2">
                      <button onClick={() => handleOnayla(i)} className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded">
                        Onayla
                      </button>
                      <button onClick={() => handleIptalEt(i)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded">
                        İptal Et
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminPanel;
