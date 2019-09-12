const mongoose = require('mongoose');
// const validator = require("validator");
const Schema = mongoose.Schema;

var CompaniesSchema = new Schema({
  Previous_year: {
    type: String,
    default: ""
  },
  address: {
    type: String,
    default: ""
  },
  bank_code: {
    type: String,
    default: ""
  },
  date: {
    type: String,
    default: ""
  },
  head_of_ac: {
    type: String,
    default: ""
  },
  main_code: {
    type: String,
    default: ""
  },
  ntn_no: {
    type: String,
    default: ""
  },
  op_bal: {
    type: Number,
    default: 0
  },
  previous_year: {
    type: String,
    default: ""
  },
  sales_tax: {
    type: String,
    default: ""
  },
  company_code: {
    type: String,
    default: ""
  },
  bank_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Banks',
    required: true
  },
  generatedOn: {
    type: Date,
    default: new Date().getTime()
  }
});

const Companies = mongoose.model('companies', CompaniesSchema);

module.exports = Companies;