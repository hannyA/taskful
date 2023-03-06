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

const formatDate = (date) => {
  let d = date.getDate();
  let m = date.getMonth() + 1;
  let y = date.getFullYear();
  return `${m}/${d}/${y}`;
};
const formatTime = (date) => {
  let h = date.getHours() % 12;
  let end = date.getHours() >= 12 ? "pm" : "am";
  let min = date.getMinutes();
  min = min < 10 ? `0${min}` : min;
  return `${h}:${min}${end}`;
};

// const formatDate = (date) => {
//   let d = date.getDate();
//   let m = date.getMonth() + 1;
//   let y = date.getFullYear();

//   let h = date.getHours() % 12;
//   let end = date.getHours() >= 12 ? "pm" : "am";
//   let min = date.getMinutes();
//   return `${m}/${d}/${y} - ${h}:${min}${end}`;
// };

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
