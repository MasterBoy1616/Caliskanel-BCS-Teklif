import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const generatePdf = (data, userInfo) => {
  const doc = new jsPDF();

  doc.setFont("helvetica");
  doc.setFontSize(18);
  doc.text("Çalışkanel Bosch Car Servisi", 105, 20, { align: "center" });

  doc.setFontSize(12);
  doc.text(`Müşteri: ${userInfo.name} ${userInfo.surname}`, 14, 30);
  doc.text(`Plaka: ${userInfo.plate}`, 14, 40);

  doc.setFontSize(14);
  doc.text("Periyodik Bakım Fiyat Listesi", 105, 55, { align: "center" });

  const tableData = data.map((item) => [
    item.KATEGORI,
    item.URUN,
    item.BIRIM,
    `${item.FIYAT} TL`,
    `${item.TOPLAM} TL`
  ]);

  autoTable(doc, {
    startY: 65,
    head: [["Kategori", "Ürün", "Birim", "Fiyat", "Toplam"]],
    body: tableData,
    styles: {
      font: "helvetica",
      fontSize: 10,
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
    },
    bodyStyles: {
      textColor: 50,
    },
    margin: { top: 10 },
  });

  const total = data.reduce((sum, item) => sum + (parseFloat(item.TOPLAM) || 0), 0);

  doc.setFontSize(14);
  doc.text(`Genel Toplam: ${total.toFixed(2)} TL`, 14, doc.lastAutoTable.finalY + 20);

  doc.save("teklif.pdf");
};

export { generatePdf };
