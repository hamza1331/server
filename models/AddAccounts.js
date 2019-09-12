const mongoose = require('mongoose');
// const validator = require("validator");
const Schema = mongoose.Schema;

var AccountsSchema = new Schema({
  acc_no: {
    type: String,
  },
  dept: {
    type: String,
    unique: true
  },
  d_no: {
    type: String,
  },
  d_code: {
    type: String,
    unique: true
  },
  last_bank_no: {
    type: Number,
    default: 0
  },
  generatedOn: {
    type: Date,
    default: new Date().getTime()
  }
});

const Accounts = mongoose.model('Accounts', AccountsSchema);

module.exports = Accounts;