// frontend/src/Home.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { generatePdf } from "./pdfGenerator";
import "./SpotliraTheme.css";

function Home() {
  const [markalar, setMarkalar] = useState([]);
  const [modeller, setModeller] = useState([]);
  const [secilenMarka, setSecilenMarka] = useState("");
  const [secilenModel, setSecilenModel] = useState("");
  const [parcalar, setParcalar] = useState([]);
  const [isim, setIsim] = useState("");
  const [plaka, setPlaka] = useState("");

  useEffect(() => {
    axios.get("/api/markalar")
      .then((response) => {
        setMarkalar(response.data);
      });
  }, []);

  useEffect(() => {
    if (secilenMarka) {
      axios.get(`/api/modeller?marka=${secilenMarka}`)
        .then((response) => {
          setModeller(response.data);
        });
    }
  }, [secilenMarka]);

  useEffect(() => {
    if (secilenMarka && secilenModel) {
      axios.get(`/api/parcalar?marka=${secilenMarka}&model=${secilenModel}`)
        .then((response) => {
          setParcalar(response.data);
        });
    }
  }, [secilenMarka, secilenModel]);

  const toplamFiyat = parcalar.reduce((acc, parca) => acc + parca.toplam, 0);

  return (
    <div className="container">
      <div className="header">
        <img src="/logo-bosch.png" alt="Bosch Logo" className="logo" />
        <img src="/logo-caliskanel.png" alt="Çalışkanel Logo" className="logo" />
      </div>

      <div className="form-group">
        <input 
          type="text" 
          placeholder="İsim Soyisim" 
          value={isim} 
          onChange={(e) => setIsim(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="Plaka" 
          value={plaka} 
          onChange={(e) => setPlaka(e.target.value)} 
        />
      </div>

      <div className="form-group">
        <select value={secilenMarka} onChange={(e) => setSecilenMarka(e.target.value)}>
          <option value="">Marka Seçin</option>
          {markalar.map((marka, index) => (
            <option key={index} value={marka}>{marka}</option>
          ))}
        </select>

        <select value={secilenModel} onChange={(e) => setSecilenModel(e.target.value)}>
          <option value="">Model Seçin</option>
          {modeller.map((model, index) => (
            <option key={index} value={model}>{model}</option>
          ))}
        </select>
      </div>

      <div className="table-wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Kategori</th>
              <th>Ürün</th>
              <th>Adet</th>
              <th>Birim Fiyat (TL)</th>
              <th>Toplam (TL)</th>
            </tr>
          </thead>
          <tbody>
            {parcalar.map((parca, index) => (
              <tr key={index}>
                <td>{parca.kategori}</td>
                <td>{parca.urun}</td>
                <td>{parca.adet}</td>
                <td>{parca.birim_fiyat} TL</td>
                <td>{parca.toplam} TL</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="summary">
        Toplam: {toplamFiyat} TL
      </div>

      <div className="form-group">
        <button onClick={() => generatePdf(isim, plaka, secilenMarka, secilenModel, parcalar, toplamFiyat)}>
          PDF Teklif Al
        </button>
      </div>
    </div>
  );
}

export default Home;
