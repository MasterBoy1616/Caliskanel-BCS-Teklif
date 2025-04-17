// frontend/src/App.jsx

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminPanel from "./Admin";

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Periyodik Bakım Fiyat Sorgulama</h1>
      <p>Marka ve model seçerek aracınızın bakım fiyatını öğrenebilirsiniz.</p>
    </div>
  );
}

function Randevu() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Randevu Al</h1>
      <p>Buradan randevu alabilirsiniz.</p>
    </div>
  );
}

function Teklif() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Teklif Al</h1>
      <p>Buradan teklif alabilirsiniz.</p>
    </div>
  );
}

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/randevu" element={<Randevu />} />
        <Route path="/teklif" element={<Teklif />} />
        {/* Eğer bilinmeyen bir yol açılırsa ana sayfaya yönlendirme yapılır */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
