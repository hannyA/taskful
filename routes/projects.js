const express = require("express");
const router = express.Router();
const projects = require("../controllers/projects");

router.route("/").get(projects.index).post(projects.createProject);

router.get("/new", projects.renderNewForm);

router.get("/:id", projects.showProject);
router.get("/:id/edit", projects.editProject);
router.get("/:id/issues", projects.projectIssues);

module.exports = router;
