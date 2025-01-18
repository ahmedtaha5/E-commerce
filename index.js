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
const categoryRoutes = require('./routes/categoryRoutes');
const subCategoryRoutes = require('./routes/subCategoryRoutes');
const brandRoutes = require('./routes/brandRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const couponsRoutes = require('./routes/couponsRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');

dotenv.config({ path: 'config.env' });

// Connect to the database
dbConnection();

const app = express();
// enable other domains to access your application
app.use(cors());
app.options('*', cors());
app.use(compression());

app.use(cookieParser());

// Middleware to parse JSON
app.use(express.json());
app.use(express.static(path.join(__dirname, 'uploads')));

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

// Global error handling middleware for express errors
app.use(globalError);

//Start the server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`API is running on port: ${port}`);
});

// Handle rejection outside express
process.on('unhandledRejection', err => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down....`);
    process.exit(1);
  });
});
