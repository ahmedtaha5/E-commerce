//Routes
const categoryRoutes = require('./categoryRoutes');
const subCategoryRoutes = require('./subCategoryRoutes');
const brandRoutes = require('./brandRoutes');
const productRoutes = require('./productRoutes');
const userRoutes = require('./userRoutes');
const authRoutes = require('./authRoutes');
const reviewRoutes = require('./reviewRoutes');
const wishlistRoutes = require('./wishlistRoutes');
const couponRoutes = require('./couponsRoutes');
const cartRoutes = require('./cartRoutes');
const orderRoutes = require('./orderRoutes');

const mountRoutes = app => {
  app.use('/api/v1/categories', categoryRoutes);
  app.use('/api/v1/subcategories', subCategoryRoutes);
  app.use('/api/v1/brands', brandRoutes);
  app.use('/api/v1/products', productRoutes);
  app.use('/api/v1/users', userRoutes);
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/reviews', reviewRoutes);
  app.use('/api/v1/wishlist', wishlistRoutes);
  app.use('/api/v1/coupons', couponRoutes);
  app.use('/api/v1/cart', cartRoutes);
  app.use('/api/v1/order', orderRoutes);
};
module.exports = mountRoutes;
