"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { mathEngine } from "@/lib/math-engine"
import { useHistoryStore } from "@/store/history-store"
import { Calculator, Plus, Minus, X, Divide, Grid3x3 } from "lucide-react"
import { motion } from "framer-motion"

interface MatrixDialogProps {
  open: boolean
  onClose: () => void
  onResult: (result: string) => void
}

export function MatrixDialog({ open, onClose, onResult }: MatrixDialogProps) {
  const [rows1, setRows1] = useState(2)
  const [cols1, setCols1] = useState(2)
  const [rows2, setRows2] = useState(2)
  const [cols2, setCols2] = useState(2)
  const [matrix1, setMatrix1] = useState<number[][]>([[0, 0], [0, 0]])
  const [matrix2, setMatrix2] = useState<number[][]>([[0, 0], [0, 0]])
  const [operation, setOperation] = useState<string>("add")
  const [result, setResult] = useState<number[][] | null>(null)
  const [error, setError] = useState("")
  const { addEntry } = useHistoryStore()

  const updateMatrixSize = (matrixNum: 1 | 2, newRows: number, newCols: number) => {
    if (matrixNum === 1) {
      setRows1(newRows)
      setCols1(newCols)
      const newMatrix: number[][] = []
      for (let i = 0; i < newRows; i++) {
        newMatrix[i] = []
        for (let j = 0; j < newCols; j++) {
          newMatrix[i][j] = matrix1[i]?.[j] || 0
        }
      }
      setMatrix1(newMatrix)
    } else {
      setRows2(newRows)
      setCols2(newCols)
      const newMatrix: number[][] = []
      for (let i = 0; i < newRows; i++) {
        newMatrix[i] = []
        for (let j = 0; j < newCols; j++) {
          newMatrix[i][j] = matrix2[i]?.[j] || 0
        }
      }
      setMatrix2(newMatrix)
    }
  }

  const updateMatrixValue = (matrixNum: 1 | 2, row: number, col: number, value: string) => {
    const numValue = parseFloat(value) || 0
    if (matrixNum === 1) {
      const newMatrix = matrix1.map((r, i) =>
        r.map((c, j) => (i === row && j === col ? numValue : c))
      )
      setMatrix1(newMatrix)
    } else {
      const newMatrix = matrix2.map((r, i) =>
        r.map((c, j) => (i === row && j === col ? numValue : c))
      )
      setMatrix2(newMatrix)
    }
  }

  const calculate = () => {
    setError("")
    setResult(null)

    try {
      let resultMatrix: number[][]
      
      if (operation === "multiply") {
        if (cols1 !== rows2) {
          setError(`Matrix dimensions incompatible: ${rows1}×${cols1} × ${rows2}×${cols2}`)
          return
        }
      } else if (operation === "add" || operation === "subtract" || operation === "divide") {
        if (rows1 !== rows2 || cols1 !== cols2) {
          setError(`Matrix dimensions must match: ${rows1}×${cols1} vs ${rows2}×${cols2}`)
          return
        }
      }

      const calcResult = mathEngine.matrixOperations(operation, matrix1, matrix2)
      
      if (calcResult.error) {
        setError(calcResult.error)
        return
      }

      // Parse result - mathjs returns matrix objects, need to convert to array
      if (calcResult.result && typeof calcResult.result === 'object' && 'toArray' in calcResult.result) {
        // mathjs matrix object
        resultMatrix = (calcResult.result as any).toArray()
      } else if (typeof calcResult.result === 'string') {
        try {
          const parsed = JSON.parse(calcResult.result)
          if (Array.isArray(parsed) && Array.isArray(parsed[0])) {
            resultMatrix = parsed
          } else if (Array.isArray(parsed)) {
            resultMatrix = [parsed]
          } else {
            resultMatrix = [[parseFloat(calcResult.result)]]
          }
        } catch {
          // If it's a single number (determinant, etc.)
          const numValue = parseFloat(calcResult.result)
          resultMatrix = isNaN(numValue) ? [[0]] : [[numValue]]
        }
      } else if (Array.isArray(calcResult.result)) {
        if (Array.isArray(calcResult.result[0])) {
          resultMatrix = calcResult.result as number[][]
        } else {
          resultMatrix = [calcResult.result as number[]]
        }
      } else {
        resultMatrix = [[calcResult.result as number]]
      }

      setResult(resultMatrix)
      
      // Add to history
      const matrix1Str = `[${matrix1.map(r => `[${r.join(',')}]`).join(',')}]`
      const matrix2Str = `[${matrix2.map(r => `[${r.join(',')}]`).join(',')}]`
      addEntry(
        `Matrix ${operation}: ${matrix1Str} ${operation === 'multiply' ? '×' : operation === 'add' ? '+' : operation === 'subtract' ? '-' : '÷'} ${matrix2Str}`,
        JSON.stringify(resultMatrix)
      )
    } catch (err: any) {
      setError(err.message || "Calculation failed")
    }
  }

  const handleClose = () => {
    setMatrix1([[0, 0], [0, 0]])
    setMatrix2([[0, 0], [0, 0]])
    setResult(null)
    setError("")
    setOperation("add")
    onClose()
  }

  const handleUseResult = () => {
    if (result) {
      onResult(JSON.stringify(result))
      handleClose()
    }
  }

  const renderMatrix = (matrix: number[][], matrixNum: 1 | 2) => (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-2">
        <Grid3x3 className="h-4 w-4 text-blue-600" />
        <span className="font-semibold text-gray-700">Matrix {matrixNum}</span>
        <div className="flex items-center gap-2 ml-auto">
          <Input
            type="number"
            min="1"
            max="5"
            value={matrixNum === 1 ? rows1 : rows2}
            onChange={(e) => updateMatrixSize(matrixNum, parseInt(e.target.value) || 1, matrixNum === 1 ? cols1 : cols2)}
            className="w-16 h-8 text-center"
            placeholder="R"
          />
          <span className="text-gray-500">×</span>
          <Input
            type="number"
            min="1"
            max="5"
            value={matrixNum === 1 ? cols1 : cols2}
            onChange={(e) => updateMatrixSize(matrixNum, matrixNum === 1 ? rows1 : rows2, parseInt(e.target.value) || 1)}
            className="w-16 h-8 text-center"
            placeholder="C"
          />
        </div>
      </div>
      <div className="border-2 border-blue-200 rounded-lg p-3 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${matrixNum === 1 ? cols1 : cols2}, minmax(0, 1fr))` }}>
          {matrix.map((row, i) =>
            row.map((cell, j) => (
              <Input
                key={`${i}-${j}`}
                type="number"
                step="any"
                value={cell === 0 ? "" : cell}
                onChange={(e) => updateMatrixValue(matrixNum, i, j, e.target.value)}
                className="text-center font-mono bg-white border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                placeholder="0"
              />
            ))
          )}
        </div>
      </div>
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Matrix Operations
          </DialogTitle>
          <DialogDescription>
            Perform matrix addition, subtraction, multiplication, and division. Adjust matrix dimensions and enter values.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Operation Selector */}
          <div className="flex gap-2 justify-center">
            <Button
              variant={operation === "add" ? "default" : "outline"}
              onClick={() => setOperation("add")}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
            <Button
              variant={operation === "subtract" ? "default" : "outline"}
              onClick={() => setOperation("subtract")}
              className="gap-2"
            >
              <Minus className="h-4 w-4" />
              Subtract
            </Button>
            <Button
              variant={operation === "multiply" ? "default" : "outline"}
              onClick={() => setOperation("multiply")}
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Multiply
            </Button>
            <Button
              variant={operation === "divide" ? "default" : "outline"}
              onClick={() => setOperation("divide")}
              className="gap-2"
            >
              <Divide className="h-4 w-4" />
              Divide
            </Button>
          </div>

          {/* Matrices */}
          <div className="grid md:grid-cols-2 gap-6">
            {renderMatrix(matrix1, 1)}
            <div className="flex items-center justify-center">
              <div className="text-4xl font-bold text-gray-400">
                {operation === "add" && "+"}
                {operation === "subtract" && "−"}
                {operation === "multiply" && "×"}
                {operation === "divide" && "÷"}
              </div>
            </div>
            {renderMatrix(matrix2, 2)}
          </div>

          {/* Calculate Button */}
          <div className="flex justify-center">
            <Button onClick={calculate} size="lg" className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600">
              <Calculator className="h-5 w-5" />
              Calculate
            </Button>
          </div>

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border-2 border-red-200 rounded-lg p-4 text-red-700"
            >
              <strong>Error:</strong> {error}
            </motion.div>
          )}

          {/* Result Display */}
          {result && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-3"
            >
              <h3 className="font-semibold text-lg text-gray-800">Result:</h3>
              <Card className="border-2 border-green-300 bg-gradient-to-br from-green-50 to-emerald-50">
                <CardContent className="p-4">
                  <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${result[0]?.length || 1}, minmax(0, 1fr))` }}>
                    {result.map((row, i) =>
                      row.map((cell, j) => (
                        <div
                          key={`${i}-${j}`}
                          className="bg-white border-2 border-green-300 rounded p-3 text-center font-mono font-semibold text-green-700"
                        >
                          {cell.toPrecision(6)}
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
              <div className="flex gap-2">
                <Button onClick={handleUseResult} className="flex-1">
                  Use Result
                </Button>
                <Button variant="outline" onClick={handleClose}>
                  Close
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
