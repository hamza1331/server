const mongoose = require("mongoose");
// const validator = require("validator");
const Schema = mongoose.Schema;

var addSizingSchema = new Schema({
  record_no: {
    type: Number
  },
  date: {
    type: String
  },
  head_of_ac: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "companies",
    required: true
  },
  chartOfAccounts: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "companies",
    required: true
  },
  count: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "yarn_qualitys",
    required: true
  },
  ends: {
    type: Number
  },
  set_no: {
    type: Number
  },
  beam_no: {
    type: Number
  },
  beam_length_yard: {
    type: Number
  },
  beam_length_meter: {
    type: Number
  },
  beam_lbs: {
    type: Number
  },
  quality: {
    type: String
  },
  sizing_rate: {
    type: Number
  },
  amount: {
    type: Number
  },
  gst: {
    type: Number
  },
  gst_total_amount: {
    type: Number
  },
  generatedOn: {
    type: Date,
    default: new Date().getTime()
  }
});

const addSizings = mongoose.model("sizings", addSizingSchema);

module.exports = addSizings;
