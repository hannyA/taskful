const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { formatDate, formatTime } = require("../utils/modelUtils");

const TaskSchema = new Schema(
  {
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
  },
  { timestamps: true }
  // doc.createdAt = new Date(0);
  // doc.updatedAt = new Date(0)
);

TaskSchema.virtual("updatedAtDate").get(function () {
  let d = formatDate(this.updatedAt);
  let t = formatTime(this.updatedAt);
  return `${d} - ${t}`;
});

TaskSchema.virtual("createdAtDate").get(function () {
  return formatDate(this.createdAt);
});

TaskSchema.virtual("createdAtDateTime").get(function () {
  let d = formatDate(this.createdAt);
  let t = formatTime(this.createdAt);
  return `${d} - ${t}`;
});

// Create a virtual property `hours`
TaskSchema.virtual("hours").get(function () {
  return Math.floor(this.duration / 60);
});

// Create a virtual property `minutes`
TaskSchema.virtual("minutes").get(function () {
  return this.duration % 60;
});

module.exports = mongoose.model("Task", TaskSchema);
