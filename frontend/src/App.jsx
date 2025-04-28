// frontend/src/App.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [parts, setParts] = useState(null);

  useEffect(() => {
    axios.get("/api/brands")
      .then((res) => setBrands(res.data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (selectedBrand) {
      axios.get(`/api/models?brand=${selectedBrand}`)
        .then((res) => setModels(res.data))
        .catch((err) => console.error(err));
    }
  }, [selectedBrand]);

  useEffect(() => {
    if (selectedBrand && selectedModel) {
      axios.get(`/api/parts?brand=${selectedBrand}&model=${selectedModel}`)
        .then((res) => setParts(res.data))
        .catch((err) => console.error(err));
    }
  }, [selectedBrand, selectedModel]);

  const calculateTotal = () => {
    if (!parts) return 0;
    let total = 0;
    parts.baseParts.forEach(p => total += p.toplam);
    total += parts.labor.toplam;
    return total;
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h1>Çalışkanel Oto | Periyodik Bakım Fiyat Sorgulama</h1>
      <div style={{ margin: "20px 0" }}>
        <select
          value={selectedBrand}
          onChange={(e) => {
            setSelectedBrand(e.target.value);
            setSelectedModel("");
            setParts(null);
          }}
          style={{ marginRight: 10 }}
        >
          <option value="">Marka Seçin</option>
          {brands.map((brand, idx) => (
            <option key={idx} value={brand}>{brand}</option>
          ))}
        </select>

        <select
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          disabled={!selectedBrand}
        >
          <option value="">Model Seçin</option>
          {models.map((model, idx) => (
            <option key={idx} value={model}>{model}</option>
          ))}
        </select>
      </div>

      {parts && (
        <>
          <h2>Parçalar</h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #ddd", padding: 8 }}>Kategori</th>
                <th style={{ border: "1px solid #ddd", padding: 8 }}>Ürün</th>
                <th style={{ border: "1px solid #ddd", padding: 8 }}>Birim</th>
                <th style={{ border: "1px solid #ddd", padding: 8 }}>Fiyat (TL)</th>
                <th style={{ border: "1px solid #ddd", padding: 8 }}>Toplam (TL)</th>
              </tr>
            </thead>
            <tbody>
              {parts.baseParts.map((item, idx) => (
                <tr key={idx}>
                  <td style={{ border: "1px solid #ddd", padding: 8 }}>{item.kategori}</td>
                  <td style={{ border: "1px solid #ddd", padding: 8 }}>{item.urun_tip}</td>
                  <td style={{ border: "1px solid #ddd", padding: 8 }}>{item.birim}</td>
                  <td style={{ border: "1px solid #ddd", padding: 8 }}>{item.fiyat}</td>
                  <td style={{ border: "1px solid #ddd", padding: 8 }}>{item.toplam}</td>
                </tr>
              ))}
              <tr>
                <td style={{ border: "1px solid #ddd", padding: 8 }}>{parts.labor.kategori}</td>
                <td style={{ border: "1px solid #ddd", padding: 8 }}>{parts.labor.urun_tip}</td>
                <td style={{ border: "1px solid #ddd", padding: 8 }}>{parts.labor.birim}</td>
                <td style={{ border: "1px solid #ddd", padding: 8 }}>{parts.labor.fiyat}</td>
                <td style={{ border: "1px solid #ddd", padding: 8 }}>{parts.labor.toplam}</td>
              </tr>
            </tbody>
          </table>

          <h2 style={{ marginTop: 20 }}>Toplam Fiyat: {calculateTotal()} TL (KDV Dahil)</h2>
        </>
      )}
    </div>
  );
}

export default App;
