import React, { useState } from "react";

const Login = ({ setIsLoggedIn }) => {
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === "wq27t9mf") {
      setIsLoggedIn(true);
    } else {
      alert("❌ Şifre yanlış!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-80">
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 border rounded"
        />
        <button type="submit" className="button">Giriş Yap</button>
      </form>
    </div>
  );
};

export default Login;
