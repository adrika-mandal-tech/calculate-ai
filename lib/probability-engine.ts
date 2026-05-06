/**
 * Probability & Statistics Engine
 * Handles combinatorics, probability distributions, and statistical calculations
 * Ensures all results are numeric, not symbolic
 */

import { ValidationLayer } from './validation-layer'
import { mathEngine } from './math-engine'

export interface ProbabilityResult {
  result: number
  formula: string
  steps: string[]
  error?: string
}

export class ProbabilityEngine {
  /**
   * Calculate probability of exactly k successes in n trials (Binomial)
   * P(X = k) = C(n, k) * p^k * (1-p)^(n-k)
   */
  binomialProbability(
    n: number,
    k: number,
    p: number
  ): ProbabilityResult {
    try {
      if (n < 0 || k < 0 || k > n) {
        throw new Error('Invalid parameters: n >= k >= 0 required')
      }
      if (p < 0 || p > 1) {
        throw new Error('Probability p must be between 0 and 1')
      }

      // Calculate using combination (already validated to be numeric)
      const combinationResult = mathEngine.combination(n, k)
      if (combinationResult.error) {
        throw new Error(combinationResult.error)
      }

      const C = parseFloat(combinationResult.result.toString())
      const pK = Math.pow(p, k)
      const qNK = Math.pow(1 - p, n - k)
      const result = C * pK * qNK

      const validated = ValidationLayer.enforceNumeric(result)

      return {
        result: validated,
        formula: `P(X = ${k}) = C(${n}, ${k}) × ${p}^${k} × (1-${p})^${n - k}`,
        steps: [
          `C(${n}, ${k}) = ${C}`,
          `p^k = ${p}^${k} = ${pK}`,
          `(1-p)^(n-k) = (1-${p})^${n - k} = ${qNK}`,
          `P(X = ${k}) = ${C} × ${pK} × ${qNK} = ${validated}`,
        ],
      }
    } catch (error: any) {
      return {
        result: 0,
        formula: '',
        steps: [],
        error: error.message || 'Binomial probability calculation failed',
      }
    }
  }

  /**
   * Calculate cumulative binomial probability
   * P(X <= k) = Σ(i=0 to k) C(n, i) * p^i * (1-p)^(n-i)
   */
  binomialCumulative(
    n: number,
    k: number,
    p: number
  ): ProbabilityResult {
    try {
      if (n < 0 || k < 0 || k > n) {
        throw new Error('Invalid parameters')
      }
      if (p < 0 || p > 1) {
        throw new Error('Probability p must be between 0 and 1')
      }

      let sum = 0
      const steps: string[] = []

      for (let i = 0; i <= k; i++) {
        const prob = this.binomialProbability(n, i, p)
        if (prob.error) {
          throw new Error(prob.error)
        }
        sum += prob.result
        steps.push(`P(X = ${i}) = ${prob.result}`)
      }

      const validated = ValidationLayer.enforceNumeric(sum)

      return {
        result: validated,
        formula: `P(X <= ${k}) = Σ(i=0 to ${k}) P(X = i)`,
        steps: [...steps, `P(X <= ${k}) = ${validated}`],
      }
    } catch (error: any) {
      return {
        result: 0,
        formula: '',
        steps: [],
        error: error.message || 'Cumulative binomial calculation failed',
      }
    }
  }

  /**
   * Calculate conditional probability
   * P(A|B) = P(A ∩ B) / P(B)
   */
  conditionalProbability(
    pAandB: number,
    pB: number
  ): ProbabilityResult {
    try {
      if (pB === 0) {
        throw new Error('P(B) cannot be zero for conditional probability')
      }
      if (pAandB < 0 || pB < 0 || pAandB > 1 || pB > 1) {
        throw new Error('Probabilities must be between 0 and 1')
      }
      if (pAandB > pB) {
        throw new Error('P(A ∩ B) cannot be greater than P(B)')
      }

      const result = pAandB / pB
      const validated = ValidationLayer.enforceNumeric(result)

      return {
        result: validated,
        formula: `P(A|B) = P(A ∩ B) / P(B) = ${pAandB} / ${pB}`,
        steps: [`P(A|B) = ${pAandB} / ${pB} = ${validated}`],
      }
    } catch (error: any) {
      return {
        result: 0,
        formula: '',
        steps: [],
        error: error.message || 'Conditional probability calculation failed',
      }
    }
  }

  /**
   * Calculate expected value E[X] = Σ x * P(x)
   */
  expectedValue(values: number[], probabilities: number[]): ProbabilityResult {
    try {
      if (values.length !== probabilities.length) {
        throw new Error('Values and probabilities arrays must have same length')
      }

      const probSum = probabilities.reduce((a, b) => a + b, 0)
      if (Math.abs(probSum - 1) > 0.0001) {
        throw new Error(
          `Probabilities must sum to 1, got ${probSum}`
        )
      }

      let expected = 0
      const steps: string[] = []

      for (let i = 0; i < values.length; i++) {
        const term = values[i] * probabilities[i]
        expected += term
        steps.push(`${values[i]} × ${probabilities[i]} = ${term}`)
      }

      const validated = ValidationLayer.enforceNumeric(expected)

      return {
        result: validated,
        formula: `E[X] = Σ x × P(x)`,
        steps: [...steps, `E[X] = ${validated}`],
      }
    } catch (error: any) {
      return {
        result: 0,
        formula: '',
        steps: [],
        error: error.message || 'Expected value calculation failed',
      }
    }
  }

  /**
   * Calculate variance Var(X) = E[X²] - (E[X])²
   */
  variance(values: number[], probabilities: number[]): ProbabilityResult {
    try {
      const expectedResult = this.expectedValue(values, probabilities)
      if (expectedResult.error) {
        throw new Error(expectedResult.error)
      }

      const E_X = expectedResult.result

      // Calculate E[X²]
      const valuesSquared = values.map((v) => v * v)
      const expectedSquaredResult = this.expectedValue(
        valuesSquared,
        probabilities
      )
      if (expectedSquaredResult.error) {
        throw new Error(expectedSquaredResult.error)
      }

      const E_X2 = expectedSquaredResult.result
      const variance = E_X2 - E_X * E_X

      const validated = ValidationLayer.enforceNumeric(variance)

      return {
        result: validated,
        formula: `Var(X) = E[X²] - (E[X])²`,
        steps: [
          `E[X] = ${E_X}`,
          `E[X²] = ${E_X2}`,
          `Var(X) = ${E_X2} - (${E_X})² = ${validated}`,
        ],
      }
    } catch (error: any) {
      return {
        result: 0,
        formula: '',
        steps: [],
        error: error.message || 'Variance calculation failed',
      }
    }
  }
}

export const probabilityEngine = new ProbabilityEngine()
