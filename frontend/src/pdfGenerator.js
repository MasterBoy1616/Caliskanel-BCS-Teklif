// frontend/src/pdfGenerator.js
import jsPDF from "jspdf";
import "jspdf-autotable";

export const generatePdf = (formData, toplamFiyat, baseParts, optionalParts, labor) => {
  const doc = new jsPDF();

  // Logo eklemek için
  const boschLogo = "/logo-bosch.png"; // Public dizinde olacak
  const caliskanelLogo = "/logo-caliskanel.png"; // Public dizinde olacak

  // Bosch logosu
  doc.addImage(boschLogo, "PNG", 14, 10, 40, 20);
  // Çalışkanel logosu
  doc.addImage(caliskanelLogo, "PNG", 150, 10, 40, 20);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(18);
  doc.text("Periyodik Bakım Teklifi", 105, 40, { align: "center" });

  doc.setFontSize(12);
  doc.text(`Ad Soyad: ${formData.adSoyad}`, 14, 60);
  doc.text(`Telefon: ${formData.telefon}`, 14, 68);
  doc.text(`Plaka: ${formData.plaka}`, 14, 76);
  doc.text(`Araç: ${formData.arac}`, 14, 84);
  doc.text(`Randevu Tarihi: ${formData.randevuTarihi.replace("T", " ")}`, 14, 92);

  const allParts = [
    ...baseParts.map(p => [p.kategori, p.urun_tip, p.birim, `${p.fiyat} TL`, `${p.toplam} TL`]),
    ...optionalParts.map(p => [p.kategori, p.urun_tip, p.birim, `${p.fiyat} TL`, `${p.toplam} TL`]),
    [labor.kategori, labor.urun_tip, labor.birim, `${labor.fiyat} TL`, `${labor.toplam} TL`]
  ];

  doc.autoTable({
    head: [["Kategori", "Ürün", "Birim", "Birim Fiyat", "Toplam"]],
    body: allParts,
    startY: 100,
    styles: {
      font: "helvetica",
      fontStyle: "normal",
      fontSize: 10,
      cellPadding: 3,
      overflow: "linebreak",
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240],
    },
  });

  doc.setFontSize(14);
  doc.text(`Toplam: ${toplamFiyat} TL (KDV Dahil)`, 14, doc.lastAutoTable.finalY + 10);

  doc.save(`teklif_${formData.plaka || "arac"}.pdf`);
};
