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
});

module.exports = mongoose.model("User", UserSchema);
