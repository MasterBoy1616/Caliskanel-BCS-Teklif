import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";

export const generatePdf = async (formData, toplamTutar, selectedParts) => {
  const doc = new jsPDF();

  // Başlık
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("Çalışkanel Bosch Car Servis", 105, 20, { align: "center" });

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text(`Ad Soyad: ${formData.adSoyad}`, 20, 40);
  doc.text(`Plaka: ${formData.plaka}`, 20, 50);

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Seçilen Bakım Parçaları", 105, 70, { align: "center" });

  // Parça Tablosu
  const tableData = selectedParts.map(part => [
    part.kategori,
    part.urun_tip,
    part.birim,
    `${part.fiyat} TL`,
    `${part.toplam} TL`
  ]);

  autoTable(doc, {
    head: [["Kategori", "Ürün", "Birim", "Birim Fiyat", "Toplam Fiyat"]],
    body: tableData,
    startY: 80,
    theme: 'grid',
    styles: { font: 'helvetica', fontSize: 10 },
  });

  // Toplam
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(`Toplam Tutar (KDV Dahil): ${toplamTutar} TL`, 105, doc.previousAutoTable.finalY + 20, { align: "center" });

  // Logo Ekleme
  const boschLogo = await loadImage("/logo-bosch.png");
  const caliskanelLogo = await loadImage("/logo-caliskanel.png");

  if (boschLogo) doc.addImage(boschLogo, "PNG", 10, 10, 30, 15);
  if (caliskanelLogo) doc.addImage(caliskanelLogo, "PNG", 165, 10, 30, 15);

  doc.save(`teklif_${formData.plaka}.pdf`);
};

const loadImage = (src) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => resolve(null);
    img.src = src;
  });
};
