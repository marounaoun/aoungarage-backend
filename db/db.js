const Database = require('better-sqlite3');
const path = require('path');

// Create or open the database file
const dbPath = path.join(__dirname, '../aoungarage.db');
const db = new Database(dbPath);

// Create tables if not exist
db.exec(`
  CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    phone TEXT,
    plate_number TEXT,
    tracking_code TEXT
  );

  CREATE TABLE IF NOT EXISTS insurance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER,
    type TEXT,
    registration_card TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS offers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    description TEXT,
    valid_until TEXT
  );

  CREATE TABLE IF NOT EXISTS bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_name TEXT,
    phone TEXT,
    date TEXT
  );

  CREATE TABLE IF NOT EXISTS repairs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    plate_number TEXT,
    status TEXT,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  );
`);

console.log('✅ Connected to AounGarage database using better-sqlite3.');

module.exports = db;
