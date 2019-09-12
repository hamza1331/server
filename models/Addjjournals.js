const mongoose = require('mongoose');

const recordArr = new mongoose.Schema({
    particulars: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'companies',
        required: true
    },
    remarks: {
        type: String,
        default: ""
    },
    debit: {
        type: Number,
        default: 0
    },
    credit: {
        type: Number,
        default: 0
    },
    p_code: {
        type: String,
        default: ""
    },
    record_type: {
        type: String,
        default: ""
    }
})

var JJournalsSchema = new mongoose.Schema({
    record_no: {
        type: String,
        required: true
    },
    recordArr: [recordArr],
    date: {
        type: String,
        // required: true
    },
    generatedOn: {
        type: Number,
        default: new Date().getTime()
    },
    filePath: String,
    finalDebit: {
        type: Number,
        default: 0
    },
    finalCredit: {
        type: Number,
        default: 0
    }
});

const JJournals = mongoose.model('jjournals', JJournalsSchema);

module.exports = JJournals;