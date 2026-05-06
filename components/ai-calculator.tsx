"use client"

import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { Button } from './ui/button'
import { Send, Bot, User, Loader2, ChevronDown, ChevronUp, Copy } from 'lucide-react'
import { InlineMath } from 'react-katex'
import 'katex/dist/katex.min.css'

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
}

export function AICalculator() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [expandedPods, setExpandedPods] = useState<Set<string>>(new Set())
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

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const formatLaTeX = (text: string): string => {
    // Convert common math notation to LaTeX
    return text
      .replace(/(\d+)\^(\d+)/g, '$1^{$2}')
      .replace(/(\d+)\^(\([^)]+\))/g, '$1^{$2}')
      .replace(/sqrt\(([^)]+)\)/g, '\\sqrt{$1}')
      .replace(/integrate\(([^,]+),([^,]+),([^,]+),([^)]+)\)/g, '\\int_{$3}^{$4} $1 \\,d$2')
      .replace(/diff\(([^,]+),([^)]+)\)/g, '\\frac{d}{$2}($1)')
      .replace(/limit\(([^,]+),([^,]+),([^)]+)\)/g, '\\lim_{$2 \\to $3} $1')
      .replace(/sum\(([^,]+),([^,]+),([^,]+),([^)]+)\)/g, '\\sum_{$2=$3}^{$4} $1')
      .replace(/pi/g, '\\pi')
      .replace(/alpha/g, '\\alpha')
      .replace(/beta/g, '\\beta')
      .replace(/gamma/g, '\\gamma')
      .replace(/delta/g, '\\delta')
      .replace(/theta/g, '\\theta')
      .replace(/lambda/g, '\\lambda')
      .replace(/mu/g, '\\mu')
      .replace(/sigma/g, '\\sigma')
      .replace(/phi/g, '\\phi')
      .replace(/omega/g, '\\omega')
      .replace(/∞/g, '\\infty')
      .replace(/≤/g, '\\leq')
      .replace(/≥/g, '\\geq')
      .replace(/≠/g, '\\neq')
      .replace(/≈/g, '\\approx')
  }

  const renderMath = (text: string) => {
    if (!text) return null
    
    // Check if text contains math symbols
    if (/[0-9+\-*/=^∫√∑∏∂∇∞≤≥≠≈αβγδθλμσφωπ]/.test(text)) {
      try {
        return <InlineMath math={formatLaTeX(text)} />
      } catch {
        return <span className="text-yellow-300">{text}</span>
      }
    }
    return <span className="text-yellow-300">{text}</span>
  }

  const testConnection = async () => {
    console.log('Testing connection...')
    try {
      const response = await fetch('/api/wolfram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: '2+2' })
      })
      const data = await response.json()
      console.log('Test response:', data)
    } catch (error) {
      console.error('Test error:', error)
    }
  }

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: input.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      console.log('Sending request to /api/wolfram with query:', input.trim())
      
      const response = await fetch('/api/wolfram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: input.trim() })
      })

      console.log('Response status:', response.status)
      console.log('Response ok:', response.ok)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('AI Calculator Response:', data)

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: input.trim(),
        timestamp: new Date(),
        pods: data.success ? data.pods : [],
        error: data.error,
        debug: data.debug
      }

      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('AI Calculator Error:', error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: input.trim(),
        timestamp: new Date(),
        error: `Failed to connect to AI calculator: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col h-full bg-black border-l border-orange-600">
      {/* Header */}
      <div className="bg-orange-900 p-4 border-b border-orange-600">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-orange-400" />
          <h2 className="text-lg font-bold text-orange-400">🤖 AI Calculator</h2>
        </div>
        <p className="text-xs text-orange-300 mt-1">
          An intelligent calculator powered by symbolic computation and step-by-step solutions.
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-orange-400 py-8">
            <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">Ask me anything about math!</p>
            <p className="text-xs mt-2 opacity-75">
              Try: &quot;Integrate x² eˣ&quot; or &quot;Solve x² + 2x + 1 = 0&quot;
            </p>
            <Button
              onClick={testConnection}
              size="sm"
              className="mt-2 bg-orange-600 hover:bg-orange-700 text-black"
            >
              Test Connection
            </Button>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-lg p-3 ${
                message.type === 'user'
                  ? 'bg-orange-600 text-black'
                  : 'bg-gray-900 text-yellow-300 border border-orange-800'
              }`}
            >
              <div className="flex items-start gap-2">
                {message.type === 'user' ? (
                  <User className="h-4 w-4 mt-1 flex-shrink-0" />
                ) : (
                  <Bot className="h-4 w-4 mt-1 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <div className="text-sm font-medium mb-1">
                    {message.type === 'user' ? 'You' : 'AI Calculator'}
                  </div>
                  
                  {message.error ? (
                    <div className="text-red-400 text-sm">
                      Error: {message.error}
                    </div>
                  ) : message.debug && message.pods && message.pods.length === 0 ? (
                    <div className="space-y-2">
                      <div className="text-orange-300 text-sm">
                        No detailed solution available for this query.
                      </div>
                      <div className="text-xs text-orange-500">
                        Debug: Found {message.debug.numpods} pods, Success: {message.debug.success ? 'Yes' : 'No'}
                      </div>
                      <div className="text-xs text-orange-400">
                        Try rephrasing your question or check the query format.
                      </div>
                    </div>
                  ) : message.pods && message.pods.length > 0 ? (
                    <div className="space-y-3">
                      {message.pods.map((pod, podIndex) => {
                        const isExpanded = expandedPods.has(pod.id)
                        const isPrimary = pod.subpods.some(subpod => subpod.primary)
                        
                        return (
                          <div key={pod.id} className="border border-orange-700 rounded">
                            <button
                              onClick={() => togglePod(pod.id)}
                              className="w-full px-3 py-2 bg-orange-950 hover:bg-orange-800 transition-colors flex items-center justify-between text-left"
                            >
                              <span className="text-sm font-medium text-orange-300">
                                {pod.title}
                                {isPrimary && <span className="ml-2 text-xs bg-orange-600 px-2 py-1 rounded">Result</span>}
                              </span>
                              {pod.subpods.length > 1 && (
                                isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
                              )}
                            </button>
                            
                            {(isExpanded || pod.subpods.length === 1) && (
                              <div className="p-3 space-y-2">
                                {pod.subpods.map((subpod, subpodIndex) => (
                                  <div key={subpodIndex} className="space-y-2">
                                    {subpod.title && (
                                      <div className="text-xs text-orange-400 font-medium">
                                        {subpod.title}
                                      </div>
                                    )}
                                    {subpod.plaintext && (
                                      <div className="text-sm">
                                        {renderMath(subpod.plaintext)}
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => copyToClipboard(subpod.plaintext!)}
                                          className="ml-2 h-6 w-6 p-0 text-orange-400 hover:text-orange-300"
                                        >
                                          <Copy className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    )}
                                    {subpod.img && (
                                      <Image
                                        src={subpod.img}
                                        alt={subpod.title || 'Visualization'}
                                        width={400}
                                        height={300}
                                        className="max-w-full h-auto rounded border border-orange-700"
                                      />
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-sm">
                      {renderMath(message.content)}
                    </div>
                  )}
                  
                  <div className="text-xs opacity-75 mt-2">
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-900 text-yellow-300 border border-orange-800 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm">Computing...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-orange-600">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about math..."
            className="flex-1 bg-black border border-orange-600 text-yellow-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 placeholder-orange-700"
            disabled={isLoading}
          />
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className="bg-orange-600 hover:bg-orange-700 text-black px-4 py-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
