const wrapAsync = require("../utils/wrapAsync");
const User = require("../models/user");

module.exports.renderRegisterForm = async (req, res) => {
  res.render("auth/register");
};

module.exports.registerUser = wrapAsync(async (req, res) => {
  const { password } = req.body;
  delete req.body.password;
  const body = { ...req.body, username: req.body.email };
  // console.log(req.body);
  // const { email, username, } = req.body;
  const user = new User(body);
  try {
    const registeredUser = await User.register(user, password);
    req.flash("success", `Welcome ${body.first}!`);
    res.redirect("/dashboard");
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
});

module.exports.renderLoginForm = async (req, res) => {
  res.render("auth/login");
};

module.exports.loginUser = wrapAsync(async (req, res) => {});
