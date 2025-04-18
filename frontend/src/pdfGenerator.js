import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generatePdf = (randevuData) => {
  const { adSoyad, telefon, plaka, arac, randevuTarihi, parts, optionalParts, labor } = randevuData;

  const doc = new jsPDF();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Çalışkanel Bosch Car Service", 105, 15, { align: "center" });

  doc.setFontSize(12);
  doc.text(`Ad Soyad: ${adSoyad}`, 14, 30);
  doc.text(`Telefon: ${telefon}`, 14, 38);
  doc.text(`Plaka: ${plaka}`, 14, 46);
  doc.text(`Araç: ${arac}`, 14, 54);
  doc.text(`Randevu Tarihi: ${randevuTarihi.replace("T", " ")}`, 14, 62);

  const allParts = [...parts, ...optionalParts, labor];

  const tableData = allParts.map((item) => [
    item.kategori,
    item.urun_tip,
    item.birim,
    `${item.fiyat} TL`,
    `${item.toplam} TL`
  ]);

  autoTable(doc, {
    startY: 70,
    head: [["Kategori", "Ürün", "Birim", "Fiyat", "Toplam"]],
    body: tableData,
    styles: { font: "helvetica", fontStyle: "normal" },
  });

  const totalPrice = allParts.reduce((sum, item) => sum + (item.toplam || 0), 0);

  doc.setFontSize(14);
  doc.text(`Toplam Tutar: ${totalPrice} TL (KDV Dahil)`, 14, doc.lastAutoTable.finalY + 20);

  // Logoyu eklemek istersen:
  // const imgData = "data:image/png;base64,...."; // Base64 logo verisi buraya
  // doc.addImage(imgData, 'PNG', 150, 10, 40, 20);

  doc.save(`teklif_${plaka}.pdf`);
};
