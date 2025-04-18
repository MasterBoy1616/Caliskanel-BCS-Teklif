import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ setIsLoggedIn }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === "wq27t9mf") {
      setIsLoggedIn(true);
      navigate("/admin");
    } else {
      setError(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <form onSubmit={handleLogin} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-80">
        <h2 className="text-2xl font-bold mb-6 text-center">Admin Giriş</h2>
        <input
          type="password"
          placeholder="Şifre"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(false);
          }}
          className={`border p-2 w-full mb-4 rounded ${error ? "border-red-500" : ""}`}
        />
        {error && <p className="text-red-500 text-sm mb-4">Şifre yanlış ❌</p>}
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded w-full">
          Giriş Yap
        </button>
      </form>
    </div>
  );
};

export default Login;
