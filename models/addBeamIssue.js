const mongoose = require("mongoose");
// const validator = require("validator");
const Schema = mongoose.Schema;

var beamIssueSchema = new Schema({
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
  count: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "yarn_qualitys",
    required: true
  },
  ends: {
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
  fabric_quality: {
    type: String
  },
  generatedOn: {
    type: Date,
    default: new Date().getTime()
  }
});

const BeamIssue = mongoose.model("beamIssues", beamIssueSchema);

module.exports = BeamIssue;
