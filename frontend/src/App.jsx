import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-bold mb-4 text-violet-700">Periyodik Bakım Fiyat Sorgulama</h1>
      <p className="text-center text-gray-600">Marka ve model seçerek aracınızın bakım fiyatını öğrenebilirsiniz.</p>
      {/* Burada fiyat sorgulama bileşenleri yer alacak */}
    </div>
  );
}

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
