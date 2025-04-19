import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ setIsLoggedIn }) => {
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.username === "admin" && form.password === "wq27t9mf") {
      setIsLoggedIn(true);
      navigate("/admin");
    } else {
      alert("❌ Kullanıcı adı veya şifre yanlış!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl mb-4">Admin Giriş</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
        <input
          type="text"
          placeholder="Kullanıcı Adı"
          name="username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          className="border p-2"
          required
        />
        <input
          type="password"
          placeholder="Şifre"
          name="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="border p-2"
          required
        />
        <button type="submit" className="bg-blue-500 text-white py-2 rounded">
          Giriş Yap
        </button>
      </form>
    </div>
  );
};

export default Login;
