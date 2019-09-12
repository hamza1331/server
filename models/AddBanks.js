const mongoose = require('mongoose');
// const validator = require("validator");
const Schema = mongoose.Schema;

var BanksSchema = new Schema({
  bank_name: {
    type: String,
  },
  main_code: {
    type: String,
  },
  generatedOn: {
    type: Date,
    default: new Date().getTime()
  },
  bank_code: {
    type: String,
  },
  last_bank_no: {
    type: Number,
    default: 0
  }
});

const Banks = mongoose.model('Banks', BanksSchema);

module.exports = Banks;