const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Issue = require("./models/issue");

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

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/dashboard", async (req, res) => {
  const issues = await Issue.find({});
  res.render("dashboard/index", { issues });
});

app.get("/makeissue", async (req, res) => {
  const issue = new Issue({
    title: "Server down",
    description: "Can't connect to the server",
    author: "John Mcclaine",
    status: "Opened",
  });
  await issue.save();
  res.send(issue);
});

app.get("/test", function (req, res) {
  res.send("test");
});

app.listen(3000, function (req, res) {
  console.log("Server started up");
});
