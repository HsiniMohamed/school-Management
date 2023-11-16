//import mongoose module
const mongoose = require("mongoose");
//import mongoose unique Validator module

const uniqueValidator = require("mongoose-unique-validator");

// create quote Shema
const quoteSchema = mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  date: Date,
  categoryId: String,
  planingOption: String,
  state: String,
});
quoteSchema.plugin(uniqueValidator);

// create model name
const quote = mongoose.model("Quote", quoteSchema);

//make quote exportable
module.exports = quote;
