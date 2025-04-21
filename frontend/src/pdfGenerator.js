import jsPDF from "jspdf";
import "jspdf-autotable";
import html2canvas from "html2canvas";

export const generatePdf = (formData, parts, selectedExtras, selectedBrand, selectedModel) => {
  const doc = new jsPDF();
  doc.setFont("helvetica", "bold");

  // Logo
  const imgBosch = "/logo-bosch.png"; // /public klasöründe
  const imgCaliskanel = "/logo-caliskanel.png";

  doc.addImage(imgBosch, "PNG", 10, 8, 40, 20);
  doc.addImage(imgCaliskanel, "PNG", 160, 8, 40, 20);

  doc.setFontSize(16);
  doc.text("Çalışkanel Bosch Car Servisi", 105, 35, { align: "center" });

  doc.setFontSize(12);
  doc.text(`Müşteri: ${formData.adSoyad || "-"}  |  Plaka: ${formData.plaka || "-"}`, 14, 50);
  doc.text(`Araç: ${selectedBrand} ${selectedModel}`, 14, 58);

  const rows = [];

  parts.baseParts.forEach((p) => {
    rows.push([p.kategori, p.urun_tip, p.birim, `${p.fiyat} TL`, `${p.toplam} TL`]);
  });

  Object.entries(parts.optional).forEach(([key, items]) => {
    if (selectedExtras[key]) {
      items.forEach((p) => {
        rows.push([p.kategori, p.urun_tip, p.birim, `${p.fiyat} TL`, `${p.toplam} TL`]);
      });
    }
  });

  rows.push(["İşçilik", parts.labor.urun_tip, parts.labor.birim, `${parts.labor.fiyat} TL`, `${parts.labor.toplam} TL`]);

  doc.autoTable({
    startY: 70,
    head: [["Kategori", "Ürün", "Birim", "Fiyat", "Toplam"]],
    body: rows,
    theme: "grid",
  });

  const toplam = rows.reduce((sum, row) => sum + Number(row[4].replace(" TL", "")), 0);
  doc.setFontSize(14);
  doc.text(`Toplam: ${toplam} TL (KDV Dahil)`, 14, doc.lastAutoTable.finalY + 10);

  doc.save(`teklif_${formData.plaka || "arac"}.pdf`);
};
