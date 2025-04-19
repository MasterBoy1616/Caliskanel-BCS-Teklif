import React, { useEffect, useState } from "react";
import axios from "axios";

const Admin = () => {
  const [randevuCount, setRandevuCount] = useState(0);
  const [fiyatBakmaCount, setFiyatBakmaCount] = useState(0);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const fiyatBakma = await axios.get("/api/log/fiyatbakmasayisi");
      const randevular = await axios.get("/api/log/randevusayisi");

      setFiyatBakmaCount(fiyatBakma.data.adet);
      setRandevuCount(randevular.data.adet);
    } catch (error) {
      console.error("Veri çekilirken hata oluştu", error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-center">Admin Paneli</h1>

      <div className="grid grid-cols-2 gap-6">
        <div className="p-6 bg-green-100 rounded-xl text-center shadow-md">
          <h2 className="text-xl font-semibold mb-2">Fiyat Sorgulama Sayısı</h2>
          <p className="text-4xl font-bold">{fiyatBakmaCount}</p>
        </div>

        <div className="p-6 bg-blue-100 rounded-xl text-center shadow-md">
          <h2 className="text-xl font-semibold mb-2">Randevu Talep Sayısı</h2>
          <p className="text-4xl font-bold">{randevuCount}</p>
        </div>
      </div>

      <div className="mt-10 text-center text-gray-500">
        Çalışkanel Bosch Car Servisi Yönetim Paneli
      </div>
    </div>
  );
};

export default Admin;
