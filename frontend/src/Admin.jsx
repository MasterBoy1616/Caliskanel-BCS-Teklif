// frontend/src/Admin.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Admin = () => {
  const [fiyatlar, setFiyatlar] = useState([]);
  const [yuzde, setYuzde] = useState(0);
  const [fiyatBakmaSayisi, setFiyatBakmaSayisi] = useState(0);
  const [randevuSayisi, setRandevuSayisi] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    fetchFiyatlar();
    fetchLogData();
  }, []);

  const fetchFiyatlar = async () => {
    try {
      const response = await axios.get("/api/fiyatlar");
      setFiyatlar(response.data);
    } catch (error) {
      console.error("Fiyatlar alınamadı:", error);
    }
  };

  const fetchLogData = async () => {
    try {
      const fiyatRes = await axios.get("/api/log/fiyatbakmasayisi");
      const randevuRes = await axios.get("/api/log/randevusayisi");
      setFiyatBakmaSayisi(fiyatRes.data.adet);
      setRandevuSayisi(randevuRes.data.adet);
    } catch (error) {
      console.error("Log verileri alınamadı:", error);
    }
  };

  const handleInputChange = (index, field, value) => {
    const updatedFiyatlar = [...fiyatlar];
    updatedFiyatlar[index][field] = value;
    updatedFiyatlar[index]["toplam"] = Math.round(
      updatedFiyatlar[index]["birim"] * updatedFiyatlar[index]["fiyat"]
    );
    setFiyatlar(updatedFiyatlar);
  };

  const applyYuzde = () => {
    const updatedFiyatlar = fiyatlar.map((item) => ({
      ...item,
      fiyat: Math.round(item.fiyat * (1 + yuzde / 100)),
      toplam: Math.round(item.birim * item.fiyat * (1 + yuzde / 100)),
    }));
    setFiyatlar(updatedFiyatlar);
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await axios.post("/api/update-prices", fiyatlar);
      setSaveMessage("✅ Fiyatlar başarıyla kaydedildi!");
    } catch (error) {
      setSaveMessage("❌ Fiyatlar kaydedilemedi!");
    } finally {
      setLoading(false);
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  const chartData = {
    labels: ["Fiyat Bakma", "Randevu Al"],
    datasets: [
      {
        label: "İşlem Sayıları",
        data: [fiyatBakmaSayisi, randevuSayisi],
        backgroundColor: ["#4ade80", "#60a5fa"],
      },
    ],
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">📊 Admin Paneli</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">İşlem Grafiği</h2>
          <Bar data={chartData} />
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Toplu Yüzde Güncelle</h2>
          <div className="flex gap-2 items-center mb-4">
            <input
              type="number"
              value={yuzde}
              onChange={(e) => setYuzde(Number(e.target.value))}
              className="border p-2 rounded w-24"
              placeholder="% Değişim"
            />
            <button
              onClick={applyYuzde}
              className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Uygula
            </button>
          </div>
          <button
            onClick={handleSave}
            disabled={loading}
            className="bg-green-500 hover:bg-green-700 text-white px-6 py-2 rounded w-full"
          >
            {loading ? "Kaydediliyor..." : "💾 Fiyatları Kaydet"}
          </button>
          {saveMessage && (
            <p className="text-center mt-4 font-semibold">{saveMessage}</p>
          )}
        </div>
      </div>

      <h2 className="text-2xl font-semibold mb-4 mt-10">🧰 Fiyat Listesi</h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Kategori</th>
              <th className="p-2 border">Ürün/TİP</th>
              <th className="p-2 border">Birim</th>
              <th className="p-2 border">Fiyat (TL)</th>
              <th className="p-2 border">Toplam (TL)</th>
            </tr>
          </thead>
          <tbody>
            {fiyatlar.map((item, index) => (
              <tr key={index}>
                <td className="p-2 border">{item.kategori}</td>
                <td className="p-2 border">{item.urun_tip}</td>
                <td className="p-2 border">{item.birim}</td>
                <td className="p-2 border">
                  <input
                    type="number"
                    value={item.fiyat}
                    onChange={(e) =>
                      handleInputChange(index, "fiyat", Number(e.target.value))
                    }
                    className="border rounded p-1 w-24"
                  />
                </td>
                <td className="p-2 border">{item.toplam}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admin;
