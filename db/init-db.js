const Database = require('better-sqlite3');
const db = new Database('aoungarage.db');

const row = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='insurance_requests'").get();

if (row) {
  console.log("✅ Table 'insurance_requests' exists.");
} else {
  console.log("❌ Table 'insurance_requests' does NOT exist.");
}
