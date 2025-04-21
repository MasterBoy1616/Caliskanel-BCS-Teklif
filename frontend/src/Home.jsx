import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import axios from "axios";

const Home = () => {
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedParts, setSelectedParts] = useState([]);
  const [optionalParts, setOptionalParts] = useState({
    balata: [],
    disk: [],
    silecek: [],
  });
  const [totalPrice, setTotalPrice] = useState(0);
  const [name, setName] = useState("");
  const [plate, setPlate] = useState("");

  useEffect(() => {
    axios.get("/api/brands").then((res) => setBrands(res.data));
  }, []);

  const handleBrandChange = (e) => {
    const brand = e.target.value;
    setSelectedBrand(brand);
    setSelectedModel("");
    axios.get(`/api/models?brand=${brand}`).then((res) => setModels(res.data));
    setSelectedParts([]);
    setOptionalParts({ balata: [], disk: [], silecek: [] });
  };

  const handleModelChange = (e) => {
    const model = e.target.value;
    setSelectedModel(model);
    axios.get(`/api/parts?brand=${selectedBrand}&model=${model}`).then((res) => {
      setSelectedParts(res.data.baseParts || []);
      setOptionalParts(res.data.optional || {});
    });
  };

  const handleOptionalToggle = (type) => {
    const options = optionalParts[type] || [];
    setSelectedParts((prev) => {
      const alreadyIncluded = prev.some((p) => options.find((o) => o.urun_tip === p.urun_tip));
      if (alreadyIncluded) {
        return prev.filter((p) => !options.find((o) => o.urun_tip === p.urun_tip));
      } else {
        return [...prev, ...options];
      }
    });
  };

  useEffect(() => {
    const total = selectedParts.reduce((sum, part) => sum + (part.toplam || 0), 0);
    setTotalPrice(total);
  }, [selectedParts]);

  const handleGeneratePDF = () => {
    if (!name || !plate || selectedParts.length === 0) {
      alert("Lütfen isim, plaka ve parça seçimlerini tamamlayın!");
      return;
    }

    const doc = new jsPDF();

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Çalışkanel Bosch Car Servisi", 105, 15, { align: "center" });

    doc.setFontSize(12);
    doc.text(`İsim Soyisim: ${name}`, 20, 30);
    doc.text(`Plaka: ${plate}`, 20, 38);

    const tableData = selectedParts.map((part) => [
      part.kategori,
      part.urun_tip,
      part.birim,
      `${part.fiyat?.toLocaleString()} TL`,
    ]);

    doc.autoTable({
      head: [["Kategori", "Ürün/Tip", "Birim", "Fiyat"]],
      body: tableData,
      startY: 45,
      theme: "striped",
    });

    const finalY = doc.lastAutoTable.finalY || 60;
    doc.setFontSize(14);
    doc.text(`Toplam: ${totalPrice.toLocaleString()} TL`, 20, finalY + 20);

    doc.save(`teklif_${plate}.pdf`);
  };

  return (
    <div className="app-background">
      <div className="app-container">
        <h1 className="title">Çalışkanel Bosch Car Servisi</h1>

        <div className="selectors">
          <select value={selectedBrand} onChange={handleBrandChange}>
            <option value="">Marka Seçin</option>
            {brands.map((brand) => (
              <option key={brand}>{brand}</option>
            ))}
          </select>

          <select value={selectedModel} onChange={handleModelChange} disabled={!selectedBrand}>
            <option value="">Model Seçin</option>
            {models.map((model) => (
              <option key={model}>{model}</option>
            ))}
          </select>
        </div>

        <div className="extras">
          <label>
            <input type="checkbox" onChange={() => handleOptionalToggle("balata")} />
            Ön Fren Balata
          </label>
          <label>
            <input type="checkbox" onChange={() => handleOptionalToggle("disk")} />
            Ön Fren Disk
          </label>
          <label>
            <input type="checkbox" onChange={() => handleOptionalToggle("silecek")} />
            Silecek
          </label>
        </div>

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
            {selectedParts.map((part, idx) => (
              <tr key={idx}>
                <td>{part.kategori}</td>
                <td>{part.urun_tip}</td>
                <td>{part.birim}</td>
                <td>{part.fiyat?.toLocaleString()} TL</td>
                <td>{part.toplam?.toLocaleString()} TL</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="info-fields">
          <input type="text" placeholder="İsim Soyisim" value={name} onChange={(e) => setName(e.target.value)} />
          <input type="text" placeholder="Plaka" value={plate} onChange={(e) => setPlate(e.target.value)} />
        </div>

        <div className="summary">
          <h2>Toplam: {totalPrice.toLocaleString()} TL</h2>
        </div>

        <div className="actions">
          <button onClick={handleGeneratePDF} className="button">PDF Oluştur</button>
        </div>
      </div>
    </div>
  );
};

export default Home;
