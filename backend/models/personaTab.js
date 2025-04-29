const mongoose = require('mongoose');

var personaTabSchema = new mongoose.Schema({
    tab: String,
    personaGoal: String,
    persona: String,
    personaTopics: String,
    personaDetails: String,
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PersonaTab', personaTabSchema);