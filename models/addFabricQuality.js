const mongoose = require("mongoose");

const fabricQuality = new mongoose.Schema({
  warp_count: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "yarn_qualitys",
    required: true
  },
  weft_count: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "yarn_qualitys",
    required: true
  },
  ends: {
    type: Number
  },
  picks: {
    type: Number
  },
  width: {
    type: Number
  },
  generatedOn: {
    type: Number,
    default: new Date().getTime()
  }
});

const FabricQuality = mongoose.model("fabricQualitys", fabricQuality);

module.exports = FabricQuality;
