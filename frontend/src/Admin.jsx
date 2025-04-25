import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaClipboardList, FaCalendarCheck } from "react-icons/fa";

const AdminPanel = () => {
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [parts, setParts] = useState(null);
  const [fiyatBakmaCount, setFiyatBakmaCount] = useState(0);
  const [randevuCount, setRandevuCount] = useState(0);
  const [randevular, setRandevular] = useState([]);
  const [selectedRandevular, setSelectedRandevular] = useState([]);

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

  const handleSelect = (index) => {
    setSelectedRandevular((prev) =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  const handleTopluOnayla = () => {
    selectedRandevular.forEach(i => {
      randevular[i].durum = "Onaylandı";
    });
    setRandevular([...randevular]);
    setSelectedRandevular([]);
  };

  const handleTopluSil = () => {
    const yeniListe = randevular.filter((_, i) => !selectedRandevular.includes(i));
    setRandevular(yeniListe);
    setSelectedRandevular([]);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">Admin Panel</h2>

      {/* Sayaçlar */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="flex items-center bg-blue-100 p-6 rounded-lg shadow">
          <FaClipboardList className="text-4xl mr-4 text-blue-600" />
          <div>
            <h3 className="text-lg font-semibold">Fiyat Sorgulama Sayısı</h3>
            <p className="text-2xl">{fiyatBakmaCount}</p>
          </div>
        </div>
        <div className="flex items-center bg-green-100 p-6 rounded-lg shadow">
          <FaCalendarCheck className="text-4xl mr-4 text-green-600" />
          <div>
            <h3 className="text-lg font-semibold">Alınan Randevular</h3>
            <p className="text-2xl">{randevuCount}</p>
          </div>
        </div>
      </div>

      {/* Marka-Model Seçimi */}
      <div className="flex gap-4 mb-8">
        <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)} className="border p-2 rounded w-1/2">
          <option value="">Marka Seç</option>
          {brands.map((b, i) => <option key={i} value={b}>{b}</option>)}
        </select>

        <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} disabled={!selectedBrand} className="border p-2 rounded w-1/2">
          <option value="">Model Seç</option>
          {models.map((m, i) => <option key={i} value={m}>{m}</option>)}
        </select>
      </div>

      {/* Fiyat Tablosu */}
      {parts && (
        <div className="overflow-x-auto mb-10">
          <h3 className="text-xl font-bold mb-2">Parça Listesi</h3>
          <table className="min-w-full table-auto border mb-4">
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
              <tr className="font-bold">
                <td className="p-2 border">{parts.labor.kategori}</td>
                <td className="p-2 border">{parts.labor.urun_tip}</td>
                <td className="p-2 border">{parts.labor.birim}</td>
                <td className="p-2 border">{parts.labor.fiyat} TL</td>
                <td className="p-2 border">{parts.labor.toplam} TL</td>
              </tr>
            </tbody>
          </table>

          <h3 className="text-lg font-bold">Toplam: {calculateTotal()} TL</h3>
        </div>
      )}

      {/* Randevu Listesi */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Randevu Yönetimi</h2>

        {randevular.length === 0 ? (
          <p>Henüz randevu alınmamış.</p>
        ) : (
          <>
            <div className="flex gap-4 mb-4">
              <button onClick={handleTopluOnayla} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
                Seçilenleri Onayla
              </button>
              <button onClick={handleTopluSil} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
                Seçilenleri Sil
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full table-auto border">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-2 border"></th>
                    <th className="p-2 border">Ad Soyad</th>
                    <th className="p-2 border">Telefon</th>
                    <th className="p-2 border">Plaka</th>
                    <th className="p-2 border">Araç</th>
                    <th className="p-2 border">Randevu Tarihi</th>
                    <th className="p-2 border">Durum</th>
                  </tr>
                </thead>
                <tbody>
                  {randevular.map((r, i) => (
                    <tr key={i}>
                      <td className="p-2 border">
                        <input type="checkbox" checked={selectedRandevular.includes(i)} onChange={() => handleSelect(i)} />
                      </td>
                      <td className="p-2 border">{r.adSoyad}</td>
                      <td className="p-2 border">{r.telefon}</td>
                      <td className="p-2 border">{r.plaka}</td>
                      <td className="p-2 border">{r.arac}</td>
                      <td className="p-2 border">{r.randevuTarihi.replace("T", " ")}</td>
                      <td className="p-2 border">{r.durum}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
