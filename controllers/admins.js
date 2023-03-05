const Project = require("../models/project");
const Issue = require("../models/issue");
const User = require("../models/user");
const { getCompanyUsers } = require("./util");

module.exports.users = async (req, res) => {
  const users = await getCompanyUsers(req, res);
  const page = "users";
  res.render("admin/users/index", { users, page });
};

module.exports.renderNewUserForm = async (req, res) => {
  const page = "new";
  res.render("admin/users/new", { page });
};

module.exports.newUser = async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.redirect("/api/v1/admin/users");

  // res.render("admin/users", { user, page });
};
