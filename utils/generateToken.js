const jwt = require('jsonwebtoken');

const createToken = id => {
  return jwt.sign({ userId: id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRE
  });
};
module.exports = createToken;
