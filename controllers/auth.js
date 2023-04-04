const wrapAsync = require("../utils/wrapAsync");
const User = require("../models/user");
const Project = require("../models/project");

module.exports.renderRegisterForm = async (req, res) => {
  // Redirect uesr to dashboard if they hit backbutton
  if (res.locals.currentUser) {
    console.log("Return to dashboard");
    return res.redirect("/api/v1/dashboard");
  }
  let { body } = req.session;
  delete req.session.body;
  if (body === undefined) {
    body = { firstname: "", lastname: "", Email: "", Company: "", demo: "" };
  }

  res.render("auth/register", { navbar: "account", body });
};

module.exports._registerUser = wrapAsync(async (req, res, next) => {
  const start = Date.now();

  const password = req.body.Password;
  // delete req.body.password;
  console.log(" _registerUser body: ", req.body);

  const body = {
    username: req.body.Email,
    company: req.body.Company,
    email: req.body.Email,
    first: req.body.firstname,
    last: req.body.lastname,
    role: req.body.Role,
  };
  const user = new User(body);

  let markPoint = Date.now();
  console.log(
    "_registerUser new user took ",
    (markPoint - start) / 1000,
    " seconds"
  );

  try {
    const registeredUser = await User.register(user, password);

    req.registeredUser = registeredUser;
    markPoint = Date.now();
    console.log(
      "_registerUser - Register user took ",
      (markPoint - start) / 1000,
      " seconds"
    );

    next();
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/api/v1/auth/register");
  }
});

module.exports._loginUser = wrapAsync(async (req, res) => {
  try {
    const { registeredUser } = req;
    console.log("auth registerUser: ", registeredUser);

    req.login(registeredUser, (err) => {
      if (err) return next(err);

      req.flash("success", `Welcome ${registeredUser.first}!`);
      res.redirect("/api/v1/dashboard");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/api/v1/auth/register");
  }
});

module.exports.registerUser = wrapAsync(async (req, res) => {
  const { password } = req.body;
  delete req.body.password;
  const body = { ...req.body, username: req.body.email };
  // console.log(req.body);
  // const { email, username, } = req.body;
  const user = new User(body);
  try {
    const registeredUser = await User.register(user, password);
    console.log("auth registerUser: ", registerUser);

    req.login(registeredUser, (err) => {
      if (err) return next(err);

      req.flash("success", `Welcome ${registeredUser.first}!`);
      res.redirect("/api/v1/dashboard");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/api/v1/auth/register");
  }
});

module.exports.renderLoginForm = (req, res) => {
  res.render("auth/login", { navbar: "account" });
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

/**
 * req.query  => url query string
 * req.body   => http body
 * req.params => url path
 */

// module.exports.canViewProjects = wrapAsync(async (req, res, next) => {
//   const user = await User.findById(req.user._id);

//   if (req.query.company && !req.query.company.equals(user.company)) {
//     req.flash("error", "You are not authorized to view this page");
//     return res.render("templates/errors/signedin-error-template");
//   } else if (req.params.company && !req.params.company.equals(user.company)) {
//     req.flash("error", "You are not authorized to view this page");
//     return res.render("templates/errors/signedin-error-template");
//   }

//   // req.body.company = user.company;
//   req.query.company = user.company;
//   req.params.company = user.company;
//   next();
// });

// 64038a76601f262f2f00f08f

module.exports.canViewProject = wrapAsync(async (req, res, next) => {
  const { projectId } = req.params;

  const user = await User.findById(req.user._id);
  const project = await Project.findById(projectId);

  if (project.company !== user.company) {
    req.flash("error", "You are not authorized to view this page");
    // const statusCode = 403;
    // const message = "Page not found";
    // console.log("message: ", message);
    return res.redirect(`/api/v1/projects/${projectId}/error`);
  }
  next();
});

module.exports.canEditProject = wrapAsync(async (req, res, next) => {
  console.log("canEditProject:", req.params);
  const { projectId } = req.params;

  const user = await User.findById(req.user._id);
  const project = await Project.findById(projectId).populate("owner");

  if (
    project.company !== user.company ||
    (user.role !== "Admin" &&
      user.role !== "Technician" &&
      !project.owner.equals(user))
  ) {
    req.flash("error", "You are not authorized to view this page");
    // const statusCode = 403;
    // const message = "Page not found";
    // console.log("message: ", message);
    return res.redirect(`/api/v1/projects/${projectId}/error`);
  }

  // if (project.company !== user.company) {
  //   req.flash("error", "You are not authorized to view this page");
  //   // const statusCode = 403;
  //   // const message = "Page not found";
  //   // console.log("message: ", message);
  //   return res.redirect(`/api/v1/projects/${projectId}/error`);
  // }
  next();
});

module.exports.isAuthorized = wrapAsync(async (req, res, next) => {
  const user = await User.findById(req.user._id);

  if (req.query.company && !req.query.company.equals(user.company)) {
    req.flash("error", "You are not authorized to view this page");
    return res.render("templates/errors/signedin-error-template");
  }
  //  if (req.params.company && !req.params.company.equals(user.company)) {
  //   req.flash("error", "You are not authorized to view this page");
  //   return res.redirect("templates/errors/signedin-error-template");
  // }

  // req.body.company = user.company;
  req.query.company = user.company;
  // req.params.company = user.company;
  next();
});
