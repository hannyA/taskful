const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { formatDate, formatTime } = require("../utils/modelUtils");

const IssueSchema = new Schema({
  title: String,
  description: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  status: {
    type: String,
    enum: ["New", "Assigned", "In Progress", "Solved", "Closed"],
    default: "New",
  },
  project: {
    type: Schema.Types.ObjectId,
    ref: "Project",
    // required: true,
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High", "Very High"],
    default: "Low",
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

// Create a virtual property `fullname`
IssueSchema.virtual("lastUpdateFormat").get(function () {
  let d = formatDate(this.lastUpdate);
  let t = formatTime(this.lastUpdate);
  return `${d} - ${t}`;
});

// Create a virtual property `fullname`
IssueSchema.virtual("createDateFormat").get(function () {
  return formatDate(this.createDate);
});

module.exports = mongoose.model("Issue", IssueSchema);
