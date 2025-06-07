const express = require('express');
const router = express.Router();

// Get all bookings
router.get('/', (req, res) => {
  const rows = req.db.prepare('SELECT * FROM bookings').all();
  res.json(rows);
});

// Add booking
router.post('/', (req, res) => {
  const { full_name, phone, service, appointment_date, notes } = req.body;
  const stmt = req.db.prepare(`
    INSERT INTO bookings (full_name, phone, service, appointment_date, notes)
    VALUES (?, ?, ?, ?, ?)
  `);
  const info = stmt.run(full_name, phone, service, appointment_date, notes || '');
  res.status(201).json({ id: info.lastInsertRowid, ...req.body });
});

// Update booking
router.put('/:id', (req, res) => {
  const { full_name, phone, service, appointment_date, notes } = req.body;
  req.db.prepare(`
    UPDATE bookings SET full_name = ?, phone = ?, service = ?, appointment_date = ?, notes = ?
    WHERE id = ?
  `).run(full_name, phone, service, appointment_date, notes || '', req.params.id);
  res.json({ message: 'Booking updated' });
});

// Delete booking
router.delete('/:id', (req, res) => {
  req.db.prepare('DELETE FROM bookings WHERE id = ?').run(req.params.id);
  res.json({ message: 'Booking deleted' });
});

module.exports = router;
