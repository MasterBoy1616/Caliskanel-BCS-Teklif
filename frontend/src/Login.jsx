import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "wq27t9mf") {
      localStorage.setItem("isLoggedIn", "true");
      navigate("/admin");
    } else {
      setError("Hatalı kullanıcı adı veya şifre!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#e3f2fd" }}>
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-center mb-6">
          <img src="/logo-bosch.png" alt="Bosch Logo" className="h-16" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-6">Admin Giriş</h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Kullanıcı Adı"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-2 border rounded"
            required
          />
          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 border rounded"
            required
          />
          {error && <p className="text-red-500 text-center">{error}</p>}
          <button
            type="submit"
            className="bg-blue-700 hover:bg-blue-800 text-white p-2 rounded"
          >
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
