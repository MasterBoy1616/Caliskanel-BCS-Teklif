import React from "react";

const Admin = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-4/5">
        <h1 className="text-3xl font-bold mb-6 text-center">Admin Paneli</h1>

        <div className="flex flex-wrap gap-8 justify-center">
          <div className="bg-blue-200 p-4 rounded w-64 text-center">
            <h2 className="text-xl font-bold mb-2">Marka/Model Bazlı Fiyatlar</h2>
            <p>Buradan fiyatları görüntüleyebilir ve düzenleyebilirsiniz.</p>
          </div>

          <div className="bg-green-200 p-4 rounded w-64 text-center">
            <h2 className="text-xl font-bold mb-2">İstatistikler</h2>
            <p>Randevu sayıları ve fiyat bakma analizleri burada olacak.</p>
          </div>

          <div className="bg-yellow-200 p-4 rounded w-64 text-center">
            <h2 className="text-xl font-bold mb-2">Grafikler</h2>
            <p>Bakım hareketleri grafiklerle gösterilecek.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
