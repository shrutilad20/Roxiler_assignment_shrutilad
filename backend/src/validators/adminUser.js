const Joi = require("joi");

exports.createUserSchema = Joi.object({
  name: Joi.string().min(20).max(60).required(),
  email: Joi.string().email().required(),
  address: Joi.string().max(400).required(),
  password: Joi.string()
    .min(8)
    .max(16)
    .pattern(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/)
    .required(),
  role: Joi.string().valid("SYSTEM_ADMIN", "NORMAL_USER", "STORE_OWNER").required()
});
