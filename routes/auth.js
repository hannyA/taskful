const express = require("express");
const router = express.Router();
const user = require("../models/user");
const auth = require("../controllers/auth");
const passport = require("passport");

router.route("/register").get(auth.renderRegisterForm).post(auth.registerUser);
router
  .route("/login")
  .get(auth.renderLoginForm)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/auth/login",
    }),
    auth.loginUser
  );

module.exports = router;
