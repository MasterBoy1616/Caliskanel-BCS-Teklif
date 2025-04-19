import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generatePdf = (formData, brand, model, parts, selectedExtras) => {
  const doc = new jsPDF();

  // Bosch ve Çalışkanel logoları
  const boschLogo = "/logo-bosch.png"; 
  const caliskanelLogo = "/logo-caliskanel.png";

  doc.addImage(boschLogo, "PNG", 10, 10, 50, 20);
  doc.addImage(caliskanelLogo, "PNG", 150, 10, 50, 20);

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Çalışkanel Bosch Car Servisi", 105, 40, { align: "center" });

  doc.setFontSize(12);
  doc.text(`Ad Soyad: ${formData.adSoyad}`, 14, 60);
  doc.text(`Plaka: ${formData.plaka}`, 14, 68);
  doc.text(`Araç: ${brand} ${model}`, 14, 76);

  const tableData = [];

  parts.baseParts.forEach((p) => {
    tableData.push([p.kategori, p.urun_tip, p.birim, `${p.fiyat} ₺`, `${p.toplam} ₺`]);
  });

  Object.keys(selectedExtras).forEach((key) => {
    if (selectedExtras[key]) {
      parts.optional[key].forEach((p) => {
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
    startY: 85,
    head: [["Kategori", "Ürün", "Adet", "Fiyat", "Toplam"]],
    body: tableData,
    theme: "striped",
    styles: { font: "Helvetica", fontSize: 10 },
  });

  const toplamTutar = tableData.reduce((acc, curr) => {
    const total = Number(curr[4].replace(" ₺", "").replace(",", ""));
    return acc + total;
  }, 0);

  doc.setFontSize(14);
  doc.setTextColor(0, 102, 0);
  doc.text(`Toplam Tutar: ${toplamTutar.toLocaleString()} ₺ (KDV Dahil)`, 14, doc.lastAutoTable.finalY + 15);

  doc.save(`teklif_${formData.plaka}.pdf`);
};
