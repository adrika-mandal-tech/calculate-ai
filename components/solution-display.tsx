"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CompleteSolution } from "@/lib/solution-generator"
import { Lightbulb, CheckCircle, AlertTriangle, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"

interface SolutionDisplayProps {
  solution: CompleteSolution
  onClose?: () => void
}

export function SolutionDisplay({ solution, onClose }: SolutionDisplayProps) {
  const [showAlternate, setShowAlternate] = useState(false)

  return (
    <div className="space-y-4 max-w-4xl mx-auto p-4">
      {/* Problem Statement */}
      <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-800">
            Problem Statement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 whitespace-pre-wrap">{solution.problem}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
              {solution.analysis.topic.replace(/_/g, ' ').toUpperCase()}
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-semibold">
              {solution.analysis.difficulty.toUpperCase()}
            </span>
            {solution.analysis.difficulty === 'jee_advanced' && (
              <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold">
                JEE ADVANCED
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* JEE Trick Alert */}
      {solution.jeeTrick && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4"
        >
          <div className="flex items-start gap-3">
            <Lightbulb className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-800 mb-1">
                JEE Advanced Trick
              </h3>
              <p className="text-yellow-700 text-sm">{solution.jeeTrick}</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Solution Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Step-by-Step Solution</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {solution.steps.map((step, index) => (
            <motion.div
              key={step.stepNumber}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border-2 ${
                step.highlight
                  ? 'border-green-300 bg-green-50'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    step.highlight
                      ? 'bg-green-500 text-white'
                      : 'bg-blue-500 text-white'
                  }`}
                >
                  {step.stepNumber}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-700 mb-2 whitespace-pre-wrap">
                    {step.description}
                  </p>
                  {step.formula && (
                    <div className="bg-gray-100 p-3 rounded font-mono text-sm mb-2">
                      {step.formula}
                    </div>
                  )}
                  {step.calculation && (
                    <div className="bg-blue-50 p-3 rounded font-mono text-sm mb-2">
                      {step.calculation}
                    </div>
                  )}
                  {step.result && (
                    <div className="bg-green-50 p-3 rounded font-mono text-sm font-semibold text-green-700 mb-2">
                      Result: {step.result}
                    </div>
                  )}
                  <p className="text-sm text-gray-600 italic">
                    {step.explanation}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>

      {/* Final Answer */}
      <Card className="border-2 border-green-400 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <h3 className="text-xl font-bold text-gray-800">Final Answer</h3>
          </div>
          <div className="bg-white p-4 rounded-lg border-2 border-green-300">
            <p className="text-3xl font-bold text-green-700 text-center">
              {solution.primaryAnswer}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Validation */}
      <Card className={solution.validation.verified ? 'border-green-300' : 'border-yellow-300'}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            {solution.validation.verified ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            )}
            <div>
              <h3 className="font-semibold text-gray-800">Validation</h3>
              <p className="text-sm text-gray-600">
                {solution.validation.verified
                  ? 'Answer verified using multiple methods'
                  : 'Answer needs verification'}
              </p>
              {solution.validation.method2 && (
                <p className="text-xs text-gray-500 mt-1">
                  Method 1: {solution.validation.method1} | Method 2: {solution.validation.method2}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alternate Method Toggle */}
      {solution.alternateAnswer && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Alternate Method</CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAlternate(!showAlternate)}
              >
                {showAlternate ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    Hide
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Show
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          {showAlternate && (
            <CardContent>
              <p className="text-gray-700">
                Alternate answer using different method:{" "}
                <span className="font-bold text-blue-600">
                  {solution.alternateAnswer}
                </span>
              </p>
            </CardContent>
          )}
        </Card>
      )}

      {onClose && (
        <div className="flex justify-end">
          <Button onClick={onClose}>Close</Button>
        </div>
      )}
    </div>
  )
}
