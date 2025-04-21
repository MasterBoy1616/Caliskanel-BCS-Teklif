import jsPDF from "jspdf";
import "jspdf-autotable";

export const generatePdf = (brand, model, name, plate, parts, total) => {
  const doc = new jsPDF();
  
  doc.addFont("Helvetica", "Helvetica", "normal");
  doc.setFont("Helvetica");

  // Bosch ve Çalışkanel logoları ekle
  const boschLogo = new Image();
  const caliskanelLogo = new Image();

  boschLogo.src = "/logo-bosch.png";
  caliskanelLogo.src = "/logo-caliskanel.png";

  boschLogo.onload = () => {
    doc.addImage(boschLogo, "PNG", 15, 10, 40, 15);
    doc.addImage(caliskanelLogo, "PNG", 150, 10, 40, 15);

    doc.setFontSize(18);
    doc.text("Periyodik Bakım Teklifi", 70, 35);

    doc.setFontSize(12);
    doc.text(`Marka: ${brand}`, 15, 50);
    doc.text(`Model: ${model}`, 15, 60);
    doc.text(`İsim Soyisim: ${name}`, 15, 70);
    doc.text(`Plaka: ${plate}`, 15, 80);

    const tableData = parts.map(item => [
      item.urun_tip,
      item.birim,
      `${item.fiyat} TL`,
      `${item.toplam} TL`,
    ]);

    doc.autoTable({
      head: [["Ürün / İşçilik", "Adet", "Birim Fiyat (TL)", "Toplam (TL)"]],
      body: tableData,
      startY: 90,
    });

    doc.setFontSize(14);
    doc.text(`Toplam Tutar: ${total} TL (KDV Dahil)`, 15, doc.lastAutoTable.finalY + 20);

    doc.save(`Teklif_${brand}_${model}.pdf`);
  };
};
