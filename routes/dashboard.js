const express = require("express");
const router = express.Router({ mergeParams: true });
// const projects = require("../controllers/projects");
const { isLoggedIn } = require("../utils/middleware");
// const auth = require("../controllers/auth");
const dashboard = require("../controllers/dashboard");
const { addCompany } = require("../middleware/forms");

// router.use('/:id/issues')

// router.route("/").get(isLoggedIn, addCompany, dashboard.renderDashbaord);
// router.route("/").get(isLoggedIn, addCompany, dashboard.renderDashboardIssues);
router.route("/").get(isLoggedIn, addCompany, dashboard.renderDashboardTasks);
// .post(isLoggedIn, addCompany, projects.createProject);

// app.get(`/api/${version}/dashboard`, isLoggedIn, function (req, res) {
//   res.render("dashboards/index");
// });

module.exports = router;
