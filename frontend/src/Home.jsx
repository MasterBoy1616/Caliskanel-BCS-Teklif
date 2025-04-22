import React, { useState, useEffect } from "react";
import axios from "axios";
import { generatePdf } from "./pdfGenerator";
import "./MainTheme.css";

function Home() {
  const [isim, setIsim] = useState("");
  const [plaka, setPlaka] = useState("");
  const [markalar, setMarkalar] = useState([]);
  const [modeller, setModeller] = useState([]);
  const [secilenMarka, setSecilenMarka] = useState("");
  const [secilenModel, setSecilenModel] = useState("");
  const [parcalar, setParcalar] = useState([]);
  const [extras, setExtras] = useState({ balata: false, disk: false, silecek: false });

  useEffect(() => {
    axios.get("/api/markalar").then(res => setMarkalar(res.data));
  }, []);

  useEffect(() => {
    if (secilenMarka) {
      axios.get(`/api/modeller?marka=${encodeURIComponent(secilenMarka)}`).then(res => setModeller(res.data));
    }
  }, [secilenMarka]);

  useEffect(() => {
    if (secilenMarka && secilenModel) {
      axios.get(`/api/parcalar?marka=${encodeURIComponent(secilenMarka)}&model=${encodeURIComponent(secilenModel)}`).then(res => setParcalar(res.data));
    }
  }, [secilenMarka, secilenModel]);

  const handleExtraChange = (e) => {
    setExtras({ ...extras, [e.target.name]: e.target.checked });
  };

  const toplam = [...parcalar].reduce((acc, item) => acc + item.toplam, 0);

  return (
    <div className="container">
      <h1 className="title">Çalışkanel Bosch Car Servisi</h1>

      <input className="input" placeholder="İsim Soyisim" value={isim} onChange={e => setIsim(e.target.value)} />
      <input className="input" placeholder="Plaka" value={plaka} onChange={e => setPlaka(e.target.value)} />

      <select className="select" value={secilenMarka} onChange={e => setSecilenMarka(e.target.value)}>
        <option value="">Marka Seç</option>
        {markalar.map(m => <option key={m} value={m}>{m}</option>)}
      </select>

      <select className="select" value={secilenModel} onChange={e => setSecilenModel(e.target.value)}>
        <option value="">Model Seç</option>
        {modeller.map(m => <option key={m} value={m}>{m}</option>)}
      </select>

      <div className="extras">
        <label><input type="checkbox" name="balata" checked={extras.balata} onChange={handleExtraChange} /> Balata</label>
        <label><input type="checkbox" name="disk" checked={extras.disk} onChange={handleExtraChange} /> Disk</label>
        <label><input type="checkbox" name="silecek" checked={extras.silecek} onChange={handleExtraChange} /> Silecek</label>
      </div>

      <button className="button" onClick={() => generatePdf(isim, plaka, secilenMarka, secilenModel, parcalar, toplam, extras)}>PDF OLUŞTUR</button>
    </div>
  );
}

export default Home;
