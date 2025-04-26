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
  const [sourceText, setSourceText] = useState("")
  const [wordCount, setWordCount] = useState("100")
  const [textStyle, setTextStyle] = useState("")
  const [textPurpose, setTextPurpose] = useState("summary")

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
      let resultSetter = null
      // TODO: CHANGE/REMOVE THESE ALL
      switch (activeTab) {
        case "templating":
          promptText = `
            I need you to refactor and improve this templating prompt to get better AI responses:
            
            Original prompt: ${templateStructure}
            Additional constraints: ${templateConstraints}
            
            Please rewrite my prompt to be more effective, clear, and likely to produce the desired structured data.
          `
          resultSetter = setTemplateResult
          break

        case "recipe":
          promptText = `
            I need you to refactor and improve this how-to/recipe prompt to get better AI responses:
            
            Topic/task: ${recipeTopic}
            Level of detail: ${detailLevel}
            Format preference: ${recipeFormat}
            
            Please rewrite my prompt to be more effective, clear, and likely to produce a good how-to guide.
          `
          resultSetter = setRecipeResult
          break

        case "text":
          promptText = `
            I need you to refactor and improve this text generation prompt to get better AI responses:
            
            Source text or topic: ${sourceText}
            Word/character count: ${wordCount}
            Style/tone: ${textStyle}
            Purpose: ${textPurpose}
            
            Please rewrite my prompt to be more effective, clear, and likely to produce the desired text output.
          `
          resultSetter = setTextResult
          break

        case "fact":
          promptText = `
            I need you to refactor and improve this factual question prompt to get better AI responses:
            
            Question: ${factQuestion}
            Preferred detail level: ${factDetailLevel}
            Format preference: ${factFormat}
            
            Please rewrite my prompt to be more effective, clear, and likely to produce an accurate and helpful answer.
          `
          resultSetter = setFactResult
          break
      }

      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt: promptText,
        system:
          "You are an expert at writing effective prompts for AI models. Your job is to refactor and improve user prompts to get better results. Focus on clarity, specificity, and structure.",
      })

      resultSetter(text)
    } catch (error) {
      console.error("Error refactoring prompt:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getActiveResult())
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

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
                Text Generation
              </TabsTrigger>
              <TabsTrigger
                value="fact"
                className="flex-1 data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:shadow-none rounded-none"
              >
                Fact/Question
              </TabsTrigger>
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
                placeholder="Ex: NAME: person's full name; DATE: event date in YYYY-MM-DD format.."
              />
            </div>
            
            <div className="flex justify-end mt-6">
              <Button
                onClick={handleRefactorPrompt}
                disabled={!templateStructure || isLoading}
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
                disabled={!recipeTopic || isLoading}
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

          </TabsContent>

          {/* Text Generation Tab */}
          <TabsContent value="text" className="p-6 space-y-6 mt-0">
            <div className="space-y-2">
              <Label htmlFor="sourceText">Task</Label>
              <Textarea
                id="sourceText"
                value={sourceText}
                onChange={(e) => setSourceText(e.target.value)}
                className="min-h-24 bg-gray-50 border border-gray-200 focus:border-gray-300 focus:ring-0"
                placeholder="Ex: Summarize this book in 100 words"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="wordCount">Word Count</Label>
                <Input
                  id="wordCount"
                  type="number"
                  value={wordCount}
                  onChange={(e) => setWordCount(e.target.value)}
                  className="bg-gray-50 border border-gray-200 focus:border-gray-300 focus:ring-0"
                  placeholder="Ex: 100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="textPurpose">Purpose</Label>
                <Select value={textPurpose} onValueChange={setTextPurpose}>
                  <SelectTrigger className="bg-gray-50 border border-gray-200 focus:border-gray-300 focus:ring-0">
                    <SelectValue placeholder="Select purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="summary">Summary</SelectItem>
                    <SelectItem value="expansion">Expansion</SelectItem>
                    <SelectItem value="rewrite">Rewrite</SelectItem>
                    <SelectItem value="analysis">Analysis</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="textStyle">Style/Tone</Label>
              <Select value={textStyle} onValueChange={setTextStyle}>
                <SelectTrigger className="bg-gray-50 border border-gray-200 focus:border-gray-300 focus:ring-0">
                  <SelectValue placeholder="Select style/tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="creative">Creative</SelectItem>
                  <SelectItem value="technical">Technical</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end mt-6">
              <Button
                onClick={handleRefactorPrompt}
                disabled={!sourceText || isLoading}
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

          </TabsContent>

          {/* Fact/Question Tab */}
          <TabsContent value="fact" className="p-6 space-y-6 mt-0">
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

          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
