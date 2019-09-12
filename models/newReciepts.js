const mongoose = require('mongoose');

const recordArr = new mongoose.Schema({
    party: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'companies',
        required: true
    },
    amount: {
        type: Number,
        default: 0
    },
    cheque_no: {
        type: String,
        default: ""
    },
    remarks: {
        type: String,
        default: ""
    },
    bank: {
        type: String,
        default: ""
    },
    cheque_date: {
        type: String,
        default: ""
    },
    record_type: {
        type: String,
        default: ""
    },
    checkUniqueId: {
        type: Number
    }
})

var RecieptsSchema = new mongoose.Schema({
    record_no: {
        type: String,
        required: true
    },
    payment_mode: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'companies',
        required: true
    },
    recordArr: [recordArr],
    date: {
        type: String,
        required: true
    },
    generatedOn: {
        type: Number,
        default: new Date().getTime()
    },
    filePath: String
});

const Reciepts = mongoose.model('reciepts', RecieptsSchema);

module.exports = Reciepts;