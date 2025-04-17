import React, { useEffect, useState } from "react";
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
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
      <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>📥 Gelen Başvurular</h2>

      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button onClick={() => setFilter("hepsi")}>Tümü</button>
        <button onClick={() => setFilter("teklif")}>Teklifler</button>
        <button onClick={() => setFilter("randevu")}>Randevular</button>
        <button onClick={exportToExcel} style={{ marginLeft: "auto" }}>Excel'e Aktar</button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {filtered.map((entry, i) => (
          <div key={i} style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "15px",
            backgroundColor: readStatus[entry.file] ? "#f5f5f5" : "#ffffff",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <p><strong>İsim:</strong> {entry.name}</p>
              {!readStatus[entry.file] && <span style={{ color: "green", fontSize: "12px" }}>🟢 Yeni</span>}
            </div>
            <p><strong>Telefon:</strong> {entry.phone}</p>
            <p><strong>Marka / Model / Tip:</strong> {entry.brand} / {entry.model} / {entry.type}</p>
            <p><strong>Fiyat:</strong> {entry.price ? `${entry.price} TL` : "-"}</p>
            {entry.date && <p><strong>Randevu Tarihi:</strong> {entry.date}</p>}
            <p style={{ fontSize: "12px", color: "#888" }}>Dosya: {entry.file}</p>

            <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
              <button onClick={() => {
                setExpanded(expanded === i ? null : i);
                setReadStatus(prev => ({ ...prev, [entry.file]: true }));
              }}>
                {expanded === i ? "Detayı Gizle" : "Detayı Gör"}
              </button>
              <button style={{ backgroundColor: "red", color: "white" }} onClick={() => handleDelete(entry.file)}>Sil</button>
            </div>

            {expanded === i && (
              <div style={{ marginTop: "10px", backgroundColor: "#f9f9f9", padding: "10px", borderRadius: "6px" }}>
                <pre style={{ fontSize: "12px" }}>{JSON.stringify(entry, null, 2)}</pre>
                <input
                  type="text"
                  placeholder="Not ekle..."
                  style={{ width: "100%", marginTop: "8px", padding: "8px" }}
                  value={notes[entry.file] || ""}
                  onChange={e => setNotes(prev => ({ ...prev, [entry.file]: e.target.value }))}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPanel;
