import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function generatePdf(isim, plaka, marka, model, parcalar, toplam, extras) {
  const doc = new jsPDF();

  doc.setFontSize(16);
  doc.text("Çalışkanel Bosch Car Servisi - Teklif", 20, 20);

  doc.setFontSize(12);
  doc.text(`İsim Soyisim: ${isim}`, 20, 30);
  doc.text(`Plaka: ${plaka}`, 20, 37);
  doc.text(`Marka: ${marka}`, 20, 44);
  doc.text(`Model: ${model}`, 20, 51);

  const partsTable = parcalar.map(p => [
    p.urun,
    p.adet,
    `${p.birim_fiyat} TL`,
    `${p.toplam} TL`
  ]);

  autoTable(doc, {
    startY: 60,
    head: [["Ürün", "Adet", "Birim Fiyat", "Toplam"]],
    body: partsTable,
  });

  doc.text(`Toplam: ${toplam.toLocaleString()} TL`, 20, doc.lastAutoTable.finalY + 10);

  doc.setFontSize(14);
  doc.text("Bakım Kontrol Checklist", 20, doc.lastAutoTable.finalY + 20);

  const checklist = [
    ["Motor Yağı Kontrol", "✓"],
    ["Fren Balatası Kontrol", "✓"],
    ["Hava Filtresi Kontrol", "✓"],
    ["Polen Filtresi Kontrol", "✓"],
    ["Disk Kontrolü", "✓"],
    ["Silecek Lastikleri", "✓"]
  ];

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 30,
    head: [["Kontrol Edilenler", "Durum"]],
    body: checklist,
  });

  doc.setFontSize(10);
  doc.text("Adres: 29 Ekim Mah. İzmir Yolu Cd No:384 Nilüfer/Bursa", 20, doc.lastAutoTable.finalY + 30);
  doc.text("Tel: 0224 443 57 88 - WhatsApp: 0549 833 89 38", 20, doc.lastAutoTable.finalY + 36);
  doc.text("Mail: caliskanel@boschservice.com.tr", 20, doc.lastAutoTable.finalY + 42);

  doc.save("teklif.pdf");
}
