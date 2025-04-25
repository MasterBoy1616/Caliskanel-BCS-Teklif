import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PriceCheck from "./PriceCheck";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<PriceCheck />} />
        {/* İleride diğer sayfalar için rotalar */}
        {/* <Route path="/admin" element={<AdminPanel />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
