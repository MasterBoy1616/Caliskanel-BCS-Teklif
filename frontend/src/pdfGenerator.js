// frontend/src/pdfGenerator.js

import jsPDF from "jspdf";

export const generatePdf = (formData, fiyatBilgisi) => {
  const doc = new jsPDF();

  // Şirket bilgileri
  doc.setFontSize(14);
  doc.text("Çalışkanel Oto Bosch Car Service", 20, 20);
  doc.setFontSize(10);
  doc.text("Adres: 29 Ekim Mh. İzmir Yolu Cd. No:384 Nilüfer/Bursa", 20, 28);
  doc.text("Tel: 0224 443 57 88 | Mail: caliskanel@boschservice.com.tr", 20, 34);
  doc.text("Web: www.caliskanel.com", 20, 40);

  // Fiyat Bilgisi
  doc.setFontSize(12);
  doc.text("Fiyat Teklifi", 20, 55);
  doc.setFontSize(10);
  doc.text(`Toplam Fiyat: ${fiyatBilgisi} TL (KDV Dahil)`, 20, 65);
  doc.text(`Teklifin Geçerlilik Süresi: 7 Gündür`, 20, 72);

  // Randevu Bilgileri
  doc.setFontSize(12);
  doc.text("Müşteri Bilgileri", 20, 90);
  doc.setFontSize(10);
  doc.text(`Ad Soyad: ${formData.adSoyad}`, 20, 100);
  doc.text(`Telefon: ${formData.telefon}`, 20, 106);
  doc.text(`Araç Plakası: ${formData.plaka}`, 20, 112);
  doc.text(`Araç Marka/Model: ${formData.arac}`, 20, 118);
  doc.text(`Randevu Tarihi: ${formData.randevuTarihi}`, 20, 124);

  // Araç fotoğrafı veya yedek logo
  const logoUrl = "/logo-bosch.png"; // Buraya örnek logoyu ekliyoruz
  const img = new Image();
  img.src = logoUrl;
  img.onload = () => {
    doc.addImage(img, "PNG", 140, 10, 50, 20);
    doc.save("teklif.pdf");
  };

  // Eğer fotoğraf yüklenmezse yine de PDF kaydedilsin
  setTimeout(() => {
    doc.save("teklif.pdf");
  }, 1000);
};
