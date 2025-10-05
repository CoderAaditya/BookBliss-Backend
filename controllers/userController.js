const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const HTTP = require("../constants/httpCodes");

// Register a new user
const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body; // expect these fields in body

    // Prevent duplicate users by email
    let user = await User.findOne({ email });
    if (user) return res.status(HTTP.BAD_REQUEST).json({ msg: "User already exists" });

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 12);
    user = new User({ username, email, password: hashedPassword });
    await user.save();

    // Create a JWT that encodes the user id
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Return token and minimal user info
    res.status(HTTP.OK).json({ token, user: { id: user._id, username, email } });
  } catch (err) {
    res.status(HTTP.INTERNAL_SERVER_ERROR).json({ msg: err.message });
  }
};

// Authenticate an existing user and return a JWT
const loginUser = async (req, res) => {
  try {
    // Debug log of request (can be removed in production)
    console.log("Login request body:", req.body);
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    console.log("user:", user);
    if (!user) {
      // If user not found, send generic invalid credentials message
      return res.status(HTTP.BAD_REQUEST).json({ msg: "Invalid credentials" });
    }

    // Compare provided password with stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(HTTP.BAD_REQUEST).json({ msg: "Invalid credentials" });
    }
    console.log("Password match:", isMatch);

    // Issue a token and return basic user info
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.status(HTTP.OK).json({ token, user: { id: user._id, username: user.username, email } });
  } catch (err) {
    console.error("Login error:", err);
    res.status(HTTP.INTERNAL_SERVER_ERROR).json({ msg: err.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
