const express = require("express");
const router = express.Router();
const Issue = require("../models/issue");

const tickets = require("../controllers/tickets");

router.get("/", tickets.index);

router.get("/new", tickets.renderNewForm);

router.post("/", tickets.createNewTicket);

router.get("/:id", tickets.showTicket);

router.get("/:id/edit", tickets.editTicket);

router.put("/:id", tickets.updateTicket);

router.delete("/:id", tickets.deleteTicket);

module.exports = router;
