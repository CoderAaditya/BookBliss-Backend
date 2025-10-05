const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const Book = require('./models/Book');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const bookRoutes = require('./routes/books');
const cartRoutes = require('./routes/cart');

const app = express();
const PORT = process.env.PORT || 5000;

// Basic security, logging, and parsing middleware
app.use(helmet()); // sets various HTTP headers for security
app.use(morgan('combined')); // HTTP request logging
app.use(cors({
  origin: '*', 
  methods: '*',
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
})); 
app.use(express.json()); // parse JSON request bodies

// Connect to MongoDB using MONGO_URI_LIVE from environment to connect to live database else for localhost use MONGO_URI
mongoose.connect(process.env.MONGO_URI_LIVE)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Auto-seed books on startup if collection is empty. This helps local development.
mongoose.connection.once('open', async () => {
  try {
    const count = await Book.countDocuments();
    if (count === 0) {
      console.log('No books found — seeding sample books...');
      const sampleBooks = [];
      for (let i = 1; i <= 20; i++) {
        // Simple category selection based on index
        const category = i % 3 === 0 ? 'Sci-Fi' : i % 2 === 0 ? 'Non-Fiction' : 'Fiction';
        const categoryImage = category === 'Sci-Fi' ? '/images/SciFi.jpg' : category === 'Non-Fiction' ? '/images/NonFiction.jpg' : '/images/Fiction.jpg';
        sampleBooks.push({
          title: `Sample Book ${i}`,
          author: `Author ${Math.ceil(i/2)}`,
          category,
          description: `This is a sample description for Sample Book ${i}.`,
          price: Number((Math.random() * 50 + 5).toFixed(2)),
          image: categoryImage
        });
      }
      await Book.insertMany(sampleBooks);
      console.log('Inserted 20 sample books');
    } else {
      console.log(`Books collection already has ${count} documents — skipping seeding.`);
    }
  } catch (err) {
    console.error('Error during auto-seed:', err.message);
  }
});

// Mount API route groups
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/cart', cartRoutes);

// Start HTTP server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));