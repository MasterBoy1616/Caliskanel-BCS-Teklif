import React, { useState } from "react";

const Login = ({ setIsLoggedIn }) => {
  const [formData, setFormData] = useState({ username: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.username === "admin" && formData.password === "wq27t9mf") {
      setIsLoggedIn(true);
    } else {
      alert("❌ Kullanıcı adı veya şifre yanlış!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Admin Giriş</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
        <input
          type="text"
          name="username"
          placeholder="Kullanıcı Adı"
          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          required
          className="p-2 border"
        />
        <input
          type="password"
          name="password"
          placeholder="Şifre"
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          required
          className="p-2 border"
        />
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 rounded">
          Giriş Yap
        </button>
      </form>
    </div>
  );
};

export default Login;
