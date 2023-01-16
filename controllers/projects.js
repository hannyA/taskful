const Project = require("../models/project");

module.exports.index = async (req, res) => {
  const projects = await Project.find({});
  const page = "index";
  res.render("projects/index", { projects, page });
};

module.exports.createProject = async (req, res) => {
  const project = new Project(req.body.project);
  await project.save();

  res.redirect(`/projects/${project._id}`);
};

module.exports.renderNewForm = async (req, res) => {
  const page = "new";
  res.render("projects/new", { page });
};

module.exports.showProject = async (req, res) => {
  const project = await Project.findById(req.params.id);
  const page = "show";
  res.render("projects/show", { project, page });
};
