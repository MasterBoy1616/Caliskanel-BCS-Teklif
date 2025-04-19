import jsPDF from "jspdf";
import "jspdf-autotable";

export function generatePdf(formData, partsData) {
  const doc = new jsPDF();

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(16);
  doc.text("Çalışkanel Bosch Car Servisi - Teklif", 10, 20);

  doc.setFontSize(12);
  doc.text(`Ad Soyad: ${formData.adSoyad}`, 10, 40);
  doc.text(`Plaka: ${formData.plaka}`, 10, 50);

  const bodyData = partsData.baseParts.map(p => [p.kategori, p.urun_tip, p.birim, p.fiyat, p.toplam]);
  bodyData.push(["İşçilik", partsData.labor.urun_tip, partsData.labor.birim, partsData.labor.fiyat, partsData.labor.toplam]);

  doc.autoTable({
    startY: 60,
    head: [["Kategori", "Ürün", "Birim", "Fiyat (TL)", "Toplam (TL)"]],
    body: bodyData
  });

  const total = partsData.baseParts.reduce((sum, p) => sum + p.toplam, 0) + partsData.labor.toplam;
  doc.text(`Toplam Tutar: ${total} TL (KDV Dahil)`, 10, doc.lastAutoTable.finalY + 10);

  doc.save(`teklif_${formData.plaka}.pdf`);
}
