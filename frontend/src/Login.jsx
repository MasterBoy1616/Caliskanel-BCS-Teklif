import React, { useState } from "react";

const Login = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "wq27t9mf") {
      setIsLoggedIn(true);
    } else {
      alert("❌ Hatalı kullanıcı adı veya şifre!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="flex flex-col bg-white p-8 rounded shadow-md gap-4 w-80"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Admin Giriş</h2>
        <input
          type="text"
          placeholder="Kullanıcı Adı"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border p-2 rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-800"
        >
          Giriş Yap
        </button>
      </form>
    </div>
  );
};

export default Login;
