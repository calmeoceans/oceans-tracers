/*
 Minimal static server + contact API
 Env: copy .env.example -> .env and set values
*/
const path = require('path');
const fs = require('fs');
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const FRONTEND = process.env.FRONTEND_ORIGIN || '*';
app.use(cors({ origin: FRONTEND }));

const limiter = rateLimit({ windowMs: 60 * 1000, max: 8 });
app.use('/api/contact', limiter);

// static
const STATIC_ROOT = path.join(__dirname, '..');
app.use(express.static(STATIC_ROOT));

// ensure data directory
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

function sanitize(s) { return String(s || '').replace(/<[^>]*>/g, '').trim(); }

const transporter = (process.env.SMTP_HOST && process.env.SMTP_USER) ? nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: process.env.SMTP_PORT === '465',
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
}) : null;

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message, consent, source } = req.body || {};
    if (!name || !email || !message || (consent !== true && consent !== 'true')) {
      return res.status(400).json({ ok: false, error: 'Missing required fields or consent' });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ ok: false, error: 'Invalid email' });
    }

    const entry = {
      id: uuidv4(),
      name: sanitize(name).slice(0,200),
      email: sanitize(email).slice(0,200),
      message: sanitize(message).slice(0,5000),
      consent: true,
      source: sanitize(source || ''),
      ip: req.ip,
      ua: req.get('User-Agent') || '',
      ts: new Date().toISOString(),
      status: 'pending'
    };

    const logfile = path.join(DATA_DIR, 'contacts.log');
    fs.appendFileSync(logfile, JSON.stringify(entry) + '\n');

    if (transporter) {
      const mailOpts = {
        from: process.env.SMTP_SENDER || process.env.SMTP_USER,
        to: process.env.CONTACT_TO || process.env.SMTP_USER,
        subject: `Website contact: ${entry.name}`,
        text: `Name: ${entry.name}\nEmail: ${entry.email}\n\nMessage:\n${entry.message}\n\nIP: ${entry.ip}\nUA: ${entry.ua}\nTS: ${entry.ts}\nSource: ${entry.source}`
      };
      try {
        await transporter.sendMail(mailOpts);
        entry.status = 'sent';
      } catch (mailErr) {
        entry.status = 'failed';
        entry.error = (mailErr && mailErr.message) ? mailErr.message : 'send_error';
      }
    } else {
      entry.status = 'not_sent_no_smtp';
    }

    fs.appendFileSync(logfile, JSON.stringify({ id: entry.id, status: entry.status, error: entry.error || null }) + '\n');

    return res.json({ ok: true, status: entry.status });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: 'server_error' });
  }
});

app.get('/health', (req, res) => res.json({ ok: true, ts: new Date().toISOString() }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`App listening on ${PORT}`));