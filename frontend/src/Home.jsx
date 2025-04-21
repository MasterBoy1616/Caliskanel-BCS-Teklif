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
    parts.baseParts.forEach((p) => (total += p.toplam));
    Object.keys(selectedExtras).forEach((key) => {
      if (selectedExtras[key]) {
        parts.optional[key].forEach((p) => (total += p.toplam));
      }
    });
    total += parts.labor.toplam;
    return total;
  };

  const handlePdfGenerate = () => {
    generatePdf(selectedBrand, selectedModel, parts, selectedExtras);
  };

  return (
    <div className="app-background">
      <div className="app-container">
        <h1>Çalışkanel Bosch Car Servis</h1>
        <div className="selectors">
          <select
            value={selectedBrand}
            onChange={(e) => {
              setSelectedBrand(e.target.value);
              setSelectedModel("");
              setParts(null);
            }}
          >
            <option value="">Marka Seç</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>

          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            disabled={!selectedBrand}
          >
            <option value="">Model Seç</option>
            {models.map((model) => (
              <option key={model} value={model}>
                {model}
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

            <div style={{ marginTop: "20px", fontSize: "20px", fontWeight: "bold" }}>
              Toplam: {calculateTotal().toLocaleString()} TL (KDV Dahil)
            </div>

            <div className="extras" style={{ marginTop: "20px" }}>
              {["balata", "disk", "silecek"].map((extra) => (
                <label key={extra}>
                  <input
                    type="checkbox"
                    checked={selectedExtras[extra]}
                    onChange={() =>
                      setSelectedExtras((prev) => ({
                        ...prev,
                        [extra]: !prev[extra],
                      }))
                    }
                  />
                  {extra.toUpperCase()}
                </label>
              ))}
            </div>

            <button className="button" style={{ marginTop: "20px" }} onClick={handlePdfGenerate}>
              📄 Teklifi PDF Olarak Al
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
