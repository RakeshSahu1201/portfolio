const jwt = require('jsonwebtoken');

// Pure function to generate token with immutable payload
const generateToken = (payload, expiresIn = process.env.JWT_EXPIRE || '7d') => {
  const tokenPayload = Object.freeze({ ...payload });
  return jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn });
};

// Pure function to verify token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Pure function to decode token without verification
const decodeToken = (token) => {
  try {
    return jwt.decode(token);
  } catch {
    return null;
  }
};

module.exports = { generateToken, verifyToken, decodeToken };
