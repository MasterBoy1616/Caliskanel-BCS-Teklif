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

 
