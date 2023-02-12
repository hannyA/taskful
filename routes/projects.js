const express = require("express");
const router = express.Router({ mergeParams: true });
const projects = require("../controllers/projects");
const { isLoggedIn } = require("../utils/middleware");

router
  .route("/")
  .get(isLoggedIn, projects.index)
  .post(isLoggedIn, projects.createProject);

router.get("/new", isLoggedIn, projects.renderNewProjectForm);

router.get("/owner", isLoggedIn, projects.index);
router
  .route("/:id")
  .get(isLoggedIn, projects.showProject)
  .delete(isLoggedIn, projects.deleteProject);

router.get("/:id/edit", isLoggedIn, projects.editProject);
router
  .route("/:id/issues")
  .get(isLoggedIn, projects.projectIssues)
  .post(isLoggedIn, projects.createNewTicket);
router.get("/:id/issues/new", isLoggedIn, projects.renderNewProjectIssue);
router.get("/:id/issues/:issueId", isLoggedIn, projects.renderProjectIssue);
// router.delete("/:id", isLoggedIn, projects.deleteProject);

module.exports = router;
