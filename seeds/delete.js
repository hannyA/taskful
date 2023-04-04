const mongoose = require("mongoose");
const path = require("path");

const dotenv = require("dotenv");
dotenv.config({ path: path.join(__dirname, "../config.env") });

mongoose.set("strictQuery", false);

// Get dev/prod url
let localDB = process.env.DATABASE_LOCAL;
console.log("localDB: ", localDB);

let remoteDB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
).replace("<USERNAME>", process.env.DATABASE_USERNAME);
console.log("remoteDB: ", remoteDB);

let mongoDB = process.env.NODE_ENV === "development" ? localDB : remoteDB;

console.log("mongoDB: ", mongoDB);

mongoose.connect(mongoDB, {});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const User = require("../models/user");
const Project = require("../models/project");
const Issue = require("../models/issue");
const Task = require("../models/task");
const Ticket = require("../models/ticket");
const TicketTask = require("../models/ticket-task");

const deleteDB = async () => {
  await Issue.deleteMany({});
  await Project.deleteMany({});
  await User.deleteMany({});
  await Task.deleteMany({});
  await Ticket.deleteMany({});
  await TicketTask.deleteMany({});
};

const run = async () => {
  await deleteDB();
};

run(() => {
  console.log("Deleting database");
}).then(() => {
  console.log("Closing database");
  mongoose.connection.close();
});
