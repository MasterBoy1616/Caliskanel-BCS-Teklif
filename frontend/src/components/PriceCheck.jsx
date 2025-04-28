import React, { useState, useEffect } from "react";
import axios from "axios";

const PriceCheck = () => {
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [parts, setParts] = useState(null);

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
        setParts(res.data);
      });
    }
  }, [selectedBrand, selectedModel]);

  const calculateTotal = () => {
    if (!parts) return 0;
    let total = parts.baseParts.reduce((sum, item) => sum + item.toplam, 0);
    if (parts.labor) total += parts.labor.toplam;
    return total;
  };

  return (
    <div className="container">
      <h1>Çalışkanel BCS Periyodik Bakım Fiyat Sorgulama</h1>

      <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
        <option value="">Marka Seçin</option>
        {brands.map((brand) => (
          <option key={brand} value={brand}>
            {brand}
          </option>
        ))}
      </select>

      <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} disabled={!selectedBrand}>
        <option value="">Model Seçin</option>
        {models.map((model) => (
          <option key={model} value={model}>
            {model}
          </option>
        ))}
      </select>

      {parts && (
        <div className="overflow-x-auto">
          <table className="table-auto">
            <thead>
              <tr>
                <th>Kategori</th>
                <th>Ürün</th>
                <th>Birim</th>
                <th>Toplam (TL)</th>
              </tr>
            </thead>
            <tbody>
              {parts.baseParts.map((item, index) => (
                <tr key={index}>
                  <td>{item.kategori}</td>
                  <td>{item.urun_tip}</td>
                  <td>{item.birim}</td>
                  <td>{item.toplam} TL</td>
                </tr>
              ))}
              {parts.labor && (
                <tr>
                  <td>İşçilik</td>
                  <td>{parts.labor.urun_tip}</td>
                  <td>{parts.labor.birim}</td>
                  <td>{parts.labor.toplam} TL</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="total">
            Toplam: {calculateTotal()} TL (KDV Dahil)
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceCheck;
