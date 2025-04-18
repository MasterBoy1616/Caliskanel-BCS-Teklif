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
  const [message, setMessage] = useState("");

  const [yuzde, setYuzde] = useState(0);
  const [islem, setIslem] = useState("arttir"); // arttir veya azalt

  useEffect(() => {
    axios.get("/api/brands").then((res) => setBrands(res.data));
    axios.get("/api/log/fiyatbakmasayisi").then((res) => setFiyatBakmaCount(res.data.adet));
    axios.get("/api/log/randevusayisi").then((res) => setRandevuCount(res.data.adet));
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
          const updated = {
            ...res.data,
            baseParts: res.data.baseParts.map(p => ({ ...p })),
            optional: Object.fromEntries(
              Object.entries(res.data.optional).map(([k, arr]) => [
                k,
                arr.map(p => ({ ...p }))
              ])
            ),
            labor: { ...res.data.labor }
          };
          setParts(updated);
        });
    }
  }, [selectedBrand, selectedModel]);

  const handleFiyatChange = (section, index, value, key) => {
    setParts(prev => {
      const updated = { ...prev };
      if (section === "baseParts") {
        updated.baseParts[index][key] = parseFloat(value) || 0;
      } else if (section === "optional") {
        const [k, i] = index.split("-");
        updated.optional[k][i][key] = parseFloat(value) || 0;
      } else if (section === "labor") {
        updated.labor[key] = parseFloat(value) || 0;
      }
      return updated;
    });
  };

  const handleTopluGuncelle = () => {
    if (!parts) return;
    setParts(prev => {
      const katsayi = 1 + (parseFloat(yuzde) / 100) * (islem === "arttir" ? 1 : -1);
      const updated = { ...prev };

      updated.baseParts = updated.baseParts.map(p => ({
        ...p,
        fiyat: Math.round(p.fiyat * katsayi),
        toplam: Math.round(p.toplam * katsayi)
      }));

      for (const key in updated.optional) {
        updated.optional[key] = updated.optional[key].map(p => ({
          ...p,
          fiyat: Math.round(p.fiyat * katsayi),
          toplam: Math.round(p.toplam * katsayi)
        }));
      }

      updated.labor.fiyat = Math.round(updated.labor.fiyat * katsayi);
      updated.labor.toplam = Math.round(updated.labor.toplam * katsayi);

      return updated;
    });
  };

  const handleKaydet = () => {
    axios.post("/api/update-prices", parts)
      .then(() => setMessage("Fiyatlar başarıyla güncellendi ✅"))
      .catch(() => setMessage("Fiyat kaydederken hata oluştu ❌"));
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Admin Panel - Fiyat Takibi</h2>

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

      {/* Yüzde İşlemleri */}
      {parts && (
        <div className="flex gap-4 items-center mb-6">
          <input
            type="number"
            value={yuzde}
            onChange={(e) => setYuzde(e.target.value)}
            className="border p-2 rounded w-24"
            placeholder="% oran"
          />
          <select value={islem} onChange={(e) => setIslem(e.target.value)} className="border p-2 rounded">
            <option value="arttir">Yüzde Arttır</option>
            <option value="azalt">Yüzde Azalt</option>
          </select>
          <button onClick={handleTopluGuncelle} className="bg-blue-600 text-white p-2 rounded">
            Toplu Güncelle
          </button>
          <button onClick={handleKaydet} className="bg-green-600 text-white p-2 rounded">
            Kaydet
          </button>
        </div>
      )}

      {/* Mesaj Alanı */}
      {message && (
        <div className="bg-yellow-100 p-2 rounded mb-4">{message}</div>
      )}

      {/* Fiyat Listesi */}
      {parts && (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Kategori</th>
                <th className="p-2 border">Ürün/TİP</th>
                <th className="p-2 border">Birim</th>
                <th className="p-2 border">Fiyat (TL)</th>
                <th className="p-2 border">Toplam (TL)</th>
              </tr>
            </thead>
            <tbody>
              {parts.baseParts.map((p, i) => (
                <tr key={i}>
                  <td className="p-2 border">{p.kategori}</td>
                  <td className="p-2 border">{p.urun_tip}</td>
                  <td className="p-2 border">{p.birim}</td>
                  <td className="p-2 border">
                    <input type="number" value={p.fiyat} onChange={(e) => handleFiyatChange("baseParts", i, e.target.value, "fiyat")} className="w-20 border rounded" />
                  </td>
                  <td className="p-2 border">
                    <input type="number" value={p.toplam} onChange={(e) => handleFiyatChange("baseParts", i, e.target.value, "toplam")} className="w-24 border rounded" />
                  </td>
                </tr>
              ))}
              {Object.entries(parts.optional).map(([key, arr]) => arr.map((p, i) => (
                <tr key={`${key}-${i}`}>
                  <td className="p-2 border">{p.kategori}</td>
                  <td className="p-2 border">{p.urun_tip}</td>
                  <td className="p-2 border">{p.birim}</td>
                  <td className="p-2 border">
                    <input type="number" value={p.fiyat} onChange={(e) => handleFiyatChange("optional", `${key}-${i}`, e.target.value, "fiyat")} className="w-20 border rounded" />
                  </td>
                  <td className="p-2 border">
                    <input type="number" value={p.toplam} onChange={(e) => handleFiyatChange("optional", `${key}-${i}`, e.target.value, "toplam")} className="w-24 border rounded" />
                  </td>
                </tr>
              )))}
              <tr className="font-semibold">
                <td className="p-2 border">{parts.labor.kategori}</td>
                <td className="p-2 border">{parts.labor.urun_tip}</td>
                <td className="p-2 border">{parts.labor.birim}</td>
                <td className="p-2 border">
                  <input type="number" value={parts.labor.fiyat} onChange={(e) => handleFiyatChange("labor", "", e.target.value, "fiyat")} className="w-20 border rounded" />
                </td>
                <td className="p-2 border">
                  <input type="number" value={parts.labor.toplam} onChange={(e) => handleFiyatChange("labor", "", e.target.value, "toplam")} className="w-24 border rounded" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
