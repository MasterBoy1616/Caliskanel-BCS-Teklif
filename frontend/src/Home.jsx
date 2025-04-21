import React, { useState, useEffect } from "react";
import axios from "axios";
import { generatePdf } from "./pdfGenerator";
import "./SpotliraTheme.css";

function Home() {
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [parts, setParts] = useState([]);
  const [name, setName] = useState("");
  const [plate, setPlate] = useState("");

  useEffect(() => {
    axios.get("/api/brands").then((res) => {
      setBrands(res.data);
    });
  }, []);

  useEffect(() => {
    if (selectedBrand) {
      axios.get(`/api/models?brand=${selectedBrand}`).then((res) => {
        setModels(res.data);
      });
    }
  }, [selectedBrand]);

  useEffect(() => {
    if (selectedBrand && selectedModel) {
      axios.get(`/api/parts?brand=${selectedBrand}&model=${selectedModel}`).then((res) => {
        const allParts = [...res.data.baseParts, res.data.labor];
        setParts(allParts);
      });
    }
  }, [selectedModel]);

  const calculateTotal = () => {
    return parts.reduce((sum, part) => sum + part.toplam, 0);
  };

  const handlePdfDownload = () => {
    if (selectedBrand && selectedModel) {
      generatePdf(selectedBrand, selectedModel, name, plate, parts, calculateTotal());
    }
  };

  return (
    <div className="app-background">
      <div className="logo-container">
        <img src="/logo-bosch.png" alt="Bosch Logo" className="logo" />
        <img src="/logo-caliskanel.png" alt="Çalışkanel Logo" className="logo" />
      </div>
      <div className="app-container">
        <div className="selectors">
          <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
            <option value="">Marka Seçin</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
          <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
            <option value="">Model Seçin</option>
            {models.map((model) => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>
        </div>
        <table>
          <thead>
            <tr>
              <th>Ürün / İşçilik</th>
              <th>Adet</th>
              <th>Birim Fiyat (TL)</th>
              <th>Toplam (TL)</th>
            </tr>
          </thead>
          <tbody>
            {parts.map((item, idx) => (
              <tr key={idx}>
                <td>{item.urun_tip}</td>
                <td>{item.birim}</td>
                <td>{item.fiyat}</td>
                <td>{item.toplam}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="total-amount">
          Toplam: {calculateTotal()} TL
        </div>
        <div className="info-fields">
          <input type="text" placeholder="İsim Soyisim" value={name} onChange={(e) => setName(e.target.value)} />
          <input type="text" placeholder="Plaka" value={plate} onChange={(e) => setPlate(e.target.value)} />
        </div>
        <button className="button" onClick={handlePdfDownload}>PDF Teklif Al</button>
      </div>
    </div>
  );
}

export default Home;
