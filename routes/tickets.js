const express = require("express");
const router = express.Router();
const Issue = require("../models/issue");

router.get("/", async (req, res) => {
  const tickets = await Issue.find({});
  res.render("tickets/index", { tickets });
});

router.get("/new", async (req, res) => {
  res.render("tickets/new");
});

router.post("/", async (req, res) => {
  const ticket = new Issue(req.body.ticket);
  await ticket.save();
  res.redirect(`/tickets/${ticket._id}`);
});

router.get("/:id", async (req, res) => {
  const ticket = await Issue.findById(req.params.id);
  res.render("tickets/show", { ticket });
});

router.get("/:id/edit", async (req, res) => {
  const ticket = await Issue.findById(req.params.id);
  res.render("tickets/edit", { ticket });
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const ticket = await Issue.findByIdAndUpdate(id, { ...req.body.ticket });
  res.redirect(`/tickets/${ticket._id}`);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const ticket = await Issue.findByIdAndDelete(id);
  res.redirect("/tickets");
});

module.exports = router;
