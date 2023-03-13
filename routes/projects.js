const express = require("express");
const router = express.Router({ mergeParams: true });
const projects = require("../controllers/projects");
const { isLoggedIn } = require("../utils/middleware");
const auth = require("../controllers/auth");
const { addCompany, convertDuration } = require("../middleware/forms");

// router.use('/:id/issues')

router
  .route("/")
  .get(isLoggedIn, auth.isAuthorized, projects.index)
  .post(isLoggedIn, addCompany, projects.createProject);

router.get("/new", isLoggedIn, projects.renderNewProjectForm);

router.get("/owner", isLoggedIn, projects.index);
router
  .route("/:projectId")
  .get(isLoggedIn, auth.canViewProject, projects.showProject)
  .put(isLoggedIn, auth.canEditProject, addCompany, projects.editProject)
  .delete(isLoggedIn, auth.canEditProject, projects.deleteProject);

router
  .route("/:projectId/manage")
  .get(isLoggedIn, auth.canEditProject, projects.manageTeam);

router.route("/:projectId/error").get(isLoggedIn, projects.error);

router.get(
  "/:projectId/edit",
  isLoggedIn,
  auth.canEditProject,
  projects.renderEditProject
);

router
  .route("/:projectId/issues")
  .get(isLoggedIn, auth.canViewProject, projects.projectIssues) // get all project issues
  .post(isLoggedIn, auth.canEditProject, projects.createNewIssue); // create new ticket

router.get(
  "/:projectId/issues/new",
  isLoggedIn,
  auth.canEditProject,
  projects.renderNewProjectIssue
); // new issue form

// router.get("/:id/issues/:issueId", isLoggedIn, projects.renderProjectIssue);
router
  .route("/:projectId/issues/:issueId")
  .get(isLoggedIn, auth.canViewProject, projects.renderProjectIssue) // show issue with tasks
  .put(isLoggedIn, auth.canEditProject, projects.editProjectIssue); // edit project issue

router.get(
  "/:projectId/issues/:issueId/edit",
  isLoggedIn,
  auth.canEditProject,
  projects.renderEditProjectIssue
);

// get all tasks
router
  .route("/:projectId/issues/:issueId/tasks")
  .get(isLoggedIn, auth.canViewProject, projects.renderTasks)
  .post(
    isLoggedIn,
    auth.canEditProject,
    convertDuration,
    projects.createNewTask
  );

// Get new task form
router.get(
  "/:projectId/issues/:issueId/tasks/new",
  isLoggedIn,
  auth.canEditProject,
  projects.renderNewTaskForm
);
// Update task. Delete task
router
  .route("/:projectId/issues/:issueId/tasks/:taskId")
  .put(
    isLoggedIn,
    auth.canEditProject,
    convertDuration,
    projects.updateTaskForm
  ) // Submit edit new task
  .delete(isLoggedIn, auth.canEditProject, projects.deleteTask); // Delete task
// Get the edit task form
router.get(
  "/:projectId/issues/:issueId/tasks/:taskId/edit",
  isLoggedIn,
  auth.canEditProject,
  projects.renderEditTaskForm
);

// router.delete("/:id", isLoggedIn, projects.deleteProject);

module.exports = router;
