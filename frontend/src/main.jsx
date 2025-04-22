import "./style.css";

document.addEventListener("DOMContentLoaded", async () => {
  const markaSelect = document.getElementById("marka");
  const modelSelect = document.getElementById("model");
  const parcalarDiv = document.getElementById("parcalar");
  const pdfButton = document.getElementById("pdfButton");

  // Markaları çek
  const markalar = await fetch("/api/markalar").then(res => res.json());
  markalar.forEach(marka => {
    const option = document.createElement("option");
    option.value = marka;
    option.textContent = marka;
    markaSelect.appendChild(option);
  });

  // Marka seçilince modelleri getir
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

  // Model seçilince parçaları getir
  modelSelect.addEventListener("change", async () => {
    parcalarDiv.innerHTML = "";
    pdfButton.classList.add("hidden");

    const selectedMarka = markaSelect.value;
    const selectedModel = modelSelect.value;
    if (selectedModel) {
      const parcalar = await fetch(`/api/parcalar?marka=${selectedMarka}&model=${selectedModel}`).then(res => res.json());
      parcalar.forEach(parca => {
        const div = document.createElement("div");
        div.textContent = `${parca.urun} - ${parca.adet} adet × ${parca.birim_fiyat}₺ = ${parca.toplam_fiyat}₺`;
        parcalarDiv.appendChild(div);
      });
      pdfButton.classList.remove("hidden");
    }
  });

  // PDF oluşturma tıklayınca (sonraya bırakacağız)
  pdfButton.addEventListener("click", () => {
    alert("PDF oluşturulacak (bu kısmı sonra yazacağız)");
  });
});
