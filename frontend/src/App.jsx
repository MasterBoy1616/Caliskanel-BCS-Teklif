// frontend/src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import AdminPanel from "./AdminPanel";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        {/* Navbar */}
        <nav className="bg-gray-800 text-white p-4 flex justify-center gap-8">
          <Link to="/">Anasayfa</Link>
          {isLoggedIn ? (
            <>
              <Link to="/admin">Admin</Link>
              <button
                onClick={() => setIsLoggedIn(false)}
                className="bg-red-500 hover:bg-red-700 px-3 py-1 rounded"
              >
                Çıkış
              </button>
            </>
          ) : (
            <Link to="/login">Admin Giriş</Link>
          )}
        </nav>

        {/* Sayfa İçeriği */}
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            <Route
              path="/admin"
              element={isLoggedIn ? <AdminPanel /> : <Navigate to="/login" />}
            />
            <Route path="*" element={<Home />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
