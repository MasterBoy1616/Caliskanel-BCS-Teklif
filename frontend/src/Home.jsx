import React, { useState, useEffect } from 'react';
import { generatePdf } from './pdfGenerator';
import axios from 'axios';

const Home = () => {
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [parts, setParts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [formData, setFormData] = useState({
    adSoyad: '',
    plaka: ''
  });

  useEffect(() => {
    // Burada brands ve models çekme işlemleri vardı, API yoksa sabit veri ekleyebilirsin
  }, []);

  const handleInputChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleGeneratePdf = () => {
    if (!formData.adSoyad || !formData.plaka) {
      alert("Lütfen isim ve plaka giriniz.");
      return;
    }
    generatePdf(formData, parts, totalPrice);
  };

  return (
    <div className="app-background p-4">
      <div className="app-container">
        <h1 className="text-3xl font-bold mb-6 text-center">Çalışkanel Bosch Car Servisi</h1>

        <div className="mb-4 flex flex-col md:flex-row gap-2">
          <input 
            type="text" 
            name="adSoyad" 
            placeholder="Ad Soyad" 
            value={formData.adSoyad}
            onChange={handleInputChange}
            className="border p-2 rounded w-full md:w-1/2"
          />
          <input 
            type="text" 
            name="plaka" 
            placeholder="Araç Plakası" 
            value={formData.plaka}
            onChange={handleInputChange}
            className="border p-2 rounded w-full md:w-1/2"
          />
        </div>

        <div className="text-2xl font-bold text-center mb-6">
          Toplam: {totalPrice.toLocaleString('tr-TR')} ₺ (KDV Dahil)
        </div>

        <button 
          onClick={handleGeneratePdf}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded"
        >
          📄 Teklifi PDF Olarak İndir
        </button>

      </div>
    </div>
  );
};

export default Home;
