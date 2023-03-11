const User = require("../models/user");
const Project = require("../models/project");
const Issue = require("../models/issue");
const Task = require("../models/task");

const {
  generateUser,
  // randomDate,
  newProject,
  newIssue,
  daysBeforeDate,
  randomUser,
} = require("./utils");

const { issues, type } = require("./seedHelper");

module.exports.deleteDB = async () => {
  await Issue.deleteMany({});
  await Project.deleteMany({});
  await User.deleteMany({});
  await Task.deleteMany({});
};

module.exports.makeAdmin = async (
  company,
  role,
  firstname,
  lastname,
  password,
  email
) => {
  const adminUser = await generateUser(
    company,
    role || "Admin",
    firstname || "John",
    lastname || "Doe",
    daysBeforeDate(),
    password || "a",
    email
  );

  console.log("1) seedDB - adminUser: ", adminUser);

  if (adminUser === null) {
    return null;
  }
  const defaultAdmin = adminUser.registeredUser;
  return defaultAdmin;
};

module.exports.seedDB = async (company) => {
  //TODO: create projects, issues and tasks assigned to defaultAdmin
  for (let h = 0; h < 3; h++) {
    // Users
    console.log("seedDB: Adding new user");

    const { user } = await randomUser(company);
    console.log("seedDB >  Adding user: ", user);
    if (user === null) break;
    console.log("seedDB > Adding user: ", user);

    console.log("seedDB > Adding new project");
    const project = newProject(user, h);
    await project.save();

    // await user.save();

    let issueDate = project.createDate;
    console.log("Adding new issues");
    for (let i = 0; i < 10; i++) {
      const issue = await newIssue(company, project.id, issueDate, issues[i]);
      issueDate = issue.createDate;

      await issue.save();
      // await ticketUser.save();
    }
  }
};
