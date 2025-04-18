import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function generatePdf(formData, brand, model, parts, optionalParts, selectedExtras, labor) {
  const doc = new jsPDF();

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Periyodik Bakım Teklifi", 105, 20, { align: "center" });

  doc.setFontSize(12);
  doc.text(`Müşteri: ${formData.adSoyad}`, 20, 40);
  doc.text(`Telefon: ${formData.telefon}`, 20, 50);
  doc.text(`Plaka: ${formData.plaka}`, 20, 60);
  doc.text(`Araç: ${brand} ${model}`, 20, 70);

  const tableBody = parts.map(p => [
    p.kategori,
    p.urun_tip,
    p.birim,
    `${p.fiyat} TL`,
    `${p.toplam} TL`
  ]);

  Object.entries(selectedExtras).forEach(([key, selected]) => {
    if (selected) {
      optionalParts.filter(p => p.kategori.toLowerCase().includes(key)).forEach(p => {
        tableBody.push([
          p.kategori,
          p.urun_tip,
          p.birim,
          `${p.fiyat} TL`,
          `${p.toplam} TL`
        ]);
      });
    }
  });

  tableBody.push([
    labor.kategori,
    labor.urun_tip,
    labor.birim,
    `${labor.fiyat} TL`,
    `${labor.toplam} TL`
  ]);

  autoTable(doc, {
    head: [["Kategori", "Ürün", "Birim", "Fiyat", "Toplam"]],
    body: tableBody,
    startY: 90
  });

  const totalPrice = tableBody.reduce((sum, row) => {
    const toplam = parseFloat(row[4]?.replace(" TL", "") || 0);
    return sum + toplam;
  }, 0);

  doc.setFontSize(14);
  doc.text(`Toplam (KDV Dahil): ${totalPrice.toFixed(2)} TL`, 20, doc.lastAutoTable.finalY + 20);

  doc.save(`teklif_${formData.plaka}.pdf`);
}
