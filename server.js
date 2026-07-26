const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const DATA_FILE = path.join(__dirname, 'data', 'messages.json');

app.use(express.json());       // lets us read JSON from the request body
app.use(express.static('public')); // serves index.html, style.css, script.js

// ---------- GET all messages ----------
app.get('/api/messages', (req, res) => {
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  const messages = JSON.parse(raw);

  // show newest messages first
  res.json(messages.reverse());
});

// ---------- POST a new message ----------
app.post('/api/messages', (req, res) => {
  const { name, message } = req.body;

  if (!name || !message) {
    return res.status(400).json({ error: 'Name and message are required' });
  }

  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  const messages = JSON.parse(raw);

  const newEntry = {
    id: Date.now(),          // simple unique id using the current timestamp
    name,
    message,
    date: new Date().toLocaleDateString()
  };

  messages.push(newEntry);
  fs.writeFileSync(DATA_FILE, JSON.stringify(messages, null, 2));

  res.status(201).json(newEntry);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Guestbook running on http://localhost:${PORT}`));