import jsPDF from "jspdf";
import "jspdf-autotable";

export function generatePdf(brand, model, parts) {
  const doc = new jsPDF();
  
  doc.addFont("Helvetica", "Helvetica", "normal");
  doc.setFont("Helvetica");

  doc.setFontSize(18);
  doc.text("Çalışkanel Bosch Car Servis", 14, 20);
  doc.setFontSize(14);
  doc.text(`Araç: ${brand} ${model}`, 14, 30);
  doc.text(`Tarih: ${new Date().toLocaleDateString("tr-TR")}`, 14, 40);

  const rows = parts.baseParts.map(p => [
    p.kategori,
    p.urun_tip,
    p.birim,
    `${p.fiyat} TL`,
    `${p.toplam} TL`
  ]);

  rows.push([
    parts.labor.kategori,
    parts.labor.urun_tip,
    parts.labor.birim,
    `${parts.labor.fiyat} TL`,
    `${parts.labor.toplam} TL`
  ]);

  doc.autoTable({
    startY: 50,
    head: [["Kategori", "Ürün", "Birim", "Fiyat", "Toplam"]],
    body: rows,
    theme: "striped",
  });

  const total = parts.baseParts.reduce((acc, p) => acc + p.toplam, 0) + parts.labor.toplam;
  doc.setFontSize(16);
  doc.text(`Toplam: ${total} TL (KDV Dahil)`, 14, doc.lastAutoTable.finalY + 20);

  doc.save(`teklif_${brand}_${model}.pdf`);
}
