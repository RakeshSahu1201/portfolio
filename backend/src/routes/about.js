const express = require('express');

// Pure function factory to create about routes
const createAboutRoutes = (aboutController, authMiddleware, validateMiddleware) => {
  const router = express.Router();

  router.get('/', aboutController.getAbout);
  router.put('/', authMiddleware, validateMiddleware, aboutController.updateAbout);

  return router;
};

module.exports = { createAboutRoutes };
