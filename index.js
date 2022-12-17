const express = require("express");

const app = express();

app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/test", function (req, res) {
  res.send("test");
});

app.listen(3000, function (req, res) {
  console.log("Server started up");
});
