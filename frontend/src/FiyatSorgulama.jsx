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
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
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
          <table border="1" cellPadding="6" style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                <th>Kategori</th>
                <th>Ürün/TİP</th>
                <th>Birim</th>
                <th>Birim Fiyat</th>
                <th>Toplam</th>
              </tr>
            </thead>
            <tbody>
              {parts.baseParts.map((p, i) => (
                <tr key={i}>
                  <td>{p.kategori}</td>
                  <td>{p.urun_tip}</td>
                  <td>{p.birim}</td>
                  <td>{p.fiyat.toLocaleString()} TL</td>
                  <td>{p.toplam.toLocaleString()} TL</td>
                </tr>
              ))}
              {Object.entries(parts.optional).map(([key, group]) =>
                selectedExtras[key]
                  ? group.map((p, i) => (
                      <tr key={`${key}-${i}`}>
                        <td>{p.kategori}</td>
                        <td>{p.urun_tip}</td>
                        <td>{p.birim}</td>
                        <td>{p.fiyat.toLocaleString()} TL</td>
                        <td>{p.toplam.toLocaleString()} TL</td>
                      </tr>
                    ))
                  : null
              )}
              <tr>
                <td>{parts.labor.kategori}</td>
                <td>{parts.labor.urun_tip}</td>
                <td>{parts.labor.birim}</td>
                <td>{parts.labor.fiyat.toLocaleString()} TL</td>
                <td>{parts.labor.toplam.toLocaleString()} TL</td>
              </tr>
            </tbody>
          </table>

          <h2 style={{ marginTop: 20 }}>Toplam: {calculateTotal().toLocaleString()} TL</h2>

          <button onClick={() => alert("Teklif formu yakında!")}>Teklif Al</button>
          <button onClick={() => alert("Randevu formu yakında!")}>Randevu Al</button>
        </>
      )}

      <div style={{ marginTop: 16 }}>
        <strong>Ekstra Seçenekler:</strong>
        {["buji", "balata", "disk"].map((opt) => (
          <label key={opt} style={{ marginLeft: 12 }}>
            <input
              type="checkbox"
              checked={selectedExtras[opt]}
              onChange={() =>
                setSelectedExtras((prev) => ({ ...prev, [opt]: !prev[opt] }))
              }
            />
            {opt.toUpperCase()}
          </label>
        ))}
      </div>
    </div>
  );
};

export default FiyatSorgulama;
