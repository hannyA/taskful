const express = require("express");
const router = express.Router();
const user = require("../models/user");
const account = require("../controllers/account");

router.route("/").get(account.getIndex);
router.route("/profile").get(account.getProfile);
router.route("/security").get(account.getSecurity).post(account.updatePassword);
router
  .route("/settings")
  .get(account.renderSettingsForm)
  .post(account.submitSettingsForm);

module.exports = router;
