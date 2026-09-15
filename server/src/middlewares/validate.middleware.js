export const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (error) {
    const formattedErrors = error.errors.map((err) => ({
      field: err.path.slice(1).join('.'),
      message: err.message,
    }));
    return res.status(400).json({
      success: false,
      message: 'Invalid input data!',
      errors: formattedErrors,
    });
  }
};