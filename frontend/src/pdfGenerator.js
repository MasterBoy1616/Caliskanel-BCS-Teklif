import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logoBosch from "../logo-bosch.png";
import logoCaliskanel from "../logo-caliskanel.png";

export const generatePdf = (formData, parts, selectedExtras) => {
  const doc = new jsPDF();

  const totalPrice = parts.baseParts.reduce((sum, p) => sum + p.toplam, 0) +
    Object.keys(selectedExtras).reduce((sum, key) => selectedExtras[key] ? parts.optional[key]?.reduce((s, p) => s + p.toplam, 0) || 0 : sum, 0) +
    parts.labor.toplam;

  doc.addImage(logoBosch, "PNG", 10, 10, 40, 20);
  doc.addImage(logoCaliskanel, "PNG", 160, 10, 40, 20);

  doc.setFontSize(18);
  doc.text("Teklif Bilgileri", 105, 40, { align: "center" });

  autoTable(doc, {
    startY: 50,
    head: [["Kategori", "Ürün", "Birim", "Fiyat", "Toplam"]],
    body: [
      ...parts.baseParts.map(p => [p.kategori, p.urun_tip, p.birim, p.fiyat, p.toplam]),
      ...Object.keys(selectedExtras).flatMap(opt => selectedExtras[opt] ? parts.optional[opt]?.map(p => [p.kategori, p.urun_tip, p.birim, p.fiyat, p.toplam]) : []),
      [parts.labor.kategori, parts.labor.urun_tip, parts.labor.birim, parts.labor.fiyat, parts.labor.toplam]
    ]
  });

  doc.setFontSize(14);
  doc.text(`Toplam Fiyat: ${totalPrice} TL (KDV Dahil)`, 14, doc.previousAutoTable.finalY + 20);

  doc.save(`Teklif_${formData.plaka || "PlakaYok"}.pdf`);
};
