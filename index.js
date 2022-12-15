const express = require("express");

const app = express();

app.get("/", function (req, res) {
  res.send("Hello");
});

app.get("/test", function (req, res) {
  res.send("test");
});

app.listen(3000, function (req, res) {
  console.log("Server started up");
});
