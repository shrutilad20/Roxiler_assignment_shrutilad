exports.validate = (schema) => (req, res, next) => {
  if (!schema) {
    return res.status(500).json({ message: "Validation schema missing" });
  }

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      message: "Validation Failed",
      errors: error.details.map((e) => e.message),
    });
  }

  next();
};
