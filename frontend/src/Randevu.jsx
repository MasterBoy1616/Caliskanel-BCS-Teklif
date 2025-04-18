// frontend/src/Randevu.jsx

import React, { useState } from "react";

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
    console.log("Randevu kaydedildi:", formData);
    alert("Randevunuz kaydedildi! (Test modunda)");
    setFormData({
      adSoyad: "",
      telefon: "",
      plaka: "",
      arac: "",
      randevuTarihi: ""
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Randevu Al</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
        <input
          type="text"
          name="adSoyad"
          placeholder="Ad Soyad"
          value={formData.adSoyad}
          onChange={handleChange}
          required
          className="p-2 border"
        />
        <input
          type="tel"
          name="telefon"
          placeholder="Telefon"
          value={formData.telefon}
          onChange={handleChange}
          required
          className="p-2 border"
        />
        <input
          type="text"
          name="plaka"
          placeholder="Araç Plakası"
          value={formData.plaka}
          onChange={handleChange}
          required
          className="p-2 border"
        />
        <input
          type="text"
          name="arac"
          placeholder="Araç Marka/Model"
          value={formData.arac}
          onChange={handleChange}
          required
          className="p-2 border"
        />
        <input
          type="datetime-local"
          name="randevuTarihi"
          value={formData.randevuTarihi}
          onChange={handleChange}
          required
          className="p-2 border"
        />
        
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded"
        >
          Randevu Al
        </button>
      </form>
    </div>
  );
};

export default Randevu;
