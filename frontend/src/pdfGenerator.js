import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generatePDF = (data, isimSoyisim, plaka) => {
  const doc = new jsPDF();

  // Logolar
  const logoBosch = "/logo-bosch.png";
  const logoCaliskanel = "/logo-caliskanel.png";

  // Başlık
  doc.setFontSize(18);
  doc.text("Çalışkanel Bosch Car Servis", 105, 20, { align: "center" });

  // Araç ve Kişi Bilgileri
  doc.setFontSize(12);
  doc.text(`İsim Soyisim: ${isimSoyisim}`, 14, 40);
  doc.text(`Plaka: ${plaka}`, 14, 48);
  // Logo eklemek (eğer Base64 kullanacaksanız ekstra kod lazım, şimdilik basit bırakıyoruz)
  // İstersen buraya ileride image ekleriz.

  // Tablo Başlığı
  doc.setFontSize(14);
  doc.text("Periyodik Bakım Fiyat Listesi", 105, 60, { align: "center" });

  // Tablo oluşturma
  const tableData = data.map((item) => [
    item.KATEGORI,
    item.URUN,
    item.BIRIM,
    `${item.FIYAT} TL`,
    `${item.TOPLAM} TL`
  ]);

  autoTable(doc, {
    startY: 70,
    head: [["Kategori", "Ürün", "Birim", "Fiyat", "Toplam"]],
    body: tableData,
    styles: {
      font: "helvetica", // Türkçe destekli standart font
      fontStyle: "normal",
      fontSize: 10,
    },
    headStyles: {
      fillColor: [41, 128, 185], // Başlık rengi
      textColor: 255,
    },
    bodyStyles: {
      textColor: 50,
    },
    margin: { top: 10 },
  });

  // Toplam Tutar
  const total = data.reduce((sum, item) => sum + (parseFloat(item.TOPLAM) || 0), 0);

  doc.setFontSize(14);
  doc.text(`Genel Toplam: ${total.toFixed(2)} TL`, 14, doc.lastAutoTable.finalY + 20);

  // PDF Kaydet
  doc.save("teklif.pdf");
};

 
