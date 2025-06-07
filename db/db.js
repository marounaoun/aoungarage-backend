const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(path.join(__dirname, '../aoungarage.db'), (err) => {
  if (err) {
    console.error('❌ Failed to connect to database:', err.message);
  } else {
    console.log('✅ Connected to AounGarage database.');
  }
});

// Create tables if not exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    phone TEXT,
    plate_number TEXT,
    tracking_code TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS insurance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER,
    type TEXT,
    registration_card TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS offers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    valid_until TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_name TEXT,
    phone TEXT,
    date TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS repairs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    plate_number TEXT,
    status TEXT,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`);
});

module.exports = db;
