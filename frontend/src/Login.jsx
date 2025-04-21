import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basit kullanıcı doğrulama (gerçek sistemde backend'den yapılır!)
    if (username === "admin" && password === "1234") {
      localStorage.setItem("isAuthenticated", "true");
      navigate("/admin");
    } else {
      alert("Hatalı kullanıcı adı veya şifre!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Yönetici Girişi</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
          <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded font-bold">
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
