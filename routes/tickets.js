const express = require("express");
const router = express.Router();
const Issue = require("../models/issue");

const tickets = require("../controllers/tickets");

router.route("/").get(tickets.index).post(tickets.createNewTicket);

router.get("/new", tickets.renderNewForm);

router
  .route("/:id")
  .get(tickets.showTicket)
  .put(tickets.updateTicket)
  .delete(tickets.deleteTicket);

router.get("/:id/edit", tickets.editTicket);

module.exports = router;
