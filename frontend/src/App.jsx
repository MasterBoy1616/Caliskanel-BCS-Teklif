import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import FiyatSorgulama from "./FiyatSorgulama";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FiyatSorgulama />} />
        <Route path="*" element={<FiyatSorgulama />} />
      </Routes>
    </Router>
  );
};

export default App;
