import React, { useState, useEffect } from "react";
import axios from "axios";
import { generatePdf } from "./pdfGenerator";

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
      axios.post("/api/log/fiyatbakma");
    }
  }, [selectedBrand, selectedModel]);

  const calculateTotal = () => {
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

  const handleFormChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleTeklifAl = (e) => {
    e.preventDefault();
    const selectedParts = [];
    if (parts) {
      selectedParts.push(...parts.baseParts);
      Object.entries(parts.optional).forEach(([key, items]) => {
        if (selectedExtras[key]) {
          selectedParts.push(...items);
        }
      });
      selectedParts.push(parts.labor);
    }
    generatePdf({
      ...formData,
      arac: `${selectedBrand} ${selectedModel}`,
      fiyatBilgisi: calculateTotal(),
      selectedParts
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Periyodik Bakım Fiyat Sorgulama ve Randevu</h2>

      <div className="flex gap-4 mb-6">
        <select value={selectedBrand} onChange={(e) => {
          setSelectedBrand(e.target.value);
          setSelectedModel("");
          setParts(null);
        }} className="border p-2 rounded w-1/2">
          <option value="">Marka Seç</option>
          {brands.map(b => <option key={b} value={b}>{b}</option>)}
        </select>

        <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} disabled={!selectedBrand} className="border p-2 rounded w-1/2">
          <option value="">Model Seç</option>
          {models.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      {parts && (
        <div className="overflow-x-auto mb-6">
          <table className="w-full table-auto border">
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
              {Object.entries(parts.optional).map(([key, items]) => selectedExtras[key] && items.map((p, i) => (
                <tr key={`${key}-${i}`}>
                  <td className="p-2 border">{p.kategori}</td>
                  <td className="p-2 border">{p.urun_tip}</td>
                  <td className="p-2 border">{p.birim}</td>
                  <td className="p-2 border">{p.fiyat} TL</td>
                  <td className="p-2 border">{p.toplam} TL</td>
                </tr>
              )))}
              <tr className="font-bold">
                <td className="p-2 border">{parts.labor.kategori}</td>
                <td className="p-2 border">{parts.labor.urun_tip}</td>
                <td className="p-2 border">{parts.labor.birim}</td>
                <td className="p-2 border">{parts.labor.fiyat} TL</td>
                <td className="p-2 border">{parts.labor.toplam} TL</td>
              </tr>
            </tbody>
          </table>
          <h3 className="mt-4 text-xl font-semibold">Toplam: {calculateTotal()} TL</h3>
        </div>
      )}

      <div className="flex gap-4 mb-6">
        {Object.keys(selectedExtras).map(key => (
          <label key={key} className="flex items-center gap-2">
            <input type="checkbox" checked={selectedExtras[key]} onChange={() => setSelectedExtras(prev => ({ ...prev, [key]: !prev[key] }))} />
            {key.toUpperCase()}
          </label>
        ))}
      </div>

      <form onSubmit={handleTeklifAl} className="flex flex-col gap-4">
        <input type="text" name="adSoyad" placeholder="Ad Soyad" onChange={handleFormChange} required className="p-2 border rounded" />
        <input type="tel" name="telefon" placeholder="Telefon" onChange={handleFormChange} required className="p-2 border rounded" />
        <input type="text" name="plaka" placeholder="Araç Plakası" onChange={handleFormChange} required className="p-2 border rounded" />
        <input type="datetime-local" name="randevuTarihi" onChange={handleFormChange} required className="p-2 border rounded" />
        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          📄 Teklif PDF Al & Randevu Oluştur
        </button>
      </form>
    </div>
  );
};

export default Home;
