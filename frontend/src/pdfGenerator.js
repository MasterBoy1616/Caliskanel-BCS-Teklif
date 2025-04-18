import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generatePdf = (formData, totalFiyat, partsData, selectedExtras) => {
  const doc = new jsPDF();

  const boschLogo = "/logo-bosch.png";
  const caliskanelLogo = "/logo-caliskanel.png";

  doc.addImage(boschLogo, "PNG", 10, 10, 40, 20);
  doc.addImage(caliskanelLogo, "PNG", 160, 10, 40, 20);

  doc.setFontSize(16);
  doc.text("Periyodik Bakım Teklifi", 80, 40);

  doc.setFontSize(12);
  doc.text(`Ad Soyad: ${formData.adSoyad}`, 14, 60);
  doc.text(`Telefon: ${formData.telefon}`, 14, 70);
  doc.text(`Plaka: ${formData.plaka}`, 14, 80);
  doc.text(`Araç: ${formData.arac}`, 14, 90);
  doc.text(`Randevu Tarihi: ${formData.randevuTarihi}`, 14, 100);

  const body = [
    ...partsData.baseParts.map(p => [p.kategori, p.urun_tip, p.birim, `${p.fiyat} TL`, `${p.toplam} TL`]),
    ...Object.keys(selectedExtras).flatMap(key => selectedExtras[key] ? partsData.optional[key].map(p => [p.kategori, p.urun_tip, p.birim, `${p.fiyat} TL`, `${p.toplam} TL`]) : []),
    [partsData.labor.kategori, partsData.labor.urun_tip, partsData.labor.birim, `${partsData.labor.fiyat} TL`, `${partsData.labor.toplam} TL`]
  ];

  autoTable(doc, {
    startY: 110,
    head: [["Kategori", "Ürün", "Birim", "Fiyat", "Toplam"]],
    body,
  });

  doc.setFontSize(14);
  doc.text(`Toplam Tutar (KDV Dahil): ${totalFiyat} TL`, 14, doc.lastAutoTable.finalY + 20);

  doc.save(`teklif_${formData.plaka}.pdf`);
};
