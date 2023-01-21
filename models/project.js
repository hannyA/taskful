const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  title: String,
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  description: String,
  issues: [
    {
      type: Schema.Types.ObjectId,
      ref: "Issue",
      required: true,
    },
  ],
  company: String,
  priority: {
    type: String,
    enum: ["Low", "Medium", "High", "Very High"],
  },
  stage: {
    type: String,
    enum: ["New", "Complete", "Canceled", "On Hold", "Processing"],
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
