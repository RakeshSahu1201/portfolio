const createAboutController = (aboutService) => {
  const getAbout = async (req, res, next) => {
    try {
      const about = await aboutService.get();
      res.json(about || {});
    } catch (error) {
      next(error);
    }
  };

  const updateAbout = async (req, res, next) => {
    try {
      const about = await aboutService.update(req.validated || req.body);
      res.json(about);
    } catch (error) {
      next(error);
    }
  };

  return { getAbout, updateAbout };
};

module.exports = { createAboutController };
