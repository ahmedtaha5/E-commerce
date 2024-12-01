const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const dbConnection = require('./Config/database');
const categoryRoutes = require('./Routes/categoryRoutes');

dotenv.config({ path: 'config.env' });
//connect DB
dbConnection();
const app = express();
app.use(express.json());
app.use('/api/v1/categories', categoryRoutes);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log(`mode: ${process.env.NODE_ENV}`);
}
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`api is running on port:${port}`);
});
