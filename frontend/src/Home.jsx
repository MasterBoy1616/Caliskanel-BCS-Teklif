import React, { useState, useEffect } from "react";
import axios from "axios";
import { generatePdf } from "./pdfGenerator";
import "./SpotliraTheme.css";

function Home() {
  const [markalar, setMarkalar] = useState([]);
  const [modeller, setModeller] = useState([]);
  const [selectedMarka, setSelectedMarka] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [parts, setParts] = useState([]);
  const [isim, setIsim] = useState("");
  const [plaka, setPlaka] = useState("");

  useEffect(() => {
    axios.get("/api/markalar")
      .then(res => setMarkalar(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleMarkaChange = (e) => {
    const marka = e.target.value;
    setSelectedMarka(marka);
    setSelectedModel("");
    setParts([]);
    axios.get(`/api/modeller?marka=${encodeURIComponent(marka)}`)
      .then(res => setModeller(res.data))
      .catch(err => console.error(err));
  };

  const handleModelChange = (e) => {
    const model = e.target.value;
    setSelectedModel(model);
    axios.get(`/api/parcalar?marka=${encodeURIComponent(selectedMarka)}&model=${encodeURIComponent(model)}`)
      .then(res => setParts(res.data))
      .catch(err => console.error(err));
  };

  const toplamFiyat = parts.reduce((acc, part) => acc + part.toplam, 0);

  return (
    <div className="container">
      <header className="header">
        <img src="/logo-caliskanel.png" alt="Caliskanel Logo" className="logo" />
        <img src="/logo-bosch.png" alt="Bosch Logo" className="logo" />
      </header>

      <div className="form">
        <input
          type="text"
          placeholder="İsim Soyisim"
          value={isim}
          onChange={(e) => setIsim(e.target.value)}
          className="input"
        />
        <input
          type="text"
          placeholder="Plaka"
          value={plaka}
          onChange={(e) => setPlaka(e.target.value)}
          className="input"
        />

        <select value={selectedMarka} onChange={handleMarkaChange} className="select">
          <option value="">Marka Seçin</option>
          {markalar.map((marka, idx) => (
            <option key={idx} value={marka}>{marka}</option>
          ))}
        </select>

        <select value={selectedModel} onChange={handleModelChange} className="select" disabled={!selectedMarka}>
          <option value="">Model Seçin</option>
          {modeller.map((model, idx) => (
            <option key={idx} value={model}>{model}</option>
          ))}
        </select>
      </div>

      {parts.length > 0 && (
        <table className="price-table">
          <thead>
            <tr>
              <th>Ürün</th>
              <th>Adet</th>
              <th>Birim Fiyat</th>
              <th>Toplam</th>
            </tr>
          </thead>
          <tbody>
            {parts.map((part, idx) => (
              <tr key={idx}>
                <td>{part.urun}</td>
                <td>{part.adet}</td>
                <td>{part.birim_fiyat.toLocaleString()} TL</td>
                <td>{part.toplam.toLocaleString()} TL</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {parts.length > 0 && (
        <>
          <div className="total">
            Toplam: {toplamFiyat.toLocaleString()} TL
          </div>
          <button className="button" onClick={() => generatePdf(isim, plaka, selectedMarka, selectedModel, parts, toplamFiyat)}>
            PDF Teklif Oluştur
          </button>
        </>
      )}
    </div>
  );
}

export default Home;
