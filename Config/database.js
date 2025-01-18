const mongoose = require('mongoose');

mongoose.set('strictQuery', false); // or true
const dbConnection = () => {
  return mongoose
    .connect(process.env.DB)
    .then(() => {
      console.log('DB connected successfully');
    })
    .catch(err => {
      console.error(`database error: ${err}`);
      process.exit(1);
    });
};

module.exports = dbConnection;
