//import mongoose module
const mongoose = require("mongoose");
//import mongoose unique Validator module

const uniqueValidator = require("mongoose-unique-validator");

// create cours Shema
const coursSchema = mongoose.Schema({
  name: String,
  description: String,
  duration: String,
  teacherId: String,
  photo: String,
});
coursSchema.plugin(uniqueValidator);

// create model name
const cours = mongoose.model("Cours", coursSchema);

//make cours exportable
module.exports = cours;
