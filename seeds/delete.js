const mongoose = require("mongoose");
const { deleteDB } = require("./app");

mongoose.set("strictQuery", false);
mongoose.connect("mongodb://localhost:27017/issue-tracker", {});

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
