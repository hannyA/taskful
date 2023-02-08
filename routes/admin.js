const express = require("express");
const router = express.Router({ mergeParams: true });
const admin = require("../controllers/admins");
const { isLoggedIn } = require("../utils/middleware");

router.route("/").get(isLoggedIn, admin.users);
router
  .route("/users")
  .get(isLoggedIn, admin.users)
  .post(isLoggedIn, admin.newUser);
router.route("/users/new").get(isLoggedIn, admin.renderNewUserForm);
module.exports = router;
