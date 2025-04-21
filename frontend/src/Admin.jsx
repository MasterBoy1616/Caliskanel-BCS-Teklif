import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import axios from "axios";

function Admin() {
  const [tab, setTab] = useState("dashboard");
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [parts, setParts] = useState([]);
  const [labor, setLabor] = useState(null);
  const [increasePercent, setIncreasePercent] = useState(0);

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
        setParts(res.data.baseParts);
        setLabor(res.data.labor);
      });
    }
  }, [selectedBrand, selectedModel]);

  const handlePriceChange = (index, value) => {
    const newParts = [...parts];
    newParts[index].fiyat = parseFloat(value) || 0;
    newParts[index].toplam = Math.round(newParts[index].fiyat * newParts[index].birim);
    setParts(newParts);
  };

  const handleLaborChange = (value) => {
    if (labor) {
      const newLabor = { ...labor, fiyat: parseFloat(value) || 0, toplam: Math.round((parseFloat(value) || 0) * labor.birim) };
      setLabor(newLabor);
    }
  };

  const handleApplyIncrease = () => {
    const factor = 1 + increasePercent / 100;
    const newParts = parts.map((p) => ({
      ...p,
      fiyat: Math.round(p.fiyat * factor),
      toplam: Math.round(p.fiyat * factor * p.birim),
    }));
    const newLabor = labor
      ? {
          ...labor,
          fiyat: Math.round(labor.fiyat * factor),
          toplam: Math.round(labor.fiyat * factor * labor.birim),
        }
      : null;
    setParts(newParts);
    setLabor(newLabor);
  };

  const handleSave = () => {
    const data = {
      parts,
      labor,
    };
    axios
      .post("/api/save-prices", data)
      .then(() => alert("✅ Fiyatlar kaydedildi!"))
      .catch(() => alert("❌ Kaydederken hata oluştu!"));
  };

  const chartData = {
    labels: ["Fiyat Bakmalar", "Randevular"],
    datasets: [
      {
        label: "Adet",
        backgroundColor: ["#4ade80", "#60a5fa"],
        data: [12, 5],
      },
    ],
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Çalışkanel Admin Paneli</h2>

      <div className="flex gap-4 mb-6">
        <button onClick={() => setTab("dashboard")} className="p-2 bg-blue-500 text-white rounded">
          Dashboard
        </button>
        <button onClick={() => setTab("price")} className="p-2 bg-green-500 text-white rounded">
          Fiyat Yönetimi
        </button>
      </div>

      {tab === "dashboard" && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold mb-4">İstatistikler</h3>
          <Bar data={chartData} />
        </div>
      )}

      {tab === "price" && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex gap-4 mb-4">
            <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)} className="border p-2 rounded">
              <option value="">Marka Seç</option>
              {brands.map((b, i) => (
                <option key={i} value={b}>
                  {b}
                </option>
              ))}
            </select>

            <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} disabled={!selectedBrand} className="border p-2 rounded">
              <option value="">Model Seç</option>
              {models.map((m, i) => (
                <option key={i} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {parts.length > 0 && (
            <>
              <table className="w-full border mb-4">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border p-2">Kategori</th>
                    <th className="border p-2">Ürün Tipi</th>
                    <th className="border p-2">Birim</th>
                    <th className="border p-2">Fiyat (TL)</th>
                  </tr>
                </thead>
                <tbody>
                  {parts.map((p, index) => (
                    <tr key={index}>
                      <td className="border p-2">{p.kategori}</td>
                      <td className="border p-2">{p.urun_tip}</td>
                      <td className="border p-2">{p.birim}</td>
                      <td className="border p-2">
                        <input
                          type="number"
                          value={p.fiyat}
                          onChange={(e) => handlePriceChange(index, e.target.value)}
                          className="border p-1 rounded w-24"
                        />
                      </td>
                    </tr>
                  ))}
                  {labor && (
                    <tr>
                      <td className="border p-2">{labor.kategori}</td>
                      <td className="border p-2">{labor.urun_tip}</td>
                      <td className="border p-2">{labor.birim}</td>
                      <td className="border p-2">
                        <input
                          type="number"
                          value={labor.fiyat}
                          onChange={(e) => handleLaborChange(e.target.value)}
                          className="border p-1 rounded w-24"
                        />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div className="flex items-center gap-4 mb-4">
                <input
                  type="number"
                  value={increasePercent}
                  onChange={(e) => setIncreasePercent(parseFloat(e.target.value))}
                  placeholder="% Arttır/İndir"
                  className="border p-2 rounded"
                />
                <button onClick={handleApplyIncrease} className="bg-yellow-400 hover:bg-yellow-500 text-white p-2 rounded">
                  Yüzdelik Uygula
                </button>
              </div>

              <button onClick={handleSave} className="bg-blue-500 hover:bg-blue-700 text-white p-2 rounded">
                Kaydet
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default Admin;
