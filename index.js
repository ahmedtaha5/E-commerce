const path = require('path');
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const globalError = require('./middlewares/errorMiddleware');
const AppError = require('./utils/appError');
const dbConnection = require('./Config/database');

// Routes
const subCategoryRoutes = require('./routesss/subCategoryRoutes');
const categoryRoutes = require('./routesss/categoryRoutes');
const brandRoutes = require('./routesss/brandRoutes');
const productRoutes = require('./routesss/productRoutes');
const userRoutes = require('./routesss/userRoutes');
const authRoutes = require('./routesss/authRoutes');
const reviewRoutes = require('./routesss/reviewRoutes');
const wishlistRoutes = require('./routesss/wishlistRoutes');
const couponsRoutes = require('./routesss/couponsRoutes');
const cartRoutes = require('./routesss/cartRoutes');
const orderRoutes = require('./routesss/orderRoutes');

// Load environment variables
dotenv.config({ path: 'config.env' });

// Connect to the database
dbConnection().catch(err => {
  console.error('Database connection failed:', err);
  process.exit(1);
});

const app = express();

// Enable CORS
app.use(cors());
app.options('*', cors());

// Compression middleware
app.use(compression());

// Cookie parser middleware
app.use(cookieParser());

// Middleware to parse JSON
app.use(express.json());

// Serve static files
app.use(express.static(path.join(__dirname, 'uploads')));

// Mount routes
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/subcategories', subCategoryRoutes);
app.use('/api/v1/brands', brandRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/wishlist', wishlistRoutes);
app.use('/api/v1/coupons', couponsRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/order', orderRoutes);

// Handle undefined routes
app.all('*', (req, res, next) => {
  return next(new AppError(`Cannot find this route: ${req.originalUrl}`, 404));
});

// Development mode logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log(`Mode: ${process.env.NODE_ENV}`);
}

// Global error handling middleware
app.use(globalError);

// Start the server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`API is running on port: ${port}`);
});

// Handle uncaught exceptions
process.on('uncaughtException', err => {
  console.error('Uncaught Exception Error:', `${err.name} | ${err.message}`);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', err => {
  console.error('Unhandled Rejection Error:', `${err.name} | ${err.message}`);
  server.close(() => {
    console.error('Shutting down....');
    process.exit(1);
  });
});
