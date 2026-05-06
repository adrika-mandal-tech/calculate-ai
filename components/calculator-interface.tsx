"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { History, Calculator, Sigma, BarChart3, Code, Zap, Database, Cpu, Grid3x3, TrendingUp, Braces, RotateCcw, RotateCw } from "lucide-react"
import { mathEngine } from '@/lib/math-engine'
import { useHistoryStore } from "@/store/history-store"
import { InlineMath } from "react-katex"
import "katex/dist/katex.min.css"

interface CalculatorInterfaceProps {
  onHistoryClick: () => void
  initialExpression?: string
  onExpressionSelected?: () => void
}

export function CalculatorInterface({ 
  onHistoryClick, 
  initialExpression = "", 
  onExpressionSelected 
}: CalculatorInterfaceProps) {
  const [display, setDisplay] = useState("0")
  const [expression, setExpression] = useState("")
  const [error, setError] = useState("")
  const [angleMode, setAngleMode] = useState<"deg" | "rad" | "grad">("deg")
  const [numberSystem, setNumberSystem] = useState<"dec" | "bin" | "hex" | "oct">("dec")
  const [activeTab, setActiveTab] = useState("basic")
  const [memory, setMemory] = useState<number>(0)
  const [variables, setVariables] = useState<Record<string, number>>({})
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [solutionSteps, setSolutionSteps] = useState<string>("")
  const [showSolution, setShowSolution] = useState(false)
  const displayRef = useRef<HTMLInputElement>(null)
  const { addEntry } = useHistoryStore()

  useEffect(() => {
    if (initialExpression) {
      setExpression(initialExpression)
      setDisplay(initialExpression)
      onExpressionSelected?.()
    }
  }, [initialExpression, onExpressionSelected])

  useEffect(() => {
    mathEngine.setAngleMode(angleMode as 'deg' | 'rad')
  }, [angleMode])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only handle keys if the display is not focused or for special keys
      if (document.activeElement !== displayRef.current || e.ctrlKey || e.altKey) {
        // Prevent default for calculator keys
        if (e.key >= "0" && e.key <= "9" || e.key === "." || 
            e.key === "+" || e.key === "-" || e.key === "*" || e.key === "/" ||
            e.key === "(" || e.key === ")" || e.key === "^" || e.key === "!" || e.key === ",") {
          if (document.activeElement !== displayRef.current) {
            e.preventDefault()
            handleInput(e.key)
          }
        } else if (e.key === "Enter" || e.key === "=") {
          if (document.activeElement !== displayRef.current) {
            e.preventDefault()
            handleEquals()
          }
        } else if (e.key === "Escape" || e.key === "c" || e.key === "C") {
          if (document.activeElement !== displayRef.current) {
            e.preventDefault()
            handleClear()
          }
        } else if (e.key === "Backspace") {
          if (document.activeElement !== displayRef.current) {
            e.preventDefault()
            handleBackspace()
          }
        }
      }
      
      // Special key combinations that work regardless of focus
      if (e.ctrlKey || e.altKey) {
        if (e.key.toLowerCase() === "s") {
          e.preventDefault()
          handleInput("sin(")
          displayRef.current?.focus()
        } else if (e.key.toLowerCase() === "c" && e.ctrlKey) {
          e.preventDefault()
          handleInput("cos(")
          displayRef.current?.focus()
        } else if (e.key.toLowerCase() === "t") {
          e.preventDefault()
          handleInput("tan(")
          displayRef.current?.focus()
        } else if (e.key.toLowerCase() === "l") {
          e.preventDefault()
          handleInput("log(")
          displayRef.current?.focus()
        } else if (e.key.toLowerCase() === "r") {
          e.preventDefault()
          handleInput("sqrt(")
          displayRef.current?.focus()
        } else if (e.key === "%") {
          e.preventDefault()
          handleInput("%")
          displayRef.current?.focus()
        } else if (e.key.toLowerCase() === "d") {
          e.preventDefault()
          handleInput("derivative(")
          displayRef.current?.focus()
        } else if (e.key.toLowerCase() === "i") {
          e.preventDefault()
          handleInput("integral(")
          displayRef.current?.focus()
        } else if (e.key.toLowerCase() === "f") {
          e.preventDefault()
          handleInput("factor(")
          displayRef.current?.focus()
        } else if (e.key.toLowerCase() === "e") {
          e.preventDefault()
          handleInput("e^")
          displayRef.current?.focus()
        } else if (e.key.toLowerCase() === "p") {
          e.preventDefault()
          handleInput("pi")
          displayRef.current?.focus()
        }
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [expression, display])

  const handleDisplayChange = (value: string) => {
    setError("")
    setDisplay(value)
    setExpression(value)
    
    // Update history
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(value)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  const handleInput = (value: string) => {
    setError("")
    
    // Auto bracket closing logic
    if (value === "(") {
      const newExpression = display === "0" ? "(" : display + "("
      setDisplay(newExpression)
      setExpression(newExpression)
      return
    }
    
    if (value === ")") {
      // Only add closing bracket if there's an unmatched opening bracket
      const openCount = (display.match(/\(/g) || []).length
      const closeCount = (display.match(/\)/g) || []).length
      if (openCount > closeCount) {
        const newExpression = display + ")"
        setDisplay(newExpression)
        setExpression(newExpression)
      }
      return
    }
    
    // Auto-close brackets for functions
    if (value.includes("(") && !value.includes(")")) {
      const newExpression = display === "0" ? value : display + value
      setDisplay(newExpression)
      setExpression(newExpression)
      return
    }
    
    // Save current state to history before making changes
    const newExpression = display === "0" && value !== "." ? value : display + value
    const newDisplay = newExpression
    
    // Update history
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newExpression)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
    
    if (display === "0" && value !== ".") {
      setDisplay(value)
      setExpression(value)
    } else {
      setDisplay(display + value)
      setExpression(expression + value)
    }
  }

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      const previousExpression = history[newIndex]
      setDisplay(previousExpression)
      setExpression(previousExpression)
      setError("")
    }
  }

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      const nextExpression = history[newIndex]
      setDisplay(nextExpression)
      setExpression(nextExpression)
      setError("")
    }
  }

  const handleClear = () => {
    setDisplay("0")
    setExpression("")
    setError("")
  }

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1))
      setExpression(expression.slice(0, -1))
    } else {
      setDisplay("0")
      setExpression("")
    }
    setError("")
  }

  const validateExpression = (expr: string): boolean => {
    if (!expr || expr.trim() === "") return false
    
    let parenCount = 0
    for (const char of expr) {
      if (char === '(') parenCount++
      else if (char === ')') parenCount--
      if (parenCount < 0) return false
    }
    if (parenCount !== 0) return false
    
    // Expanded validation to support all math functions and symbols
    const validPattern = /^[0-9+\-*/().\s_a-zA-Z^!√πφ≤≥≠∈∉]+$/
    if (!validPattern.test(expr)) return false
    
    return true
  }

  const handleEquals = () => {
    // Get the current expression from display (allow direct user input)
    const currentExpression = display.trim() || expression.trim()
    
    if (!currentExpression || currentExpression === "0") {
      setError("Please enter a mathematical expression")
      return
    }

    if (!validateExpression(currentExpression)) {
      setError("Invalid mathematical expression")
      return
    }

    try {
      const result = mathEngine.calculate(currentExpression)
      if (result.error) {
        setError(result.error)
        return
      }
      
      const resultStr = String(result.result)
      setDisplay(resultStr)
      addEntry(currentExpression, resultStr)
      setExpression(resultStr)
      
      // Show solution steps if available
      if (result.details) {
        setSolutionSteps(result.details)
        setShowSolution(true)
      }
    } catch (err) {
      setError(`Calculation error: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  // Add a handleRun function that does the same as handleEquals for the Run button
  const handleRun = () => {
    handleEquals()
  }

  const handleFunction = (func: string) => {
    // Prompt user for input when function buttons are clicked
    const userInput = prompt(`Enter expression for ${func}:`, "")
    if (userInput !== null && userInput.trim() !== "") {
      const fullExpression = `${func}(${userInput})`
      setDisplay(fullExpression)
      setExpression(fullExpression)
      setError("")
    }
  }

  const handleConstant = (constant: string) => {
    const constants: Record<string, number> = {
      'pi': Math.PI,
      'e': Math.E,
      'phi': 1.618033988749895,
      'c': 299792458,
      'h': 6.62607015e-34,
      'g': 9.80665,
      'na': 6.02214076e23
    }
    handleInput(String(constants[constant] || constant))
  }

  const handleMemoryOperation = (operation: 'MC' | 'MR' | 'MS' | 'M+' | 'M-') => {
    const currentValue = parseFloat(display)
    switch (operation) {
      case 'MC':
        setMemory(0)
        break
      case 'MR':
        setDisplay(String(memory))
        setExpression(String(memory))
        break
      case 'MS':
        setMemory(currentValue)
        break
      case 'M+':
        setMemory(memory + currentValue)
        break
      case 'M-':
        setMemory(memory - currentValue)
        break
    }
  }

  const handleNumberSystemConversion = (from: string, to: string) => {
    try {
      let decimal = 0
      switch (from) {
        case 'bin':
          decimal = parseInt(display, 2)
          break
        case 'hex':
          decimal = parseInt(display, 16)
          break
        case 'oct':
          decimal = parseInt(display, 8)
          break
        default:
          decimal = parseFloat(display)
      }
      
      let result = ''
      switch (to) {
        case 'bin':
          result = decimal.toString(2)
          break
        case 'hex':
          result = decimal.toString(16).toUpperCase()
          break
        case 'oct':
          result = decimal.toString(8)
          break
        default:
          result = String(decimal)
      }
      
      setDisplay(result)
      setExpression(result)
    } catch (err) {
      setError("Conversion error")
    }
  }

  const renderBasicButtons = () => (
    <div className="space-y-2">
      {[
        ["C", "⌫", "(", ")"],
        ["7", "8", "9", "÷"],
        ["4", "5", "6", "×"],
        ["1", "2", "3", "-"],
        ["0", ".", ",", "+"],
        ["!", "^", "%", "Run", "="]
      ].map((row, i) => (
        <div key={i} className={`grid gap-2 ${row.length === 5 ? 'grid-cols-5' : 'grid-cols-4'}`}>
          {row.map((btn) => (
            <Button
              key={btn}
              variant={btn === "=" || btn === "Run" ? "default" : "outline"}
              className={`h-14 text-lg font-bold bg-black text-yellow-400 border-orange-600 hover:bg-orange-900 hover:text-yellow-300 ${btn === "Run" ? 'bg-green-800 hover:bg-green-700' : ''}`}
              onClick={() => {
                if (btn === "C") handleClear()
                else if (btn === "⌫") handleBackspace()
                else if (btn === "±") handleInput("-")
                else if (btn === "%") handleInput("/100")
                else if (btn === "÷") handleInput("/")
                else if (btn === "×") handleInput("*")
                else if (btn === "=") handleEquals()
                else if (btn === "Run") handleRun()
                else if (btn === "!") handleInput("!")
                else if (btn === "^") handleInput("^")
                else if (btn === ",") handleInput(",")
                else handleInput(btn)
              }}
            >
              {btn}
            </Button>
          ))}
        </div>
      ))}
    </div>
  )

  const renderScientificButtons = () => (
    <div className="space-y-2">
      {[
        ["sin", "cos", "tan", "log"],
        ["asin", "acos", "atan", "ln"],
        ["x²", "√", "x^y", "!"],
        ["π", "e", "abs", "mod"],
        ["floor", "ceil", "round", "exp"]
      ].map((row, i) => (
        <div key={i} className="grid grid-cols-4 gap-2">
          {row.map((btn) => (
            <Button
              key={btn}
              variant="outline"
              className="h-12 text-sm bg-black text-yellow-400 border-orange-600 hover:bg-orange-900"
              onClick={() => {
                if (btn === "x²") handleInput("^2")
                else if (btn === "√") handleFunction("sqrt")
                else if (btn === "x^y") handleInput("^")
                else if (btn === "π") handleConstant("pi")
                else if (btn === "e") handleConstant("e")
                else if (btn === "!") handleFunction("factorial")
                else if (btn === "abs") handleFunction("abs")
                else if (btn === "floor") handleFunction("floor")
                else if (btn === "ceil") handleFunction("ceil")
                else if (btn === "mod") handleInput("%")
                else if (btn === "round") handleFunction("round")
                else if (btn === "exp") handleFunction("exp")
                else handleFunction(btn)
              }}
            >
              {btn}
            </Button>
          ))}
        </div>
      ))}
    </div>
  )

  const renderAlgebraButtons = () => (
    <div className="space-y-2">
      {[
        ["solve", "expand", "factor", "simplify"],
        ["derivative", "integral", "limit", "sum"],
        ["x", "y", "z", "t"],
        ["=", "≠", "<", ">"],
        ["≤", "≥", "∈", "∉"],
        ["∀", "∃", "∧", "∨"],
        ["→", "↔", "∅", "∞"]
      ].map((row, i) => (
        <div key={i} className="grid grid-cols-4 gap-2">
          {row.map((btn) => (
            <Button
              key={btn}
              variant="outline"
              className="h-12 text-sm bg-black text-yellow-400 border-orange-600 hover:bg-orange-900"
              onClick={() => {
                if (btn === "solve") handleInput("solve(")
                else if (btn === "expand") handleInput("expand(")
                else if (btn === "factor") handleInput("factor(")
                else if (btn === "simplify") handleInput("simplify(")
                else if (btn === "derivative") handleInput("derivative(")
                else if (btn === "integral") handleInput("integral(")
                else if (btn === "limit") handleInput("limit(")
                else if (btn === "sum") handleInput("sum(")
                else handleInput(btn)
              }}
            >
              {btn}
            </Button>
          ))}
        </div>
      ))}
    </div>
  )

  const renderMatrixButtons = () => (
    <div className="space-y-2">
      {[
        ["[A]", "[B]", "det", "trace"],
        ["inv", "transpose", "identity", "zeros"],
        ["ones", "multiply", "add", "subtract"],
        ["+", "-", "*", "/"],
        ["2x2", "3x3", "rank", "eigen"]
      ].map((row, i) => (
        <div key={i} className="grid grid-cols-4 gap-2">
          {row.map((btn) => (
            <Button
              key={btn}
              variant="outline"
              className="h-12 text-sm bg-black text-yellow-400 border-orange-600 hover:bg-orange-900"
              onClick={() => {
                if (btn === "[A]") handleInput("[[1,2],[3,4]]")
                else if (btn === "[B]") handleInput("[[5,6],[7,8]]")
                else if (btn === "2x2") handleInput("[[a,b],[c,d]]")
                else if (btn === "3x3") handleInput("[[a,b,c],[d,e,f],[g,h,i]]")
                else if (btn === "det") handleInput("det(")
                else if (btn === "inv") handleInput("inv(")
                else if (btn === "transpose") handleInput("transpose(")
                else if (btn === "trace") handleInput("trace(")
                else if (btn === "identity") handleInput("identity(")
                else if (btn === "zeros") handleInput("zeros(")
                else if (btn === "ones") handleInput("ones(")
                else if (btn === "multiply") handleInput("*")
                else if (btn === "add") handleInput("+")
                else if (btn === "subtract") handleInput("-")
                else if (btn === "rank") handleInput("rank(")
                else if (btn === "eigen") handleInput("eigen(")
                else handleInput(btn)
              }}
            >
              {btn}
            </Button>
          ))}
        </div>
      ))}
    </div>
  )

  const renderStatisticsButtons = () => (
    <div className="space-y-2">
      {[
        ["mean", "median", "mode", "range"],
        ["var", "stdev", "corr", "regress"],
        ["nPr", "nCr", "!", "perm"],
        ["normal", "binom", "poisson", "uniform"],
        ["hist", "box", "scatter", "line"]
      ].map((row, i) => (
        <div key={i} className="grid grid-cols-4 gap-2">
          {row.map((btn) => (
            <Button
              key={btn}
              variant="outline"
              className="h-12 text-sm bg-black text-yellow-400 border-orange-600 hover:bg-orange-900"
              onClick={() => handleFunction(btn)}
            >
              {btn}
            </Button>
          ))}
        </div>
      ))}
    </div>
  )

  const renderNumberSystemButtons = () => (
    <div className="space-y-2">
      {[
        ["DEC", "BIN", "HEX", "OCT"],
        ["AND", "OR", "XOR", "NOT"],
        ["<<", ">>", "<<<", ">>>"],
        ["0", "1", "2", "3"],
        ["4", "5", "6", "7"],
        ["8", "9", "A", "B"],
        ["C", "D", "E", "F"]
      ].map((row, i) => (
        <div key={i} className="grid grid-cols-4 gap-2">
          {row.map((btn) => (
            <Button
              key={btn}
              variant="outline"
              className="h-12 text-sm bg-black text-yellow-400 border-orange-600 hover:bg-orange-900"
              onClick={() => {
                if (["DEC", "BIN", "HEX", "OCT"].includes(btn)) {
                  setNumberSystem(btn.toLowerCase() as any)
                } else if (["AND", "OR", "XOR", "NOT"].includes(btn)) {
                  handleInput(btn.toLowerCase())
                } else {
                  handleInput(btn)
                }
              }}
            >
              {btn}
            </Button>
          ))}
        </div>
      ))}
    </div>
  )

  const renderProgrammingButtons = () => (
    <div className="space-y-2">
      {[
        ["if", "else", "for", "while"],
        ["func", "return", "var", "const"],
        ["print", "input", "read", "write"],
        ["array", "list", "dict", "set"],
        ["true", "false", "null", "undef"]
      ].map((row, i) => (
        <div key={i} className="grid grid-cols-4 gap-2">
          {row.map((btn) => (
            <Button
              key={btn}
              variant="outline"
              className="h-12 text-sm bg-black text-yellow-400 border-orange-600 hover:bg-orange-900"
              onClick={() => handleInput(btn)}
            >
              {btn}
            </Button>
          ))}
        </div>
      ))}
    </div>
  )

  const renderConstantsButtons = () => (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-2">
        <Button variant="outline" className="h-12 text-sm bg-black text-yellow-400 border-orange-600 hover:bg-orange-900" onClick={() => handleConstant("pi")}>
          π ≈ 3.14159
        </Button>
        <Button variant="outline" className="h-12 text-sm bg-black text-yellow-400 border-orange-600 hover:bg-orange-900" onClick={() => handleConstant("e")}>
          e ≈ 2.71828
        </Button>
        <Button variant="outline" className="h-12 text-sm bg-black text-yellow-400 border-orange-600 hover:bg-orange-900" onClick={() => handleConstant("phi")}>
          φ ≈ 1.61803
        </Button>
        <Button variant="outline" className="h-12 text-sm bg-black text-yellow-400 border-orange-600 hover:bg-orange-900" onClick={() => handleConstant("c")}>
          c = 299,792,458 m/s
        </Button>
        <Button variant="outline" className="h-12 text-sm bg-black text-yellow-400 border-orange-600 hover:bg-orange-900" onClick={() => handleConstant("h")}>
          h = 6.626×10⁻³⁴ J⋅s
        </Button>
        <Button variant="outline" className="h-12 text-sm bg-black text-yellow-400 border-orange-600 hover:bg-orange-900" onClick={() => handleConstant("g")}>
          g = 9.80665 m/s²
        </Button>
        <Button variant="outline" className="h-12 text-sm bg-black text-yellow-400 border-orange-600 hover:bg-orange-900" onClick={() => handleConstant("na")}>
          Nₐ = 6.022×10²³
        </Button>
      </div>
    </div>
  )

  const tabs = [
    { id: "basic", label: "Basic", icon: Calculator, content: renderBasicButtons },
    { id: "scientific", label: "Scientific", icon: Zap, content: renderScientificButtons },
    { id: "algebra", label: "Algebra", icon: Sigma, content: renderAlgebraButtons },
    { id: "matrix", label: "Matrix", icon: Grid3x3, content: renderMatrixButtons },
    { id: "statistics", label: "Statistics", icon: BarChart3, content: renderStatisticsButtons },
    { id: "numbers", label: "Number Systems", icon: Code, content: renderNumberSystemButtons },
    { id: "programming", label: "Programming", icon: Cpu, content: renderProgrammingButtons },
    { id: "constants", label: "Constants", icon: Database, content: renderConstantsButtons }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-orange-950 to-black p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 bg-black/50 backdrop-blur-sm rounded-lg p-4 border border-orange-600">
          <h1 className="text-4xl font-bold text-orange-500 flex items-center gap-3">
            <Calculator className="h-10 w-10" />
            Math.Adv
          </h1>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              className="bg-black text-yellow-400 border-orange-600 hover:bg-orange-900"
              onClick={() => setAngleMode(angleMode === "deg" ? "rad" : angleMode === "rad" ? "grad" : "deg")}
            >
              {angleMode.toUpperCase()}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-black text-yellow-400 border-orange-600 hover:bg-orange-900"
              onClick={() => setNumberSystem(numberSystem === "dec" ? "bin" : numberSystem === "bin" ? "hex" : numberSystem === "hex" ? "oct" : "dec")}
            >
              {numberSystem.toUpperCase()}
            </Button>
            <Button variant="outline" size="sm" className="bg-black text-yellow-400 border-orange-600 hover:bg-orange-900" onClick={onHistoryClick}>
              <History className="h-4 w-4 mr-2" />
              History
            </Button>
          </div>
        </div>

        {/* Main Display */}
        <Card className="shadow-2xl border-2 border-orange-600 bg-black/90 backdrop-blur-sm mb-6">
          <CardContent className="p-6">
            {/* Undo/Redo Buttons */}
            <div className="flex justify-between items-center mb-4">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open('/user-manual', '_blank')}
                  className="bg-orange-900 text-yellow-400 border-orange-600 hover:bg-orange-800"
                >
                  📖 Manual
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleUndo}
                  disabled={historyIndex <= 0}
                  className="bg-orange-900 text-yellow-400 border-orange-600 hover:bg-orange-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RotateCcw className="h-4 w-4 mr-1" />
                  Undo
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRedo}
                  disabled={historyIndex >= history.length - 1}
                  className="bg-orange-900 text-yellow-400 border-orange-600 hover:bg-orange-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <RotateCw className="h-4 w-4 mr-1" />
                  Redo
                </Button>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="relative">
                <input
                  ref={displayRef}
                  type="text"
                  value={error ? error : (display || "0")}
                  onChange={(e) => handleDisplayChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleEquals()
                    }
                  }}
                  className={`w-full bg-black border-2 ${error ? 'border-red-500' : 'border-orange-600'} ${error ? 'text-red-500' : 'text-yellow-400'} p-6 rounded-lg text-right font-mono text-4xl min-h-[80px] focus:outline-none focus:ring-2 focus:ring-orange-400 overflow-x-auto`}
                  placeholder="Enter: 2+2, sin(45), derivative(x^2,x), integral(x^2,0,1)..."
                  autoFocus
                />
                <div className="absolute top-2 left-2 text-yellow-600 text-xs opacity-75">
                  <span className="hidden sm:inline">Type directly or use buttons • Press Enter to calculate</span>
                  <span className="sm:hidden">Tap to type • Enter = calculate</span>
                </div>
              </div>
              <div className="mt-2 text-left text-yellow-600 font-mono text-xs">
                <span className="mr-4">💡 <kbd className="bg-yellow-900 px-1 rounded">Ctrl+S</kbd> sin <kbd className="bg-yellow-900 px-1 rounded">Ctrl+C</kbd> cos <kbd className="bg-yellow-900 px-1 rounded">Ctrl+T</kbd> tan</span>
                <span className="mr-4"><kbd className="bg-yellow-900 px-1 rounded">Ctrl+D</kbd> derivative <kbd className="bg-yellow-900 px-1 rounded">Ctrl+I</kbd> integral</span>
                <span><kbd className="bg-yellow-900 px-1 rounded">Ctrl+P</kbd> π <kbd className="bg-yellow-900 px-1 rounded">Ctrl+E</kbd> e^</span>
              </div>
              <div className="mt-2 text-right text-yellow-600 font-mono text-sm">
                {expression && expression !== display && (
                  <span className="text-yellow-500">Expression: {expression}</span>
                )}
              </div>
            </div>

            {/* Memory Display */}
            <div className="flex justify-between items-center mb-4 text-yellow-600 text-sm">
              <span>M: {memory}</span>
              <div className="flex gap-2">
                {Object.entries(variables).map(([key, value]) => (
                  <span key={key}>{key}: {value}</span>
                ))}
              </div>
            </div>

            {/* Memory Buttons */}
            <div className="grid grid-cols-5 gap-2 mb-4">
              {["MC", "MR", "MS", "M+", "M-"].map((btn) => (
                <Button
                  key={btn}
                  variant="outline"
                  size="sm"
                  className="bg-black text-yellow-400 border-orange-600 hover:bg-orange-900"
                  onClick={() => handleMemoryOperation(btn as any)}
                >
                  {btn}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "outline"}
              className={`flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.id 
                  ? "bg-orange-600 text-black" 
                  : "bg-black text-yellow-400 border-orange-600 hover:bg-orange-900"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Tab Content */}
        <Card className="shadow-2xl border-2 border-orange-600 bg-black/90 backdrop-blur-sm">
          <CardContent className="p-6">
            {tabs.find(tab => tab.id === activeTab)?.content()}
          </CardContent>
        </Card>

        {/* Solution Steps Display */}
        {showSolution && solutionSteps && (
          <Card className="shadow-2xl border-2 border-green-600 bg-black/90 backdrop-blur-sm mt-4">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-green-400 text-lg font-bold">📊 Solution Steps</h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-black text-green-400 border-green-600 hover:bg-green-900"
                  onClick={() => setShowSolution(false)}
                >
                  ✕
                </Button>
              </div>
              <div className="bg-black/50 border border-green-600 rounded-lg p-4">
                <pre className="text-green-300 text-sm font-mono whitespace-pre-wrap">
                  {solutionSteps}
                </pre>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
