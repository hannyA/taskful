const express = require("express");
const app = express();
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/test", function (req, res) {
  res.send("test");
});

app.listen(3000, function (req, res) {
  console.log("Server started up");
});
