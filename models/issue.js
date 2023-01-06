const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const IssueSchema = new Schema({
  title: String,
  description: String,
  author: String,
  status: String,
});

module.exports = mongoose.model("Issue", IssueSchema);
