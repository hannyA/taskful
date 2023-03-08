const express = require("express");
const router = express.Router({ mergeParams: true });
// const projects = require("../controllers/projects");
const { isLoggedIn } = require("../utils/middleware");
// const auth = require("../controllers/auth");
const dashboard = require("../controllers/dashboard");
const { addCompany } = require("../middleware/forms");

// router.use('/:id/issues')

router.route("/").get(isLoggedIn, addCompany, dashboard.renderCompanyDashbaord);
router.route("/mine").get(isLoggedIn, addCompany, dashboard.renderMyDashboard);
router
  .route("/stats")
  .get(isLoggedIn, addCompany, dashboard.renderDashboardIssues);

// app.get(`/api/${version}/dashboard`, isLoggedIn, function (req, res) {
//   res.render("dashboards/index");
// });

module.exports = router;
