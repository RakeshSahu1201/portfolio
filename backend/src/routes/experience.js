const express = require('express');

// Pure function factory to create experience routes
const createExperienceRoutes = (experienceController, authMiddleware, validateMiddleware) => {
  const router = express.Router();

  router.get('/', experienceController.getAllExperience);
  router.get('/:id', experienceController.getExperienceById);

  router.post('/', authMiddleware, validateMiddleware, experienceController.createExperience);
  router.put('/:id', authMiddleware, validateMiddleware, experienceController.updateExperience);
  router.delete('/:id', authMiddleware, experienceController.deleteExperience);

  return router;
};

module.exports = { createExperienceRoutes };
