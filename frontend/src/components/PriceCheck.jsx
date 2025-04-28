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
    axios.get("/api/brands").then((response) => {
      setBrands(response.data);
    });
  }, []);

  const fetchModels = (brand) => {
    axios.get(`/api/models?brand=${brand}`).then((response) => {
      setModels(response.data);
      setSelectedModel("");
      setParts(null);
    });
  };

  const fetchParts = (brand, model) => {
    axios.get(`/api/parts?brand=${brand}&model=${model}`).then((response) => {
      setParts(response.data);
    });
  };

  return (
    <div className="container">
      <h1>Çalışkanel BCS Periyodik Bakım Fiyat Sorgulama</h1>
      <select
        value={selectedBrand}
        onChange={(e) => {
          setSelectedBrand(e.target.value);
          fetchModels(e.target.value);
        }}
      >
        <option value="">Marka Seçiniz</option>
        {brands.map((brand) => (
          <option key={brand} value={brand}>
            {brand}
          </option>
        ))}
      </select>

      <select
        value={selectedModel}
        onChange={(e) => {
          setSelectedModel(e.target.value);
          fetchParts(selectedBrand, e.target.value);
        }}
        disabled={!selectedBrand}
      >
        <option value="">Model Seçiniz</option>
        {models.map((model) => (
          <option key={model} value={model}>
            {model}
          </option>
        ))}
      </select>

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
              {parts.baseParts.map((item, index) => (
                <tr key={index}>
                  <td>{item.kategori}</td>
                  <td>{item.urun_tip}</td>
                  <td>{item.birim}</td>
                  <td>{item.fiyat}</td>
                  <td>{item.toplam}</td>
                </tr>
              ))}
              <tr>
                <td><strong>İşçilik</strong></td>
                <td>{parts.labor.urun_tip}</td>
                <td>1</td>
                <td>{parts.labor.fiyat}</td>
                <td>{parts.labor.toplam}</td>
              </tr>
            </tbody>
          </table>

          <div className="total">
            Toplam: {parts.baseParts.reduce((acc, item) => acc + item.toplam, 0) + parts.labor.toplam} TL (KDV Dahil)
          </div>
        </>
      )}
    </div>
  );
};

export default PriceCheck;
