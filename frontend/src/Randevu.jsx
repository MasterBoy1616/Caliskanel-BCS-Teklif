import React, { useState } from "react";
import { generatePdf } from "./pdfGenerator";
import axios from "axios";

const Randevu = ({ fiyatBilgisi, parts, optionalParts }) => {
  const [formData, setFormData] = useState({
    adSoyad: "",
    telefon: "",
    plaka: "",
    arac: "",
    randevuTarihi: ""
  });

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
