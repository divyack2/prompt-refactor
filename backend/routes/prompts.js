var factQuestionTab = require('../models/factQuestionTab');
var templatingTab = require('../models/templatingTab');
var personaTab = require('../models/personaTab');
var recipeTab = require('../models/recipeTab');

const PORT = 3000;
module.exports = (router) => {
    var route = router.route('/refactor-prompt');
    
    // Endpoint to handle form submissions
    route.post( async (req, res) => {
        try {
            const tab = req.body.tab; 

            let savedData;
            
            // Parse and save data based on the tab type
            switch (tab) {
                case "templating":
                    savedData = new templatingTab(req.body);
                    break;
                case "recipe":
                    savedData = new recipeTab(req.body);
                    break;
                case "text":
                    savedData = new personaTab(req.body);
                    break;
                case "fact":
                    savedData = new factQuestionTab(req.body);
                    break;
                default:
                    return res.status(400).json({ message: "Invalid tab type" });
            }
            console.log("log:",savedData)
            await savedData.save();
            console.log(`Form data saved for tab: ${tab}`, savedData);
            res.status(200).json({ message: "Form data saved successfully!" });
        } catch (error) {
            console.error("Error saving form data:", error);
            res.status(500).json({ message: "Failed to save form data" });
        }
    });
    return router;
};