import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { generatePDF } from "./pdfGenerator";

const AnaSayfa = () => {
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [parts, setParts] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/brands").then((res) => setBrands(res.data));
  }, []);

  useEffect(() => {
    if (selectedBrand) {
      axios.get(`/api/models?brand=${selectedBrand}`).then((res) => setModels(res.data));
    }
  }, [selectedBrand]);

  useEffect(() => {
    if (selectedBrand && selectedModel) {
      axios.get(`/api/parts?brand=${selectedBrand}&model=${selectedModel}`)
        .then((res) => setParts(res.data));
    }
  }, [selectedBrand, selectedModel]);

  const handleRandevu = async () => {
    await generatePDF(selectedBrand, selectedModel, parts);
    navigate("/randevu");
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Periyodik Bakım Fiyat Sorgulama</h2>
      <div className="space-x-4 mb-6">
        <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
          <option value="">Marka Seç</option>
          {brands.map(b => <option key={b}>{b}</option>)}
        </select>

        <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} disabled={!selectedBrand}>
          <option value="">Model Seç</option>
          {models.map(m => <option key={m}>{m}</option>)}
        </select>
      </div>

      {parts && (
        <>
          <table className="w-full mb-4 border">
            <thead>
              <tr>
                <th>Kategori</th>
                <th>Ürün/TİP</th>
                <th>Birim</th>
                <th>Fiyat</th>
                <th>Toplam</th>
              </tr>
            </thead>
            <tbody>
              {parts.baseParts.map((p, i) => (
                <tr key={i}>
                  <td>{p.kategori}</td>
                  <td>{p.urun_tip}</td>
                  <td>{p.birim}</td>
                  <td>{p.fiyat} TL</td>
                  <td>{p.toplam} TL</td>
                </tr>
              ))}
              <tr>
                <td>{parts.labor.kategori}</td>
                <td>{parts.labor.urun_tip}</td>
                <td>{parts.labor.birim}</td>
                <td>{parts.labor.fiyat} TL</td>
                <td>{parts.labor.toplam} TL</td>
              </tr>
            </tbody>
          </table>

          <button className="bg-blue-600 text-white px-6 py-2 rounded" onClick={handleRandevu}>
            Randevu Al
          </button>
        </>
      )}
    </div>
  );
};

export default AnaSayfa;
