const Project = require("../models/project");
const Issue = require("../models/issue");
const User = require("../models/user");
const Task = require("../models/task");
const APIFeatures = require("../utils/apiFeatures");
const wrapAsync = require("../utils/wrapAsync");

// List all projects or mine projects
module.exports.index = async (req, res) => {
  const features = new APIFeatures(Project.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const projects = await features.query.populate({ path: "owner" });

  // Get number of projects and calculate number of pages
  const countQuery = new APIFeatures(Project.find(), req.query).filter();
  const numProjects = await Project.countDocuments(countQuery.query);

  // console.log("numProjects: ", numProjects);
  const totalPages = Math.ceil(numProjects / features.limit);

  const { owner } = req.query;
  // const page = owner === req.user.id ? "mine" : "index";

  let page = "index";
  let resource = "projects?";

  if (req.query.owner) {
    page = "mine";
    resource = `${resource}owner=${req.query.owner}&`;
  }

  res.render("projects/index", {
    pagination: true,
    projects,
    page,
    totalPages,
    currentPage: features.page,
    resource,
  });
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
  res.redirect(`/api/v1/projects/${project._id}`);
};

// Show project details with first 10 issues
module.exports.showProject = wrapAsync(async (req, res) => {
  const projectID = req.params.id;
  const project = await Project.findById(projectID).populate("owner");

  // const issues = await Issue.find({ project: projectID }).populate("author");

  req.query.project = projectID;
  console.log("query: ", req.query);
  const features = new APIFeatures(Issue.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const issues = await features.query.populate("author");

  // console.log("issues: ", issues);
  // Get number of projects and calculate number of pages
  const countQuery = new APIFeatures(Issue.find(), req.query).filter();
  const numIssues = await Issue.countDocuments(countQuery.query);

  // console.log("numProjects: ", numProjects);
  const totalPages = Math.ceil(numIssues / features.limit);

  // const { owner } = req.query;
  // const page = owner === req.user.id ? "mine" : "index";

  const page = "show";

  res.render("projects/show", {
    // pagination: true,
    project,
    issues,
    page,
    totalPages,
    currentPage: features.page,
    resource: `projects/${projectID}?`,
  });

  // res.render("projects/show", { project, issues, totalPages, page });
});

module.exports.renderEditProject = async (req, res) => {
  const project = await Project.findById(req.params.id).populate("owner");
  const users = await User.find({});
  const page = "edit";
  res.render("projects/edit", { project, users, page });
  // res.send("404 Need to do");
};

// Edit project
module.exports.editProject = async (req, res) => {
  const projectId = req.params.id;
  const project = await Project.findByIdAndUpdate(projectId, {
    ...req.body.project,
  });
  res.redirect(`/api/v1/projects/${projectId}`);
};

/// Show all issues
// search by tickets/issues -> author is me or some other user
module.exports.projectIssues = async (req, res) => {
  const projectID = req.params.id;
  const project = await Project.findById(projectID);

  req.query.project = projectID;

  let page = "all-issues";
  let resource = `projects/${projectID}/issues?`;

  if (req.query.author) {
    page = "mine";
    resource = `${resource}author=${req.query.author}&`;
  }

  const features = new APIFeatures(Issue.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const issues = await features.query.populate("author");

  // Get number of projects and calculate number of pages
  const countQuery = new APIFeatures(Issue.find(), req.query).filter();
  const numIssues = await Issue.countDocuments(countQuery.query);

  // console.log("numProjects: ", numProjects);
  const totalPages = Math.ceil(numIssues / features.limit);

  res.render("projects/issues/all-issues", {
    pagination: true,

    project,
    issues,
    page,
    totalPages,
    currentPage: features.page,
    resource,
  });
};

// Show single issue
module.exports.renderProjectIssue = async (req, res) => {
  const project = await Project.findById(req.params.projectId);
  const issue = await Issue.findById(req.params.issueId).populate("author");
  // const tasks = await Task.find({ issue }).populate("author");

  const features = new APIFeatures(Task.find(), req.query)
    .filter({ issue })
    .sort()
    .limitFields()
    .paginate();

  const tasks = await features.query.populate("author");

  console.log("tasks: ", tasks);
  const page = "issue";
  res.render("projects/issues/show", { issue, page, project, tasks });
};

// Show Create new Issue Form
module.exports.renderNewProjectIssue = async (req, res) => {
  const page = "new-issue";
  const users = await User.find({});
  const project = await Project.findById(req.params.id);
  res.render("projects/issues/new-issue", { page, project, users });
};

// Create ticket and redirect
module.exports.createNewIssue = wrapAsync(async (req, res) => {
  const id = req.params.id;
  req.body.ticket.project = id;
  const ticket = new Issue(req.body.ticket);
  await ticket.save();

  res.redirect(`/api/v1/projects/${id}/issues/${ticket._id}`);
});

module.exports.deleteProject = wrapAsync(async (req, res) => {
  const { id } = req.params;
  await Project.findByIdAndDelete(id);
  res.redirect("/api/v1/projects");
});

module.exports.editProjectIssue = wrapAsync(async (req, res) => {
  const projectId = req.params.projectId;
  const issueId = req.params.issueId;
  const project = await Issue.findByIdAndUpdate(issueId, {
    ...req.body.ticket,
  });
  res.redirect(`/api/v1/projects/${projectId}/issues/${issueId}`);
});

module.exports.renderEditProjectIssue = wrapAsync(async (req, res) => {
  const pid = req.params.projectId;
  const tid = req.params.issueId;

  const project = await Project.findById(pid);
  const issue = await Issue.findById(tid).populate("author");
  const page = "5";

  console.log("issue; ", issue);

  const users = await User.find({});
  res.render("projects/issues/edit-issue", { project, issue, page, users });
});

module.exports.renderTasks = wrapAsync(async (req, res) => {
  const projectId = req.params.projectId;
  const issuId = req.params.projectId;

  // const tasks = await Task.find({ issue });

  res.send("renderTasks", {});
});

module.exports.createNewTask = wrapAsync(async (req, res) => {
  const projectId = req.params.projectId;
  const issueId = req.params.issueId;
  req.body.task.issue = issueId;
  console.log("req.body.task: ", req.body.task);
  const task = new Task(req.body.task);
  await task.save();
  res.redirect(`/api/v1/projects/${projectId}/issues/${issueId}`);
});

module.exports.renderNewTaskForm = wrapAsync(async (req, res) => {
  const projectId = req.params.projectId;
  const issueId = req.params.issueId;
  const project = await Project.findById(projectId);

  const issue = await Issue.findById(issueId).populate("author");
  const users = await User.find({});
  const page = "new-task";

  res.render("projects/tasks/new", { project, issue, page, users });

  // res.send("renderNewTaskForm");
});

module.exports.renderEditTaskForm = wrapAsync(async (req, res) => {
  const projectId = req.params.projectId;
  const issueId = req.params.issueId;
  const taskId = req.params.taskId;

  const project = await Project.findById(projectId);
  const issue = await Issue.findById(issueId).populate("author");
  const task = await Task.findById(taskId).populate("author");

  const users = await User.find({});
  const page = "edit-task";

  res.render("projects/tasks/edit", { project, issue, task, page, users });

  // res.send("renderNewTaskForm");
});

module.exports.updateTaskForm = wrapAsync(async (req, res) => {
  const projectId = req.params.projectId;
  const issueId = req.params.issueId;
  const taskId = req.params.taskId;

  const task = await Task.findByIdAndUpdate(taskId, {
    ...req.body.task,
  });
  res.redirect(`/api/v1/projects/${projectId}/issues/${issueId}`);
});

module.exports.deleteTask = wrapAsync(async (req, res) => {
  const projectId = req.params.projectId;
  const issueId = req.params.issueId;
  const taskId = req.params.taskId;

  const task = await Task.findByIdAndDelete(taskId);

  const page = "delete-task";
  res.redirect(`/api/v1/projects/${projectId}/issues/${issueId}`);
});

module.exports.deleteProject = wrapAsync(async (req, res) => {
  const { id } = req.params;
  await Project.findByIdAndDelete(id);
  res.redirect("/api/v1/projects");
});
