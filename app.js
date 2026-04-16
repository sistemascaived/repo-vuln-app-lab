const express = require("express");
const { exec } = require("child_process");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Laboratorio de app vulnerable");
});

// Ejemplo de command injection
app.get("/ping", (req, res) => {
  const host = req.query.host || "127.0.0.1";
  exec(`ping -c 1 ${host}`, (err, stdout, stderr) => {
    if (err) {
      return res.status(500).send(stderr);
    }
    res.send(stdout);
  });
});

// Ejemplo de autenticación insegura
app.post("/login", (req, res) => {
  const { user, password } = req.body;

  if (user === "admin" && password === "admin123") {
    return res.json({ success: true, token: "hardcoded-admin-token" });
  }

  res.status(401).json({ success: false });
});

// Ejemplo de información sensible expuesta
app.get("/debug", (req, res) => {
  res.json({
    env: process.env,
    internalConfig: {
      dbUser: "root",
      dbPassword: "root123"
    }
  });
});

app.listen(3000, () => {
  console.log("App vulnerable escuchando en puerto 3000");
});
