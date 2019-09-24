const mongoose = require('mongoose');

const brand = new mongoose.Schema({
    brand: {
        type: String,
        default: ''
    },
    generatedOn: {
        type: Number,
        default: new Date().getTime()
    },
})

const Brand = mongoose.model('brands', brand);

module.exports = Brand;
