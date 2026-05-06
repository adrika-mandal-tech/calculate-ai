"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Keyboard, 
  Calculator, 
  Brain, 
  Zap, 
  BookOpen, 
  ChevronDown, 
  ChevronUp,
  Copy,
  Search,
  Command,
  ArrowRight
} from "lucide-react"

interface ShortcutCategory {
  title: string
  icon: React.ReactNode
  shortcuts: {
    key: string
    description: string
    example: string
    category: string
  }[]
}

export default function UserManual() {
  const [expandedCategory, setExpandedCategory] = useState<string | null>("basic")
  const [searchTerm, setSearchTerm] = useState("")

  const shortcutCategories: ShortcutCategory[] = [
    {
      title: "Basic Operations",
      icon: <Calculator className="h-5 w-5" />,
      shortcuts: [
        { key: "0-9", description: "Numbers", example: "Type digits directly", category: "basic" },
        { key: "+ - * /", description: "Basic arithmetic", example: "2+3*4-1", category: "basic" },
        { key: ".", description: "Decimal point", example: "3.14159", category: "basic" },
        { key: "()", description: "Parentheses", example: "(2+3)*4", category: "basic" },
        { key: "^", description: "Power/Exponent", example: "2^8 = 256", category: "basic" },
        { key: "!", description: "Factorial", example: "5! = 120", category: "basic" },
        { key: "%", description: "Percentage", example: "25% = 0.25", category: "basic" },
        { key: ",", description: "Comma for arguments", example: "mean(1,2,3)", category: "basic" }
      ]
    },
    {
      title: "Trigonometry",
      icon: <Zap className="h-5 w-5" />,
      shortcuts: [
        { key: "Ctrl+S", description: "Sine function", example: "sin(45) = 0.707", category: "trig" },
        { key: "Ctrl+C", description: "Cosine function", example: "cos(60) = 0.5", category: "trig" },
        { key: "Ctrl+T", description: "Tangent function", example: "tan(45) = 1", category: "trig" },
        { key: "asin()", description: "Arc sine", example: "asin(0.5) = 30°", category: "trig" },
        { key: "acos()", description: "Arc cosine", example: "acos(0.5) = 60°", category: "trig" },
        { key: "atan()", description: "Arc tangent", example: "atan(1) = 45°", category: "trig" },
        { key: "Ctrl+P", description: "Pi constant (π)", example: "2*pi = 6.283", category: "trig" }
      ]
    },
    {
      title: "Calculus",
      icon: <Brain className="h-5 w-5" />,
      shortcuts: [
        { key: "Ctrl+D", description: "Derivative", example: "derivative(x^2,x) = 2x", category: "calculus" },
        { key: "Ctrl+I", description: "Integral", example: "integral(x^2,0,1) = 1/3", category: "calculus" },
        { key: "limit()", description: "Limit", example: "limit(sin(x)/x,x,0) = 1", category: "calculus" },
        { key: "sum()", description: "Summation", example: "sum(n,1,10) = 55", category: "calculus" },
        { key: "product()", description: "Product", example: "product(n,1,5) = 120", category: "calculus" }
      ]
    },
    {
      title: "Algebra",
      icon: <BookOpen className="h-5 w-5" />,
      shortcuts: [
        { key: "Ctrl+F", description: "Factor expression", example: "factor(x^2-4) = (x-2)(x+2)", category: "algebra" },
        { key: "expand()", description: "Expand expression", example: "expand((x+1)^2) = x^2+2x+1", category: "algebra" },
        { key: "simplify()", description: "Simplify expression", example: "simplify(2x+3x) = 5x", category: "algebra" },
        { key: "solve()", description: "Solve equation", example: "solve(x^2-4=0) = [-2,2]", category: "algebra" },
        { key: "roots()", description: "Find roots", example: "roots(x^2-4) = [-2,2]", category: "algebra" }
      ]
    },
    {
      title: "Linear Algebra",
      icon: <Keyboard className="h-5 w-5" />,
      shortcuts: [
        { key: "det()", description: "Matrix determinant", example: "det([[1,2],[3,4]]) = -2", category: "matrix" },
        { key: "inv()", description: "Matrix inverse", example: "inv([[1,2],[3,4]])", category: "matrix" },
        { key: "transpose()", description: "Matrix transpose", example: "transpose([[1,2],[3,4]])", category: "matrix" },
        { key: "trace()", description: "Matrix trace", example: "trace([[1,2],[3,4]]) = 5", category: "matrix" },
        { key: "eigen()", description: "Eigenvalues", example: "eigen([[1,2],[3,4]])", category: "matrix" },
        { key: "identity()", description: "Identity matrix", example: "identity(3)", category: "matrix" }
      ]
    },
    {
      title: "Statistics & Probability",
      icon: <Zap className="h-5 w-5" />,
      shortcuts: [
        { key: "mean()", description: "Mean/Average", example: "mean([1,2,3,4,5]) = 3", category: "stats" },
        { key: "median()", description: "Median", example: "median([1,2,3,4,5]) = 3", category: "stats" },
        { key: "mode()", description: "Mode", example: "mode([1,2,2,3]) = 2", category: "stats" },
        { key: "std()", description: "Standard deviation", example: "std([1,2,3,4,5]) = 1.58", category: "stats" },
        { key: "variance()", description: "Variance", example: "variance([1,2,3,4,5]) = 2.5", category: "stats" },
        { key: "C()", description: "Combinations", example: "C(5,2) = 10", category: "probability" },
        { key: "P()", description: "Permutations", example: "P(5,2) = 20", category: "probability" }
      ]
    },
    {
      title: "Advanced Functions",
      icon: <Brain className="h-5 w-5" />,
      shortcuts: [
        { key: "Ctrl+R", description: "Square root", example: "sqrt(16) = 4", category: "advanced" },
        { key: "Ctrl+L", description: "Natural logarithm", example: "log(e) = 1", category: "advanced" },
        { key: "log10()", description: "Base-10 logarithm", example: "log10(100) = 2", category: "advanced" },
        { key: "log2()", description: "Base-2 logarithm", example: "log2(8) = 3", category: "advanced" },
        { key: "Ctrl+E", description: "Exponential (e^x)", example: "e^1 = 2.718", category: "advanced" },
        { key: "abs()", description: "Absolute value", example: "abs(-5) = 5", category: "advanced" },
        { key: "floor()", description: "Floor function", example: "floor(3.7) = 3", category: "advanced" },
        { key: "ceil()", description: "Ceiling function", example: "ceil(3.2) = 4", category: "advanced" }
      ]
    },
    {
      title: "Enhanced AI Calculator",
      icon: <Brain className="h-5 w-5" />,
      shortcuts: [
        { key: "Natural Language", description: "Type questions in plain English", example: "What is the derivative of x squared?", category: "ai" },
        { key: "Step-by-Step", description: "Get detailed solution steps", example: "Shows method and confidence score", category: "ai" },
        { key: "Visual Effects", description: "Magic UI animations and effects", example: "Floating elements, sparkles, gradients", category: "ai" },
        { key: "Copy Results", description: "Copy solutions to clipboard", example: "Click copy button in messages", category: "ai" },
        { key: "Confidence Score", description: "AI accuracy indicator", example: "Shows 95% confidence for results", category: "ai" },
        { key: "Method Display", description: "Shows solving method used", example: "Integration by parts, Chain rule", category: "ai" }
      ]
    },
    {
      title: "System Controls",
      icon: <Keyboard className="h-5 w-5" />,
      shortcuts: [
        { key: "Enter", description: "Calculate result", example: "Type expression and press Enter", category: "system" },
        { key: "Escape", description: "Clear all", example: "Reset calculator to 0", category: "system" },
        { key: "Backspace", description: "Delete last character", example: "Remove last typed digit", category: "system" },
        { key: "Ctrl+Z", description: "Undo", example: "Revert last action", category: "system" },
        { key: "Ctrl+Y", description: "Redo", example: "Restore undone action", category: "system" },
        { key: "Tab", description: "Switch between modes", example: "Navigate calculator tabs", category: "system" }
      ]
    }
  ]

  const allShortcuts = shortcutCategories.flatMap(cat => cat.shortcuts)

  const filteredShortcuts = allShortcuts.filter(shortcut => 
    shortcut.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shortcut.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    shortcut.example.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  const toggleCategory = (category: string) => {
    setExpandedCategory(expandedCategory === category ? null : category)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <BookOpen className="h-8 w-8 text-blue-400" />
            AdvMath.ai User Manual
          </h1>
          <p className="text-blue-200 text-lg">
            Complete Guide to Keyboard Shortcuts & Mathematical Functions
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search shortcuts, functions, or examples..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {/* Quick Reference */}
        <Card className="mb-8 bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Command className="h-5 w-5" />
              Quick Reference
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="text-blue-300 font-semibold mb-2">🧮 Basic Math</h4>
                <p className="text-white/80 text-sm">Type: 2+2*3-4/2</p>
                <p className="text-white/60 text-xs mt-1">Direct typing enabled</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="text-green-300 font-semibold mb-2">📐 Trigonometry</h4>
                <p className="text-white/80 text-sm">Ctrl+S: sin(45)</p>
                <p className="text-white/60 text-xs mt-1">Ctrl+C: cos, Ctrl+T: tan</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="text-purple-300 font-semibold mb-2">📈 Calculus</h4>
                <p className="text-white/80 text-sm">Ctrl+D: derivative(x^2,x)</p>
                <p className="text-white/60 text-xs mt-1">Ctrl+I: integral(x^2,0,1)</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="text-orange-300 font-semibold mb-2">🧊 Algebra</h4>
                <p className="text-white/80 text-sm">Ctrl+F: factor(x^2-4)</p>
                <p className="text-white/60 text-xs mt-1">solve(), expand(), simplify()</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="text-red-300 font-semibold mb-2">🤖 Enhanced AI</h4>
                <p className="text-white/80 text-sm">Natural language queries</p>
                <p className="text-white/60 text-xs mt-1">Magic UI effects, step-by-step</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="text-yellow-300 font-semibold mb-2">📊 Visualizations</h4>
                <p className="text-white/80 text-sm">Interactive 2D/3D graphs</p>
                <p className="text-white/60 text-xs mt-1">Export, zoom, rotate</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="text-pink-300 font-semibold mb-2">🔢 Matrix Ops</h4>
                <p className="text-white/80 text-sm">det([[1,2],[3,4]])</p>
                <p className="text-white/60 text-xs mt-1">inv(), transpose(), eigen()</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="text-cyan-300 font-semibold mb-2">📈 Statistics</h4>
                <p className="text-white/80 text-sm">mean([1,2,3,4,5])</p>
                <p className="text-white/60 text-xs mt-1">std(), variance(), C(), P()</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        {searchTerm && (
          <Card className="mb-8 bg-white/10 backdrop-blur-md border-white/20">
            <CardHeader>
              <CardTitle className="text-white">
                Search Results ({filteredShortcuts.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {filteredShortcuts.map((shortcut, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div className="flex-1">
                      <span className="text-blue-300 font-mono font-semibold">{shortcut.key}</span>
                      <span className="text-white/80 ml-3">{shortcut.description}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-white/60 text-sm font-mono">{shortcut.example}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(shortcut.example)}
                        className="text-white/60 hover:text-white"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Detailed Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {shortcutCategories.map((category) => (
            <Card key={category.title} className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader>
                <CardTitle 
                  className="text-white flex items-center justify-between cursor-pointer"
                  onClick={() => toggleCategory(category.title)}
                >
                  <div className="flex items-center gap-2">
                    {category.icon}
                    {category.title}
                  </div>
                  {expandedCategory === category.title ? (
                    <ChevronUp className="h-5 w-5" />
                  ) : (
                    <ChevronDown className="h-5 w-5" />
                  )}
                </CardTitle>
              </CardHeader>
              {expandedCategory === category.title && (
                <CardContent>
                  <div className="space-y-3">
                    {category.shortcuts.map((shortcut, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                        <div className="flex-shrink-0">
                          <kbd className="bg-blue-900 text-blue-200 px-2 py-1 rounded text-sm font-mono">
                            {shortcut.key}
                          </kbd>
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-medium">{shortcut.description}</div>
                          <div className="text-white/60 text-sm mt-1 font-mono">{shortcut.example}</div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(shortcut.example)}
                          className="text-white/60 hover:text-white flex-shrink-0"
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Usage Tips */}
        <Card className="mt-8 bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Pro Tips & Usage Guide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-blue-300 font-semibold mb-3">🚀 Getting Started</h4>
                <ul className="space-y-2 text-white/80">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-1 text-blue-400 flex-shrink-0" />
                    <span>Start typing directly in the display - no need to click buttons</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-1 text-blue-400 flex-shrink-0" />
                    <span>Press Enter to calculate your expression instantly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-1 text-blue-400 flex-shrink-0" />
                    <span>Use Ctrl+key combinations for complex functions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-1 text-blue-400 flex-shrink-0" />
                    <span>Switch between Classic and Advanced AI Calculator modes</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-green-300 font-semibold mb-3">💡 Advanced Features</h4>
                <ul className="space-y-2 text-white/80">
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-1 text-green-400 flex-shrink-0" />
                    <span>Chain multiple operations: derivative(integral(x^2,x),x)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-1 text-green-400 flex-shrink-0" />
                    <span>Work with matrices: [[1,2],[3,4]] for 2x2 matrix</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-1 text-green-400 flex-shrink-0" />
                    <span>Use arrays for statistics: [1,2,3,4,5]</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <ArrowRight className="h-4 w-4 mt-1 text-green-400 flex-shrink-0" />
                    <span>Access step-by-step solutions in Advanced AI mode</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-900/30 rounded-lg border border-blue-400/30">
              <h4 className="text-blue-300 font-semibold mb-2">🎯 Expression Examples</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className="text-white/80">
                  <span className="text-blue-400">Basic:</span> 2+3*4-5/2
                </div>
                <div className="text-white/80">
                  <span className="text-green-400">Trigonometry:</span> sin(45)+cos(30)
                </div>
                <div className="text-white/80">
                  <span className="text-purple-400">Calculus:</span> derivative(x^3+2x,x)
                </div>
                <div className="text-white/80">
                  <span className="text-orange-400">Algebra:</span> factor(x^2-9)
                </div>
                <div className="text-white/80">
                  <span className="text-red-400">Matrix:</span> det([[1,2],[3,4]])
                </div>
                <div className="text-white/80">
                  <span className="text-yellow-400">Statistics:</span> mean([1,2,3,4,5])
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
