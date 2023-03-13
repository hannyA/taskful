const mongoose = require("mongoose");
const path = require("path");

const { deleteDB } = require("./app");

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

const run = async () => {
  await deleteDB();
};

run(() => {
  console.log("Deleting database");
}).then(() => {
  console.log("Closing database");
  mongoose.connection.close();
});
