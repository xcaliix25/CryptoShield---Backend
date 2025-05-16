const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.SECRET_KEY || 'tajny_token';

app.use(cors());
app.use(bodyParser.json());

// Pro uživatele s PRO přístupem
app.post('/api/scan', authenticateToken, (req, res) => {
  const { address } = req.body;

  // Sem můžeš připojit reálný AI skener nebo API
  const result = {
    address,
    riskScore: Math.floor(Math.random() * 100),
    flagged: Math.random() < 0.2,
    notes: 'Simulovaný AI výstup pro testování.',
  };

  res.json(result);
});

// Simulované přihlášení uživatele
app.post('/api/login', (req, res) => {
  const { username } = req.body;
  const token = jwt.sign({ username, pro: true }, SECRET_KEY, { expiresIn: '1h' });
  res.json({ token });
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.split(' ')[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.listen(PORT, () => console.log(`Server běží na http://localhost:${PORT}`));
