import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });

  const handleLogin = (e) => {
    e.preventDefault();
    if (form.username === "admin" && form.password === "wq27t9mf") {
      navigate("/admin");
    } else {
      alert("Kullanıcı adı veya şifre hatalı!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Giriş</h2>
        <input 
          type="text" 
          name="username" 
          placeholder="Kullanıcı Adı" 
          className="w-full mb-4 p-2 border rounded" 
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />
        <input 
          type="password" 
          name="password" 
          placeholder="Şifre" 
          className="w-full mb-6 p-2 border rounded" 
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded">
          Giriş Yap
        </button>
      </form>
    </div>
  );
};

export default Login;
