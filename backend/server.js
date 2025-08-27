const path = require('path');
const express = require('express');
const cors = require('cors');
const colors = require('colors');
const dotenv = require('dotenv').config({ path: '../.env' });
const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');
const port = process.env.PORT || 2000;

connectDB();

const app = express();

// CORS configuration for separate frontend/backend deployments
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://goal-setting-b42z-avgp6nack-shreyas-kanchans-projects.vercel.app',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/goals', require('./routes/goalRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// API status endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Goal Setter API is running!', 
    version: '1.0.0',
    endpoints: {
      goals: '/api/goals',
      users: '/api/users'
    }
  });
});

app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
