import { evaluate, format, matrix, multiply, add, subtract, divide, derivative, simplify, parse } from 'mathjs'

export interface CalculationResult {
  result: string | number
  error?: string
  details?: string
  steps?: string[]
}
export class MathEngine {
  private angleMode: 'deg' | 'rad' = 'deg'

  setAngleMode(mode: 'deg' | 'rad') {
    this.angleMode = mode
  }
  generateSolutionSteps(expression: string, processed: string, result: any): string {
    const steps = []
    steps.push(`📝 Original Expression: ${expression}`)
    steps.push(`⚙️  Processed: ${processed}`)
    
    if (expression.includes('+')) {
      steps.push(`➕ Addition: Performing arithmetic addition`)
    } else if (expression.includes('-')) {
      steps.push(`➖ Subtraction: Performing arithmetic subtraction`)
    } else if (expression.includes('*')) {
      steps.push(`✖️  Multiplication: Performing arithmetic multiplication`)
    } else if (expression.includes('/')) {
      steps.push(`➗ Division: Performing arithmetic division`)
    } else if (expression.includes('^') || expression.includes('**')) {
      steps.push(`🔢 Exponentiation: Calculating power`)
    } else if (expression.includes('sin') || expression.includes('cos') || expression.includes('tan')) {
      steps.push(`📐 Trigonometry: Calculating ${this.angleMode === 'deg' ? 'degree' : 'radian'} trigonometric function`)
    } else if (expression.includes('derivative')) {
      steps.push(`🔍 Calculus: Computing derivative`)
    } else if (expression.includes('integral')) {
      steps.push(`🔍 Calculus: Computing integral`)
    } else if (expression.includes('solve')) {
      steps.push(`🔍 Algebra: Solving equation`)
    } else if (expression.includes('factor')) {
      steps.push(`🔍 Algebra: Factoring expression`)
    } else if (expression.includes('expand')) {
      steps.push(`🔍 Algebra: Expanding expression`)
    } else if (expression.includes('simplify')) {
      steps.push(`🔍 Algebra: Simplifying expression`)
    }
    
    steps.push(`✅ Final Result: ${result}`)
    return steps.join('\n')
  }

