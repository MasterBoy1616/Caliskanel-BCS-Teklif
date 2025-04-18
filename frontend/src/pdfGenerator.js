import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generatePdf = (formData, fiyatBilgisi, parts, optionalParts) => {
  const doc = new jsPDF();

  // Logoları ekle (/public klasöründen erişiyoruz)
  doc.addImage("/logo-caliskanel.png", "PNG", 20, 15, 40, 20);
  doc.addImage("/logo-bosch.png", "PNG", 150, 15, 40, 20);

  doc.setFontSize(18);
  doc.text("Teklif Formu", 105, 50, { align: "center" });

  doc.setFontSize(12);
  doc.text(`Ad Soyad: ${formData.adSoyad}`, 20, 70);
  doc.text(`Telefon: ${formData.telefon}`, 20, 78);
  doc.text(`Plaka: ${formData.plaka}`, 20, 86);
  doc.text(`Araç: ${formData.arac}`, 20, 94);
  doc.text(`Randevu Tarihi: ${formData.randevuTarihi.replace("T", " ")}`, 20, 102);

  // Parça listesi
  const allParts = [...parts, ...optionalParts];
  const tableData = allParts.map((p) => [
    p.kategori,
    p.urun_tip,
    p.birim,
    `${p.fiyat} TL`,
    `${p.toplam} TL`
  ]);

  autoTable(doc, {
    head: [["Kategori", "Ürün", "Birim", "Birim Fiyat", "Toplam"]],
    body: tableData,
    startY: 110,
    theme: "grid",
    headStyles: { fillColor: [41, 128, 185] },
    styles: { font: "helvetica", fontSize: 10 }
  });

  let finalY = doc.lastAutoTable.finalY + 10;
  doc.setFontSize(14);
  doc.text(`Toplam Fiyat: ${fiyatBilgisi} TL (KDV Dahil)`, 20, finalY);

  // PDF indirme
  doc.save(`teklif_${formData.plaka || "arac"}.pdf`);
};
