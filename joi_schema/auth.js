const Joi = require("joi");

module.exports.validateUserRegistrationSchema = Joi.object({
  "First name": Joi.string().required().min(2).max(30),
  "Last name": Joi.string().required().max(30),
  Company: Joi.string().required().max(30),
  Email: Joi.string().email().required(),
  Password: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .required()
    .min(6)
    .max(15),
  confirmpassword: Joi.ref("password"),
  role: Joi.array()
    .items(Joi.string().valid("User", "Technician", "Admin"))
    .required(),
}).required();
