const mongoose = require('mongoose');



const arr = new mongoose.Schema({
    shift: {
      type: String
    },
    quality: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "fabricQualitys",
      required: true
    },
    weaver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "companies",
      required: true
    },
    meters: {
        type: Number
    },
    loom_no: {
      type: Number
    },
  });
  

const dailyReport = new mongoose.Schema({
    record_no: {
        type: Number
    },
    generatedOn: {
        type: Number,
        default: new Date().getTime()
    },
    arr: [arr],
    date: {
        type: String
    }
})

const DailyReport = mongoose.model('dailyReport', dailyReport);

module.exports = DailyReport;
