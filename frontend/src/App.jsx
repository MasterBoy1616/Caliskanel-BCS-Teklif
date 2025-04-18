import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import Home from "./Home";
import AdminPanel from "./AdminPanel";
import Login from "./Login";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <div className="app-background">
        <div className="app-container">
          <nav className="flex justify-between mb-6">
            <div className="flex gap-4">
              <Link to="/">🏠 Anasayfa</Link>
              {isLoggedIn && <Link to="/admin">🔧 Admin</Link>}
            </div>
            <div>
              {isLoggedIn ? (
                <button onClick={() => setIsLoggedIn(false)} className="button">Çıkış</button>
              ) : (
                <Link to="/login" className="button">Admin Giriş</Link>
              )}
            </div>
          </nav>
          <Routes>
            <Route path="/" element={<Home />} />
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
