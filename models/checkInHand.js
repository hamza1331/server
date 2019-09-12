const mongoose = require('mongoose');
// const validator = require("validator");
const Schema = mongoose.Schema;

var ChecksSchema = new Schema({
    generatedOn: {
        type: Date,
        default: new Date().getTime()
    },
    bank: {
        type: String,
    },
    cheque_no: {
        type: String
    },
    amount: {
        type: Number
    },
    cheque_date: {
        type: String,
    },
    generatedAgainst: {
        type: String
    },
    used: {
        type: Boolean,
        default: false
    },
    usedAgainst: {
        type: String,
    },
    checkUniqueId: {
        type: String
    }
});

const ChecksInHands = mongoose.model('checkInHands', ChecksSchema);

module.exports = ChecksInHands;