const User = require("../models/user");
const Project = require("../models/project");
const Issue = require("../models/issue");
const Task = require("../models/task");
const Ticket = require("../models/ticket");
const TicketTask = require("../models/ticket-task");

const {
  createUser,
  // randomDate,
  newProject,
  newIssue,
  daysBeforeToday,
  generateUser,
  randomItem,
  randomDate,
  newTask,
  randomTaskDuration,
  newTicket,
  newTicketTask,
} = require("./utils");

const { issues, type, projectTitles, tasks } = require("./seedHelper");
const wrapAsync = require("../utils/wrapAsync");
const ticket = require("../models/ticket");

const Admin = "Admin";
const Technician = "Technician";
const NormalUser = "User";

module.exports.makeAdmin = async (
  company,
  role,
  firstname,
  lastname,
  password,
  email
) => {
  const adminUser = await createUser(
    company,
    role || "Admin",
    firstname || "John",
    lastname || "Doe",
    daysBeforeToday(30),
    password || "a",
    email
  );

  return adminUser;
};

module.exports.seedDB = async (company, seedUser) => {
  //TODO: create projects, issues and tasks assigned to defaultAdmin
  console.log("seeddb company ", company);

  const start = Date.now();

  const numberOfUsers = 10;
  // Create random users in database
  await generateUser(company, numberOfUsers);

  let markPoint = Date.now();
  console.log("Generate users took ", (markPoint - start) / 1000, " seconds");

  //For 1/10 team create projects, including Admin
  const numOfLeaders = Math.floor(numberOfUsers / 10);

  const projectLeaders = await User.find({
    company: company,
    _id: { $ne: seedUser._id },
  }).limit(numOfLeaders);

  if (seedUser === Admin) {
    projectLeaders.push(seedUser);
  } else if (seedUser === Technician) {
  } else {
    projectLeaders.push(seedUser);
  }

  let oldPoint = markPoint;
  markPoint = Date.now();
  console.log(
    "Find projectLeaders users took ",
    (markPoint - oldPoint) / 1000,
    " seconds"
  );

  const projects = [];

  // Create projects for all project leaders
  for (let i = 0; i < projectTitles.length; i++) {
    const projectInfo = projectTitles[i];
    const projLeader = projectLeaders[i % projectLeaders.length];
    // console.log("project leader: ", projLeader.first, projLeader.last);

    const team = await makeTeam(company, projLeader);

    const project = newProject(projLeader, projectInfo, team);
    projects.push(project);
  }

  const newProjects = await Project.insertMany(projects);

  projects.forEach((project) => {
    // Add issues for project
    let projectDate = project.createdAt;

    const issues = [];
    // Create at least one issue assigned to demo user for their project
    if (project.owner.id === seedUser.id) {
      issues.push(makeIssue(seedUser, project.id, projectDate));
    }

    // Add more issues assigned randomly
    for (let i = 0; i < 10; i++) {
      const user = randomItem(project.team);
      issues.push(makeIssue(user, project.id, projectDate));
    }

    const newIssues = Issue.insertMany(issues);

    const tasks = [];
    issues.forEach(async (issue) => {
      await generateRandomTasks(issue.author, issue, issue.createdAt);
    });
  });

  oldPoint = markPoint;
  markPoint = Date.now();

  console.log(
    "Creating projects took ",
    (markPoint - oldPoint) / 1000,
    " seconds"
  );

  // Make Tickets

  // Get Tech support

  // seeduser will be in one of these
  const techSupport = await User.find({
    company: company,
    role: { $ne: "User" },
  });
  const normalUsers = await User.find({
    company: company,
    role: { $eq: "User" },
  });

  // where is uesrs defined?
  // what is uesr, technician admin?
  // difference between technician and admin?

  /**
   *
   * Admin has control over company site settings, permissions
   *    Can change peoples roles
   *
   * Technician can create tickets and add tasks to them, and assign them to others, create users
   *    Can change peoples roles
   *
   * Users: Can be part of projects, can create project, issues, tasks
   *    Can also create tickets
   * Project owners: Can add/remove team members
   */
  const numTickets =
    (seedUser.role !== NormalUser ? techSupport.length : normalUsers.length) *
    2;
  console.log("Making ", numTickets, " tickets");

  await makeTicket(techSupport, normalUsers, company, numTickets);

  const end = Date.now();
  const endPoint = (end - markPoint) / 1000;
  console.log("Finish tickets took ", endPoint, " seconds");
  console.log("Total time took ", (end - start) / 1000, " seconds");
};

