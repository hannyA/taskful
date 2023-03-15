const wrapAsync = require("../utils/wrapAsync");

module.exports.isLoggedIn = (req, res, next) => {
  console.log("Islogged in currrent user:", req.user);
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in to view this page!");
    return res.redirect("/api/v1/auth/login");
  }
  next();
};

module.exports.isAdmin = async (req, res, next) => {
  // const user = await User.findById(req.user._id);
  console.log("is admin: ", req.user.role);

  if (req.user.role !== "Admin") {
    // if (user.role !== "Admin") {
    req.flash("error", "You are not authorized to view this page");

    return res.redirect(`/api/v1/projects/${projectId}/error`);
  }
  next();
};
