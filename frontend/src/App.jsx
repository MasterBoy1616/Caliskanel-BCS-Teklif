import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import Home from "./Home";
import AdminPanel from "./AdminPanel";
import Login from "./Login";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-100">
        <nav className="bg-blue-700 text-white p-4 flex justify-center gap-8 text-lg font-semibold">
          <Link to="/">Anasayfa</Link>
          {isLoggedIn ? (
            <>
              <Link to="/admin">Admin Paneli</Link>
              <button
                onClick={() => setIsLoggedIn(false)}
                className="ml-4 bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
              >
                Çıkış
              </button>
            </>
          ) : (
            <Link to="/login">Admin Giriş</Link>
          )}
        </nav>

        <div className="p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/admin"
              element={isLoggedIn ? <AdminPanel /> : <Navigate to="/login" />}
            />
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
