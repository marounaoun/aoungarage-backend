const express = require('express');
const router = express.Router();

// 🔹 GET all clients
router.get('/', (req, res) => {
  const clients = req.db.prepare('SELECT * FROM clients').all();
  res.json(clients);
});

// 🔹 GET a client by ID
router.get('/:id', (req, res) => {
  const client = req.db.prepare('SELECT * FROM clients WHERE id = ?').get(req.params.id);
  if (!client) return res.status(404).json({ error: 'Client not found' });
  res.json(client);
});

// 🔹 POST new client
router.post('/', (req, res) => {
  const { name, phone, plate_number, tracking_code } = req.body;
  if (!name || !phone || !plate_number || !tracking_code) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  const stmt = req.db.prepare(
    'INSERT INTO clients (name, phone, plate_number, tracking_code) VALUES (?, ?, ?, ?)'
  );
  const result = stmt.run(name, phone, plate_number, tracking_code);
  res.status(201).json({ id: result.lastInsertRowid, name, phone, plate_number, tracking_code });
});

// 🔹 PUT update client
router.put('/:id', (req, res) => {
  const { name, phone, plate_number, tracking_code } = req.body;
  req.db.prepare(
    'UPDATE clients SET name = ?, phone = ?, plate_number = ?, tracking_code = ? WHERE id = ?'
  ).run(name, phone, plate_number, tracking_code, req.params.id);
  res.json({ message: 'Client updated' });
});

// 🔹 DELETE client
router.delete('/:id', (req, res) => {
  req.db.prepare('DELETE FROM clients WHERE id = ?').run(req.params.id);
  res.json({ message: 'Client deleted' });
});

module.exports = router;
