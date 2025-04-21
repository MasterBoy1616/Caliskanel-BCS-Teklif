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
  const [userInfo, setUserInfo] = useState({
    adSoyad: "",
    plaka: ""
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

  const handlePdf = () => {
    generatePdf(userInfo, calculateTotal(), parts, selectedExtras);
  };

  return (
    <div className="app-background">
      <div className="app-container">
        <h2 className="text-2xl font-bold mb-4">Periyodik Bakım Fiyat Sorgulama</h2>

        <div className="selectors mb-4">
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

            <div className="text-2xl font-bold mt-4">
              Toplam Tutar: {calculateTotal()} TL (KDV Dahil)
            </div>
          </>
        )}

        <div className="extras mt-6">
          {["balata", "disk", "silecek"].map((opt) => (
            <label key={opt}>
              <input
                type="checkbox"
                checked={selectedExtras[opt]}
                onChange={() =>
                  setSelectedExtras((prev) => ({ ...prev, [opt]: !prev[opt] }))
                }
              />
              {opt.toUpperCase()}
            </label>
          ))}
        </div>

        <div className="mt-6 flex flex-col gap-2">
          <input
            type="text"
            placeholder="Ad Soyad"
            value={userInfo.adSoyad}
            onChange={(e) => setUserInfo({ ...userInfo, adSoyad: e.target.value })}
            className="border p-2"
          />
          <input
            type="text"
            placeholder="Plaka"
            value={userInfo.plaka}
            onChange={(e) => setUserInfo({ ...userInfo, plaka: e.target.value })}
            className="border p-2"
          />

          <button
            onClick={handlePdf}
            className="button mt-4"
          >
            📄 Teklifi PDF Olarak Al
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
