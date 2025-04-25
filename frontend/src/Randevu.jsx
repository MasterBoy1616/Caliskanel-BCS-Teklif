import React, { useState } from "react";
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

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Randevu log kaydı
    await axios.post("/api/log/randevu", formData);
    // PDF üret
    generatePdf(formData, 0, [], []);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">Randevu Al</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
        <input
          type="text"
          name="adSoyad"
          placeholder="Ad Soyad"
          onChange={handleChange}
          required
          className="p-2 border rounded"
        />
        <input
          type="tel"
          name="telefon"
          placeholder="Telefon"
          onChange={handleChange}
          required
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="plaka"
          placeholder="Araç Plakası"
          onChange={handleChange}
          required
          className="p-2 border rounded"
        />
        <input
          type="text"
          name="arac"
          placeholder="Araç Marka/Model"
          onChange={handleChange}
          required
          className="p-2 border rounded"
        />
        <input
          type="datetime-local"
          name="randevuTarihi"
          onChange={handleChange}
          required
          className="p-2 border rounded"
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded"
        >
          📄 Teklifi PDF Olarak Al
        </button>
      </form>
    </div>
  );
};

export default Randevu;
