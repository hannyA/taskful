const Project = require("../models/project");
const Issue = require("../models/issue");
const User = require("../models/user");

const wrapAsync = require("../utils/wrapAsync");

module.exports.index = async (req, res) => {
  // const { id } = { ...req.query.id };
  const { id } = req.query || {};
  // console.log("req.query.id : ", req.query.id);
  // console.log("Bodyid : ", id);
  // console.log("Query: ", req.query.id);
  console.log("req user: ", req.user);
  const currentUser = req.user;
  const param = id ? { owner: id } : {};
  const projects = await Project.find(param).populate({ path: "owner" });
  const page = id === currentUser.id ? "mine" : "index";
  // console.log("id: ", id);
  // console.log("currentUser._id: ", currentUser.id);
  // console.log("page: ", page);
  res.render("projects/index", { projects, page });
};

module.exports.renderNewProjectForm = async (req, res) => {
  const page = "new";
  const users = await User.find({});
  res.render("projects/new", { page, users });
};

module.exports.createProject = async (req, res) => {
  console.log(req.body);
  console.log(req.body.project);
  const project = new Project(req.body.project);
  await project.save();

  res.redirect(`/projects/${project._id}`);
};

// Show project details with first 10 issues
module.exports.showProject = wrapAsync(async (req, res) => {
  const { id } = req.params;
  const project = await Project.findById(id).populate("owner");
  const issues = await Issue.find({ project: id }).populate("author");
  const page = "show";
  res.render("projects/show", { project, issues, page });
});

module.exports.editProject = async (req, res) => {
  const project = await Project.findById(req.params.id).populate("owner");
  const page = "edit";
  // res.render("projects/edit", { project, page });
  res.send("404 Need to do");
};

/// Show all issues
// search by tickets/issues -> author is me or some other user
module.exports.projectIssues = async (req, res) => {
  const projId = req.params.id;
  const { userid } = req.query;
  const project = await Project.findById(projId);
  const findObj = { project: projId };
  let page = "all-issues";

  if (userid) {
    findObj.author = userid;
    page = "mine";
  }

  const issues = await Issue.find(findObj).populate({ path: "author" });
  console.log("tickets: ", issues);

  res.render("projects/all-issues", { project, issues, page });
};

// Show single issue
module.exports.renderProjectIssue = async (req, res) => {
  const project = await Project.findById(req.params.id);
  const ticket = await Issue.findById(req.params.issueId);
  const page = "issue";
  res.render("projects/issue", { ticket, page, project });
};

// Show new Issue Form
module.exports.renderNewProjectIssue = async (req, res) => {
  const page = "new-issue";
  const users = await User.find({});
  const project = await Project.findById(req.params.id);
  res.render("projects/new-ticket", { page, project, users });
};

module.exports.createNewTicket = wrapAsync(async (req, res) => {
  const id = req.params.id;
  req.body.ticket.project = id;
  const project = await Project.findById(id);
  const ticket = new Issue(req.body.ticket);
  project.issues.push(ticket);
  await ticket.save();
  await project.save();

  // const projectId = req.body.project["id"];
  // res.redirect()

  res.redirect(`/projects/${project._id}/issues/${ticket._id}`);
});

module.exports.deleteProject = wrapAsync(async (req, res) => {
  const { id } = req.params;
  await Project.findByIdAndDelete(id);
  res.redirect("/projects");
});
