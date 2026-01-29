const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

const PORT = 3001;
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
if (!JWT_SECRET_KEY) {
  console.error("JWT_SECRET_KEY is not set");
  process.exit(1);
}

const app = express();
app.use(bodyParser.json());

// DB
const db = new sqlite3.Database("./database.db", (err) => {
  if (err) console.error(err.message);
  else console.log("Connected to SQLite");
});

// Init DB + admin
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      role TEXT
    )
  `);

  db.get(`SELECT id FROM users WHERE username = ?`, ["admin"], async (_, row) => {
    if (!row) {
      const hash = await bcrypt.hash("password", 12);
      db.run(
        `INSERT INTO users (username, password, role) VALUES (?, ?, ?)`,
        ["admin", hash, "admin"]
      );
      console.log("Admin account created (admin/password)");
    }
  });
});

// Auth middleware
const authenticateJWT = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return res.sendStatus(401);

  jwt.verify(header.split(" ")[1], JWT_SECRET_KEY, (err, payload) => {
    if (err) return res.sendStatus(403);
    req.user = payload;
    next();
  });
};

// Admin check (DB source of truth)
const isAdmin = (req, res, next) => {
  db.get(
    `SELECT role FROM users WHERE id = ?`,
    [req.user.id],
    (err, row) => {
      if (err || !row) return res.sendStatus(500);
      if (row.role !== "admin") return res.sendStatus(403);
      next();
    }
  );
};

// 🔐 REGISTER (ADMIN ONLY)
app.post("/register", authenticateJWT, isAdmin, async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Invalid input" });
  }

  const hash = await bcrypt.hash(password, 12);
  db.run(
    `INSERT INTO users (username, password, role) VALUES (?, ?, 'user')`,
    [username, hash],
    (err) => {
      if (err) return res.status(409).json({ message: "User already exists" });
      res.status(201).json({ message: "User created" });
    }
  );
});

// LOGIN
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.get(
    `SELECT id, password FROM users WHERE username = ?`,
    [username],
    async (err, user) => {
      if (err || !user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const ok = await bcrypt.compare(password, user.password);
      if (!ok) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { id: user.id, username },
        JWT_SECRET_KEY,
        { expiresIn: "1h" }
      );

      res.json({ token });
    }
  );
});

// ADMIN LIST
app.get("/admin", authenticateJWT, isAdmin, (req, res) => {
  db.all(`SELECT id, username, role FROM users`, [], (err, users) => {
    if (err) return res.sendStatus(500);
    res.json(users);
  });
});

// USER INFO
app.get("/user", authenticateJWT, (req, res) => {
  db.get(
    `SELECT id, username, role FROM users WHERE id = ?`,
    [req.user.id],
    (err, user) => {
      if (err || !user) return res.sendStatus(404);
      res.json(user);
    }
  );
});

// Start
app.listen(PORT, () => {
  console.log(`Secure API running on port ${PORT}`);
});
