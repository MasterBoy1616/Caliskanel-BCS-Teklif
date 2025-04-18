import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { FaCheck, FaTrash } from "react-icons/fa";

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
  const [selectedIndexes, setSelectedIndexes] = useState([]);
  const [showPreview, setShowPreview] = useState(false);
  const [previewType, setPreviewType] = useState(""); // excel veya pdf

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
  const toggleSelect = (index) => {
    if (selectedIndexes.includes(index)) {
      setSelectedIndexes(selectedIndexes.filter((i) => i !== index));
    } else {
      setSelectedIndexes([...selectedIndexes, index]);
    }
  };

  const handleTopluOnayla = () => {
    const updated = randevular.map((r, i) =>
      selectedIndexes.includes(i) ? { ...r, durum: "Onaylandı" } : r
    );
    setRandevular(updated);
    setSelectedIndexes([]);
  };

  const handleTopluSil = () => {
    const updated = randevular.filter((_, i) => !selectedIndexes.includes(i));
    setRandevular(updated);
    setSelectedIndexes([]);
  };

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

  const durumRenk = (durum) => {
    if (durum === "Onaylandı") return "text-green-600 font-bold";
    if (durum === "İptal Edildi") return "text-red-600 font-bold";
    return "text-gray-600 font-bold";
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

  const openPreview = (type) => {
    setPreviewType(type);
    setShowPreview(true);
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

      {/* Arama + Tarih + Export */}
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
        <button onClick={() => openPreview("excel")} className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded">
          Excel İndir
        </button>
        <button onClick={() => openPreview("pdf")} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded">
          PDF İndir
        </button>
      </div>

      {/* Toplu İşlem Butonları */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={handleTopluOnayla}
          disabled={selectedIndexes.length === 0}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:bg-green-300"
        >
          <FaCheck /> Seçilenleri Onayla
        </button>

        <button
          onClick={handleTopluSil}
          disabled={selectedIndexes.length === 0}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded disabled:bg-red-300"
        >
          <FaTrash /> Seçilenleri Sil
        </button>
      </div>

      {/* Randevu Listesi */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2 border">Seç</th>
              <th className="p-2 border">Ad Soyad</th>
              <th className="p-2 border">Telefon</th>
              <th className="p-2 border">Plaka</th>
              <th className="p-2 border">Araç</th>
              <th className="p-2 border">Randevu Tarihi</th>
              <th className="p-2 border">Durum</th>
            </tr>
          </thead>
          <tbody>
            {filteredRandevular.map((r, i) => (
              <tr key={i}>
                <td className="p-2 border text-center">
                  <input
                    type="checkbox"
                    checked={selectedIndexes.includes(i)}
                    onChange={() => toggleSelect(i)}
                  />
                </td>
                <td className="p-2 border">{r.adSoyad}</td>
                <td className="p-2 border">{r.telefon}</td>
                <td className="p-2 border">{r.plaka}</td>
                <td className="p-2 border">{r.arac}</td>
                <td className="p-2 border">{r.randevuTarihi.replace("T", " ")}</td>
                <td className={`p-2 border ${durumRenk(r.durum)}`}>{r.durum}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ÖNİZLEME MODAL */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl animate-fade-in">
            <h2 className="text-xl font-bold mb-4">
              Seçilen Randevular – {previewType.toUpperCase()} Önizleme
            </h2>

            <div className="overflow-x-auto max-h-96 overflow-y-auto mb-6">
              <table className="min-w-full table-auto border">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="p-2 border">Ad Soyad</th>
                    <th className="p-2 border">Telefon</th>
                    <th className="p-2 border">Plaka</th>
                    <th className="p-2 border">Araç</th>
                    <th className="p-2 border">Randevu Tarihi</th>
                    <th className="p-2 border">Durum</th>
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
                      <td className="p-2 border">{r.durum}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  if (previewType === "excel") exportExcel();
                  if (previewType === "pdf") exportPDF();
                  setShowPreview(false);
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                İndir
              </button>

              <button
                onClick={() => setShowPreview(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
              >
                İptal Et
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
