const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const { seedDB } = require("../seeds/app");
const { daysBeforeToday } = require("../seeds/utils");
const { validateUserRegistrationSchema } = require("../joi_schema/auth");

module.exports.demoize = async (req, res, next) => {
  // if (process.env.NODE_ENV === "development") {
  //   req.body.demo = "on";
  // }
  const { demo } = req.body;

  if (demo) {
    req.body.registerDate = daysBeforeToday(30);
  }
  next();
};

module.exports._isDemo = async (req, res, next) => {
  const { demo, company } = req.body;

  if (demo) {
    await seedDB(company, req.registeredUser);
    console.log("isDemo adminUser: ");
  }
  next();
};

module.exports.isDemo = async (req, res, next) => {
  const { demo } = req.body;

  if (demo) {
    const { company, first, last, role, email, password } = req.body;
    const adminUser = await seedDB(company, role, first, last, password, email);
    console.log("isDemo adminUser: ", adminUser);
    if (adminUser === null) {
      return next(new ExpressError("Email is already in use", 409));
    }
    try {
      req.login(adminUser, (err) => {
        if (err) return next(err);

        req.flash("success", `Welcome ${adminUser.first}!`);
        return res.redirect("/api/v1/dashboard");
      });
    } catch (e) {
      req.flash("error", e.message);
      return res.redirect("/api/v1/auth/register");
    }
  }
  next();
};

module.exports.isCompanyAdmin = async (req, res, next) => {
  const user = await User.findById(req.user._id);

  const { company } = req.body;

  if (req.user.role != "Admin") {
    // if (user.role !== "Admin") {
    // req.flash("error", "You are not authorized to view this page");

    // return next(
    //   new ExpressError(`You are not authorized to view this page`, 403)
    // );

    // res.render('index', { messages: req.flash('info') });

    // return res.status(403).json({
    //   message: "You are not authorized to view this page",
    // });
    return res.redirect(`/api/v1/projects/${projectId}/error`);
  }
  next();
};

module.exports.validateUserRegistration = (req, res, next) => {
  console.log("validateUserRegistration");

  const body = {
    ...req.body,
    "First name": req.body.firstname,
    "Last name": req.body.lastname,
    "Confirmed password": req.body.Confirmpassword,
  };

  delete body.firstname;
  delete body.lastname;
  delete body.Confirmpassword;
  delete body.demo;

  const { error } = validateUserRegistrationSchema.validate(body);

  if (error) {
    const msg = error.details.map((el) => el.message).join(".");

    delete req.body.password;
    delete req.body.confirmpassword;

    req.session.body = req.body;
    console.log("============ validateUserRegistration req.body: ", req.body);

    req.flash("error", msg);
    return res.redirect("/api/v1/auth/register");

    // next(new ExpressError(msg, 400, "none", req.body));
  } else {
    console.log("============ validateUserRegistrationgo to next");
    next();
  }
};
