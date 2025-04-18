import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminPanel = () => {
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [parts, setParts] = useState(null);
  const [percentage, setPercentage] = useState(0);
  const [message, setMessage] = useState("");

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
      axios.get(`/api/parts?brand=${selectedBrand}&model=${selectedModel}`).then((res) => {
        setParts(res.data);
      });
    }
  }, [selectedBrand, selectedModel]);

  const handlePriceChange = (type, index, key, value) => {
    setParts(prev => {
      const updated = { ...prev };
      if (type === "baseParts") {
        updated.baseParts[index][key] = parseFloat(value) || 0;
        updated.baseParts[index].toplam = updated.baseParts[index].fiyat * updated.baseParts[index].birim;
      } else if (type === "optional") {
        updated.optional[key][index].fiyat = parseFloat(value) || 0;
        updated.optional[key][index].toplam = updated.optional[key][index].fiyat * updated.optional[key][index].birim;
      } else if (type === "labor") {
        updated.labor[key] = parseFloat(value) || 0;
        updated.labor.toplam = updated.labor.fiyat * updated.labor.birim;
      }
      return updated;
    });
  };

  const handleApplyPercentage = () => {
    if (!parts) return;
    const rate = (percentage / 100);

    const updatePrice = (p) => {
      p.fiyat = Math.round(p.fiyat * (1 + rate));
      p.toplam = Math.round(p.fiyat * p.birim);
    };

    setParts(prev => {
      const updated = { ...prev };
      updated.baseParts.forEach(updatePrice);
      Object.keys(updated.optional).forEach(key => {
        updated.optional[key].forEach(updatePrice);
      });
      updatePrice(updated.labor);
      return updated;
    });
  };

  const handleSave = async () => {
    try {
      await axios.post("/api/save-prices", parts);
      setMessage("✔️ Fiyatlar başarıyla kaydedildi!");
    } catch (error) {
      console.error(error);
      setMessage("❌ Fiyat kaydederken hata oluştu.");
    }
    setTimeout(() => setMessage(""), 4000);
  };

  return (
    <div className="app-container">
      <h1 className="text-2xl font-bold mb-4">Admin Panel - Fiyat Güncelle</h1>

      <div className="selectors">
        <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
          <option value="">Marka Seç</option>
          {brands.map(b => <option key={b} value={b}>{b}</option>)}
        </select>

        <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} disabled={!selectedBrand}>
          <option value="">Model Seç</option>
          {models.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      </div>

      {parts && (
        <>
          <div className="mb-4">
            <input
              type="number"
              placeholder="% Değişim"
              value={percentage}
              onChange={(e) => setPercentage(e.target.value)}
              className="border p-2 mr-2 rounded"
            />
            <button className="button" onClick={handleApplyPercentage}>Toplu Yüzde Uygula</button>
          </div>

          <table>
            <thead>
              <tr>
                <th>Kategori</th>
                <th>Ürün</th>
                <th>Birim</th>
                <th>Fiyat</th>
                <th>Toplam</th>
              </tr>
            </thead>
            <tbody>
              {parts.baseParts.map((p, i) => (
                <tr key={i}>
                  <td>{p.kategori}</td>
                  <td>{p.urun_tip}</td>
                  <td>{p.birim}</td>
                  <td>
                    <input
                      type="number"
                      value={p.fiyat}
                      onChange={(e) => handlePriceChange("baseParts", i, "fiyat", e.target.value)}
                      className="border p-1 w-24 rounded"
                    />
                  </td>
                  <td>{p.toplam} TL</td>
                </tr>
              ))}
              {Object.keys(parts.optional).flatMap((key) =>
                parts.optional[key].map((p, i) => (
                  <tr key={`${key}-${i}`}>
                    <td>{p.kategori}</td>
                    <td>{p.urun_tip}</td>
                    <td>{p.birim}</td>
                    <td>
                      <input
                        type="number"
                        value={p.fiyat}
                        onChange={(e) => handlePriceChange("optional", i, key, e.target.value)}
                        className="border p-1 w-24 rounded"
                      />
                    </td>
                    <td>{p.toplam} TL</td>
                  </tr>
                ))
              )}
              <tr className="font-bold">
                <td>{parts.labor.kategori}</td>
                <td>{parts.labor.urun_tip}</td>
                <td>{parts.labor.birim}</td>
                <td>
                  <input
                    type="number"
                    value={parts.labor.fiyat}
                    onChange={(e) => handlePriceChange("labor", null, "fiyat", e.target.value)}
                    className="border p-1 w-24 rounded"
                  />
                </td>
                <td>{parts.labor.toplam} TL</td>
              </tr>
            </tbody>
          </table>

          <div className="mt-6 flex gap-4">
            <button className="button" onClick={handleSave}>Kaydet</button>
          </div>

          {message && <div className="mt-4 text-green-600">{message}</div>}
        </>
      )}
    </div>
  );
};

export default AdminPanel;
