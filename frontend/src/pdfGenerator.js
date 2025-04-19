import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generatePdf = (formData, selectedBrand, selectedModel, parts, extras) => {
  const doc = new jsPDF();

  // Logoları çizelim
  const boschLogo = "/logo-bosch.png";
  const caliskanelLogo = "/logo-caliskanel.png";

  doc.addImage(boschLogo, "PNG", 15, 10, 40, 15);
  doc.addImage(caliskanelLogo, "PNG", 150, 10, 40, 15);

  doc.setFontSize(18);
  doc.text("Çalışkanel Bosch Car Servisi", 70, 35, { align: "center" });

  doc.setFontSize(12);
  doc.text(`Müşteri: ${formData.adSoyad}`, 14, 50);
  doc.text(`Telefon: ${formData.telefon}`, 14, 58);
  doc.text(`Plaka: ${formData.plaka}`, 14, 66);
  doc.text(`Araç: ${selectedBrand} ${selectedModel}`, 14, 74);
  doc.text(`Randevu Tarihi: ${new Date(formData.randevuTarihi).toLocaleString('tr-TR')}`, 14, 82);

  const rows = [];

  parts.baseParts.forEach(part => {
    rows.push([part.kategori, part.urun_tip, part.birim, `${part.fiyat} TL`, `${part.toplam} TL`]);
  });

  Object.entries(parts.optional).forEach(([key, items]) => {
    if (extras[key]) {
      items.forEach(part => {
        rows.push([part.kategori, part.urun_tip, part.birim, `${part.fiyat} TL`, `${part.toplam} TL`]);
      });
    }
  });

  rows.push([parts.labor.kategori, parts.labor.urun_tip, parts.labor.birim, `${parts.labor.fiyat} TL`, `${parts.labor.toplam} TL`]);

  autoTable(doc, {
    startY: 90,
    head: [["Kategori", "Ürün", "Birim", "Fiyat (TL)", "Toplam (TL)"]],
    body: rows,
    styles: { font: "helvetica", fontStyle: "normal", overflow: "linebreak", cellPadding: 2 },
    theme: 'striped',
    headStyles: { fillColor: [41, 128, 185] },
  });

  const total = rows.reduce((acc, row) => {
    const toplam = parseFloat(row[4]?.replace(" TL", "").replace(",", "."));
    return acc + (isNaN(toplam) ? 0 : toplam);
  }, 0);

  doc.setFontSize(14);
  doc.text(`Toplam Tutar: ${total} TL (KDV Dahil)`, 14, doc.previousAutoTable.finalY + 20);

  doc.save(`teklif_${formData.plaka || "arac"}.pdf`);
};
