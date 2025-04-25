// frontend/src/FiyatSorgulama.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import caliskanelLogo from "./logo-caliskanel.png";
import boschLogo from "./logo-bosch.png";

const FiyatSorgulama = () => {
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [parts, setParts] = useState(null);
  const [selectedExtras, setSelectedExtras] = useState({
    balata: false,
    disk: false,
    silecek: false,
  });

  useEffect(() => {
    axios.get("/api/brands").then((res) => setBrands(res.data));
  }, []);

  useEffect(() => {
    if (selectedBrand) {
      axios
        .get(`/api/models?brand=${selectedBrand}`)
        .then((res) => setModels(res.data));
    }
  }, [selectedBrand]);

  useEffect(() => {
    if (selectedBrand && selectedModel) {
      axios
        .get(`/api/parts?brand=${selectedBrand}&model=${selectedModel}`)
        .then((res) => setParts(res.data));
    }
  }, [selectedBrand, selectedModel]);

  const calculateTotal = () => {
    if (!parts) return 0;
    let total = 0;
    parts.baseParts.forEach((p) => (total += p.toplam));
    Object.keys(selectedExtras).forEach((key) => {
      if (selectedExtras[key]) {
        parts.optional[key].forEach((p) => (total += p.toplam));
      }
    });
    total += parts.labor.toplam;
    return total;
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.addImage(caliskanelLogo, "PNG", 10, 10, 40, 15);
    doc.addImage(boschLogo, "PNG", 160, 10, 40, 15);
    doc.setFontSize(16);
    doc.text("Periyodik Bakım Teklifi", 75, 35);

    const rows = [];
    if (parts) {
      parts.baseParts.forEach((p) => {
        rows.push([
          p.kategori,
          p.urun_tip,
          p.birim,
          `${p.fiyat} TL`,
          `${p.toplam} TL`,
        ]);
      });
      Object.keys(selectedExtras).forEach((key) => {
        if (selectedExtras[key]) {
          parts.optional[key].forEach((p) => {
            rows.push([
              p.kategori,
              p.urun_tip,
              p.birim,
              `${p.fiyat} TL`,
              `${p.toplam} TL`,
            ]);
          });
        }
      });
      rows.push([
        parts.labor.kategori,
        parts.labor.urun_tip,
        parts.labor.birim,
        `${parts.labor.fiyat} TL`,
        `${parts.labor.toplam} TL`,
      ]);
    }

    autoTable(doc, {
      head: [["Kategori", "Ürün", "Birim", "Fiyat", "Toplam"]],
      body: rows,
      startY: 45,
    });

    doc.setFontSize(12);
    doc.text("Toplam (KDV Dahil): " + calculateTotal() + " TL", 14, doc.lastAutoTable.finalY + 10);
    doc.text("Bu fiyatlar 7 gün geçerlidir.", 14, doc.lastAutoTable.finalY + 20);
    doc.save("teklif.pdf");
  };

  return (
    <div className="app-background">
      <div className="app-container">
        <h2>Periyodik Bakım Fiyat Sorgulama</h2>
        <div className="selectors">
          <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)}>
            <option value="">Marka Seç</option>
            {brands.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            disabled={!selectedBrand}
          >
            <option value="">Model Seç</option>
            {models.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </div>

        {parts && (
          <>
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
                    <td>{p.fiyat} TL</td>
                    <td>{p.toplam} TL</td>
                  </tr>
                ))}
                {Object.entries(parts.optional).map(([key, items]) =>
                  selectedExtras[key]
                    ? items.map((p, i) => (
                        <tr key={`${key}-${i}`}>
                          <td>{p.kategori}</td>
                          <td>{p.urun_tip}</td>
                          <td>{p.birim}</td>
                          <td>{p.fiyat} TL</td>
                          <td>{p.toplam} TL</td>
                        </tr>
                      ))
                    : null
                )}
                <tr>
                  <td>{parts.labor.kategori}</td>
                  <td>{parts.labor.urun_tip}</td>
                  <td>{parts.labor.birim}</td>
                  <td>{parts.labor.fiyat} TL</td>
                  <td>{parts.labor.toplam} TL</td>
                </tr>
              </tbody>
            </table>

            <h3>Toplam (KDV Dahil): {calculateTotal()} TL</h3>
            <button className="btn-pdf" onClick={generatePDF}>
              📄 PDF Oluştur
            </button>
          </>
        )}

        <div className="extras">
          {["balata", "disk", "silecek"].map((opt) => (
            <label key={opt}>
              <input
                type="checkbox"
                checked={selectedExtras[opt]}
                onChange={() =>
                  setSelectedExtras((prev) => ({ ...prev, [opt]: !prev[opt] }))
                }
              />
              {opt.toUpperCase()}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FiyatSorgulama;
