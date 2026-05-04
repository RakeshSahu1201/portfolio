const createProjectController = (projectService) => {
  const getAllProjects = async (req, res, next) => {
    try {
      const projects = await projectService.getAll();
      res.json(projects);
    } catch (error) {
      next(error);
    }
  };

  const getProjectById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const project = await projectService.getById(id);
      if (!project) return res.status(404).json({ error: 'Project not found' });
      res.json(project);
    } catch (error) {
      next(error);
    }
  };

  const createProject = async (req, res, next) => {
    try {
      const project = await projectService.create(req.validated || req.body);
      res.status(201).json(project);
    } catch (error) {
      next(error);
    }
  };

  const updateProject = async (req, res, next) => {
    try {
      const { id } = req.params;
      const project = await projectService.update(id, req.validated || req.body);
      res.json(project);
    } catch (error) {
      next(error);
    }
  };

  const deleteProject = async (req, res, next) => {
    try {
      const { id } = req.params;
      await projectService.remove(id);
      res.json({ message: 'Project deleted' });
    } catch (error) {
      next(error);
    }
  };

  return {
    getAllProjects,
    getProjectById,
    createProject,
    updateProject,
    deleteProject,
  };
};

module.exports = { createProjectController };
