import React, { useEffect, useState } from "react";
import axios from "axios";

const Admin = () => {
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [parts, setParts] = useState([]);
  const [optionalParts, setOptionalParts] = useState([]);
  const [labor, setLabor] = useState(null);
  const [percentage, setPercentage] = useState(0);

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
        setParts(res.data.baseParts || []);
        setOptionalParts([
          ...(res.data.optional?.balata || []),
          ...(res.data.optional?.disk || []),
          ...(res.data.optional?.silecek || []),
        ]);
        setLabor(res.data.labor);
      });
    }
  }, [selectedBrand, selectedModel]);

  const applyPercentage = () => {
    const factor = 1 + percentage / 100;
    setParts(parts.map(p => ({ ...p, fiyat: Math.round(p.fiyat * factor), toplam: Math.round(p.toplam * factor) })));
    setOptionalParts(optionalParts.map(p => ({ ...p, fiyat: Math.round(p.fiyat * factor), toplam: Math.round(p.toplam * factor) })));
    if (labor) {
      setLabor({ ...labor, fiyat: Math.round(labor.fiyat * factor), toplam: Math.round(labor.toplam * factor) });
    }
  };

  const savePrices = async () => {
    try {
      const payload = {
        brand: selectedBrand,
        model: selectedModel,
        parts,
        optionalParts,
        labor,
      };
      await axios.post("/api/save-prices", payload);
      alert("Fiyatlar başarıyla kaydedildi ✅");
    } catch (error) {
      console.error(error);
      alert("Hata oluştu ❌");
    }
  };

  return (
    <div className="app-background">
      <div className="app-container">
        <h1 className="text-3xl font-bold mb-6">Admin Paneli</h1>

        <div className="selectors">
          <select value={selectedBrand} onChange={(e) => {
            setSelectedBrand(e.target.value);
            setSelectedModel("");
            setParts([]);
            setOptionalParts([]);
            setLabor(null);
          }}>
            <option value="">Marka Seç</option>
            {brands.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>

          <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} disabled={!selectedBrand}>
            <option value="">Model Seç</option>
            {models.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="mt-4">
          <label>% Yüzde Arttır / Azalt:</label>
          <input
            type="number"
            value={percentage}
            onChange={(e) => setPercentage(parseFloat(e.target.value))}
            className="border p-1 ml-2"
          />
          <button onClick={applyPercentage} className="button ml-4">Yüzdeyi Uygula</button>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Parçalar</h2>
          {parts.map((p, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <span className="w-1/3">{p.urun_tip}</span>
              <input
                type="number"
                value={p.fiyat}
                onChange={(e) => {
                  const updated = [...parts];
                  updated[idx].fiyat = Number(e.target.value);
                  updated[idx].toplam = Math.round(updated[idx].fiyat * p.birim);
                  setParts(updated);
                }}
                className="border p-1 w-1/3"
              />
            </div>
          ))}
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Opsiyonel Parçalar</h2>
          {optionalParts.map((p, idx) => (
            <div key={idx} className="flex gap-2 mb-2">
              <span className="w-1/3">{p.urun_tip}</span>
              <input
                type="number"
                value={p.fiyat}
                onChange={(e) => {
                  const updated = [...optionalParts];
                  updated[idx].fiyat = Number(e.target.value);
                  updated[idx].toplam = Math.round(updated[idx].fiyat * p.birim);
                  setOptionalParts(updated);
                }}
                className="border p-1 w-1/3"
              />
            </div>
          ))}
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">İşçilik</h2>
          {labor && (
            <div className="flex gap-2 mb-2">
              <span className="w-1/3">{labor.urun_tip}</span>
              <input
                type="number"
                value={labor.fiyat}
                onChange={(e) => {
                  setLabor({
                    ...labor,
                    fiyat: Number(e.target.value),
                    toplam: Math.round(Number(e.target.value) * labor.birim)
                  });
                }}
                className="border p-1 w-1/3"
              />
            </div>
          )}
        </div>

        <button onClick={savePrices} className="button mt-6 w-full">Kaydet</button>
      </div>
    </div>
  );
};

export default Admin;
