const mongoose = require('mongoose');

// Helper to establish a connection to MongoDB. Call this from app startup when desired.
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    // If DB connection fails, log and exit process so the failure is obvious in production
    console.error(err);
    process.exit(1);
  }
};

module.exports = connectDB;