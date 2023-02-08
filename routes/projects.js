const express = require("express");
const router = express.Router({ mergeParams: true });
const projects = require("../controllers/projects");
const { isLoggedIn } = require("../utils/middleware");

router
  .route("/")
  .get(isLoggedIn, projects.index)
  .post(isLoggedIn, projects.createProject);

router.get("/new", isLoggedIn, projects.renderNewForm);

router.get("/:id", isLoggedIn, projects.showProject);
router.get("/:id/edit", isLoggedIn, projects.editProject);
router.get("/:id/issues", isLoggedIn, projects.projectIssues);
router.post("/:id/issues", isLoggedIn, projects.createNewTicket);
router.get("/:id/issues/new", isLoggedIn, projects.renderNewProjectIssue);
router.get("/:id/issues/:issueId", isLoggedIn, projects.renderProjectIssue);

module.exports = router;
