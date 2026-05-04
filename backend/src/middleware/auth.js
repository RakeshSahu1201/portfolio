const { verifyToken } = require('../utils/jwt');

// Pure function to create authentication middleware
const createAuthMiddleware = () => {
  return (req, res, next) => {
    try {
      const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

      if (!token) {
        return res.status(401).json({ error: 'Token required' });
      }

      const payload = verifyToken(token);
      if (!payload) {
        return res.status(401).json({ error: 'Invalid token' });
      }

      req.user = payload;
      next();
    } catch (error) {
      res.status(401).json({ error: 'Authentication failed' });
    }
  };
};

module.exports = { createAuthMiddleware };
