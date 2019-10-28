const mongoose = require("mongoose");

const inner = new mongoose.Schema({
  type: {
    type: String
  },
  grade: {
    type: String
  },
  quality: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "fabricQualitys",
    required: true
  },
  party: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "companies",
    required: true
  },
  pcs: {
      type: Number
  },
  rate: {
    type: Number,
  },
  meter: {
    type: Number,
  },
  p_list: {
    type: String,
  },
  rate: {
    type: Number,
  },
  gst: {
    type: Number,
  },
  used: {
    type: Boolean
  },
});

const outer = new mongoose.Schema({
    type: {
        type: String
      },
      quality: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "fabricQualitys",
        required: true
      },
      party: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "companies",
        required: true
      },
      pcs: {
          type: Number
      },
      rate: {
        type: Number,
      },
      meter: {
        type: Number,
      },
      rate: {
        type: Number,
      },
      gst: {
        type: Number,
      },
      used: {
        type: Boolean
      },
});

var fabricissue = new mongoose.Schema({
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

const FabricIssue = mongoose.model("fabricIssue", fabricissue);

module.exports = FabricIssue;
