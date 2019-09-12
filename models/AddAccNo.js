const mongoose = require('mongoose');
// const validator = require("validator");
const Schema = mongoose.Schema;

var AccNosSchema = new Schema({
  _id: Schema.Types.ObjectId,
  id: {
    type: String,
  },
  title: {
    type: String,
  },
  last_account_no: {
    type: Number,
    default: 0
  },
  last_bank_no: {
    type: Number,
    default: 0,
  },
  generatedOn: {
    type: Date,
    default: new Date().getTime()
  }
});

const AccNos = mongoose.model('AccNos', AccNosSchema);

module.exports = AccNos;