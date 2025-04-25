// frontend/src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PriceCheck from "./components/PriceCheck";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PriceCheck />} />
        <Route path="*" element={<PriceCheck />} />
      </Routes>
    </Router>
  );
};

export default App;
