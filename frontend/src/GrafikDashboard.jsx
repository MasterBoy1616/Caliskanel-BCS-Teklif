import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";

const GrafikDashboard = () => {
  const [veriler, setVeriler] = useState([
    { ad: "Fiyat Bakıldı", adet: 0 },
    { ad: "Randevu Alındı", adet: 0 },
  ]);

  useEffect(() => {
    const verileriCek = async () => {
      const fiyat = await axios.get("/api/log/fiyatbakmasayisi").then(r => r.data.adet).catch(() => 0);
      const randevu = await axios.get("/api/log/randevusayisi").then(r => r.data.adet).catch(() => 0);
      setVeriler([
        { ad: "Fiyat Bakıldı", adet: fiyat },
        { ad: "Randevu Alındı", adet: randevu }
      ]);
    };
    verileriCek();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">İstatistikler</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={veriler}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="ad" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="adet" fill="#2563eb" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GrafikDashboard;
