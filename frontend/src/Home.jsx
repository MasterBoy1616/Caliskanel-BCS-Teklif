import React, { useState, useEffect } from "react";
import axios from "axios";

const Home = () => {
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [parts, setParts] = useState(null);
  const [selectedExtras, setSelectedExtras] = useState({
    balata: false,
    disk: false,
    silecek: false,
  });
  const [formData, setFormData] = useState({
    adSoyad: "",
    telefon: "",
    plaka: "",
    randevuTarihi: "",
  });

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
      axios.post("/api/log/fiyatbakma").catch(() => {});
    }
  }, [selectedBrand, selectedModel]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const selectedParts = [
      ...parts.baseParts,
      ...(selectedExtras.balata ? parts.optional.balata : []),
      ...(selectedExtras.disk ? parts.optional.disk : []),
      ...(selectedExtras.silecek ? parts.optional.silecek : []),
      parts.labor
    ];
    try {
      await axios.post("/api/randevu", {
        ...formData,
        arac: `${selectedBrand} ${selectedModel}`,
        secilenParcalar: selectedParts
      });
      alert("Randevu oluşturuldu ✅");
    } catch {
      alert("Randevu oluşturulamadı ❌");
    }
  };

  const toplamFiyat = () => {
    if (!parts) return 0;
    let total = 0;
    parts.baseParts.forEach(p => total += p.toplam);
    Object.keys(selectedExtras).forEach(key => {
      if (selectedExtras[key]) {
        parts.optional[key].forEach(p => total += p.toplam);
      }
    });
    total += parts.labor.toplam;
    return total;
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Periyodik Bakım Fiyatı & Randevu</h1>

      <div className="flex gap-4 mb-6 justify-center">
        <select value={selectedBrand} onChange={(e) => { setSelectedBrand(e.target.value); setSelectedModel(""); setParts(null); }} className="p-2 border rounded">
          <option value="">Marka Seç</option>
          {brands.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>

        <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} disabled={!selectedBrand} className="p-2 border rounded">
          <option value="">Model Seç</option>
          {models.map((m) => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      {parts && (
        <>
          <div className="flex gap-4 mb-4 justify-center">
            {["balata", "disk", "silecek"].map(opt => (
              <label key={opt} className="flex items-center gap-2">
                <input type="checkbox" checked={selectedExtras[opt]} onChange={() => setSelectedExtras(prev => ({ ...prev, [opt]: !prev[opt] }))} />
                {opt.toUpperCase()}
              </label>
            ))}
          </div>

          <table className="w-full table-auto border mb-6">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Kategori</th>
                <th className="p-2 border">Ürün</th>
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
                  <td className="p-2 border">{p.fiyat}</td>
                  <td className="p-2 border">{p.toplam}</td>
                </tr>
              ))}
              {Object.entries(parts.optional).map(([key, items]) => (
                selectedExtras[key] ? items.map((p, i) => (
                  <tr key={`${key}-${i}`}>
                    <td className="p-2 border">{p.kategori}</td>
                    <td className="p-2 border">{p.urun_tip}</td>
                    <td className="p-2 border">{p.birim}</td>
                    <td className="p-2 border">{p.fiyat}</td>
                    <td className="p-2 border">{p.toplam}</td>
                  </tr>
                )) : null
              ))}
              <tr className="font-bold">
                <td className="p-2 border">{parts.labor.kategori}</td>
                <td className="p-2 border">{parts.labor.urun_tip}</td>
                <td className="p-2 border">{parts.labor.birim}</td>
                <td className="p-2 border">{parts.labor.fiyat}</td>
                <td className="p-2 border">{parts.labor.toplam}</td>
              </tr>
            </tbody>
          </table>

          <div className="text-xl font-bold mb-6 text-center">
            Toplam: {toplamFiyat()} TL (KDV Dahil)
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 items-center">
            <input type="text" name="adSoyad" placeholder="Ad Soyad" required onChange={(e) => setFormData({ ...formData, adSoyad: e.target.value })} className="p-2 border rounded w-1/2" />
            <input type="tel" name="telefon" placeholder="Telefon" required onChange={(e) => setFormData({ ...formData, telefon: e.target.value })} className="p-2 border rounded w-1/2" />
            <input type="text" name="plaka" placeholder="Araç Plakası" required onChange={(e) => setFormData({ ...formData, plaka: e.target.value })} className="p-2 border rounded w-1/2" />
            <input type="datetime-local" name="randevuTarihi" required onChange={(e) => setFormData({ ...formData, randevuTarihi: e.target.value })} className="p-2 border rounded w-1/2" />
            <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
              Randevu Oluştur 📅
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default Home;
