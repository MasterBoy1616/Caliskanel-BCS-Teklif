// frontend/src/pdfGenerator.js

import jsPDF from "jspdf";
import "jspdf-autotable";

export const generatePdf = (formData, fiyatBilgisi, parts = [], optionalParts = []) => {
  const doc = new jsPDF();

  // Logolar
  const boschLogo = "/logo-bosch.png";
  const caliskanelLogo = "/logo-caliskanel.png";

  doc.addImage(boschLogo, "PNG", 10, 10, 30, 15);
  doc.addImage(caliskanelLogo, "PNG", 165, 10, 30, 15);

  doc.setFontSize(18);
  doc.text("Çalışkanel Oto Bosch Car Service", 105, 35, { align: "center" });

  doc.setFontSize(12);
  doc.text(`Adres: 29 Ekim Mh. İzmir Yolu Cd. No:384 Nilüfer Bursa`, 10, 50);
  doc.text(`Tel: 0224 443 57 88 - Mail: caliskanel@boschservice.com.tr`, 10, 57);
  doc.text(`Web: www.caliskanel.com`, 10, 64);

  doc.line(10, 70, 200, 70);

  doc.setFontSize(14);
  doc.text("Araç Sahibi Bilgileri", 10, 80);

  const randevuInfo = [
    ["Ad Soyad:", formData.adSoyad],
    ["Telefon:", formData.telefon],
    ["Araç Plakası:", formData.plaka],
    ["Araç Marka/Model:", formData.arac],
    ["Randevu Tarihi:", formData.randevuTarihi.replace("T", " ")],
  ];

  randevuInfo.forEach(([label, value], index) => {
    doc.setFontSize(12);
    doc.text(`${label} ${value}`, 10, 90 + index * 7);
  });

  doc.line(10, 130, 200, 130);

  doc.setFontSize(14);
  doc.text("Bakım Parçaları", 10, 140);

  // Parçalar tablosu
  const parcalar = [
    ["Kategori", "Ürün", "Birim", "Fiyat (TL)", "Toplam (TL)"],
    ...parts.map(p => [p.kategori, p.urun_tip, p.birim, `${p.fiyat}`, `${p.toplam}`]),
    ...optionalParts.map(p => [p.kategori, p.urun_tip, p.birim, `${p.fiyat}`, `${p.toplam}`])
  ];

  doc.autoTable({
    startY: 145,
    head: [parcalar[0]],
    body: parcalar.slice(1),
    styles: { fontSize: 10 }
  });

  const finalY = doc.lastAutoTable.finalY + 10;

  doc.setFontSize(14);
  doc.text(`Toplam Tutar: ${fiyatBilgisi} TL (KDV Dahil)`, 10, finalY);

  doc.setFontSize(10);
  doc.text("Bu fiyat sadece 7 gün geçerlidir.", 10, finalY + 7);

  // Aracın fotoğrafı veya logosu
  const vehicleImage = "/yedek-arac.png";  // Buraya istersen bir örnek araç logosu da koyabiliriz.

  doc.addImage(vehicleImage, "PNG", 70, finalY + 15, 70, 40);

  doc.save("randevu_teklifi.pdf");
};
