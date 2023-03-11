const User = require("../models/user");
const Project = require("../models/project");
const Issue = require("../models/issue");

const {
  firstnames,
  lastnames,
  roles,
  projectTitles,
  projectStatus,
  issueStatus,
  priorities,
  issueType,
} = require("./seedHelper");

module.exports.generateUser = async (
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

  const b = await this.registerUser(newUser, password);
  return b;
};

module.exports.registerUser = async (user, password) => {
  const _password = password || generatePassword();
  try {
    const registeredUser = await User.register(user, _password);
    const a = { registeredUser: registeredUser, user: user };
    return a;
  } catch (e) {
    return null;
  }
};

module.exports.newProject = (user, h) => {
  console.log("newproj date ob: ", user);
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
    createDate: daysAfterDate(nextDate, 3),
  });

  return issue;
};

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
// Return date after date but before date + n days
const daysAfterDate = (date, days) => {
  let endDate = new Date(date);
  endDate.setDate(date.getDate() + Math.random() * days);
};
const daysBeforeDate = () => {
  let today = new Date();
  let before = new Date();
  before.setDate(today.getDate() - 30);
};

module.exports.daysBeforeDate = daysBeforeDate;

function generatePassword() {
  var length = 8,
    charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    retVal = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}

const randomUser = async (company) => {
  const maxTries = 5;

  for (let i = 0; i < maxTries; i++) {
    const user = await this.generateUser(company);
    if (user !== null) {
      return user;
    }
  }
  return null;
};
module.exports.randomUser = randomUser;

// Get date from somewhere between start and end
const randomDate = (start, end) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};

module.exports.randomDate = randomDate;
