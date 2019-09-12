const mongoose = require("mongoose");

// connection URI
const mongoURI = "mongodb://Otaku:op1234@ds153906.mlab.com:53906/crud";
// remove deprecation warning of collection.ensureIndex
mongoose.set('useCreateIndex', true);
// connect to mongodb
mongoose.connect(mongoURI, {useNewUrlParser: true})

module.exports = mongoose;