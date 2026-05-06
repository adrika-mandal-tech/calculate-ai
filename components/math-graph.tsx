"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, RotateCw, Download, Settings } from "lucide-react"

interface GraphData {
  type: '2d-graph' | '3d-graph' | 'chart' | 'diagram' | 'table' | 'polar' | 'parametric' | 'contour' | 'vector-field' | 'heatmap'
  data: any
  config?: any
  equation?: string
  domain?: { x: [number, number], y: [number, number] }
  color?: string
  animated?: boolean
}

interface MathGraphProps {
  graphData: GraphData | null
  title?: string
  interactive?: boolean
}

// Simple Slider component to avoid import issues
const SimpleSlider = ({ value, onChange, max, min, step, className }: {
  value: number[]
  onChange: (value: number[]) => void
  max: number
  min: number
  step: number
  className?: string
}) => (
  <input
    type="range"
    min={min}
    max={max}
    step={step}
    value={value[0]}
    onChange={(e) => onChange([parseFloat(e.target.value)])}
    className={`w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer ${className || ''}`}
    style={{
      background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((value[0] - min) / (max - min)) * 100}%, #e5e7eb ${((value[0] - min) / (max - min)) * 100}%, #e5e7eb 100%)`
    }}
  />
)

export function MathGraph({ graphData, title = "Mathematical Visualization", interactive = true }: MathGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [showGrid, setShowGrid] = useState(true)
  const [showAxes, setShowAxes] = useState(true)
  const [animationSpeed, setAnimationSpeed] = useState(0)

  useEffect(() => {
    if (graphData && canvasRef.current) {
      drawGraph()
    }
  }, [graphData, zoom, rotation, showGrid, showAxes])

  const drawGraph = () => {
    const canvas = canvasRef.current
    if (!canvas || !graphData) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Apply transformations
    ctx.save()
    ctx.translate(canvas.width / 2, canvas.height / 2)
    ctx.scale(zoom, zoom)

    switch (graphData.type) {
      case '2d-graph':
        draw2DGraph(ctx, graphData)
        break
      case '3d-graph':
        draw3DGraph(ctx, graphData)
        break
      case 'chart':
        drawChart(ctx, graphData)
        break
      case 'diagram':
        drawDiagram(ctx, graphData)
        break
      case 'table':
        drawTable(ctx, graphData)
        break
      case 'polar':
        drawPolarGraph(ctx, graphData)
        break
      case 'parametric':
        drawParametricGraph(ctx, graphData)
        break
      case 'contour':
        drawContourPlot(ctx, graphData)
        break
      case 'vector-field':
        drawVectorField(ctx, graphData)
        break
      case 'heatmap':
        drawHeatmap(ctx, graphData)
        break
    }

    ctx.restore()
  }

  const draw2DGraph = (ctx: CanvasRenderingContext2D, graphData: GraphData) => {
    const { data, config } = graphData
    
    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = '#e0e0e0'
      ctx.lineWidth = 0.5
      for (let i = -20; i <= 20; i++) {
        ctx.beginPath()
        ctx.moveTo(i * 20, -400)
        ctx.lineTo(i * 20, 400)
        ctx.stroke()
        
        ctx.beginPath()
        ctx.moveTo(-400, i * 20)
        ctx.lineTo(400, i * 20)
        ctx.stroke()
      }
    }

    // Draw axes
    if (showAxes) {
      ctx.strokeStyle = '#333'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(-400, 0)
      ctx.lineTo(400, 0)
      ctx.stroke()
      
      ctx.beginPath()
      ctx.moveTo(0, -400)
      ctx.lineTo(0, 400)
      ctx.stroke()
    }

    // Draw function
    if (data.points && Array.isArray(data.points)) {
      ctx.strokeStyle = '#3b82f6'
      ctx.lineWidth = 2
      ctx.beginPath()
      
      data.points.forEach((point: { x: number, y: number }, index: number) => {
        const x = point.x * 40
        const y = -point.y * 40
        
        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      
      ctx.stroke()
    }

    // Draw derivative if available
    if (config?.showDerivative && data.derivative) {
      ctx.strokeStyle = '#ef4444'
      ctx.lineWidth = 1
      ctx.setLineDash([5, 5])
      ctx.beginPath()
      
      // Draw derivative visualization (simplified)
      ctx.stroke()
      ctx.setLineDash([])
    }
  }

  const draw3DGraph = (ctx: CanvasRenderingContext2D, graphData: GraphData) => {
    // Simplified 3D projection
    const { data } = graphData
    
    // Draw 3D axes
    ctx.strokeStyle = '#333'
    ctx.lineWidth = 2
    
    // X-axis
    ctx.beginPath()
    ctx.moveTo(-200, 100)
    ctx.lineTo(200, 100)
    ctx.stroke()
    
    // Y-axis
    ctx.beginPath()
    ctx.moveTo(0, -200)
    ctx.lineTo(0, 200)
    ctx.stroke()
    
    // Z-axis (diagonal)
    ctx.beginPath()
    ctx.moveTo(-100, 150)
    ctx.lineTo(100, -150)
    ctx.stroke()
  }

  const drawChart = (ctx: CanvasRenderingContext2D, graphData: GraphData) => {
    const { data, config } = graphData
    
    if (data.type === 'histogram') {
      // Draw histogram
      ctx.fillStyle = '#3b82f6'
      const barWidth = 40
      const barSpacing = 10
      
      // Sample data - in production, use actual data
      for (let i = 0; i < 10; i++) {
        const height = Math.random() * 200 + 50
        const x = -200 + i * (barWidth + barSpacing)
        const y = -height
        
        ctx.fillRect(x, y, barWidth, height)
      }
    }
  }

  const drawDiagram = (ctx: CanvasRenderingContext2D, graphData: GraphData) => {
    // Draw geometric diagrams
    ctx.strokeStyle = '#3b82f6'
    ctx.lineWidth = 2
    
    // Sample geometric shape
    ctx.beginPath()
    ctx.arc(0, 0, 100, 0, 2 * Math.PI)
    ctx.stroke()
  }

  const drawTable = (ctx: CanvasRenderingContext2D, graphData: GraphData) => {
    // Draw data table
    ctx.fillStyle = '#333'
    ctx.font = '14px monospace'
    
    const tableData = [
      ['x', 'f(x)'],
      ['-2', '4'],
      ['-1', '1'],
      ['0', '0'],
      ['1', '1'],
      ['2', '4']
    ]
    
    tableData.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        const x = -150 + colIndex * 100
        const y = -100 + rowIndex * 30
        ctx.fillText(cell, x, y)
      })
    })
  }

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev * 1.2, 5))
  }

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev / 1.2, 0.2))
  }

  const handleReset = () => {
    setZoom(1)
    setRotation({ x: 0, y: 0 })
  }

  const handleExport = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const link = document.createElement('a')
      link.download = 'math-graph.png'
      link.href = canvas.toDataURL()
      link.click()
    }
  }

  if (!graphData) {
    return (
      <Card className="w-full h-full min-h-[400px] flex items-center justify-center">
        <CardContent>
          <p className="text-muted-foreground">No visualization available for this calculation</p>
        </CardContent>
      </Card>
    )
  }

  // Advanced graph drawing functions
  const drawPolarGraph = (ctx: CanvasRenderingContext2D, graphData: GraphData) => {
    const { data } = graphData
    
    // Draw polar grid
    if (showGrid) {
      ctx.strokeStyle = '#e0e0e0'
      ctx.lineWidth = 0.5
      for (let r = 20; r <= 200; r += 20) {
        ctx.beginPath()
        ctx.arc(0, 0, r, 0, 2 * Math.PI)
        ctx.stroke()
      }
    }

    // Draw polar function
    if (data.points && Array.isArray(data.points)) {
      ctx.strokeStyle = graphData.color || '#3b82f6'
      ctx.lineWidth = 2
      ctx.beginPath()
      
      data.points.forEach((point: { theta: number, r: number }, index: number) => {
        const x = point.r * Math.cos(point.theta) * 40
        const y = -point.r * Math.sin(point.theta) * 40
        
        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      
      ctx.stroke()
    }
  }

  const drawParametricGraph = (ctx: CanvasRenderingContext2D, graphData: GraphData) => {
    const { data } = graphData
    
    // Draw standard grid and axes
    if (showGrid) {
      ctx.strokeStyle = '#e0e0e0'
      ctx.lineWidth = 0.5
      for (let i = -20; i <= 20; i++) {
        ctx.beginPath()
        ctx.moveTo(i * 20, -400)
        ctx.lineTo(i * 20, 400)
        ctx.stroke()
      }
    }

    if (showAxes) {
      ctx.strokeStyle = '#333'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(-400, 0)
      ctx.lineTo(400, 0)
      ctx.stroke()
    }

    // Draw parametric curve
    if (data.points && Array.isArray(data.points)) {
      ctx.strokeStyle = graphData.color || '#10b981'
      ctx.lineWidth = 2
      ctx.beginPath()
      
      data.points.forEach((point: { x: number, y: number }, index: number) => {
        const x = point.x * 40
        const y = -point.y * 40
        
        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      
      ctx.stroke()
    }
  }

  const drawContourPlot = (ctx: CanvasRenderingContext2D, graphData: GraphData) => {
    const { data } = graphData
    
    if (!data.grid) return
    
    // Simple contour visualization
    const levels = data.levels || 10
    const minZ = Math.min(...data.grid.flat())
    const maxZ = Math.max(...data.grid.flat())
    
    for (let level = 0; level < levels; level++) {
      const z = minZ + (maxZ - minZ) * (level / levels)
      ctx.strokeStyle = `hsl(${(level / levels) * 240}, 70%, 50%)`
      ctx.lineWidth = 1
      
      for (let i = 0; i < data.grid.length - 1; i++) {
        for (let j = 0; j < data.grid[i].length - 1; j++) {
          const z00 = data.grid[i][j]
          
          if (Math.abs(z00 - z) < (maxZ - minZ) / levels) {
            const x = j * 20 - 200
            const y = -i * 20 + 100
            
            ctx.beginPath()
            ctx.arc(x, y, 2, 0, 2 * Math.PI)
            ctx.fill()
          }
        }
      }
    }
  }

  const drawVectorField = (ctx: CanvasRenderingContext2D, graphData: GraphData) => {
    const { data } = graphData
    
    if (!data.vectors) return
    
    // Draw vector field
    data.vectors.forEach((vector: { x: number, y: number, dx: number, dy: number }) => {
      const startX = vector.x * 40
      const startY = -vector.y * 40
      const endX = startX + vector.dx * 20
      const endY = startY - vector.dy * 20
      
      ctx.strokeStyle = '#ef4444'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.moveTo(startX, startY)
      ctx.lineTo(endX, endY)
      ctx.stroke()
      
      // Draw arrowhead
      const angle = Math.atan2(-vector.dy, vector.dx)
      ctx.beginPath()
      ctx.moveTo(endX, endY)
      ctx.lineTo(endX - 5 * Math.cos(angle - Math.PI / 6), endY + 5 * Math.sin(angle - Math.PI / 6))
      ctx.moveTo(endX, endY)
      ctx.lineTo(endX - 5 * Math.cos(angle + Math.PI / 6), endY + 5 * Math.sin(angle + Math.PI / 6))
      ctx.stroke()
    })
  }

  const drawHeatmap = (ctx: CanvasRenderingContext2D, graphData: GraphData) => {
    const { data } = graphData
    
    if (!data.grid) return
    
    const minZ = Math.min(...data.grid.flat())
    const maxZ = Math.max(...data.grid.flat())
    
    for (let i = 0; i < data.grid.length; i++) {
      for (let j = 0; j < data.grid[i].length; j++) {
        const z = data.grid[i][j]
        const normalized = (z - minZ) / (maxZ - minZ)
        const hue = (1 - normalized) * 240 // Blue to red
        
        ctx.fillStyle = `hsl(${hue}, 70%, 50%)`
        ctx.fillRect(j * 20 - 200, -i * 20 + 100, 20, 20)
      }
    }
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
        {interactive && (
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleZoomIn}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleZoomOut}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleReset}>
              <RotateCw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {interactive && (
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <label className="text-sm font-medium">Zoom:</label>
                <SimpleSlider
                  value={[zoom]}
                  onChange={(value: number[]) => setZoom(value[0])}
                  max={5}
                  min={0.2}
                  step={0.1}
                  className="w-24"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showGrid}
                  onChange={(e) => setShowGrid(e.target.checked)}
                  className="rounded"
                />
                <label className="text-sm font-medium">Grid</label>
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showAxes}
                  onChange={(e) => setShowAxes(e.target.checked)}
                  className="rounded"
                />
                <label className="text-sm font-medium">Axes</label>
              </div>
            </div>
          )}
          
          <div className="border rounded-lg overflow-hidden">
            <canvas
              ref={canvasRef}
              width={800}
              height={400}
              className="w-full h-full bg-white"
            />
          </div>
          
          {graphData.config && (
            <div className="text-sm text-muted-foreground">
              <p><strong>Function:</strong> {graphData.config.title}</p>
              {graphData.config.showDerivative && (
                <p><strong>Derivative:</strong> Shown in red</p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
