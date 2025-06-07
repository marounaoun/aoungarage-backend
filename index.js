const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./db/db'); // or wherever your DB setup is

const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
app.use(cors());
app.use(express.json());

// ✅ Attach DB to all requests
app.use((req, res, next) => {
  req.db = db;
  next();
});

// ✅ ROUTES (make sure all are correctly required and used)
const repairsRouter = require('./routes/repairs');
const clientsRouter = require('./routes/clients');
const insuranceRouter = require('./routes/insurance');
const offersRouter = require('./routes/offers');
const bookingsRouter = require('./routes/bookings');

app.use('/api/repairs', repairsRouter);
app.use('/api/clients', clientsRouter);
app.use('/api/insurance', insuranceRouter);
app.use('/api/offers', offersRouter);
app.use('/api/bookings', bookingsRouter);
app.use('/uploads', express.static('uploads'));

app.get('/', (req, res) => {
  res.send('✅ AounGarage backend is running');
});
