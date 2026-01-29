const express = require('express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = 3000;

// ✅ IMPORTANT : pour avoir req.body
app.use(express.json());

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de demonstration",
      version: "1.0.0",
      description: "ma super api",
    },
    // ✅ servers (pluriel)
    servers: [
      { url: `http://localhost:${PORT}` },
    ],
  },
  apis: ["./app.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /:
 *   get:
 *     summary: Retourne le message de bienvenue
 *     responses:
 *       200:
 *         description: Message de bienvenue
 */
app.get('/', (req, res) => {
  res.status(200).send("Bienvenue sur mon API !");
});

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Lister les users
 *     responses:
 *       200:
 *         description: Liste les utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 */
app.get('/users', (req, res) => {
  const users = [
    { id: 1, name: "John" },
    { id: 2, name: "Alice" },
  ];
  res.status(200).json(users);
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Créer un nouvel utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: L'utilisateur a bien été créé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                 name:
 *                   type: string
 *       400:
 *         description: name manquant
 */
app.post('/users', (req, res) => {
  const { name } = req.body || {};
  if (!name) return res.status(400).json({ error: "name requis" });

  const newUser = {
    id: Date.now(),
    name,
  };

  res.status(201).json(newUser);
});

app.listen(PORT, () => {
  console.log(`Serveur en écoute sur http://localhost:${PORT}`);
  console.log(`Swagger sur http://localhost:${PORT}/api-docs`);
});
