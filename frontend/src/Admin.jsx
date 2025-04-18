// frontend/src/Admin.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminPanel = () => {
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [parts, setParts] = useState(null);
  const [fiyatBakmaCount, setFiyatBakmaCount] = useState(0);
  const [randevuCount, setRandevuCount] = useState(0);
  const [randevular, setRandevular] = useState([]);

  useEffect(() => {
    axios.get("/api/brands").then((res) => setBrands(res.data));
    axios.get("/api/log/fiyatbakmasayisi").then((res) => setFiyatBakmaCount(res.data.adet));
    axios.get("/api/log/randevusayisi").then((res) => setRandevuCount(res.data.adet));
    axios.get("/api/randevular").then((res) => 
      setRandevular(res.data.map(r => ({ ...r, durum: "Beklemede" })))
    );
  }, []);

  useEffect(() => {
    if (selectedBrand) {
      axios.get(`/api/models?brand=${selectedBrand}`).then((res) => setModels(res.data));
    }
  }, [selectedBrand]);

  useEffect(() => {
    if (selectedBrand && selectedModel) {
      axios.get(`/api/parts?brand=${selectedBrand}&model=${selectedModel}`)
        .then((res) => setParts(res.data));
    }
  }, [selectedBrand, selectedModel]);

  const calculateTotal = () => {
    if (!parts) return 0
