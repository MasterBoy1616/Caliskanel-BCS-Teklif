// frontend/src/App.jsx

import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import AdminPanel from "./AdminPanel";
import "./App.css";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <nav>
        <Link to="/">Anasayfa</Link>
        {isLoggedIn ? (
          <>
            <Link to="/admin">Admin Panel</Link>
            <button onClick={() => setIsLoggedIn(false)} className="button">
              Çıkış
            </button>
          </>
        ) : (
          <Link to="/login">Admin Giriş</Link>
        )}
      </nav>

      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/admin" element={isLoggedIn ? <AdminPanel /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
