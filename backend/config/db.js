// backend/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Disable command buffering so Mongoose fails fast if connection is not established
        mongoose.set('bufferCommands', false);
        const conn = await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 2000 // Fail quickly (2 seconds) instead of waiting 10-30 seconds
        });
        console.log(`📡 MongoDB Connected Successfully: ${conn.connection.host}`);
        global.useMockDb = false;
    } catch (error) {
        console.error(`⚠️ MongoDB Connection Error: ${error.message}`);
        console.log(`📡 MongoDB is not running locally. Activating the premium local JSON file database fallback...`);
        global.useMockDb = true;
    }
};

module.exports = connectDB;
