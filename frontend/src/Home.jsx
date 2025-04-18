import React, { useState, useEffect } from "react";
import axios from "axios";
import { generatePdf } from "./pdfGenerator";

const Home = () => {
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [parts, setParts] = useState(null);
  const [selectedExtras, setSelectedExtras] = useState({ balata: false, disk: false, silecek: false });
  const [formData, setFormData] = useState({ adSoyad: "", telefon: "", plaka: "", randevuTarihi: "" });

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
    let total = parts.baseParts.reduce((sum, p) => sum + p.toplam, 0);
    Object.keys(selectedExtras).forEach(key => {
      if (selectedExtras[key]) {
        parts.optional[key]?.forEach(p => total += p.toplam);
      }
    });
    total += parts.labor.toplam;
    return total;
  };

  const handleRandevuOlustur = async () => {
    try {
      const randevuData = {
        ...formData,
        arac: `${selectedBrand} ${selectedModel}`,
        fiyat: calculateTotal(),
        secilenEkstralar: selectedExtras
      };
      await axios.post("/api/randevu", randevuData);
      alert("✅ Randevu oluşturuldu!");
      generatePdf(randevuData, parts, selectedExtras);
    } catch (error) {
      console.error(error);
      alert("❌ Randevu oluşturulamadı!");
    }
  };

  return (
    <div>
      <div className="selectors mb-6">
        <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
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
          <div className="extras mb-4">
            {["balata", "disk", "silecek"].map(opt => (
              <label key={opt}>
                <input type="checkbox" checked={selectedExtras[opt]} onChange={() => setSelectedExtras(prev => ({ ...prev, [opt]: !prev[opt] }))} /> {opt.toUpperCase()}
              </label>
            ))}
          </div>

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
              {Object.keys(selectedExtras).map(opt =>
                selectedExtras[opt] && parts.optional[opt]?.map((p, idx) => (
                  <tr key={`${opt}-${idx}`}>
                    <td>{p.kategori}</td>
                    <td>{p.urun_tip}</td>
                    <td>{p.birim}</td>
                    <td>{p.fiyat}</td>
                    <td>{p.toplam}</td>
                  </tr>
                ))
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

          <div className="text-xl font-semibold mt-4">Toplam: {calculateTotal()} TL (KDV Dahil)</div>

          <div className="mt-8 flex flex-col gap-4">
            <input type="text" placeholder="Ad Soyad" name="adSoyad" onChange={(e) => setFormData(prev => ({ ...prev, adSoyad: e.target.value }))} className="border p-2" />
            <input type="tel" placeholder="Telefon" name="telefon" onChange={(e) => setFormData(prev => ({ ...prev, telefon: e.target.value }))} className="border p-2" />
            <input type="text" placeholder="Plaka" name="plaka" onChange={(e) => setFormData(prev => ({ ...prev, plaka: e.target.value }))} className="border p-2" />
            <input type="datetime-local" name="randevuTarihi" onChange={(e) => setFormData(prev => ({ ...prev, randevuTarihi: e.target.value }))} className="border p-2" />
            <button onClick={handleRandevuOlustur} className="button">📄 Teklifi PDF Olarak Al ve Randevu Oluştur</button>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
