const mongoose = require("mongoose");
const { seedDB } = require("./app");
const { companies } = require("./seedHelper");
mongoose.set("strictQuery", false);

mongoose.connect("mongodb://localhost:27017/issue-tracker", {});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

// runSeeds(() => {
//   for (let company of companies) {
//     seedDB(company, () => {
//       console.log("Seeding database");
//     }).then(() => {
//       console.log("CLosing database");
//       mongoose.connection.close();
//     });
//   }
// });

// seedDB("apple", () => {
//   console.log("Seeding database");
// }).then(() => {
//   console.log("CLosing database");
//   mongoose.connection.close();
// });

const runSeed = async () => {
  for (let company of companies) {
    await seedDB(company);
  }
};

runSeed(() => {
  console.log("Seeding database");
}).then(() => {
  console.log("CLosing database");
  mongoose.connection.close();
});

module.exports.runSeed = runSeed;
