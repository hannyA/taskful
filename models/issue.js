const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { formatDate, formatTime } = require("../utils/modelUtils");

const IssueSchema = new Schema(
  {
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
  },
  { timestamps: true }
  // doc.createdAt = new Date(0);
  // doc.updatedAt = new Date(0);
);

// Create a virtual property `fullname`
IssueSchema.virtual("updatedAtDate").get(function () {
  let d = formatDate(this.updatedAt);
  let t = formatTime(this.updatedAt);
  return `${d} - ${t}`;
});

// Create a virtual property `fullname`
IssueSchema.virtual("createdAtDate").get(function () {
  return formatDate(this.createdAt);
});

module.exports = mongoose.model("Issue", IssueSchema);
