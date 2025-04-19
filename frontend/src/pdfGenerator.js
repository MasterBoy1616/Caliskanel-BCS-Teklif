import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generatePdf = (formData, parts, totalPrice) => {
  const doc = new jsPDF();

  // Bosch ve Çalışkanel logosu
  const logo1 = "/logo-bosch.png";
  const logo2 = "/logo-caliskanel.png";

  doc.addImage(logo1, "PNG", 10, 10, 40, 15);
  doc.addImage(logo2, "PNG", 160, 10, 40, 15);

  doc.setFontSize(16);
  doc.text("Çalışkanel Bosch Car Servis", 105, 35, { align: "center" });

  doc.setFontSize(12);
  doc.text(`Ad Soyad: ${formData.adSoyad}`, 14, 50);
  doc.text(`Plaka: ${formData.plaka}`, 14, 58);

  autoTable(doc, {
    startY: 70,
    head: [["Kategori", "Ürün", "Fiyat (₺)", "Adet", "Toplam (₺)"]],
    body: parts.map((p) => [
      p.kategori,
      p.urun_tip,
      p.fiyat.toLocaleString('tr-TR'),
      p.birim,
      p.toplam.toLocaleString('tr-TR')
    ])
  });

  doc.setFontSize(14);
  doc.text(`Toplam Tutar (KDV Dahil): ${totalPrice.toLocaleString('tr-TR')} ₺`, 14, doc.lastAutoTable.finalY + 20);

  doc.save(`Teklif_${formData.plaka}.pdf`);
};
