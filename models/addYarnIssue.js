const mongoose = require("mongoose");

const inner = new mongoose.Schema({
  type: {
    type: String
  },
  count: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "yarn_qualitys",
    required: true
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "brands",
    required: true
  },
  unit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "units",
    required: true
  },
  packing_per_unit: {
    type: Number
  },
  total_weight: {
    type: Number
  },
  total_weight_lbs: {
    type: Number
  },
  chartOfAccounts: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "companies",
    required: true
  },
  rate: {
    type: Number,
  },
  unit_kg: {
    type: Number,
  },
  gst: {
    type: Number,
  },
  total_amount: {
    type: Number,
  },
  no_of_cartons: {
    type:Number
  }
});

const outer = new mongoose.Schema({
  count: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "yarn_qualitys",
    required: true
  },
  brand: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "brands",
    required: true
  },
  unit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "units",
    required: true
  },
  packing_per_unit: {
    type: Number
  },
  total_weight: {
    type: Number
  },
  total_weight_lbs: {
    type: Number
  },
  chartOfAccounts: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "companies",
    required: true
  },
  no_of_cartons: {
    type:Number
  },
  typeOuter: {
    type: String
  }
});

var YarnIssueSchema = new mongoose.Schema({
  record_no: {
    type: String,
    required: true
  },
  inner: [inner],
  outer: [outer],
  date: {
    type: String
  },
  generatedOn: {
    type: Number,
    default: new Date().getTime()
  }
});

const YarnIssue = mongoose.model("yarnissues", YarnIssueSchema);

module.exports = YarnIssue;
