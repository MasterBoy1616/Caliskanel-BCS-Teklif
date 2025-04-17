// frontend/src/App.jsx

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminPanel from "./Admin";
import AnaSayfa from "./AnaSayfa";
import Randevu from "./Randevu";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Ana Sayfa - Marka Model seçimi */}
        <Route path="/" element={<AnaSayfa />} />

        {/* Admin Panel */}
        <Route path="/admin" element={<AdminPanel />} />

        {/* Randevu Al Sayfası */}
        <Route path="/randevu" element={<Randevu />} />

        {/* Eğer bilinmeyen bir yol açılırsa Ana Sayfa'ya yönlendirme */}
        <Route path="*" element={<AnaSayfa />} />
      </Routes>
    </Router>
  );
};

export default App;
