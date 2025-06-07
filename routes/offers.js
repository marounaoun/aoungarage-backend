const express = require('express');
const router = express.Router();

// Get all weekly offers
router.get('/', (req, res) => {
  const rows = req.db.prepare('SELECT * FROM offers').all();
  res.json(rows);
});

// Add weekly offer
router.post('/', (req, res) => {
  const { title, description } = req.body;
  const stmt = req.db.prepare('INSERT INTO offers (title, description) VALUES (?, ?)');
  const info = stmt.run(title, description);
  res.status(201).json({ id: info.lastInsertRowid, ...req.body });
});

// Update weekly offer
router.put('/:id', (req, res) => {
  const { title, description } = req.body;
  req.db.prepare('UPDATE offers SET title = ?, description = ? WHERE id = ?')
    .run(title, description, req.params.id);
  res.json({ message: 'Offer updated' });
});

// Delete offer
router.delete('/:id', (req, res) => {
  req.db.prepare('DELETE FROM offers WHERE id = ?').run(req.params.id);
  res.json({ message: 'Offer deleted' });
});

module.exports = router;
