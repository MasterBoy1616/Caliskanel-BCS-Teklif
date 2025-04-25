import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUserCheck, FaClipboardList } from "react-icons/fa";

const Dashboard = () => {
  const [fiyatBakmaAdet, setFiyatBakmaAdet] = useState(0);
  const [randevuAdet, setRandevuAdet] = useState(0);

  useEffect(() => {
    axios.get("/api/log/fiyatbakmasayisi")
      .then(res => setFiyatBakmaAdet(res.data.adet))
      .catch(err => console.error(err));

    axios.get("/api/log/randevusayisi")
      .then(res => setRandevuAdet(res.data.adet))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Fiyat Bakma */}
      <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-6">
        <FaClipboardList size={48} className="text-blue-600" />
        <div>
          <h2 className="text-2xl font-bold">{fiyatBakmaAdet}</h2>
          <p className="text-gray-600">Toplam Fiyat Sorgulama</p>
        </div>
      </div>

      {/* Randevu Alma */}
      <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-6">
        <FaUserCheck size={48} className="text-green-500" />
        <div>
          <h2 className="text-2xl font-bold">{randevuAdet}</h2>
          <p className="text-gray-600">Toplam Randevu</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
