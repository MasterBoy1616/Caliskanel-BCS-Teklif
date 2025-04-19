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
  const [userData, setUserData] = useState({
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
      axios.get(`/api/parts?brand=${selectedBrand}&model=${selectedModel}`).then((res) => {
        setParts(res.data);
      });
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

  const handlePdfDownload = () => {
    generatePdf(userData, selectedBrand, selectedModel, parts, selectedExtras);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Periyodik Bakım Fiyatı Al</h1>

      <div className="selectors mb-4">
        <select value={selectedBrand} onChange={(e) => {setSelectedBrand(e.target.value); setSelectedModel(""); setParts(null);}} className="border p-2 rounded">
          <option value="">Marka Seçiniz</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>

        <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} className="border p-2 rounded" disabled={!selectedBrand}>
          <option value="">Model Seçiniz</option>
          {models.map((model) => (
            <option key={model} value={model}>{model}</option>
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
              {parts.baseParts.map((p, idx) => (
                <tr key={idx}>
                  <td>{p.kategori}</td>
                  <td>{p.urun_tip}</td>
                  <td>{p.birim}</td>
                  <td>{p.fiyat}</td>
                  <td>{p.toplam}</td>
                </tr>
              ))}
              {Object.keys(parts.optional).map((key) =>
                selectedExtras[key] && parts.optional[key].map((p, idx) => (
                  <tr key={key + idx}>
                    <td>{p.kategori}</td>
                    <td>{p.urun_tip}</td>
                    <td>{p.birim}</td>
                    <td>{p.fiyat}</td>
                    <td>{p.toplam}</td>
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

          <div className="text-2xl font-bold text-center mt-6">Toplam: {calculateTotal()} TL (KDV Dahil)</div>
        </>
      )}

      {parts && (
        <div className="mt-6">
          <div className="extras mb-4">
            {["balata", "disk", "silecek"].map((extra) => (
              <label key={extra} className="mr-4">
                <input
                  type="checkbox"
                  checked={selectedExtras[extra]}
                  onChange={() => setSelectedExtras((prev) => ({ ...prev, [extra]: !prev[extra] }))}
                />{" "}
                {extra.toUpperCase()}
              </label>
            ))}
          </div>

          <div className="flex gap-4">
            <input
              type="text"
              name="adSoyad"
              placeholder="Ad Soyad"
              className="border p-2 rounded"
              value={userData.adSoyad}
              onChange={(e) => setUserData({ ...userData, adSoyad: e.target.value })}
            />
            <input
              type="text"
              name="plaka"
              placeholder="Plaka"
              className="border p-2 rounded"
              value={userData.plaka}
              onChange={(e) => setUserData({ ...userData, plaka: e.target.value })}
            />
            <button onClick={handlePdfDownload} className="button">
              📄 Teklifi PDF Al
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
