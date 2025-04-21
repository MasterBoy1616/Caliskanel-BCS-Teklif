import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

const Admin = () => {
  const [randevuSayisi, setRandevuSayisi] = useState(0);
  const [fiyatBakmaSayisi, setFiyatBakmaSayisi] = useState(0);
  const [yuzdeArtis, setYuzdeArtis] = useState(0);
  const [guncellemeDurumu, setGuncellemeDurumu] = useState("");

  const [marka, setMarka] = useState("");
  const [model, setModel] = useState("");
  const [parcalar, setParcalar] = useState([]);

  useEffect(() => {
    axios.get("/api/log/randevusayisi").then((res) => setRandevuSayisi(res.data.adet));
    axios.get("/api/log/fiyatbakmasayisi").then((res) => setFiyatBakmaSayisi(res.data.adet));
  }, []);

  const handleYuzdeGuncelle = async () => {
    if (parcalar.length === 0) return;
    const updated = parcalar.map((p) => ({
      ...p,
      fiyat: Math.round(p.fiyat * (1 + yuzdeArtis / 100)),
      toplam: Math.round(p.toplam * (1 + yuzdeArtis / 100)),
    }));

    try {
      await axios.post("/api/update-prices", updated);
      setGuncellemeDurumu("✔️ Fiyatlar başarıyla güncellendi.");
    } catch (err) {
      setGuncellemeDurumu("❌ Hata oluştu.");
    }
  };

  const handleParcaGetir = async () => {
    if (!marka || !model) return;
    const res = await axios.get(`/api/parts?brand=${marka}&model=${model}`);
    const allParts = [...res.data.baseParts];
    Object.values(res.data.optional).forEach((group) => {
      if (group.length) allParts.push(...group);
    });
    allParts.push(res.data.labor);
    setParcalar(allParts);
  };

  const chartData = {
    labels: ["Fiyat Bakma", "Randevu Alma"],
    datasets: [
      {
        data: [fiyatBakmaSayisi, randevuSayisi],
        backgroundColor: ["#36A2EB", "#FF6384"],
        hoverOffset: 4,
      },
    ],
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div className="bg-white shadow p-6 rounded">
          <h2 className="text-xl font-semibold mb-4">Grafik</h2>
          <Pie data={chartData} />
        </div>

        <div className="bg-white shadow p-6 rounded">
          <h2 className="text-xl font-semibold mb-4">Yüzde ile Toplu Fiyat Güncelle</h2>
          <div className="flex flex-col gap-3">
            <input
              className="border p-2 rounded"
              type="text"
              placeholder="Marka giriniz"
              value={marka}
              onChange={(e) => setMarka(e.target.value)}
            />
            <input
              className="border p-2 rounded"
              type="text"
              placeholder="Model giriniz"
              value={model}
              onChange={(e) => setModel(e.target.value)}
            />
            <button className="bg-green-500 text-white p-2 rounded" onClick={handleParcaGetir}>
              Parçaları Getir
            </button>

            <input
              className="border p-2 rounded"
              type="number"
              placeholder="Yüzde Artış (%)"
              value={yuzdeArtis}
              onChange={(e) => setYuzdeArtis(parseFloat(e.target.value))}
            />
            <button className="bg-blue-500 text-white p-2 rounded" onClick={handleYuzdeGuncelle}>
              Yüzde Güncelle
            </button>

            {guncellemeDurumu && (
              <p className="mt-2 text-green-600 font-semibold">{guncellemeDurumu}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
