const Issue = require("../models/issue");

module.exports.index = async (req, res) => {
  const tickets = await Issue.find({});
  res.render("tickets/index", { tickets });
};

module.exports.renderNewForm = async (req, res) => {
  res.render("tickets/new");
};

module.exports.createNewTicket = async (req, res) => {
  const ticket = new Issue(req.body.ticket);
  await ticket.save();
  res.redirect(`/tickets/${ticket._id}`);
};

module.exports.showTicket = async (req, res) => {
  const ticket = await Issue.findById(req.params.id);
  res.render("tickets/show", { ticket });
};

module.exports.editTicket = async (req, res) => {
  const ticket = await Issue.findById(req.params.id);
  res.render("tickets/edit", { ticket });
};
module.exports.updateTicket = async (req, res) => {
  const { id } = req.params;
  const ticket = await Issue.findByIdAndUpdate(id, { ...req.body.ticket });
  res.redirect(`/tickets/${ticket._id}`);
};

module.exports.deleteTicket = async (req, res) => {
  const { id } = req.params;
  const ticket = await Issue.findByIdAndDelete(id);
  res.redirect("/tickets");
};
