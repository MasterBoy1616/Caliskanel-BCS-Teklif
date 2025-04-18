import React, { useState } from "react";

const Login = ({ setIsLoggedIn }) => {
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === "wq27t9mf") {
      setIsLoggedIn(true);
    } else {
      alert("Hatalı şifre!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="border p-2" placeholder="Şifre" />
        <button type="submit" className="button">Giriş Yap</button>
      </form>
    </div>
  );
};

export default Login;
