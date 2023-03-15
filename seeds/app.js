const User = require("../models/user");
const Project = require("../models/project");
const Issue = require("../models/issue");
const Task = require("../models/task");

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
} = require("./utils");

const { issues, type, projectTitles, tasks } = require("./seedHelper");
const ticketTask = require("../models/ticket-task");

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

module.exports.seedDB = async (company, admin) => {
  //TODO: create projects, issues and tasks assigned to defaultAdmin

  const numberOfUsers = 10;
  // Create random users in database
  for (let i = 0; i < numberOfUsers; i++) {
    await generateUser(company);
  }

  const allUsers = await User.find({
    company,
  });

  //For 1/10 team create projects, including Admin
  const numOfLeaders = Math.floor(numberOfUsers / 10);

  const projectLeaders = await User.find({
    company: company,
    _id: { $ne: admin._id },
  }).limit(numOfLeaders);

  projectLeaders.push(admin);
  console.log("projectLeaders: ", projectLeaders);

  // Create projects for all project leaders
  for (let i = 0; i < projectTitles.length; i++) {
    const projectInfo = projectTitles[i];
    const projLeader = projectLeaders[i % projectLeaders.length];
    // console.log("project leader: ", projLeader.first, projLeader.last);

    const team = await makeTeam(company, projLeader);

    const project = newProject(projLeader, projectInfo, team);
    await project.save();

    // Add issues for project
    let projectDate = project.createdAt;

    // Create at least one issue for demo user
    if (projLeader.id === admin.id) {
      await makeIssue(admin, project.id, projectDate);
    }

    // Add more issues assigned randomly
    for (let i = 0; i < 10; i++) {
      const user = randomItem(team);
      await makeIssue(user, project.id, projectDate);
    }
  }
};

const makeIssue = async (user, projectId, projectDate) => {
  const _issue = randomItem(issues);
  const issueDate = randomDate(projectDate, new Date());
  const issue = await newIssue(user, projectId, issueDate, _issue);

  await generateRandomTasks(user, issue, issue.createdAt);
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
