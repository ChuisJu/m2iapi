const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "database.sqlite");

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.log(err.message);
    }
    console.log("Connected to the database");
});

db.serialize(() => {
    // Création de la table
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE
        )
    `);

    // Insertion de 5 utilisateurs
    const insertUser = db.prepare(`
        INSERT OR IGNORE INTO users (name, email)
        VALUES (?, ?)
    `);

    const users = [
        { name: "Alice",   email: "alice@example.com" },
        { name: "Bob",     email: "bob@example.com" },
        { name: "Charlie", email: "charlie@example.com" },
        { name: "Diana",   email: "diana@example.com" },
        { name: "Eve",     email: "eve@example.com" }
    ];

    users.forEach(user => {
        insertUser.run(user.name, user.email);
    });

    insertUser.finalize();
});

module.exports = db;
