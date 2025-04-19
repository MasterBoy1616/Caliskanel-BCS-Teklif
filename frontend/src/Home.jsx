import React, { useState, useEffect } from "react";
import axios from "axios";
import { generatePdf } from "./pdfGenerator";

function Home() {
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [parts, setParts] = useState(null);
  const [name, setName] = useState("");
  const [plate, setPlate] = useState("");

  useEffect(() => {
    axios.get("/api/brands").then(res => setBrands(res.data));
  }, []);

  useEffect(() => {
    if (selectedBrand) {
      axios.get(`/api/models?brand=${selectedBrand}`).then(res => setModels(res.data));
    }
  }, [selectedBrand]);

  useEffect(() => {
    if (selectedBrand && selectedModel) {
      axios.get(`/api/parts?brand=${selectedBrand}&model=${selectedModel}`).then(res => setParts(res.data));
    }
  }, [selectedBrand, selectedModel]);

  const handlePdf = () => {
    if (parts && name && plate) {
      generatePdf({ adSoyad: name, plaka: plate }, parts);
    } else {
      alert("Lütfen isim, plaka ve araç bilgilerini doldurunuz.");
    }
  };

  const calculateTotal = () => {
    if (!parts) return 0;
    let total = parts.baseParts.reduce((acc, p) => acc + p.toplam, 0);
    total += parts.labor.toplam;
    return total;
  };

  return (
    <div>
      <div className="selectors">
        <select value={selectedBrand} onChange={e => setSelectedBrand(e.target.value)}>
          <option value="">Marka Seç</option>
          {brands.map((b, i) => <option key={i}>{b}</option>)}
        </select>

        <select value={selectedModel} onChange={e => setSelectedModel(e.target.value)}>
          <option value="">Model Seç</option>
          {models.map((m, i) => <option key={i}>{m}</option>)}
        </select>

        <input type="text" placeholder="Ad Soyad" value={name} onChange={e => setName(e.target.value)} />
        <input type="text" placeholder="Plaka" value={plate} onChange={e => setPlate(e.target.value)} />
      </div>

      {parts && (
        <>
          <table>
            <thead>
              <tr>
                <th>Kategori</th>
                <th>Ürün</th>
                <th>Birim</th>
                <th>Fiyat (TL)</th>
                <th>Toplam (TL)</th>
              </tr>
            </thead>
            <tbody>
              {parts.baseParts.map((p, i) => (
                <tr key={i}>
                  <td>{p.kategori}</td>
                  <td>{p.urun_tip}</td>
                  <td>{p.birim}</td>
                  <td>{p.fiyat}</td>
                  <td>{p.toplam}</td>
                </tr>
              ))}
              <tr>
                <td>{parts.labor.kategori}</td>
                <td>{parts.labor.urun_tip}</td>
                <td>{parts.labor.birim}</td>
                <td>{parts.labor.fiyat}</td>
                <td>{parts.labor.toplam}</td>
              </tr>
            </tbody>
          </table>

          <h2 className="text-xl font-bold mt-4">Toplam: {calculateTotal()} TL (KDV Dahil)</h2>
        </>
      )}

      <div className="mt-6">
        <button className="button" onClick={handlePdf}>📄 Teklifi PDF Olarak Al</button>
      </div>
    </div>
  );
}

export default Home;
