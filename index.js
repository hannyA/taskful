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
app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/dashboard", async (req, res) => {
  const tickets = await Issue.find({});
  res.render("dashboard/index", { tickets });
});

app.get("/ticket/new", async (req, res) => {
  res.render("ticket/new");
});

app.post("/ticket", async (req, res) => {
  const ticket = new Issue(req.body.ticket);
  await ticket.save();
  res.redirect(`/ticket/${ticket._id}`);
});

app.get("/ticket/:id", async (req, res) => {
  const ticket = await Issue.findById(req.params.id);
  res.render("ticket/index", { ticket });
});

app.get("/ticket/:id/edit", async (req, res) => {
  const ticket = await Issue.findById(req.params.id);
  res.render("ticket/edit", { ticket });
});

app.get("/test", function (req, res) {
  res.send("test");
});

app.listen(3000, function (req, res) {
  console.log("Server started up");
});
