// frontend/src/AdminPanel.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminPanel = () => {
  const [randevular, setRandevular] = useState([]);
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [parts, setParts] = useState(null);

  useEffect(() => {
    fetchRandevular();
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

  const fetchRandevular = () => {
    axios.get("/api/randevular").then(res => setRandevular(res.data));
  };

  return (
    <div>
      <h2>Admin Panel</h2>

      <h3>Randevu Listesi</h3>
      <table>
        <thead>
          <tr>
            <th>Ad Soyad</th>
            <th>Telefon</th>
            <th>Plaka</th>
            <th>Randevu Tarihi</th>
            <th>Durum</th>
          </tr>
        </thead>
        <tbody>
          {randevular.map((r, i) => (
            <tr key={i}>
              <td>{r.adSoyad}</td>
              <td>{r.telefon}</td>
              <td>{r.plaka}</td>
              <td>{r.randevuTarihi}</td>
              <td>{r.durum}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="mt-6">Fiyat Güncelle</h3>

      <div className="selectors">
        <select value={selectedBrand} onChange={(e) => {
          setSelectedBrand(e.target.value);
          setSelectedModel("");
          setParts(null);
        }}>
          <option value="">Marka Seç</option>
          {brands.map((b, i) => <option key={i} value={b}>{b}</option>)}
        </select>

        <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} disabled={!selectedBrand}>
          <option value="">Model Seç</option>
          {models.map((m, i) => <option key={i} value={m}>{m}</option>)}
        </select>
      </div>

      {parts && (
        <table>
          <thead>
            <tr>
              <th>Kategori</th>
              <th>Ürün</th>
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
                <td>{p.fiyat}</td>
                <td>{p.toplam}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminPanel;
