import React, { useEffect, useState } from "react";
import axios from "axios";

const Admin = () => {
  const [fiyatlar, setFiyatlar] = useState([]);
  const [yuzdelik, setYuzdelik] = useState(0);

  useEffect(() => {
    axios.get("/api/brands").then(res => {
      const brand = res.data[0];
      axios.get(`/api/models?brand=${brand}`).then(res2 => {
        const model = res2.data[0];
        axios.get(`/api/parts?brand=${brand}&model=${model}`).then(res3 => {
          const data = res3.data;
          const allParts = [...data.baseParts];
          Object.values(data.optional).forEach(opt => allParts.push(...opt));
          allParts.push(data.labor);
          setFiyatlar(allParts);
        });
      });
    });
  }, []);

  const handleFiyatChange = (index, yeniFiyat) => {
    const updated = [...fiyatlar];
    updated[index].fiyat = Number(yeniFiyat);
    updated[index].toplam = updated[index].birim * Number(yeniFiyat);
    setFiyatlar(updated);
  };

  const handleTopluArttir = () => {
    const updated = fiyatlar.map(p => ({
      ...p,
      fiyat: Math.round(p.fiyat * (1 + yuzdelik / 100)),
      toplam: Math.round(p.birim * p.fiyat * (1 + yuzdelik / 100))
    }));
    setFiyatlar(updated);
  };

  const handleSave = async () => {
    try {
      await axios.post("/api/update-prices", fiyatlar);
      alert("✅ Fiyatlar başarıyla kaydedildi!");
    } catch (err) {
      alert("❌ Kaydetme sırasında hata oluştu!");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Admin Panel</h2>

      <div className="flex gap-4 mb-6">
        <input
          type="number"
          placeholder="Yüzde (%)"
          value={yuzdelik}
          onChange={(e) => setYuzdelik(Number(e.target.value))}
          className="border p-2 rounded"
        />
        <button onClick={handleTopluArttir} className="button">Yüzdelik Arttır</button>
        <button onClick={handleSave} className="button bg-green-600 hover:bg-green-700">Kaydet</button>
      </div>

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
          {fiyatlar.map((p, i) => (
            <tr key={i}>
              <td>{p.kategori}</td>
              <td>{p.urun_tip}</td>
              <td>{p.birim}</td>
              <td>
                <input
                  type="number"
                  value={p.fiyat}
                  onChange={(e) => handleFiyatChange(i, e.target.value)}
                  className="border p-1 w-24"
                />
              </td>
              <td>{p.toplam}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Admin;
