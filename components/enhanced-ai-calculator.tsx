"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Button } from './ui/button'
import { Send, Bot, User, Loader2, ChevronDown, ChevronUp, Copy, Sparkles, Brain, Zap } from 'lucide-react'
import { InlineMath } from 'react-katex'
import 'katex/dist/katex.min.css'
import { 
  AnimatedGradient, 
  FloatingElement, 
  Sparkles as MagicSparkles, 
  PulseRing, 
  TypewriterText, 
  ShimmerText, 
  GlowingCard,
  ParticleEffect 
} from './ui/magic-ui'

interface ChatMessage {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: Date
  pods?: Array<{
    title: string
    id: string
    subpods: Array<{
      title: string
      plaintext?: string
      img?: string
      primary?: boolean
    }>
  }>
  error?: string
  debug?: any
  confidence?: number
  method?: string
  steps?: string[]
}

export function EnhancedAICalculator() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [expandedPods, setExpandedPods] = useState<Set<string>>(new Set())
  const [showWelcome, setShowWelcome] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const togglePod = (podId: string) => {
    setExpandedPods(prev => {
      const newSet = new Set(prev)
      if (newSet.has(podId)) {
        newSet.delete(podId)
      } else {
        newSet.add(podId)
      }
      return newSet
    })
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setShowWelcome(false)

    try {
      const response = await fetch('/api/wolfram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: input.trim() }),
      })

      const data = await response.json()

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: data.result || 'No result available',
        timestamp: new Date(),
        pods: data.pods || [],
        error: data.error,
        debug: data.debug,
        confidence: data.confidence || 0.95,
        method: data.method || 'AI Analysis',
        steps: data.steps || []
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'Sorry, I encountered an error while processing your request.',
        timestamp: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error',
        confidence: 0,
        method: 'Error',
        steps: ['An error occurred during processing']
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const exampleQueries = [
    "integrate x^2 from 0 to 1",
    "differentiate sin(x^2)",
    "solve x^2 + 2x + 1 = 0",
    "limit sin(x)/x as x approaches 0",
    "plot y = x^2 - 4x + 3",
    "matrix inverse [[1,2],[3,4]]",
    "factor x^3 - 6x^2 + 11x - 6",
    "derivative of e^(x^2)"
  ]

  return (
    <div className="flex flex-col h-full bg-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <ParticleEffect particleCount={30} />
        <MagicSparkles className="opacity-30" />
      </div>

      {/* Header */}
      <div className="relative z-10 border-b border-orange-600 bg-black/80 backdrop-blur-sm">
        <AnimatedGradient className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FloatingElement>
                <div className="relative">
                  <Bot className="h-8 w-8 text-orange-400" />
                  <PulseRing className="absolute -inset-2 scale-75" />
                </div>
              </FloatingElement>
              <div>
                <h2 className="text-xl font-bold text-orange-400 flex items-center gap-2">
                  <ShimmerText>AI Calculator</ShimmerText>
                  <Sparkles className="h-5 w-5 text-yellow-400 animate-pulse" />
                </h2>
                <p className="text-orange-300 text-sm">Powered by Advanced Mathematical AI</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-right">
                <p className="text-xs text-orange-300">Response Time</p>
                <p className="text-sm font-bold text-green-400">
                  {isLoading ? (
                    <TypewriterText text="Processing..." speed={100} />
                  ) : (
                    "~2.3s"
                  )}
                </p>
              </div>
            </div>
          </div>
        </AnimatedGradient>
      </div>

      {/* Welcome Message */}
      {showWelcome && messages.length === 0 && (
        <div className="flex-1 flex items-center justify-center relative z-10">
          <AnimatedGradient className="max-w-2xl mx-auto p-8">
            <div className="text-center">
              <FloatingElement delay={0}>
                <Brain className="h-16 w-16 text-orange-400 mx-auto mb-4" />
              </FloatingElement>
              <FloatingElement delay={0.2}>
                <h3 className="text-2xl font-bold text-orange-400 mb-4">
                  <ShimmerText>Welcome to AI Calculator</ShimmerText>
                </h3>
              </FloatingElement>
              <FloatingElement delay={0.4}>
                <p className="text-orange-300 mb-6">
                  Ask any mathematical question and get detailed, step-by-step solutions with visualizations
                </p>
              </FloatingElement>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {exampleQueries.slice(0, 4).map((query, index) => (
                  <FloatingElement key={index} delay={0.6 + index * 0.1}>
                    <GlowingCard 
                      glowColor="purple"
                      className="p-3 cursor-pointer hover:scale-105 transition-all duration-300"
                      onClick={() => setInput(query)}
                    >
                      <p className="text-sm text-orange-300 font-mono">{query}</p>
                    </GlowingCard>
                  </FloatingElement>
                ))}
              </div>

              <FloatingElement delay={1}>
                <div className="flex items-center justify-center space-x-4 text-orange-400">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4" />
                    <span className="text-sm">Step-by-step solutions</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-sm">Visual explanations</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Brain className="h-4 w-4" />
                    <span className="text-sm">AI-powered accuracy</span>
                  </div>
                </div>
              </FloatingElement>
            </div>
          </AnimatedGradient>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto relative z-10">
        <div className="space-y-4 p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-3xl ${
                  message.type === 'user' 
                    ? 'bg-orange-600 text-black' 
                    : 'bg-black/80 border border-orange-600 text-orange-400'
                } rounded-lg p-4 relative group`}
              >
                {/* Message Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    {message.type === 'ai' ? (
                      <>
                        <Bot className="h-4 w-4" />
                        <span className="font-semibold">AI Assistant</span>
                        {message.confidence && (
                          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                            {Math.round(message.confidence * 100)}% confidence
                          </span>
                        )}
                      </>
                    ) : (
                      <>
                        <User className="h-4 w-4" />
                        <span className="font-semibold">You</span>
                      </>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(message.content)}
                      className="h-6 w-6 p-0 text-current hover:bg-current/20"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {/* Message Content */}
                <div className="space-y-3">
                  {message.type === 'ai' && message.method && (
                    <div className="text-sm bg-blue-500/20 border border-blue-500/30 rounded p-2">
                      <span className="text-blue-300 font-semibold">Method: </span>
                      <span className="text-blue-200">{message.method}</span>
                    </div>
                  )}

                  {message.type === 'ai' && message.steps && message.steps.length > 0 && (
                    <div className="bg-purple-500/20 border border-purple-500/30 rounded p-3">
                      <h4 className="text-purple-300 font-semibold mb-2 flex items-center gap-2">
                        <Brain className="h-4 w-4" />
                        Solution Steps:
                      </h4>
                      <ol className="space-y-1 text-sm text-purple-200">
                        {message.steps.map((step, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-purple-400 font-bold">{index + 1}.</span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  <div className="prose prose-invert max-w-none">
                    {message.content.split('\n').map((line, index) => (
                      <div key={index}>
                        {line.includes('\\(') && line.includes('\\)') ? (
                          <InlineMath math={line} />
                        ) : (
                          <p className="text-current">{line}</p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Wolfram Alpha Pods */}
                  {message.pods && message.pods.length > 0 && (
                    <div className="space-y-3">
                      {message.pods.map((pod) => (
                        <GlowingCard key={pod.id} glowColor="blue" className="p-3">
                          <div
                            className="flex items-center justify-between cursor-pointer"
                            onClick={() => togglePod(pod.id)}
                          >
                            <h4 className="font-semibold text-blue-300">{pod.title}</h4>
                            {expandedPods.has(pod.id) ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </div>
                          {expandedPods.has(pod.id) && (
                            <div className="mt-3 space-y-2">
                              {pod.subpods.map((subpod, subIndex) => (
                                <div key={subIndex} className="text-sm">
                                  {subpod.title && (
                                    <p className="text-blue-200 font-medium mb-1">{subpod.title}</p>
                                  )}
                                  {subpod.img && (
                                    <img
                                      src={subpod.img}
                                      alt={subpod.title}
                                      className="max-w-full h-auto rounded border border-blue-500/30"
                                    />
                                  )}
                                  {subpod.plaintext && (
                                    <p className="text-blue-100 whitespace-pre-wrap">
                                      {subpod.plaintext}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </GlowingCard>
                      ))}
                    </div>
                  )}

                  {/* Error Display */}
                  {message.error && (
                    <div className="bg-red-500/20 border border-red-500/30 rounded p-3">
                      <p className="text-red-300 text-sm">
                        <span className="font-semibold">Error: </span>
                        {message.error}
                      </p>
                    </div>
                  )}
                </div>

                {/* Timestamp */}
                <div className="text-xs opacity-60 mt-2">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}

          {/* Loading Indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-black/80 border border-orange-600 text-orange-400 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <TypewriterText text="AI is thinking..." speed={50} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Form */}
      <div className="relative z-10 border-t border-orange-600 bg-black/80 backdrop-blur-sm">
        <AnimatedGradient>
          <form onSubmit={handleSubmit} className="p-4">
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask any mathematical question..."
                  className="w-full px-4 py-3 bg-black/50 border border-orange-600 rounded-lg text-orange-400 placeholder-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                  disabled={isLoading}
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                  <Sparkles className="h-4 w-4 text-orange-400 animate-pulse" />
                </div>
              </div>
              <Button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-orange-600 hover:bg-orange-700 text-black px-6 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>
            
            {/* Quick Examples */}
            {messages.length === 0 && !isLoading && (
              <div className="mt-3 flex flex-wrap gap-2">
                {exampleQueries.slice(4, 8).map((query, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(query)}
                    className="text-xs bg-orange-600/20 hover:bg-orange-600/30 text-orange-400 px-3 py-1 rounded-full transition-colors"
                  >
                    {query}
                  </button>
                ))}
              </div>
            )}
          </form>
        </AnimatedGradient>
      </div>
    </div>
  )
}
