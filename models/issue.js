const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const IssueSchema = new Schema({
  title: String,
  description: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: String,
  project: {
    type: Schema.Types.ObjectId,
    ref: "Project",
    // required: true,
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High", "Very High"],
  },
  createDate: {
    type: Date,
    default: Date.now,
  },
  lastUpdate: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Issue", IssueSchema);
