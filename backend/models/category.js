//import mongoose module
const mongoose = require("mongoose");
//import mongoose unique Validator module

const uniqueValidator = require("mongoose-unique-validator");

// create Category Shema
const categorySchema = mongoose.Schema({
  name: String,
  description: String,
  duration: String,
  coursesId: [String],
  photo: String,
  cost: Number,
});
categorySchema.plugin(uniqueValidator);

// create model name
const category = mongoose.model("Category", categorySchema);

//make user exportable
module.exports = category;
