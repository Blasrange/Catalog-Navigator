const express = require("express");
const { buscarProducto } = require("./rpa-salsify");
const app = express();
const PORT = process.env.PORT || 4000;

app.get("/api/rpa-salsify", async (req, res) => {
  const productId = req.query.productId;
  if (!productId) return res.status(400).json({ error: "Falta productId" });

  try {
    const data = await buscarProducto(productId);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: "Error al ejecutar Playwright" });
  }
});

app.get("/", (req, res) => {
  res.send("API de scraping con Playwright funcionando");
});

app.listen(PORT, () => {
  console.log(`API corriendo en http://localhost:${PORT}`);
});
