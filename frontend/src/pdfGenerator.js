import jsPDF from "jspdf";

export async function generatePDF(brand, model, parts) {
  const doc = new jsPDF();

  // LOGOLAR
  const logoCaliskanel = "/logo-caliskanel.png";
  const logoBosch = "/logo-bosch.png";
  const carPlaceholder = "/car-placeholder.png";

  // Logo ekleme
  doc.addImage(logoCaliskanel, "PNG", 10, 10, 40, 20);
  doc.addImage(logoBosch, "PNG", 160, 10, 40, 20);

  doc.setFontSize(14);
  doc.text(`Araç Marka: ${brand}`, 14, 40);
  doc.text(`Araç Model: ${model}`, 14, 48);

  doc.setFontSize(12);
  doc.text("Parçalar:", 14, 60);

  let startY = 70;

  parts.baseParts.forEach(p => {
    doc.text(`${p.kategori} - ${p.urun_tip} (${p.birim}) - ${p.fiyat} TL - ${p.toplam} TL`, 14, startY);
    startY += 8;
  });

  doc.text(`${parts.labor.kategori} - ${parts.labor.urun_tip} (${parts.labor.birim}) - ${parts.labor.fiyat} TL - ${parts.labor.toplam} TL`, 14, startY);
  startY += 10;

  const toplamFiyat = parts.baseParts.reduce((acc, p) => acc + p.toplam, 0) + parts.labor.toplam;
  doc.setFontSize(14);
  doc.text(`Toplam: ${toplamFiyat} TL (KDV Dahil)`, 14, startY);
  startY += 10;

  doc.setFontSize(10);
  doc.text("Bu fiyat listesi oluşturulduğu tarihten itibaren 7 gün geçerlidir.", 14, startY);
  startY += 20;

  // Araç fotoğrafı
  try {
    doc.addImage(carPlaceholder, "PNG", 60, startY, 90, 50);
  } catch (e) {
    console.log("Araba fotoğrafı eklenemedi:", e);
  }

  startY += 60;

  // Şirket Bilgileri
  doc.setFontSize(12);
  doc.text("Çalışkanel Oto Bosch Car Service", 14, startY);
  doc.setFontSize(10);
  doc.text("Adres: 29 Ekim Mh. İzmir Yolu Cd. No:384 Nilüfer Bursa", 14, startY + 6);
  doc.text("Telefon: 0224 443 57 88", 14, startY + 12);
  doc.text("Mail: caliskanel@boschservice.com.tr", 14, startY + 18);
  doc.text("Web: www.caliskanel.com", 14, startY + 24);

  doc.save("fiyat_teklifi.pdf");
}
