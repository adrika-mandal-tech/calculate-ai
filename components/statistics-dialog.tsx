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
import { Calculator, X } from "lucide-react"

interface StatisticsDialogProps {
  open: boolean
  onClose: () => void
  onResult: (result: string) => void
}

export function StatisticsDialog({ open, onClose, onResult }: StatisticsDialogProps) {
  const [input, setInput] = useState("")
  const [data, setData] = useState<number[]>([])
  const [stats, setStats] = useState<any>(null)
  const [error, setError] = useState("")
  const { addEntry } = useHistoryStore()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
    setError("")
    setStats(null)
  }

  const parseData = () => {
    try {
      const parsed = input
        .split(/[,\s]+/)
        .map(s => s.trim())
        .filter(s => s.length > 0)
        .map(s => parseFloat(s))
        .filter(n => !isNaN(n))

      if (parsed.length === 0) {
        setError("Please enter at least one number")
        return false
      }

      setData(parsed)
      return true
    } catch (e) {
      setError("Invalid input format. Use comma or space-separated numbers.")
      return false
    }
  }

  const calculateStats = () => {
    if (!parseData()) return

    const result = mathEngine.statistics(data)
    
    if (result.error) {
      setError(result.error)
      setStats(null)
    } else {
      const parsedStats = JSON.parse(result.result.toString())
      setStats(parsedStats)
      setError("")
      
      // Add to history
      addEntry(
        `Stats([${data.join(", ")}])`,
        `Mean: ${parsedStats.mean}, Median: ${parsedStats.median}, SD: ${parsedStats.standardDeviation}`
      )
    }
  }

  const handleClose = () => {
    setInput("")
    setData([])
    setStats(null)
    setError("")
    onClose()
  }

  const handleUseResult = () => {
    if (stats) {
      onResult(`Mean: ${stats.mean}`)
      handleClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Statistics Calculator</DialogTitle>
          <DialogDescription>
            Enter your data values separated by commas or spaces. Calculate comprehensive statistics including mean, median, mode, variance, standard deviation, skewness, kurtosis, and more.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Input Section */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Data Values (comma or space separated)
            </label>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="e.g., 10, 20, 30, 40, 50 or 10 20 30 40 50"
                value={input}
                onChange={handleInputChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    calculateStats()
                  }
                }}
                className="flex-1"
              />
              <Button onClick={calculateStats}>
                <Calculator className="h-4 w-4 mr-2" />
                Calculate
              </Button>
            </div>
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
            {data.length > 0 && (
              <p className="text-sm text-gray-600">
                Parsed {data.length} value(s): [{data.join(", ")}]
              </p>
            )}
          </div>

          {/* Statistics Results */}
          {stats && (
            <div className="space-y-4 border-t pt-4">
              <h3 className="text-lg font-semibold text-gray-800">Statistical Results</h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                {/* Basic Statistics */}
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-3 text-blue-600">Basic Statistics</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Count (n):</span>
                        <span className="font-mono font-semibold">{stats.count}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Sum:</span>
                        <span className="font-mono font-semibold">{stats.sum}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Mean (μ):</span>
                        <span className="font-mono font-semibold text-blue-600">{stats.mean}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Median:</span>
                        <span className="font-mono font-semibold text-blue-600">{stats.median}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Mode:</span>
                        <span className="font-mono font-semibold text-blue-600">
                          {typeof stats.mode === 'string' ? stats.mode : stats.mode.join(', ')}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Range & Dispersion */}
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-3 text-purple-600">Range & Dispersion</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Min:</span>
                        <span className="font-mono font-semibold">{stats.min}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Max:</span>
                        <span className="font-mono font-semibold">{stats.max}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Range:</span>
                        <span className="font-mono font-semibold">{stats.range}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Variance (σ²):</span>
                        <span className="font-mono font-semibold text-purple-600">{stats.variance}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Std Dev (σ):</span>
                        <span className="font-mono font-semibold text-purple-600">{stats.standardDeviation}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quartiles */}
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-3 text-green-600">Quartiles</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Q1 (25th percentile):</span>
                        <span className="font-mono font-semibold text-green-600">{stats.q1}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Q3 (75th percentile):</span>
                        <span className="font-mono font-semibold text-green-600">{stats.q3}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">IQR (Interquartile Range):</span>
                        <span className="font-mono font-semibold text-green-600">{stats.iqr}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Shape Statistics */}
                <Card>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-3 text-orange-600">Shape Statistics</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Skewness:</span>
                        <span className="font-mono font-semibold text-orange-600">{stats.skewness}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Kurtosis:</span>
                        <span className="font-mono font-semibold text-orange-600">{stats.kurtosis}</span>
                      </div>
                      <div className="mt-3 pt-3 border-t text-xs text-gray-500">
                        <p><strong>Skewness:</strong> &gt;0 = right-skewed, &lt;0 = left-skewed, ≈0 = symmetric</p>
                        <p className="mt-1"><strong>Kurtosis:</strong> &gt;0 = heavy tails, &lt;0 = light tails, ≈0 = normal</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <Button onClick={handleUseResult} className="flex-1">
                  Use Mean in Calculator
                </Button>
                <Button variant="outline" onClick={handleClose}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
