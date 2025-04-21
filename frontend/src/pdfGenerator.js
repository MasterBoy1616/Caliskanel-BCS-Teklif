import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";

export const generatePdf = async (formData, totalPrice, parts) => {
  const doc = new jsPDF();

  // Bosch ve Çalışkanel logoları
  const boschLogo = "/logo-bosch.png";
  const caliskanelLogo = "/logo-caliskanel.png";

  try {
    const boschImage = await loadImage(boschLogo);
    const caliskanelImage = await loadImage(caliskanelLogo);

    doc.addImage(boschImage, "PNG", 15, 10, 40, 15);
    doc.addImage(caliskanelImage, "PNG", 150, 10, 40, 15);
  } catch (error) {
    console.warn("Logo yüklenemedi:", error);
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Çalışkanel Bosch Car Servis", 105, 35, { align: "center" });
  doc.setFontSize(12);
  doc.text(`Ad Soyad: ${formData.adSoyad}`, 15, 50);
  doc.text(`Plaka: ${formData.plaka}`, 15, 60);

  const tableData = parts.map((p) => [
    p.kategori,
    p.urun_tip,
    `${p.birim}`,
    `${p.fiyat} TL`,
    `${p.toplam} TL`,
  ]);

  autoTable(doc, {
    head: [["Kategori", "Ürün", "Birim", "Birim Fiyat", "Toplam"]],
    body: tableData,
    startY: 70,
  });

  doc.setFontSize(14);
  doc.text(`Toplam Tutar (KDV Dahil): ${totalPrice} TL`, 15, doc.lastAutoTable.finalY + 20);

  doc.save(`teklif_${formData.plaka}.pdf`);
};

const loadImage = (src) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
  });
