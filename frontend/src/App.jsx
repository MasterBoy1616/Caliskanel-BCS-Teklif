import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import Home from "./Home";
import AdminPanel from "./AdminPanel";
import Login from "./Login";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <nav className="bg-blue-600 p-4 flex justify-center gap-8 text-white">
          <Link to="/">Anasayfa</Link>
          <Link to="/randevu">Randevu Al</Link>
          {isLoggedIn ? (
            <>
              <Link to="/admin">Admin Panel</Link>
              <button onClick={() => setIsLoggedIn(false)} className="ml-4 bg-red-500 px-3 py-1 rounded">
                Çıkış
              </button>
            </>
          ) : (
            <Link to="/login">Admin Giriş</Link>
          )}
        </nav>

        <div className="flex-1 p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/randevu" element={<Home />} />
            <Route path="/admin" element={isLoggedIn ? <AdminPanel /> : <Navigate to="/login" />} />
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
