const express = require("express");
const router = express.Router({ mergeParams: true });
const projects = require("../controllers/projects");

router.route("/").get(projects.index).post(projects.createProject);

router.get("/new", projects.renderNewForm);

router.get("/:id", projects.showProject);
router.get("/:id/edit", projects.editProject);
router.get("/:id/issues", projects.projectIssues);
router.get("/:id/issues/new", projects.renderNewProjectIssue);
router.get("/:id/issues/:issueId", projects.renderProjectIssue);

module.exports = router;
