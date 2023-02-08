const express = require("express");
const router = express.Router();
const Issue = require("../models/issue");
const { isLoggedIn } = require("../utils/middleware");
const tickets = require("../controllers/tickets");

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
