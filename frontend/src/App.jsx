import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
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

  return (
    <div className="container">
      <h1>Çalışkanel BCS Periyodik Bakım Fiyat Sorgulama</h1>
      <div className="selection">
        <select value={selectedBrand} onChange={e => setSelectedBrand(e.target.value)}>
          <option value="">Marka Seç</option>
          {brands.map(b => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>

        <select value={selectedModel} onChange={e => setSelectedModel(e.target.value)} disabled={!selectedBrand}>
          <option value="">Model Seç</option>
          {models.map(m => (
            <option key={m} value={m}>{m}</option>
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
              <tr>
                <td colSpan="4"><strong>İşçilik</strong></td>
                <td><strong>{parts.labor.toplam} TL</strong></td>
              </tr>
            </tbody>
          </table>
          <h2>Toplam: {parts.baseParts.reduce((acc, p) => acc + p.toplam, 0) + parts.labor.toplam} TL (KDV Dahil)</h2>
        </>
      )}
    </div>
  );
};

export default App;
