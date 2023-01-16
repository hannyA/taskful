const Project = require("../models/project");

module.exports.index = async (req, res) => {
  const projects = await Project.find({});
  res.render("projects/index", { projects });
};

module.exports.createProject = async (req, res) => {
  const project = new Project(req.body.project);
  await project.save();
  res.redirect(`/projects/${project._id}`);
};

module.exports.renderNewForm = async (req, res) => {
  res.render("projects/new");
};

module.exports.showProject = async (req, res) => {
  const project = await Project.findById(req.params.id);
  res.render("projects/show", { project });
};
