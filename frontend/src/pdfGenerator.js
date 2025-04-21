import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generatePdf = (brand, model, parts, selectedExtras) => {
  const doc = new jsPDF();

  // Başlık
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Çalışkanel Bosch Car Servis", 105, 15, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(`Araç: ${brand} - ${model}`, 105, 25, { align: "center" });

  // Tablo verisi
  const tableData = [];

  parts.baseParts.forEach((p) => {
    tableData.push([p.kategori, p.urun_tip, p.birim, `${p.fiyat} TL`, `${p.toplam} TL`]);
  });

  Object.keys(parts.optional).forEach((key) => {
    if (selectedExtras[key]) {
      parts.optional[key].forEach((p) => {
        tableData.push([p.kategori, p.urun_tip, p.birim, `${p.fiyat} TL`, `${p.toplam} TL`]);
      });
    }
  });

  if (parts.labor) {
    tableData.push([parts.labor.kategori, parts.labor.urun_tip, parts.labor.birim, `${parts.labor.fiyat} TL`, `${parts.labor.toplam} TL`]);
  }

  autoTable(doc, {
    head: [["Kategori", "Ürün Tipi", "Birim", "Fiyat", "Toplam"]],
    body: tableData,
    startY: 35,
    styles: { font: "helvetica", fontSize: 10 },
    headStyles: { fillColor: [41, 128, 185] }
  });

  const total = tableData.reduce((sum, row) => {
    const toplam = parseFloat(row[4].replace(" TL", "")) || 0;
    return sum + toplam;
  }, 0);

  doc.setFontSize(14);
  doc.text(`Toplam Tutar (KDV Dahil): ${total.toLocaleString("tr-TR")} TL`, 105, doc.lastAutoTable.finalY + 20, { align: "center" });

  doc.save(`teklif_${brand}_${model}.pdf`);
};
