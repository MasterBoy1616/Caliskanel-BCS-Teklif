import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Admin = () => {
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [parts, setParts] = useState([]);
  const [fiyatArtis, setFiyatArtis] = useState(0);
  const [message, setMessage] = useState("");

  const [fiyatBakmaAdet, setFiyatBakmaAdet] = useState(0);
  const [randevuAdet, setRandevuAdet] = useState(0);

  useEffect(() => {
    axios.get("/api/brands").then((res) => setBrands(res.data));
    fetchCounts();
  }, []);

  useEffect(() => {
    if (selectedBrand) {
      axios.get(`/api/models?brand=${selectedBrand}`).then((res) => setModels(res.data));
    }
  }, [selectedBrand]);

  useEffect(() => {
    if (selectedBrand && selectedModel) {
      axios.get(`/api/parts?brand=${selectedBrand}&model=${selectedModel}`).then((res) => {
        const data = res.data;
        setParts([
          ...(data.baseParts || []),
          data.labor,
          ...(data.optional.balata || []),
          ...(data.optional.disk || []),
          ...(data.optional.silecek || []),
        ]);
      });
    }
  }, [selectedBrand, selectedModel]);

  const fetchCounts = async () => {
    const fiyatRes = await axios.get("/api/log/fiyatbakmasayisi");
    const randevuRes = await axios.get("/api/log/randevusayisi");
    setFiyatBakmaAdet(fiyatRes.data.adet || 0);
    setRandevuAdet(randevuRes.data.adet || 0);
  };

  const handleFiyatArtis = (e) => {
    setFiyatArtis(Number(e.target.value));
  };

  const handleKaydet = async () => {
    try {
      const updatedParts = parts.map((p) => ({
        ...p,
        fiyat: Math.round(p.fiyat * (1 + fiyatArtis / 100)),
        toplam: Math.round(p.fiyat * p.birim * (1 + fiyatArtis / 100)),
      }));
      await axios.post("/api/save-prices", updatedParts);
      setMessage("✔️ Başarıyla Kaydedildi!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("❌ Kaydedilemedi!");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const chartData = {
    labels: ["Fiyat Sorgulama", "Randevu Alımı"],
    datasets: [
      {
        label: "Toplam Adet",
        backgroundColor: "#3b82f6",
        data: [fiyatBakmaAdet, randevuAdet],
      },
    ],
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Çalışkanel Admin Paneli</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded shadow-md">
          <h2 className="text-xl font-bold mb-4">İstatistikler</h2>
          <Bar data={chartData} />
        </div>

        <div className="bg-white p-6 rounded shadow-md">
          <h2 className="text-xl font-bold mb-4">Fiyat Güncelle</h2>

          <div className="flex flex-col gap-4 mb-4">
            <select
              value={selectedBrand}
              onChange={(e) => {
                setSelectedBrand(e.target.value);
                setSelectedModel("");
              }}
              className="border p-2 rounded"
            >
              <option value="">Marka Seç</option>
              {brands.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>

            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="border p-2 rounded"
              disabled={!selectedBrand}
            >
              <option value="">Model Seç</option>
              {models.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            <input
              type="number"
              value={fiyatArtis}
              onChange={handleFiyatArtis}
              placeholder="% Artış"
              className="border p-2 rounded"
            />

            <button onClick={handleKaydet} className="bg-blue-500 hover:bg-blue-700 text-white py-2 rounded">
              Kaydet
            </button>

            {message && <p className="mt-2 text-center">{message}</p>}
          </div>

          <table className="w-full text-sm mt-4">
            <thead>
              <tr>
                <th className="border p-2">Kategori</th>
                <th className="border p-2">Ürün</th>
                <th className="border p-2">Fiyat (TL)</th>
              </tr>
            </thead>
            <tbody>
              {parts.map((p, idx) => (
                <tr key={idx}>
                  <td className="border p-2">{p.kategori}</td>
                  <td className="border p-2">{p.urun_tip}</td>
                  <td className="border p-2">{p.fiyat} ₺</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin;
