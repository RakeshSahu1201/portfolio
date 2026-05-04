// Pure function to create validation middleware using Zod schema
const createValidationMiddleware = (schema) => {
  return (req, res, next) => {
    try {
      const validated = schema.parse(req.body);
      req.validated = validated;
      next();
    } catch (error) {
      const fieldErrors = error.errors.reduce((acc, err) => {
        const path = err.path.join('.');
        acc[path] = err.message;
        return acc;
      }, {});

      res.status(400).json({ error: 'Validation failed', fields: fieldErrors });
    }
  };
};

module.exports = { createValidationMiddleware };
