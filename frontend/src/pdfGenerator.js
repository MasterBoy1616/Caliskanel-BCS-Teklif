import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generatePDF = (isim, plaka, marka, model, selectedParts) => {
  const doc = new jsPDF();

  // Başlık
  doc.setFontSize(18);
  doc.setTextColor(72, 0, 224);
  doc.text("Çalışkanel Bosch Car Servisi", 105, 15, { align: "center" });

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text(`Ad Soyad: ${isim || "-"}`, 14, 30);
  doc.text(`Plaka: ${plaka || "-"}`, 14, 40);
  doc.text(`Marka: ${marka || "-"}`, 14, 50);
  doc.text(`Model: ${model || "-"}`, 14, 60);

  // Seçilen parçalar tablosu
  autoTable(doc, {
    startY: 70,
    head: [["Parça", "Adet", "Birim Fiyat (₺)", "Toplam Fiyat (₺)"]],
    body: selectedParts.map((item) => [
      item.urun,
      item.adet,
      item.birim_fiyat,
      item.toplam_fiyat
    ]),
    styles: { fontSize: 10 },
    headStyles: { fillColor: [72, 0, 224] }
  });

  let finalY = doc.lastAutoTable.finalY + 10;

  // Check List Başlık
  doc.setFontSize(14);
  doc.setTextColor(72, 0, 224);
  doc.text("Periyodik Bakım Check List", 105, finalY, { align: "center" });

  finalY += 10;

  const checklistItems = [
    "Motor Yağı Kontrolü",
    "Yağ Filtresi Değişimi",
    "Hava Filtresi Değişimi",
    "Polen Filtresi Değişimi",
    "Yakıt Filtresi Değişimi",
    "Fren Hidroliği Seviyesi Kontrolü",
    "Akü Kontrolü",
    "Lastik Durumu ve Hava Basıncı Kontrolü",
    "Far ve Aydınlatma Kontrolü",
    "Cam Suyu Seviyesi Kontrolü",
    "Silecek Durumu Kontrolü",
    "Tüm Sistem Kontrolleri (Fren, Direksiyon, Süspansiyon)"
  ];

  checklistItems.forEach((item, index) => {
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`☐ ${item}`, 14, finalY + (index + 1) * 8);
  });

  // Servis Bilgileri
  doc.setFontSize(10);
  doc.setTextColor(150, 150, 150);
  doc.text(
    "Adres: 29 Ekim Mah. İzmir Yolu Cd No:384 Nilüfer / Bursa",
    14,
    280
  );
  doc.text(
    "Whatsapp: 0549 833 89 38  |  Tel: 0224 443 57 88",
    14,
    286
  );
  doc.text("Mail: caliskanel@boschservice.com.tr", 14, 292);

  doc.save(`Bakim-Teklif-${plaka || "arac"}.pdf`);
};
