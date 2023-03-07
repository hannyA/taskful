const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  company: {
    type: String,
    required: true,
  },
  description: String,
  issues: [
    {
      type: Schema.Types.ObjectId,
      ref: "Issue",
      // required: true,
    },
  ],
  priority: {
    type: String,
    enum: ["Low", "Medium", "High", "Very High"],
    default: "Low",
  },
  stage: {
    type: String,
    enum: ["New", "Complete", "Canceled", "On Hold", "In Progress"],
    default: "New",
  },
  createDate: {
    type: Date,
    default: Date.now,
  },
  plannedStartDate: {
    type: Date,
  },

  plannedEndDate: {
    type: Date,
  },
});

module.exports = mongoose.model("Project", ProjectSchema);
