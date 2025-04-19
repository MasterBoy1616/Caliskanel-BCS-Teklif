import React, { useState, useEffect } from "react";
import axios from "axios";
import { generatePdf } from "./pdfGenerator";

const Home = () => {
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [parts, setParts] = useState(null);
  const [extras, setExtras] = useState({
    balata: false,
    disk: false,
    silecek: false,
  });
  const [formData, setFormData] = useState({
    adSoyad: "",
    telefon: "",
    plaka: "",
    randevuTarihi: ""
  });

  useEffect(() => {
    axios.get("/api/brands").then(res => setBrands(res.data));
  }, []);

  useEffect(() => {
    if (selectedBrand) {
      axios.get(`/api/models?brand=${selectedBrand}`).then(res => setModels(res.data));
    }
  }, [selectedBrand]);

  useEffect(() => {
    if (selectedBrand && selectedModel) {
      axios.get(`/api/parts?brand=${selectedBrand}&model=${selectedModel}`).then(res => setParts(res.data));
    }
  }, [selectedBrand, selectedModel]);

  const calculateTotal = () => {
    if (!parts) return 0;
    let total = 0;
    parts.baseParts.forEach(p => total += p.toplam);
    Object.keys(extras).forEach(key => {
      if (extras[key]) {
        parts.optional[key]?.forEach(p => total += p.toplam);
      }
    });
    total += parts.labor.toplam;
    return total;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    generatePdf(formData, selectedBrand, selectedModel, parts, extras);
  };

  return (
    <div className="app-background">
      <div className="app-container">
        <h1 className="text-3xl font-bold mb-6 text-center">Çalışkanel Bosch Car Servis</h1>

        <div className="selectors mb-6">
          <select value={selectedBrand} onChange={e => { setSelectedBrand(e.target.value); setSelectedModel(""); setParts(null); }}>
            <option value="">Marka Seç</option>
            {brands.map(b => <option key={b} value={b}>{b}</option>)}
          </select>

          <select value={selectedModel} onChange={e => setSelectedModel(e.target.value)} disabled={!selectedBrand}>
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
                  extras[key] ? items.map((p, i) => (
                    <tr key={`${key}-${i}`}>
                      <td>{p.kategori}</td>
                      <td>{p.urun_tip}</td>
                      <td>{p.birim}</td>
                      <td>{p.fiyat}</td>
                      <td>{p.toplam}</td>
                    </tr>
                  )) : null
                )}
                <tr className="font-bold">
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
                  <input
                    type="checkbox"
                    checked={extras[opt]}
                    onChange={() => setExtras(prev => ({ ...prev, [opt]: !prev[opt] }))}
                  /> {opt.toUpperCase()}
                </label>
              ))}
            </div>

            <div className="text-xl font-bold mt-4">
              Toplam: {calculateTotal()} TL (KDV Dahil)
            </div>
          </>
        )}

        <form onSubmit={handleSubmit} className="mt-6">
          <input
            type="text"
            name="adSoyad"
            placeholder="Ad Soyad"
            value={formData.adSoyad}
            onChange={e => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
            required
            className="border p-2 w-full mb-2"
          />
          <input
            type="tel"
            name="telefon"
            placeholder="Telefon"
            value={formData.telefon}
            onChange={e => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
            required
            className="border p-2 w-full mb-2"
          />
          <input
            type="text"
            name="plaka"
            placeholder="Araç Plakası"
            value={formData.plaka}
            onChange={e => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
            required
            className="border p-2 w-full mb-2"
          />
          <input
            type="datetime-local"
            name="randevuTarihi"
            value={formData.randevuTarihi}
            onChange={e => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))}
            required
            className="border p-2 w-full mb-4"
          />

          <button type="submit" className="button w-full">📄 Teklifi PDF Olarak Al</button>
        </form>
      </div>
    </div>
  );
};

export default Home;
