import React, { useState } from "react";
import { generatePDF } from "./pdfGenerator";

const brands = {
  "Fiat": ["Egea", "Doblo", "Fiorino"],
  "Renault": ["Clio", "Megane", "Symbol"],
};

const parts = [
  { name: "Motor Yağı", price: 1200 },
  { name: "Yağ Filtresi", price: 400 },
  { name: "Hava Filtresi", price: 300 },
  { name: "Polen Filtresi", price: 350 },
  { name: "Yakıt Filtresi", price: 450 },
];

const extras = [
  { name: "Balata", price: 1200 },
  { name: "Disk", price: 1500 },
  { name: "Silecek", price: 500 },
];

function Home() {
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedExtras, setSelectedExtras] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [plate, setPlate] = useState("");

  const totalPrice = parts.reduce((acc, part) => acc + part.price, 0) + 
    selectedExtras.reduce((acc, extra) => acc + extra.price, 0);

  const handlePDF = () => {
    if (!selectedBrand || !selectedModel || !customerName || !plate) {
      alert("Lütfen tüm alanları doldurun!");
      return;
    }
    generatePDF({
      customerName,
      plate,
      brand: selectedBrand,
      model: selectedModel,
      parts,
      extras: selectedExtras,
      totalPrice
    });
  };

  return (
    <div className="container">
      <h1 className="title">Çalışkanel Bosch Car Servis</h1>
      <p className="subtitle">Periyodik Bakım Teklif Formu</p>

      <div className="form">
        <input
          type="text"
          placeholder="İsim Soyisim"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Plaka"
          value={plate}
          onChange={(e) => setPlate(e.target.value)}
        />

        <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
          <option value="">Marka Seçin</option>
          {Object.keys(brands).map((brand) => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>

        {selectedBrand && (
          <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
            <option value="">Model Seçin</option>
            {brands[selectedBrand].map((model) => (
              <option key={model} value={model}>{model}</option>
            ))}
          </select>
        )}

        <div className="extras">
          {extras.map((extra) => (
            <label key={extra.name}>
              <input
                type="checkbox"
                checked={selectedExtras.includes(extra)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedExtras([...selectedExtras, extra]);
                  } else {
                    setSelectedExtras(selectedExtras.filter(x => x.name !== extra.name));
                  }
                }}
              />
              {extra.name}
            </label>
          ))}
        </div>
      </div>

      <div className="total">
        Toplam: {totalPrice.toLocaleString("tr-TR")} TL
      </div>

      <button className="generate-btn" onClick={handlePDF}>
        Teklifi PDF Olarak Al
      </button>
    </div>
  );
}

export default Home;
