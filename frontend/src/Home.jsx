import React, { useEffect, useState } from "react";
import axios from "axios";
import { generatePdf } from "./pdfGenerator";

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
    plaka: "",
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
      axios.get(`/api/parts?brand=${selectedBrand}&model=${selectedModel}`).then((res) => setParts(res.data));
      axios.post("/api/log/fiyatbakma");
    }
  }, [selectedBrand, selectedModel]);

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

  const handleGeneratePdf = () => {
    if (!formData.adSoyad || !formData.plaka) {
      alert("Ad Soyad ve Plaka bilgilerini doldurun.");
      return;
    }
    generatePdf(formData, selectedBrand, selectedModel, parts, selectedExtras);
    axios.post("/api/log/teklifal");
  };

  return (
    <div className="app-background">
      <div className="app-container">
        <h1 className="text-3xl font-bold text-center mb-8">Çalışkanel Bosch Car Servis</h1>

        <div className="selectors flex flex-wrap gap-4 justify-center mb-6">
          <select
            className="border p-2 rounded"
            value={selectedBrand}
            onChange={(e) => {
              setSelectedBrand(e.target.value);
              setSelectedModel("");
              setParts(null);
            }}
          >
            <option value="">Marka Seçin</option>
            {brands.map((b, i) => (
              <option key={i} value={b}>{b}</option>
            ))}
          </select>

          <select
            className="border p-2 rounded"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            disabled={!selectedBrand}
          >
            <option value="">Model Seçin</option>
            {models.map((m, i) => (
              <option key={i} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="extras mb-6 flex justify-center gap-6">
          {["balata", "disk", "silecek"].map((key) => (
            <label key={key}>
              <input
                type="checkbox"
                checked={selectedExtras[key]}
                onChange={() =>
                  setSelectedExtras(prev => ({ ...prev, [key]: !prev[key] }))
                }
              /> {key.toUpperCase()}
            </label>
          ))}
        </div>

        {parts && (
          <>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-200">
                  <th>Kategori</th>
                  <th>Ürün</th>
                  <th>Adet</th>
                  <th>Birim Fiyat (TL)</th>
                  <th>Toplam (TL)</th>
                </tr>
              </thead>
              <tbody>
                {parts.baseParts.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.kategori}</td>
                    <td>{item.urun_tip}</td>
                    <td>{item.birim}</td>
                    <td>{item.fiyat}</td>
                    <td>{item.toplam}</td>
                  </tr>
                ))}
                {Object.entries(parts.optional).map(([key, items]) =>
                  selectedExtras[key] &&
                  items.map((item, idx) => (
                    <tr key={`${key}-${idx}`}>
                      <td>{item.kategori}</td>
                      <td>{item.urun_tip}</td>
                      <td>{item.birim}</td>
                      <td>{item.fiyat}</td>
                      <td>{item.toplam}</td>
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

            <div className="text-center mt-6">
              <p className="text-2xl font-bold text-green-600 mb-2">
                Toplam: {calculateTotal().toLocaleString()} TL (KDV Dahil)
              </p>

              <div className="flex flex-col items-center gap-3 mt-4">
                <input
                  type="text"
                  name="adSoyad"
                  placeholder="Ad Soyad"
                  className="border p-2 rounded w-64"
                  value={formData.adSoyad}
                  onChange={(e) => setFormData(prev => ({ ...prev, adSoyad: e.target.value }))}
                />
                <input
                  type="text"
                  name="plaka"
                  placeholder="Plaka"
                  className="border p-2 rounded w-64"
                  value={formData.plaka}
                  onChange={(e) => setFormData(prev => ({ ...prev, plaka: e.target.value }))}
                />
                <button
                  className="button bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded text-white font-bold mt-2"
                  onClick={handleGeneratePdf}
                >
                  📄 Teklifi PDF Olarak Al
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
