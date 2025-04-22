import { useState, useEffect } from "react";
import { generatePDF } from "./pdfGenerator";

export default function Home() {
  const [isim, setIsim] = useState("");
  const [plaka, setPlaka] = useState("");
  const [markalar, setMarkalar] = useState([]);
  const [secilenMarka, setSecilenMarka] = useState("");
  const [modeller, setModeller] = useState([]);
  const [secilenModel, setSecilenModel] = useState("");
  const [parcalar, setParcalar] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("https://caliskanel-bcs-teklif.onrender.com/api/markalar")
      .then((res) => res.json())
      .then((data) => setMarkalar(data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (secilenMarka) {
      fetch(
        `https://caliskanel-bcs-teklif.onrender.com/api/modeller?marka=${encodeURIComponent(
          secilenMarka
        )}`
      )
        .then((res) => res.json())
        .then((data) => setModeller(data))
        .catch((err) => console.error(err));
    }
  }, [secilenMarka]);

  const handleParcaGetir = () => {
    if (!secilenMarka || !secilenModel) return;
    setLoading(true);
    fetch(
      `https://caliskanel-bcs-teklif.onrender.com/api/parcalar?marka=${encodeURIComponent(
        secilenMarka
      )}&model=${encodeURIComponent(secilenModel)}`
    )
      .then((res) => res.json())
      .then((data) => setParcalar(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-violet-500 to-purple-700 p-4">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-purple-700 mb-6">
          Çalışkanel Bosch Car Servisi
        </h1>

        <input
          className="border p-2 w-full mb-3 rounded"
          placeholder="İsim Soyisim"
          value={isim}
          onChange={(e) => setIsim(e.target.value)}
        />
        <input
          className="border p-2 w-full mb-3 rounded"
          placeholder="Plaka"
          value={plaka}
          onChange={(e) => setPlaka(e.target.value)}
        />

        <select
          className="border p-2 w-full mb-3 rounded"
          value={secilenMarka}
          onChange={(e) => setSecilenMarka(e.target.value)}
        >
          <option value="">Marka Seçiniz</option>
          {markalar.map((marka, idx) => (
            <option key={idx} value={marka}>
              {marka}
            </option>
          ))}
        </select>

        {secilenMarka && (
          <select
            className="border p-2 w-full mb-3 rounded"
            value={secilenModel}
            onChange={(e) => setSecilenModel(e.target.value)}
          >
            <option value="">Model Seçiniz</option>
            {modeller.map((model, idx) => (
              <option key={idx} value={model}>
                {model}
              </option>
            ))}
          </select>
        )}

        <button
          onClick={handleParcaGetir}
          disabled={!secilenMarka || !secilenModel}
          className="bg-purple-600 text-white py-2 px-4 w-full rounded hover:bg-purple-800 mb-4 disabled:opacity-50"
        >
          Parçaları Getir
        </button>

        {loading && <p className="text-center text-purple-600">Yükleniyor...</p>}

        {parcalar.length > 0 && (
          <div className="bg-purple-100 p-4 rounded-lg mt-4">
            <h2 className="text-lg font-semibold mb-2">Parça Listesi</h2>
            <ul className="space-y-2">
              {parcalar.map((parca, idx) => (
                <li key={idx} className="text-sm">
                  {parca.urun} - {parca.adet} x {parca.birim_fiyat} ₺ = {parca.toplam_fiyat} ₺
                </li>
              ))}
            </ul>
            <button
              onClick={() => generatePDF(isim, plaka, secilenMarka, secilenModel, parcalar)}
              className="mt-4 bg-purple-600 text-white py-2 px-4 w-full rounded hover:bg-purple-800"
            >
              PDF Oluştur
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
