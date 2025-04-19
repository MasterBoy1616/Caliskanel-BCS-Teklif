import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [hata, setHata] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (form.username === "admin" && form.password === "wq27t9mf") {
      setIsLoggedIn(true);
      navigate("/admin");
    } else {
      setHata("Hatalı kullanıcı adı veya şifre!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleLogin} className="flex flex-col gap-4 w-80 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Admin Giriş</h2>
        {hata && <div className="text-red-500 text-sm">{hata}</div>}
        <input
          type="text"
          placeholder="Kullanıcı Adı"
          name="username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
          className="border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Şifre"
          name="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-blue-600 text-white py-2 rounded">
          Giriş Yap
        </button>
      </form>
    </div>
  );
};

export default Login;
