const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 3000;

// Petit hardening cosmétique
app.use((req, res, next) => {
  res.removeHeader("X-Powered-By");
  next();
});

/**
 * Endpoint SSRF vulnérable
 * Exemple :
 *   /fetch?url=https://example.com
 */
app.get("/fetch", async (req, res) => {
  const { url } = req.query;

  // ✅ Validation minimale (évite le crash)
  if (!url) {
    return res.status(400).json({ error: "paramètre url requis" });
  }

  try {
    const response = await axios.get(url);
    res.send(response.data);
  } catch (err) {
    return res.status(400).json({
      error: "URL invalide ou inaccessible",
      details: err.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur SSRF démarré sur http://localhost:${PORT}`);
  console.log(`Test : http://localhost:${PORT}/fetch?url=https://example.com`);
});
