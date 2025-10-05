const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const auth = require('../middleware/auth');

// All cart routes require authentication via the `auth` middleware

// GET /api/cart - return the current user's cart
router.get('/', auth, cartController.getCart);

// POST /api/cart/add - add a book to cart or increase its quantity
router.post('/add', auth, cartController.addToCart);

// PUT /api/cart/update - set a specific cart item's quantity
router.put('/update', auth, cartController.updateCartItem);

// DELETE /api/cart/remove/:bookId - remove an item by book id
router.delete('/remove/:bookId', auth, cartController.removeFromCart);

module.exports = router;
