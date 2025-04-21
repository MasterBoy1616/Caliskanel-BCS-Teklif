import React from "react";

function Admin() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Admin Panel</h1>
        <p className="text-center">Burada randevu ve fiyat düzenlemeleri yapılacak.</p>
        {/* Daha sonra buraya dashboard grafik ve raporlama ekleyeceğiz */}
      </div>
    </div>
  );
}

export default Admin;
