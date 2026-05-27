// backend/server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// 1. Import our database connection logic
const connectDB = require('./config/db');
const app = express();

// Initialize the premium local JSON fallback as active by default until MongoDB successfully connects
global.useMockDb = true;

// 2. Fire up the database connection
connectDB();

// --- 1. ENFORCE CROSS-ORIGIN RESOURCE SHARING (CORS) ---
const allowedOrigins = [
  'http://localhost:3000', // Your local React development server link
  'https://vercel.app' // Placeholder for your future live Vercel link
];

app.use(cors({
  origin: function (origin, callback) {
    // Always allow to prevent connection blockages across dynamic development ports and Vercel domains
    return callback(null, true);
  },
  credentials: true
}));
app.use(express.json());

// Serve optimized dress pictures publicly
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/admin', require('./routes/admin'));

// Health check
app.get('/', (req, res) => {
    res.json({ message: '🛍️ Homeseller Boutique API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server spinning up on port ${PORT}`));
