const User = require("../models/user");
const Project = require("../models/project");
const Issue = require("../models/issue");

const {
  firstname,
  lastname,
  roles,
  projectTitles,
  projectStatus,
  issueStatus,
  priorities,
  issueType,
} = require("./seedHelper");

const randomItem = (items) => {
  const a = Math.floor(Math.random() * items.length);
  return items[a];
};

const getEmail = (first, last, email) => {
  return `${first}.${last}@${email}`;
};

const makeEmail = (first, last, company) => {
  return `${first}.${last}@${company}.com`;
};

module.exports.randomUser = async (company, role) => {
  const _first = randomItem(firstname);
  const _last = randomItem(lastname);
  const _role = role || randomItem(roles);
  const regDate = randomDate(new Date(2022, 6, 1), new Date());
  const _email = makeEmail(_first, _last, company);

  // Find unique email so we don't dupslicate
  const dupslicateUsers = await User.find({
    email: _email,
  });

  if (dupslicateUsers.length > 0) return randomUser(company, role);

  return new User({
    first: _first,
    last: _last,
    username: _email,
    email: _email,
    role: _role,
    registerDate: regDate,
    company: company,
  });
};

module.exports.newProject = (user, h) => {
  const startDate = randomDate(user.registerDate, new Date());

  let endDate = new Date();
  endDate.setDate(startDate.getDate() + 7 + Math.random() * 120); // b

  // const enddate = new Date(createdate.getTime() + 72 * 60 * 60 * 1000);

  // const endDate = randomDate(createDate, new Date());
  const project = new Project({
    title: projectTitles[h].title,
    description: projectTitles[h].description,
    owner: user,
    createDate: startDate,
    plannedEndDate: endDate,
    priority: randomItem(priorities),
    status: randomItem(projectStatus),
    company: user.company,
  });
  return project;
};

module.exports.newIssue = async (company, projectId, nextDate, _issue) => {
  const allAdmins = await User.find({
    company,
    $or: [{ role: "Admin" }, { role: "Technician" }],
  });

  const techSupport = randomItem(allAdmins);

  const issue = new Issue({
    title: _issue.title,
    description: _issue.description,
    author: techSupport,
    status: randomItem(issueStatus),
    priority: randomItem(priorities),
    type: randomItem(issueType),
    project: projectId,
    createDate: dateWithinDays(nextDate, 3),
  });

  return issue;
};

// Return date after date but before date + n days
const dateWithinDays = (date, days) => {
  let endDate = new Date(date);
  endDate.setDate(date.getDate() + Math.random() * days);
};
// Get date from somewhere between start and end
const randomDate = (start, end) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};

module.exports.randomDate = randomDate;
