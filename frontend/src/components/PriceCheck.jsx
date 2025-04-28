import React, { useState, useEffect } from "react";
import axios from "axios";
import "./index.css";

const PriceCheck = () => {
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [parts, setParts] = useState(null);

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
    let total = parts.baseParts.reduce((sum, p) => sum + p.toplam, 0) + parts.labor.toplam;
    return total;
  };

  return (
    <div className="container">
      <h1>Periyodik Bakım Fiyatı</h1>

      <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
        <option value="">Marka Seç</option>
        {brands.map((brand) => (
          <option key={brand} value={brand}>{brand}</option>
        ))}
      </select>

      <select
        value={selectedModel}
        onChange={(e) => setSelectedModel(e.target.value)}
        disabled={!selectedBrand}
      >
        <option value="">Model Seç</option>
        {models.map((model) => (
          <option key={model} value={model}>{model}</option>
        ))}
      </select>

      {parts && (
        <div className="price-summary">
          Toplam: {calculateTotal()} TL (KDV Dahil)
        </div>
      )}
    </div>
  );
};

export default PriceCheck;
