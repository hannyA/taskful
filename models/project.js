const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { formatDate, formatTime } = require("../utils/modelUtils");

const User = require("./user");

const ProjectSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    team: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
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
    status: {
      type: String,
      enum: ["New", "Complete", "Canceled", "On Hold", "In Progress"],
      default: "New",
    },
    plannedStartDate: {
      type: Date,
    },

    plannedEndDate: {
      type: Date,
    },
  },
  { timestamps: true }
  // doc.createdAt = new Date(0);
  // doc.updatedAt = new Date(0);
);

ProjectSchema.virtual("startDateFormat").get(function () {
  console.log("this.startDateFormat:, ", this.plannedStartDate);
  return this.plannedStartDate === undefined
    ? null
    : formatDate(this.plannedStartDate);
});

ProjectSchema.virtual("plannedEndDateFormat").get(function () {
  console.log("this.plannedEndDate:, ", this.plannedEndDate);
  return this.plannedEndDate === undefined
    ? null
    : formatDate(this.plannedEndDate);
});

ProjectSchema.virtual("createdAtDate").get(function () {
  return formatDate(this.createdAt);
});

// ProjectSchema.post("find", function (docs, next) {
//   let now = new Date();
//   let offset = now.getTimezoneOffset();
//   docs.forEach((doc) => {
//     doc.createdAt = new Date(doc.createdAt.getTime() - offset * 60000);
//   });

//   next();
// });

module.exports = mongoose.model("Project", ProjectSchema);
