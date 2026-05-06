/**
 * Validation Layer for Math Engine
 * Ensures all results are numeric, not symbolic
 * Fixes P&C and other combinatorics bugs
 */

export interface ValidationResult {
  isValid: boolean
  numericValue: number | null
  error?: string
  wasSymbolic: boolean
}

export class ValidationLayer {
  // Patterns that indicate symbolic output (BAD)
  private static SYMBOLIC_PATTERNS = [
    /nPr/i,
    /nCr/i,
    /P\(/i,
    /C\(/i,
    /factorial\(/i,
    /!/,
    /\b(n|r|k)\b/i, // Variables like n, r, k
    /[a-zA-Z]+\s*[=<>]/i, // Algebraic expressions
  ]

  // Patterns that indicate numeric output (GOOD)
  private static NUMERIC_PATTERNS = [
    /^-?\d+\.?\d*$/,
    /^-?\d+\.?\d*[eE][+-]?\d+$/, // Scientific notation
    /^-?Infinity$/,
    /^NaN$/,
  ]

  /**
   * Validates and converts result to numeric value
   * CRITICAL: This fixes the P&C bug by forcing numeric evaluation
   */
  static validateAndConvert(result: string | number): ValidationResult {
    // If already a number, validate it
    if (typeof result === 'number') {
      if (isNaN(result) || !isFinite(result)) {
        return {
          isValid: false,
          numericValue: null,
          error: 'Result is not a valid number',
          wasSymbolic: false,
        }
      }
      return {
        isValid: true,
        numericValue: result,
        wasSymbolic: false,
      }
    }

    const resultStr = String(result).trim()

    // Check if result contains symbolic patterns
    const containsSymbolic = this.SYMBOLIC_PATTERNS.some((pattern) =>
      pattern.test(resultStr)
    )

    if (containsSymbolic) {
      // Try to extract numeric value from symbolic expression
      const numericValue = this.extractNumericFromSymbolic(resultStr)
      
      if (numericValue !== null) {
        return {
          isValid: true,
          numericValue,
          wasSymbolic: true,
        }
      }

      return {
        isValid: false,
        numericValue: null,
        error: `Symbolic output detected: ${resultStr}. Expected numeric value.`,
        wasSymbolic: true,
      }
    }

    // Check if it's already numeric
    const numericMatch = resultStr.match(/^-?\d+\.?\d*([eE][+-]?\d+)?$/)
    if (numericMatch) {
      const numValue = parseFloat(resultStr)
      return {
        isValid: true,
        numericValue: numValue,
        wasSymbolic: false,
      }
    }

    // Try to parse as number
    const parsed = parseFloat(resultStr)
    if (!isNaN(parsed) && isFinite(parsed)) {
      return {
        isValid: true,
        numericValue: parsed,
        wasSymbolic: false,
      }
    }

    return {
      isValid: false,
      numericValue: null,
      error: `Cannot convert to numeric: ${resultStr}`,
      wasSymbolic: containsSymbolic,
    }
  }

  /**
   * Extracts numeric value from symbolic expressions
   * Handles cases like "P(10,3)" or "C(5,2)" by evaluating them
   */
  private static extractNumericFromSymbolic(expr: string): number | null {
    try {
      // Dynamic import to avoid circular dependencies
      const mathjs = require('mathjs')
      const { evaluate } = mathjs
      
      // Replace common symbolic patterns
      let processed = expr
        .replace(/P\((\d+),\s*(\d+)\)/gi, (_, n, r) => {
          return this.calculatePermutation(parseInt(n), parseInt(r))
        })
        .replace(/C\((\d+),\s*(\d+)\)/gi, (_, n, r) => {
          return this.calculateCombination(parseInt(n), parseInt(r))
        })
        .replace(/(\d+)!/g, (_, num) => {
          return this.calculateFactorial(parseInt(num))
        })

      const result = evaluate(processed)
      return typeof result === 'number' && isFinite(result) ? result : null
    } catch {
      return null
    }
  }

  /**
   * Calculate permutation using logarithmic approach for large numbers
   */
  private static calculatePermutation(n: number, r: number): string {
    if (n < 0 || r < 0 || n < r) {
      return '0'
    }

    // Use logarithmic factorial for large numbers to avoid overflow
    if (n > 170) {
      const logResult = this.logFactorial(n) - this.logFactorial(n - r)
      return `exp(${logResult})`
    }

    // Dynamic import
    const math = require('mathjs')
    const result = math.factorial(n) / math.factorial(n - r)
    return String(result)
  }

  /**
   * Calculate combination using logarithmic approach for large numbers
   */
  private static calculateCombination(n: number, r: number): string {
    if (n < 0 || r < 0 || n < r) {
      return '0'
    }

    // Use logarithmic factorial for large numbers
    if (n > 170) {
      const logResult =
        this.logFactorial(n) -
        this.logFactorial(r) -
        this.logFactorial(n - r)
      return `exp(${logResult})`
    }

    // Dynamic import
    const math = require('mathjs')
    const result =
      math.factorial(n) /
      (math.factorial(r) * math.factorial(n - r))
    return String(result)
  }

  /**
   * Calculate factorial using logarithmic approach for large numbers
   */
  private static calculateFactorial(n: number): string {
    if (n < 0) {
      return '0'
    }
    if (n === 0 || n === 1) {
      return '1'
    }

    // Use logarithmic factorial for large numbers
    if (n > 170) {
      const logResult = this.logFactorial(n)
      return `exp(${logResult})`
    }

    // Dynamic import
    const math = require('mathjs')
    return String(math.factorial(n))
  }

  /**
   * Logarithmic factorial using Stirling's approximation for large n
   */
  private static logFactorial(n: number): number {
    if (n <= 1) return 0

    // Stirling's approximation: ln(n!) ≈ n*ln(n) - n + 0.5*ln(2πn)
    if (n > 170) {
      return (
        n * Math.log(n) -
        n +
        0.5 * Math.log(2 * Math.PI * n) +
        1 / (12 * n) -
        1 / (360 * n * n * n)
      )
    }

    // For smaller numbers, calculate exact log factorial
    let logSum = 0
    for (let i = 2; i <= n; i++) {
      logSum += Math.log(i)
    }
    return logSum
  }

  /**
   * Validates that a result is a proper numeric value
   * Throws error if symbolic output is detected
   */
  static enforceNumeric(result: string | number): number {
    const validation = this.validateAndConvert(result)

    if (!validation.isValid || validation.numericValue === null) {
      throw new Error(
        validation.error ||
          'Result must be numeric, not symbolic. Validation failed.'
      )
    }

    return validation.numericValue
  }

  /**
   * Checks if result contains any symbolic patterns
   */
  static isSymbolic(result: string | number): boolean {
    const resultStr = String(result)
    return this.SYMBOLIC_PATTERNS.some((pattern) => pattern.test(resultStr))
  }
}
