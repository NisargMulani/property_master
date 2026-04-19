const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();
const requestLogger = require('./middleware/logger');

const app = express();

// Middleware
app.use(cors());
app.use(requestLogger);                           // Log every request: IP, time, method, status
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));




// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/properties', require('./routes/properties'));
app.use('/api/admin', require('./routes/admin'));

// ── Seed default admin account ─────────────────────────────
async function seedDefaultAdmin() {
  const User = require('./models/User');
  const ADMIN_EMAIL = 'admin@gmail.com';
  const ADMIN_PASS = 'admin123';

  const existing = await User.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    // Make sure existing account has admin role
    if (existing.role !== 'admin') {
      await User.updateOne({ email: ADMIN_EMAIL }, { role: 'admin' });
      console.log('Default admin role updated.');
    }
    return;
  }

  await User.create({
    name: 'Admin',
    email: ADMIN_EMAIL,
    password: ADMIN_PASS,
    role: 'admin',
  });
  console.log('admin created  →  admin@gmail.com / admin123');
}

// Connect to MongoDB, then seed & start server
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB Connected');
    await seedDefaultAdmin();
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

