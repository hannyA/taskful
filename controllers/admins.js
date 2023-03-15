const Project = require("../models/project");
const Issue = require("../models/issue");
const User = require("../models/user");
const { getCompanyUsers } = require("./util");

module.exports.users = async (req, res) => {
  const users = await getCompanyUsers(req, res);
  const page = "users";
  res.render("admin/users/index2", { users, page, navbar: "admin" });
};

module.exports.renderNewUserForm = async (req, res) => {
  const page = "new";
  res.render("admin/users/new", { page, navbar: "admin" });
};

module.exports.newUser = async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.redirect("/api/v1/admin/users");
  // res.render("admin/users", { user, page });
};

module.exports.renderEditUserForm = async (req, res) => {
  console.log("req.query: ", req.query);
  const { id } = req.query;

  const user = await User.findById(id);
  const page = "edit";
  res.render("admin/users/edit", { user, page, navbar: "admin" });
};

module.exports.editUser = async (req, res) => {
  const { id } = req.body;
  delete req.body.id;

  const user = await User.findByIdAndUpdate(id, {
    ...req.body,
  });

  res.redirect("/api/v1/admin/users");

  // res.render("admin/users/edit", { user, page, navbar: "admin" });
};

module.exports.deleteUsers = async (req, res) => {
  try {
    console.log("admin deleteUsers");
    const { users } = req.body;
    console.log("users: ", users);
    console.log("users body: ", req.body);
    console.log("user company: ", req.user.company);

    for (let id of users) {
      console.log("id: ", id);
      await User.findOneAndUpdate(
        {
          _id: id,
          company: req.user.company,
        },
        { $set: { deleted: true } }
      );
    }
    return res.redirect("/api/v1/admin/users");

    // company !== user.company ||
    // await User.deleteMany({ _id: { $in: users } });

    // res.status(200).json({
    //   message: "Users deleted!",
    // });
  } catch (e) {
    // return res.redirect("/api/v1/admin/users");
    req.flash("error", "You are not authorized to view this page");
    return res.render("templates/errors/signedin-error-template");

    // return res
    //   .status(403)
    //   .json({ message: "You are not authorized to view this page" });
  }
};
