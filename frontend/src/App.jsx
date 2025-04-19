import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import AdminPanel from "./AdminPanel";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <nav className="bg-blue-700 p-4 flex justify-center gap-8 text-white">
          <Link to="/">Anasayfa</Link>
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

        <div className="flex-1 p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/admin" element={isLoggedIn ? <AdminPanel /> : <Navigate to="/login" />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
