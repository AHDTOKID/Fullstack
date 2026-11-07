const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const feedbackRoutes = require('./routes/feedback');
const userRoutes = require('./routes/users');
const timetableRoutes = require('./routes/timetable');
const feeRoutes = require('./routes/fees');
const classRoutes = require('./routes/classes');
const recordRoutes = require('./routes/records');
const seedDatabase = require('./seed');

const app = express();
const PORT = process.env.PORT || 5001;

// CORS configuration supporting localhost, Vercel deployments, and custom domains
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        process.env.NODE_ENV !== 'production'
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(morgan('dev'));

// Database connection helper for serverless and standard Node
let cachedConn = null;
let isSeeded = false;

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  if (!process.env.MONGO_URI) {
    console.warn('⚠️ MONGO_URI environment variable is not configured.');
    return null;
  }

  if (!cachedConn) {
    cachedConn = mongoose
      .connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
      })
      .then(async (m) => {
        console.log('✅ MongoDB connected');
        if (!isSeeded) {
          try {
            await seedDatabase();
            isSeeded = true;
          } catch (seedErr) {
            console.warn('⚠️ Database seed notice:', seedErr.message);
          }
        }
        return m;
      })
      .catch((err) => {
        cachedConn = null;
        console.error('❌ MongoDB connection error:', err.message);
        throw err;
      });
  }

  return cachedConn;
};

// Database connection middleware for API routes
app.use(async (req, res, next) => {
  if (req.path === '/' || req.path === '/api' || req.path === '/api/health') {
    return next();
  }
  try {
    await connectDB();
    next();
  } catch (err) {
    return res.status(503).json({
      success: false,
      message: 'Database connection failed. Please ensure MONGO_URI is set in your environment variables.',
      error: err.message,
    });
  }
});

// Root & Health check routes
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Academic Portal API is running' });
});

app.get('/api', (req, res) => {
  res.json({ status: 'ok', message: 'Academic Portal API is running' });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Academic Portal API is running',
    dbConnected: mongoose.connection.readyState === 1,
    environment: process.env.NODE_ENV || 'development',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/users', userRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/records', recordRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start server locally when executed directly
if (require.main === module) {
  connectDB()
    .catch((err) => console.error('Initial DB connection failed:', err.message))
    .finally(() => {
      app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
    });
}

module.exports = app;
module.exports.connectDB = connectDB;
