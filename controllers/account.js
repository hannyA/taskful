const User = require("../models/user");

module.exports.getIndex = async (req, res) => {
  res.render("account/index", { navbar: "account", page: "index" });
};
module.exports.getSecurity = async (req, res) => {
  res.render("account/security", { navbar: "account", page: "security" });
};
module.exports.getProfile = async (req, res) => {
  res.render("account/profile", { navbar: "account", page: "profile" });
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
