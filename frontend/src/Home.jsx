import React, { useState, useEffect } from "react";
import axios from "axios";
import { generatePdf } from "./pdfGenerator";

const Home = () => {
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [parts, setParts] = useState([]);
  const [optionalParts, setOptionalParts] = useState([]);
  const [labor, setLabor] = useState({});
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
      axios.get(`/api/parts?brand=${selectedBrand}&model=${selectedModel}`).then((res) => {
        setParts(res.data.baseParts || []);
        setOptionalParts([
          ...(res.data.optional.balata || []),
          ...(res.data.optional.disk || []),
          ...(res.data.optional.silecek || []),
        ]);
        setLabor(res.data.labor || {});
      });
    }
  }, [selectedBrand, selectedModel]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const allParts = [
      ...parts,
      ...Object.entries(selectedExtras).flatMap(([key, val]) => (val ? optionalParts.filter(op => op.kategori.toLowerCase().includes(key)) : [])),
      labor
    ];

    try {
      await axios.post("/api/randevular/add", {
        ...formData,
        brand: selectedBrand,
        model: selectedModel,
        selectedExtras,
        parts: allParts
      });

      generatePdf(formData, selectedBrand, selectedModel, parts, optionalParts, selectedExtras, labor);
      alert("✅ Randevu alındı ve PDF oluşturuldu!");
    } catch (error) {
      console.error(error);
      alert("❌ Randevu oluşturulamadı!");
    }
  };

  return (
    <div className="app-background">
      <div className="app-container">
        <h1 className="text-3xl font-bold mb-6 text-center">Periyodik Bakım Fiyat Sorgulama</h1>

        <div className="selectors flex gap-4 mb-4">
          <select value={selectedBrand} onChange={(e) => { setSelectedBrand(e.target.value); setSelectedModel(""); }} className="border p-2 w-1/2">
            <option value="">Marka Seç</option>
            {brands.map((b) => <option key={b} value={b}>{b}</option>)}
          </select>

          <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} className="border p-2 w-1/2" disabled={!selectedBrand}>
            <option value="">Model Seç</option>
            {models.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>

        {parts.length > 0 && (
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
                {parts.map((p, i) => (
                  <tr key={i}>
                    <td>{p.kategori}</td>
                    <td>{p.urun_tip}</td>
                    <td>{p.birim}</td>
                    <td>{p.fiyat}</td>
                    <td>{p.toplam}</td>
                  </tr>
                ))}
                {Object.entries(selectedExtras).map(([key, selected]) => (
                  selected && optionalParts
                    .filter((p) => p.kategori.toLowerCase().includes(key))
                    .map((p, i) => (
                      <tr key={`${key}-${i}`}>
                        <td>{p.kategori}</td>
                        <td>{p.urun_tip}</td>
                        <td>{p.birim}</td>
                        <td>{p.fiyat}</td>
                        <td>{p.toplam}</td>
                      </tr>
                    ))
                ))}
                <tr className="font-bold">
                  <td>{labor.kategori}</td>
                  <td>{labor.urun_tip}</td>
                  <td>{labor.birim}</td>
                  <td>{labor.fiyat}</td>
                  <td>{labor.toplam}</td>
                </tr>
              </tbody>
            </table>

            <div className="extras flex gap-6 mt-4">
              {["balata", "disk", "silecek"].map((opt) => (
                <label key={opt}>
                  <input
                    type="checkbox"
                    checked={selectedExtras[opt]}
                    onChange={() => setSelectedExtras((prev) => ({ ...prev, [opt]: !prev[opt] }))}
                  />
                  {opt.toUpperCase()}
                </label>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-6">
              <input type="text" name="adSoyad" value={formData.adSoyad} onChange={(e) => setFormData({ ...formData, adSoyad: e.target.value })} required placeholder="Ad Soyad" className="border p-2" />
              <input type="tel" name="telefon" value={formData.telefon} onChange={(e) => setFormData({ ...formData, telefon: e.target.value })} required placeholder="Telefon" className="border p-2" />
              <input type="text" name="plaka" value={formData.plaka} onChange={(e) => setFormData({ ...formData, plaka: e.target.value })} required placeholder="Araç Plakası" className="border p-2" />
              <input type="datetime-local" name="randevuTarihi" value={formData.randevuTarihi} onChange={(e) => setFormData({ ...formData, randevuTarihi: e.target.value })} required className="border p-2" />

              <button type="submit" className="button">📄 Teklifi PDF Olarak Al ve Randevu Oluştur</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
