"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MathGraph } from "./math-graph"
import { AdvancedMathEngine, AdvancedCalculationResult } from "@/lib/advanced-math-engine"
import { 
  Calculator, 
  Brain, 
  Zap, 
  BarChart3, 
  Grid3x3, 
  TrendingUp, 
  Settings, 
  Play, 
  RotateCcw, 
  Download,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff,
  Copy,
  Share2
} from "lucide-react"

interface AdvancedCalculatorProps {
  onHistoryClick?: () => void
}

export function AdvancedCalculator({ onHistoryClick }: AdvancedCalculatorProps) {
  const [input, setInput] = useState("")
  const [result, setResult] = useState<AdvancedCalculationResult | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [computationMode, setComputationMode] = useState<'symbolic' | 'numeric' | 'approximate'>('numeric')
  const [showSteps, setShowSteps] = useState(true)
  const [showExplanation, setShowExplanation] = useState(true)
  const [angleMode, setAngleMode] = useState<'deg' | 'rad'>('rad')
  const [precision, setPrecision] = useState(10)
  const [history, setHistory] = useState<AdvancedCalculationResult[]>([])
  
  const mathEngine = new AdvancedMathEngine()
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    mathEngine.setComputationMode(computationMode)
    mathEngine.setPrecision(precision)
    mathEngine.setAngleMode(angleMode)
  }, [computationMode, precision, angleMode])

  const handleCalculate = async () => {
    if (!input.trim()) return

    setIsCalculating(true)
    try {
      // Simulate processing time for complex calculations
      await new Promise(resolve => setTimeout(resolve, 500))
      
      const calculationResult = mathEngine.calculate(input)
      setResult(calculationResult)
      setHistory(prev => [calculationResult, ...prev.slice(0, 9)]) // Keep last 10 results
    } catch (error) {
      setResult({
        finalAnswer: 'Error',
        methodUsed: 'Error Handling',
        stepByStepSolution: [`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`],
        domain: 'error',
        computationMode,
        confidence: 0,
        explanation: 'An error occurred during calculation.',
        difficulty: 'basic',
        relatedConcepts: [],
        applications: []
      })
    } finally {
      setIsCalculating(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault()
      handleCalculate()
    }
  }

  const copyResult = () => {
    if (result) {
      const text = `Final Answer: ${result.finalAnswer}\nMethod: ${result.methodUsed}\nExplanation: ${result.explanation}`
      navigator.clipboard.writeText(text)
    }
  }

  const exportResult = () => {
    if (result) {
      const data = {
        input,
        result,
        timestamp: new Date().toISOString()
      }
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'calculation-result.json'
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  const insertSymbol = (symbol: string) => {
    setInput(prev => prev + symbol)
    inputRef.current?.focus()
  }

  const commonSymbols = [
    { symbol: 'π', name: 'Pi' },
    { symbol: 'e', name: 'Euler' },
    { symbol: '√', name: 'Square Root' },
    { symbol: '∫', name: 'Integral' },
    { symbol: '∂', name: 'Partial Derivative' },
    { symbol: '∑', name: 'Sum' },
    { symbol: '∏', name: 'Product' },
    { symbol: '∞', name: 'Infinity' },
    { symbol: '±', name: 'Plus Minus' },
    { symbol: '≈', name: 'Approximately' },
    { symbol: '≠', name: 'Not Equal' },
    { symbol: '≤', name: 'Less Equal' },
    { symbol: '≥', name: 'Greater Equal' }
  ]

  const quickFunctions = [
    { func: 'derivative(x^2, x)', label: 'Derivative' },
    { func: 'integral(x^2, 0, 1)', label: 'Integral' },
    { func: 'solve(x^2 - 4 = 0)', label: 'Solve Equation' },
    { func: 'factor(x^2 - 4)', label: 'Factor' },
    { func: 'limit(sin(x)/x, x, 0)', label: 'Limit' },
    { func: 'det([[1,2],[3,4]])', label: 'Determinant' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-6 border border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="h-8 w-8 text-blue-400" />
              <div>
                <h1 className="text-3xl font-bold text-white">Advanced Mathematical AI Calculator</h1>
                <p className="text-blue-200">Symbolic • Numeric • Visual Computing</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-2">
                <label className="text-white text-sm">Mode:</label>
                <select 
                  value={computationMode} 
                  onChange={(e) => setComputationMode(e.target.value as any)}
                  className="bg-white/20 text-white rounded px-2 py-1 text-sm"
                >
                  <option value="numeric">Numeric</option>
                  <option value="symbolic">Symbolic</option>
                  <option value="approximate">Approximate</option>
                </select>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 rounded-lg p-2">
                <label className="text-white text-sm">Angle:</label>
                <select 
                  value={angleMode} 
                  onChange={(e) => setAngleMode(e.target.value as any)}
                  className="bg-white/20 text-white rounded px-2 py-1 text-sm"
                >
                  <option value="rad">Radians</option>
                  <option value="deg">Degrees</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Two-Panel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Panel - Input */}
          <div className="space-y-4">
            {/* Input Section */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Calculator className="h-5 w-5 mr-2" />
                  Mathematical Input
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <textarea
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter mathematical expression, equation, or natural language query..."
                    className="w-full h-32 p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  <div className="absolute bottom-2 right-2 text-xs text-white/50">
                    Ctrl+Enter to calculate
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    onClick={handleCalculate} 
                    disabled={isCalculating || !input.trim()}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {isCalculating ? 'Calculating...' : 'Calculate'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setInput('')}
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Functions */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white text-sm">Quick Functions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {quickFunctions.map((item, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setInput(item.func)}
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-xs"
                    >
                      {item.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Symbols */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle className="text-white text-sm">Mathematical Symbols</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-6 gap-2">
                  {commonSymbols.map((item, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => insertSymbol(item.symbol)}
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                      title={item.name}
                    >
                      {item.symbol}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* History */}
            {history.length > 0 && (
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white text-sm flex items-center justify-between">
                    Recent Calculations
                    <Button variant="ghost" size="sm" onClick={() => setHistory([])}>
                      Clear
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {history.map((item, index) => (
                      <div 
                        key={index}
                        className="p-2 bg-white/5 rounded cursor-pointer hover:bg-white/10"
                        onClick={() => setInput(input)}
                      >
                        <div className="text-white text-xs font-mono">{item.finalAnswer}</div>
                        <div className="text-blue-300 text-xs">{item.domain}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Panel - Output */}
          <div className="space-y-4">
            {result ? (
              <>
                {/* Final Answer */}
                <Card className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-md border-green-400/30">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      <span className="flex items-center">
                        <Zap className="h-5 w-5 mr-2" />
                        Final Answer
                      </span>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" onClick={copyResult}>
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={exportResult}>
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-white mb-2">
                      {result.finalAnswer}
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-green-200">
                      <span>Method: {result.methodUsed}</span>
                      <span>Domain: {result.domain}</span>
                      <span>Confidence: {Math.round(result.confidence * 100)}%</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Step-by-Step Solution */}
                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      <span className="flex items-center">
                        <TrendingUp className="h-5 w-5 mr-2" />
                        Step-by-Step Solution
                      </span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setShowSteps(!showSteps)}
                      >
                        {showSteps ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  {showSteps && (
                    <CardContent>
                      <div className="space-y-2">
                        {result.stepByStepSolution.map((step, index) => (
                          <div key={index} className="text-white/90 text-sm leading-relaxed">
                            {step}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  )}
                </Card>

                {/* Explanation */}
                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center justify-between">
                      <span className="flex items-center">
                        <Brain className="h-5 w-5 mr-2" />
                        Explanation
                      </span>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setShowExplanation(!showExplanation)}
                      >
                        {showExplanation ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  {showExplanation && (
                    <CardContent>
                      <p className="text-white/90 text-sm leading-relaxed">
                        {result.explanation}
                      </p>
                    </CardContent>
                  )}
                </Card>

                {/* Visual Output */}
                {result.visualOutput && (
                  <MathGraph 
                    graphData={result.visualOutput}
                    title={`${result.domain.charAt(0).toUpperCase() + result.domain.slice(1)} Visualization`}
                  />
                )}
              </>
            ) : (
              <Card className="bg-white/10 backdrop-blur-md border-white/20 h-full flex items-center justify-center">
                <CardContent className="text-center">
                  <Calculator className="h-16 w-16 text-white/50 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Ready to Calculate</h3>
                  <p className="text-white/70">Enter a mathematical expression or natural language query to begin</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
