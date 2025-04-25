// frontend/src/App.jsx

import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function Home() {
  return (
    <div className="container">
      <h1>Periyodik Bakım Fiyat Sorgulama</h1>
      <p>Marka ve model seçerek aracınızın bakım fiyatını öğrenebilirsiniz.</p>

      <div style={{ marginTop: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
        <Link to="/fiyat-sorgulama">
          <button className="button">Fiyat Sorgulama</button>
        </Link>
        <Link to="/randevu-al">
          <button className="button">Randevu Al</button>
        </Link>
      </div>
    </div>
  );
}

function FiyatSorgulama() {
  return (
    <div className="container">
      <h1>Fiyat Sorgulama</h1>
      <p>Buradan aracınız için fiyat sorgulaması yapabilirsiniz.</p>
    </div>
  );
}

function RandevuAl() {
  return (
    <div className="container">
      <h1>Randevu Al</h1>
      <p>Buradan servis için randevu alabilirsiniz.</p>
    </div>
  );
}

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/fiyat-sorgulama" element={<FiyatSorgulama />} />
        <Route path="/randevu-al" element={<RandevuAl />} />
        {/* Bilinmeyen URL girilirse ana sayfaya yönlendir */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
