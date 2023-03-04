const express = require("express");
const router = express.Router({ mergeParams: true });
const projects = require("../controllers/projects");
const { isLoggedIn } = require("../utils/middleware");
const auth = require("../controllers/auth");

// router.use('/:id/issues')

router
  .route("/")
  .get(isLoggedIn, auth.isAuthorized, projects.index)
  .post(isLoggedIn, auth.isAuthorized, projects.createProject);

router.get("/new", isLoggedIn, projects.renderNewProjectForm);

router.get("/owner", isLoggedIn, projects.index);
router
  .route("/:id")
  .get(isLoggedIn, projects.showProject)
  .put(isLoggedIn, projects.editProject)
  .delete(isLoggedIn, projects.deleteProject);

router.get("/:id/edit", isLoggedIn, projects.renderEditProject);

router
  .route("/:id/issues")
  .get(isLoggedIn, projects.projectIssues) // get all project issues
  .post(isLoggedIn, projects.createNewIssue); // create new ticket

router.get("/:id/issues/new", isLoggedIn, projects.renderNewProjectIssue); // new issue form

// router.get("/:id/issues/:issueId", isLoggedIn, projects.renderProjectIssue);
router
  .route("/:projectId/issues/:issueId")
  .get(isLoggedIn, projects.renderProjectIssue)
  .put(isLoggedIn, projects.editProjectIssue);

router.get(
  "/:projectId/issues/:issueId/edit",
  isLoggedIn,
  projects.renderEditProjectIssue
);

// get all tasks
router
  .route("/:projectId/issues/:issueId/tasks")
  .get(isLoggedIn, projects.renderTasks)
  .post(isLoggedIn, projects.createNewTask);

router.get(
  "/:projectId/issues/:issueId/tasks/new",
  isLoggedIn,
  projects.renderNewTaskForm
);

router
  .route("/:projectId/issues/:issueId/tasks/:taskId")
  .put(isLoggedIn, projects.updateTaskForm)
  .delete(isLoggedIn, projects.deleteTask);

router.get(
  "/:projectId/issues/:issueId/tasks/:taskId/edit",
  isLoggedIn,
  projects.renderEditTaskForm
);

// router.delete("/:id", isLoggedIn, projects.deleteProject);

module.exports = router;
