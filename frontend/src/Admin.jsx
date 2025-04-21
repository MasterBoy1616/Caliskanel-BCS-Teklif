import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [parts, setParts] = useState([]);

  useEffect(() => {
    axios.get("/api/brands").then((res) => setBrands(res.data));
  }, []);

  useEffect(() => {
    if (selectedBrand) {
      axios.get(`/api/models?brand=${selectedBrand}`).then((res) => setModels(res.data));
    }
  }, [selectedBrand]);

  const fetchParts = () => {
    if (selectedBrand && selectedModel) {
      axios.get(`/api/parts?brand=${selectedBrand}&model=${selectedModel}`).then((res) => {
        setParts(res.data.baseParts || []);
      });
    }
  };

  const chartData = {
    labels: ["Fiyat Bakma", "Randevu Alma"],
    datasets: [
      {
        label: "Log Verileri",
        data: [50, 20], // Örnek veri (istersen api'den çekilir)
        backgroundColor: ["#4F46E5", "#22C55E"],
      },
    ],
  };

  const handlePriceChange = (index, value) => {
    const newParts = [...parts];
    newParts[index].fiyat = Number(value);
    newParts[index].toplam = Number(newParts[index].birim) * Number(value);
    setParts(newParts);
  };

  const savePrices = () => {
    axios
      .post("/api/save-prices", { parts })
      .then(() => alert("Fiyatlar güncellendi ✅"))
      .catch(() => alert("Fiyatları kaydederken hata oluştu ❌"));
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Çalışkanel Admin Panel</h1>

      {/* Sekmeler */}
      <div className="flex justify-center mb-8 gap-6">
        <button onClick={() => setActiveTab("dashboard")} className={`p-2 ${activeTab === "dashboard" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>Dashboard</button>
        <button onClick={() => setActiveTab("price")} className={`p-2 ${activeTab === "price" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>Fiyat Yönetimi</button>
      </div>

      {/* Dashboard */}
      {activeTab === "dashboard" && (
        <div className="flex justify-center">
          <div className="w-full md:w-1/2">
            <Bar data={chartData} />
          </div>
        </div>
      )}

      {/* Fiyat Yönetimi */}
      {activeTab === "price" && (
        <>
          <div className="flex gap-4 mb-4">
            <select
              value={selectedBrand}
              onChange={(e) => {
                setSelectedBrand(e.target.value);
                setSelectedModel("");
                setParts([]);
              }}
              className="border p-2 rounded"
            >
              <option value="">Marka Seçin</option>
              {brands.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>

            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              disabled={!selectedBrand}
              className="border p-2 rounded"
            >
              <option value="">Model Seçin</option>
              {models.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>

            <button onClick={fetchParts} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Parçaları Getir
            </button>
          </div>

          {parts.length > 0 && (
            <>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2">Kategori</th>
                    <th className="border p-2">Ürün</th>
                    <th className="border p-2">Birim</th>
                    <th className="border p-2">Fiyat (TL)</th>
                    <th className="border p-2">Toplam (TL)</th>
                  </tr>
                </thead>
                <tbody>
                  {parts.map((p, idx) => (
                    <tr key={idx}>
                      <td className="border p-2">{p.kategori}</td>
                      <td className="border p-2">{p.urun_tip}</td>
                      <td className="border p-2">{p.birim}</td>
                      <td className="border p-2">
                        <input
                          type="number"
                          value={p.fiyat}
                          onChange={(e) => handlePriceChange(idx, e.target.value)}
                          className="border p-1 rounded w-24"
                        />
                      </td>
                      <td className="border p-2">{p.toplam} TL</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-end mt-6">
                <button onClick={savePrices} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded">
                  Kaydet
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Admin;
