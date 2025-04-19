import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaClipboardList, FaFileInvoiceDollar, FaUsers } from "react-icons/fa";
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale);

const AdminPanel = () => {
  const [fiyatBakmaCount, setFiyatBakmaCount] = useState(0);
  const [teklifCount, setTeklifCount] = useState(0);

  useEffect(() => {
    axios.get("/api/log/fiyatbakmasayisi").then((res) => setFiyatBakmaCount(res.data.adet || 0));
    axios.get("/api/log/teklifalisayisi").then((res) => setTeklifCount(res.data.adet || 0));
  }, []);

  const dashboardData = [
    {
      title: "Fiyat Sorgulama",
      value: fiyatBakmaCount,
      icon: <FaClipboardList size={30} />,
      color: "bg-blue-500",
    },
    {
      title: "PDF Teklif Alımı",
      value: teklifCount,
      icon: <FaFileInvoiceDollar size={30} />,
      color: "bg-green-500",
    },
    {
      title: "Kullanıcı Kayıtları",
      value: fiyatBakmaCount + teklifCount,
      icon: <FaUsers size={30} />,
      color: "bg-purple-500",
    },
  ];

  const chartData = {
    labels: ["Fiyat Sorgulama", "Teklif Alımı", "Toplam"],
    datasets: [
      {
        label: "İşlem Sayısı",
        backgroundColor: ["#3b82f6", "#10b981", "#8b5cf6"],
        data: [fiyatBakmaCount, teklifCount, fiyatBakmaCount + teklifCount],
      },
    ],
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6 text-center">Admin Dashboard</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {dashboardData.map((item, idx) => (
          <div key={idx} className={`flex items-center gap-4 p-4 rounded-lg text-white ${item.color}`}>
            {item.icon}
            <div>
              <h4 className="text-xl">{item.title}</h4>
              <p className="text-2xl font-bold">{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg p-6 shadow">
        <Bar data={chartData} />
      </div>
    </div>
  );
};

export default AdminPanel;
