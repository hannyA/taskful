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

  // Create projets for all project leaders
  for (let i = 0; i < projectTitles.length; i++) {
    const projectInfo = projectTitles[i];
    const projLeader = projectLeaders[i % projectLeaders.length];
    // console.log("project leader: ", projLeader.first, projLeader.last);
    const project = newProject(projLeader, projectInfo);
    await project.save();

    // Add issues for project
    let projectDate = project.createDate;

    if (projLeader.id === admin.id) {
      const _issue = randomItem(issues);
      const issueDate = randomDate(projectDate, new Date());
      const issue = await newIssue(admin, project.id, issueDate, _issue);
      await generateRandomTasks(admin, issue, issueDate);
    }

    // console.log("Adding new issues");
    for (let i = 0; i < 10; i++) {
      const _issue = randomItem(issues);
      const user = randomItem(allUsers);

      const issueDate = randomDate(projectDate, new Date());
      const issue = await newIssue(user, project.id, issueDate, _issue);
      // issueDate = issue.createDate;
      // console.log("Adding new tasks");

      await generateRandomTasks(user, issue, issue.createDate);

      // const numOfTasks = Math.floor(Math.random() * 20) + 1;
      // for (let j = 0; j < numOfTasks; j++) {
      //   const taskDate = randomDate(issue.createDate, new Date());
      //   const description = randomItem(tasks);
      //   const task = await newTask(
      //     user,
      //     issue.id,
      //     description,
      //     taskDate,
      //     taskDate,
      //     randomTaskDuration()
      //   );
      // }
    }
  }

  // const projectInfo = projectTitles[projectTitles.length];
  // const project = newProject(admin, h);
  // await project.save();

  // for (let i = 0; i < users.length; i++) {
  //   // Get user id
  //   // create project
  //   // assign team members
  // }

  // for (let h = 0; h < 3; h++) {
  //   // Users
  //   console.log("seedDB: Adding new user");

  //   const { user } = await generateUser(company);
  //   console.log("seedDB >  Adding user: ", user);
  //   if (user === null) break;
  //   console.log("seedDB > Adding user: ", user);

  //   console.log("seedDB > Adding new project");
  //   const project = newProject(user, h);
  //   await project.save();

  //   // await user.save();

  //   let issueDate = project.createDate;
  //   console.log("Adding new issues");
  //   for (let i = 0; i < 10; i++) {
  //     const issue = await newIssue(company, project.id, issueDate, issues[i]);
  //     issueDate = issue.createDate;

  //     await issue.save();
  //     // await ticketUser.save();
  //   }
  // }
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
