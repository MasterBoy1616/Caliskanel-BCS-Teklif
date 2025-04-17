import React, { useEffect, useState } from "react";
import axios from "axios";
import './App.css';

const FiyatSorgulama = () => {
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [parts, setParts] = useState(null);
  const [selectedExtras, setSelectedExtras] = useState({
    balata: false,
    disk: false,
    silecek: false
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
      axios.get(`/api/parts?brand=${selectedBrand}&model=${selectedModel}`)
        .then((res) => setParts(res.data));
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

  return (
    <div className="app-background">
      <div className="app-container">
        <h2>Periyodik Bakım Fiyat Sorgulama</h2>
        <div className="selectors">
          <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
            <option value="">Marka Seç</option>
            {brands.map(b => <option key={b}>{b}</option>)}
          </select>
          <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} disabled={!selectedBrand}>
            <option value="">Model Seç</option>
            {models.map(m => <option key={m}>{m}</option>)}
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
                  <th>Fiyat</th>
                  <th>Toplam</th>
                </tr>
              </thead>
              <tbody>
                {parts.baseParts.map((p, i) => (
                  <tr key={i}>
                    <td>{p.kategori}</td>
                    <td>{p.urun_tip}</td>
                    <td>{p.birim}</td>
                    <td>{p.fiyat} TL</td>
                    <td>{p.toplam} TL</td>
                  </tr>
                ))}
                {Object.entries(parts.optional).map(([key, items]) =>
                  selectedExtras[key]
                    ? items.map((p, i) => (
                      <tr key={`${key}-${i}`}>
                        <td>{p.kategori}</td>
                        <td>{p.urun_tip}</td>
                        <td>{p.birim}</td>
                        <td>{p.fiyat} TL</td>
                        <td>{p.toplam} TL</td>
                      </tr>
                    )) : null
                )}
                <tr>
                  <td>{parts.labor.kategori}</td>
                  <td>{parts.labor.urun_tip}</td>
                  <td>{parts.labor.birim}</td>
                  <td>{parts.labor.fiyat} TL</td>
                  <td>{parts.labor.toplam} TL</td>
                </tr>
              </tbody>
            </table>

            <h3>Toplam: {calculateTotal()} TL</h3>
          </>
        )}

        <div className="extras">
          {["balata", "disk", "silecek"].map(opt => (
            <label key={opt}>
              <input
                type="checkbox"
                checked={selectedExtras[opt]}
                onChange={() => setSelectedExtras(prev => ({ ...prev, [opt]: !prev[opt] }))}
              />
              {opt.toUpperCase()}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FiyatSorgulama;
