const mongoose = require("mongoose");
// const validator = require("validator");
const Schema = mongoose.Schema;

const beamArrInner = new mongoose.Schema({
    beam_no: {
        type: Number
    },
    beam_length: {
      type: Number,
    },
    ends: {
      type: Number,
    },
    consumption: {
      type: Number,
    },
    consumption_lbs: {
      type: Number,
    },
    used: {
      type: Boolean,
      default: false
    }
})


const beamArrOuter = new mongoose.Schema({
    beam_no: {
        type: Number
    },
    beam_length: {
      type: Number,
    },
    ends: {
      type: Number,
    },
    consumption: {
      type: Number,
    },
    consumption_lbs: {
      type: Number,
    },
    chartOfAccounts: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "companies",
      required: true
    },
    fabric_quality: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "fabricQualitys",
      required: true
    },
    weaver_charges: {
      type: Number
    },

    used: {
      type: Boolean,
      default: false
    }
})


var addSizingSchema = new Schema({
  record_no: {
    type: Number
  },
  type: {
    type: String
  },
  twists: {
    type: Number
  },
  yarn_issue_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "yarnissues",
    required: true
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
    type: String
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
  beamArrInner: [beamArrInner],
  beamArrOuter: [beamArrOuter],
  generatedOn: {
    type: Number,
    default: new Date().getTime()
  }
});

const addSizings = mongoose.model("sizings", addSizingSchema);

module.exports = addSizings;
