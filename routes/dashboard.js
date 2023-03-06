const express = require("express");
const router = express.Router({ mergeParams: true });
// const projects = require("../controllers/projects");
const { isLoggedIn } = require("../utils/middleware");
// const auth = require("../controllers/auth");
// const { addCompany } = require("../middleware/forms");
const dashboard = require("../controllers/dashboard");

// router.use('/:id/issues')

router.route("/").get(isLoggedIn, dashboard.renderDashbaord);
// .post(isLoggedIn, addCompany, projects.createProject);

// app.get(`/api/${version}/dashboard`, isLoggedIn, function (req, res) {
//   res.render("dashboards/index");
// });

module.exports = router;
