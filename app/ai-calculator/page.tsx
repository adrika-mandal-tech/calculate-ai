import { Metadata } from 'next'
import { EnhancedAICalculator } from '@/components/enhanced-ai-calculator'

export const metadata: Metadata = {
  title: 'AI Calculator - AdvMath.ai',
  description: 'Advanced AI-powered calculator with step-by-step mathematical solutions and magical visual effects',
}

export default function AICalculatorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950 to-black">
      <div className="container mx-auto px-4 py-8 h-screen flex flex-col">
        <div className="mb-6 text-center">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-purple-600 mb-4">
            🤖 Enhanced AI Calculator
          </h1>
          <p className="text-purple-300 text-lg">
            Experience mathematical solutions with stunning visual effects and AI-powered step-by-step explanations
          </p>
        </div>
        
        <div className="flex-1 bg-black/50 backdrop-blur-sm rounded-lg border border-purple-600 overflow-hidden">
          <div className="h-full">
            <EnhancedAICalculator />
          </div>
        </div>
      </div>
    </div>
  )
}
