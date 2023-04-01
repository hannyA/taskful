const Joi = require("joi");

module.exports.validateUserRegistrationSchema = Joi.object({
  first: Joi.string().required().min(2),
  last: Joi.string().required(),
  company: Joi.string().required(),
  password: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .required()
    .min(6)
    .max(10),
  confirmpassword: Joi.ref("password"),
  role: Joi.array()
    .items(Joi.string().valid("User", "Technician", "Admin"))
    .required(),
  email: Joi.string().email().required(),
}).required();
