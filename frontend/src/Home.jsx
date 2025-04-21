import React, { useEffect, useState } from "react";
import axios from "axios";
import "./app.css";

function Home() {
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [parts, setParts] = useState([]);
  const [selectedParts, setSelectedParts] = useState([]);
  const [name, setName] = useState("");
  const [plate, setPlate] = useState("");

  useEffect(() => {
    axios.get("/api/brands").then((res) => setBrands(res.data));
  }, []);

  useEffect(() => {
    if (selectedBrand) {
      axios.get(`/api/models/${selectedBrand}`).then((res) => setModels(res.data));
    }
  }, [selectedBrand]);

  useEffect(() => {
    if (selectedModel) {
      axios.get(`/api/parts/${selectedModel}`).then((res) => setParts(res.data));
    }
  }, [selectedModel]);

  const handleGeneratePDF = () => {
    // Buraya daha sonra pdf oluşturma fonksiyonunu yazacağız
    alert("PDF oluşturma yakında eklenecek!");
  };

  const totalPrice = selectedParts.reduce((total, part) => total + (part.fiyat || 0), 0);

  return (
    <div className="app-background">
      <div className="app-container">
        <h1>Çalışkanel Bosch Car Servis</h1>

        <div className="selectors">
          <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
            <option value="">Marka Seç</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>

          <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
            <option value="">Model Seç</option>
            {models.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>

        <div className="parts-section">
          {parts.map((part, index) => (
            <div key={index}>
              <input
                type="checkbox"
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedParts([...selectedParts, part]);
                  } else {
                    setSelectedParts(selectedParts.filter((p) => p !== part));
                  }
                }}
              />
              {part.kategori} - {part.urun_tip} - {part.birim} - {part.fiyat?.toLocaleString()} TL
            </div>
          ))}
        </div>

        <div className="user-inputs">
          <input
            type="text"
            placeholder="İsim Soyisim"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Plaka"
            value={plate}
            onChange={(e) => setPlate(e.target.value)}
          />
        </div>

        <div className="total-price">
          <strong>Toplam: {totalPrice.toLocaleString()} TL</strong>
        </div>

        <button className="button" onClick={handleGeneratePDF}>
          PDF Teklif Al
        </button>
      </div>
    </div>
  );
}

export default Home;
