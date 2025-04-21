import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "1234") {
      navigate("/admin");
    } else {
      alert("Kullanıcı adı veya şifre yanlış!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen app-background">
      <div className="app-container">
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Girişi</h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Kullanıcı Adı"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="password"
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded"
          />
          <button type="submit" className="button mt-4">
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
