const mongoose = require('mongoose');

const globalInfo = new mongoose.Schema({
    payment_info: {
        type: Number,
        default: 1
    },
    reciept_info: {
        type: Number,
        default: 1
    },
    jjournal_info: {
        type: Number,
        default: 1
    },
    yarnIssue_info: {
        type: Number,
        default: 1
    },
    sizing_info: {
      type: Number,
      default: 1
    },
    beamIssue_info: {
      type: Number,
      default: 1
    },
    software_name: {
      type: String,
      default: 'Texile Management System'
    }
})

const Info = mongoose.model('global_info', globalInfo);

module.exports = Info;