  calculate(expression: string): CalculationResult {
    if (!expression || expression.trim() === '') {
      return {
        result: '0',
        details: 'Empty expression - defaulting to 0'
      }
    }

    try {
      // Preprocess the expression for mathjs compatibility
      let processed = expression
        .replace(/\s+/g, '') // Remove whitespace
        .replace(/÷/g, '/') // Replace division symbol
        .replace(/×/g, '*') // Replace multiplication symbol
        .replace(/\^/g, '**') // Replace caret with power operator
        .replace(/sin/g, this.angleMode === 'deg' ? 'sinDeg' : 'sin')
        .replace(/cos/g, this.angleMode === 'deg' ? 'cosDeg' : 'cos')
        .replace(/tan/g, this.angleMode === 'deg' ? 'tanDeg' : 'tan')
        .replace(/asin/g, this.angleMode === 'deg' ? 'asinDeg' : 'asin')
        .replace(/acos/g, this.angleMode === 'deg' ? 'acosDeg' : 'acos')
        .replace(/atan/g, this.angleMode === 'deg' ? 'atanDeg' : 'atan')
        .replace(/log10/g, 'log10')
        .replace(/log2/g, 'log2')
        .replace(/ln/g, 'log')
        .replace(/!/g, 'factorial')
        // Handle advanced math functions
        .replace(/derivative\(([^,]+),\s*([^)]+)\)/g, 'derivative($1, $2)')
        .replace(/integral\(([^,]+),\s*([^,]+),\s*([^)]+)\)/g, 'integral($1, $2, $3)')
        .replace(/limit\(([^,]+),\s*([^,]+),\s*([^)]+)\)/g, 'limit($1, $2, $3)')
        .replace(/solve\(([^)]+)\)/g, 'solve($1)')
        .replace(/factor\(([^)]+)\)/g, 'factor($1)')
        .replace(/expand\(([^)]+)\)/g, 'expand($1)')
        .replace(/simplify\(([^)]+)\)/g, 'simplify($1)')
        .replace(/mean\(([^)]+)\)/g, 'mean($1)')
        .replace(/median\(([^)]+)\)/g, 'median($1)')
        .replace(/mode\(([^)]+)\)/g, 'mode($1)')
        .replace(/std\(([^)]+)\)/g, 'std($1)')
        .replace(/variance\(([^)]+)\)/g, 'variance($1)')
        .replace(/C\((\d+),\s*(\d+)\)/g, 'combinations($1, $2)')
        .replace(/P\((\d+),\s*(\d+)\)/g, 'permutations($1, $2)')
        // Matrix operations
        .replace(/det\(([^)]+)\)/g, 'det($1)')
        .replace(/inv\(([^)]+)\)/g, 'inv($1)')
        .replace(/transpose\(([^)]+)\)/g, 'transpose($1)')

      const scope = {
        sinDeg: (x: number) => Math.sin(x * Math.PI / 180),
        cosDeg: (x: number) => Math.cos(x * Math.PI / 180),
        tanDeg: (x: number) => Math.tan(x * Math.PI / 180),
        asinDeg: (x: number) => Math.asin(x) * 180 / Math.PI,
        acosDeg: (x: number) => Math.acos(x) * 180 / Math.PI,
        atanDeg: (x: number) => Math.atan(x) * 180 / Math.PI,
        Math: Math,
        factorial: (n: number) => {
          if (n < 0) return NaN
          if (n === 0 || n === 1) return 1
          let result = 1
          for (let i = 2; i <= n; i++) {
            result *= i
          }
          return result
        },
        log10: (x: number) => Math.log10(x),
        log2: (x: number) => Math.log2(x),
        log: (x: number) => Math.log(x),
        // Mathematical constants
        pi: Math.PI,
        e: Math.E,
        phi: 1.618033988749895,
        // Advanced math functions with real calculations
        derivative: (func: string, variable: string) => {
          try {
            const powerMatch = func.match(/([a-zA-Z])\^(\d+)/)
            if (powerMatch) {
              const base = powerMatch[1]
              const power = parseInt(powerMatch[2])
              return `${power}*${base}^(${power-1})`
            }
            if (func.includes('sin(') && func.includes(variable)) {
              return `cos(${func.replace('sin(', '').replace(')', '')})`
            }
            if (func.includes('cos(') && func.includes(variable)) {
              return `-sin(${func.replace('cos(', '').replace(')', '')})`
            }
            return `d/d${variable}(${func})`
          } catch (e) {
            return `d/d${variable}(${func})`
          }
        },
        integral: (func: string, lower: number, upper: number) => {
          try {
            const powerMatch = func.match(/([a-zA-Z])\^(\d+)/)
            if (powerMatch) {
              const base = powerMatch[1]
              const power = parseInt(powerMatch[2])
              const newPower = power + 1
              const result = evaluate(`${base}^${newPower}/${newPower}`, { [base]: upper }) - evaluate(`${base}^${newPower}/${newPower}`, { [base]: lower })
              return result
            }
            if (func.includes('sin(')) {
              const inner = func.replace('sin(', '').replace(')', '')
              const result = -evaluate(`cos(${inner})`, { [inner]: upper }) + evaluate(`cos(${inner})`, { [inner]: lower })
              return result
            }
            if (func.includes('cos(')) {
              const inner = func.replace('cos(', '').replace(')', '')
              const result = evaluate(`sin(${inner})`, { [inner]: upper }) - evaluate(`sin(${inner})`, { [inner]: lower })
              return result
            }
            return `∫[${lower},${upper}] ${func} dx`
          } catch (e) {
            return `∫[${lower},${upper}] ${func} dx`
          }
        },
        limit: (func: string, variable: string, value: number) => {
          try {
            const directResult = evaluate(func.replace(new RegExp(variable, 'g'), value.toString()))
            if (!isNaN(directResult) && isFinite(directResult)) {
              return directResult
            }
            if (func.includes('sin(') && func.includes('/') && func.includes(variable)) {
              return 1
            }
            const h = 0.0001
            const leftLimit = evaluate(func.replace(new RegExp(variable, 'g'), (value - h).toString()))
            const rightLimit = evaluate(func.replace(new RegExp(variable, 'g'), (value + h).toString()))
            if (Math.abs(leftLimit - rightLimit) < 0.001) {
              return (leftLimit + rightLimit) / 2
            }
            return `lim(${variable}→${value}) ${func}`
          } catch (e) {
            return `lim(${variable}→${value}) ${func}`
          }
        },
        solve: (equation: string) => {
          try {
            const quadraticMatch = equation.match(/([-\d]*)\*?x\^2\s*([+-]\s*\d*)\*?x\s*([+-]\s*\d+)/)
            if (quadraticMatch) {
              const a = parseFloat(quadraticMatch[1].replace(/\s/g, '') || '1')
              const b = parseFloat(quadraticMatch[2].replace(/\s/g, '') || '0')
              const c = parseFloat(quadraticMatch[3].replace(/\s/g, '') || '0')
              const discriminant = b * b - 4 * a * c
              if (discriminant >= 0) {
                const sqrtDisc = Math.sqrt(discriminant)
                const x1 = (-b + sqrtDisc) / (2 * a)
                const x2 = (-b - sqrtDisc) / (2 * a)
                return discriminant === 0 ? [x1] : [x1, x2]
              } else {
                return 'Complex roots'
              }
            }
            const linearMatch = equation.match(/([-\d]*)\*?x\s*([+-]\s*\d+)/)
            if (linearMatch) {
              const a = parseFloat(linearMatch[1].replace(/\s/g, '') || '1')
              const b = parseFloat(linearMatch[2].replace(/\s/g, '') || '0')
              return [-b / a]
            }
            return 'Cannot solve equation'
          } catch (e) {
            return 'Cannot solve equation'
          }
        },
        factor: (expression: string) => {
          try {
            const quadraticMatch = expression.match(/x\^2\s*([+-]\s*\d+)\s*x\s*([+-]\s*\d+)/)
            if (quadraticMatch) {
              const b = parseInt(quadraticMatch[1].replace(/\s/g, ''))
              const c = parseInt(quadraticMatch[2].replace(/\s/g, ''))
              for (let i = 1; i <= Math.abs(c); i++) {
                if (c % i === 0) {
                  const factor1 = i
                  const factor2 = c / i
                  if ((factor1 + factor2 === b) || (-factor1 - factor2 === b)) {
                    return `(x${factor1 > 0 ? '+' + factor1 : factor1})(x${factor2 > 0 ? '+' + factor2 : factor2})`
                  }
                  if ((factor1 - factor2 === b) || (-factor1 + factor2 === b)) {
                    return `(x${factor1 > 0 ? '+' + factor1 : factor1})(x${factor2 > 0 ? '-' + factor2 : factor2})`
                  }
                }
              }
            }
            const diffSquaresMatch = expression.match(/([a-zA-Z\d]+)\^2\s*-\s*([a-zA-Z\d]+)\^2/)
            if (diffSquaresMatch) {
              return `(${diffSquaresMatch[1]} + ${diffSquaresMatch[2]})(${diffSquaresMatch[1]} - ${diffSquaresMatch[2]})`
            }
            return expression
          } catch (e) {
            return expression
          }
        },
        expand: (expression: string) => {
          try {
            const squareMatch = expression.match(/\(\s*([a-zA-Z\d]+)\s*([+-]\s*[a-zA-Z\d]+)\s*\)\^2/)
            if (squareMatch) {
              const term1 = squareMatch[1]
              const term2 = squareMatch[2].replace(/\s/g, '')
              return `${term1}^2 ${term2.startsWith('+') ? '+' : ''} 2*${term1}*${term2.replace(/[+-]/, '')} ${term2.startsWith('+') ? '+' : ''} ${term2.replace(/[+-]/, '')}^2`
            }
            return expression
          } catch (e) {
            return expression
          }
        },
        simplify: (expression: string) => {
          try {
            const result = evaluate(expression)
            if (!isNaN(result) && isFinite(result)) {
              return result
            }
            return expression
          } catch (e) {
            return expression
          }
        },
        // Matrix operations
        matrix: matrix,
        multiply: multiply,
        add: add,
        subtract: subtract,
        divide: divide,
        det: (matrix: any) => {
          try {
            return evaluate(`det(${JSON.stringify(matrix)})`)
          } catch (e) {
            return 'Error calculating determinant'
          }
        },
        inv: (matrix: any) => {
          try {
            return evaluate(`inv(${JSON.stringify(matrix)})`)
          } catch (e) {
            return 'Error calculating inverse'
          }
        },
        transpose: (matrix: any) => {
          try {
            return evaluate(`transpose(${JSON.stringify(matrix)})`)
          } catch (e) {
            return 'Error calculating transpose'
          }
        }
      }

      try {
        const result = evaluate(processed, scope)
        
        if (typeof result === 'number' && !isNaN(result) && isFinite(result)) {
          return {
            result: format(result, { precision: 14 }),
            details: this.generateSolutionSteps(expression, processed, result)
          }
        } else if (result !== null && result !== undefined) {
          return {
            result: typeof result === 'object' ? JSON.stringify(result) : String(result),
            details: this.generateSolutionSteps(expression, processed, result)
          }
        } else {
          return {
            result: '0',
            details: this.generateSolutionSteps(expression, processed, 0)
          }
        }
      } catch (error) {
        console.error('Math evaluation error:', error)
        return {
          result: 'Error',
          error: error instanceof Error ? error.message : 'Invalid mathematical expression',
          details: `❌ Error: ${error instanceof Error ? error.message : 'Invalid expression'}`
        }
      }
    } catch (error) {
      console.error('Math evaluation error:', error)
      return {
        result: 'Error',
        error: error instanceof Error ? error.message : 'Invalid mathematical expression',
        details: `❌ Error: ${error instanceof Error ? error.message : 'Invalid expression'}`
      }
    }
  }

  // Matrix operations method for matrix dialog
  matrixOperations(operation: string, matrix1: any, matrix2?: any): CalculationResult {
    try {
      let result
      switch (operation) {
        case 'determinant':
          result = evaluate(`det(${JSON.stringify(matrix1)})`)
          break
        case 'inverse':
          result = evaluate(`inv(${JSON.stringify(matrix1)})`)
          break
        case 'transpose':
          result = evaluate(`transpose(${JSON.stringify(matrix1)})`)
          break
        case 'multiply':
          if (!matrix2) throw new Error('Second matrix required for multiplication')
          result = evaluate(`multiply(${JSON.stringify(matrix1)}, ${JSON.stringify(matrix2)})`)
          break
        case 'add':
          if (!matrix2) throw new Error('Second matrix required for addition')
          result = evaluate(`add(${JSON.stringify(matrix1)}, ${JSON.stringify(matrix2)})`)
          break
        case 'subtract':
          if (!matrix2) throw new Error('Second matrix required for subtraction')
          result = evaluate(`subtract(${JSON.stringify(matrix1)}, ${JSON.stringify(matrix2)})`)
          break
        default:
          throw new Error('Unknown matrix operation')
      }
      
      return {
        result: typeof result === 'object' ? JSON.stringify(result) : String(result),
        details: `Matrix ${operation} completed successfully`
      }
    } catch (error) {
      return {
        result: 'Error',
        error: error instanceof Error ? error.message : 'Matrix operation failed',
        details: `❌ Matrix ${operation} error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  // Statistics operations method for statistics dialog
  statistics(data: number[]): CalculationResult {
    try {
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Invalid data array for statistics')
      }

      const validData = data.filter(num => !isNaN(num) && isFinite(num))
      if (validData.length === 0) {
        throw new Error('No valid numeric data found')
      }

      const n = validData.length
      const sum = validData.reduce((acc, val) => acc + val, 0)
      const mean = sum / n
      
      // Sort for median calculation
      const sortedData = [...validData].sort((a, b) => a - b)
      const median = n % 2 === 0 
        ? (sortedData[n/2 - 1] + sortedData[n/2]) / 2 
        : sortedData[Math.floor(n/2)]
      
      // Calculate mode (most frequent value)
      const frequency: Record<number, number> = {}
      validData.forEach(val => {
        frequency[val] = (frequency[val] || 0) + 1
      })
      const maxFreq = Math.max(...Object.values(frequency))
      const modes = Object.keys(frequency)
        .filter(key => frequency[Number(key)] === maxFreq)
        .map(Number)
      
      // Calculate variance and standard deviation
      const variance = validData.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / n
      const stdDev = Math.sqrt(variance)
      
      // Calculate min, max, range
      const min = Math.min(...validData)
      const max = Math.max(...validData)
      const range = max - min

      const statsResult = {
        count: n,
        sum: sum,
        mean: mean,
        median: median,
        mode: modes.length === 1 ? modes[0] : modes,
        variance: variance,
        standardDeviation: stdDev,
        min: min,
        max: max,
        range: range,
        data: validData
      }

      return {
        result: JSON.stringify(statsResult),
        details: `Statistical analysis completed for ${n} data points`
      }
    } catch (error) {
      return {
        result: 'Error',
        error: error instanceof Error ? error.message : 'Statistics calculation failed',
        details: `❌ Statistics error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  // Enhanced calculus operations
  derivative(expression: string, variable: string = 'x'): CalculationResult {
    try {
      // Use mathjs derivative function
      const derivativeExpr = derivative(expression, variable)
      const result = simplify(derivativeExpr)
      
      return {
        result: result.toString(),
        details: `d/dx[${expression}] = ${result.toString()}`,
        steps: [
          `Original function: f(${variable}) = ${expression}`,
          `Apply derivative rules`,
          `Derivative: f'(${variable}) = ${result.toString()}`,
          `Simplified result: ${result.toString()}`
        ]
      }
    } catch (error) {
      return {
        result: 'Error',
        error: error instanceof Error ? error.message : 'Derivative calculation failed',
        details: `❌ Derivative error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  integral(expression: string, variable: string = 'x'): CalculationResult {
    try {
      // Simple numerical integration using trapezoidal rule
      const integrateNumerically = (expr: string, varName: string, a: number, b: number, n: number = 1000) => {
        const h = (b - a) / n
        let sum = 0
        
        for (let i = 0; i <= n; i++) {
          const x = a + i * h
          const value = evaluate(expr.replace(new RegExp(varName, 'g'), x.toString()))
          const weight = (i === 0 || i === n) ? 0.5 : 1
          sum += weight * value
        }
        
        return sum * h
      }
      
      // For demonstration, integrate from 0 to 1
      const result = integrateNumerically(expression, variable, 0, 1)
      
      return {
        result: result.toString() + ' + C',
        details: `∫${expression} d${variable} ≈ ${result.toString()} + C (numerical integration from 0 to 1)`,
        steps: [
          `Original function: f(${variable}) = ${expression}`,
          `Apply numerical integration (trapezoidal rule)`,
          `Integral: ∫f(${variable}) d${variable} ≈ ${result.toString()} + C`,
          `Note: This is a numerical approximation from 0 to 1`
        ]
      }
    } catch (error) {
      return {
        result: 'Error',
        error: error instanceof Error ? error.message : 'Integral calculation failed',
        details: `❌ Integral error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  limit(expression: string, variable: string, approach: number): CalculationResult {
    try {
      // Evaluate limit numerically
      const h = 0.0001
      const leftLimit = evaluate(expression.replace(new RegExp(variable, 'g'), `(${approach} - ${h})`))
      const rightLimit = evaluate(expression.replace(new RegExp(variable, 'g'), `(${approach} + ${h})`))
      
      if (Math.abs(leftLimit - rightLimit) < 0.001) {
        const limitValue = (leftLimit + rightLimit) / 2
        return {
          result: limitValue.toString(),
          details: `lim(${variable}→${approach}) ${expression} = ${limitValue}`,
          steps: [
            `Expression: ${expression}`,
            `Variable: ${variable} → ${approach}`,
            `Left-hand limit: ${leftLimit}`,
            `Right-hand limit: ${rightLimit}`,
            `Limit exists: ${limitValue}`
          ]
        }
      } else {
        return {
          result: 'Does not exist',
          details: `lim(${variable}→${approach}) ${expression} does not exist (left ≠ right)`,
          steps: [
            `Expression: ${expression}`,
            `Variable: ${variable} → ${approach}`,
            `Left-hand limit: ${leftLimit}`,
            `Right-hand limit: ${rightLimit}`,
            `Limit does not exist: left ≠ right`
          ]
        }
      }
    } catch (error) {
      return {
        result: 'Error',
        error: error instanceof Error ? error.message : 'Limit calculation failed',
        details: `❌ Limit error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  // Advanced equation solving
  solve(equation: string, variable: string = 'x'): CalculationResult {
    try {
      // Simple equation solving for linear and quadratic equations
      const solveEquation = (eq: string, varName: string) => {
        // Handle linear equations: ax + b = 0
        const linearMatch = eq.match(/([+-]?\d*\.?\d*)\s*\*?\s*([a-zA-Z]+)\s*([+-]\s*\d+\.?\d*)?\s*=\s*([+-]?\d+\.?\d*)/)
        if (linearMatch && linearMatch[2] === varName) {
          const a = parseFloat(linearMatch[1] || '1')
          const b = parseFloat((linearMatch[3] || '0').replace(/\s+/g, ''))
          const c = parseFloat(linearMatch[4])
          const solution = (c - b) / a
          return [solution.toString()]
        }
        
        // Handle quadratic equations: ax² + bx + c = 0
        const quadraticMatch = eq.match(/([+-]?\d*\.?\d*)\s*\*?\s*([a-zA-Z]+)\^2\s*([+-]\s*\d+\.?\d*\s*\*?\s*[a-zA-Z]+)?\s*([+-]\s*\d+\.?\d*)?\s*=\s*0/)
        if (quadraticMatch && quadraticMatch[2] === varName) {
          const a = parseFloat(quadraticMatch[1] || '1')
          const b = parseFloat((quadraticMatch[3] || '0').replace(/\s*\*?\s*[a-zA-Z]+/g, ''))
          const c = parseFloat((quadraticMatch[4] || '0').replace(/\s+/g, ''))
          
          const discriminant = b * b - 4 * a * c
          if (discriminant < 0) {
            const realPart = (-b / (2 * a)).toFixed(4)
            const imagPart = (Math.sqrt(-discriminant) / (2 * a)).toFixed(4)
            return [`${realPart} + ${imagPart}i`, `${realPart} - ${imagPart}i`]
          } else {
            const sqrtDisc = Math.sqrt(discriminant)
            const sol1 = (-b + sqrtDisc) / (2 * a)
            const sol2 = (-b - sqrtDisc) / (2 * a)
            return [sol1.toFixed(6), sol2.toFixed(6)]
          }
        }
        
        return ['Cannot solve - equation type not supported']
      }
      
      const solutions = solveEquation(equation, variable)
      const solutionStr = solutions.join(', ')
      
      return {
        result: solutionStr,
        details: `Solutions for ${variable}: ${solutionStr}`,
        steps: [
          `Equation: ${equation}`,
          `Analyze equation type`,
          `Apply solving method`,
          `Solutions for ${variable}: ${solutionStr}`
        ]
      }
    } catch (error) {
      return {
        result: 'Error',
        error: error instanceof Error ? error.message : 'Equation solving failed',
        details: `❌ Solve error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  // Advanced algebraic operations
  factor(expression: string): CalculationResult {
    try {
      // Simple factoring for common patterns
      const factorExpression = (expr: string) => {
        // Factor out common terms
        expr = expr.replace(/\s+/g, '')
        
        // Factor x² - a² = (x - a)(x + a)
        const diffOfSquares = expr.match(/([a-zA-Z]+)\^2\s*-\s*(\d+|[a-zA-Z]+)/)
        if (diffOfSquares) {
          return `(${diffOfSquares[1]} - ${diffOfSquares[2]})(${diffOfSquares[1]} + ${diffOfSquares[2]})`
        }
        
        // Factor common factors
        const commonFactor = expr.match(/(\d+)\s*\*\s*\(([^)]+)\)/)
        if (commonFactor) {
          return expr
        }
        
        return expr // Return as-is if no factoring pattern found
      }
      
      const factored = factorExpression(expression)
      
      return {
        result: factored,
        details: `Factorization: ${expression} = ${factored}`,
        steps: [
          `Original expression: ${expression}`,
          `Look for factoring patterns`,
          `Factorized form: ${factored}`
        ]
      }
    } catch (error) {
      return {
        result: 'Error',
        error: error instanceof Error ? error.message : 'Factorization failed',
        details: `❌ Factor error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  expand(expression: string): CalculationResult {
    try {
      // Simple expansion for common patterns
      const expandExpression = (expr: string) => {
        expr = expr.replace(/\s+/g, '')
        
        // Expand (a + b)² = a² + 2ab + b²
        const binomialSquare = expr.match(/\(([^)]+)\)\^2/)
        if (binomialSquare) {
          const inner = binomialSquare[1]
          const terms = inner.split(/[+-]/)
          if (terms.length === 2) {
            const a = terms[0].trim()
            const b = terms[1].trim()
            const sign = inner.includes('+') ? '+' : '-'
            return `${a}^2 ${sign} 2*${a}*${b} + ${b}^2`
          }
        }
        
        // Expand (a + b)(c + d)
        const binomialProduct = expr.match(/\(([^)]+)\)\s*\*\s*\(([^)]+)\)/)
        if (binomialProduct) {
          const first = binomialProduct[1].split(/[+-]/)
          const second = binomialProduct[2].split(/[+-]/)
          if (first.length === 2 && second.length === 2) {
            return `${first[0]}*${second[0]} + ${first[0]}*${second[1]} + ${first[1]}*${second[0]} + ${first[1]}*${second[1]}`
          }
        }
        
        return expr // Return as-is if no expansion pattern found
      }
      
      const expanded = expandExpression(expression)
      
      return {
        result: expanded,
        details: `Expansion: ${expression} = ${expanded}`,
        steps: [
          `Original expression: ${expression}`,
          `Apply expansion rules`,
          `Expanded form: ${expanded}`
        ]
      }
    } catch (error) {
      return {
        result: 'Error',
        error: error instanceof Error ? error.message : 'Expansion failed',
        details: `❌ Expand error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  simplify(expression: string): CalculationResult {
    try {
      const simplified = simplify(expression)
      return {
        result: simplified.toString(),
        details: `Simplification: ${expression} = ${simplified.toString()}`,
        steps: [
          `Original expression: ${expression}`,
          `Simplified form: ${simplified.toString()}`
        ]
      }
    } catch (error) {
      return {
        result: 'Error',
        error: error instanceof Error ? error.message : 'Simplification failed',
        details: `❌ Simplify error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }
  combination(n: number, k: number): CalculationResult {
    try {
      if (!Number.isInteger(n) || !Number.isInteger(k) || n < 0 || k < 0 || k > n) {
        throw new Error('Invalid combination parameters')
      }

      // Calculate n! / (k! * (n-k)!)
      const factorial = (num: number): number => {
        if (num < 0) return NaN
        if (num === 0 || num === 1) return 1
        let result = 1
        for (let i = 2; i <= num; i++) {
          result *= i
        }
        return result
      }

      const result = factorial(n) / (factorial(k) * factorial(n - k))

      return {
        result: result.toString(),
        details: `C(${n}, ${k}) = ${n}! / (${k}! * (${n}-${k})!) = ${result}`
      }
    } catch (error) {
      return {
        result: 'Error',
        error: error instanceof Error ? error.message : 'Combination calculation failed',
        details: `❌ Combination error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }
    }
  }

  // Permutations method for probability calculations
  permutation(n: number, k: number): CalculationResult {
    try {
      if (!Number.isInteger(n) || !Number.isInteger(k) || n < 0 || k < 0 || k > n) {
        throw new Error('Invalid permutation parameters')
      }

      // Calculate n! / (n-k)!
      const factorial = (num: number): number => {
        if (num < 0) return NaN
        if (num === 0 || num === 1) return 1
        let result = 1
        for (let i = 2; i <= num; i++) {
          result *= i
        }
        return result
      }

      const result = factorial(n) / factorial(n - k)

      return {
        result: result.toString(),
        details: `P(${n}, ${k}) = ${n}! / (${n}-${k})! = ${result}`
      }
    } catch (error) {
      return {
        result: 'Error',
        error: error instanceof Error ? error.message : 'Permutation calculation failed',
      details: `❌ Permutation error: ${error instanceof Error ? error.message : 'Unknown error'}`
      }}}}
// Export singleton instance
export const mathEngine = new MathEngine()






