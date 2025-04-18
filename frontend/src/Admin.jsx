import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

const AdminPanel = () => {
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [parts, setParts] = useState(null);
  const [fiyatBakmaCount, setFiyatBakmaCount] = useState(0);
  const [randevuCount, setRandevuCount] = useState(0);
  const [randevular, setRandevular] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateFilter, setDateFilter] = useState({ start: "", end: "" });

  useEffect(() => {
    axios.get("/api/brands").then((res) => setBrands(res.data));
    axios.get("/api/log/fiyatbakmasayisi").then((res) => setFiyatBakmaCount(res.data.adet));
    axios.get("/api/log/randevusayisi").then((res) => setRandevuCount(res.data.adet));
    axios.get("/api/randevular").then((res) => 
      setRandevular(res.data.map(r => ({ ...r })))
    );
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
  const calculateTotal = () => {
    if (!parts) return 0;
    let total = 0;
    parts.baseParts.forEach(p => total += p.toplam);
    Object.keys(parts.optional).forEach(key => {
      parts.optional[key].forEach(p => total += p.toplam);
    });
    total += parts.labor.toplam;
    return total;
  };

  const handleOnayla = (index) => {
    axios.patch("/api/randevular/update", { index: index, durum: "Onaylandı" })
      .then(() => {
        setRandevular(prev =>
          prev.map((r, i) => (i === index ? { ...r, durum: "Onaylandı" } : r))
        );
      });
  };

  const handleIptalEt = (index) => {
    axios.patch("/api/randevular/update", { index: index, durum: "İptal Edildi" })
      .then(() => {
        setRandevular(prev =>
          prev.map((r, i) => (i === index ? { ...r, durum: "İptal Edildi" } : r))
        );
      });
  };

  const handleSil = (index) => {
    axios.delete("/api/randevular/delete", { data: { index: index } })
      .then(() => {
        setRandevular(prev => prev.filter((_, i) => i !== index));
      });
  };

  const durumRenk = (durum) => {
    if (durum === "Onaylandı") return "text-green-600 font-bold";
    if (durum === "İptal Edildi") return "text-red-600 font-bold";
    return "text-gray-600 font-bold";
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredRandevular);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Randevular");
    XLSX.writeFile(wb, "randevular.xlsx");
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    const columns = ["Ad Soyad", "Telefon", "Plaka", "Araç", "Randevu Tarihi", "Durum"];
    const rows = filteredRandevular.map(r => [
      r.adSoyad, r.telefon, r.plaka, r.arac, r.randevuTarihi.replace("T", " "), r.durum
    ]);

    doc.autoTable({
      head: [columns],
      body: rows,
    });
    doc.save("randevular.pdf");
  };

  const filteredRandevular = randevular.filter(r => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = (
      r.adSoyad.toLowerCase().includes(term) ||
      r.telefon.toLowerCase().includes(term) ||
      r.plaka.toLowerCase().includes(term) ||
      r.arac.toLowerCase().includes(term)
    );

    const dateOk =
      (!dateFilter.start || r.randevuTarihi >= dateFilter.start) &&
      (!dateFilter.end || r.randevuTarihi <= dateFilter.end);

    return matchesSearch && dateOk;
  });
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Admin Panel - Fiyat Takibi ve Randevu Yönetimi</h2>

      {/* Seçim Alanı */}
      <div className="flex gap-4 mb-6">
        <select value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)} className="border p-2 rounded">
          <option value="">Marka Seç</option>
          {brands.map((b, i) => <option key={i} value={b}>{b}</option>)}
        </select>

        <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)} className="border p-2 rounded" disabled={!selectedBrand}>
          <option value="">Model Seç</option>
          {models.map((m, i) => <option key={i} value={m}>{m}</option>)}
        </select>
      </div>

      {/* Sayaçlar */}
      <div className="flex gap-8 mb-6">
        <div className="bg-blue-100 p-4 rounded shadow text-center">
          <h3 className="text-lg font-bold">Fiyat Sorgulama</h3>
          <p className="text-2xl">{fiyatBakmaCount}</p>
        </div>
        <div className="bg-green-100 p-4 rounded shadow text-center">
          <h3 className="text-lg font-bold">Randevu Alımı</h3>
          <p className="text-2xl">{randevuCount}</p>
        </div>
      </div>

      {/* Arama ve Tarih Filtre */}
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          placeholder="Arama (İsim, Plaka, Araç)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-2 rounded flex-1"
        />
        <input
          type="date"
          value={dateFilter.start}
          onChange={(e) => setDateFilter(prev => ({ ...prev, start: e.target.value }))}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={dateFilter.end}
          onChange={(e) => setDateFilter(prev => ({ ...prev, end: e.target.value }))}
          className="border p-2 rounded"
        />
        <button onClick={exportExcel} className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded">
          Excel İndir
        </button>
        <button onClick={exportPDF} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded">
          PDF İndir
        </button>
      </div>

      {/* Fiyat Listesi */}
      {parts && (
        <div className="overflow-x-auto mb-8">
          <table className="min-w-full table-auto border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 border">Kategori</th>
                <th className="p-2 border">Ürün/TİP</th>
                <th className="p-2 border">Birim</th>
                <th className="p-2 border">Fiyat</th>
                <th className="p-2 border">Toplam</th>
              </tr>
            </thead>
            <tbody>
              {parts.baseParts.map((p, i) => (
                <tr key={i}>
                  <td className="p-2 border">{p.kategori}</td>
                  <td className="p-2 border">{p.urun_tip}</td>
                  <td className="p-2 border">{p.birim}</td>
                  <td className="p-2 border">{p.fiyat} TL</td>
                  <td className="p-2 border">{p.toplam} TL</td>
                </tr>
              ))}
              {Object.entries(parts.optional).map(([key, items]) =>
                items.map((p, i) => (
                  <tr key={`${key}-${i}`}>
                    <td className="p-2 border">{p.kategori}</td>
                    <td className="p-2 border">{p.urun_tip}</td>
                    <td className="p-2 border">{p.birim}</td>
                    <td className="p-2 border">{p.fiyat} TL</td>
                    <td className="p-2 border">{p.toplam} TL</td>
                  </tr>
                ))
              )}
              <tr className="font-semibold">
                <td className="p-2 border">{parts.labor.kategori}</td>
                <td className="p-2 border">{parts.labor.urun_tip}</td>
                <td className="p-2 border">{parts.labor.birim}</td>
                <td className="p-2 border">{parts.labor.fiyat} TL</td>
                <td className="p-2 border">{parts.labor.toplam} TL</td>
              </tr>
            </tbody>
          </table>

          <h3 className="mt-6 text-lg font-bold">Toplam: {calculateTotal()} TL</h3>
        </div>
      )}
      {/* Randevu Listesi */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4">Gelen Randevular</h2>
        {filteredRandevular.length === 0 ? (
          <p>Sonuç bulunamadı veya henüz randevu alınmamış.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 border">Ad Soyad</th>
                  <th className="p-2 border">Telefon</th>
                  <th className="p-2 border">Plaka</th>
                  <th className="p-2 border">Araç</th>
                  <th className="p-2 border">Randevu Tarihi</th>
                  <th className="p-2 border">Durum</th>
                  <th className="p-2 border">İşlem</th>
                </tr>
              </thead>
              <tbody>
                {filteredRandevular.map((r, i) => (
                  <tr key={i}>
                    <td className="p-2 border">{r.adSoyad}</td>
                    <td className="p-2 border">{r.telefon}</td>
                    <td className="p-2 border">{r.plaka}</td>
                    <td className="p-2 border">{r.arac}</td>
                    <td className="p-2 border">{r.randevuTarihi.replace("T", " ")}</td>
                    <td className={`p-2 border ${durumRenk(r.durum)}`}>{r.durum}</td>
                    <td className="p-2 border flex flex-wrap gap-2">
                      <button onClick={() => handleOnayla(i)} className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded">
                        Onayla
                      </button>
                      <button onClick={() => handleIptalEt(i)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded">
                        İptal Et
                      </button>
                      <button onClick={() => handleSil(i)} className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded">
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
