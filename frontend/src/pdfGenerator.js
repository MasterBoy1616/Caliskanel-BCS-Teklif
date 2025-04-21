import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";

export const generatePdf = (formData, parts, selectedExtras) => {
  const doc = new jsPDF();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("ÇALIŞKANEL BOSCH CAR SERVİS", 15, 15);

  doc.setFontSize(12);
  doc.text(`Müşteri: ${formData.adSoyad || "-"}  |  Plaka: ${formData.plaka || "-"}`, 15, 25);

  const tableData = [];

  parts.baseParts.forEach((part) => {
    tableData.push([
      part.kategori,
      part.urun_tip,
      part.birim,
      `${part.fiyat} TL`,
      `${part.toplam} TL`
    ]);
  });

  Object.keys(selectedExtras).forEach((key) => {
    if (selectedExtras[key]) {
      parts.optional[key].forEach((opt) => {
        tableData.push([
          opt.kategori,
          opt.urun_tip,
          opt.birim,
          `${opt.fiyat} TL`,
          `${opt.toplam} TL`
        ]);
      });
    }
  });

  tableData.push([
    parts.labor.kategori,
    parts.labor.urun_tip,
    parts.labor.birim,
    `${parts.labor.fiyat} TL`,
    `${parts.labor.toplam} TL`
  ]);

  autoTable(doc, {
    head: [["Kategori", "Ürün", "Birim", "Fiyat (TL)", "Toplam (TL)"]],
    body: tableData,
    startY: 35,
  });

  const total = tableData.reduce((sum, row) => {
    const toplamValue = parseFloat(row[4].replace(" TL", "")) || 0;
    return sum + toplamValue;
  }, 0);

  doc.text(`Toplam: ${total} TL (KDV Dahil)`, 15, doc.previousAutoTable.finalY + 10);

  doc.save(`teklif_${formData.plaka || "bilgi"}.pdf`);
};
