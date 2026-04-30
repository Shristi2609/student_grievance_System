const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const app = express();

// Middleware
app.use(express.json({ extended: false }));
app.use(cors({
  origin: [
    'https://student-grievance-system-351k.onrender.com',
    'http://localhost:5173'
  ],
  credentials: true
}));

// Define Routes
app.use('/api', require('./routes/auth'));
app.use('/api/grievances', require('./routes/grievances'));

const PORT = process.env.PORT || 5300;
const MONGODB_URI = process.env.MONGODB_URI;

// Connect to MongoDB first, then start server
const startServer = async () => {
  try {
    console.log('⏳ Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB Connected Successfully!');
    console.log(`📦 Database: ${mongoose.connection.name}`);

    app.listen(PORT, () => {
      console.log('------------------------------------------');
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
      console.log('------------------------------------------');
    });
  } catch (err) {
    console.error('❌ MongoDB Connection Failed!');
    console.error(`   Reason: ${err.message}`);
    process.exit(1);
  }
};

startServer();
