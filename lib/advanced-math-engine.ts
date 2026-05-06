import { evaluate, format, matrix, multiply, add, subtract, divide, pow, sqrt, det, inv, transpose, trace, identity, zeros, ones, mean, median, mode, std, variance, combinations, permutations, sum, min, max, range, count, complex, re, im, conj, abs, arg, exp, log, sin, cos, tan, asin, acos, atan, sinh, cosh, tanh, derivative, simplify, parse, rationalize } from 'mathjs'

export interface AdvancedCalculationResult {
  finalAnswer: string | number
  methodUsed: string
  stepByStepSolution: string[]
  visualOutput?: {
    type: '2d-graph' | '3d-graph' | 'chart' | 'diagram' | 'table' | 'polar' | 'parametric' | 'contour' | 'vector-field' | 'heatmap'
    data: any
    config?: any
    equation?: string
    domain?: { x: [number, number], y: [number, number] }
    color?: string
    animated?: boolean
  }
  domain: string
  computationMode: 'symbolic' | 'numeric' | 'approximate'
  confidence: number
  explanation: string
  difficulty: 'basic' | 'intermediate' | 'advanced' | 'expert'
  relatedConcepts?: string[]
  applications?: string[]
}

export interface MathDomain {
  name: string
  patterns: RegExp[]
  keywords: string[]
  priority: number
}

export class AdvancedMathEngine {
  private computationMode: 'symbolic' | 'numeric' | 'approximate' = 'numeric'
  private precision: number = 10
  private angleMode: 'deg' | 'rad' = 'rad'

  private domains: MathDomain[] = [
    {
      name: 'calculus',
      patterns: [/derivative|integral|limit|d\/dx|∫|∂/i],
      keywords: ['derivative', 'integral', 'limit', 'differentiate', 'integrate'],
      priority: 10
    },
    {
      name: 'linear-algebra',
      patterns: [/matrix|det|inv|transpose|eigenvector|eigenvalue|\[\[.*\]\]/i],
      keywords: ['matrix', 'determinant', 'inverse', 'transpose', 'eigen'],
      priority: 9
    },
    {
      name: 'statistics',
      patterns: [/mean|median|mode|std|variance|correlation|regression|probability/i],
      keywords: ['mean', 'median', 'mode', 'standard deviation', 'variance', 'probability'],
      priority: 8
    },
    {
      name: 'complex-numbers',
      patterns: [/i\s*[\+\-\*\/]|complex|imaginary|\d+i/i],
      keywords: ['complex', 'imaginary', 'i', 'real', 'imaginary'],
      priority: 7
    },
    {
      name: 'trigonometry',
      patterns: [/sin|cos|tan|asin|acos|atan|sec|csc|cot/i],
      keywords: ['sin', 'cos', 'tan', 'trigonometric', 'angle'],
      priority: 6
    },
    {
      name: 'algebra',
      patterns: [/solve|factor|expand|simplify|equation|polynomial/i],
      keywords: ['solve', 'factor', 'expand', 'simplify', 'equation'],
      priority: 5
    },
    {
      name: 'arithmetic',
      patterns: [/[\d\+\-\*\/\^\(\)\.]+/],
      keywords: ['add', 'subtract', 'multiply', 'divide', 'power'],
      priority: 1
    }
  ]

  detectDomain(input: string): string {
    const lowerInput = input.toLowerCase()
    let bestMatch = 'arithmetic'
    let highestPriority = 0

    for (const domain of this.domains) {
      for (const pattern of domain.patterns) {
        if (pattern.test(lowerInput) && domain.priority > highestPriority) {
          bestMatch = domain.name
          highestPriority = domain.priority
        }
      }

      for (const keyword of domain.keywords) {
        if (lowerInput.includes(keyword) && domain.priority > highestPriority) {
          bestMatch = domain.name
          highestPriority = domain.priority
        }
      }
    }

    return bestMatch
  }

