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
    req.login(registeredUser, (err) => {
      if (err) return next(err);

      req.flash("success", `Welcome ${body.first}!`);
      res.redirect("/api/v1/dashboard");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/api/v1/auth/register");
  }
});

module.exports.renderLoginForm = (req, res) => {
  res.render("auth/login");
};

module.exports.loginUser = (req, res) => {
  req.flash("success", "Welcome back!");
  const redirect = req.session.returnTo || "/api/v1/dashboard";
  delete req.session.returnTo;
  res.redirect(redirect);
};

module.exports.logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "Goodbye");
    res.redirect("/");
  });
};
