const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { formatDate, formatTime } = require("../utils/modelUtils");

const TicketSchema = new Schema(
  {
    title: String,
    description: String,
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    assignee: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["New", "Assigned", "In Progress", "Solved", "Closed"],
      default: "New",
    },
    company: {
      type: String,
      required: true,
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
TicketSchema.virtual("updatedAtDate").get(function () {
  let d = formatDate(this.updatedAt);
  let t = formatTime(this.updatedAt);
  return `${d} - ${t}`;
});

// Create a virtual property `fullname`
TicketSchema.virtual("createdAtDate").get(function () {
  return formatDate(this.createdAt);
});

module.exports = mongoose.model("Ticket", TicketSchema);
