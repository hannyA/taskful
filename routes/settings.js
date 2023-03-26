const express = require("express");
const router = express.Router();
const user = require("../models/user");
const settings = require("../controllers/settings");

router
  .route("/")
  .get(settings.renderSettingsForm)
  .post(settings.submitSettingsForm);

module.exports = router;
