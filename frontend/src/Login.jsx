import React from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/admin");
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Admin Giriş</h1>
      <form onSubmit={handleLogin} className="flex flex-col gap-4 w-64">
        <input type="text" placeholder="Kullanıcı Adı" className="border p-2" required />
        <input type="password" placeholder="Şifre" className="border p-2" required />
        <button type="submit" className="button">Giriş Yap</button>
      </form>
    </div>
  );
}

export default Login;
