import './style.css';

async function fetchMarkalar() {
  const res = await fetch('/api/markalar');
  const markalar = await res.json();
  const markaSelect = document.getElementById('marka');
  markalar.forEach(marka => {
    const option = document.createElement('option');
    option.value = marka;
    option.textContent = marka;
    markaSelect.appendChild(option);
  });
}

async function fetchModeller(marka) {
  const res = await fetch(`/api/modeller?marka=${marka}`);
  const modeller = await res.json();
  const modelSelect = document.getElementById('model');
  modelSelect.innerHTML = '<option value="">Model Seçin</option>';
  modeller.forEach(model => {
    const option = document.createElement('option');
    option.value = model;
    option.textContent = model;
    modelSelect.appendChild(option);
  });
}

async function getParcalar() {
  const marka = document.getElementById('marka').value;
  const model = document.getElementById('model').value;
  if (!marka || !model) return;

  const res = await fetch(`/api/parcalar?marka=${marka}&model=${model}`);
  const parcalar = await res.json();
  const parcalarDiv = document.getElementById('parcalar');
  parcalarDiv.innerHTML = '<h2>Fiyat Listesi</h2>';
  parcalar.forEach(parca => {
    const p = document.createElement('p');
    p.textContent = `${parca.urun}: ${parca.adet} adet × ${parca.birim_fiyat} TL = ${parca.toplam_fiyat} TL`;
    parcalarDiv.appendChild(p);
  });
}

// Marka seçilince model getir
const markaSelect = document.getElementById('marka');
markaSelect.addEventListener('change', (e) => {
  fetchModeller(e.target.value);
});

// İlk yüklemede markaları getir
fetchMarkalar();
