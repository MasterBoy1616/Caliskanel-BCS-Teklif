// frontend/src/App.jsx

import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import Home from "./Home";
import Admin from "./Admin";
import Login from "./Login";

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <header className="bg-white shadow p-4 flex justify-between items-center">
          <div className="text-xl font-bold">Çalışkanel Bosch Car Servis</div>
          <nav className="flex gap-6">
            <Link to="/" className="text-blue-600 hover:underline">Anasayfa</Link>
            <Link to="/login" className="text-blue-600 hover:underline">Admin Giriş</Link>
          </nav>
        </header>

        <main className="flex-1 p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>

        <footer className="bg-white shadow p-4 text-center text-sm">
          © {new Date().getFullYear()} Çalışkanel Bosch Car Servis
        </footer>
      </div>
    </Router>
  );
};

export default App;
