import React, { useState, useEffect } from "react";
import axios from "axios";
import { generatePDF } from "./pdfGenerator";
import "./styles.css";

function Home() {
  const [isim, setIsim] = useState("");
  const [plaka, setPlaka] = useState("");
  const [markalar, setMarkalar] = useState([]);
  const [secilenMarka, setSecilenMarka] = useState("");
  const [modeller, setModeller] = useState([]);
  const [secilenModel, setSecilenModel] = useState("");
  const [parcalar, setParcalar] = useState([]);
  const [loading, setLoading] = useState(false);

  const backendUrl = "";

  useEffect(() => {
    async function fetchMarkalar() {
      try {
        const res = await axios.get(`${backendUrl}/api/markalar`);
        setMarkalar(res.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchMarkalar();
  }, []);

  useEffect(() => {
    async function fetchModeller() {
      if (secilenMarka) {
        try {
          const res = await axios.get(`${backendUrl}/api/modeller`, {
            params: { marka: secilenMarka },
          });
          setModeller(res.data);
        } catch (error) {
          console.error(error);
        }
      }
    }
    fetchModeller();
  }, [secilenMarka]);

  const handleMarkaChange = (e) => {
    setSecilenMarka(e.target.value);
    setSecilenModel("");
    setParcalar([]);
  };

  const handleModelChange = (e) => {
    setSecilenModel(e.target.value);
    fetchParcalar(e.target.value);
  };

  async function fetchParcalar(model) {
    setLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/api/parcalar`, {
        params: { marka: secilenMarka, model },
      });
      setParcalar(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <h1>Çalışkanel Servis</h1>

      <div className="form">
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
        <select onChange={handleMarkaChange} value={secilenMarka}>
          <option value="">Marka Seçiniz</option>
          {markalar.map((marka) => (
            <option key={marka} value={marka}>
              {marka}
            </option>
          ))}
        </select>
        <select onChange={handleModelChange} value={secilenModel} disabled={!secilenMarka}>
          <option value="">Model Seçiniz</option>
          {modeller.map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>
      </div>

      {loading && <div className="loading">Yükleniyor...</div>}

      {parcalar.length > 0 && (
        <div className="table">
          <table>
            <thead>
              <tr>
                <th>Parça</th>
                <th>Adet</th>
                <th>Birim Fiyat</th>
                <th>Toplam</th>
              </tr>
            </thead>
            <tbody>
              {parcalar.map((parca, index) => (
                <tr key={index}>
                  <td>{parca.urun}</td>
                  <td>{parca.adet}</td>
                  <td>{parca.birim_fiyat} TL</td>
                  <td>{parca.toplam_fiyat} TL</td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            className="pdfButton"
            onClick={() => generatePDF(isim, plaka, secilenMarka, secilenModel, parcalar)}
          >
            PDF Oluştur
          </button>
        </div>
      )}
    </div>
  );
}

export default Home;
