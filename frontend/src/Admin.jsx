import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as XLSX from "xlsx";

const AdminPanel = () => {
  const [submissions, setSubmissions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filter, setFilter] = useState("hepsi");
  const [expanded, setExpanded] = useState(null);
  const [notes, setNotes] = useState({});
  const [readStatus, setReadStatus] = useState({});

  useEffect(() => {
    fetch("/api/submissions")
      .then(res => res.json())
      .then(data => {
        const sorted = data.sort((a, b) => b.file.localeCompare(a.file));
        setSubmissions(sorted);
        setFiltered(sorted);
      });
  }, []);

  useEffect(() => {
    if (filter === "hepsi") setFiltered(submissions);
    else if (filter === "teklif") setFiltered(submissions.filter(s => s.file.startsWith("teklif")));
    else if (filter === "randevu") setFiltered(submissions.filter(s => s.file.startsWith("randevu")));
  }, [filter, submissions]);

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filtered);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Basvurular");
    XLSX.writeFile(wb, "basvurular.xlsx");
  };

  const handleDelete = (filename) => {
    const updated = submissions.filter(s => s.file !== filename);
    setSubmissions(updated);
    setFiltered(updated);
    alert(`🗑️ ${filename} silindi (not simulated)`);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">📥 Gelen Başvurular</h2>

      <div className="flex gap-4 mb-4">
        <Button variant={filter === "hepsi" ? "default" : "outline"} onClick={() => setFilter("hepsi")}>Tümü</Button>
        <Button variant={filter === "teklif" ? "default" : "outline"} onClick={() => setFilter("teklif")}>Teklifler</Button>
        <Button variant={filter === "randevu" ? "default" : "outline"} onClick={() => setFilter("randevu")}>Randevular</Button>
        <Button onClick={exportToExcel} className="ml-auto">Excel'e Aktar</Button>
      </div>

      <div className="space-y-4">
        {filtered.map((entry, i) => (
          <Card key={i} className={readStatus[entry.file] ? "opacity-70" : ""}>
            <CardContent className="space-y-2 p-4">
              <div className="flex justify-between">
                <p><strong>İsim:</strong> {entry.name}</p>
                {!readStatus[entry.file] && <span className="text-green-600 text-xs">🟢 Yeni</span>}
              </div>
              <p><strong>Telefon:</strong> {entry.phone}</p>
              <p><strong>Marka / Model / Tip:</strong> {entry.brand} / {entry.model} / {entry.type}</p>
              <p><strong>Fiyat:</strong> {entry.price ? `${entry.price} TL` : "-"}</p>
              {entry.date && <p><strong>Randevu Tarihi:</strong> {entry.date}</p>}
              <p className="text-sm text-gray-500">Dosya: {entry.file}</p>

              <div className="flex flex-wrap gap-2 pt-2">
                <Button size="sm" variant="secondary" onClick={() => {
                  setExpanded(expanded === i ? null : i);
                  setReadStatus(prev => ({ ...prev, [entry.file]: true }));
                }}>
                  {expanded === i ? "Detayı Gizle" : "Detayı Gör"}
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(entry.file)}>Sil</Button>
              </div>

              {expanded === i && (
                <div className="bg-gray-50 p-3 rounded mt-3 space-y-2 text-sm text-gray-700">
                  <pre>{JSON.stringify(entry, null, 2)}</pre>
                  <Input
                    placeholder="Not ekle..."
                    value={notes[entry.file] || ""}
                    onChange={e => setNotes(prev => ({ ...prev, [entry.file]: e.target.value }))}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
