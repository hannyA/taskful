const Issue = require("../models/issue");

module.exports.index = async (req, res) => {
  const page = "index";
  const tickets = await Issue.find({});
  res.render("tickets/index", { tickets, page, navbar: "tickets" });
};

module.exports.renderNewForm = async (req, res) => {
  const page = "new";

  res.render("tickets/new", { page, navbar: "tickets" });
};

module.exports.createNewTicket = async (req, res) => {
  const ticket = new Issue(req.body.ticket);
  await ticket.save();
  const page = "3";
  res.redirect(`/api/v1/tickets/${ticket._id}`, { page });
};

module.exports.showTicket = async (req, res) => {
  const ticket = await Issue.findById(req.params.id);
  const page = "4";
  res.render("tickets/show", { ticket, page, navbar: "tickets" });
};

module.exports.editTicket = async (req, res) => {
  const ticket = await Issue.findById(req.params.id);
  const page = "5";
  res.render("tickets/edit", { ticket, page, navbar: "tickets" });
};
module.exports.updateTicket = async (req, res) => {
  const { id } = req.params;
  const ticket = await Issue.findByIdAndUpdate(id, { ...req.body.ticket });
  const page = "6";
  res.redirect(`/api/v1/tickets/${ticket._id}`, { page });
};

module.exports.deleteTicket = async (req, res) => {
  const { id } = req.params;
  const ticket = await Issue.findByIdAndDelete(id);
  const page = "7";
  res.redirect("/api/v1/tickets", { page });
};
