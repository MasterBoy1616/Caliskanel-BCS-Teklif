import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generatePdf = (formData, brand, model, parts, selectedExtras) => {
  const doc = new jsPDF();

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(18);
  doc.text("Çalışkanel Bosch Car Servis", 20, 20);

  doc.setFontSize(14);
  doc.text(`Müşteri: ${formData.adSoyad}`, 20, 40);
  doc.text(`Plaka: ${formData.plaka}`, 20, 50);
  doc.text(`Araç: ${brand} ${model}`, 20, 60);

  const tableData = [];

  parts.baseParts.forEach((item) => {
    tableData.push([item.kategori, item.urun_tip, item.birim, item.fiyat + " TL", item.toplam + " TL"]);
  });

  Object.keys(selectedExtras).forEach(key => {
    if (selectedExtras[key]) {
      parts.optional[key].forEach(item => {
        tableData.push([item.kategori, item.urun_tip, item.birim, item.fiyat + " TL", item.toplam + " TL"]);
      });
    }
  });

  tableData.push([parts.labor.kategori, parts.labor.urun_tip, parts.labor.birim, parts.labor.fiyat + " TL", parts.labor.toplam + " TL"]);

  autoTable(doc, {
    startY: 70,
    head: [["Kategori", "Ürün", "Birim", "Fiyat", "Toplam"]],
    body: tableData,
  });

  const total = parts.baseParts.reduce((sum, item) => sum + item.toplam, 0) +
    Object.keys(selectedExtras).reduce((sum, key) =>
      selectedExtras[key] ? sum + parts.optional[key].reduce((s, item) => s + item.toplam, 0) : sum, 0
    ) + parts.labor.toplam;

  doc.setFontSize(16);
  doc.text(`Toplam Tutar: ${total} TL (KDV Dahil)`, 20, doc.lastAutoTable.finalY + 20);

  doc.save(`teklif_${formData.plaka}.pdf`);
};
