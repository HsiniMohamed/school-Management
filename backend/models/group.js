//import mongoose module
const mongoose = require("mongoose");
//import mongoose unique Validator module

const uniqueValidator = require("mongoose-unique-validator");

// create Group Shema
const groupSchema = mongoose.Schema({
  name: String,
  date: Date,
  categoryId: String,
  // coursId: [String],
  // teacherId: [String],
  studentsId: [String],
});
groupSchema.plugin(uniqueValidator);

// create model name
const group = mongoose.model("Group", groupSchema);

//make user exportable
module.exports = group;
