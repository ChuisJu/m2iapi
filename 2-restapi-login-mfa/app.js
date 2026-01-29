// app.js
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const bodyParser = require("body-parser");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const speakeasy = require("speakeasy");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3001;

// =====================
// MIDDLEWARES
// =====================
app.use(bodyParser.json());

// =====================
// DATABASE
// =====================
const db = new sqlite3.Database("./database.db", (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log("Connected to SQLite");

    db.serialize(() => {
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          email TEXT UNIQUE,
          password TEXT,
          name TEXT
        )
      `);

      // Migration OTP (ignore erreur si déjà existant)
      db.run(`ALTER TABLE users ADD COLUMN otpSecret TEXT`, () => {});
    });
  }
});

// =====================
// SWAGGER CONFIG
// =====================
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Auth + OTP",
      version: "1.0.0",
      description: "API d’authentification JWT avec OTP (TOTP)",
    },
    servers: [{ url: `http://localhost:${port}` }],
  },
  apis: ["./app.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// =====================
// JWT MIDDLEWARE
// =====================
const authenticateToken = (req, res, next) => {
  const auth = req.header("Authorization");
  if (!auth) return res.sendStatus(401);

  const token = auth.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) return res.sendStatus(403);
    req.user = payload;
    next();
  });
};

// =====================
// SWAGGER SCHEMAS
// =====================
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 *   schemas:
 *     UserRegister:
 *       type: object
 *       required: [email, password, name]
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         name:
 *           type: string
 *
 *     UserLogin:
 *       type: object
 *       required: [email, password]
 *       properties:
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         otp:
 *           type: string
 */

// =====================
// ROUTES
// =====================

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Créer un compte utilisateur
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegister'
 *     responses:
 *       201:
 *         description: Utilisateur créé
 *       400:
 *         description: Erreur de validation
 */
app.post("/register", async (req, res) => {
  const { email, password, name } = req.body || {};
  if (!email || !password || !name) {
    return res.status(400).json({ message: "email, password et name requis" });
  }

  const hash = await bcrypt.hash(password, 10);

  db.run(
    "INSERT INTO users (email, password, name) VALUES (?, ?, ?)",
    [email, hash, name],
    function (err) {
      if (err) return res.status(400).json({ message: "Email déjà utilisé" });
      res.status(201).json({ id: this.lastID });
    }
  );
});

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Connexion utilisateur (JWT + OTP si activé)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       200:
 *         description: Connexion réussie
 *       400:
 *         description: Identifiants invalides
 */
app.post("/login", (req, res) => {
  const { email, password, otp } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: "email et password requis" });
  }

  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (err || !user) {
      return res.status(400).json({ message: "Identifiants invalides" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(400).json({ message: "Identifiants invalides" });
    }

    if (user.otpSecret) {
      if (!otp) return res.status(400).json({ message: "OTP requis" });

      const valid = speakeasy.totp.verify({
        secret: user.otpSecret,
        encoding: "base32",
        token: otp,
        window: 1,
      });

      if (!valid) {
        return res.status(400).json({ message: "OTP invalide" });
      }
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token });
  });
});

/**
 * @swagger
 * /enable-otp:
 *   post:
 *     summary: Activer l’OTP (TOTP)
 *     tags: [OTP]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: OTP activé
 */
app.post("/enable-otp", authenticateToken, (req, res) => {
  const userId = req.user.userId;

  db.get("SELECT email FROM users WHERE id = ?", [userId], (err, user) => {
    if (err || !user) {
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }

    const secret = speakeasy.generateSecret({
      name: `API (${user.email})`,
      issuer: "API",
      length: 20,
    });

    db.run(
      "UPDATE users SET otpSecret = ? WHERE id = ?",
      [secret.base32, userId],
      (err2) => {
        if (err2) return res.status(500).json({ message: "Erreur serveur" });

        res.json({
          message: "OTP activé",
          otpauthUrl: secret.otpauth_url,
          secretBase32: secret.base32,
        });
      }
    );
  });
});

/**
 * @swagger
 * /account:
 *   get:
 *     summary: Récupérer les infos du compte
 *     tags: [Account]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Infos utilisateur
 */
app.get("/account", authenticateToken, (req, res) => {
  db.get(
    "SELECT id, email, name FROM users WHERE id = ?",
    [req.user.userId],
    (err, user) => {
      if (err || !user) return res.sendStatus(404);
      res.json(user);
    }
  );
});

/**
 * @swagger
 * /account/email:
 *   patch:
 *     summary: Modifier l’email
 *     tags: [Account]
 *     security:
 *       - bearerAuth: []
 */
app.patch("/account/email", authenticateToken, (req, res) => {
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ message: "email requis" });

  db.run(
    "UPDATE users SET email = ? WHERE id = ?",
    [email, req.user.userId],
    (err) => {
      if (err) return res.status(400).json({ message: "Erreur email" });
      res.json({ message: "Email mis à jour" });
    }
  );
});

/**
 * @swagger
 * /account/password:
 *   patch:
 *     summary: Modifier le mot de passe
 *     tags: [Account]
 *     security:
 *       - bearerAuth: []
 */
app.patch("/account/password", authenticateToken, async (req, res) => {
  const { password } = req.body || {};
  if (!password) return res.status(400).json({ message: "password requis" });

  const hash = await bcrypt.hash(password, 10);

  db.run(
    "UPDATE users SET password = ? WHERE id = ?",
    [hash, req.user.userId],
    (err) => {
      if (err) return res.status(400).json({ message: "Erreur mot de passe" });
      res.json({ message: "Mot de passe modifié" });
    }
  );
});

// =====================
// START SERVER
// =====================
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
