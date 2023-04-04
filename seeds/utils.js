const User = require("../models/user");
const Project = require("../models/project");
const Issue = require("../models/issue");
const Task = require("../models/task");
const Ticket = require("../models/ticket");
const TicketTask = require("../models/ticket-task");

const {
  firstnames,
  lastnames,
  roles,
  projectTitles,
  projectStatus,
  issueStatus,
  priorities,
  issueType,
  ticketType,
} = require("./seedHelper");
const user = require("../models/user");

module.exports.createUser = async (
  company,
  role,
  firstname,
  lastname,
  registerDate,
  password,
  email
) => {
  const _firstname = firstname || randomItem(firstnames);
  const _lastname = lastname || randomItem(lastnames);
  const _role = role || randomItem(roles);
  const regDate = registerDate || randomDate(new Date(2022, 6, 1), new Date());
  const _email = email || makeEmail(_firstname, _lastname, company);

  // TODO: Test to remove this function. Maybe redundant
  // since Use.register may throw duplcate error?
  // Find unique email so we don't dupslicate
  const dupslicateUsers = await User.find({
    email: _email,
  });

  if (dupslicateUsers.length > 0) return null;

  const newUser = new User({
    first: _firstname,
    last: _lastname,
    username: _email,
    email: _email,
    role: _role,
    registerDate: regDate,
    company: company,
  });

  const user = await this.registerUser(newUser, password);
  return user;
};

module.exports.registerUser = async (user, password) => {
  const _password = password || generatePassword();
  try {
    const registeredUser = await User.register(user, _password);
    return registeredUser;
  } catch (e) {
    return null;
  }
};

module.exports.newProject = (user, projectTitles, team) => {
  const startDate = randomDate(user.registerDate, new Date());
  let endDate = new Date();
  endDate.setDate(startDate.getDate() + 7 + Math.random() * 120); // b

  // const enddate = new Date(createdAt.getTime() + 72 * 60 * 60 * 1000);
  // const endDate = randomDate(createdAt, new Date());
  const project = new Project({
    title: projectTitles.title,
    description: projectTitles.description,
    owner: user,
    createdAt: startDate,
    plannedEndDate: endDate,
    priority: randomItem(priorities),
    status: randomItem(projectStatus),
    company: user.company,
    team: team,
  });
  return project;
};

module.exports.newIssue = async (user, projectId, date, _issue) => {
  const issue = new Issue({
    title: _issue.title,
    description: _issue.description,
    author: user,
    status: randomItem(issueStatus),
    priority: randomItem(priorities),
    type: randomItem(issueType),
    project: projectId,
    createdAt: date,
    updatedAt: date,
  });
  await issue.save();
  return issue;
};

module.exports.newTask = async (
  user,
  issueId,
  description,
  createdAt,
  updatedAt,
  duration
) => {
  const task = new Task({
    description: description,
    author: user,
    issue: issueId,
    createdAt: createdAt,
    updatedAt: updatedAt,
    duration: duration,
  });

  await task.save();
  return task;
};

module.exports.newTicket = async (user, tech, company, date, ticket) => {
  const _ticket = new Ticket({
    title: ticket.title,
    description: ticket.description,
    owner: user,
    assignee: tech,
    status: randomItem(issueStatus),
    company: company,
    priority: randomItem(priorities),
    type: randomItem(ticketType),
    createdAt: date,
    updatedAt: date,
  });
  await _ticket.save();
  return _ticket;
};

module.exports.newTicketTask = async (
  user,
  ticketId,
  description,
  createdAt,
  updatedAt,
  duration
) => {
  const task = new TicketTask({
    description: description,
    author: user,
    ticket: ticketId,
    duration: duration,
    createdAt: createdAt,
    updatedAt: updatedAt,
  });

  await task.save();
  return task;
};

const getEmail = (first, last, email) => {
  return `${first}.${last}@${email}`;
};

const makeEmail = (first, last, company) => {
  return `${first}.${last}@${company}.com`;
};
// Return date after date but before date + n days
const daysAfterDate = (date, days) => {
  let endDate = new Date(date);
  endDate.setDate(date.getDate() + Math.random() * days);
};

// new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

const daysBeforeToday = (days) => {
  let today = new Date();
  let before = new Date();
  before.setDate(today.getDate() - days);
  return before;
};
module.exports.daysBeforeToday = daysBeforeToday;

function generatePassword() {
  var length = 8,
    charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    retVal = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}

const generateUser = async (company, numOfUsers) => {
  let users = [];

  for (let i = 0; i < numOfUsers; i++) {
    const _firstname = firstnames[i % firstnames.length];
    const _lastname = lastnames[i % lastnames.length];
    const _role = roles[i % roles.length];
    const regDate = randomDate(new Date(2022, 6, 1), new Date());
    const _email = makeEmail(_firstname, _lastname, company);

    const newUser = new User({
      first: _firstname,
      last: _lastname,
      username: _email,
      email: _email,
      role: _role,
      registerDate: regDate,
      company: company,
    });
    users.push(newUser);
  }

  console.log("users: ", users);
  // Function call
  const newUsers = await User.insertMany(users);
  return newUsers;
};

// const generateUser = async (company) => {
//   const maxTries = 5;

//   for (let i = 0; i < maxTries; i++) {
//     const user = await this.createUser(company);
//     if (user !== null) {
//       return user;
//     }
//   }
//   return null;
// };
module.exports.generateUser = generateUser;

const randomTaskDuration = () => {
  return 5 * (1 + Math.floor(Math.random() * 35));
};
module.exports.randomTaskDuration = randomTaskDuration;

const randomItem = (items) => {
  const a = Math.floor(Math.random() * items.length);
  return items[a];
};
module.exports.randomItem = randomItem;

// Get date from somewhere between start and end
const randomDate = (start, end) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};
module.exports.randomDate = randomDate;
