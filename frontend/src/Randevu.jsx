import React, { useState } from "react";

const Randevu = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    plate: "",
    date: "",
    time: ""
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
    alert("Randevu alındı! (Demo)");
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">Randevu Al</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input className="border p-2 w-full" type="text" placeholder="İsim Soyisim" required onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="border p-2 w-full" type="tel" placeholder="Telefon" required onChange={(e) => setForm({ ...form, phone: e.target.value })} />
        <input className="border p-2 w-full" type="text" placeholder="Araç Plakası" required onChange={(e) => setForm({ ...form, plate: e.target.value })} />
        <input className="border p-2 w-full" type="date" required onChange={(e) => setForm({ ...form, date: e.target.value })} />
        <input className="border p-2 w-full" type="time" required onChange={(e) => setForm({ ...form, time: e.target.value })} />
        <button className="bg-green-600 text-white px-6 py-2 rounded" type="submit">Randevu Al</button>
      </form>
    </div>
  );
};

export default Randevu;
