import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { FaCheck, FaTrash } from "react-icons/fa";
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend
} from "recharts";

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
  const [previewType, setPreviewType] = useState("");

  useEffect(() => {
    axios.get("/api/brands").then((res) => setBrands(res.data));
    axios.get("/api/log/fiyatbakmasayisi").then((res) => setFiyatBakmaCount(res.data.adet));
    axios.get("/api/log/randevusayisi").then((res) => setRandevuCount(res.data.adet));
    axios.get("/api/randevular").then((res) => setRandevular(res.data.map(r => ({ ...r }))));
  }, []);

  useEffect(() => {
    if (selectedBrand) {
      axios.get(`/api/models?brand=${selectedBrand}`).then((res) => setModels(res.data));
    }
  }, [selectedBrand]);

  useEffect(() => {
    if (selectedBrand && selectedModel) {
      axios.get(`/api/parts?brand=${selectedBrand}&model=${selectedModel}`).then((res) => setParts(res.data));
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

  const generateMonthlyData = (randevular) => {
    const months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
    const data = months.map(m => ({
      month: m,
      adet: randevular.filter(r => r.randevuTarihi.split("-")[1] === m).length
    }));
    return data;
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Admin Panel - Fiyat Takibi ve Randevu Yönetimi</h2>

      {/* Dashboard Grafikler */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Pasta Grafik */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-bold text-center mb-4">Randevu Durumları</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={[
                  { name: "Beklemede", value: randevular.filter(r => r.durum === "Beklemede").length },
                  { name: "Onaylandı", value: randevular.filter(r => r.durum === "Onaylandı").length },
                  { name: "İptal Edildi", value: randevular.filter(r => r.durum === "İptal Edildi").length },
                ]}
                cx="50%" cy="50%" outerRadius={100}
                dataKey="value"
                label
              >
                <Cell fill="#005baa" />
                <Cell fill="#e60012" />
                <Cell fill="#cccccc" />
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Grafik */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-bold text-center mb-4">Aylık Randevu Alımları</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={generateMonthlyData(randevular)}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="adet" fill="#005baa" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Diğer içerikler */}
      {/* Buraya daha önce yaptığımız Toplu Seçim / Önizleme / İndir / İptal işlemleri ve tablo geliyor */}
    </div>
  );
};

export default AdminPanel;
