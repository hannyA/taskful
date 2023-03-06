const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");

module.exports.isCompanyAdmin = async (req, res, next) => {
  const user = await User.findById(req.user._id);

  const { company } = req.body;

  console.log("company:", company);
  console.log("user.company:", user.company);
  if (req.user.role !== "Admin") {
    // if (user.role !== "Admin") {
    // req.flash("error", "You are not authorized to view this page");

    // return next(
    //   new ExpressError(`You are not authorized to view this page`, 403)
    // );

    // res.render('index', { messages: req.flash('info') });

    return res.status(403).json({
      message: "You are not authorized to view this page",
    });
    // return res.redirect(`/api/v1/projects/${projectId}/error`);
  }
  next();
};
