// frontend/src/Randevu.jsx

import React, { useState } from "react";
import { generatePdf } from "./pdfGenerator";

const Randevu = () => {
  const [formData, setFormData] = useState({
    adSoyad: "",
    telefon: "",
    plaka: "",
    arac: "",
    randevuTarihi: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    generatePdf(formData, "12345"); // Buradaki 12345 fiyatı, dinamik de yapılabilir.
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-6">Randevu Al</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-md">
        <input
          type="text"
          name="adSoyad"
          value={formData.adSoyad}
          onChange={handleChange}
          placeholder="Ad Soyad"
          className="p-2 border rounded"
          required
        />
        <input
          type="text"
          name="telefon"
          value={formData.telefon}
          onChange={handleChange}
          placeholder="Telefon"
          className="p-2 border rounded"
          required
        />
        <input
          type="text"
          name="plaka"
          value={formData.plaka}
          onChange={handleChange}
          placeholder="Araç Plakası"
          className="p-2 border rounded"
          required
        />
        <input
          type="text"
          name="arac"
          value={formData.arac}
          onChange={handleChange}
          placeholder="Araç Marka / Model"
          className="p-2 border rounded"
          required
        />
        <input
          type="datetime-local"
          name="randevuTarihi"
          value={formData.randevuTarihi}
          onChange={handleChange}
          className="p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          PDF Olarak İndir
        </button>
      </form>
    </div>
  );
};

export default Randevu;
