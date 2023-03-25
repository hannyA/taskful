const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const APIFeatures = require("../utils/apiFeatures");

module.exports.getCompanyStaff = async (req, res) => {
  const user = await User.findById(req.user._id);
  req.query.company = user.company;
  req.query.deleted = false;

  // Get users from company
  const features = new APIFeatures(User.find(), req.query)
    .filter()
    .sort()
    .limitFields();

  const users = await features.query;
  return users;
};

module.exports.getCompanyTech = async (req, res) => {
  const user = await User.findById(req.user._id);
  req.query.company = user.company;
  req.query.deleted = false;
  req.query.role = ["Admin", "Technician"];

  // Get users from company
  const features = new APIFeatures(User.find(), req.query)
    .filter()
    .sort()
    .limitFields();

  const users = await features.query;
  return users;
};

module.exports.getCompanyUsers = async (req, res) => {
  const user = await User.findById(req.user._id);
  req.query.company = user.company;
  req.query.deleted = false;
  req.query.role = ["User"];

  // Get users from company
  const features = new APIFeatures(User.find(), req.query)
    .filter()
    .sort()
    .limitFields();

  const users = await features.query;
  return users;
};
