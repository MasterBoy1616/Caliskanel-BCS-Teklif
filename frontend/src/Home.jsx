import React, { useState, useEffect } from 'react';
import axios from 'axios';
import generatePDF from './pdfGenerator';
import boschLogo from '/logo-bosch.png';
import caliskanelLogo from '/logo-caliskanel.png';

const Home = () => {
  const [data, setData] = useState([]);
  const [selected, setSelected] = useState({ marka: '', model: '' });
  const [extras, setExtras] = useState({ Silecek: false, Disk: false, Balata: false });
  const [formData, setFormData] = useState({ isim: '', plaka: '' });

  useEffect(() => {
    axios.get('/api/fiyatlar').then(res => setData(res.data));
  }, []);

  const filteredParts = () => {
    const periyodik = data.filter(
      item => item.MARKA === selected.marka && item.MODEL === selected.model && item.KATEGORI !== 'İşçilik'
    );
    const iscilik = data.filter(
      item => item.MARKA === selected.marka && item.MODEL === selected.model && item.KATEGORI === 'İşçilik'
    );
    const ekstra = Object.keys(extras).filter(e => extras[e]);

    const ekstraParcalar = data.filter(
      item => ekstra.includes(item.KATEGORI) && item.MARKA === selected.marka && item.MODEL === selected.model
    );

    return [...periyodik, ...ekstraParcalar, ...iscilik];
  };

  const toplam = filteredParts().reduce((sum, item) => sum + item.FIYAT * item.BIRIM, 0);

  return (
    <div>
      <div className="logos">
        <img src={boschLogo} alt="Bosch Logo" className="logo" />
        <img src={caliskanelLogo} alt="Caliskanel Logo" className="logo" />
      </div>

      <div className="selectors">
        <select onChange={(e) => setSelected({ ...selected, marka: e.target.value })}>
          <option>Marka</option>
          {[...new Set(data.map(d => d.MARKA))].map(m => <option key={m}>{m}</option>)}
        </select>
        <select onChange={(e) => setSelected({ ...selected, model: e.target.value })}>
          <option>Model</option>
          {[...new Set(data.filter(d => d.MARKA === selected.marka).map(d => d.MODEL))].map(m => <option key={m}>{m}</option>)}
        </select>
      </div>

      <div className="extras">
        {Object.keys(extras).map(key => (
          <label key={key}>
            <input type="checkbox" checked={extras[key]} onChange={() => setExtras({ ...extras, [key]: !extras[key] })} /> {key}
          </label>
        ))}
      </div>

      <table>
        <thead>
          <tr><th>Kategori</th><th>Parça</th><th>Birim</th><th>Fiyat (TL)</th><th>Toplam</th></tr>
        </thead>
        <tbody>
          {filteredParts().map((item, index) => (
            <tr key={index}>
              <td>{item.KATEGORI}</td>
              <td>{item.URUN}</td>
              <td>{item.BIRIM}</td>
              <td>{item.FIYAT.toLocaleString('tr-TR')} TL</td>
              <td>{(item.BIRIM * item.FIYAT).toLocaleString('tr-TR')} TL</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="total-display">Toplam: {toplam.toLocaleString('tr-TR')} TL</div>

      <div className="form-fields">
        <input type="text" placeholder="İsim Soyisim" value={formData.isim} onChange={(e) => setFormData({ ...formData, isim: e.target.value })} />
        <input type="text" placeholder="Plaka" value={formData.plaka} onChange={(e) => setFormData({ ...formData, plaka: e.target.value })} />
      </div>

      <button className="button" onClick={() => generatePDF(filteredParts(), formData)}>PDF Teklif Oluştur</button>
    </div>
  );
};

export default Home;
