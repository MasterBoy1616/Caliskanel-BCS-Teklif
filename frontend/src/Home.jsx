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
      axios.post("/api/log/fiyatbakma"); // Logla
    }
  }, [selectedBrand, selectedModel]);

  const handleFormChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleCreateRandevuAndPdf = async (e) => {
    e.preventDefault();
    const { adSoyad, telefon, plaka, randevuTarihi } = formData;
    if (!adSoyad || !telefon || !plaka || !randevuTarihi) {
      alert("Lütfen tüm bilgileri doldurunuz.");
      return;
    }
    const selectedOptionalParts = [];
    Object.entries(selectedExtras).forEach(([key, val]) => {
      if (val && parts.optional[key]) {
        selectedOptionalParts.push(...parts.optional[key]);
      }
    });

    const randevuData = {
      adSoyad,
      telefon,
      plaka,
      arac: `${selectedBrand} ${selectedModel}`,
      randevuTarihi,
      parts: parts.baseParts,
      optionalParts: selectedOptionalParts,
      labor: parts.labor,
    };

    try {
      await axios.post("/api/randevular/ekle", randevuData);
      generatePdf(randevuData);
    } catch (err) {
      alert("Randevu oluşturulamadı.");
    }
  };

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

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Periyodik Bakım Fiyat Sorgulama</h2>

      {/* Marka ve Model Seçimi */}
      <div className="flex gap-4 mb-4">
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

      {/* Parçalar */}
      {parts && (
        <>
          <table className="w-full table-auto border mb-6">
            <thead>
              <tr className="bg-gray-100">
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
                  <td className="p-2 border">{p.birim}</td>
                  <td className="p-2 border">{p.fiyat} TL</td>
                  <td className="p-2 border">{p.toplam} TL</td>
                </tr>
              ))}
              {Object.entries(parts.optional).map(([key, items]) =>
                selectedExtras[key] ? items.map((p, i) => (
                  <tr key={`${key}-${i}`}>
                    <td className="p-2 border">{p.kategori}</td>
                    <td className="p-2 border">{p.urun_tip}</td>
                    <td className="p-2 border">{p.birim}</td>
                    <td className="p-2 border">{p.fiyat} TL</td>
                    <td className="p-2 border">{p.toplam} TL</td>
                  </tr>
                )) : null
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

          {/* Toplam */}
          <h3 className="text-xl font-bold mb-6">Toplam: {calculateTotal()} TL</h3>
        </>
      )}

      {/* Ekstralar */}
      <div className="flex gap-4 mb-6">
        {["balata", "disk", "silecek"].map((opt) => (
          <label key={opt} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={selectedExtras[opt]}
              onChange={() =>
                setSelectedExtras((prev) => ({
                  ...prev,
                  [opt]: !prev[opt],
                }))
              }
            />
            {opt.toUpperCase()}
          </label>
        ))}
      </div>

      {/* Randevu Bilgileri */}
      <form onSubmit={handleCreateRandevuAndPdf} className="flex flex-col gap-4">
        <input type="text" name="adSoyad" placeholder="Ad Soyad" value={formData.adSoyad} onChange={handleFormChange} required className="p-2 border rounded" />
        <input type="tel" name="telefon" placeholder="Telefon" value={formData.telefon} onChange={handleFormChange} required className="p-2 border rounded" />
        <input type="text" name="plaka" placeholder="Araç Plakası" value={formData.plaka} onChange={handleFormChange} required className="p-2 border rounded" />
        <input type="datetime-local" name="randevuTarihi" value={formData.randevuTarihi} onChange={handleFormChange} required className="p-2 border rounded" />

        <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-bold p-3 rounded mt-4">
          📄 Randevu Oluştur ve PDF Al
        </button>
      </form>
    </div>
  );
};

export default Home;
