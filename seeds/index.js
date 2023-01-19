const mongoose = require("mongoose");
const User = require("../models/user");
const Project = require("../models/project");
const Issue = require("../models/issue");

const {
  tickets,
  firstname,
  lastname,
  role,
  status,
  priority,
  type,
} = require("./seedHelper");
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

const randomDate = (start, end) => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
};

const randomUser = () => {
  const f = Math.floor(Math.random() * firstname.length);
  const l = Math.floor(Math.random() * lastname.length);
  const r = Math.floor(Math.random() * role.length);
  const cdate = randomDate(new Date(2022, 6, 6), new Date());

  return new User({
    first: firstname[f],
    last: lastname[l],
    email: theemail(firstname[f], lastname[l]),
    role: role[r],
    registerDate: cdate,
  });
};

const theemail = (first, last) => {
  return `${first}.${last}@gmail.com`;
};

const seedDB = async () => {
  await Issue.deleteMany({});
  await Project.deleteMany({});
  await User.deleteMany({});

  for (let h = 0; h < 3; h++) {
    // Users
    const user = randomUser();

    // Projects
    const createdate = randomDate(new Date(2022, 6, 6), new Date());
    const enddate = new Date(createdate.getTime() + 72 * 60 * 60 * 1000);

    const project = new Project({
      title: "Project " + h,
      description: "Some Description " + h,
      owner: user,
      createDate: createdate,
      plannedEndDate: enddate,
      priority: priority[Math.floor(Math.random() * 4)],
    });

    await user.save();

    // Tickets
    for (let i = 0; i < 10; i++) {
      const d = randomDate(new Date(2022, 6, 6), new Date());
      const j = Math.floor(Math.random() * 3);
      const ticketUser = randomUser();

      const issue = new Issue({
        title: tickets[j].title,
        description: tickets[j].description,
        author: ticketUser,
        status: status[j],
        priority: priority[j],
        type: type[j],
        // project,
        createDate: d,
      });
      project.issues.push(issue);
      await issue.save();
      await ticketUser.save();
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
