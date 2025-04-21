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
    }
  }, [selectedBrand, selectedModel]);

  const calculateTotal = () => {
    if (!parts) return 0;
    let total = 0;
    parts.baseParts.forEach((p) => total += p.toplam);
    Object.keys(selectedExtras).forEach((key) => {
      if (selectedExtras[key]) {
        parts.optional[key].forEach((p) => total += p.toplam);
      }
    });
    total += parts.labor.toplam;
    return total;
  };

  const handleGeneratePdf = () => {
    generatePdf(selectedBrand, selectedModel, parts, selectedExtras);
  };

  return (
    <div className="app-background">
      <div className="app-container">
        <h1>Periyodik Bakım Fiyatlandırması</h1>

        <div className="selectors">
          <select value={selectedBrand} onChange={(e) => {
            setSelectedBrand(e.target.value);
            setSelectedModel("");
            setParts(null);
          }}>
            <option value="">Marka Seçiniz</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>

          <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} disabled={!selectedBrand}>
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
                {parts.baseParts.map((part, index) => (
                  <tr key={index}>
                    <td>{part.kategori}</td>
                    <td>{part.urun_tip}</td>
                    <td>{part.birim}</td>
                    <td>{part.fiyat}</td>
                    <td>{part.toplam}</td>
                  </tr>
                ))}
                {Object.keys(parts.optional).map((key) => selectedExtras[key] &&
                  parts.optional[key].map((part, index) => (
                    <tr key={`${key}-${index}`}>
                      <td>{part.kategori}</td>
                      <td>{part.urun_tip}</td>
                      <td>{part.birim}</td>
                      <td>{part.fiyat}</td>
                      <td>{part.toplam}</td>
                    </tr>
                  ))
                )}
                <tr>
                  <td><b>İşçilik</b></td>
                  <td>{parts.labor.urun_tip}</td>
                  <td>{parts.labor.birim}</td>
                  <td>{parts.labor.fiyat}</td>
                  <td>{parts.labor.toplam}</td>
                </tr>
              </tbody>
            </table>

            <h2 style={{ marginTop: 20 }}>Toplam: {calculateTotal()} TL</h2>

            <div className="extras">
              {["balata", "disk", "silecek"].map((extra) => (
                <label key={extra}>
                  <input
                    type="checkbox"
                    checked={selectedExtras[extra]}
                    onChange={() => setSelectedExtras(prev => ({ ...prev, [extra]: !prev[extra] }))}
                  />
                  {" "}{extra.toUpperCase()}
                </label>
              ))}
            </div>

            <button className="button" onClick={handleGeneratePdf}>📄 Teklifi PDF Olarak İndir</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
