import React, { useState, useEffect } from "react";
import axios from "axios";
import { generatePdf } from "./pdfGenerator";
import "./MainTheme.css";

function Home() {
  const [markalar, setMarkalar] = useState([]);
  const [modeller, setModeller] = useState([]);
  const [secilenMarka, setSecilenMarka] = useState("");
  const [secilenModel, setSecilenModel] = useState("");
  const [parcalar, setParcalar] = useState([]);
  const [isim, setIsim] = useState("");
  const [plaka, setPlaka] = useState("");

  useEffect(() => {
    axios.get("/api/markalar").then(res => setMarkalar(res.data));
  }, []);

  useEffect(() => {
    if (secilenMarka) {
      axios.get(`/api/modeller?marka=${secilenMarka}`).then(res => setModeller(res.data));
    }
  }, [secilenMarka]);

  useEffect(() => {
    if (secilenMarka && secilenModel) {
      axios.get(`/api/parcalar?marka=${secilenMarka}&model=${secilenModel}`)
        .then(res => setParcalar(res.data));
    }
  }, [secilenMarka, secilenModel]);

  const toplamTutar = parcalar.reduce((acc, item) => acc + item.toplam_fiyat, 0);

  return (
    <div className="container">
      <div className="logo-container">
        <img src="/logo-bosch.png" alt="Bosch Logo" className="logo" />
        <img src="/logo-caliskanel.png" alt="Çalışkanel Logo" className="logo" />
      </div>
      <div className="card">
        <div className="select-container">
          <select onChange={e => setSecilenMarka(e.target.value)} value={secilenMarka}>
            <option value="">Marka Seçin</option>
            {markalar.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <select onChange={e => setSecilenModel(e.target.value)} value={secilenModel}>
            <option value="">Model Seçin</option>
            {modeller.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <table className="parcalar-tablosu">
          <thead>
            <tr>
              <th>Ürün / İşçilik</th>
              <th>Adet</th>
              <th>Birim Fiyat (TL)</th>
              <th>Toplam (TL)</th>
            </tr>
          </thead>
          <tbody>
            {parcalar.map((parca, idx) => (
              <tr key={idx}>
                <td>{parca.urun}</td>
                <td>{parca.adet}</td>
                <td>{parca.birim_fiyat} TL</td>
                <td>{parca.toplam_fiyat} TL</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="toplam-tutar">Toplam: {toplamTutar.toLocaleString()} TL</div>
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
        <button onClick={() => generatePdf(secilenMarka, secilenModel, parcalar, toplamTutar, isim, plaka)}>
          PDF Teklif Al
        </button>
      </div>
    </div>
  );
}

export default Home;
