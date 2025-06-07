const express = require('express');
const router = express.Router();

// Get all repair records
router.get('/', (req, res) => {
  const repairs = req.db.prepare('SELECT * FROM repairs').all();
  res.json(repairs);
});

// Add new repair record
router.post('/', (req, res) => {
  const { plate_number, tracking_code, status, notes } = req.body;
  const stmt = req.db.prepare(`
    INSERT INTO repairs (plate_number, tracking_code, status, notes)
    VALUES (?, ?, ?, ?)
  `);
  const info = stmt.run(plate_number, tracking_code, status, notes || '');
  res.status(201).json({ id: info.lastInsertRowid, ...req.body });
});

// Update repair record
router.put('/:id', (req, res) => {
  const { plate_number, tracking_code, status, notes } = req.body;
  req.db.prepare(`
    UPDATE repairs SET plate_number = ?, tracking_code = ?, status = ?, notes = ?
    WHERE id = ?
  `).run(plate_number, tracking_code, status, notes || '', req.params.id);
  res.json({ message: 'Repair updated' });
});

// Delete repair record
router.delete('/:id', (req, res) => {
  req.db.prepare('DELETE FROM repairs WHERE id = ?').run(req.params.id);
  res.json({ message: 'Repair deleted' });
});

module.exports = router;
