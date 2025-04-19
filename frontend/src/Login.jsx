import React, { useState } from "react";

const Login = ({ setIsLoggedIn }) => {
  const [form, setForm] = useState({ username: "", password: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.username === "admin" && form.password === "wq27t9mf") {
      setIsLoggedIn(true);
    } else {
      alert("Hatalı kullanıcı adı veya şifre!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-center mb-4">Admin Giriş</h1>
        <input
          type="text"
          placeholder="Kullanıcı Adı"
          className="border p-2 rounded"
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Şifre"
          className="border p-2 rounded"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700">
          Giriş Yap
        </button>
      </form>
    </div>
  );
};

export default Login;
