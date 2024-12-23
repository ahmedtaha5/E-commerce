// const fs = require('fs');

// //require('colors');

// const dotenv = require('dotenv');
// const product = require('../../Models/productModel');
// const dbConnection = require('../../Config/database');

// dotenv.config({ path: 'config.env' });

// //connect to DB
// dbConnection();

// const products = JSON.parse(fs.readFileSync('./products.json'));

// const insertData = async () => {
//   try {
//     await product.create(products);
//     console.log('Products inserted successfully'.green.inverse);
//     process.exit();
//   } catch (error) {
//     console.log(error);
//   }
// };

// const destroyData = async () => {
//   try {
//     await product.deleteMany();
//     console.log('Products deleted successfully'.red.inverse);
//     process.exit();
//   } catch (error) {
//     console.log(error);
//   }
// };
// // node seeders.js -i
// // node seeders.js -d
// if (process.argv[2] === '-i') {
//   insertData();
// } else if (process.argv[2] === '-d') {
//   destroyData();
// }

const fs = require('fs');
//require('colors');
const dotenv = require('dotenv');
const Product = require('../../Models/productModel');
const dbConnection = require('../../Config/database');

dotenv.config({ path: '../../config.env' });

// connect to DB
dbConnection();

// Read data
const products = JSON.parse(fs.readFileSync('./products.json'));

// Insert data into DB
const insertData = async () => {
  try {
    await Product.create(products);

    console.log('Data Inserted');
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// Delete data from DB
const destroyData = async () => {
  try {
    await Product.deleteMany();
    console.log('Data Destroyed');
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// node seeder.js -d
if (process.argv[2] === '-i') {
  insertData();
} else if (process.argv[2] === '-d') {
  destroyData();
}
