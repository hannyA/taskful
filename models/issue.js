const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const IssueSchema = new Schema({
  title: String,
  description: String,
  author: String,
  status: String,
  project: {
    type: Schema.Types.ObjectId,
    ref: "Project",
    require: true,
  },
});

module.exports = mongoose.model("Issue", IssueSchema);
