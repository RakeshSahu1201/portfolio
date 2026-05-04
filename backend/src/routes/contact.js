const express = require('express');

// Pure function factory to create contact routes
const createContactRoutes = (contactController, validateMiddleware, authMiddleware) => {
  const router = express.Router();

  // Public route (with rate limiting applied globally)
  router.post('/', validateMiddleware, contactController.createMessage);

  // Protected admin routes
  router.get('/', authMiddleware, contactController.getAllMessages);
  router.get('/:id', authMiddleware, contactController.getMessageById);
  router.patch('/:id/read', authMiddleware, contactController.markMessageAsRead);
  router.delete('/:id', authMiddleware, contactController.deleteMessage);

  return router;
};

module.exports = { createContactRoutes };
