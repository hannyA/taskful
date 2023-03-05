const express = require("express");
const router = express.Router({ mergeParams: true });
const admin = require("../controllers/admins");
const { isLoggedIn, isAdmin } = require("../utils/middleware");

router.route("/").get(isLoggedIn, admin.users);
router
  .route("/users")
  .get(isLoggedIn, isAdmin, admin.users)
  .post(isLoggedIn, isAdmin, admin.newUser);

router.route("/users/new").get(isLoggedIn, isAdmin, admin.renderNewUserForm);

module.exports = router;
