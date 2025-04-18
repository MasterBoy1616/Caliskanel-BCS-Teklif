import React from "react";

const Teklif = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-6">Teklif Al</h1>
      <form className="flex flex-col gap-4 w-full max-w-md">
        <input
          type="text"
          placeholder="Ad Soyad"
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Telefon"
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Araç Plakası"
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Araç Marka / Model"
          className="border p-2 rounded"
          required
        />

        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded"
        >
          Teklif Al
        </button>
      </form>
    </div>
  );
};

export default Teklif;
