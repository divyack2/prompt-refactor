"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { Copy, Wand2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function PromptRefactorTool() {
  // State for each tab type
  const [activeTab, setActiveTab] = useState("templating")
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  // Templating tab state
  const [templateStructure, setTemplateStructure] = useState("")
  const [templateConstraints, setTemplateConstraints] = useState("")
  const [templateDesc, setTemplateDesc] = useState("")

  // Recipe tab state
  const [recipeTopic, setRecipeTopic] = useState("")
  const [knownSteps, setKnownSteps] = useState("")
  const [numAlt, setNumAlt] = useState("1")
  const [detailLevel, setDetailLevel] = useState("medium")
  const [recipeFormat, setRecipeFormat] = useState("step-by-step")

  // Text generation tab state
  const [personaGoal, setPersonaGoal] = useState("")
  const [persona, setPersona] = useState("")
  const [personaTopics, setPersonaTopics] = useState("")
  const [personaDetails, setPersonaDetails] = useState("")

  // Fact question tab state
  const [factQuestion, setFactQuestion] = useState("")
  const [factDetailLevel, setFactDetailLevel] = useState("medium")
  const [factFormat, setFactFormat] = useState("")

  // Results for each tab
  const [templateResult, setTemplateResult] = useState("")
  const [recipeResult, setRecipeResult] = useState("")
  const [textResult, setTextResult] = useState("")
  const [factResult, setFactResult] = useState("")

  const getActiveResult = () => {
    switch (activeTab) {
      case "templating":
        return templateResult
      case "recipe":
        return recipeResult
      case "text":
        return textResult
      case "fact":
        return factResult
      default:
        return ""
    }
  }

  const handleRefactorPrompt = async () => {
    setIsLoading(true)
    try {
      let promptText = ""
      let resultSetter = setTemplateResult
      switch (activeTab) {
        case "templating":
          promptText = `I am going to provide a template for your output. Everything in all caps or enclosed within brackets [ ] is a placeholder. Whenever you generate text, fit it into the placeholders I have provided. 
          
Strictly follow the formatting and overall template provided here: 
    ${templateConstraints}. 
          
Each placeholder should be filled according to the following guidelines:
    ${templateDesc}
          
This is the goal/question: ${templateStructure}.
          `
          resultSetter = setTemplateResult
          break

        case "recipe":
          promptText = `I am trying to ${recipeTopic}. I know that I need to perform the following steps: ${knownSteps}. Provide a complete sequence of steps to accomplish my goal, structured clearly. Fill in any missing or implied steps automatically. Identify any unnecessary or redundant steps from my initial list. Include ${numAlt} alternative methods or approaches for achieving this goal. The level of detail for each step should be: ${detailLevel}.`
          resultSetter = setRecipeResult
          break

        case "text":
          promptText = `Act as a ${persona}. When generating your responses, particularly emphasize: ${personaDetails} and focus on these topics: ${personaTopics}. This is the goal/question: ${personaGoal}.`
          resultSetter = setTextResult
          break

        // case "fact":
        //   promptText = `
        //     I need you to refactor and improve this factual question prompt to get better AI responses:
            
        //     Question: ${factQuestion}
        //     Preferred detail level: ${factDetailLevel}
        //     Format preference: ${factFormat}
            
        //     Please rewrite my prompt to be more effective, clear, and likely to produce an accurate and helpful answer.
        //   `
        //   resultSetter = setFactResult
        //   break
      }

      //const { text } = await generateText({
      //  model: openai("gpt-4o"),
      //  prompt: promptText,
      //  system:
      //    "You are an expert at writing effective prompts for AI models. Your job is to refactor and improve user prompts to get better results. Focus on clarity, specificity, and structure.",
      //})

      resultSetter(promptText)
    } catch (error) {
      console.error("Error refactoring prompt:", error)
    } finally {
      saveRefactorPrompt()
      setIsLoading(false)
    }
  }

  const renderResultSection = () => {
    const result = getActiveResult()

    return (
      <div className="mt-8 border-t pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Refactored Prompt</h3>
          <Button
            onClick={copyToClipboard}
            variant="outline"
            size="sm"
            className="text-gray-700 border-gray-200 hover:bg-gray-50"
            disabled={!result}
          >
            <Copy className="mr-2 h-4 w-4" />
            {copied ? "Copied!" : "Copy"}
          </Button>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 min-h-[150px]">
          {result ? (
            <pre className="whitespace-pre-wrap text-sm">{result}</pre>
          ) : (
            <p className="text-gray-400 text-sm">Your refactored prompt will appear here...</p>
          )}
        </div>
      </div>
    )
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getActiveResult())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const saveRefactorPrompt = async () => {
    try {
      const formData = {
        tab: activeTab, 
        ...(activeTab === "templating" && {
          templateStructure,
          templateConstraints,
          templateDesc,
        }),
        ...(activeTab === "recipe" && {
          recipeTopic,
          knownSteps,
          numAlt,
          detailLevel,
          recipeFormat,
        }),
        ...(activeTab === "text" && {
          personaGoal,
          persona,
          personaTopics,
          personaDetails,
        }),
        ...(activeTab === "fact" && {
          factQuestion,
          factDetailLevel,
          factFormat,
        }),
      };
      
      // Send the form data to the backend
      const response = await fetch("http://localhost:4000/api/refactor-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

  
      console.log("Form data sent successfully!");
    } catch (error) {
      console.error("Error sending form data:", error);
    } 
  };
  return (
    <Card className="w-full max-w-3xl bg-white shadow-sm border-0">
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="border-b">
            <TabsList className="w-full h-14 bg-transparent rounded-none border-b">
              <TabsTrigger
                value="templating"
                className="flex-1 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none rounded-none"
              >
                Templating
              </TabsTrigger>
              <TabsTrigger
                value="recipe"
                className="flex-1 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none rounded-none"
              >
                Recipe/How-to
              </TabsTrigger>
              <TabsTrigger
                value="text"
                className="flex-1 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none rounded-none"
              >
                Persona/Role-based
              </TabsTrigger>
              {/* <TabsTrigger
                value="fact"
                className="flex-1 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none rounded-none"
              >
                Fact/Question
              </TabsTrigger> */}
            </TabsList>
          </div>

          {/* Templating Tab */}
          <TabsContent value="templating" className="p-6 space-y-6 mt-0">
            <div className="space-y-2">
              <Label htmlFor="templateStructure">Goal/Question</Label>
              <Textarea
                id="templateStructure"
                value={templateStructure}
                onChange={(e) => setTemplateStructure(e.target.value)}
                className="min-h-24 bg-gray-50 border border-gray-200 focus:border-gray-300 focus:ring-0"
                placeholder="Ex: Generate a name and job title for a person."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="templateConstraints">Please provide the exact template you want the output to follow.</Label>
              <Textarea
                id="templateConstraints"
                value={templateConstraints}
                onChange={(e) => setTemplateConstraints(e.target.value)}
                className="min-h-20 bg-gray-50 border border-gray-200 focus:border-gray-300 focus:ring-0"
                placeholder="Clearly indicate placeholders in the template, e.g., [NAME], [JOB], [DATE], etc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="templateDesc">For each placeholder, briefly describe what kind of content should go there.</Label>
              <Textarea
                id="templateDesc"
                value={templateDesc}
                onChange={(e) => setTemplateDesc(e.target.value)}
                className="min-h-20 bg-gray-50 border border-gray-200 focus:border-gray-300 focus:ring-0"
                placeholder="Ex: [NAME]: person's full name; [DATE]: event date in YYYY-MM-DD format.."
              />
            </div>
            
            <div className="flex justify-end mt-6">
              <Button
                onClick={handleRefactorPrompt}
                disabled={!templateStructure || !templateConstraints || !templateDesc || isLoading}
                className="bg-black hover:bg-gray-800 text-white"
              >
                {isLoading ? (
                  "Processing..."
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Refactor Prompt
                  </>
                )}
              </Button>
            </div>

            {renderResultSection()}
          </TabsContent>

          {/* Recipe/How-to Tab */}
          <TabsContent value="recipe" className="p-6 space-y-6 mt-0">
            <div className="space-y-2">
              <Label htmlFor="recipeTopic">Goal</Label>
              <Textarea
                id="recipeTopic"
                value={recipeTopic}
                onChange={(e) => setRecipeTopic(e.target.value)}
                className="min-h-24 bg-gray-50 border border-gray-200 focus:border-gray-300 focus:ring-0"
                placeholder="I am trying to...[ex. bake a cake]."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="knownSteps">Known Steps</Label>
              <Textarea
                id="knownSteps"
                value={knownSteps}
                onChange={(e) => setKnownSteps(e.target.value)}
                className="min-h-24 bg-gray-50 border border-gray-200 focus:border-gray-300 focus:ring-0"
                placeholder="Ex: I need to get flour, sugar, and eggs."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="numAlt">Number of Alternate Methods</Label>
                <Input
                  id="numAlt"
                  type="number"
                  value={numAlt}
                  onChange={(e) => setNumAlt(e.target.value)}
                  className="bg-gray-50 border border-gray-200 focus:border-gray-300 focus:ring-0"
                  placeholder="Ex: 10"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="detailLevel">Level of Detail</Label>
                <Select value={detailLevel} onValueChange={setDetailLevel}>
                  <SelectTrigger className="bg-gray-50 border border-gray-200 focus:border-gray-300 focus:ring-0">
                    <SelectValue placeholder="Select detail level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="brief">High-level summary</SelectItem>
                    <SelectItem value="medium">Moderate detail </SelectItem>
                    <SelectItem value="detailed">Detailed instructions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button
                onClick={handleRefactorPrompt}
                disabled={!recipeTopic || !knownSteps || !numAlt || !detailLevel || isLoading}
                className="bg-black hover:bg-gray-800 text-white"
              >
                {isLoading ? (
                  "Processing..."
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Refactor Prompt
                  </>
                )}
              </Button>
            </div>

            {renderResultSection()}
          </TabsContent>

          {/* Persona/Role-based Tab */}
          <TabsContent value="text" className="p-6 space-y-6 mt-0">
            <div className="space-y-2">
              <Label htmlFor="personaGoal">Goal/Question</Label>
              <Textarea
                id="personaGoal"
                value={personaGoal}
                onChange={(e) => setPersonaGoal(e.target.value)}
                className="min-h-24 bg-gray-50 border border-gray-200 focus:border-gray-300 focus:ring-0"
                placeholder="Ex: I want to learn more about the Revolutionary War."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="persona">What persona or role should the model assume? </Label>
              <Textarea
                id="persona"
                value={persona}
                onChange={(e) => setPersona(e.target.value)}
                className="min-h-24 bg-gray-50 border border-gray-200 focus:border-gray-300 focus:ring-0"
                placeholder="Clearly specify the persona, e.g., job title, historical figure, fictional character, or non-human entity."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="personaTopics">What general topics would you like this persona to focus on? </Label>
              <Textarea
                id="personaTopics"
                value={personaTopics}
                onChange={(e) => setPersonaTopics(e.target.value)}
                className="min-h-24 bg-gray-50 border border-gray-200 focus:border-gray-300 focus:ring-0"
                placeholder="Ex: security reviews, code suggestions, instructions"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="personaDetails">What details or aspects should the persona particularly emphasize in its responses? </Label>
              <Textarea
                id="personaDetails"
                value={personaDetails}
                onChange={(e) => setPersonaDetails(e.target.value)}
                className="min-h-24 bg-gray-50 border border-gray-200 focus:border-gray-300 focus:ring-0"
                placeholder="Clearly specify important areas of focus relevant to the persona, e.g., security vulnerabilities, educational insights, historical accuracy, humor, etc."
              />
            </div>

            <div className="flex justify-end mt-6">
              <Button
                onClick={handleRefactorPrompt}
                disabled={!personaGoal || !persona || !personaTopics || !personaDetails || isLoading}
                className="bg-black hover:bg-gray-800 text-white"
              >
                {isLoading ? (
                  "Processing..."
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Refactor Prompt
                  </>
                )}
              </Button>
            </div>

            {renderResultSection()}
          </TabsContent>

          {/* Fact/Question Tab */}
          {/* <TabsContent value="fact" className="p-6 space-y-6 mt-0">
            <div className="space-y-2">
              <Label htmlFor="factQuestion">Question</Label>
              <Textarea
                id="factQuestion"
                value={factQuestion}
                onChange={(e) => setFactQuestion(e.target.value)}
                className="min-h-24 bg-gray-50 border border-gray-200 focus:border-gray-300 focus:ring-0"
                placeholder="Ex: How many moons does Jupiter have?"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="factDetailLevel">Detail Level</Label>
                <Select value={factDetailLevel} onValueChange={setFactDetailLevel}>
                  <SelectTrigger className="bg-gray-50 border border-gray-200 focus:border-gray-300 focus:ring-0">
                    <SelectValue placeholder="Select detail level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="brief">Brief</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="detailed">Detailed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="factFormat">Format Preference</Label>
                <Select value={factFormat} onValueChange={setFactFormat}>
                  <SelectTrigger className="bg-gray-50 border border-gray-200 focus:border-gray-300 focus:ring-0">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="direct">Direct Answer</SelectItem>
                    <SelectItem value="explanation">With Explanation</SelectItem>
                    <SelectItem value="bullet">Bullet Points</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button
                onClick={handleRefactorPrompt}
                disabled={!factQuestion || isLoading}
                className="bg-black hover:bg-gray-800 text-white"
              >
                {isLoading ? (
                  "Processing..."
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Refactor Prompt
                  </>
                )}
              </Button>
            </div>

          </TabsContent> */}
        </Tabs>
      </CardContent>
    </Card>
  )
}
