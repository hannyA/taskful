const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  last: {
    type: String,
    required: true,
  },
  first: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: [true, "Email required"],
  },
  dob: {
    type: String,
    required: false,
  },
  company: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    required: true,
  },
  registerDate: {
    type: Date,
    default: Date.now,
  },
});

// Create a virtual property `fullname`
UserSchema.virtual("fullname").get(function () {
  return `${this.first} ${this.last}`;
  // return this.email.slice(this.email.indexOf('@') + 1);
});

module.exports = mongoose.model("User", UserSchema);
