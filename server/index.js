const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();
const requestLogger = require('./middleware/logger');

const app = express();

// Middleware
app.use(cors());
app.use(requestLogger);                           
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));




// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/properties', require('./routes/properties'));
app.use('/api/admin', require('./routes/admin'));







mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('MongoDB Connected');
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });

