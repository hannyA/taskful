const User = require("../models/user");

module.exports.renderSettingsForm = async (req, res) => {
  res.render("account/settings", { navbar: "account" });
};

module.exports.submitSettingsForm = async (req, res) => {
  // Update settings timezone in user account

  const user = await User.findByIdAndUpdate(req.user.id, {
    $set: { timezone: req.body.timezone * 60 },
  });
  res.redirect(`/api/v1/settings`);
};
