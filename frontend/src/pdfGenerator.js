import jsPDF from 'jspdf';
import 'jspdf-autotable';
import boschLogo from '/logo-bosch.png';
import caliskanelLogo from '/logo-caliskanel.png';

const generatePDF = (parts, formData) => {
  const doc = new jsPDF();
  doc.addFileToVFS("Roboto-Regular-normal.ttf", "..."); // base64 font verisi gerekli
  doc.addFont("Roboto-Regular-normal.ttf", "Roboto", "normal");
  doc.setFont("Roboto");

  doc.text('ÇALIŞKANEL BOSCH CAR SERVİS - TEKLİF FORMU', 20, 20);
  doc.text(`İsim Soyisim: ${formData.isim}`, 20, 30);
  doc.text(`Plaka: ${formData.plaka}`, 20, 38);

  const rows = parts.map(p => [p.KATEGORI, p.URUN, p.BIRIM, `${p.FIYAT} TL`, `${p.FIYAT * p.BIRIM} TL`]);

  doc.autoTable({
    startY: 50,
    head: [['Kategori', 'Parça', 'Birim', 'Fiyat', 'Toplam']],
    body: rows,
    styles: { font: "Roboto" }
  });

  const toplam = parts.reduce((sum, p) => sum + p.FIYAT * p.BIRIM, 0);
  doc.text(`TOPLAM: ${toplam.toLocaleString('tr-TR')} TL (KDV DAHİL)`, 20, doc.lastAutoTable.finalY + 10);

  doc.save(`teklif_${formData.plaka}.pdf`);
};

export default generatePDF;


// File: public/logo-bosch.png + logo-caliskanel.png
// Doğru klasörde yüklendiğinden emin olun ve yukarıdaki yolları kullanın.
