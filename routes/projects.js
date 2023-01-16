const express = require("express");
const router = express.Router();
const projects = require("../controllers/projects");

router.get("/", projects.index);

router.post("/", projects.createProject);

router.get("/new", projects.renderNewForm);

router.get("/:id", projects.showProject);

module.exports = router;
