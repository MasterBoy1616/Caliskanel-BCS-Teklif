// frontend/src/main.jsx

import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css" // varsa stilleri buradan alır

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
