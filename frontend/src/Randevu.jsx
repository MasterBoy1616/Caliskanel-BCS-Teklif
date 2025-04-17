// frontend/src/Randevu.jsx

import React from "react";

const Randevu = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-4">Randevu Al</h1>
      <form className="flex flex-col gap-4 w-full max-w-md">
        <input type="text" placeholder="Ad Soyad" className="border p-2" required />
        <input type="text" placeholder="Telefon" className="border p-2" required />
        <input type="text" placeholder="Araç Plakası" className="border p-2" required />
        <input type="text" placeholder="Araç Marka / Model" className="border p-2" required />
        <input type="datetime-local" className="border p-2" required />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
        >
          Randevu Al
        </button>
      </form>
    </div>
  );
};

export default Randevu;
