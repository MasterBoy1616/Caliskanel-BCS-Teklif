import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import Home from "./Home";
import Admin from "./Admin";
import Login from "./Login";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="app-background">
      <div className="app-container">
        <Router>
          <nav className="flex gap-6 mb-6">
            <Link to="/" className="button">Anasayfa</Link>
            {isLoggedIn ? (
              <>
                <Link to="/admin" className="button">Admin</Link>
                <button onClick={() => setIsLoggedIn(false)} className="button">Çıkış Yap</button>
              </>
            ) : (
              <Link to="/login" className="button">Admin Giriş</Link>
            )}
          </nav>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/admin" element={isLoggedIn ? <Admin /> : <Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
