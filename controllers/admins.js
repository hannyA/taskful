const Project = require("../models/project");
const Issue = require("../models/issue");
const User = require("../models/user");

module.exports.users = async (req, res) => {
  const users = await User.find({});
  const page = "users";
  res.render("admin/users/index", { users, page });
};

module.exports.renderNewUserForm = async (req, res) => {
  const page = "new";
  res.render("admin/users/new", { page });
};

module.exports.newUser = async (req, res) => {
  const user = new User(req.body.ticket);
  await user.save();
  res.redirect("/admin/users");

  // res.render("admin/users", { user, page });
};
