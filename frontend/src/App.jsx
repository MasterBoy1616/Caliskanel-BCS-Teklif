import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import Home from "./Home";
import AdminPanel from "./AdminPanel";
import Login from "./Login";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <div>
        <nav className="bg-gray-800 p-4 text-white flex justify-center gap-4">
          <Link to="/">Ana Sayfa</Link>
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

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={isLoggedIn ? <AdminPanel /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
