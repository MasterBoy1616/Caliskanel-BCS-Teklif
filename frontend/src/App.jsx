import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import AdminPanel from "./Admin";
import Home from "./Home";
import Randevu from "./Randevu";
import Teklif from "./Teklif";
import Login from "./Login";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <nav className="bg-gray-800 p-4 flex justify-center gap-8 text-white">
          <Link to="/">Anasayfa</Link>
          <Link to="/randevu">Randevu Al</Link>
          <Link to="/teklif">Teklif Al</Link>
          {isLoggedIn ? (
            <>
              <Link to="/admin">Admin</Link>
              <button onClick={() => setIsLoggedIn(false)} className="bg-red-500 px-3 py-1 rounded">
                Çıkış
              </button>
            </>
          ) : (
            <Link to="/login">Admin Giriş</Link>
          )}
        </nav>

        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/randevu" element={<Randevu />} />
            <Route path="/teklif" element={<Teklif />} />
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            <Route
              path="/admin"
              element={isLoggedIn ? <AdminPanel /> : <Navigate to="/login" />}
            />
            <Route path="*" element={<Home />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
