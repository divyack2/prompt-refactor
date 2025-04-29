const mongoose = require('mongoose');

var factQuestionTabSchema = new mongoose.Schema({
    tab: String,
    factQuestion: String,
    factDetailLevel: String,
    factFormat: String,
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('FactQuestionTab', factQuestionTabSchema);