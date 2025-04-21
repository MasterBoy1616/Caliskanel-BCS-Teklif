import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Admin from "./Admin";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <div className="app-background">
        <nav className="flex justify-center gap-6 p-4 bg-blue-500 text-white">
          <Link to="/">Ana Sayfa</Link>
          {isAuthenticated ? (
            <>
              <Link to="/admin">Admin Panel</Link>
              <button onClick={() => setIsAuthenticated(false)}>Çıkış</button>
            </>
          ) : (
            <Link to="/login">Admin Giriş</Link>
          )}
        </nav>

        <div className="app-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login onLoginSuccess={() => setIsAuthenticated(true)} />} />
            <Route path="/admin" element={isAuthenticated ? <Admin /> : <Navigate to="/login" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
