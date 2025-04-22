import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function generatePdf(marka, model, secilenParcalar, toplamTutar, isim, plaka) {
  const doc = new jsPDF();
  
  doc.addFileToVFS('Roboto-Regular-normal.ttf', /* base64 ttf file here */);
  doc.addFont('Roboto-Regular-normal.ttf', 'Roboto', 'normal');
  doc.setFont('Roboto');

  doc.setFontSize(16);
  doc.text("Çalışkanel Bosch Car Servisi", 14, 20);
  doc.setFontSize(12);
  doc.text(`Araç: ${marka} ${model}`, 14, 30);
  doc.text(`Müşteri: ${isim}`, 14, 38);
  doc.text(`Plaka: ${plaka}`, 14, 46);

  const headers = [["Ürün / İşçilik", "Adet", "Birim Fiyat (TL)", "Toplam (TL)"]];
  const data = secilenParcalar.map(parca => [
    parca.urun,
    parca.adet,
    `${parca.birim_fiyat} TL`,
    `${parca.toplam_fiyat} TL`
  ]);

  autoTable(doc, {
    startY: 55,
    head: headers,
    body: data,
  });

  doc.setFontSize(14);
  doc.text(`Toplam Tutar: ${toplamTutar} TL`, 14, doc.lastAutoTable.finalY + 10);

  doc.save(`${marka}_${model}_Teklif.pdf`);
}
