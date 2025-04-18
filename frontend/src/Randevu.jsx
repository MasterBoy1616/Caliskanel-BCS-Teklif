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
    // Default örnek araç
    axios.get("/api/parts?brand=FIAT&model=EGEA")
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
      });
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    generatePdf(formData, fiyatBilgisi, parts, optionalParts);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Randevu Al</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
        <input type="text" name="adSoyad" placeholder="Ad Soyad" onChange={handleChange} required className="p-2 border" />
        <input type="tel" name="telefon" placeholder="Telefon" onChange={handleChange} required className="p-2 border" />
        <input type="text" name="plaka" placeholder="Araç Plakası" onChange={handleChange} required className="p-2 border" />
        <input type="text" name="arac" placeholder="Araç Marka/Model" onChange={handleChange} required className="p-2 border" />
        <input type="datetime-local" name="randevuTarihi" onChange={handleChange} required className="p-2 border" />
        
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 rounded">
          📄 Teklifi PDF Olarak Al
        </button>
      </form>
    </div>
  );
};

export default Randevu;
