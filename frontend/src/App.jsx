import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import Home from "./Home";
import Admin from "./Admin";
import Login from "./Login";

function App() {
  return (
    <Router>
      <div className="app-background">
        <nav className="bg-blue-600 text-white p-4 flex justify-center gap-8 mb-4">
          <Link to="/">Anasayfa</Link>
          <Link to="/login">Admin Giriş</Link>
        </nav>

        <div className="app-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
