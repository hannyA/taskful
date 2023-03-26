const User = require("../models/user");

module.exports.getIndex = async (req, res) => {
  res.render("account/index", { navbar: "account", page: "index" });
};

module.exports.getProfile = async (req, res) => {
  res.render("account/profile", { navbar: "account", page: "profile" });
};

module.exports.renderEditProfile = async (req, res) => {
  res.render("account/editprofile", { navbar: "account", page: "profile" });
};
module.exports.submitProfileUpdate = async (req, res) => {
  const id = req.user.id;

  const user = await User.findByIdAndUpdate(req.user.id, {
    ...req.body,
  });

  res.redirect("/api/v1/account/profile");

  // res.render("account/profile", { navbar: "account", page: "profile" });
};

module.exports.getSecurity = async (req, res) => {
  res.render("account/security", { navbar: "account", page: "security" });
};
module.exports.updatePassword = async (req, res) => {
  console.log("req.user.id: ", req.user.id);
  const user = await User.findById(req.user.id);

  if (req.body.newPassword !== req.body.confirmNewPassword) {
    req.flash("error", "Password confirmation doesn't match the new password");
    res.redirect("/api/v1/account/security");
  }
  user.changePassword(req.body.oldPassword, req.body.newPassword);
  await user.save();

  req.flash("success", `Password changed successfully`);
  res.redirect("/api/v1/account/security");
  // res.render("account/security", { navbar: "account", page: "security" });
};

module.exports.renderSettingsForm = async (req, res) => {
  res.render("account/settings", { navbar: "account", page: "settings" });
};
module.exports.submitSettingsForm = async (req, res) => {
  // Update settings timezone in user account

  const user = await User.findByIdAndUpdate(req.user.id, {
    $set: { timezone: req.body.timezone * 60 },
  });
  res.redirect(`/api/v1/account`);
};
