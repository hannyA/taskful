const express = require("express");
const router = express.Router();
const user = require("../models/user");
const auth = require("../controllers/auth");

router.route("/").get(auth.renderRegisterForm).post(auth.registerUser);

module.exports = router;
