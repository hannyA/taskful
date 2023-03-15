const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { formatDate, formatTime } = require("../utils/modelUtils");

const TicketTaskSchema = new Schema(
  {
    description: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    ticket: {
      type: Schema.Types.ObjectId,
      ref: "Ticket",
    },
    duration: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
  // doc.createdAt = new Date(0);
  // doc.updatedAt = new Date(0)
);

// Create a virtual property `fullname`
TicketTaskSchema.virtual("updatedAtDate").get(function () {
  let d = formatDate(this.updatedAt);
  let t = formatTime(this.updatedAt);
  return `${d} - ${t}`;
});

// Create a virtual property `fullname`
TicketTaskSchema.virtual("createdAtDate").get(function () {
  return formatDate(this.createdAt);
});

// Create a virtual property `fullname`
TicketTaskSchema.virtual("createdAtDateTime").get(function () {
  let d = formatDate(this.createdAt);
  let t = formatTime(this.createdAt);
  return `${d} - ${t}`;
});

// Create a virtual property `hours`
TicketTaskSchema.virtual("hours").get(function () {
  return Math.floor(this.duration / 60);
});

// Create a virtual property `minutes`
TicketTaskSchema.virtual("minutes").get(function () {
  return this.duration % 60;
});

module.exports = mongoose.model("TicketTask", TicketTaskSchema);
