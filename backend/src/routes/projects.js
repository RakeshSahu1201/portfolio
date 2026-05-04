const express = require('express');

// Pure function factory to create project routes
const createProjectRoutes = (projectController, authMiddleware, validateMiddleware) => {
  const router = express.Router();

  // Public routes
  router.get('/', projectController.getAllProjects);
  router.get('/:id', projectController.getProjectById);

  // Protected admin routes
  router.post('/', authMiddleware, validateMiddleware, projectController.createProject);
  router.put('/:id', authMiddleware, validateMiddleware, projectController.updateProject);
  router.delete('/:id', authMiddleware, projectController.deleteProject);

  return router;
};

module.exports = { createProjectRoutes };
