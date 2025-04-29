const mongoose = require('mongoose');

var recipeTab = new mongoose.Schema({
    tab: String,
    recipeTopic: String,
    knownSteps: String,
    numAlt: String,
    detailLevel: String,
    recipeFormat: String,
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('RecipeTab', recipeTab);