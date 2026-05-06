"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calculator, Zap, Sigma, Grid3x3, BarChart3, Code, Database, Cpu, ArrowRight, Book, HelpCircle, Home } from "lucide-react"
import { motion } from "framer-motion"

interface LandingPageProps {
  onStartCalculating: () => void
}

export function LandingPage({ onStartCalculating }: LandingPageProps) {
  const features = [
    {
      icon: Calculator,
      title: "Basic Arithmetic",
      description: "Addition, subtraction, multiplication, division, percentages, and parentheses for complex calculations.",
      color: "text-yellow-400"
    },
    {
      icon: Zap,
      title: "Scientific Functions",
      description: "Trigonometric, logarithmic, exponential, hyperbolic functions with degree/radian/gradient modes.",
      color: "text-orange-400"
    },
    {
      icon: Sigma,
      title: "Algebra & Calculus",
      description: "Equation solving, derivatives, integrals, limits, and symbolic mathematical operations.",
      color: "text-yellow-500"
    },
    {
      icon: Grid3x3,
      title: "Matrix Operations",
      description: "Matrix addition, multiplication, determinant, inverse, and linear algebra calculations.",
      color: "text-orange-500"
    },
    {
      icon: BarChart3,
      title: "Statistics",
      description: "Mean, median, mode, standard deviation, regression, and probability distributions.",
      color: "text-yellow-600"
    },
    {
      icon: Code,
      title: "Number Systems",
      description: "Binary, hexadecimal, octal operations with logic gates and bitwise operations.",
      color: "text-orange-600"
    },
    {
      icon: Cpu,
      title: "Programming",
      description: "Programming constructs, variables, and algorithmic calculations.",
      color: "text-yellow-300"
    },
    {
      icon: Database,
      title: "Scientific Constants",
      description: "Access to fundamental constants like π, e, speed of light, Planck's constant, and more.",
      color: "text-orange-300"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-orange-950 to-black">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 md:py-32">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-6 inline-block"
            >
              <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-orange-600 via-yellow-600 to-orange-600 bg-clip-text text-transparent">
                AdvMath.ai
              </h1>
            </motion.div>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-2xl md:text-4xl font-semibold text-yellow-400 mb-4"
            >
              Advanced Scientific Calculator
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-lg md:text-xl text-orange-300 mb-8 max-w-2xl mx-auto"
            >
              Professional scientific calculator with comprehensive mathematical functions, 
              number system operations, and advanced computational capabilities.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                size="lg"
                onClick={onStartCalculating}
                className="text-lg px-8 py-6 bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-700 hover:to-yellow-700 text-black font-bold shadow-lg"
              >
                <Calculator className="mr-2 h-5 w-5" />
                Start Calculating
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-20 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto max-w-6xl">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-center mb-12 text-yellow-400"
          >
            Powerful Features
          </motion.h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="min-w-[280px]"
              >
                <Card className="h-full bg-black/90 border-orange-600 hover:border-orange-400 transition-all duration-300 hover:shadow-lg hover:shadow-orange-600/20">
                  <CardContent className="p-6">
                    <feature.icon className={`h-12 w-12 ${feature.color} mb-4`} />
                    <h3 className="text-xl font-semibold mb-2 text-yellow-300">{feature.title}</h3>
                    <p className="text-orange-200 text-sm leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-center text-orange-400 mt-8 text-lg animate-pulse"
          >
            → Scroll right for more features →
          </motion.p>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-4xl font-bold text-center mb-12 text-yellow-400"
          >
            Complete Mathematical Toolkit
          </motion.h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-black/90 border-orange-600">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold text-yellow-300 mb-4">Core Mathematics</h3>
                  <ul className="space-y-2 text-orange-200">
                    <li className="flex items-center"><ArrowRight className="h-4 w-4 mr-2 text-yellow-400" />Basic arithmetic operations</li>
                    <li className="flex items-center"><ArrowRight className="h-4 w-4 mr-2 text-yellow-400" />Advanced trigonometry</li>
                    <li className="flex items-center"><ArrowRight className="h-4 w-4 mr-2 text-yellow-400" />Logarithmic & exponential</li>
                    <li className="flex items-center"><ArrowRight className="h-4 w-4 mr-2 text-yellow-400" />Statistical analysis</li>
                    <li className="flex items-center"><ArrowRight className="h-4 w-4 mr-2 text-yellow-400" />Matrix operations</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-black/90 border-orange-600">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold text-yellow-300 mb-4">Advanced Features</h3>
                  <ul className="space-y-2 text-orange-200">
                    <li className="flex items-center"><ArrowRight className="h-4 w-4 mr-2 text-yellow-400" />Number system conversions</li>
                    <li className="flex items-center"><ArrowRight className="h-4 w-4 mr-2 text-yellow-400" />Logic gate operations</li>
                    <li className="flex items-center"><ArrowRight className="h-4 w-4 mr-2 text-yellow-400" />Programming constructs</li>
                    <li className="flex items-center"><ArrowRight className="h-4 w-4 mr-2 text-yellow-400" />Scientific constants</li>
                    <li className="flex items-center"><ArrowRight className="h-4 w-4 mr-2 text-yellow-400" />Memory management</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="bg-black/90 border-orange-600">
                <CardContent className="p-6">
                  <h3 className="text-2xl font-bold text-yellow-300 mb-4">User Experience</h3>
                  <ul className="space-y-2 text-orange-200">
                    <li className="flex items-center"><ArrowRight className="h-4 w-4 mr-2 text-yellow-400" />Dark theme with orange accents</li>
                    <li className="flex items-center"><ArrowRight className="h-4 w-4 mr-2 text-yellow-400" />Large high-resolution display</li>
                    <li className="flex items-center"><ArrowRight className="h-4 w-4 mr-2 text-yellow-400" />Keyboard input support</li>
                    <li className="flex items-center"><ArrowRight className="h-4 w-4 mr-2 text-yellow-400" />Expression history</li>
                    <li className="flex items-center"><ArrowRight className="h-4 w-4 mr-2 text-yellow-400" />Error validation</li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
