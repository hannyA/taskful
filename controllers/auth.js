const User = require("../models/user");

module.exports.renderRegisterForm = async (req, res) => {
  res.render("auth/register");
};

module.exports.registerUser = async (req, res) => {
  try {
    const { password } = req.body;
    delete req.body.password;
    const body = { ...req.body, username: req.body.email };
    // console.log(req.body);
    // const { email, username, } = req.body;
    const user = new User(body);
    const registeredUser = await User.register(user, password);

    req.flash("success", `Welcome ${body.first}!`);
    // req.flash("success", "Welcome");
    res.redirect("/dashboard");
  } finally {
  }
  // catch() {

  // }
};
