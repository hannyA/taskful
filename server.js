const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");

mongoose.set("strictQuery", false);

let localDB = process.env.DATABASE_LOCAL;
let remoteDB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
).replace("<USERNAME>", process.env.DATABASE_USERNAME);

let mongoDB = process.env.NODE_ENV === "development" ? localDB : remoteDB;

console.log("process.env.NODE_ENV: ", process.env.NODE_ENV);

main().catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
  console.log("MongoDB connection successful!");
}

// mongoose.connect("mongodb://localhost:27017/issue-tracker", {
// useNewUrlParser: true,
// useCreateIndex: true,
// useUnifiedTopology: true,
// });

// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error:"));
// db.once("open", () => {
//   console.log("Database connected");
// });

const port = process.env.PORT || 3000;
app.listen(port, function (req, res) {
  console.log(`App running on port: ${port}...`);
  console.log("Server started up");
});
