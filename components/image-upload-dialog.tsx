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
import { Upload, Loader2 } from "lucide-react"

interface ImageUploadDialogProps {
  open: boolean
  onClose: () => void
  onSolve: (expression: string, result: string) => void
}

export function ImageUploadDialog({ open, onClose, onSolve }: ImageUploadDialogProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ expression: string; solution: string; steps: string[] } | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
      setResult(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setLoading(true)
    try {
      // TODO: Integrate with actual OCR and AI service
      // For now, this is a placeholder that simulates the process
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock response - in production, this would come from your OCR/AI service
      const mockResult = {
        expression: "2x² + 5x - 3 = 0",
        solution: "x = 0.5, x = -3",
        steps: [
          "Recognized equation: 2x² + 5x - 3 = 0",
          "Using quadratic formula: x = (-b ± √(b² - 4ac)) / 2a",
          "a = 2, b = 5, c = -3",
          "Discriminant: Δ = 5² - 4(2)(-3) = 25 + 24 = 49",
          "x = (-5 ± √49) / 4 = (-5 ± 7) / 4",
          "x₁ = (-5 + 7) / 4 = 0.5",
          "x₂ = (-5 - 7) / 4 = -3"
        ]
      }
      
      setResult(mockResult)
    } catch (error) {
      console.error("Error processing image:", error)
      alert("Failed to process image. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleUseResult = () => {
    if (result) {
      onSolve(result.expression, result.solution)
      handleClose()
    }
  }

  const handleClose = () => {
    setFile(null)
    setPreview(null)
    setResult(null)
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Math Question</DialogTitle>
          <DialogDescription>
            Upload a handwritten or printed math question. Our AI will solve it step-by-step.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            {preview ? (
              <div className="space-y-4">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-64 mx-auto rounded-lg shadow-md"
                />
                <Button
                  variant="outline"
                  onClick={() => {
                    setFile(null)
                    setPreview(null)
                  }}
                >
                  Remove
                </Button>
              </div>
            ) : (
              <div>
                <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <Button variant="outline" asChild>
                    <span>Choose File</span>
                  </Button>
                </label>
                <p className="text-sm text-gray-500 mt-2">
                  Supports JPG, PNG, PDF
                </p>
              </div>
            )}
          </div>

          {/* Process Button */}
          {file && !result && (
            <Button
              onClick={handleUpload}
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Solve Question
                </>
              )}
            </Button>
          )}

          {/* Results */}
          {result && (
            <div className="space-y-4 border-t pt-4">
              <div>
                <h3 className="font-semibold mb-2">Recognized Expression:</h3>
                <div className="bg-gray-100 p-3 rounded font-mono text-lg">
                  {result.expression}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Solution:</h3>
                <div className="bg-blue-50 p-3 rounded font-semibold text-blue-700 text-lg">
                  {result.solution}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Step-by-Step:</h3>
                <ol className="list-decimal list-inside space-y-2">
                  {result.steps.map((step, index) => (
                    <li key={index} className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleUseResult} className="flex-1">
                  Use This Result
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
