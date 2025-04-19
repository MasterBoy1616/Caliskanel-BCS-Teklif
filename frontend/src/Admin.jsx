import React, { useState, useEffect } from "react";
import { Bar, Pie } from "react-chartjs-2";
import axios from "axios";
import 'chart.js/auto';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [fiyatlar, setFiyatlar] = useState([]);
  const [percent, setPercent] = useState(0);
  const [updateMessage, setUpdateMessage] = useState("");

  const [stats, setStats] = useState({
    fiyatBakmaSayisi: 0,
    randevuSayisi: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const fiyatRes = await axios.get("/api/log/fiyatbakmasayisi");
      const randevuRes = await axios.get("/api/log/randevusayisi");

      setStats({
        fiyatBakmaSayisi: fiyatRes.data.adet,
        randevuSayisi: randevuRes.data.adet,
      });
    } catch (err) {
      console.error("İstatistik çekilemedi.", err);
    }
  };

  const applyPercent = () => {
    const updated = fiyatlar.map(p => ({
      ...p,
      fiyat: Math.round(p.fiyat * (1 + percent / 100)),
      toplam: Math.round(p.toplam * (1 + percent / 100)),
    }));
    setFiyatlar(updated);
  };

  const savePrices = async () => {
    try {
      await axios.post("/api/save-prices", fiyatlar);
      setUpdateMessage("✅ Fiyatlar başarıyla güncellendi!");
    } catch (err) {
      setUpdateMessage("❌ Fiyatlar güncellenirken hata oluştu!");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Çalışkanel Bosch Car Servis - Admin Paneli</h1>

      <div className="flex gap-4 justify-center mb-6">
        <button onClick={() => setActiveTab('dashboard')} className={`p-2 px-6 rounded ${activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>Dashboard</button>
        <button onClick={() => setActiveTab('fiyat')} className={`p-2 px-6 rounded ${activeTab === 'fiyat' ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>Fiyat Yönetimi</button>
      </div>

      {activeTab === "dashboard" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded shadow p-4">
            <h2 className="text-xl font-semibold mb-4">Fiyat Bakma & Randevu</h2>
            <Bar
              data={{
                labels: ["Fiyat Bakma", "Randevu"],
                datasets: [
                  {
                    label: "Adet",
                    backgroundColor: ["#3b82f6", "#10b981"],
                    data: [stats.fiyatBakmaSayisi, stats.randevuSayisi],
                  },
                ],
              }}
            />
          </div>

          <div className="bg-white rounded shadow p-4">
            <h2 className="text-xl font-semibold mb-4">Oran Dağılımı</h2>
            <Pie
              data={{
                labels: ["Fiyat Bakma", "Randevu"],
                datasets: [
                  {
                    data: [stats.fiyatBakmaSayisi, stats.randevuSayisi],
                    backgroundColor: ["#6366f1", "#34d399"],
                  },
                ],
              }}
            />
          </div>
        </div>
      )}

      {activeTab === "fiyat" && (
        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-4 text-center">Fiyat Düzenleme</h2>

          <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-center">
            <input 
              type="number"
              placeholder="Yüzde (%)"
              value={percent}
              onChange={(e) => setPercent(Number(e.target.value))}
              className="border p-2 rounded w-40"
            />
            <button onClick={applyPercent} className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded">
              Yüzdeyi Uygula
            </button>
            <button onClick={savePrices} className="bg-green-600 hover:bg-green-700 text-white p-2 rounded">
              Değişiklikleri Kaydet
            </button>
          </div>

          {updateMessage && <div className="text-center mb-6">{updateMessage}</div>}

          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border">
              <thead>
                <tr className="bg-gray-200">
                  <th className="border p-2">Kategori</th>
                  <th className="border p-2">Ürün/TİP</th>
                  <th className="border p-2">Birim</th>
                  <th className="border p-2">Fiyat</th>
                  <th className="border p-2">Toplam</th>
                </tr>
              </thead>
              <tbody>
                {fiyatlar.map((p, i) => (
                  <tr key={i}>
                    <td className="border p-2">{p.kategori}</td>
                    <td className="border p-2">{p.urun_tip}</td>
                    <td className="border p-2">{p.birim}</td>
                    <td className="border p-2">{p.fiyat.toLocaleString('tr-TR')}</td>
                    <td className="border p-2">{p.toplam.toLocaleString('tr-TR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}
    </div>
  );
};

export default Admin;
