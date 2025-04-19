// frontend/src/Login.jsx

import React, { useState } from "react";

const Login = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "wq27t9mf") {
      setIsLoggedIn(true);
    } else {
      alert("Kullanıcı adı veya şifre yanlış!");
    }
  };

  return (
    <div className="login-container">
      <h2>Admin Giriş</h2>
      <form onSubmit={handleLogin}>
        <input type="text" placeholder="Kullanıcı Adı" value={username} onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" placeholder="Şifre" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" className="button">Giriş Yap</button>
      </form>
    </div>
  );
};

export default Login;
