const mongoose = require('mongoose');

const quality = new mongoose.Schema({
    quality: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'qualitys',
      required: true
    },
    yarn_count: {
      type: String
    },
    s_d: {
      type: Number
    },
    twisted: {
      type: Number,
    },
    generatedOn: {
        type: Number,
        default: new Date().getTime()
    }
})

const YarnQuality = mongoose.model('yarn_qualitys', quality);

module.exports = YarnQuality;
