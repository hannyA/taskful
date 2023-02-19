const express = require("express");
const router = express.Router();
const user = require("../models/user");
const auth = require("../controllers/auth");
const passport = require("passport");
const { isLoggedIn } = require("../utils/middleware");

router.route("/register").get(auth.renderRegisterForm).post(auth.registerUser);
router
  .route("/login")
  .get(auth.renderLoginForm)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/api/v1/auth/login",
    }),
    auth.loginUser
  );

router.get("/logout", auth.logout);

module.exports = router;
