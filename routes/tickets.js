const express = require("express");
const Issue = require("../models/issue");
const { isLoggedIn } = require("../utils/middleware");
const tickets = require("../controllers/tickets");
const { isAuthorized } = require("../controllers/auth");
const { convertDuration } = require("../middleware/forms");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(isLoggedIn, isAuthorized, tickets.index)
  .post(isLoggedIn, isAuthorized, tickets.createNewTicket);

router.get("/new", isLoggedIn, tickets.renderNewForm);

router
  .route("/:id")
  .get(isLoggedIn, tickets.showTicket)
  .put(isLoggedIn, tickets.updateTicket)
  .delete(isLoggedIn, tickets.deleteTicket);

router.get("/:id/edit", isLoggedIn, tickets.renderEditTicketForm);

router.route("/:id/tasks/new").get(isLoggedIn, tickets.renderNewTaskForm);

// href="/api/v1/tickets/<%= ticket._id %>/tasks/<%= task._id %>/edit "

router.route("/:id/tasks").post(isLoggedIn, convertDuration, tickets.newTask);
router.route("/:id/tasks/:taskId/edit").get(isLoggedIn, tickets.renderEditTask);
router
  .route("/:id/tasks/:taskId")
  .put(isLoggedIn, convertDuration, tickets.editTask);

module.exports = router;
