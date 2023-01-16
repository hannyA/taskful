const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const Issue = require("./models/issue");
const Project = require("./models/project");

const projectRoutes = require("./routes/projects");
const ticketRoutes = require("./routes/tickets");
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
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use("/project", projectRoutes);
app.use("/ticket", ticketRoutes);

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/dashboard", async (req, res) => {
  res.render("dashboards/index");
});

app.get("/credits", async (req, res) => {
  res.render("others/credits");
});

app.use("*", (req, res) => {
  res.status(404).send("Not found");
});
app.listen(3000, function (req, res) {
  console.log("Server started up");
});
