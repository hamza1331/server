const mongoose = require('mongoose');

const unit = new mongoose.Schema({
    unit: {
        type: String,
        default: ''
    },
    generatedOn: {
        type: Number,
        default: new Date().getTime()
    },
})

const Unit = mongoose.model('units', unit);

module.exports = Unit;
