//import mongoose module
const mongoose = require("mongoose");
//import mongoose unique Validator module

const uniqueValidator = require("mongoose-unique-validator");

// create payement Shema
const payementSchema = mongoose.Schema({
  userId: String,
  groupId: String,
  date: Date,
  // totalPrice: Number,
  slices: [Boolean],
  fullyPaid: Boolean,
});
payementSchema.plugin(uniqueValidator);

// create model name
const payement = mongoose.model("Payement", payementSchema);

//make payement exportable
module.exports = payement;
