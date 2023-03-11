const User = require("../models/user");
const Project = require("../models/project");
const Issue = require("../models/issue");
const Task = require("../models/task");

const {
  createUser,
  // randomDate,
  newProject,
  newIssue,
  daysBeforeDate,
  generateUser,
  randomItem,
} = require("./utils");

const { issues, type, projectTitles } = require("./seedHelper");

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
    daysBeforeDate(),
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
  // Create projets for all project leaders
  for (let i = 0; i < projectTitles.length; i++) {
    const projectInfo = projectTitles[i];
    const projLeader = projectLeaders[i % projectLeaders.length];
    const project = newProject(projLeader, projectInfo);
    await project.save();

    // Add issues for project
    let issueDate = project.createDate;
    console.log("Adding new issues");
    for (let i = 0; i < 10; i++) {
      const _issue = randomItem(issues);
      const user = randomItem(allUsers);

      const issue = await newIssue(
        company,
        user,
        project.id,
        issueDate,
        _issue
      );
      await issue.save();
      issueDate = issue.createDate;
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
