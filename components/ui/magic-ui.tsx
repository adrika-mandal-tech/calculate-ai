"use client"

import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

interface AnimatedGradientProps {
  children: React.ReactNode
  className?: string
}

export function AnimatedGradient({ children, className }: AnimatedGradientProps) {
  const [position, setPosition] = useState({ x: 50, y: 50 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100
      const y = (e.clientY / window.innerHeight) * 100
      setPosition({ x, y })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg",
        className
      )}
    >
      <div
        className="absolute inset-0 opacity-30 transition-all duration-1000 ease-out"
        style={{
          background: `radial-gradient(circle 600px at ${position.x}% ${position.y}%, rgba(59, 130, 246, 0.5), transparent 40%), radial-gradient(circle 400px at ${100 - position.x}% ${100 - position.y}%, rgba(168, 85, 247, 0.5), transparent 40%)`,
        }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  )
}

interface FloatingElementProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  className?: string
}

export function FloatingElement({ 
  children, 
  delay = 0, 
  duration = 3,
  className 
}: FloatingElementProps) {
  return (
    <div
      className={cn(
        "animate-float",
        className
      )}
      style={{
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      }}
    >
      {children}
    </div>
  )
}

interface SparklesProps {
  className?: string
}

export function Sparkles({ className }: SparklesProps) {
  const [sparkles, setSparkles] = useState<Array<{ id: number; x: number; y: number; size: number }>>([])

  useEffect(() => {
    const interval = setInterval(() => {
      const newSparkle = {
        id: Date.now(),
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
      }
      setSparkles(prev => [...prev.slice(-20), newSparkle])
    }, 300)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={cn("absolute inset-0 pointer-events-none", className)}>
      {sparkles.map(sparkle => (
        <div
          key={sparkle.id}
          className="absolute animate-pulse"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)',
            animation: 'twinkle 2s ease-in-out infinite',
          }}
        />
      ))}
    </div>
  )
}

interface PulseRingProps {
  className?: string
}

export function PulseRing({ className }: PulseRingProps) {
  return (
    <div className={cn("relative", className)}>
      <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping" />
      <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-ping animation-delay-200" />
      <div className="relative rounded-full border-2 border-blue-400" />
    </div>
  )
}

interface TypewriterTextProps {
  text: string
  className?: string
  speed?: number
}

export function TypewriterText({ text, className, speed = 50 }: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, speed)
      return () => clearTimeout(timeout)
    }
  }, [currentIndex, text, speed])

  return (
    <span className={cn("font-mono", className)}>
      {displayedText}
      <span className="animate-pulse">|</span>
    </span>
  )
}

interface ShimmerTextProps {
  children: React.ReactNode
  className?: string
}

export function ShimmerText({ children, className }: ShimmerTextProps) {
  return (
    <span className={cn(
      "relative inline-block bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent bg-[length:200%_100%]",
      "animate-shimmer",
      className
    )}>
      {children}
    </span>
  )
}

interface GlowingCardProps {
  children: React.ReactNode
  className?: string
  glowColor?: string
  onClick?: () => void
}

export function GlowingCard({ children, className, glowColor = "blue", onClick }: GlowingCardProps) {
  const glowColors = {
    blue: "shadow-blue-500/50",
    purple: "shadow-purple-500/50",
    green: "shadow-green-500/50",
    orange: "shadow-orange-500/50",
  }

  return (
    <div 
      className={cn(
        "relative rounded-lg border transition-all duration-300 hover:scale-105 cursor-pointer",
        "before:absolute before:inset-0 before:rounded-lg before:blur-xl before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
        `before:shadow-2xl ${glowColors[glowColor as keyof typeof glowColors] || glowColors.blue}`,
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

interface ParticleEffectProps {
  className?: string
  particleCount?: number
}

export function ParticleEffect({ className, particleCount = 20 }: ParticleEffectProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; vx: number; vy: number }>>([])

  useEffect(() => {
    const initialParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
    }))
    setParticles(initialParticles)

    const interval = setInterval(() => {
      setParticles(prev => prev.map(particle => ({
        ...particle,
        x: (particle.x + particle.vx + 100) % 100,
        y: (particle.y + particle.vy + 100) % 100,
      })))
    }, 50)

    return () => clearInterval(interval)
  }, [particleCount])

  return (
    <div className={cn("absolute inset-0 pointer-events-none", className)}>
      {particles.map(particle => (
        <div
          key={particle.id}
          className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-60"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            boxShadow: '0 0 6px rgba(59, 130, 246, 0.8)',
          }}
        />
      ))}
    </div>
  )
}

interface MorphingShapeProps {
  className?: string
}

export function MorphingShape({ className }: MorphingShapeProps) {
  return (
    <div className={cn(
      "w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg",
      "animate-morph",
      className
    )} />
  )
}

// Add custom CSS animations (only on client side)
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.textContent = `
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-20px); }
    }
    
    @keyframes twinkle {
      0%, 100% { opacity: 0; transform: scale(0.5); }
      50% { opacity: 1; transform: scale(1); }
    }
    
    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
    
    @keyframes morph {
      0%, 100% { border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%; transform: rotate(0deg); }
      25% { border-radius: 58% 42% 75% 25% / 76% 46% 54% 24%; transform: rotate(90deg); }
      50% { border-radius: 50% 50% 33% 67% / 55% 27% 73% 45%; transform: rotate(180deg); }
      75% { border-radius: 33% 67% 58% 42% / 63% 68% 32% 37%; transform: rotate(270deg); }
    }
    
    .animate-float {
      animation: float ease-in-out infinite;
    }
    
    .animate-shimmer {
      animation: shimmer 2s linear infinite;
    }
    
    .animate-morph {
      animation: morph 8s ease-in-out infinite;
    }
    
    .animation-delay-200 {
      animation-delay: 200ms;
    }
  `
  document.head.appendChild(style)
}
