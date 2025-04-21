import React from "react";

const Admin = () => {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-8">Çalışkanel Bosch Car Servisi - Admin Panel</h1>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Toplam Randevular</h2>
          <p>Buraya randevu verisi çekilecek (api ile)</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Toplam Fiyat Bakma</h2>
          <p>Buraya fiyat bakma verisi çekilecek (api ile)</p>
        </div>
      </div>
    </div>
  );
};

export default Admin;
