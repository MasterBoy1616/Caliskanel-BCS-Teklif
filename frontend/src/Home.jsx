// frontend/src/Home.jsx
import React, { useState, useEffect } from "react";
import { generatePdf } from "./pdfGenerator";
import axios from "axios";

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
        setParts(res.data);
        axios.post("/api/log/fiyatbakma");
      });
    }
  }, [selectedBrand, selectedModel]);

  const calculateTotal = () => {
    if (!parts) return 0;
    let total = 0;
    parts.baseParts.forEach((p) => (total += p.toplam));
    Object.keys(selectedExtras).forEach((key) => {
      if (selectedExtras[key]) {
        parts.optional[key].forEach((p) => (total += p.toplam));
      }
    });
    total += parts.labor.toplam;
    return total;
  };

  const handleFormChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreateOffer = () => {
    if (!formData.adSoyad || !formData.telefon || !formData.plaka || !formData.randevuTarihi) {
      alert("Lütfen tüm bilgileri doldurun!");
      return;
    }
    generatePdf(formData, calculateTotal(), parts, selectedExtras, selectedBrand, selectedModel);
  };

  return (
    <div className="app-background">
      <div className="app-container">
        <h1 className="text-3xl font-bold mb-6 text-center">Periyodik Bakım Fiyat Sorgulama</h1>

        {/* Marka ve Model seçimi */}
        <div className="selectors mb-6">
          <select
            value={selectedBrand}
            onChange={(e) => {
              setSelectedBrand(e.target.value);
              setSelectedModel("");
              setParts(null);
            }}
          >
            <option value="">Marka Seç</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>

          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            disabled={!selectedBrand}
          >
            <option value="">Model Seç</option>
            {models.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Parça Listesi */}
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
                  selectedExtras[key]
                    ? items.map((p, i) => (
                        <tr key={`${key}-${i}`}>
                          <td>{p.kategori}</td>
                          <td>{p.urun_tip}</td>
                          <td>{p.birim}</td>
                          <td>{p.fiyat}</td>
                          <td>{p.toplam}</td>
                        </tr>
                      ))
                    : null
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

            {/* Ekstralar */}
            <div className="extras mt-6">
              {["balata", "disk", "silecek"].map((opt) => (
                <label key={opt}>
                  <input
                    type="checkbox"
                    checked={selectedExtras[opt]}
                    onChange={() =>
                      setSelectedExtras((prev) => ({ ...prev, [opt]: !prev[opt] }))
                    }
                  />{" "}
                  {opt.toUpperCase()}
                </label>
              ))}
            </div>

            {/* Toplam */}
            <div className="text-xl font-bold mt-6">
              Toplam: {calculateTotal()} TL
            </div>

            {/* Randevu Formu */}
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">Randevu Bilgileri</h2>
              <div className="flex flex-col gap-3">
                <input
                  type="text"
                  name="adSoyad"
                  placeholder="Ad Soyad"
                  value={formData.adSoyad}
                  onChange={handleFormChange}
                />
                <input
                  type="tel"
                  name="telefon"
                  placeholder="Telefon"
                  value={formData.telefon}
                  onChange={handleFormChange}
                />
                <input
                  type="text"
                  name="plaka"
                  placeholder="Araç Plaka"
                  value={formData.plaka}
                  onChange={handleFormChange}
                />
                <input
                  type="datetime-local"
                  name="randevuTarihi"
                  value={formData.randevuTarihi}
                  onChange={handleFormChange}
                />
                <button className="button mt-4" onClick={handleCreateOffer}>
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
