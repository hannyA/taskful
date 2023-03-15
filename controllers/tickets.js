const APIFeatures = require("../utils/apiFeatures");

const Ticket = require("../models/ticket");

module.exports.index = async (req, res) => {
  console.log("total pages:: index");
  // req.query.company = req.user.company;

  const features = new APIFeatures(Ticket.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tickets = await features.query.populate({ path: "owner" });

  // Get number of projects and calculate number of pages
  const countQuery = new APIFeatures(Ticket.find(), req.query).filter();
  const numTickets = await Ticket.countDocuments(countQuery.query);

  // console.log("numProjects: ", numProjects);
  const totalPages = Math.ceil(numTickets / features.limit);
  console.log("2 total pages:: index");

  let page = "index";
  let resource = "tickets?";

  const ownerId = req.query.owner;

  if (ownerId && ownerId === req.user.id) {
    page = "mine";
    resource = `${resource}owner=${ownerId}&`;
  }

  res.render("tickets/index", {
    // pagination: true,
    tickets,
    page,
    totalPages,
    currentPage: features.page,
    resource,
    navbar: "tickets",
  });

  // res.render("tickets/index", { tickets, page, navbar: "tickets" });
};

module.exports.renderNewForm = async (req, res) => {
  const page = "new";

  res.render("tickets/new", { page, navbar: "tickets" });
};

module.exports.createNewTicket = async (req, res) => {
  console.log("Ticket:create new ticket: ", req.body);
  const body = { ...req.body, owner: req.user, company: req.user.company };
  const ticket = new Ticket(body);
  await ticket.save();
  res.redirect(`/api/v1/tickets/${ticket._id}`);
};

module.exports.showTicket = async (req, res) => {
  console.log("show ticket");
  const ticket = await Ticket.findById(req.params.id);
  const page = "4";
  res.render("tickets/show", { ticket, page, navbar: "tickets" });
};

module.exports.editTicket = async (req, res) => {
  const ticket = await Ticket.findById(req.params.id);
  const page = "5";
  res.render("tickets/edit", { ticket, page, navbar: "tickets" });
};
module.exports.updateTicket = async (req, res) => {
  const { id } = req.params;
  const ticket = await Ticket.findByIdAndUpdate(id, { ...req.body.ticket });
  const page = "6";
  res.redirect(`/api/v1/tickets/${ticket._id}`, { page });
};

module.exports.deleteTicket = async (req, res) => {
  const { id } = req.params;
  const ticket = await Ticket.findByIdAndDelete(id);
  const page = "7";
  res.redirect("/api/v1/tickets", { page });
};
