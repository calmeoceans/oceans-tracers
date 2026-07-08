const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;
const rootDir = path.resolve(__dirname, '..');
const dataPath = path.join(__dirname, 'site-data.json');
const contactsPath = path.join(__dirname, 'contacts.json');

if (!fs.existsSync(contactsPath)) {
  fs.writeFileSync(contactsPath, '[]\n', 'utf8');
}

const siteData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

app.use(express.json({ limit: '1mb' }));
app.use(express.static(rootDir));

app.get('/api/site-data', (_req, res) => {
  res.json(siteData);
});

app.post('/api/contact', (req, res) => {
  const { name, email, pobox = '', message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ ok: false, message: 'Please provide your name, email and message.' });
  }

  const entry = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    name: String(name).trim(),
    email: String(email).trim(),
    pobox: String(pobox).trim(),
    message: String(message).trim(),
    createdAt: new Date().toISOString()
  };

  const contacts = JSON.parse(fs.readFileSync(contactsPath, 'utf8'));
  contacts.push(entry);
  fs.writeFileSync(contactsPath, JSON.stringify(contacts, null, 2) + '\n', 'utf8');

  res.json({ ok: true, message: 'Thanks for reaching out. We will follow up shortly.' });
});

app.get('*', (_req, res) => {
  res.sendFile(path.join(rootDir, 'index.html'));
});

app.listen(port, () => {
  console.log(`Ocean Tracers server listening on http://localhost:${port}`);
});
