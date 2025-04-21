import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function generatePdf(formData, totalPrice, parts, selectedExtras) {
  const doc = new jsPDF();

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(18);
  doc.text("Çalışkanel Bosch Car Servis", 15, 20);

  doc.setFontSize(14);
  doc.text(`Müşteri: ${formData.adSoyad}`, 15, 35);
  doc.text(`Plaka: ${formData.plaka}`, 15, 45);

  const tableData = [];

  parts.baseParts.forEach((p) => {
    tableData.push([p.kategori, p.urun_tip, p.birim, p.fiyat + " TL", p.toplam + " TL"]);
  });

  Object.keys(selectedExtras).forEach((key) => {
    if (selectedExtras[key]) {
      parts.optional[key].forEach((p) => {
        tableData.push([p.kategori, p.urun_tip, p.birim, p.fiyat + " TL", p.toplam + " TL"]);
      });
    }
  });

  tableData.push([
    parts.labor.kategori,
    parts.labor.urun_tip,
    parts.labor.birim,
    parts.labor.fiyat + " TL",
    parts.labor.toplam + " TL"
  ]);

  autoTable(doc, {
    startY: 55,
    head: [["Kategori", "Ürün", "Birim", "Fiyat", "Toplam"]],
    body: tableData,
    styles: { font: "helvetica", fontSize: 10 },
  });

  doc.setFontSize(16);
  doc.text(`Toplam Tutar: ${totalPrice} TL (KDV Dahil)`, 15, doc.lastAutoTable.finalY + 20);

  doc.save(`teklif_${formData.plaka || "arac"}.pdf`);
}
