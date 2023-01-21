const express = require("express");
const router = express.Router({ mergeParams: true });
const projects = require("../controllers/projects");

router.route("/").get(projects.index).post(projects.createProject);

router.get("/new", projects.renderNewForm);

router.get("/:id", projects.showProject);
router.get("/:id/edit", projects.editProject);
router.get("/:id/issues", projects.projectIssues);
router.get("/:id/issues/:issueId", projects.renderProjectIssue);

// /projects/<%= project._id %>/tickets/<%= ticket._id %>

module.exports = router;
