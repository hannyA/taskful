const User = require("../models/user");
const Project = require("../models/project");
const Issue = require("../models/issue");
const Task = require("../models/task");

const {
  randomUser,
  // randomDate,
  newProject,
  newIssue,
  daysBeforeDate,
} = require("./utils");

const { issues, type } = require("./seedHelper");

module.exports.deleteDB = async () => {
  await Issue.deleteMany({});
  await Project.deleteMany({});
  await User.deleteMany({});
  await Task.deleteMany({});
};

module.exports.seedDB = async (company) => {
  console.log("Adding Admin");
  console.log("company: ", company);
  const defaultAdmin = await randomUser(
    company,
    "Admin",
    "John",
    "Doe",
    daysBeforeDate(),
    "a"
  );
  await defaultAdmin.save();

  for (let h = 0; h < 3; h++) {
    // Users
    console.log("Adding new user");
    const user = await randomUser(company);

    console.log("Adding new project");
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
