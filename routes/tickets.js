const express = require("express");
const router = express.Router();
const Issue = require("../models/issue");

router.get("/", async (req, res) => {
  const tickets = await Issue.find({});
  res.render("ticket/index", { tickets });
});

router.get("/new", async (req, res) => {
  res.render("ticket/new");
});

router.post("/", async (req, res) => {
  const ticket = new Issue(req.body.ticket);
  await ticket.save();
  res.redirect(`/ticket/${ticket._id}`);
});

router.get("/:id", async (req, res) => {
  const ticket = await Issue.findById(req.params.id);
  res.render("ticket/show", { ticket });
});

router.get("/:id/edit", async (req, res) => {
  const ticket = await Issue.findById(req.params.id);
  res.render("ticket/edit", { ticket });
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const ticket = await Issue.findByIdAndUpdate(id, { ...req.body.ticket });
  res.redirect(`/ticket/${ticket._id}`);
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const ticket = await Issue.findByIdAndDelete(id);
  res.redirect("/ticket");
});

module.exports = router;
