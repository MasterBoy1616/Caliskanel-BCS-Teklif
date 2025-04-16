import React, { useEffect, useState } from "react";
import axios from "axios";

const FiyatSorgulama = () => {
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [parts, setParts] = useState(null);
  const [selectedExtras, setSelectedExtras] = useState({
    buji: false,
    balata: false,
    disk: false,
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
      axios
        .get(`/api/parts?brand=${selectedBrand}&model=${selectedModel}`)
        .then((res) => setParts(res.data));
    }
  }, [selectedBrand, selectedModel]);

  const calculateTotal = () => {
    if (!parts) return 0;
    let total = 0;
    parts.baseParts.forEach(p => total += p.price);
    Object.keys(selectedExtras).forEach(key => {
      if (selectedExtras[key]) {
        parts.optional[key].forEach(p => total += p.price);
      }
    });
    total += parts.labor.price;
    return total;
  };

  return (
    <div style={{ padding: 24, maxWidth: 700, margin: "0 auto" }}>
      <h2>Periyodik Bakım Fiyat Sorgulama</h2>
      <div>
        <label>Marka:</label>
        <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
          <option value="">Seçiniz</option>
          {brands.map((b) => (
            <option key={b}>{b}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Model:</label>
        <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} disabled={!selectedBrand}>
          <option value="">Seçiniz</option>
          {models.map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>
      </div>

      {parts && (
        <>
          <h3>Parçalar</h3>
          <ul>
            {parts.baseParts.map((p) => (
              <li key={p.name}>{p.name} – {p.price.toLocaleString()} TL</li>
            ))}
          </ul>

          <h4>Ekstra</h4>
          {Object.entries(parts.optional).map(([key, group]) => (
            <div key={key}>
              <label>
                <input
                  type="checkbox"
                  checked={selectedExtras[key]}
                  onChange={() =>
                    setSelectedExtras((prev) => ({ ...prev, [key]: !prev[key] }))
                  }
                />
                {key.toUpperCase()}
              </label>
            </div>
          ))}

          <h3>Periyodik Bakım İşçiliği: {parts.labor.price.toLocaleString()} TL</h3>
          <h2>Toplam: {calculateTotal().toLocaleString()} TL</h2>

          <button onClick={() => alert("Teklif al formu yakında!")}>Teklif Al</button>
          <button onClick={() => alert("Randevu al formu yakında!")}>Randevu Al</button>
        </>
      )}
    </div>
  );
};

export default FiyatSorgulama;
