const markaSelect = document.getElementById("marka");
const modelSelect = document.getElementById("model");

fetch("/api/markalar")
  .then((res) => res.json())
  .then((data) => {
    markaSelect.innerHTML = data.map(m => `<option value="${m}">${m}</option>`).join("");
  });

markaSelect.addEventListener("change", () => {
  const marka = markaSelect.value;
  fetch(`/api/modeller?marka=${marka}`)
    .then((res) => res.json())
    .then((data) => {
      modelSelect.innerHTML = data.map(m => `<option value="${m}">${m}</option>`).join("");
    });
});
