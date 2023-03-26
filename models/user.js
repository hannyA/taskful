const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

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
    unique: true,
  },
  dob: {
    type: String,
    required: false,
  },
  company: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["Admin", "Technician", "User"],
  },
  registerDate: {
    type: Date,
    default: Date.now,
  },
  timezone: {
    // offset from UTC in minutes
    type: Number,
    required: true,
    default: 0,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
});

// Adds username and password
UserSchema.plugin(passportLocalMongoose);

// Create a virtual property `fullname`
UserSchema.virtual("fullname").get(function () {
  return `${this.first} ${this.last}`;
  // return this.email.slice(this.email.indexOf('@') + 1);
});

// UserSchema.pre("save", function (next) {
//   let now = new Date();
//   this.timezone = now.getTimezoneOffset();
//   next();
// });

// UserSchema.pre("/^find/", function (next) {
//   this.find({ deleted: { $ne: true } });
//   next();
// });

module.exports = mongoose.model("User", UserSchema);