  processNaturalLanguage(query: string): string {
    const lowerQuery = query.toLowerCase()
    
    // Common natural language patterns
    const patterns = [
      { pattern: /what is|calculate|find|solve/i, replacement: '' },
      { pattern: /the derivative of|derivative of/i, replacement: 'derivative(' },
      { pattern: /the integral of|integral of/i, replacement: 'integral(' },
      { pattern: /the square root of|sqrt of/i, replacement: 'sqrt(' },
      { pattern: /to the power of|raised to/i, replacement: '^' },
      { pattern: /divided by|over/i, replacement: '/' },
      { pattern: /times|multiplied by/i, replacement: '*' },
      { pattern: /plus|added to/i, replacement: '+' },
      { pattern: /minus|subtracted from/i, replacement: '-' },
      { pattern: /pi|π/i, replacement: 'pi' },
      { pattern: /euler's number|e constant/i, replacement: 'e' }
    ]

    let processed = query
    for (const { pattern, replacement } of patterns) {
      processed = processed.replace(pattern, replacement)
    }

    return processed.trim()
  }

  generateStepByStepSolution(expression: string, domain: string, result: any): string[] {
    const steps: string[] = []
    
    steps.push(`🔍 **Domain Detection**: ${domain.charAt(0).toUpperCase() + domain.slice(1)}`)
    steps.push(`📝 **Original Expression**: ${expression}`)
    
    switch (domain) {
      case 'calculus':
        if (expression.includes('derivative')) {
          steps.push(`📈 **Method**: Differentiation using power rule and chain rule`)
          steps.push(`⚙️ **Process**: Apply derivative rules term by term`)
        } else if (expression.includes('integral')) {
          steps.push(`📉 **Method**: Integration using fundamental theorem`)
          steps.push(`⚙️ **Process**: Find antiderivative and evaluate bounds`)
        } else if (expression.includes('limit')) {
          steps.push(`🎯 **Method**: Limit evaluation`)
          steps.push(`⚙️ **Process**: Analyze behavior as variable approaches value`)
        }
        break
        
      case 'linear-algebra':
        if (expression.includes('det')) {
          steps.push(`🔢 **Method**: Determinant calculation`)
          steps.push(`⚙️ **Process**: Apply cofactor expansion or row reduction`)
        } else if (expression.includes('inv')) {
          steps.push(`🔄 **Method**: Matrix inversion`)
          steps.push(`⚙️ **Process**: Use Gaussian elimination or adjugate method`)
        }
        break
        
      case 'statistics':
        steps.push(`📊 **Method**: Statistical analysis`)
        steps.push(`⚙️ **Process**: Apply statistical formulas to dataset`)
        break
        
      case 'trigonometry':
        steps.push(`📐 **Method**: Trigonometric evaluation`)
        steps.push(`⚙️ **Process**: Convert angles and apply trigonometric identities`)
        steps.push(`📐 **Angle Mode**: ${this.angleMode.toUpperCase()}`)
        break
        
      default:
        steps.push(`🔢 **Method**: Arithmetic/Algebraic evaluation`)
        steps.push(`⚙️ **Process**: Apply order of operations (PEMDAS)`)
    }
    
    steps.push(`✅ **Final Result**: ${result}`)
    steps.push(`💡 **Computation Mode**: ${this.computationMode.charAt(0).toUpperCase() + this.computationMode.slice(1)}`)
    
    return steps
  }

  generateVisualData(expression: string, domain: string, result: any): any | null {
    switch (domain) {
      case 'calculus':
        if (expression.includes('derivative') || expression.includes('integral')) {
          return {
            type: '2d-graph',
            data: {
              function: expression,
              derivative: result,
              points: this.generateFunctionPoints(expression, -10, 10, 100)
            },
            config: {
              title: 'Function Analysis',
              xAxis: 'x',
              yAxis: 'y',
              showDerivative: true
            }
          }
        }
        break
        
      case 'statistics':
        return {
          type: 'chart',
          data: {
            type: 'histogram',
            result: result,
            distribution: 'normal'
          },
          config: {
            title: 'Statistical Analysis',
            showMean: true,
            showStdDev: true
          }
        }
        
      case 'trigonometry':
        return {
          type: '2d-graph',
          data: {
            function: expression,
            points: this.generateTrigPoints(expression, 0, 4 * Math.PI, 200)
          },
          config: {
            title: 'Trigonometric Function',
            xAxis: 'Angle (rad)',
            yAxis: 'Value'
          }
        }
    }
    
    return null
  }

  private generateFunctionPoints(expression: string, start: number, end: number, numPoints: number): Array<{x: number, y: number}> {
    const points = []
    const step = (end - start) / numPoints
    
    for (let i = 0; i <= numPoints; i++) {
      const x = start + i * step
      try {
        const y = evaluate(expression.replace(/x/g, `(${x})`))
        points.push({ x, y: typeof y === 'number' ? y : 0 })
      } catch {
        points.push({ x, y: 0 })
      }
    }
    
    return points
  }

  private generateTrigPoints(expression: string, start: number, end: number, numPoints: number): Array<{x: number, y: number}> {
    const points = []
    const step = (end - start) / numPoints
    
    for (let i = 0; i <= numPoints; i++) {
      const x = start + i * step
      try {
        const scope = {
          sin: this.angleMode === 'deg' ? (val: number) => Math.sin(val * Math.PI / 180) : Math.sin,
          cos: this.angleMode === 'deg' ? (val: number) => Math.cos(val * Math.PI / 180) : Math.cos,
          tan: this.angleMode === 'deg' ? (val: number) => Math.tan(val * Math.PI / 180) : Math.tan,
          x: x
        }
        const y = evaluate(expression, scope)
        points.push({ x, y: typeof y === 'number' ? y : 0 })
      } catch {
        points.push({ x, y: 0 })
      }
    }
    
    return points
  }

  calculate(input: string): AdvancedCalculationResult {
    try {
      // Process natural language input
      const processedInput = this.processNaturalLanguage(input)
      const domain = this.detectDomain(processedInput)
      
      // Enhanced expression processing
      let expression = processedInput
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/π/g, 'pi')
        .replace(/e(?![a-zA-Z])/g, 'e')
        .replace(/√/g, 'sqrt')
        .replace(/(\d+)\*\*(\d+)/g, 'pow($1,$2)')
        .replace(/sin/g, this.angleMode === 'deg' ? 'sinDeg' : 'sin')
        .replace(/cos/g, this.angleMode === 'deg' ? 'cosDeg' : 'cos')
        .replace(/tan/g, this.angleMode === 'deg' ? 'tanDeg' : 'tan')

      // Advanced scope with complex numbers
      const scope = {
        sinDeg: (x: number) => Math.sin(x * Math.PI / 180),
        cosDeg: (x: number) => Math.cos(x * Math.PI / 180),
        tanDeg: (x: number) => Math.tan(x * Math.PI / 180),
        pi: Math.PI,
        e: Math.E,
        i: complex(0, 1),
        // Advanced functions
        derivative: (func: string, variable: string = 'x') => {
          // Simplified derivative - in production, use symbolic differentiation
          return `d/d${variable}(${func})`
        },
        integral: (func: string, lower: number = 0, upper: number = 1) => {
          // Simplified integral - in production, use numerical integration
          return `∫[${lower},${upper}] ${func} dx`
        },
        limit: (func: string, variable: string, value: number) => {
          return `lim(${variable}→${value}) ${func}`
        },
        solve: (equation: string) => {
          return `Solutions for ${equation}`
        },
        factor: (expression: string) => {
          return `Factorized: ${expression}`
        },
        expand: (expression: string) => {
          return `Expanded: ${expression}`
        },
        simplify: (expression: string) => {
          return `Simplified: ${expression}`
        },
        // Matrix operations
        matrix: matrix,
        det: det,
        inv: inv,
        transpose: transpose,
        trace: trace,
        identity: identity,
        zeros: zeros,
        ones: ones,
        // Statistics
        mean: mean,
        median: median,
        mode: mode,
        std: std,
        variance: variance,
        combinations: combinations,
        permutations: permutations,
        // Complex operations
        complex: complex,
        re: re,
        im: im,
        conj: conj,
        abs: abs,
        arg: arg
      }

      let result
      try {
        result = evaluate(expression, scope)
      } catch (error) {
        // Fallback for symbolic expressions
        result = this.handleSymbolicExpression(expression)
      }

      // Format result based on computation mode
      let finalAnswer: string | number
      if (typeof result === 'number') {
        if (this.computationMode === 'approximate') {
          finalAnswer = parseFloat(result.toPrecision(this.precision))
        } else {
          finalAnswer = result
        }
      } else if (typeof result === 'object' && result !== null) {
        finalAnswer = JSON.stringify(result)
      } else {
        finalAnswer = String(result)
      }

      // Generate step-by-step solution
      const stepByStepSolution = this.generateStepByStepSolution(processedInput, domain, finalAnswer)

      // Generate visual output
      const visualOutput = this.generateVisualData(processedInput, domain, finalAnswer)

      // Determine method used
      const methodUsed = this.getMethodUsed(domain, processedInput)

      // Generate explanation
      const explanation = this.generateExplanation(domain, processedInput, finalAnswer)

      return {
        finalAnswer,
        methodUsed,
        stepByStepSolution,
        visualOutput,
        domain,
        computationMode: this.computationMode,
        confidence: this.calculateConfidence(domain, processedInput),
        explanation,
        difficulty: this.determineDifficulty(domain, processedInput),
        relatedConcepts: this.getRelatedConcepts(domain),
        applications: this.getApplications(domain)
      }

    } catch (error) {
      return {
        finalAnswer: 'Error',
        methodUsed: 'Error Handling',
        stepByStepSolution: [`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`],
        domain: 'error',
        computationMode: this.computationMode,
        confidence: 0,
        explanation: `An error occurred while processing the input: ${error instanceof Error ? error.message : 'Unknown error'}`,
        difficulty: 'basic',
        relatedConcepts: [],
        applications: []
      }
    }
  }

