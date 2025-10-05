const Cart = require("../models/Cart");
const httpCodes = require("../constants/httpCodes");

// Return the cart for the authenticated user. If no cart exists, return an empty items array.
exports.getCart = async (req, res) => {
  try {
    // Find the cart belonging to the logged-in user and populate book references
    const cart = await Cart.findOne({ user: req.user.id }).populate("items.book");
    // If no cart found, return a default shape ({ items: [] }) instead of null
    res.status(httpCodes.OK).json(cart || { items: [] });
  } catch (err) {
    // On error, send a generic server error response
    res.status(httpCodes.INTERNAL_SERVER_ERROR).json({ message: "Server error" });
  }
};

// Add a book to the user's cart or increase quantity if it already exists
exports.addToCart = async (req, res) => {
  const { bookId, quantity = 1 } = req.body; // default quantity is 1
  try {
    // Try to load the user's cart
    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) {
      // If no cart exists yet, create an empty cart for the user
      cart = new Cart({ user: req.user.id, items: [] });
    }

    // Check if the book is already in the cart
    const itemIndex = cart.items.findIndex((item) => item.book.toString() === bookId);
    if (itemIndex > -1) {
      // If present, increment the quantity
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Otherwise, push a new item with the requested quantity
      cart.items.push({ book: bookId, quantity });
    }

    // Save changes and return updated cart
    await cart.save();
    res.status(httpCodes.OK).json(cart);
  } catch (err) {
    res.status(httpCodes.INTERNAL_SERVER_ERROR).json({ message: "Server error" });
  }
};

// Update quantity for an existing item in the cart
exports.updateCartItem = async (req, res) => {
  const { bookId, quantity } = req.body;
  try {
    // Load user's cart
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(httpCodes.NOT_FOUND).json({ message: "Cart not found" });

    // Find the item inside the cart array
    const item = cart.items.find((item) => item.book.toString() === bookId);
    if (!item) return res.status(httpCodes.NOT_FOUND).json({ message: "Item not found" });

    // Replace quantity and persist
    item.quantity = quantity;
    await cart.save();
    res.status(httpCodes.OK).json(cart);
  } catch (err) {
    console.log(err);
    res.status(httpCodes.INTERNAL_SERVER_ERROR).json({ message: "Server error" });
  }
};

// Remove an item from the user's cart by book id route parameter
exports.removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(httpCodes.NOT_FOUND).json({ message: "Cart not found" });

    // Keep only items whose book id does not match the param
    cart.items = cart.items.filter((item) => item.book.toString() !== req.params.bookId);
    await cart.save();
    res.status(httpCodes.OK).json(cart);
  } catch (err) {
    res.status(httpCodes.INTERNAL_SERVER_ERROR).json({ message: "Server error" });
  }
};
