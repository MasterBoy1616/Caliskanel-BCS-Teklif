import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement);

const Admin = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [parts, setParts] = useState([]);
  const [optionalParts, setOptionalParts] = useState([]);
  const [labor, setLabor] = useState({});
  const [updateStatus, setUpdateStatus] = useState("");

  const [fiyatBakma, setFiyatBakma] = useState(0);
  const [randevuSayisi, setRandevuSayisi] = useState(0);

  useEffect(() => {
    axios.get("/api/brands").then(res => setBrands(res.data));
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (selectedBrand) {
      axios.get(`/api/models?brand=${selectedBrand}`).then(res => setModels(res.data));
    }
  }, [selectedBrand]);

  useEffect(() => {
    if (selectedBrand && selectedModel) {
      axios.get(`/api/parts?brand=${selectedBrand}&model=${selectedModel}`).then(res => {
        setParts(res.data.baseParts || []);
        const opsiyoneller = [
          ...(res.data.optional.balata || []),
          ...(res.data.optional.disk || []),
          ...(res.data.optional.silecek || []),
        ];
        setOptionalParts(opsiyoneller);
        setLabor(res.data.labor || {});
      });
    }
  }, [selectedBrand, selectedModel]);

  const fetchDashboardData = async () => {
    const fiyatBakmaRes = await axios.get("/api/log/fiyatbakmasayisi");
    const randevuRes = await axios.get("/api/log/randevusayisi");
    setFiyatBakma(fiyatBakmaRes.data.adet);
    setRandevuSayisi(randevuRes.data.adet);
  };

  const updatePrices = async () => {
    const data = [...parts, ...optionalParts, labor];
    try {
      await axios.post("/api/update-prices", data);
      setUpdateStatus("✔️ Fiyatlar başarıyla güncellendi!");
    } catch (error) {
      setUpdateStatus("❌ Fiyat kaydederken hata oluştu!");
    }
    setTimeout(() => setUpdateStatus(""), 3000);
  };

  const increasePricesByPercent = (percent) => {
    setParts(parts.map(p => ({ ...p, fiyat: Math.round(p.fiyat * (1 + percent / 100)), toplam: Math.round(p.toplam * (1 + percent / 100)) })));
    setOptionalParts(optionalParts.map(p => ({ ...p, fiyat: Math.round(p.fiyat * (1 + percent / 100)), toplam: Math.round(p.toplam * (1 + percent / 100)) })));
    setLabor({ ...labor, fiyat: Math.round(labor.fiyat * (1 + percent / 100)), toplam: Math.round(labor.toplam * (1 + percent / 100)) });
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Çalışkanel Bosch Car Admin Panel</h1>

      <div className="flex gap-4 mb-6">
        <button onClick={() => setActiveTab("dashboard")} className={`px-4 py-2 rounded ${activeTab === "dashboard" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
          Dashboard
        </button>
        <button onClick={() => setActiveTab("edit")} className={`px-4 py-2 rounded ${activeTab === "edit" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
          Fiyatları Düzenle
        </button>
      </div>

      {activeTab === "dashboard" && (
        <div>
          <Bar
            data={{
              labels: ["Fiyat Sorgulama", "Randevu Oluşturma"],
              datasets: [
                {
                  label: "İşlem Sayısı",
                  data: [fiyatBakma, randevuSayisi],
                  backgroundColor: ["#2563eb", "#4ade80"],
                },
              ],
            }}
            options={{ responsive: true }}
          />
        </div>
      )}

      {activeTab === "edit" && (
        <div>
          <div className="flex gap-4 mb-4">
            <select value={selectedBrand} onChange={e => setSelectedBrand(e.target.value)} className="border p-2">
              <option value="">Marka Seç</option>
              {brands.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
            <select value={selectedModel} onChange={e => setSelectedModel(e.target.value)} className="border p-2">
              <option value="">Model Seç</option>
              {models.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div className="mb-4 flex gap-2">
            <button onClick={() => increasePricesByPercent(5)} className="bg-green-500 text-white px-4 py-2 rounded">+5%</button>
            <button onClick={() => increasePricesByPercent(-5)} className="bg-red-500 text-white px-4 py-2 rounded">-5%</button>
          </div>

          <table className="w-full border">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">Kategori</th>
                <th className="p-2 border">Ürün Tipi</th>
                <th className="p-2 border">Fiyat</th>
                <th className="p-2 border">Toplam</th>
              </tr>
            </thead>
            <tbody>
              {parts.concat(optionalParts).map((p, idx) => (
                <tr key={idx}>
                  <td className="p-2 border">{p.kategori}</td>
                  <td className="p-2 border">{p.urun_tip}</td>
                  <td className="p-2 border">
                    <input type="number" value={p.fiyat} onChange={(e) => {
                      const val = Number(e.target.value);
                      if (!isNaN(val)) {
                        const updatedParts = parts.concat(optionalParts).map((part, i) => i === idx ? { ...part, fiyat: val, toplam: Math.round(val * part.birim) } : part);
                        setParts(updatedParts.slice(0, parts.length));
                        setOptionalParts(updatedParts.slice(parts.length));
                      }
                    }} className="border w-full p-1" />
                  </td>
                  <td className="p-2 border">{p.toplam}</td>
                </tr>
              ))}
              {labor && (
                <tr className="font-bold">
                  <td className="p-2 border">{labor.kategori}</td>
                  <td className="p-2 border">{labor.urun_tip}</td>
                  <td className="p-2 border">
                    <input type="number" value={labor.fiyat} onChange={(e) => {
                      const val = Number(e.target.value);
                      if (!isNaN(val)) setLabor({ ...labor, fiyat: val, toplam: Math.round(val * labor.birim) });
                    }} className="border w-full p-1" />
                  </td>
                  <td className="p-2 border">{labor.toplam}</td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="mt-4">
            <button onClick={updatePrices} className="bg-blue-600 text-white px-6 py-2 rounded">Kaydet</button>
            {updateStatus && <div className="mt-2">{updateStatus}</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
