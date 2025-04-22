import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function generatePdf(isim, plaka, marka, model, parts, toplamFiyat) {
  const doc = new jsPDF();

  doc.setFont("Helvetica", "normal");
  doc.setFontSize(16);
  doc.text("Çalışkanel Bosch Car Servisi - Teklif", 20, 20);

  doc.setFontSize(12);
  doc.text(`İsim Soyisim: ${isim}`, 20, 40);
  doc.text(`Plaka: ${plaka}`, 20, 50);
  doc.text(`Marka: ${marka}`, 20, 60);
  doc.text(`Model: ${model}`, 20, 70);

  autoTable(doc, {
    startY: 80,
    head: [["Ürün", "Adet", "Birim Fiyat (TL)", "Toplam (TL)"]],
    body: parts.map(p => [
      p.urun,
      p.adet,
      p.birim_fiyat.toLocaleString("tr-TR"),
      p.toplam.toLocaleString("tr-TR")
    ]),
  });

  doc.text(`Toplam Tutar: ${toplamFiyat.toLocaleString("tr-TR")} TL`, 20, doc.lastAutoTable.finalY + 20);

  doc.save("teklif.pdf");
}
