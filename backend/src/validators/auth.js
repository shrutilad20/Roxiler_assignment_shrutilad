const Joi = require("joi");

exports.signupSchema = Joi.object({
  name: Joi.string().min(20).max(60).required(),
  email: Joi.string().email().required(),
  address: Joi.string().max(400),
  password: Joi.string().pattern(/^(?=.*[A-Z])(?=.*[@$!%*?&]).{8,16}$/).required(),
  
  // Allow role ONLY for admin creation
  role: Joi.string().valid("SYSTEM_ADMIN", "STORE_OWNER", "NORMAL_USER").optional()
});


exports.loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
