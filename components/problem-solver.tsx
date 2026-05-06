"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { aiReasoningEngine } from "@/lib/ai-reasoning-engine"
import { solutionGenerator } from "@/lib/solution-generator"
import { SolutionDisplay } from "./solution-display"
import { ImageUploadDialog } from "./image-upload-dialog"
import { Loader2, Calculator, Upload, BookOpen, Zap } from "lucide-react"
import { motion } from "framer-motion"

export function ProblemSolver() {
  const [problemText, setProblemText] = useState("")
  const [jeeMode, setJeeMode] = useState(false)
  const [solving, setSolving] = useState(false)
  const [solution, setSolution] = useState<any>(null)
  const [error, setError] = useState("")
  const [showImageUpload, setShowImageUpload] = useState(false)

  const handleSolve = async () => {
    if (!problemText.trim()) {
      setError("Please enter a problem to solve")
      return
    }

    setSolving(true)
    setError("")
    setSolution(null)

    try {
      // Step 1: Analyze problem
      const analysis = aiReasoningEngine.analyzeProblem(problemText)
      
      // Step 2: Generate strategy
      const strategy = aiReasoningEngine.generateStrategy(analysis)
      
      // Step 3: Generate solution
      const completeSolution = await solutionGenerator.generateSolution(
        problemText, analysis, strategy
      )

      setSolution(completeSolution)
    } catch (err: any) {
      setError(err.message || "Failed to solve problem")
    } finally {
      setSolving(false)
    }
  }

  // Handle image upload dialog's onSolve callback
  const handleImageUploadSolve = (expression: string, result: string) => {
    setProblemText(expression)
    setTimeout(() => {
      handleSolve()
    }, 500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            JEE Advanced Problem Solver
          </h1>
          <p className="text-gray-600 text-lg">
            Solve any JEE Advanced, Olympiad, or Engineering problem with step-by-step solutions
          </p>
        </motion.div>

        {/* JEE Mode Toggle */}
        <Card className="border-2 border-red-200 bg-gradient-to-r from-red-50 to-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-red-600" />
                <div>
                  <h3 className="font-semibold text-gray-800">JEE Advanced Mode</h3>
                  <p className="text-sm text-gray-600">
                    Enhanced problem analysis with JEE-specific tricks and patterns
                  </p>
                </div>
              </div>
              <Button
                variant={jeeMode ? "default" : "outline"}
                onClick={() => setJeeMode(!jeeMode)}
                className={jeeMode ? "bg-red-600 hover:bg-red-700" : ""}
              >
                {jeeMode ? "ON" : "OFF"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Input Section */}
        <Card className="shadow-xl">
          <CardContent className="p-6">
            <Tabs defaultValue="text" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="text">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Text Input
                </TabsTrigger>
                <TabsTrigger value="image">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Image
                </TabsTrigger>
              </TabsList>

              <TabsContent value="text" className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Enter Problem Statement
                  </label>
                  <Textarea
                    value={problemText}
                    onChange={(e) => setProblemText(e.target.value)}
                    placeholder="Example: Find the number of ways to arrange 5 books on a shelf if 2 specific books must be together..."
                    className="min-h-[150px] font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Supports LaTeX notation. Be as detailed as possible for better analysis.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="image" className="mt-4">
                <div className="text-center py-8">
                  <Button
                    onClick={() => setShowImageUpload(true)}
                    size="lg"
                    className="gap-2"
                  >
                    <Upload className="h-5 w-5" />
                    Upload Handwritten or Printed Problem
                  </Button>
                  <p className="text-sm text-gray-500 mt-4">
                    Upload an image of your problem. Our OCR will extract and solve it.
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            {/* Solve Button */}
            <div className="mt-6 flex gap-3">
              <Button
                onClick={handleSolve}
                disabled={solving || !problemText.trim()}
                size="lg"
                className="flex-1 gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {solving ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Solving...
                  </>
                ) : (
                  <>
                    <Calculator className="h-5 w-5" />
                    Solve Problem
                  </>
                )}
              </Button>
            </div>

            {/* Error Display */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 bg-red-50 border-2 border-red-200 rounded-lg p-4 text-red-700"
              >
                <strong>Error:</strong> {error}
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Solution Display */}
        {solution && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <SolutionDisplay
              solution={solution}
              onClose={() => setSolution(null)}
            />
          </motion.div>
        )}

        {/* Quick Examples */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg mb-4 text-gray-800">
              Quick Examples (Click to try)
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {[
                {
                  title: "P&C Problem",
                  problem:
                    "Find the number of ways to arrange 5 books on a shelf if 2 specific books must always be together.",
                },
                {
                  title: "Probability Problem",
                  problem:
                    "A fair die is rolled 10 times. What is the probability of getting exactly 3 sixes?",
                },
                {
                  title: "Calculus Problem",
                  problem:
                    "Evaluate the limit: lim(x→0) (sin x) / x",
                },
                {
                  title: "Combination Problem",
                  problem:
                    "In how many ways can a committee of 3 be selected from 10 people?",
                },
              ].map((example, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-4 text-left justify-start hover:bg-blue-50"
                  onClick={() => {
                    setProblemText(example.problem)
                    setTimeout(() => handleSolve(), 100)
                  }}
                >
                  <div>
                    <div className="font-semibold text-sm mb-1">
                      {example.title}
                    </div>
                    <div className="text-xs text-gray-600 line-clamp-2">
                      {example.problem}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <ImageUploadDialog
        open={showImageUpload}
        onClose={() => setShowImageUpload(false)}
        onSolve={handleImageUploadSolve}
      />
    </div>
  )
}
