const mongoose = require('mongoose');

var templatingTabSchema = new mongoose.Schema({
    tab: String,
    templateStructure: String,
    templateConstraints: String,
    templateDesc: String,
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TemplatingTab', templatingTabSchema);