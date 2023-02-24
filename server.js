const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });
const app = require("./app");

// console.log(process.env);

const port = process.env.PORT || 3000;
app.listen(port, function (req, res) {
  console.log(`App running on port: ${port}...`);
  console.log("Server started up");
});
