module.exports.isLoggedIn = (req, res, next) => {
  console.log("Islogged in currrent user:", req.user);
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be signed in to view this page!");
    return res.redirect("/auth/login");
  }
  next();
};
