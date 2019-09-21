const mongoose = require('mongoose');

const quality = new mongoose.Schema({
    quality: {
        type: String,
        default: ''
    },
    generatedOn: {
        type: Number,
        default: new Date().getTime()
    },
})

const Quality = mongoose.model('qualitys', quality);

module.exports = Quality;
