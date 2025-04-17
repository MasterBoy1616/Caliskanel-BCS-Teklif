// frontend/src/App.jsx

import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import AdminPanel from "./Admin";
import Home from "./Home";
import Randevu from "./Randevu";
import Teklif from "./Teklif";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <nav className="bg-gray-800 p-4 flex justify-center gap-8 text-white">
          <Link to="/">Anasayfa</Link>
          <Link to="/randevu">Randevu Al</Link>
          <Link to="/teklif">Teklif Al</Link>
          <Link to="/admin">Admin</Link>
        </nav>
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/randevu" element={<Randevu />} />
            <Route path="/teklif" element={<Teklif />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
