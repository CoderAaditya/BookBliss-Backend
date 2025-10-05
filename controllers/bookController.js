const Book = require('../models/Book');
const HTTP = require('../constants/httpCodes');

// Get all books (with search, filter, pagination)
// Fetch a paginated list of books, optionally filtered by search, category, or author
const getBooks = async (req, res) => {
  try {
    // Extract query params (search string, category, author, page number, items per page)
    const { search, category, author, page = 1, limit = 10 } = req.query;

    // Build a MongoDB query object based on provided filters
    const query = {};
    if (search) query.title = { $regex: search, $options: 'i' }; // case-insensitive title match
    if (category) query.category = category; // exact category match
    if (author) query.author = { $regex: author, $options: 'i' }; // case-insensitive author match

    // Execute DB query with pagination and sorting (newest first)
    const books = await Book.find(query)
      .limit(limit * 1) // ensure numeric limit
      .skip((page - 1) * limit) // offset for pagination
      .sort({ createdAt: -1 }); // newest entries first

    // Count total documents for pagination metadata
    const total = await Book.countDocuments(query);

    // Return books with pagination info
    res.status(HTTP.OK).json({ books, totalPages: Math.ceil(total / limit), currentPage: page });
  } catch (err) {
    // On error, respond with 500 and error message
    res.status(HTTP.INTERNAL_SERVER_ERROR).json({ msg: err.message });
  }
};

// Get book by ID
// Retrieve a single book document by its MongoDB _id
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id); // look up by route param :id
    if (!book) return res.status(HTTP.NOT_FOUND).json({ msg: 'Book not found' }); // 404 if absent
    res.status(HTTP.OK).json(book); // return found book
  } catch (err) {
    // If invalid id format or other DB error, return 500
    res.status(HTTP.INTERNAL_SERVER_ERROR).json({ msg: err.message });
  }
};

// Add a new book
// Create a new book document using request body data
const addBook = async (req, res) => {
  try {
    const book = new Book(req.body); // construct model from body (assumes validation elsewhere)
    await book.save(); // persist to DB
    res.status(HTTP.CREATED).json(book); // respond with created book (201)
  } catch (err) {
    // Return server error on failure
    res.status(HTTP.INTERNAL_SERVER_ERROR).json({ msg: err.message });
  }
};

// Update a book
// Update an existing book by id with the request body; return the updated document
const updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true }); // { new: true } returns updated doc
    if (!book) return res.status(HTTP.NOT_FOUND).json({ msg: 'Book not found' });
    res.status(HTTP.OK).json(book);
  } catch (err) {
    res.status(HTTP.INTERNAL_SERVER_ERROR).json({ msg: err.message });
  }
};

// Delete a book
// Delete a book document by id
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id); // removes document
    if (!book) return res.status(HTTP.NOT_FOUND).json({ msg: 'Book not found' });
    res.status(HTTP.OK).json({ msg: 'Book deleted' });
  } catch (err) {
    res.status(HTTP.INTERNAL_SERVER_ERROR).json({ msg: err.message });
  }
};

module.exports = {
  getBooks,
  getBookById,
  addBook,
  updateBook,
  deleteBook
};