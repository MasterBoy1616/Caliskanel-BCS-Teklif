import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generatePdf = (formData, selectedBrand, selectedModel, parts, selectedExtras) => {
  const doc = new jsPDF();

  // Başlık ve logolar
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("Çalışkanel Bosch Car Servis", 105, 20, { align: "center" });

  // Kullanıcı bilgileri
  doc.setFontSize(12);
  doc.text(`Ad Soyad: ${formData.adSoyad}`, 14, 35);
  doc.text(`Plaka: ${formData.plaka}`, 14, 43);
  doc.text(`Araç: ${selectedBrand} ${selectedModel}`, 14, 51);

  const allParts = [...parts.baseParts];
  if (selectedExtras.balata) allParts.push(...(parts.optional.balata || []));
  if (selectedExtras.disk) allParts.push(...(parts.optional.disk || []));
  if (selectedExtras.silecek) allParts.push(...(parts.optional.silecek || []));
  allParts.push(parts.labor);

  const tableBody = allParts.map((item) => [
    item.kategori,
    item.urun_tip,
    item.birim,
    `${item.fiyat.toLocaleString()} TL`,
    `${item.toplam.toLocaleString()} TL`,
  ]);

  autoTable(doc, {
    startY: 60,
    head: [["Kategori", "Ürün", "Birim", "Fiyat", "Toplam"]],
    body: tableBody,
    styles: {
      font: "helvetica",
      fontStyle: "normal",
      fontSize: 10,
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
    },
  });

  // Toplam yazısı
  const total = allParts.reduce((acc, item) => acc + item.toplam, 0);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(`Toplam: ${total.toLocaleString()} TL (KDV Dahil)`, 14, doc.lastAutoTable.finalY + 20);

  // PDF'yi kaydet
  doc.save(`teklif_${formData.plaka || "arac"}.pdf`);
};
