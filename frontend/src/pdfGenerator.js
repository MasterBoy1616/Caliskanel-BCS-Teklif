import jsPDF from "jspdf";
import "jspdf-autotable";

export function generatePDF({ customerName, plate, brand, model, parts, extras, totalPrice }) {
  const doc = new jsPDF();

  doc.setFont("Helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Çalışkanel Bosch Car Servis", 20, 20);

  doc.setFontSize(12);
  doc.text(`İsim Soyisim: ${customerName}`, 20, 40);
  doc.text(`Plaka: ${plate}`, 20, 50);
  doc.text(`Araç: ${brand} ${model}`, 20, 60);

  const tableData = [
    ...parts.map(part => [part.name, `${part.price.toLocaleString("tr-TR")} TL`]),
    ...extras.map(extra => [extra.name, `${extra.price.toLocaleString("tr-TR")} TL`]),
  ];

  doc.autoTable({
    startY: 70,
    head: [["Parça", "Fiyat"]],
    body: tableData,
  });

  doc.setFontSize(14);
  doc.text(`Toplam Tutar: ${totalPrice.toLocaleString("tr-TR")} TL`, 20, doc.previousAutoTable.finalY + 20);

  doc.save(`teklif_${plate}.pdf`);
}
