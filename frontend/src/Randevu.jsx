import React, { useState, useEffect } from "react";
import { generatePdf } from "./pdfGenerator";
import axios from "axios";

const Randevu = () => {
  const [formData, setFormData] = useState({
    adSoyad: "",
    telefon: "",
    plaka: "",
    arac: "",
    randevuTarihi: ""
  });

  const [parts, setParts] = useState([]);
  const [optionalParts, setOptionalParts] = useState([]);
  const [fiyatBilgisi, setFiyatBilgisi] = useState(0);

  useEffect(() => {
    // LocalStorage'dan seçilen marka ve modeli al
    const brand = localStorage.getItem("selectedBrand");
    const model = localStorage.getItem("selectedModel");

    if (brand && model) {
      axios.get(`/api/parts?brand=${brand}&model=${model}`)
        .then((res) => {
          const data = res.data;
          setParts(data.baseParts || []);
          const opsiyoneller = [...(data.optional.balata || []), ...(data.optional.disk || []), ...(data.optional.silecek || [])];
          setOptionalParts(opsiyoneller);

          let toplam = 0;
          data.baseParts.forEach(p => toplam += p.toplam);
          opsiyoneller.forEach(p => toplam += p.toplam);
          toplam += data.labor.toplam;
          setFiyatBilgisi(toplam);

          // Araç bilgisi otomatik doldurulsun
          setFormData(prev => ({
            ...prev,
            arac: `${brand} ${model}`
          }));
        });
    }
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    generatePdf(formData, fiyatBilgisi, parts, optionalParts);

    // İstersen burada ayrıca randevuyu kaydeden bir API de çağırabiliriz:
    // axios.post("/api/randevu", { ...formData, fiyat: fiyatBilgisi })
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">Randevu Al</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
        <input type="text" name="adSoyad" placeholder="Ad Soyad" value={formData.adSoyad} onChange={handleChange} required className="p-2 border rounded" />
        <input type="tel" name="telefon" placeholder="Telefon" value={formData.telefon} onChange={handleChange} required className="p-2 border rounded" />
        <input type="text" name="plaka" placeholder="Araç Plakası" value={formData.plaka} onChange={handleChange} required className="p-2 border rounded" />
        <input type="text" name="arac" placeholder="Araç Marka / Model" value={formData.arac} onChange={handleChange} required className="p-2 border rounded" />
        <input type="datetime-local" name="randevuTarihi" value={formData.randevuTarihi} onChange={handleChange} required className="p-2 border rounded" />

        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded">
          📄 Teklifi PDF Olarak Al
        </button>
      </form>
    </div>
  );
};

export default Randevu;