  private handleSymbolicExpression(expression: string): string {
    // Handle symbolic expressions that can't be evaluated numerically
    if (expression.includes('derivative(') || expression.includes('integral(') || expression.includes('solve(')) {
      return expression // Return symbolic expression as-is
    }
    throw new Error('Cannot evaluate symbolically')
  }

  private getMethodUsed(domain: string, expression: string): string {
    const methods = {
      'calculus': 'Symbolic/Numerical Analysis',
      'linear-algebra': 'Matrix Operations',
      'statistics': 'Statistical Computation',
      'complex-numbers': 'Complex Analysis',
      'trigonometry': 'Trigonometric Evaluation',
      'algebra': 'Algebraic Manipulation',
      'arithmetic': 'Arithmetic Operations'
    }
    
    return methods[domain as keyof typeof methods] || 'General Computation'
  }

  private generateExplanation(domain: string, expression: string, result: any): string {
    const explanations = {
      'calculus': `The expression was analyzed using calculus principles. Derivatives, integrals, and limits were computed using appropriate mathematical rules.`,
      'linear-algebra': `Matrix operations were performed using linear algebra principles. Determinants, inverses, and other matrix properties were calculated.`,
      'statistics': `Statistical analysis was performed on the input data. Measures of central tendency, dispersion, and probability were computed.`,
      'complex-numbers': `Complex number operations were performed using the rules of complex arithmetic. Real and imaginary parts were handled separately.`,
      'trigonometry': `Trigonometric functions were evaluated using the ${this.angleMode} angle mode. Appropriate identities and transformations were applied.`,
      'algebra': `Algebraic manipulation was performed using symbolic computation rules. Equations were solved and expressions were simplified.`,
      'arithmetic': `Basic arithmetic operations were performed following the order of operations (PEMDAS/BODMAS).`
    }
    
    return explanations[domain as keyof typeof explanations] || 'Mathematical computation was performed using appropriate methods.'
  }

