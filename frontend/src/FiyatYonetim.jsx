import React, { useState, useEffect } from "react";
import axios from "axios";

const FiyatYonetim = () => {
  const [fiyatlar, setFiyatlar] = useState([]);
  const [guncelFiyatlar, setGuncelFiyatlar] = useState([]);
  const [yuzde, setYuzde] = useState(0);

  useEffect(() => {
    // Başlangıçta bir örnek FIAT-EGEA fiyatı alıyoruz
    axios.get("/api/parts?brand=FIAT&model=EGEA")
      .then(res => {
        const tumFiyatlar = [
          ...res.data.baseParts,
          ...Object.values(res.data.optional).flat(),
          res.data.labor
        ];
        setFiyatlar(tumFiyatlar);
        setGuncelFiyatlar(tumFiyatlar);
      })
      .catch(err => console.error(err));
  }, []);

  const handleChange = (index, field, value) => {
    const updated = [...guncelFiyatlar];
    updated[index] = { ...updated[index], [field]: parseFloat(value) || 0 };
    updated[index].toplam = updated[index].fiyat * updated[index].birim;
    setGuncelFiyatlar(updated);
  };

  const topluGuncelle = () => {
    const updated = fiyatlar.map(item => ({
      ...item,
      fiyat: Math.round(item.fiyat * (1 + yuzde / 100)),
      toplam: Math.round(item.toplam * (1 + yuzde / 100))
    }));
    setGuncelFiyatlar(updated);
  };

  const kaydetFiyatlar = () => {
    axios.post("/api/save-prices", guncelFiyatlar)
      .then(() => alert("✅ Fiyatlar başarıyla kaydedildi!"))
      .catch(() => alert("❌ Fiyatları kaydederken hata oluştu!"));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex gap-4 mb-4 items-center">
        <input
          type="number"
          value={yuzde}
          onChange={(e) => setYuzde(Number(e.target.value))}
          placeholder="% Değişim"
          className="border p-2 rounded w-32"
        />
        <button
          onClick={topluGuncelle}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Toplu Güncelle
        </button>
        <button
          onClick={kaydetFiyatlar}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Kaydet
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Kategori</th>
              <th className="border p-2">Ürün</th>
              <th className="border p-2">Birim</th>
              <th className="border p-2">Fiyat</th>
              <th className="border p-2">Toplam</th>
            </tr>
          </thead>
          <tbody>
            {guncelFiyatlar.map((item, idx) => (
              <tr key={idx}>
                <td className="border p-2">{item.kategori}</td>
                <td className="border p-2">{item.urun_tip}</td>
                <td className="border p-2">{item.birim}</td>
                <td className="border p-2">
                  <input
                    type="number"
                    value={item.fiyat}
                    onChange={(e) => handleChange(idx, "fiyat", e.target.value)}
                    className="border rounded p-1 w-24"
                  />
                </td>
                <td className="border p-2">{item.toplam}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FiyatYonetim;
