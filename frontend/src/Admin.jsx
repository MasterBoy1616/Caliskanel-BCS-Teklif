import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [randevuSayisi, setRandevuSayisi] = useState(0);
  const [fiyatBakmaSayisi, setFiyatBakmaSayisi] = useState(0);
  const [parts, setParts] = useState([]);
  const [updatedParts, setUpdatedParts] = useState([]);

  useEffect(() => {
    axios.get("/api/log/fiyatbakmasayisi").then(res => setFiyatBakmaSayisi(res.data.adet));
    axios.get("/api/log/randevusayisi").then(res => setRandevuSayisi(res.data.adet));
    axios.get("/api/parts?brand=FIAT&model=EGEA") // örnek default
      .then(res => setParts(res.data.baseParts));
  }, []);

  const handlePriceChange = (index, newPrice) => {
    const updated = [...parts];
    updated[index].fiyat = Number(newPrice);
    updated[index].toplam = Number(newPrice) * updated[index].birim;
    setParts(updated);
    setUpdatedParts(updated);
  };

  const handleSavePrices = async () => {
    try {
      await axios.post("/api/update-prices", updatedParts);
      alert("✔️ Fiyatlar başarıyla kaydedildi!");
    } catch {
      alert("❌ Fiyat kaydedilemedi!");
    }
  };

  const chartData = {
    labels: ["Fiyat Sorgulama", "Randevu Alımı"],
    datasets: [
      {
        label: "Toplam",
        data: [fiyatBakmaSayisi, randevuSayisi],
        backgroundColor: ["#60a5fa", "#34d399"]
      }
    ]
  };

  return (
    <div className="p-8">
      <div className="flex gap-4 mb-6">
        <button onClick={() => setActiveTab("dashboard")} className={`px-4 py-2 ${activeTab === "dashboard" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
          Dashboard
        </button>
        <button onClick={() => setActiveTab("fiyat")} className={`px-4 py-2 ${activeTab === "fiyat" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
          Fiyat Düzenleme
        </button>
      </div>

      {activeTab === "dashboard" && (
        <div>
          <h2 className="text-2xl font-bold mb-4">İstatistikler</h2>
          <Bar data={chartData} />
        </div>
      )}

      {activeTab === "fiyat" && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Parça Fiyat Düzenle</h2>
          <table className="w-full border-collapse mb-4">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Kategori</th>
                <th className="border p-2">Ürün</th>
                <th className="border p-2">Birim</th>
                <th className="border p-2">Fiyat (TL)</th>
              </tr>
            </thead>
            <tbody>
              {parts.map((part, index) => (
                <tr key={index}>
                  <td className="border p-2">{part.kategori}</td>
                  <td className="border p-2">{part.urun_tip}</td>
                  <td className="border p-2">{part.birim}</td>
                  <td className="border p-2">
                    <input
                      type="number"
                      value={part.fiyat}
                      onChange={(e) => handlePriceChange(index, e.target.value)}
                      className="border p-1 w-24"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button onClick={handleSavePrices} className="bg-green-600 text-white px-4 py-2 rounded">
            Kaydet
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
