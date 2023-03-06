const wrapAsync = require("../utils/wrapAsync");
const User = require("../models/user");

module.exports.addCompany = wrapAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  req.body.company = user.company;
  next();
});

module.exports.addUsername = wrapAsync(async (req, res, next) => {
  req.body.username = req.body.email;
  next();
});
