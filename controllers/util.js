const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const APIFeatures = require("../utils/apiFeatures");

module.exports.getCompanyUsers = async (req, res) => {
  console.log("getCompanyUsers 1 called: ");
  const user = await User.findById(req.user._id);
  req.query.company = user.company;
  req.query.deleted = false;

  console.log("getCompanyUsers called: ", user);

  // Get users from company
  const features = new APIFeatures(User.find(), req.query)
    .filter()
    .sort()
    .limitFields();

  const users = await features.query;
  return users;
};

module.exports.getCompanyTech = async (req, res) => {
  console.log("getCompanyUsers 1 called: ");
  const user = await User.findById(req.user._id);
  req.query.company = user.company;
  req.query.deleted = false;
  req.query.role = ["Admin", "Technician"];

  console.log("getCompanyUsers called: ", user);

  // Get users from company
  const features = new APIFeatures(User.find(), req.query)
    .filter()
    .sort()
    .limitFields();

  const users = await features.query;
  return users;
};
