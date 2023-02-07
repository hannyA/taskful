const express = require("express");
const router = express.Router();
const user = require("../models/user");
const auth = require("../controllers/auth");

router.route("/register").get(auth.renderRegisterForm).post(auth.registerUser);
router.route("/login").get(auth.renderLoginForm).post(auth.loginUser);

module.exports = router;
