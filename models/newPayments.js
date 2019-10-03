const mongoose = require('mongoose');

const recordArr = new mongoose.Schema({
    payment_mode: {
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
    record_type: {
        type: String,
        default: ""
    },
    check_id: {
        type: String
    },
    slip_no: {
      type: String,
      default: ""
    }
})

var PaymentsSchema = new mongoose.Schema({
    record_no: {
        type: String,
        required: true
    },
    party: {
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

const Payments = mongoose.model('payments', PaymentsSchema);

module.exports = Payments;
