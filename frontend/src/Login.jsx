import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (formData.username === "admin" && formData.password === "1234") {
      navigate("/admin");
    } else {
      setError("Geçersiz kullanıcı adı veya şifre");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Admin Girişi</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-4 w-80 bg-white p-6 rounded shadow">
        <input
          type="text"
          name="username"
          placeholder="Kullanıcı Adı"
          value={formData.username}
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          required
          className="p-2 border"
        />
        <input
          type="password"
          name="password"
          placeholder="Şifre"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
          className="p-2 border"
        />
        <button type="submit" className="button">
          Giriş Yap
        </button>
        {error && <div className="text-red-500 text-center">{error}</div>}
      </form>
    </div>
  );
}

export default Login;
