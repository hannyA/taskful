const mongoose = require("mongoose");
const { makeAdmin, seedDB, deleteDB } = require("./app");
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
  await deleteDB();

  // create all users
  /**
   * for every user
   *  create a project
   *    for every project -> assign 3-9 members to proj
   *
   *      FOr every user assign 2 - 7 issues
   *      For every issue
   *
   *
   */
  for (let company of companies) {
    const admin = await makeAdmin(company);
    console.log("company: ", company);
    await seedDB(company, admin);
  }
};

runSeed(() => {
  console.log("Seeding database");
}).then(() => {
  console.log("CLosing database");
  mongoose.connection.close();
});

module.exports.runSeed = runSeed;
