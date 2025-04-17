import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AdminPanel from "./Admin";
import FiyatSorgulama from "./FiyatSorgulama";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<FiyatSorgulama />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;
