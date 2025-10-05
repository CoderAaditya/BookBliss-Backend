const mongoose = require('mongoose');

// Book schema represents a book listing in the store
const bookSchema = new mongoose.Schema({
  // Human-readable title of the book
  title: { type: String, required: true },
  // Author name
  author: { type: String, required: true },
  // Category like Fiction, Sci-Fi, Non-Fiction
  category: { type: String, required: true },
  // Short description or blurb
  description: { type: String, required: true },
  // Price in store's currency (Number)
  price: { type: Number, required: true },
  // Optional URL or path to cover image
  image: { type: String }
}, { timestamps: true }); // timestamps adds createdAt and updatedAt fields

module.exports = mongoose.model('Book', bookSchema);