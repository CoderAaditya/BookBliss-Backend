const mongoose = require('mongoose');

// User schema stores basic authentication details
const userSchema = new mongoose.Schema({
  // Display/handle name (unique)
  username: { type: String, required: true, unique: true },
  // Email used for login (unique)
  email: { type: String, required: true, unique: true },
  // Hashed password
  password: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);