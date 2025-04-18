import React, { useState, useEffect } from "react";
import { generatePdf } from "./pdfGenerator";
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
    arac: "",
    randevuTarihi: ""
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
      axios.get(`/api/parts?brand=${selectedBrand}&model=${selectedModel}`).then((res) => {
        setParts(res.data);
        setFormData(prev => ({ ...prev, arac: `${selectedBrand} ${selectedModel}` }));
      });
      axios.post("/api/log/fiyatbakma").catch(() => {});
    }
  }, [selectedBrand, selectedModel]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!parts) {
      alert("Lütfen bir marka ve model seçin.");
      return;
    }
    try {
      await axios.post("/api/randevu-olustur", { ...formData, arac: `${selectedBrand} ${selectedModel}` });
      generatePdf(formData, calculateTotal(), parts, selectedExtras);
      alert("✅ Randevu başarıyla oluşturuldu ve PDF indirildi.");
    } catch {
      alert("❌ Randevu oluşturulamadı.");
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
    <>
      <h2 className="text-2xl font-bold mb-4">Periyodik Bakım Fiyat Sorgulama</h2>

      <div className="selectors mb-6">
        <select value={selectedBrand} onChange={(e) => {
          setSelectedBrand(e.target.value);
          setSelectedModel("");
          setParts(null);
        }}>
          <option value="">Marka Seç</option>
          {brands.map(b => <option key={b} value={b}>{b}</option>)}
        </select>

        <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} disabled={!selectedBrand}>
          <option value="">Model Seç</option>
          {models.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      {parts && (
        <>
          <table>
            <thead>
              <tr>
                <th>Kategori</th>
                <th>Ürün</th>
                <th>Birim</th>
                <th>Fiyat (TL)</th>
                <th>Toplam (TL)</th>
              </tr>
            </thead>
            <tbody>
              {parts.baseParts.map((p, i) => (
                <tr key={i}>
                  <td>{p.kategori}</td>
                  <td>{p.urun_tip}</td>
                  <td>{p.birim}</td>
                  <td>{p.fiyat}</td>
                  <td>{p.toplam}</td>
                </tr>
              ))}
              {Object.entries(parts.optional).map(([key, items]) =>
                selectedExtras[key] && items.map((p, i) => (
                  <tr key={`${key}-${i}`}>
                    <td>{p.kategori}</td>
                    <td>{p.urun_tip}</td>
                    <td>{p.birim}</td>
                    <td>{p.fiyat}</td>
                    <td>{p.toplam}</td>
                  </tr>
                ))
              )}
              <tr>
                <td>{parts.labor.kategori}</td>
                <td>{parts.labor.urun_tip}</td>
                <td>{parts.labor.birim}</td>
                <td>{parts.labor.fiyat}</td>
                <td>{parts.labor.toplam}</td>
              </tr>
            </tbody>
          </table>

          <div className="extras mt-4">
            {["balata", "disk", "silecek"].map(opt => (
              <label key={opt}>
                <input type="checkbox" checked={selectedExtras[opt]} onChange={() => setSelectedExtras(prev => ({ ...prev, [opt]: !prev[opt] }))} />
                {opt.toUpperCase()}
              </label>
            ))}
          </div>

          <h3 className="text-xl mt-4">Toplam: {calculateTotal()} TL</h3>
        </>
      )}

      <h2 className="text-2xl font-bold my-6">Randevu Formu</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input type="text" name="adSoyad" placeholder="Ad Soyad" value={formData.adSoyad} onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))} required />
        <input type="tel" name="telefon" placeholder="Telefon" value={formData.telefon} onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))} required />
        <input type="text" name="plaka" placeholder="Araç Plakası" value={formData.plaka} onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))} required />
        <input type="datetime-local" name="randevuTarihi" value={formData.randevuTarihi} onChange={(e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))} required />
        <button type="submit" className="button mt-4">📄 Teklifi PDF Olarak Al ve Randevu Oluştur</button>
      </form>
    </>
  );
};

export default Home;
