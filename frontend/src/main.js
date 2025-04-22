import "./style.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

document.addEventListener("DOMContentLoaded", async () => {
  const markaSelect = document.getElementById("marka");
  const modelSelect = document.getElementById("model");
  const parcalarDiv = document.getElementById("parcalar");
  const pdfButton = document.getElementById("pdfButton");

  const markalar = await fetch("/api/markalar").then(res => res.json());
  markalar.forEach(marka => {
    const option = document.createElement("option");
    option.value = marka;
    option.textContent = marka;
    markaSelect.appendChild(option);
  });

  markaSelect.addEventListener("change", async () => {
    modelSelect.innerHTML = `<option value="">-- Seçiniz --</option>`;
    modelSelect.disabled = true;
    parcalarDiv.innerHTML = "";
    pdfButton.classList.add("hidden");

    const selectedMarka = markaSelect.value;
    if (selectedMarka) {
      const modeller = await fetch(`/api/modeller?marka=${selectedMarka}`).then(res => res.json());
      modeller.forEach(model => {
        const option = document.createElement("option");
        option.value = model;
        option.textContent = model;
        modelSelect.appendChild(option);
      });
      modelSelect.disabled = false;
    }
  });

  modelSelect.addEventListener("change", async () => {
    parcalarDiv.innerHTML = "";
    pdfButton.classList.add("hidden");

    const selectedMarka = markaSelect.value;
    const selectedModel = modelSelect.value;
    if (selectedModel) {
      const parcalar = await fetch(`/api/parcalar?marka=${selectedMarka}&model=${selectedModel}`).then(res => res.json());
      parcalar.forEach(parca => {
        const div = document.createElement("div");
        div.className = "checkbox-item";
        div.innerHTML = `
          <input type="checkbox" id="${parca.urun}" checked>
          <label for="${parca.urun}">${parca.urun} - ${parca.adet} adet × ${parca.birim_fiyat}₺ = ${parca.toplam_fiyat}₺</label>
        `;
        parcalarDiv.appendChild(div);
      });
      pdfButton.classList.remove("hidden");
    }
  });

  pdfButton.addEventListener("click", async () => {
    const element = document.getElementById("parcalar");
    const canvas = await html2canvas(element);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 10, pdfWidth, pdfHeight);
    pdf.save("teklif.pdf");
  });
});