const makeTicket = async (techSupport, users, company, numTickets) => {
  const tickets = [];
  for (let i = 0; i < numTickets; i++) {
    let user = users[i % users.length];
    let tech = techSupport[i % techSupport.length];
    let laterDate =
      tech.registerDate > user.registerDate
        ? tech.registerDate
        : user.registerDate;
    let date = randomDate(laterDate, new Date());
    const ticket = createTicket(user, tech, company, date);

    tickets.push(ticket);
  }
  await Ticket.insertMany(tickets);

  tickets.forEach(async (ticket) => {
    // Make Tasks
    // console.log("ticket.assignee: ", ticket.assignee);

    await generateRandomTicketTasks(
      ticket.assignee,
      ticket.id,
      ticket.createdAt
    );
  });
};

// const makeTicketAsUser = async (techSupport, users, company) => {
//   for (let i = 0; i < users.length * 2; i++) {
//     let user = users[i % users.length];
//     let tech = techSupport[i % techSupport.length];
//     let laterDate =
//       tech.registerDate > user.registerDate
//         ? tech.registerDate
//         : user.registerDate;
//     let date = randomDate(laterDate, new Date());

//     const ticket = await createTicket(user, tech, company, date);
//     // Make Tasks
//     await generateRandomTicketTasks(tech, ticket.id, ticket.createdAt);
//   }
// };

// newTicket = async (user, tech, company, date, ticketInfo) => {
const createTicket = (user, tech, company, date) => {
  const ticketInfo = randomItem(issues);
  const ticketDate = randomDate(date, new Date());
  const ticket = newTicket(user, tech, company, ticketDate, ticketInfo);
  return ticket;
};

const generateRandomTicketTasks = async (user, ticketId, createDate) => {
  const tasks = [];
  const numOfTasks = Math.floor(Math.random() * 5) + 1;
  for (let j = 0; j < numOfTasks; j++) {
    const taskDate = randomDate(createDate, new Date());
    const description = randomItem(tasks);
    const task = newTicketTask(
      user,
      ticketId,
      description,
      taskDate,
      taskDate,
      randomTaskDuration()
    );
    tasks.push(task);
  }
  await TicketTask.insertMany(tasks);
};

const makeIssue = (user, projectId, projectDate) => {
  const _issue = randomItem(issues);
  const issueDate = randomDate(projectDate, new Date());
  const issue = newIssue(user, projectId, issueDate, _issue);
  return issue;
};

const makeTeam = async (company, leader) => {
  const allUsers = await User.find({
    company: company,
    _id: { $ne: leader._id },
  });

  const teamCount = Math.min(Math.floor(Math.random() * allUsers.length), 5);

  const team = [leader];
  for (let i = 0; i < teamCount; i++) {
    team.push(randomItem(allUsers));
  }
  return team;
};

const generateRandomTasks = async (user, issue, issueDate) => {
  const tasks = [];
  const numOfTasks = Math.floor(Math.random() * 20) + 1;

  for (let j = 0; j < numOfTasks; j++) {
    const taskDate = randomDate(issueDate, new Date());
    const description = randomItem(tasks);

    const task = newTask(
      user,
      issue.id,
      description,
      taskDate,
      taskDate,
      randomTaskDuration()
    );
    tasks.push(task);
  }
  const newTasks = await Task.insertMany(tasks);
  return newTasks;
};

const generateRandomTicketsAndTasks = async (user, issue, issueDate) => {
  // Get all users - create ticketTask
  // get technicians for tasks

  const numOfTasks = Math.floor(Math.random() * 20) + 1;
  for (let j = 0; j < numOfTasks; j++) {
    const taskDate = randomDate(issueDate, new Date());
    const description = randomItem(tasks);
    const task = await newTask(
      user,
      issue.id,
      description,
      taskDate,
      taskDate,
      randomTaskDuration()
    );
  }
};
