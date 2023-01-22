const Project = require("../models/project");
const Issue = require("../models/issue");
const User = require("../models/user");

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
  const page = "all-issues";
  res.render("projects/all-issues", { project, page });
};

module.exports.renderProjectIssue = async (req, res) => {
  const project = await Project.findById(req.params.id);
  const ticket = await Issue.findById(req.params.issueId);
  const page = "issue";
  res.render("projects/issue", { ticket, page, project });
};

module.exports.renderNewProjectIssue = async (req, res) => {
  const page = "new-issue";
  const users = await User.find({});
  const project = await Project.findById(req.params.id);
  res.render("projects/new-ticket", { page, project, users });
};

module.exports.createNewTicket = async (req, res) => {
  const author = await User.findOne({ first: "Tom", last: "Tyson" });
  req.body.ticket["author"] = author;

  const ticket = new Issue(req.body.ticket);
  await ticket.save();

  const projectId = req.body.project["id"];

  res.redirect(`/projects/${projectId}/issues/${ticket._id}`);
};
