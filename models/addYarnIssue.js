const mongoose = require('mongoose');

const inner = new mongoose.Schema({
    count: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'fabricQualitys',
        required: true
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'brands',
        required: true
    },
    unit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'units',
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
    }
})

const outer = new mongoose.Schema({
    count: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'fabricQualitys',
        required: true
    },
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'brands',
        required: true
    },
    unit: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'units',
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
    }
})

var YarnIssueSchema = new mongoose.Schema({
    record_no: {
        type: String,
        required: true
    },
    inner: [inner],
    outer: [outer],
    date: {
        type: String,
        // required: true
    },
    generatedOn: {
        type: Number,
        default: new Date().getTime()
    }
});

const YarnIssue = mongoose.model('yarnissues', YarnIssueSchema);

module.exports = YarnIssue;
