import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function generatePdf(formData, parts, totalPrice) {
  const doc = new jsPDF();

  // Başlık
  doc.setFontSize(18);
  doc.text("Çalışkanel Bosch Car Servis", 105, 20, { align: "center" });

  // Logoları ekle (isteğe bağlı)
  // doc.addImage('/logo-bosch.png', 'PNG', 10, 10, 30, 15);
  // doc.addImage('/logo-caliskanel.png', 'PNG', 170, 10, 30, 15);

  // Kullanıcı Bilgileri
  doc.setFontSize(12);
  doc.text(`Ad Soyad: ${formData.adSoyad}`, 14, 40);
  doc.text(`Plaka: ${formData.plaka}`, 14, 48);

  // Parçalar Tablosu
  const tableData = parts.map(p => [
    p.kategori,
    p.urun_tip,
    `${p.birim}`,
    `${p.fiyat} TL`,
    `${p.toplam} TL`
  ]);

  autoTable(doc, {
    head: [["Kategori", "Ürün", "Birim", "Fiyat (TL)", "Toplam (TL)"]],
    body: tableData,
    startY: 60,
    theme: 'striped',
    headStyles: { fillColor: [41, 128, 185] },
    styles: { font: "helvetica", fontSize: 10 },
  });

  // Toplam Tutar
  const finalY = doc.lastAutoTable.finalY || 80;
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text(`Toplam Tutar: ${totalPrice} TL (KDV Dahil)`, 14, finalY + 20);

  // PDF Kaydet
  doc.save(`teklif_${formData.plaka}.pdf`);
}
