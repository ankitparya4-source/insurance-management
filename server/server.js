const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Route imports
const authRoutes = require('./routes/authRoutes');
const policyRoutes = require('./routes/policyRoutes');
const userPolicyRoutes = require('./routes/userPolicyRoutes');
const claimRoutes = require('./routes/claimRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json());

// Root Health Check Route
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Insurance Management System API is running',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/policies', policyRoutes);
app.use('/api/user-policies', userPolicyRoutes);
app.use('/api/claims', claimRoutes);
app.use('/api/admin', adminRoutes);

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({ message: 'API route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  res.status(500).json({
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

// Connect to MongoDB first, then start listening
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
};

startServer();

