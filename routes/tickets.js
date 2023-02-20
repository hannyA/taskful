const express = require("express");
const Issue = require("../models/issue");
const { isLoggedIn } = require("../utils/middleware");
const tickets = require("../controllers/tickets");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(isLoggedIn, tickets.index)
  .post(isLoggedIn, tickets.createNewTicket);

router.get("/new", isLoggedIn, tickets.renderNewForm);

router
  .route("/:id")
  .get(isLoggedIn, tickets.showTicket)
  .put(isLoggedIn, tickets.updateTicket)
  .delete(isLoggedIn, tickets.deleteTicket);

router.get("/:id/edit", isLoggedIn, tickets.editTicket);

module.exports = router;
