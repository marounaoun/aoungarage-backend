const express = require('express');
const multer = require('multer');
const path = require('path');
const nodemailer = require('nodemailer');
const router = express.Router();

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage });

// Create transporter with your email service credentials
const transporter = nodemailer.createTransport({
  service: 'gmail', // or another email provider
  auth: {
    user: 'aoungarage@gmail.com',
    pass: 'xmll kidu nukt qrno' // see note below about Gmail App Passwords
  }
});

// 📥 Get all insurance
router.get('/', (req, res) => {
  const rows = req.db.prepare('SELECT * FROM insurance').all();
  res.json(rows);
});

// 📤 Add insurance with front and back card uploads
router.post(
  '/',
  upload.fields([
    { name: 'registration_card_front', maxCount: 1 },
    { name: 'registration_card_back', maxCount: 1 }
  ]),
  (req, res) => {
    const { full_name, phone, type } = req.body;

    if (
      !req.files.registration_card_front ||
      !req.files.registration_card_back
    ) {
      return res
        .status(400)
        .json({ error: 'Both front and back images are required' });
    }

    const frontUrl = `/uploads/${req.files.registration_card_front[0].filename}`;
    const backUrl = `/uploads/${req.files.registration_card_back[0].filename}`;
    const registration_card_url = JSON.stringify({
      front: frontUrl,
      back: backUrl
    });

    const stmt = req.db.prepare(`
      INSERT INTO insurance (full_name, phone, type, registration_card_url)
      VALUES (?, ?, ?, ?)
    `);
    const info = stmt.run(full_name, phone, type, registration_card_url);
const mailOptions = {
  from: '"AounGarage" <aoungarage@gmail.com>', // sender address
  to: 'marounnaoun@gmail.com', // your email to receive notifications
  subject: 'New Insurance Request Submitted',
  html: `
    <h3>New Insurance Request</h3>
    <p><strong>Name:</strong> ${full_name}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Type:</strong> ${type}</p>
    <p><strong>Registration Card Front:</strong> <a href="${frontUrl}">${frontUrl}</a></p>
    <p><strong>Registration Card Back:</strong> <a href="${backUrl}">${backUrl}</a></p>
  `
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error('Email send error:', error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});

    res.status(201).json({
      id: info.lastInsertRowid,
      full_name,
      phone,
      type,
      registration_card_url: { front: frontUrl, back: backUrl }
    });
  }
);

// ✏️ Update insurance
router.put('/:id', (req, res) => {
  const { full_name, phone, type, registration_card_url } = req.body;
  req.db.prepare(
    `UPDATE insurance SET full_name = ?, phone = ?, type = ?, registration_card_url = ? WHERE id = ?`
  ).run(full_name, phone, type, registration_card_url, req.params.id);
  res.json({ message: 'Insurance updated' });
});

// ❌ Delete insurance
router.delete('/:id', (req, res) => {
  req.db.prepare('DELETE FROM insurance WHERE id = ?').run(req.params.id);
  res.json({ message: 'Insurance deleted' });
});

module.exports = router;
