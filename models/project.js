const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
  title: String,
  description: String,
  owner: String,
  issues: [
    {
      type: Schema.Types.ObjectId,
      ref: "Issue",
      required: true,
    },
  ],
  // {
  //   type: Schema.Types.ObjectId,
  //   ref: "User",
  // },
  company: String,
});

module.exports = mongoose.model("Project", ProjectSchema);
