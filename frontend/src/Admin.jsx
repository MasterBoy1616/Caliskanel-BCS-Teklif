import React, { useState } from "react";
import GrafikDashboard from "./GrafikDashboard";
import FiyatYonetim from "./FiyatYonetim";

const AdminPanel = () => {
  const [aktifSekme, setAktifSekme] = useState("dashboard");

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Çalışkanel Bosch Car Admin Paneli</h1>

      <div className="flex justify-center mb-6 gap-4">
        <button
          onClick={() => setAktifSekme("dashboard")}
          className={`px-4 py-2 rounded ${aktifSekme === "dashboard" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setAktifSekme("fiyat")}
          className={`px-4 py-2 rounded ${aktifSekme === "fiyat" ? "bg-blue-600 text-white" : "bg-gray-300"}`}
        >
          Fiyat Yönetimi
        </button>
      </div>

      <div>
        {aktifSekme === "dashboard" && <GrafikDashboard />}
        {aktifSekme === "fiyat" && <FiyatYonetim />}
      </div>
    </div>
  );
};

export default AdminPanel;
