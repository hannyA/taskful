const User = require("../models/user");
const Project = require("../models/project");
const Issue = require("../models/issue");
const Task = require("../models/task");

const { randomUser, randomDate, newProject, newIssue } = require("./utils");

const { issues, type } = require("./seedHelper");

module.exports.seedDB = async (company) => {
  await Issue.deleteMany({});
  await Project.deleteMany({});
  await User.deleteMany({});
  await Task.deleteMany({});

  const defaultAdmin = randomUser(company);
  await defaultAdmin.save();

  for (let h = 0; h < 3; h++) {
    // Users
    const user = randomUser(company);
    const project = newProject(user, h);

    // const projId = project.id;
    await user.save();

    let issueDate = project.createDate;
    for (let i = 0; i < 10; i++) {
      const issue = await newIssue(company, project.id, issueDate, issues[i]);
      issueDate = issue.createDate;

      await issue.save();
      // await ticketUser.save();
    }

    await project.save();

    console.log("Project:", project);
  }
};
