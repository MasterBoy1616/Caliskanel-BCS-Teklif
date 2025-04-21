import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";

export const generatePdf = (customerInfo, totalPrice, parts, selectedExtras) => {
  const doc = new jsPDF();

  // Header kısmı
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Çalışkanel Bosch Car Servisi", 105, 20, { align: "center" });

  doc.setFontSize(12);
  doc.text(`Müşteri: ${customerInfo.adSoyad}`, 14, 40);
  doc.text(`Plaka: ${customerInfo.plaka}`, 14, 48);
  doc.text(`Araç: ${customerInfo.arac || "Belirtilmedi"}`, 14, 56);

  // Parça listesi tablosu
  const allParts = [
    ...parts.baseParts,
    ...Object.keys(parts.optional).flatMap(key => selectedExtras[key] ? parts.optional[key] : []),
    parts.labor
  ];

  autoTable(doc, {
    startY: 65,
    head: [["Kategori", "Ürün", "Birim", "Fiyat (TL)", "Toplam (TL)"]],
    body: allParts.map(p => [
      p.kategori,
      p.urun_tip,
      p.birim.toString(),
      p.fiyat.toLocaleString(),
      p.toplam.toLocaleString()
    ]),
    theme: 'grid',
    headStyles: { fillColor: [41, 128, 185] },
    styles: { font: "helvetica", fontSize: 10 },
  });

  // Toplam tutar kısmı
  doc.setFontSize(14);
  doc.text(`Toplam Tutar: ${totalPrice.toLocaleString()} TL (KDV Dahil)`, 14, doc.lastAutoTable.finalY + 20);

  // Footer kısmı
  doc.setFontSize(10);
  doc.text("Çalışkanel Bosch Car Servisi - Her zaman yanınızdayız!", 105, 285, { align: "center" });

  doc.save(`teklif_${customerInfo.plaka || "arac"}.pdf`);
};
