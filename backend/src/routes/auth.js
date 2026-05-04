const express = require('express');

// Pure function factory to create auth routes
const createAuthRoutes = (authController) => {
  const router = express.Router();

  router.post('/login', authController.login);
  router.post('/logout', authController.logout);

  return router;
};

module.exports = { createAuthRoutes };
