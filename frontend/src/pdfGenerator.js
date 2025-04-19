import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generatePdf = (userData, brand, model, parts, selectedExtras) => {
  const doc = new jsPDF();

  doc.addImage('/logo-bosch.png', 'PNG', 15, 10, 40, 20);
  doc.addImage('/logo-caliskanel.png', 'PNG', 160, 10, 40, 20);

  doc.setFontSize(14);
  doc.text("Çalışkanel Bosch Car Servisi - Teklif", 105, 40, { align: "center" });

  doc.setFontSize(12);
  doc.text(`Müşteri: ${userData.adSoyad}`, 14, 55);
  doc.text(`Plaka: ${userData.plaka}`, 14, 62);
  doc.text(`Araç: ${brand} ${model}`, 14, 69);

  const tableRows = [];

  parts.baseParts.forEach(p => {
    tableRows.push([p.kategori, p.urun_tip, p.birim, p.fiyat + "₺", p.toplam + "₺"]);
  });

  Object.keys(parts.optional).forEach(key => {
    if (selectedExtras[key]) {
      parts.optional[key].forEach(p => {
        tableRows.push([p.kategori, p.urun_tip, p.birim, p.fiyat + "₺", p.toplam + "₺"]);
      });
    }
  });

  tableRows.push([
    parts.labor.kategori,
    parts.labor.urun_tip,
    parts.labor.birim,
    parts.labor.fiyat + "₺",
    parts.labor.toplam + "₺"
  ]);

  autoTable(doc, {
    head: [["Kategori", "Ürün", "Birim", "Fiyat", "Toplam"]],
    body: tableRows,
    startY: 80,
  });

  const toplamFiyat = parts.baseParts.reduce((sum, p) => sum + p.toplam, 0)
    + Object.keys(parts.optional).reduce((sum, key) => selectedExtras[key] ? sum + parts.optional[key].reduce((s, p) => s + p.toplam, 0) : sum, 0)
    + parts.labor.toplam;

  doc.setFontSize(14);
  doc.text(`Toplam: ${toplamFiyat} TL (KDV Dahil)`, 14, doc.lastAutoTable.finalY + 10);

  doc.save(`Teklif-${userData.plaka}.pdf`);
};
