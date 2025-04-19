// frontend/src/pdfGenerator.js

import jsPDF from "jspdf";
import "jspdf-autotable";

export const generatePdf = (formData, brand, model, parts, selectedExtras) => {
  const doc = new jsPDF();

  // Başlık ve logolar
  doc.addImage("/logo-caliskanel.png", "PNG", 10, 10, 40, 20);
  doc.addImage("/logo-bosch.png", "PNG", 160, 10, 40, 20);

  doc.setFontSize(16);
  doc.text("Çalışkanel Bosch Car Servis - Teklif", 70, 40);

  // Kullanıcı bilgileri
  doc.setFontSize(12);
  doc.text(`Ad Soyad: ${formData.adSoyad}`, 10, 60);
  doc.text(`Telefon: ${formData.telefon}`, 10, 70);
  doc.text(`Plaka: ${formData.plaka}`, 10, 80);
  doc.text(`Araç: ${brand} ${model}`, 10, 90);
  doc.text(`Randevu Tarihi: ${formData.randevuTarihi}`, 10, 100);

  // Parça listesi
  const rows = [];

  parts.baseParts.forEach(p => {
    rows.push([p.kategori, p.urun_tip, p.birim, p.fiyat, p.toplam]);
  });

  Object.entries(parts.optional).forEach(([key, items]) => {
    if (selectedExtras[key]) {
      items.forEach(p => {
        rows.push([p.kategori, p.urun_tip, p.birim, p.fiyat, p.toplam]);
      });
    }
  });

  rows.push([parts.labor.kategori, parts.labor.urun_tip, parts.labor.birim, parts.labor.fiyat, parts.labor.toplam]);

  doc.autoTable({
    head: [["Kategori", "Ürün", "Birim", "Fiyat (TL)", "Toplam (TL)"]],
    body: rows,
    startY: 120,
  });

  const toplamTutar = rows.reduce((sum, row) => sum + row[4], 0);

  doc.setFontSize(14);
  doc.text(`Toplam Tutar (KDV Dahil): ${toplamTutar} TL`, 10, doc.lastAutoTable.finalY + 20);

  doc.save(`teklif_${formData.plaka}.pdf`);
};
