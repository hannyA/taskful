const express = require("express");
const router = express.Router({ mergeParams: true });
const admin = require("../controllers/admins");

router.route("/").get(admin.users);
router.route("/users").get(admin.users).post(admin.newUser);
router.route("/users/new").get(admin.renderNewUserForm);
module.exports = router;
