const createExperienceController = (experienceService) => {
  const getAllExperience = async (req, res, next) => {
    try {
      const experience = await experienceService.getAll();
      res.json(experience);
    } catch (error) {
      next(error);
    }
  };

  const getExperienceById = async (req, res, next) => {
    try {
      const { id } = req.params;
      const experience = await experienceService.getById(id);
      if (!experience) return res.status(404).json({ error: 'Experience not found' });
      res.json(experience);
    } catch (error) {
      next(error);
    }
  };

  const createExperience = async (req, res, next) => {
    try {
      const experience = await experienceService.create(req.validated || req.body);
      res.status(201).json(experience);
    } catch (error) {
      next(error);
    }
  };

  const updateExperience = async (req, res, next) => {
    try {
      const { id } = req.params;
      const experience = await experienceService.update(id, req.validated || req.body);
      res.json(experience);
    } catch (error) {
      next(error);
    }
  };

  const deleteExperience = async (req, res, next) => {
    try {
      const { id } = req.params;
      await experienceService.remove(id);
      res.json({ message: 'Experience deleted' });
    } catch (error) {
      next(error);
    }
  };

  return {
    getAllExperience,
    getExperienceById,
    createExperience,
    updateExperience,
    deleteExperience,
  };
};

module.exports = { createExperienceController };
