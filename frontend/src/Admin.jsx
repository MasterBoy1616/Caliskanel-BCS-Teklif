import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";

const Admin = () => {
  const [fiyatLog, setFiyatLog] = useState(0);
  const [randevuLog, setRandevuLog] = useState(0);

  useEffect(() => {
    axios.get("/api/log/fiyatbakmasayisi").then((res) => setFiyatLog(res.data.adet));
    axios.get("/api/log/randevusayisi").then((res) => setRandevuLog(res.data.adet));
  }, []);

  const data = {
    labels: ["Fiyat Bakma", "Randevu"],
    datasets: [
      {
        label: "Toplam Adet",
        data: [fiyatLog, randevuLog],
        backgroundColor: ["#3b82f6", "#10b981"],
      },
    ],
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Paneli</h1>
      <Bar data={data} />
    </div>
  );
};

export default Admin;
