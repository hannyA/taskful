const express = require("express");
const router = express.Router();
const Project = require("../models/project");

router.get("/", async (req, res) => {
  const projects = await Project.find({});
  res.render("projects/index", { projects });
});

router.post("/", async (req, res) => {
  const project = new Project(req.body.project);
  await project.save();
  res.redirect(`/projects/${project._id}`);
});

router.get("/new", async (req, res) => {
  res.render("projects/new");
});

router.get("/:id", async (req, res) => {
  const project = await Project.findById(req.params.id);
  res.render("projects/show", { project });
});

module.exports = router;
