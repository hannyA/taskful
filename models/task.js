const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { formatDate, formatTime } = require("../utils/modelUtils");

const TaskSchema = new Schema({
  description: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // status: {
  //   type: String,
  //   enum: ["New", "Assigned", "In Progress", "Solved", "Closed"],
  //   default: "New",
  // },
  issue: {
    type: Schema.Types.ObjectId,
    ref: "Issue",
  },
  // priority: {
  //   type: String,
  //   enum: ["Low", "Medium", "High", "Very High"],
  //   default: "Low",
  // },
  createDate: {
    type: Date,
    default: Date.now,
  },
  lastUpdate: {
    type: Date,
    default: Date.now,
  },
  duration: {
    type: Number,
    default: 0,
    // hours: {
    //   type: Number,
    //   default: 0,
    // },
    // minutes: {
    //   type: Number,
    //   default: 0,
    // },
  },
});

// Create a virtual property `fullname`
TaskSchema.virtual("lastUpdateFormat").get(function () {
  let d = formatDate(this.lastUpdate);
  let t = formatTime(this.lastUpdate);
  return `${d} - ${t}`;
});

// Create a virtual property `fullname`
TaskSchema.virtual("createDateFormat").get(function () {
  return formatDate(this.createDate);
});

// Create a virtual property `fullname`
TaskSchema.virtual("createDateTimeFormat").get(function () {
  let d = formatDate(this.createDate);
  let t = formatTime(this.createDate);
  return `${d} - ${t}`;
});

// Create a virtual property `hours`
TaskSchema.virtual("hours").get(function () {
  console.log(" TaskSchema.virtual(hours):", this.duration);
  console.log(" TaskSchema.virtual(hours):", this.duration / 60);
  return Math.floor(this.duration / 60);
});

// Create a virtual property `minutes`
TaskSchema.virtual("minutes").get(function () {
  return this.duration % 60;
});

module.exports = mongoose.model("Task", TaskSchema);
