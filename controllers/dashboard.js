// const wrapAsync = require("../utils/wrapAsync");
// const User = require("../models/user");
// const Project = require("../models/project");

module.exports.renderDashbaord = async (req, res) => {
  console.log("render dashRoutes");
  res.render("dashboards/index");
};