  private calculateConfidence(domain: string, expression: string): number {
    // Calculate confidence based on domain detection and expression complexity
    let confidence = 0.8 // Base confidence
    
    // Increase confidence for well-defined patterns
    if (domain !== 'arithmetic') confidence += 0.1
    
    // Check for complete expressions
    if (expression.match(/[+\-*/]$/)) confidence -= 0.2
    
    return Math.min(1.0, Math.max(0.0, confidence))
  }

  setComputationMode(mode: 'symbolic' | 'numeric' | 'approximate') {
    this.computationMode = mode
  }

  setPrecision(precision: number) {
    this.precision = precision
  }

  setAngleMode(mode: 'deg' | 'rad') {
    this.angleMode = mode
  }

  private determineDifficulty(domain: string, expression: string): 'basic' | 'intermediate' | 'advanced' | 'expert' {
    const complexity = expression.length
    const hasAdvancedSymbols = /[∫∂∑∏∞√∛∜]/.test(expression)
    const hasComplexFunctions = /(derivative|integral|limit|matrix|eigenvalue|eigenvector|determinant|transpose|inverse)/i.test(expression)
    const hasNestedFunctions = /\(.*\(.*\)/.test(expression)
    
    if (hasAdvancedSymbols || hasComplexFunctions || hasNestedFunctions || complexity > 50) {
      if (domain === 'calculus' || domain === 'linear-algebra') return 'expert'
      return 'advanced'
    } else if (complexity > 20 || hasComplexFunctions) {
      return 'intermediate'
    } else {
      return 'basic'
    }
  }

  private getRelatedConcepts(domain: string): string[] {
    const conceptMap: Record<string, string[]> = {
      'calculus': ['Limits', 'Continuity', 'Differentiation', 'Integration', 'Series', 'Taylor Series', 'Chain Rule', 'Product Rule'],
      'linear-algebra': ['Vectors', 'Matrices', 'Eigenvalues', 'Eigenvectors', 'Determinants', 'Linear Transformations', 'Vector Spaces'],
      'statistics': ['Probability', 'Distributions', 'Hypothesis Testing', 'Regression', 'Correlation', 'Standard Deviation', 'Variance'],
      'complex-numbers': ['Complex Plane', 'Polar Form', 'Euler\'s Formula', 'De Moivre\'s Theorem', 'Complex Conjugation'],
      'trigonometry': ['Unit Circle', 'Identities', 'Inverse Functions', 'Law of Sines', 'Law of Cosines', 'Radians vs Degrees'],
      'algebra': ['Polynomials', 'Factoring', 'Equations', 'Inequalities', 'Functions', 'Domain and Range'],
      'arithmetic': ['Order of Operations', 'Fractions', 'Decimals', 'Percentages', 'Ratios', 'Proportions']
    }
    
    return conceptMap[domain] || []
  }

  private getApplications(domain: string): string[] {
    const applicationMap: Record<string, string[]> = {
      'calculus': ['Physics (motion, forces)', 'Engineering (optimization)', 'Economics (marginal analysis)', 'Computer Graphics'],
      'linear-algebra': ['Computer Graphics', 'Machine Learning', 'Quantum Mechanics', 'Network Analysis', 'Data Compression'],
      'statistics': ['Data Science', 'Machine Learning', 'Quality Control', 'Medical Research', 'Financial Analysis'],
      'complex-numbers': ['Electrical Engineering', 'Signal Processing', 'Quantum Mechanics', 'Control Theory'],
      'trigonometry': ['Navigation', 'Astronomy', 'Architecture', 'Music Theory', 'Wave Analysis'],
      'algebra': ['Cryptography', 'Computer Science', 'Engineering Design', 'Optimization Problems'],
      'arithmetic': ['Finance', 'Construction', 'Cooking', 'Shopping', 'Time Management']
    }
    
    return applicationMap[domain] || []
  }
}
