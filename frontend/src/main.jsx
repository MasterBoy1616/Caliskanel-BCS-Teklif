import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";  // 👈 CSS'i buraya dahil ediyoruz!

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
