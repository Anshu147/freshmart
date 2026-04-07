require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { seedData } = require('./controllers/seedController');
const {
  createDiscount, getDiscounts, updateDiscount, deleteDiscount, applyDiscount,
} = require('./controllers/discountController');
const { auth, adminOnly } = require('./middleware/auth');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to DB
connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/chat', require('./routes/chat'));

// Discount routes
app.post('/api/discounts/apply', applyDiscount);
app.get('/api/discounts', auth, adminOnly, getDiscounts);
app.post('/api/discounts', auth, adminOnly, createDiscount);
app.put('/api/discounts/:id', auth, adminOnly, updateDiscount);
app.delete('/api/discounts/:id', auth, adminOnly, deleteDiscount);

// Seed route
app.post('/api/seed', seedData);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
