const mongoose = require("mongoose");
const Issue = require("../models/issue");
const Project = require("../models/project");
const { tickets, users, status, priority, type } = require("./seedHelper");
/*
Dev Start Mongo db: 
brew services start mongodb-community@6.0

Dev Stop Mongo db: 
brew services stop mongodb-community@6.0


Seed database: 
node seeds/index.js   

*/

mongoose.connect("mongodb://localhost:27017/issue-tracker", {
  // useNewUrlParser: true,
  // useCreateIndex: true,
  // useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const seedDB = async () => {
  await Issue.deleteMany({});
  await Project.deleteMany({});

  for (let h = 0; h < 3; h++) {
    const project = new Project({
      title: "Project " + h,
      description: "Some Description " + h,
      owner: users[h],
    });

    for (let i = 0; i < 10; i++) {
      const j = Math.floor(Math.random() * 3);
      const issue = new Issue({
        title: tickets[j].title,
        description: tickets[j].description,
        author: users[j],
        status: status[j],
        priority: priority[j],
        type: type[j],
        project,
      });
      project.issues.push(issue);
      await issue.save();
    }
    await project.save();
  }
};

seedDB(() => {
  console.log("Seeding database");
}).then(() => {
  console.log("CLosing database");
  mongoose.connection.close();
});
