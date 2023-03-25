const APIFeatures = require("../utils/apiFeatures");

const Ticket = require("../models/ticket");
const TicketTask = require("../models/ticket-task");
const { getCompanyUsers, getCompanyTech } = require("./util");

module.exports.index = async (req, res) => {
  console.log("total pages:: index");
  // req.query.company = req.user.company;

  const features = new APIFeatures(Ticket.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const tickets = await features.query
    .populate({ path: "owner" })
    .populate("assignee");

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
  const ticket = await Ticket.findById(req.params.id)
    .populate({ path: "owner" })
    .populate("assignee");

  console.log("ticket task req.query: ", req.query);
  const features = new APIFeatures(TicketTask.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const tasks = await features.query.populate("author");
  console.log("ticket tasks: ", tasks);

  // Get number of projects and calculate number of pages
  const countQuery = new APIFeatures(TicketTask.find(), req.query).filter();
  const numberofTasks = await TicketTask.countDocuments(countQuery.query);

  const pagination = numberofTasks == 0 ? false : true;
  // console.log("numProjects: ", numProjects);
  const totalPages = Math.ceil(numberofTasks / features.limit);

  const page = "ticket";
  res.render("tickets/show", {
    ticket,
    page,
    navbar: "tickets",
    totalPages,
    tasks,
  });
};

module.exports.renderEditTicketForm = async (req, res) => {
  const ticket = await Ticket.findById(req.params.id)
    .populate("owner")
    .populate("assignee");
  const users = await getCompanyTech(req, res);

  console.log("ticket owner: ", ticket.owner);
  console.log("ticket assignee: ", ticket.assignee);
  const page = "5";
  res.render("tickets/edit", { ticket, users, page, navbar: "tickets" });
};

module.exports.updateTicket = async (req, res) => {
  const { id } = req.params;
  console.log("req.body:", req.body);
  const ticket = await Ticket.findByIdAndUpdate(id, { ...req.body });
  res.redirect(`/api/v1/tickets/${ticket._id}`);
};

module.exports.deleteTicket = async (req, res) => {
  const { id } = req.params;
  const ticket = await Ticket.findByIdAndDelete(id);
  res.redirect("/api/v1/tickets");
};

module.exports.renderNewTaskForm = async (req, res) => {
  const page = "new-task";
  const users = await getCompanyUsers(req, res);
  console.log("renderNewProjectIssue users");

  const ticket = await Ticket.findById(req.params.id);
  // res.render("projects/issues/new-issue", {
  //   page,
  //   project,
  //   users,
  //   navbar: "projects",
  // });

  // const { id } = req.params;
  // const ticket = await Ticket.findByIdAndUpdate(id, { ...req.body.ticket });
  // const page = "6";
  res.render("tickets/new-task", { ticket, page, users, navbar: "tickets" });
};

module.exports.newTask = async (req, res) => {
  console.log("newTask req.body: ", req.body);
  const ticket = req.params.id;
  const body = { ...req.body, ticket };
  const task = new TicketTask(body);
  await task.save();
  res.redirect(`/api/v1/tickets/${ticket}`);
};

module.exports.renderEditTask = async (req, res) => {
  console.log("renderEditTask");
  const ticket = await Ticket.findById(req.params.id);
  const task = await TicketTask.findById(req.params.taskId).populate("author");
  console.log("renderEditTask 2");
  const users = await getCompanyTech(req, res);
  const page = "6";

  res.render("tickets/edit-task", {
    ticket,
    task,
    users,
    navbar: "tickets",
    page,
  });
};

module.exports.editTask = async (req, res) => {
  const { id } = req.params;
  const { taskId } = req.params;

  const ticket = await TicketTask.updateOne({ _id: taskId }, { ...req.body });
  res.redirect(`/api/v1/tickets/${id}`);
};

module.exports.deleteTask = async (req, res) => {
  const { id, taskId } = req.params;
  const ticket = await TicketTask.deleteOne({ _id: taskId });
  res.redirect(`/api/v1/tickets/${id}`);
};
