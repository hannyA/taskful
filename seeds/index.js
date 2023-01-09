const mongoose = require("mongoose");
const Issue = require("../models/issue");
const { tickets, users, status, priority, type } = require("./seedHelper");
/*
Dev Start Mongo db: 
brew services start mongodb-community@6.0

Dev Stop Mongo db: 
brew services stop mongodb-community@6.0

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
  for (let i = 0; i < 10; i++) {
    const j = Math.floor(Math.random() * 3);
    const issue = new Issue({
      title: tickets[j].title,
      description: tickets[j].description,
      author: users[j],
      status: status[j],
      priority: priority[j],

      type: type[j],
    });
    await issue.save();
  }
};

seedDB(() => {
  console.log("Seeding database");
}).then(() => {
  console.log("CLosing database");
  mongoose.connection.close();
});
