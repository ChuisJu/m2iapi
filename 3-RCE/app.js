const express = require("express");
const { exec } = require("child_process");

const app = express();
const PORT = 3000;

app.get("/ping", (req, res) => {
  const { host } = req.query;

  if (!host) {
    return res.status(400).send("host requis");
  }

  // -c 4 : 4 paquets, -W 2 : timeout de 2s par paquet (Linux)
  exec(`ping -c 4 -W 2 ${host}`, { timeout: 10000 }, (error, stdout, stderr) => {
    if (error) return res.status(500).send(error.message);
    if (stderr) return res.status(500).send(stderr);
    return res.type("text/plain").send(stdout);
  });
});

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
