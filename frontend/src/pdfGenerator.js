import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generatePdf = (brand, model, parts, selectedExtras) => {
  const doc = new jsPDF();
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Çalışkanel Bosch Car Servis", 20, 20);
  
  doc.setFontSize(12);
  doc.text(`Araç: ${brand} ${model}`, 20, 30);

  const tableData = [];

  parts.baseParts.forEach(p => {
    tableData.push([p.kategori, p.urun_tip, p.birim, `${p.fiyat} ₺`, `${p.toplam} ₺`]);
  });

  Object.keys(selectedExtras).forEach((key) => {
    if (selectedExtras[key]) {
      parts.optional[key].forEach(p => {
        tableData.push([p.kategori, p.urun_tip, p.birim, `${p.fiyat} ₺`, `${p.toplam} ₺`]);
      });
    }
  });

  tableData.push([
    parts.labor.kategori,
    parts.labor.urun_tip,
    parts.labor.birim,
    `${parts.labor.fiyat} ₺`,
    `${parts.labor.toplam} ₺`
  ]);

  autoTable(doc, {
    startY: 40,
    head: [["Kategori", "Ürün", "Birim", "Fiyat (TL)", "Toplam (TL)"]],
    body: tableData,
  });

  const toplam = parts.baseParts.reduce((acc, p) => acc + p.toplam, 0) +
                  Object.keys(selectedExtras).reduce((acc, key) => {
                    if (selectedExtras[key]) {
                      return acc + parts.optional[key].reduce((a, b) => a + b.toplam, 0);
                    }
                    return acc;
                  }, 0) +
                  parts.labor.toplam;

  doc.setFontSize(14);
  doc.text(`Toplam Tutar: ${toplam} ₺ (KDV Dahil)`, 20, doc.lastAutoTable.finalY + 20);

  doc.save(`teklif_${brand}_${model}.pdf`);
};
