const mongoose = require("mongoose");

// Each cart item links to a Book and stores a quantity
const cartItemSchema = new mongoose.Schema({
  book: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book", // reference to Book model
    required: true,
  },
  // Quantity must be at least 1
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
});

// Cart schema represents a user's shopping cart; `user` is unique so each user has one cart
const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  items: [cartItemSchema], // array of items in the cart
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Cart", cartSchema);
