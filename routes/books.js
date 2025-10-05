const express = require('express');
const bookController = require('../controllers/bookController');
const router = express.Router();

// GET /api/books - list books with optional search, filter, pagination
router.get('/', bookController.getBooks);

// GET /api/books/:id - get a single book by id
router.get('/:id', bookController.getBookById);

// POST /api/books - create a new book
router.post('/', bookController.addBook);

// PUT /api/books/:id - update an existing book
router.put('/:id', bookController.updateBook);

// DELETE /api/books/:id - remove a book
router.delete('/:id', bookController.deleteBook);

module.exports = router;