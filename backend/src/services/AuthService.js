const bcryptjs = require('bcryptjs');
const { generateToken, verifyToken } = require('../utils/jwt');

// Pure function factory to create Auth service
const createAuthService = () => {
  // Pure function to hash password
  const hashPassword = async (password) => bcryptjs.hash(password, 10);

  // Pure function to compare passwords
  const comparePasswords = async (plain, hashed) => bcryptjs.compare(plain, hashed);

  // Pure function to validate credentials (immutable, no side effects)
  const validateCredentials = async (email, password) => {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    const isEmailValid = email === adminEmail;
    const isPasswordValid = await comparePasswords(password, adminPassword);

    return isEmailValid && isPasswordValid;
  };

  // Pure function to create session token
  const createSession = (email) => {
    const token = generateToken({ email, role: 'admin' });
    return { token, expiresIn: '7d' };
  };

  // Pure function to verify session
  const verifySession = (token) => {
    const payload = verifyToken(token);
    return payload ? { valid: true, payload } : { valid: false, payload: null };
  };

  return {
    hashPassword,
    comparePasswords,
    validateCredentials,
    createSession,
    verifySession,
  };
};

module.exports = { createAuthService };
