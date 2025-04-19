import React, { useState } from "react";
import Dashboard from "./Dashboard";
import FiyatYonetim from "./FiyatYonetim";
import { FaChartBar, FaMoneyBillWave } from "react-icons/fa";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-60 bg-blue-800 text-white flex flex-col p-4 space-y-4">
        <h1 className="text-2xl font-bold mb-6">Çalışkanel Admin</h1>

        <button
          className={`flex items-center gap-3 p-3 rounded hover:bg-blue-600 ${activeTab === "dashboard" ? "bg-blue-600" : ""}`}
          onClick={() => setActiveTab("dashboard")}
        >
          <FaChartBar /> Dashboard
        </button>

        <button
          className={`flex items-center gap-3 p-3 rounded hover:bg-blue-600 ${activeTab === "fiyat" ? "bg-blue-600" : ""}`}
          onClick={() => setActiveTab("fiyat")}
        >
          <FaMoneyBillWave /> Fiyat Yönetimi
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {activeTab === "dashboard" && <Dashboard />}
        {activeTab === "fiyat" && <FiyatYonetim />}
      </div>
    </div>
  );
};

export default AdminPanel;
