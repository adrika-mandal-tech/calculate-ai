"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalculatorInterface } from "@/components/calculator-interface"
import { AdvancedCalculator } from "@/components/advanced-calculator-interface"
import { HistorySidebar } from "@/components/history-sidebar"
import { LandingPage } from "@/components/landing-page"
import Link from "next/link"

export default function Home() {
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("landing")

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-orange-950 to-black">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-5xl font-bold text-orange-500 mb-4">
            AdvMath.ai
          </h1>
          <p className="text-xl text-orange-300 mb-6">
            Advanced Scientific Calculator with AI-Powered Mathematical Solutions
          </p>
          <div className="flex justify-center gap-4 mb-8">
            <Link 
              href="/ai-calculator"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              🤖 AI Calculator
            </Link>
            <Link 
              href="/about"
              className="bg-orange-600 hover:bg-orange-700 text-black px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              📖 User Manual
            </Link>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-center rounded-none border-b bg-black/80 backdrop-blur-sm mb-8">
            <TabsTrigger value="landing" className="data-[state=active]:bg-orange-600 data-[state=active]:text-black text-yellow-400 px-6 py-2">
              🏠 Home
            </TabsTrigger>
            <TabsTrigger value="calculator" className="data-[state=active]:bg-orange-600 data-[state=active]:text-black text-yellow-400 px-6 py-2">
              🧮 Classic Calculator
            </TabsTrigger>
            <TabsTrigger value="advanced" className="data-[state=active]:bg-orange-600 data-[state=active]:text-black text-yellow-400 px-6 py-2">
              🧠 Advanced AI Calculator
            </TabsTrigger>
          </TabsList>

          <TabsContent value="landing" className="m-0">
            <LandingPage onStartCalculating={() => setActiveTab("calculator")} />
          </TabsContent>

          <TabsContent value="calculator" className="m-0">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <CalculatorInterface onHistoryClick={() => setIsHistoryOpen(!isHistoryOpen)} />
              </div>
              <div className="lg:col-span-1">
                <HistorySidebar 
                  isOpen={isHistoryOpen} 
                  onClose={() => setIsHistoryOpen(false)} 
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="m-0">
            <AdvancedCalculator />
          </TabsContent>
        </Tabs>

        {/* Features Section - Only show on landing tab */}
        {activeTab === "landing" && (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-black/90 backdrop-blur-sm rounded-lg p-6 border border-orange-600 hover:border-orange-500 transition-colors">
              <h3 className="text-xl font-bold text-orange-400 mb-3">🔬 Scientific</h3>
              <p className="text-orange-300 text-sm">
                Advanced functions, trigonometry, logarithms, and calculus operations
              </p>
              <div className="mt-2 text-xs text-orange-500">
                • 50+ functions • Direct typing • Keyboard shortcuts
              </div>
            </div>
            <div className="bg-black/90 backdrop-blur-sm rounded-lg p-6 border border-orange-600 hover:border-orange-500 transition-colors">
              <h3 className="text-xl font-bold text-orange-400 mb-3">📊 Statistics</h3>
              <p className="text-orange-300 text-sm">
                Statistical analysis, mean, median, standard deviation, and more
              </p>
              <div className="mt-2 text-xs text-orange-500">
                • Data analysis • Probability • Distributions
              </div>
            </div>
            <div className="bg-black/90 backdrop-blur-sm rounded-lg p-6 border border-orange-600 hover:border-orange-500 transition-colors">
              <h3 className="text-xl font-bold text-orange-400 mb-3">🔢 Matrix</h3>
              <p className="text-orange-300 text-sm">
                Matrix operations, determinants, inverses, and linear algebra
              </p>
              <div className="mt-2 text-xs text-orange-500">
                • 2D/3D matrices • Eigenvalues • Transformations
              </div>
            </div>
            <div className="bg-black/90 backdrop-blur-sm rounded-lg p-6 border border-purple-600 hover:border-purple-500 transition-colors">
              <h3 className="text-xl font-bold text-purple-400 mb-3">🤖 Enhanced AI</h3>
              <p className="text-purple-300 text-sm">
                Step-by-step solutions with magical visual effects and AI explanations
              </p>
              <div className="mt-2 text-xs text-purple-500">
                • Magic UI • Visual effects • Detailed steps
              </div>
            </div>
            <div className="bg-black/90 backdrop-blur-sm rounded-lg p-6 border border-orange-600 hover:border-orange-500 transition-colors">
              <h3 className="text-xl font-bold text-orange-400 mb-3">🧮 Advanced</h3>
              <p className="text-orange-300 text-sm">
                Two-panel layout with domain detection and comprehensive math coverage
              </p>
              <div className="mt-2 text-xs text-orange-500">
                • Natural language • Visual graphs • All topics
              </div>
            </div>
            <div className="bg-black/90 backdrop-blur-sm rounded-lg p-6 border border-orange-600 hover:border-orange-500 transition-colors">
              <h3 className="text-xl font-bold text-orange-400 mb-3">📈 Visualizations</h3>
              <p className="text-orange-300 text-sm">
                Interactive 2D/3D graphs, charts, and mathematical visualizations
              </p>
              <div className="mt-2 text-xs text-orange-500">
                • Interactive plots • Export options • Real-time
              </div>
            </div>
            <div className="bg-black/90 backdrop-blur-sm rounded-lg p-6 border border-orange-600 hover:border-orange-500 transition-colors">
              <h3 className="text-xl font-bold text-orange-400 mb-3">⌨️ Shortcuts</h3>
              <p className="text-orange-300 text-sm">
                50+ keyboard shortcuts for rapid mathematical input
              </p>
              <div className="mt-2 text-xs text-orange-500">
                • Ctrl+keys • Direct typing • Quick access
              </div>
            </div>
            <div className="bg-black/90 backdrop-blur-sm rounded-lg p-6 border border-orange-600 hover:border-orange-500 transition-colors">
              <h3 className="text-xl font-bold text-orange-400 mb-3">📚 Documentation</h3>
              <p className="text-orange-300 text-sm">
                Comprehensive user manual with examples and detailed guides
              </p>
              <div className="mt-2 text-xs text-orange-500">
                • Searchable • Examples • Pro tips
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
