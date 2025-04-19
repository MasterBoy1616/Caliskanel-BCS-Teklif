import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generatePdf = (formData, parts, selectedExtras, toplamTutar) => {
  const doc = new jsPDF();
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Çalışkanel Bosch Car Servis", 105, 20, { align: "center" });

  doc.setFontSize(12);
  doc.text(`Müşteri: ${formData.adSoyad}`, 20, 40);
  doc.text(`Plaka: ${formData.plaka}`, 20, 50);

  const tableRows = [];

  parts.baseParts.forEach(p => {
    tableRows.push([p.kategori, p.urun_tip, p.birim, p.fiyat.toFixed(2) + " TL", p.toplam.toFixed(2) + " TL"]);
  });

  Object.keys(parts.optional).forEach(key => {
    if (selectedExtras[key]) {
      parts.optional[key].forEach(p => {
        tableRows.push([p.kategori, p.urun_tip, p.birim, p.fiyat.toFixed(2) + " TL", p.toplam.toFixed(2) + " TL"]);
      });
    }
  });

  tableRows.push([
    parts.labor.kategori,
    parts.labor.urun_tip,
    parts.labor.birim,
    parts.labor.fiyat.toFixed(2) + " TL",
    parts.labor.toplam.toFixed(2) + " TL"
  ]);

  autoTable(doc, {
    startY: 60,
    head: [["Kategori", "Ürün", "Birim", "Fiyat (TL)", "Toplam (TL)"]],
    body: tableRows,
  });

  doc.setFontSize(14);
  doc.text(`Toplam Tutar (KDV Dahil): ${toplamTutar.toLocaleString()} TL`, 20, doc.lastAutoTable.finalY + 20);

  doc.save(`teklif_${formData.plaka}.pdf`);
};
