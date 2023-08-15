//import mongoose module
const mongoose = require("mongoose");
//import mongoose unique Validator module

const uniqueValidator = require("mongoose-unique-validator");

// create user Shema
const userSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  phone: { type: String, unique: true },
  adresse: String,
  pwd: String,
  confirmPwd: String,
  photo: String,
  cv: String,
  role: String,
  validity: String,
  resetToken: String,
});
userSchema.plugin(uniqueValidator);

// create model name
const user = mongoose.model("User", userSchema);

//make user exportable
module.exports = user;
