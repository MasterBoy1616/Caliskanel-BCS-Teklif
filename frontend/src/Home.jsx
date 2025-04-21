import React, { useEffect, useState } from "react";
import axios from "axios";
import { generatePdf } from "./pdfGenerator";
import "./App.css";

const Home = () => {
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [parts, setParts] = useState(null);

  useEffect(() => {
    axios.get("/api/brands").then(res => setBrands(res.data));
  }, []);

  useEffect(() => {
    if (selectedBrand) {
      axios.get(`/api/models?brand=${selectedBrand}`).then(res => setModels(res.data));
    }
  }, [selectedBrand]);

  useEffect(() => {
    if (selectedBrand && selectedModel) {
      axios.get(`/api/parts?brand=${selectedBrand}&model=${selectedModel}`).then(res => setParts(res.data));
    }
  }, [selectedBrand, selectedModel]);

  const calculateTotal = () => {
    if (!parts) return 0;
    let total = 0;
    parts.baseParts.forEach(p => total += p.toplam);
    total += parts.labor.toplam;
    return total;
  };

  const handlePdf = () => {
    generatePdf(selectedBrand, selectedModel, parts);
  };

  return (
    <div className="app-background">
      <div className="app-container">
        <img src="/logo-bosch.png" alt="Bosch Logo" style={{ height: 50, marginBottom: 20 }} />
        <img src="/logo-caliskanel.png" alt="Caliskanel Logo" style={{ height: 50, marginBottom: 20, marginLeft: 20 }} />

        <h1>Çalışkanel Bosch Car Servis</h1>
        <h2>Periyodik Bakım Fiyat Sorgulama</h2>

        <div className="selectors">
          <select onChange={(e) => { setSelectedBrand(e.target.value); setSelectedModel(""); setParts(null); }}>
            <option value="">Marka Seç</option>
            {brands.map((b, i) => <option key={i} value={b}>{b}</option>)}
          </select>

          <select onChange={(e) => setSelectedModel(e.target.value)} value={selectedModel} disabled={!selectedBrand}>
            <option value="">Model Seç</option>
            {models.map((m, i) => <option key={i} value={m}>{m}</option>)}
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
                <tr style={{ fontWeight: "bold" }}>
                  <td>{parts.labor.kategori}</td>
                  <td>{parts.labor.urun_tip}</td>
                  <td>{parts.labor.birim}</td>
                  <td>{parts.labor.fiyat}</td>
                  <td>{parts.labor.toplam}</td>
                </tr>
              </tbody>
            </table>

            <div className="total">
              Toplam: {calculateTotal()} TL (KDV Dahil)
            </div>

            <button className="button" onClick={handlePdf}>
              📄 Teklifi PDF Olarak İndir
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
