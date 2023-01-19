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
  const project = await Project.findById(req.params.id)
    .populate({
      path: "issues",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  const page = "show";
  res.render("projects/show", { project, page });
};

module.exports.editProject = async (req, res) => {
  const project = await Project.findById(req.params.id).populate("owner");
  const page = "edit";
  // res.render("projects/edit", { project, page });
  res.send("404 Need to do");
};

module.exports.projectIssues = async (req, res) => {
  const project = await Project.findById(req.params.id).populate({
    path: "issues",
    populate: {
      path: "author",
    },
  });
  const page = "issues";
  res.render("projects/all-issues", { project, page });
};
