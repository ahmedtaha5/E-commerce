const path = require('path');

const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const globalError = require('./Middlewares/errorMiddleware');
const AppError = require('./utils/appError');
const dbConnection = require('./Config/database');

// Routes
const mountRoutes = require('./routes/index');

dotenv.config({ path: 'config.env' });

// Connect to the database
dbConnection();

const app = express();

app.use(cookieParser());

// Middleware to parse JSON
app.use(express.json());
app.use(express.static(path.join(__dirname, 'uploads')));

mountRoutes(app);
// app.use('/api/v1/categories', categoryRoutes);
// app.use('/api/v1/subcategories', subCategoryRoutes);
// app.use('/api/v1/brands', brandRoutes);
// app.use('/api/v1/products', productRoutes);
// app.use('/api/v1/users', userRoutes);
// app.use('/api/v1/auth', authRoutes);
// app.use('/api/v1/reviews', reviewRoutes);
// app.use('/api/v1/wishlist', wishlistRoutes);
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
// Start the server
// Handle uncaught exceptions
process.on('uncaughtException', err => {
  console.error('Uncaught Exception Error:', `${err.name} | ${err.message}`);
  process.exit(1); // Exit immediately for stability.
});

// Start the server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`API is running on port: ${port}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', err => {
  console.error('Unhandled Rejection Error:', `${err.name} | ${err.message}`);
  server.close(() => {
    console.log('Server is closing down...');
    // Close database connections or clean up resources
    process.exit(1); // Exit with failure code.
  });
});
