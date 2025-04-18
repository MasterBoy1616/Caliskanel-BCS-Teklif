import jsPDF from "jspdf";
import "jspdf-autotable";

export const generatePdf = (formData, fiyatBilgisi, parts, optionalParts) => {
  const doc = new jsPDF();

  // Başlık
  doc.setFontSize(18);
  doc.text("Çalışkanel Servis - Teklif Formu", 20, 20);

  // Müşteri Bilgileri
  doc.setFontSize(12);
  doc.text(`Ad Soyad: ${formData.adSoyad}`, 20, 40);
  doc.text(`Telefon: ${formData.telefon}`, 20, 50);
  doc.text(`Plaka: ${formData.plaka}`, 20, 60);
  doc.text(`Araç: ${formData.arac}`, 20, 70);
  doc.text(`Randevu Tarihi: ${formData.randevuTarihi}`, 20, 80);

  // Parça Listesi Başlık
  doc.setFontSize(14);
  doc.text("Periyodik Bakım Parçaları", 20, 95);

  // Parça Tablosu
  const partRows = parts.map((p) => [
    p.kategori,
    p.urun_tip,
    p.birim,
    `${p.fiyat} TL`,
    `${p.toplam} TL`
  ]);

  doc.autoTable({
    head: [["Kategori", "Ürün", "Birim", "Fiyat", "Toplam"]],
    body: partRows,
    startY: 100,
  });

  // Eğer opsiyonel parçalar varsa onları da ekle
  if (optionalParts.length > 0) {
    const optStartY = doc.previousAutoTable.finalY + 10;

    doc.setFontSize(14);
    doc.text("Ekstra Parçalar", 20, optStartY);

    const optionalRows = optionalParts.map((p) => [
      p.kategori,
      p.urun_tip,
      p.birim,
      `${p.fiyat} TL`,
      `${p.toplam} TL`
    ]);

    doc.autoTable({
      head: [["Kategori", "Ürün", "Birim", "Fiyat", "Toplam"]],
      body: optionalRows,
      startY: optStartY + 5,
    });
  }

  // Toplam Fiyat
  const totalY = doc.previousAutoTable.finalY + 10;
  doc.setFontSize(16);
  doc.text(`Toplam Fiyat (KDV Dahil): ${fiyatBilgisi} TL`, 20, totalY);

  // PDF'i kaydet
  doc.save(`teklif_${formData.plaka || "randevu"}.pdf`);
};
