const mongoose = require('mongoose');
// const validator = require("validator");
const Schema = mongoose.Schema;

var ChecksSchema = new Schema({
  bank: {
    type: String,
  },
  cheque_no_start: {
    type: Number
  },
  cheque_no_end: {
    type: Number
  },
  last_used_check: {
    type: Number,
  }
});

const Checks = mongoose.model('checksBookRecords', ChecksSchema);

module.exports = Checks;