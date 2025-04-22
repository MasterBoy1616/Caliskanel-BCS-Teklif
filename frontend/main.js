async function getMarkalar() {
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

async function getModeller(marka) {
  const res = await fetch(`/api/modeller?marka=${marka}`);
  const modeller = await res.json();
  const modelSelect = document.getElementById('model');
  modelSelect.innerHTML = '<option selected disabled>Model Seçin</option>';
  modeller.forEach(model => {
    const option = document.createElement('option');
    option.value = model;
    option.textContent = model;
    modelSelect.appendChild(option);
  });
}

async function getParcalar(marka, model) {
  const res = await fetch(`/api/parcalar?marka=${marka}&model=${model}`);
  const parcalar = await res.json();
  const sonucDiv = document.getElementById('sonuc');
  sonucDiv.innerHTML = '';

  parcalar.forEach(parca => {
    const p = document.createElement('p');
    p.textContent = `${parca.urun} - ${parca.adet} adet - ${parca.toplam_fiyat} TL`;
    sonucDiv.appendChild(p);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  getMarkalar();

  document.getElementById('marka').addEventListener('change', (e) => {
    getModeller(e.target.value);
  });

  document.getElementById('sorgula').addEventListener('click', () => {
    const isim = document.getElementById('isim').value.trim();
    const plaka = document.getElementById('plaka').value.trim();
    const marka = document.getElementById('marka').value;
    const model = document.getElementById('model').value;

    if (!isim || !plaka || !marka || !model) {
      alert('Lütfen tüm alanları doldurun.');
      return;
    }

    getParcalar(marka, model);
  });
});
