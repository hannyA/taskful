const app = require("./app");

const port = 3000;
app.listen(port, function (req, res) {
  console.log(`App running on port: ${port}...`);
  console.log("Server started up");
});
